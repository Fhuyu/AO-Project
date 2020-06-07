// const redis = require("redis");
// const port_redis = process.env.PORT || 6379;
// const redis_client = redis.createClient(port_redis);

const mongoose = require('mongoose')
const Battle = require('./models/Battle')
const Guild = require('./models/Guild')

module.exports = {
    guildIdMDW: async function (req, res, next) {
        try {
            guilds = await Guild.find({"guildName": req.params.guildName.toUpperCase()})
            console.log(req.params.guildName)
            req.guildID = guilds[0].guildID
        } catch {
            console.log('error')
        }
        
        next();
    },

    battlesMDW: async function (req, res, next) {
        console.log('nbplayer', req.query.minBattlePlayers)
        req.query.minBattlePlayers = req.query.minBattlePlayers === undefined ? 0 : req.query.minBattlePlayers

        const offsetNumber = parseInt(req.params.offset) + 50
        let query = {}
        
        if (req.guildID) {
            let guildTosearch = "battleData.guilds." + req.guildID
            query[guildTosearch] = {$exists: true }
        }
        query['battleTotalPlayers'] = { $gt: req.query.minBattlePlayers }

        req.dataParse = await Battle.find(query).sort({battleID:-1}).limit(offsetNumber)
        next()
    },

    battlesOffsetMDW: function (req, res, next) {
        if (req.dataParse) {
            console.log('offset', parseInt(req.params.offset))
            console.log('----')
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
        console.log('killboard :', req.params.id)
        await Battle.find({ battleID : req.params.id}).limit(1)
        .then(killboard => {
        // If battle is in DB
        if (killboard.length) req.data = killboard[0].battleData[0]
        next();
    })

    }
}