// const redis = require("redis");
// const port_redis = process.env.PORT || 6379;
// const redis_client = redis.createClient(port_redis);

const mongoose = require('mongoose')
const Crystal = require('../models/Crystal')

module.exports = {
    setQuery: function(req, res, next) {
        console.log('crystal league', req.query)

        let query = {}

        if (req.query.date) {
            const date = new Date(req.query.date)
            const tomorrow = new Date(date.getTime() + 86400000);

            console.log('date', date, tomorrow)
            query['startTime'] = {
                $gte: date,
                $lt: tomorrow
            }
        }
        if (req.query.player) {
            const name = req.query.player
            query['players'] = { $elemMatch: { Name: name } }
        }

        if (req.query.hideLevel1) {
            query['level'] = { $gt: 1 }
        }
        req.setQuery = query
        next();
    },

    fetchCrystals: async function(req, res, next) {
        req.params.offset = parseInt(req.params.offset)
        req.data = await Crystal.find(req.setQuery).limit(req.params.offset + 50).sort({ startTime: -1 })
        next();
    },
    crystalsOffsetMDW: function(req, res, next) {
        if (req.data) {
            if (!(req.data.length < req.params.offset)) {
                req.data = req.data.slice(req.params.offset, (req.params.offset + 50))
            }
        }
        next();
    },
}