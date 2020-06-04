const redis = require("redis");

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

const mongoose = require('mongoose')
const Battle = require('./models/Battle')
const Guild = require('./models/Guild')

module.exports = {
    battlesRedisMDW: async function (req, res, next) {
        const offsetNumber = parseInt(req.params.offset) + 50
        console.log('nbplayer', req.query.minBattlePlayers)
        if (req.guildID) {

            let query = {}
            let guildTosearch = "battleData.guilds." + req.guildID
            query[guildTosearch] = {$exists: true }
            query['battleTotalPlayers'] = { $gt: req.query.minBattlePlayers }

            req.dataParse = await Battle.find(query).sort({battleID:-1}).limit(offsetNumber)
        } else {
            req.dataParse = await Battle.find({ battleTotalPlayers: { $gt: req.query.minBattlePlayers } }).sort({battleID:-1}).limit(offsetNumber)
        }

        next()
    },
    guildIdMDW: async function (req, res, next) {
        guilds = await Guild.find({"guildName": req.params.guildName.toUpperCase()})
        console.log(req.params.guildName)
        req.guildID = guilds[0].guildID
        next();
    },
    // battlesGuildMDW: function (req, res, next) {
    //     if (req.dataParse) {
    //         req.dataParse = req.dataParse.filter((battle)=> battle.battleData[0].guilds[req.guildID]); // REDO
    //     }
    //     next();
    // },
    // battlesMinPlayers: function (req, res, next) {
    //     console.log('minplayers :', req.query.minBattlePlayers)
    //     if (req.dataParse && req.query.minBattlePlayers > 0) {
    //         req.dataParse = req.dataParse.filter((battle)=> battle.battleTotalPlayers > parseInt(req.query.minBattlePlayers))
    //     }
    //     next();
    // },
    battlesOffsetMDW: function (req, res, next) {
        if (req.dataParse) {
            // console.log('----------------')
            // console.log('battlesOffsetMDW')
            console.log('offset', parseInt(req.params.offset))
            console.log('----')
            if (!(req.dataParse.length < parseInt(req.params.offset))) {
                req.data = req.dataParse.slice(req.params.offset, (parseInt(req.params.offset) + 50))
                req.data.forEach( (battle, index) => {
                        req.data[index] = battle.battleData[0]
                    }
                )
            }
            // if (req.guildID && req.dataParse.length < parseInt(req.params.offset)) {
            //     req.data = ['empty']
            // }
        }    
        next();
    },

    killboardMDW: async function (req, res, next) {
        console.log('killboard :', req.params.id)
        await Battle.find({ battleID : req.params.id}).limit(1)
        .then(killboard => {
        // If battle is in DB
        if (killboard.length) req.data = killboard[0].battleData[0]
        next();
    })

    }
}