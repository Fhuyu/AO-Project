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
    Promise.all([
        fetch(`https://gameinfo.albiononline.com/api/gameinfo/battles/${req.params.id}`).then((response) => response.json()),// parse each response as json
        fetch('https://gameinfo.albiononline.com/api/gameinfo/events').then((response) => response.json())
      ])
      .then( data => res.send(data))
})
app.get('/player/:id', cors(), (req, res) => {
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