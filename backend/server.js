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
const offset = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300] 

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

    // console.log('minutes -----------', minutes)
    console.log('fetching---', fetching)

    if ((minutes === null && !fetching) || (minutes >= 1 && !fetching)) {
      let fetchDone = 0
      fetching = true

      let guilds = {}
      redis_client.get('guilds', function(err, reply) {
        // console.log('guild:', reply);
        guilds = reply ? JSON.parse(reply) : {}
        });

      offset.forEach( async (value) => {
        let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${value}`
        try {
            battles = await axios.get(url, { timeout: 120000 })
            const battlesData = battles.data;

            redis_client.setex(`battles${value}`, 3600, JSON.stringify(battlesData)); // 1h
            fetchDone += 1
            console.log('cache set interval', value)

            battlesData.forEach( async (battle) => {
                redis_client.get( battle.id, (err, data) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    if (data === null) {
                        battle.fullEventDeath = false
                        battle.refreshStats = []
                        redis_client.setex(battle.id, 259200, JSON.stringify(battle)); // 3j
                        console.log('killboard cache set', battle.id)

                        for (const guild in battle.guilds) {
                            if (!(guild in guilds)) {
                                console.log('need to set guild', guild)
                                guildValue = battle.guilds[guild]
                                guilds[guild] = guildValue.name
                                redis_client.setex(guild, 259200, JSON.stringify([])); // 3j

                            } 
                            console.log('guild', guild)
                            redis_client.get(guild, function(err, reply) {
                                if (reply) {
                                    console.log(typeof(reply), guild)
                                    console.log('guildBattle REPLIED')
                                    // console.log('json parse :', JSON.parse(reply))
                                    guildBattle = JSON.parse(reply)
                                    console.log(guildBattle.length, guild)
                                    console.log('--------------------')
                                    guildBattle.unshift(battle)
                                    redis_client.setex(guild, 259200, JSON.stringify(guildBattle)); // 3

                                }
            
                            });
                            // console.log(guild, guildBattle)
                        }

                        // EXCECUTE DEATH FETCH FONCTION HERE
                        for (const player in battle.players) {
                            if (battle.players[player].deaths > 0 && battle.refreshStats.includes(player)) { // NOT USEFULL, seulement la requete ca devrait aller
                                battle.refreshStats.push(player)
                            } else if (battle.players[player].deaths > 0) {
                                deathPlayer (battle, battle.players[player]) 
                        }
                    }
                }
                });
            })
            if (fetchDone === offset.length) {
                fetching = false
                redis_client.setex('guilds', 259200, JSON.stringify(guilds)); // 3j

            }
        } catch {
            fetching = false
            redis_client.setex('guilds', 259200, JSON.stringify(guilds)); // 3j

        }
      })
  }
}, 10000);

app.use('/battles/:offset', middlewares.battlesRedisMDW)
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
app.use('/battles/:offset/:guildName', (req, res, next) => {
    redis_client.get(`guilds`, (err, data) => {
        if (err) {
        res.status(500).send(err);
        }
        if (data != null) {
            console.log(req.params)
            console.log('cache found', req.params.guildName)
            guilds = JSON.parse(data)

            req.guildID = Object.keys(guilds).find(key => guilds[key].toLowerCase() === req.params.guildName.toLowerCase());
            console.log(req.guildID)
        }
        next()
    })
})
app.use('/battles/:offset/:guildName', (req, res, next) => {
    console.log('guildname mdw 2 :', req.guildID)
    redis_client.get(`${req.guildID}`, (err, data) => {
        if (err) {
        res.status(500).send(err);
        }
        if (data != null) {
            req.guildBattle = JSON.parse(data)
            console.log('data guildname :', req.guildBattle.length)
        }
        next()
    })
})
app.get('/battles/:offset/:guildName', cors(), (req, res) => {
    if (req.guildBattle && req.guildBattle.length > 0) {
        res.send(req.guildBattle)
    } else {
        fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.guildName}`, { timeout: 15000 })
        .then((res) => res.json())
        .then( json => {
            let guildId = json.guilds[0].Id
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
})
// app.get('/battles/:offset/player/:playerName', cors(), (req, res) => {
//     // console.log('player', req.params.playerName)
//     fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.playerName}`, { timeout: 15000 })
//     .then((res) => res.json())
//     .then( json => {
//         // console.log(json)
//         let playerName = json.players[0].Id
//         // console.log(playerName)
//         let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&playerId=${playerName}&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
//         fetch(url, { timeout: 15000 })
//             .then((res) => res.json())
//             .then((battles) => {
//                 res.send(battles)
//             })
//             .catch((error) => {
//                 res.status(404).send({ success: false, message: error.message });
//             });
//         })
//     .catch((error) => {
//         res.status(404).send({ success: false, message: error.message });
//     });
// })
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