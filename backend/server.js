const http = require("http");
const fetch = require('node-fetch') // DELETE
const express = require('express')
const redis = require("redis");
const bodyParser = require("body-parser");
const axios = require("axios");

const cors = require('cors') // https://github.com/expressjs/cors

// var corsOptions = {
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }


const mongoose = require('mongoose')
const Battle = require('./models/Battle')
const Guild = require('./models/Guild')
const Crystal = require('./models/Crystal')
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
cleanEvent = require("./functions/cleanEvent");

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval( async() => { 
    let topPvP = {}
    const topPvPURI = [
        'https://gameinfo.albiononline.com/api/gameinfo/events/playerfame?range=week&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=week&limit=11&offset=0',
        // 'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=month&limit=11&offset=0',
        'https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topplayers?range=week&limit=11&offset=0',
        // 'https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topguilds?range=week&limit=11&offset=0'

    ]
    topPvPURI.forEach( async(url) => {
        let response = await axios.get(url, { timeout: 120000 })
        if(url === 'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=week&limit=11&offset=0') {
            topPvP['guildFame'] = response.data
        } else if (url === 'https://gameinfo.albiononline.com/api/gameinfo/events/playerfame?range=week&limit=11&offset=0') {
            topPvP['playerFame'] = response.data
        } else if (url === 'https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topplayers?range=week&limit=11&offset=0') {
            topPvP['crystalFame'] = response.data
        }
        // redis_client.setex(`top`, 7200, JSON.stringify(topPvP))

        if (url === 'https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=week&limit=11&offset=0') {

            const promises = topPvP['guildFame'].map( async guild => {
                const response = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/guilds/${guild.Id}/data`, { timeout: 120000 })
                return ({ ...guild, data: response.data})
            })

            await Promise.all(promises).then(guilds => {
                topPvP['guildFame'] = guilds
                redis_client.setex(`top`, 7200, JSON.stringify(topPvP))
            })
            .catch(err => console.log('fetch error'))
        }
        
    })
}, 1200000 ); // 20m / 1h : 3600000

let battles = null
let fetching = false
// let lastFecthTime = null
const offset = [0, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550] //, 50 , 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950

async function deathPlayer (battle) {
    // console.log('launch playerdead', battle.id, player.id)
        await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battle.id}?offset=0&limit=51`)
        .then( async response => {
            const eventdeath = response.data 
            // console.log(eventdeath)
            // console.log('fetched', eventdeath[0]["KillArea"]) 

                if (eventdeath[0]["KillArea"] == "CRYSTAL_LEAGUE") {
                    console.log('crystal found')
                    const crystalInDB = await Crystal.find({ battleID: battle.id }).limit(1)
                    if(!crystalInDB.length) {

                        const crystalEmptyInDB = await Crystal.find({ battleID: 0 }).limit(100)

                        let playersBattleId = Object.keys(battle.players)
                        console.log(playersBattleId.length)

                        let crystalFound = crystalEmptyInDB.find(crystal => {
                        //     let playerCount = 0
                        //     console.log(playersCrystalId)
                        //     playersBattleId.forEach( player => {
                        //         if(playersCrystalId.includes(player)) playerCount = playerCount +1
                        //     })
                        //     return playerCount > 7 ? true : false
                            let playersCrystalId = crystal.players.map(player => player.id)

                            let playerCompare = {};

                            playersBattleId.forEach(i => playerCompare[i] = false);
                            // console.log(playerCompare)
                            playersCrystalId.forEach(i => playerCompare[i] === false && (playerCompare[i] = true));
                            let match = Object.keys(playerCompare).filter(k => playerCompare[k] );
                            console.log(match.length)
                            return match.length

                        })

                        // console.log(crystalFound)
                        if (crystalFound) {
                            // crystalFound.battleID = battle.BattleId
                            // crystalFound.battleFame = battle.totalFame
                            console.log('crystal fetch', battle.id)
                            // let eventCleaned = eventdeath.map( ev => cleanEvent.cleanEvents(ev))

                            await Crystal.updateOne({ matchID: crystalFound.matchID }, {
                                battleID: battle.id,
                                battleFame : battle.totalFame,
                                events : eventdeath
                            })
                            .catch(err => console.log('error fail'))
                            console.log('update crystal', battle.id)
                        }
                    }
                }

            //     } else if (e.BattleId === battle.id) {
            //         battle = functions.battleEventDeathTreatment(battle, player, e)
            //         battle.succeedFetch += parseInt(player.deaths) // can maybe double on setinterval no2
            //         await Battle.updateOne({ battleID: battle.id }, {
            //             battleData: battle
            //         })
            //     }
            // })
            // // > in case we re launch playerDead from 2nd setInterval
            // if (battle.succeedFetch === battle.totalKills || battle.succeedFetch > battle.totalKills) {
            //     battle.fullEventDeath = true
            //     delete battle.succeedFetch
            //     delete battle.failedFetch
            //     await Battle.updateOne({ battleID: battle.id }, {
            //         battleData: battle
            //     })
            // }
            
        })
        .catch(function (error) {
            console.log('error fetch')
        })
        

}
// setInterval( async() => { 
//     let checkBattle = await Battle.find({'battleTotalPlayers' : { $gt: 19 }}).sort({battleID:-1}).limit(100)
//     // console.log('checkbattle length', checkBattle.length)
//     checkBattle = checkBattle.filter( battle => !battle.battleData[0].fullEventDeath)
//     // console.log('checkbattle length after fiilter', checkBattle.length)
//     checkBattle.forEach( battleDB => {
//         // console.log(battleDB.battleID)
//         const battle = battleDB.battleData[0]
//         for (const player in battle.players) {
//             // console.log(battle.players[player].deathFame.length, battle.players[player].deaths)
//             if (battle.players[player].deathFame.length < battle.players[player].deaths) { 
//                 deathPlayer (battle, battle.players[player]) 
//             }
//         }
//     })
// }, 30000);
setInterval( async() => { 
    // lastFecthTime = battles ? Math.abs(new Date() - new Date(battles.headers.date)) : null
    // let minutes = lastFecthTime ? Math.floor((lastFecthTime/1000)/60) : null

    // console.log('minutes -----------', minutes)
    // console.log('fetching---', fetching)

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
            console.log('done data fetch', value)

            let battlesData = battles.data;

            battlesData.forEach( async (battle) => {

                const battleInDB = await Battle.find({ battleID : battle.id}).limit(1)
                if (!battleInDB.length) {
                    // console.log('battle saved')
                    // battle.fullEventDeath = false
                    battle = functions.battleTreatment(battle)

                    try {
                        await new Battle({
                            battleID: battle.id,
                            battleTotalPlayers: Object.keys(battle.players).length,
                            battleEndDate : battle.timeout,
                            battleData : battle
                        })
                        .save()

                    } catch {
                        console.log('error battle registered')
                    }
                    
                    // .then( battle => console.log('battle registered', battle.battleData[0].id))

                    functions.registerNewGuild(battle.guilds, guildsIDInDB)
                    deathPlayer(battle)
                }
            })

            fetchDone += 1
            if (fetchDone === offset.length) {
                    fetching = false
                }
        } catch (err){
            fetching = false
        }
    })
}
}, 40000);

app.get('/topFame', cors(), (req, res) => { 
    redis_client.get('top', (err, response) => {
        if (err)res.status(404).send({ success: false, message: err.message });
        res.send(response)
    })
})
app.get('/crystalLeague', cors(), (req, res) => { 
    axios.get('https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague?limit=51&offset=0')
        .then( response => {
            response.data.forEach( async (battle) => {
                try {
                    let crystalKills = Object.values(battle.team1Results).reduce((t, {Kills}) => t + Kills, 0)
                    crystalKills += Object.values(battle.team2Results).reduce((t, {Kills}) => t + Kills, 0)

                    let crystalStats = new Crystal({
                        matchID: battle.MatchId,
                        totalKills: crystalKills,
                        level: battle.crystalLeagueLevel,
                        startTime : battle.startTime,
                        team1Tickets : battle.team1Tickets,
                        team2Tickets : battle.team2Tickets,
                        players: functions.crystalPlayersArray(battle.team1Results, battle.team2Results),
                        team2Timeline: battle.team2Timeline,
                        team1Timeline: battle.team1Timeline,
                    })
                    await crystalStats.save()
                } catch (err){
                    // console.log('eeror crystal save', err)
                }
            })
            res.send(response.data)
        })
        .catch(err => console.log('oops', err))
})
app.get('/guilds', cors(), (req, res) => { 
    Guild.find( {}, (err, guilds) => {
        if (!err) {
            res.json(guilds)
        }
    })
    // redis_client.get('', (err, response) => {
    //     if (err)res.status(404).send({ success: false, message: err.message });
    //     res.send(response)
    // })
})

app.use('/battles/:offset/:guildName', middlewares.guildIdMDW)
// app.use('/battles/:offset/:guildName', middlewares.allianceMDW)
// app.use('/battles/:offset/:guildName', middlewares.playerMDW)

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
    if (req.data) {
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

app.use('/attendance/:guildName', middlewares.guildIdMDW)
app.use('/attendance/:guildName', middlewares.battlesMDW) // id Guilde + totalBattle > minimumplayer + date ?battlesAttendanceZergSize
app.use('/attendance/:guildName', middlewares.battlesAttendanceZergSize)
app.use('/attendance/:guildName', middlewares.battlesAttendanceZergPlayers)
// Ajouter mdw qui tri le nombre de joueur de la guilde
app.get('/attendance/:guildName', cors(), (req, res) => {
    if (req.data) {
        res.send(req.data)
    } else {
        res.status(404).send({ success: false, message: error.message });
    }
});

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