const redis = require("redis");

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);


module.exports = {
    battlesRedisMDW: function (req, res, next) {
        redis_client.get(`battles`, (err, data) => { 
            if (data != null) {
                // console.log('params :', req.params)
                req.dataParse = JSON.parse(data)
            }
            next();
        });
    },
    guildIdMDW: function (req, res, next) {
        redis_client.get(`guilds`, (err, data) => {
            if (data != null) {
                guilds = JSON.parse(data)
                req.guildID = Object.keys(guilds).find(key => guilds[key].toLowerCase() === req.params.guildName.toLowerCase());
            }
            next();
        })
    },
    battlesGuildMDW: function (req, res, next) {
        if (req.dataParse) {
            req.dataParse = req.dataParse.filter((battle)=> battle.guilds[req.guildID]); // REDO
        }
        next();
    },
    battlesMinPlayers: function (req, res, next) {
        if (req.dataParse && req.query.minBattlePlayers > 0) {
            req.dataParse = req.dataParse.filter((battle)=> Object.keys(battle.players).length > parseInt(req.query.minBattlePlayers))
        }
        next();
    },
    battlesSortMDW: function (req, res, next) {
        if (req.dataParse) {
            req.dataSorted = req.dataParse.sort((a,b) => (a.startTime > b.startTime) ? -1 : ((b.startTime > a.startTime) ? 1 : 0));
        }
        next();
    },
    battlesOffsetMDW: function (req, res, next) {
        if (req.dataSorted) {
            // console.log('----------------')
            // console.log('dataSorted length', req.dataSorted.length)
            // console.log('offset', parseInt(req.params.offset))
            if (!(req.dataSorted.length < parseInt(req.params.offset))) {
                req.data = req.dataSorted.slice(req.params.offset, (parseInt(req.params.offset) + 50))
            }
        }    
        next();
    },

    killboardRedisMDW: function (req, res, next) {
        redis_client.get(req.params.id, (err, data) => {
            if (data != null) {
                // console.log('cache found', req.params.id)
                req.data = JSON.parse(data)
                // console.log(data)
            }
            next();
        });
    }
}