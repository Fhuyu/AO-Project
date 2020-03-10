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
            // console.log(json)
            res.send(json)
        })
        .catch((error) => {
            res.status(404).send({ success: false, message: error.message });
        });
});


http.createServer(app).listen(3000, function() {
    console.log(`Server running at port 3000`)
})