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

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let battles = null
let fetching = false
let lastFecthTime = null
let offset = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950] //, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950

setInterval( async() => { 
    console.log("Hello"); 

    lastFecthTime = battles ? Math.abs(new Date() - new Date(battles.headers.date)) : null
    let minutes = lastFecthTime ? Math.floor((lastFecthTime/1000)/60) : null

    console.log('minutes -----------', minutes)
    console.log('fetching---', fetching)

    if ((minutes === null && !fetching) || (minutes >= 1 && !fetching)) {
      let fetchDone = 0
      fetching = true

      offset.forEach( async (value) => {
        console.log(value)
        let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${value}`
        try {
            battles = await axios.get(url, { timeout: 120000 })
            console.log('fetched')
            const starShipInfoData = battles.data;

            //add data to Redis
            redis_client.setex(`battles${value}`, 1800, JSON.stringify(starShipInfoData)); // 30m
            fetchDone += 1
            console.log('cache set interval', value)
            console.log('fetchdone ------', fetchDone)
            if (fetchDone === offset.length) {
                fetching = false
            }
        } catch {
            console.log('ERROR-----------------------')
            // fetchDone += 1
            fetching = false
        }
      })
    
  } else {
    console.log('skip')
  }
}, 10000);

  app.use('/battles/:offset', function (req, res, next) {
    // console.log('Request Type:', req.method)
    redis_client.get(`battles${req.params.offset}`, (err, data) => {
        if (err) {
        //   console.log(err);
          res.status(500).send(err);
        }
        //if no match found
        if (data != null) {
            console.log('cache found', req.params.offset)
            // console.log(data)
            req.data = data
            console.log('data send next')
            next();

            // res.send(data);
        } else {
          //proceed to next middleware function
          next();
        }
      });
  })

app.get('/battles/:offset', cors(), (req, res) => {
    if (req.data) {
        console.log('data received')
        // console.log(req.data)
        res.send(req.data)
    } else {
        let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
        // &offset=0 / 50 / 100
        console.log(req.params)
        fetch(url, { timeout: 60000 })
            .then((res) => res.json())
            .then((battles) => {
                res.send(battles)
            })
            .catch((error) => {
                res.status(404).send({ success: false, message: error.message });
            });
    }
    
    /* 
    STOCK ALL BATTLE < 1000
    STOCK KILLBOARD > 20 players (with weapons ?)
    MAKE VUEJS COMPONENT BATTLEBOARD -> KILLBOARD to instant see killboard
     */


});
app.get('/battles/:offset/:guildName', cors(), (req, res) => {
    // console.log(req.params.guildName)
    fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.guildName}`, { timeout: 15000 })
    .then((res) => res.json())
    .then( json => {
        let guildId = json.guilds[0].Id
        // console.log(guildId)
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
})
app.get('/battles/:offset/player/:playerName', cors(), (req, res) => {
    // console.log('player', req.params.playerName)
    fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.playerName}`, { timeout: 15000 })
    .then((res) => res.json())
    .then( json => {
        // console.log(json)
        let playerName = json.players[0].Id
        // console.log(playerName)
        let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&playerId=${playerName}&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
        fetch(url, { timeout: 15000 })
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
})

app.get('/killboard/:id', cors(), (req, res) => {
      fetch(`https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`, { timeout: 15000 })
        .then((res) => res.json())
        .then( battle => {
            for (const guild in battle.guilds) {
                if (!battle.guilds[guild].allianceId) {
                    battle.alliances[guild] = battle.guilds[guild]
                    battle.guilds[guild].allianceId = guild
                }
            }
            for (const alliance in battle.alliances) {
                battle.alliances[alliance].players = []
                battle.alliances[alliance].listItemPower = []
                battle.alliances[alliance].guilds = []
            }
            for (const guild in battle.guilds) {
                const allianceOfGuild = battle.alliances[battle.guilds[guild].allianceId]
                allianceOfGuild.guilds.push( battle.guilds[guild].name ) // ONLY NAME : TODO OBJECT
            } 

            for (const player in battle.players) {
                battle.players[player].damageDone = []
                battle.players[player].healingDone = []
                battle.players[player].assistance = 0
                battle.players[player].deathFame = ''
                battle.players[player].weapon = ''
                battle.players[player].mount = ''
                battle.players[player].itempower = null

                if (!battle.players[player].allianceId) {
                    battle.players[player].allianceId = battle.players[player].guildId
                }
            }
            res.send(battle)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
})
app.get('/player/:id', cors(), (req, res) => { // RECUP L'ID DE LA BATTLE POUR FAIRE LE TRI DANS LE BACK
    let url = `https://gameinfo.albiononline.com/api/gameinfo/players/${req.params.id}/deaths`;
    fetch(url, { timeout: 15000 })
        .then((res) => res.json())
        .then((json) => {
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
})


app.listen(port);