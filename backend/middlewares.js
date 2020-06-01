const redis = require("redis");

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

const mongoose = require('mongoose')
const Battle = require('./models/Battle')
const Guild = require('./models/Guild')

// APPELER MONGO .FIND AVEC TRI SUR LES DATES -> DELETE SORTMDW

module.exports = {
    battlesRedisMDW: async function (req, res, next) {
        console.log('battlesRedisMDW')
        console.log('params :', req.params)
        req.dataParse = await Battle.find().sort({battleID:-1})  // ORDER BY DATE .sort({ battleStartTime: -1} )
        next()
        // RAM LIMIT -> NEED ADMINCOMMAND ON
    },
    guildIdMDW: function (req, res, next) {
        console.log('guildIdMDW')
        redis_client.get(`guilds`, (err, data) => {
            if (data != null) {
                guilds = JSON.parse(data)
                req.guildID = Object.keys(guilds).find(key => guilds[key].toLowerCase() === req.params.guildName.toLowerCase());
            }
            next();
        })
    },
    battlesGuildMDW: function (req, res, next) {
        console.log('battlesGuildMDW')
        if (req.dataParse) {
            req.dataParse = req.dataParse.filter((battle)=> battle.battleData[0].guilds[req.guildID]); // REDO
        }
        next();
    },
    battlesMinPlayers: function (req, res, next) {
        console.log('battlesMinPlayers')
        console.log('req.datapase :', req.dataParse.length)
        if (req.dataParse && req.query.minBattlePlayers > 0) {
            req.dataParse = req.dataParse.filter((battle)=> battle.battleTotalPlayers > parseInt(req.query.minBattlePlayers))
        }
        console.log('req.datapase after min battle:', req.dataParse.length)
        next();
    },
    // battlesSortMDW: function (req, res, next) {
    //     if (req.dataParse) {
    //         req.dataSorted = req.dataParse.sort((a,b) => (a.startTime > b.startTime) ? -1 : ((b.startTime > a.startTime) ? 1 : 0));
    //     }
    //     next();
    // },
    battlesOffsetMDW: function (req, res, next) {
        if (req.dataParse) {
            console.log('----------------')
            console.log('battlesOffsetMDW')
            console.log('offset', parseInt(req.params.offset))
            if (!(req.dataParse.length < parseInt(req.params.offset))) {
                req.data = req.dataParse.slice(req.params.offset, (parseInt(req.params.offset) + 50))
                req.data.forEach( (battle, index) => {
                        req.data[index] = battle.battleData[0]
                    }
                )
            }
        }    
        next();
    },

    killboardMDW: async function (req, res, next) {
        await Battle.find({ battleID : req.params.id}).limit(1)
        .then(killboard => {
        // console.log('data found : ', killboard)
        // If battle is in DB
        if (killboard.length) req.data = killboard[0].battleData[0]
        next();
    })

        // redis_client.get(req.params.id, (err, data) => {
        //     if (data != null) {
        //         // console.log('cache found', req.params.id)
        //         req.data = JSON.parse(data)
        //         // console.log(data)
        //     }
        //     next();
        // });

    }
}