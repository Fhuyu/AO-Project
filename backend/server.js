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
const offset = [0, 50 , 100, 150, 200, 250, 300, 350, 400, 450, 500] //, 50 , 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950

async function deathPlayer (battle, player) {
    try {
        await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/players/${player.id}/deaths`)
        .then(response => {
            const eventdeath = response.data // RECUPERER QUE L EVENT DEATH UTILE VU QUE LE FOR EACH EST DANS LE BACK
            playerEventDeath = []
            eventdeath.forEach(async(eventDeath) => {
                if (eventDeath.BattleId === battle.id) {
                    playerEventDeath.push(eventDeath) // In case someone died several times - to calc total deathfame
                    battle.refreshStats.push(player.id)
                    battle.KillArea = eventDeath.KillArea

                     // ------- VICTIM ITEM - IP - DEATHFAME
                    battle.players[player.id].weapon = eventDeath.Victim.Equipment.MainHand && eventDeath.Victim.Equipment.MainHand.Type ? `${eventDeath.Victim.Equipment.MainHand.Type}?quality=${eventDeath.Victim.Equipment.MainHand.Quality}` : ''
                    battle.players[player.id].mount = eventDeath.Victim.Equipment.Mount && eventDeath.Victim.Equipment.Mount.Type ?`${eventDeath.Victim.Equipment.Mount.Type}?quality=${eventDeath.Victim.Equipment.Mount.Quality}` : ''
                    battle.players[player.id].itempower = eventDeath.Victim.AverageItemPower.toFixed(0)
                    battle.players[player.id].deathFame.push(eventDeath.Victim.DeathFame)
                    
                    // ------- KILLER ITEM - IP - DEATHFAME
                    battle.players[eventDeath.Killer.Id].weapon = eventDeath.Killer.Equipment.MainHand && eventDeath.Killer.Equipment.MainHand.Type ? `${eventDeath.Killer.Equipment.MainHand.Type}?quality=${eventDeath.Killer.Equipment.MainHand.Quality}` : ''
                    battle.players[eventDeath.Killer.Id].mount = eventDeath.Killer.Equipment.Mount && eventDeath.Killer.Equipment.Mount.Type ? `${eventDeath.Killer.Equipment.Mount.Type}?quality=${eventDeath.Killer.Equipment.Mount.Quality}` : ''
                    battle.players[eventDeath.Killer.Id].itempower = eventDeath.Killer.AverageItemPower.toFixed(0)

                    // ------- PARTICIPANT WEAPON / IP / DMG / HEAL / ASSIST
                    eventDeath.Participants.forEach( participant => {
                        // console.log(battle.players[participant.Id])
                        if (battle.players[participant.Id] && !battle.players[participant.Id].weapon) {
                            battle.players[participant.Id].weapon = participant.Equipment.MainHand && participant.Equipment.MainHand.Type ? `${participant.Equipment.MainHand.Type}?quality=${participant.Equipment.MainHand.Quality}` : ''
                            battle.players[participant.Id].mount = participant.Equipment.Mount && participant.Equipment.Mount.Type ? `${participant.Equipment.Mount.Type}?quality=${participant.Equipment.Mount.Quality}` : ''
                            battle.players[participant.Id].assistance += 1
                            battle.players[participant.Id].damageDone.push(participant.DamageDone)
                            battle.players[participant.Id].healingDone.push(participant.SupportHealingDone)
                            battle.players[participant.Id].itempower = participant.AverageItemPower.toFixed(0)
                        }
                        
                    })
                    eventDeath.GroupMembers.forEach( member => {
                        battle.players[member.Id].weapon = member.Equipment.MainHand && member.Equipment.MainHand.Type ? `${member.Equipment.MainHand.Type}?quality=${member.Equipment.MainHand.Quality}` : ''
                    }) 
                }

                if (battle.totalKills === battle.refreshStats.length) {
                    battle.fullEventDeath = true
                    await Battle.updateOne({ battleID: battle.id }, {
                        battleData: battle
                    });
                }
            })
        })
    } catch {
        
    }    
}

setInterval( async() => { 
    lastFecthTime = battles ? Math.abs(new Date() - new Date(battles.headers.date)) : null
    // let minutes = lastFecthTime ? Math.floor((lastFecthTime/1000)/60) : null

    // console.log('minutes -----------', minutes)
    // console.log('fetching---', fetching)

    if ((!fetching)) { // minutes === null && !fetching) || (minutes >= 1 && 
        let fetchDone = 0
        fetching = true

        // ----------- TO OPTIMIZE
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
                    battle.fullEventDeath = false
                    battle.refreshStats = []
                    battle = functions.battleTreatment(battle)

                    await new Battle({
                        battleID: battle.id,
                        battleStartTime: battle.startTime,
                        battleTotalPlayers: Object.keys(battle.players).length,
                        battleData : battle
                    })
                    .save()
                    //.then( battle => console.log('battle registered', battle.battleData[0].id))

                    for (const currentGuildID in battle.guilds) {
                        // Not with find, because if I push the result of newGuild in guildsInDB, it might have an error cause another battle had the same guildID not in array
                        // let guildFound = guildsInDB.find(guild => guild.guildID === currentGuildID)
                        let guildFound = guildsIDInDB.includes(currentGuildID)
                        if (!guildFound) {
                            guildsIDInDB.push(currentGuildID)
                            // console.log('need to set guild', currentGuildID)
                            const newGuild = await new Guild({
                                guildID: currentGuildID,
                                guildName: battle.guilds[currentGuildID].name.toUpperCase(),
                            }).save()
                        }
                    }
                    // EVENTDEATH BATTLE-ID
                    for (const player in battle.players) {
                        if (battle.players[player].deaths > 0 && battle.refreshStats.includes(player)) {
                            battle.refreshStats.push(player)
                        } else if (battle.players[player].deaths > 0) {
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
}, 10000);

// app.post('/updateBattle', function(req, res) {
//     console.log(req.body)
//     const battleData = req.body.battleData
// })
app.use('/battles/:offset/:guildName', middlewares.guildIdMDW)

app.use('/battles/:offset', middlewares.battlesRedisMDW)

// app.use('/battles/:offset/:guildName', middlewares.battlesRedisMDW)

// app.use('/battles/:offset/:guildName', middlewares.battlesGuildMDW)

// app.use('/battles/:offset', middlewares.battlesMinPlayers)
// app.use('/battles/:offset', middlewares.battlesSortMDW) // Cache here ?
app.use('/battles/:offset', middlewares.battlesOffsetMDW)

app.get('/battles/:offset', cors(), (req, res) => {
    if (req.data) {
        res.send(req.data)
    } else {
        console.log('fetching')
        console.log("offset", req.params.offset)
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