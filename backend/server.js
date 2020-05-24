const http = require("http");
const fetch = require('node-fetch') // DELETE
const express = require('express')
const redis = require("redis");
const bodyParser = require("body-parser");
const axios = require("axios");

const cors = require('cors') // https://github.com/expressjs/cors

//setup port constants
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;

//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

//configure express server
const app = express();

middlewares = require("./middlewares");
functions = require("./functions");

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* const dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval( async() => { 
    let topPvPArray = []
    const topPvP = [
        'https://gameinfo.albiononline.com/api/gameinfo/events/playerfame?range=week&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=week&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=month&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topplayers?range=week&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topguilds?range=week&limit=11&offset=0'

    ]
    topPvP.forEach( async(top) => {
        console.log('fetch', top)
        let response = await axios.get(top, { timeout: 120000 })

        topPvPArray.push(response.data)
        console.log(topPvPArray)
        redis_client.setex(`top`, 1800, JSON.stringify(battlesData)); // 30min

    })
    // battles = await axios.get(url, { timeout: 120000 })
}, 10000 ); */

let battles = null
let fetching = false
let lastFecthTime = null
const offset = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500] // 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950

async function deathPlayer (battle, player) {
        try {
            await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/players/${player.id}/deaths`)
            .then(response => {
                const eventdeath = response.data // RECUPERER QUE L EVENT DEATH UTILE VU QUE LE FOR EACH EST DANS LE BACK
                eventdeath.forEach(eventDeath => {
                    if (eventDeath.BattleId === battle.id) {
                        battle.players[player.id].eventDeath = eventDeath
                        battle.refreshStats.push(player.id)

                        if (battle.totalKills === battle.refreshStats.length) {
                            battle.fullEventDeath = true
                            redis_client.setex(battle.id, 604800, JSON.stringify(battle));
                        }
                    } 
                })
            })
        } catch {
            
        }    
}

setInterval( async() => { 
    lastFecthTime = battles ? Math.abs(new Date() - new Date(battles.headers.date)) : null
    let minutes = lastFecthTime ? Math.floor((lastFecthTime/1000)/60) : null

    console.log('minutes -----------', minutes)
    console.log('fetching---', fetching)

    if ((!fetching)) { // minutes === null && !fetching) || (minutes >= 1 && 
        let fetchDone = 0
        fetching = true

        let guilds = {}
        redis_client.get('guilds', function(err, reply) {
            guilds = reply ? JSON.parse(reply) : {}
        });

        let battlesTemp = []
        redis_client.get('battles', (err, data) => {
            if (err) {
                res.status(500).send(err);
            }
            if (data) {
                battlesTemp = JSON.parse(data)
            }
        })

        offset.forEach( async (value) => {
        const url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${value}`
        try {
            battles = await axios.get(url, { timeout: 120000 })
            console.log('done data fetch', value)

            let battlesData = battles.data;

            battlesData.forEach( async (battle) => {
                redis_client.get( battle.id, (err, data) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    if (data === null) {
                        battle.fullEventDeath = false
                        battle.refreshStats = []
                        redis_client.setex(battle.id, 259200, JSON.stringify(battle)); // 3j
                        // EXCECUTE DEATH FETCH FONCTION HERE
                        for (const player in battle.players) {
                            if (battle.players[player].deaths > 0 && battle.refreshStats.includes(player)) { // NOT USEFULL, seulement la requete ca devrait aller
                                battle.refreshStats.push(player)
                            } else if (battle.players[player].deaths > 0) {
                                deathPlayer (battle, battle.players[player]) 
                            }
                        }
                        // console.log('killboard cache set', battle.id)
                        battlesTemp.unshift(battle)
                        redis_client.setex(`battles`, 7200, JSON.stringify(battlesTemp)); // 2h
                        console.log('battlelength after', battlesTemp.length)
                        
                        for (const guild in battle.guilds) {
                            if (!(guild in guilds)) {
                                console.log('need to set guild', guild)
                                guildValue = battle.guilds[guild]
                                guilds[guild] = guildValue.name
                                redis_client.setex('guilds', 259200, JSON.stringify(guilds)); // 3j
                            } 
                        }
                    }
                })
            })
            fetchDone += 1
            if (fetchDone === offset.length) {
                    fetching = false
                }
        } catch (err){
            fetching = false
            // redis_client.setex('guilds', 259200, JSON.stringify(guilds)); // 3j

        }
  })
}
}, 20000);

app.use('/battles/:offset', middlewares.battlesRedisMDW)

app.use('/battles/:offset/:guildName', middlewares.guildIdMDW)
app.use('/battles/:offset/:guildName', middlewares.battlesGuildMDW)

app.use('/battles/:offset', middlewares.battlesMinPlayers)
app.use('/battles/:offset', middlewares.battlesSortMDW)
app.use('/battles/:offset', middlewares.battlesOffsetMDW)

app.get('/battles/:offset', cors(), (req, res) => {
    if (req.data) {
        res.send(req.data)
    } else {
        let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
        fetch(url, { timeout: 60000 })
            .then((res) => res.json())
            .then((battles) => {
                res.send(battles)
            })
            .catch((error) => {
                res.status(404).send({ success: false, message: error.message });
            });
    }
});


app.get('/battles/:offset/:guildName', cors(), async (req, res) => {
    if (req.data && req.guildID) {
        // console.log('DATA OR GUILD ID')
        res.send(req.data)
    } else {
        console.log('NO DATA OR NO GUILD ID')
        console.log('guildname', req.params.guildName)
        console.log('req.guildID', JSON.stringify(req.guildID))
        console.log('offset', req.params.offset)
        guildIDReq = req.guildID
        if(req.guildID) {
            // console.log('GUILD ID FOUND')
            // console.log("guildId", req.guildID)
            let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&guildId=${req.guildID}&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
            fetch(url, { timeout: 10000 })
                .then((res) => res.json())
                .then((battles) => {
                    res.send(battles)
                })
                .catch((error) => {
                    res.status(404).send({ success: false, message: error.message });
                });

        } else  {
            // console.log('no guild id found')
            fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.guildName}`, { timeout: 15000 })
            .then((res) => res.json())
            .then( json => {
                let guildId = json.guilds[0].Id
                // console.log("guildId", guildId)
                let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&guildId=${guildId}&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
                fetch(url, { timeout: 10000 })
                    .then((res) => res.json())
                    .then((battles) => {
                        res.send(battles)
                    })
                    .catch((error) => {
                        res.status(404).send({ success: false, message: error.message });
                    });
                })
            .catch((error) => {
                res.status(404).send({ success: false, message: error.message });
            });      
        }

    }
})

app.use('/killboard/:id', middlewares.killboardRedisMDW)
app.get('/killboard/:id', cors(), (req, res) => {

    if (req.data) {        
        const battle = functions.battleTreatment(req.data)
        res.send(battle)
    } else {
      fetch(`https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`, { timeout: 15000 })
        .then((res) => res.json())
        .then( battle => {
            functions.battleTreatment(battle)
            res.send(battle)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
    }
})
app.get('/player/:id', cors(), (req, res) => { // RECUP L'ID DE LA BATTLE POUR FAIRE LE TRI DANS LE BACK
    let url = `https://gameinfo.albiononline.com/api/gameinfo/players/${req.params.id}/deaths`;
    fetch(url, { timeout: 30000 })
        .then((res) => res.json())
        .then((json) => {
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
})


app.listen(port);