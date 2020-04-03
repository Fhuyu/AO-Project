const http = require("http");
const fetch = require('node-fetch')
const express = require('express')
const cors = require('cors') // https://github.com/expressjs/cors
const app = express()



app.get('/battles/:offset', cors(), (req, res) => {
    let url = `https://gameinfo.albiononline.com/api/gameinfo/battles?limit=50&sort=recent&offset=${req.params.offset}`; //&guildId=LKYQ8b0mTvaPk0LxVny5UQ
    // &offset=0 / 50 / 100
    console.log(req.params)
    fetch(url, { timeout: 15000 })
        .then((res) => res.json())
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
app.get('/battles/:offset/player/:playerName', cors(), (req, res) => {
    console.log('player', req.params.playerName)
    fetch(`https://gameinfo.albiononline.com/api/gameinfo/search?q=${req.params.playerName}`, { timeout: 15000 })
    .then((res) => res.json())
    .then( json => {
        console.log(json)
        let playerName = json.players[0].Id
        console.log(playerName)
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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);