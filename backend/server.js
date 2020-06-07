const http = require("http");
const fetch = require('node-fetch') // DELETE
const express = require('express')
const redis = require("redis");
const bodyParser = require("body-parser");
const axios = require("axios");

const cors = require('cors') // https://github.com/expressjs/cors


const mongoose = require('mongoose')
const Battle = require('./models/Battle')
const Guild = require('./models/Guild')
const url = 'mongodb://127.0.0.1:27017/hhr'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) // useFind... is to make findOneAndUpdate work without warning

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

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
const offset = [0, 50 , 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650] //, 50 , 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950

async function deathPlayer (battle, player) {
    try {
        await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/players/${player.id}/deaths`)
        .then(async response => {
            const eventdeath = response.data 
            playerEventDeath = []
            eventdeath.forEach((eventDeath) => {
                if (eventDeath.BattleId === battle.id) {
                    playerEventDeath.push(eventDeath) // In case someone died several times - to calc total deathfame
                    battle = functions.battleEventDeathTreatment(battle, player, eventDeath)
                }
            })
            battle.succeedFetch += parseInt(player.deaths)
            battle.fullEventDeath = true
            await Battle.updateOne({ battleID: battle.id }, {
                battleData: battle
            });

        })
    } catch {  
        battle.failedFetch += parseInt(player.deaths)
    }    
}

setInterval( async() => { 
    lastFecthTime = battles ? Math.abs(new Date() - new Date(battles.headers.date)) : null
    // let minutes = lastFecthTime ? Math.floor((lastFecthTime/1000)/60) : null

    // console.log('minutes -----------', minutes)
    console.log('fetching---', fetching)

    if ((!fetching)) { // minutes === null && !fetching) || (minutes >= 1 && 
        let fetchDone = 0
        fetching = true

        // ----------- TO OPTIMIZE with aggregrate ?
        const guildsInDB = await Guild.find()
        let guildsIDInDB = []
        guildsInDB.forEach( guild => guildsIDInDB.push(guild.guildID))


        offset.forEach( async (value) => {
        const url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${value}`
        try {
            battles = await axios.get(url, { timeout: 120000 })
            // console.log('done data fetch', value)

            let battlesData = battles.data;

            battlesData.forEach( async (battle) => {
                const battleInDB = await Battle.find({ battleID : battle.id}).limit(1)
                if (!battleInDB.length) {
                    // battle.fullEventDeath = false
                    battle = functions.battleTreatment(battle)

                    await new Battle({
                        battleID: battle.id,
                        battleTotalPlayers: Object.keys(battle.players).length,
                        battleData : battle
                    })
                    .save()
                    .then( battle => console.log('battle registered', battle.battleData[0].id))

                    functions.registerNewGuild(battle.guilds, guildsIDInDB)

                    // EVENTDEATH BATTLE-ID
                    for (const player in battle.players) {
                        if (battle.players[player].deaths > 0) {
                            deathPlayer (battle, battle.players[player]) 
                        }
                    }
                }
                        
            })
            fetchDone += 1
            if (fetchDone === offset.length) {
                    fetching = false
                }
        } catch (err){
            fetching = false
            // redis_client.set('guilds', JSON.stringify(guilds));
            // redis_client.set(`battles`, JSON.stringify(battlesTemp));
        }
    })
}
}, 20000);

// app.post('/updateBattle', function(req, res) {
//     console.log(req.body)
//     const battleData = req.body.battleData
// })

app.use('/battles/:offset/:guildName', middlewares.guildIdMDW)
app.use('/battles/:offset', middlewares.battlesMDW)
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
        res.send(req.data)
    } else {
        guildIDReq = req.guildID
        if(req.guildID) {
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

    }
})

app.use('/killboard/:id', middlewares.killboardMDW)
app.get('/killboard/:id', cors(), (req, res) => {

    if (req.data) {        
        res.send(req.data)
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