const http = require("http");
const fetch = require('node-fetch')
const express = require('express')
// const axios = require('axios')
const cors = require('cors') // https://github.com/expressjs/cors
const app = express()

class DataCache {
    constructor(fetchFunction, minutesToLive = 10) {
      this.millisecondsToLive = minutesToLive * 60 * 1000;
      this.fetchFunction = fetchFunction;
      this.cache = null;
      this.getData = this.getData.bind(this);
      this.resetCache = this.resetCache.bind(this);
      this.isCacheExpired = this.isCacheExpired.bind(this);
      this.fetchDate = new Date(0);
    }
    isCacheExpired() {
      return (this.fetchDate.getTime() + this.millisecondsToLive) < new Date().getTime();
    }
    getData() {
        // console.log(this.cache)
        // console.log(this.fetchDate)
        // console.log(this.isCacheExpired())
        // console.log(this.millisecondsToLive)
      if (!this.cache || this.isCacheExpired()) {
        console.log('expired - fetching new data');
        return this.fetchFunction()
          .then((data) => {
            this.cache = data;
            this.fetchDate = new Date();
            return data;
        });
      } else {
        console.log('cache hit');
        return Promise.resolve(this.cache);
      }
    }
    resetCache() {
     this.fetchDate = new Date(0);
    }
  }

app.get('/battles/:offset', cors(), (req, res) => {
    let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${req.params.offset}`;
    // &offset=0 / 50 / 100
    console.log(req.params)
    const getBattles = () => {
     return fetch(url, { timeout: 15000 })
        .then((res) => res.json())
    }
    const battlesCache = new DataCache(getBattles, .5);

    battlesCache.getData()
    .then((battles) => {
        res.send(battles)
    })
    .catch((error) => {
        res.status(404).send({ success: false, message: error.message });
    });
});
app.get('/battles/:offset/:guildName', cors(), (req, res) => {
    console.log(req.params.guildName)
    fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.guildName}`, { timeout: 15000 })
    .then((res) => res.json())
    .then( json => {
        let guildId = json.guilds[0].Id
        console.log(guildId)
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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);