// const redis = require("redis");
// const port_redis = process.env.PORT || 6379;
// const redis_client = redis.createClient(port_redis);

const mongoose = require('mongoose')
const Crystal = require('../models/Crystal')
const Guild = require('../models/Guild')

module.exports = {
    fetchCrystals: async function(req, res, next) {
        // Hide or show lv 1
        req.params.offset = parseInt(req.params.offset)

        if (req.query.hideLevel1 === 'true') {
            console.log('in')
            req.data = await Crystal.find({ level: { $gt: 1 } }).limit(req.params.offset + 50).sort({ startTime: -1 })
        } else {
            console.log('out')
            req.data = await Crystal.find({}).limit(req.params.offset + 50).sort({ startTime: -1 })
        }
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