const http = require("http");
const fetch = require('node-fetch')
const express = require('express')
const cors = require('cors') // https://github.com/expressjs/cors
const app = express()


app.get('/battles', cors(), (req, res) => {
    let url = 'https://gameinfo.albiononline.com/api/gameinfo/battles?limit=20&sort=recent&guildId=LKYQ8b0mTvaPk0LxVny5UQ';
    fetch(url, { timeout: 5000 })
        .then((res) => res.json())
        .then((json) => {
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
});
/* app.get('/killboard/:id', cors(), (req, res) => {
    console.log(`https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`)
    let url = `https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`

    fetch(url, { timeout: 5000 })
        .then((res) => res.json())
        .then((json) => {
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
}); */
app.get('/killboard/:id', cors(), (req, res) => {
      fetch(`https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`, { timeout: 5000 })
        .then((res) => res.json())
        // .then((json) => {
        //     res.send(json)
        // })
        .then( battle => {
            const refreshStats = []

            for (const guild in battle.guilds) {
                if (!battle.guilds[guild].allianceId) {
                    battle.alliances[guild] = battle.guilds[guild]
                    battle.guilds[guild].allianceId = guild
                }
            }
            for (const alliance in battle.alliances) {
                battle.alliances[alliance].players = []
            }

            for (const player in battle.players) {
                battle.players[player].damageDone = []
                battle.players[player].healingDone = []
                battle.players[player].assistance = 0
                battle.players[player].weapon = ''
                battle.players[player].itempower = null

                if (!battle.players[player].allianceId) {
                    battle.players[player].allianceId = battle.players[player].guildId
                }
                // battle.alliances[playerAlliance].players.push("Hello") //{[player]: battle.players[player]}
            }

            res.send(battle)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
})
app.get('/player/:id', cors(), (req, res) => { // RECUP L'ID DE LA BATTLE POUR FAIRE LE TRI DANS LE BACK
    let url = `https://gameinfo.albiononline.com/api/gameinfo/players/${req.params.id}/deaths`;
    fetch(url, { timeout: 10000 })
        .then((res) => res.json())
        .then((json) => {
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
})

http.createServer(app).listen(3000, function() {
    console.log(`Server running at port 3000`)
})