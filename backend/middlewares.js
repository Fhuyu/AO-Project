const redis = require("redis");

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);


module.exports = {
    battlesRedisMDW: function (req, res, next) {
        redis_client.get(`battles${req.params.offset}`, (err, data) => {
            if (err) {
            res.status(500).send(err);
            }
            if (data != null) {
                console.log('cache found', req.params.offset)
                req.data = data
            }
            next();
        });
    },
    killboardRedisMDW: function (req, res, next) {
        redis_client.get(req.params.id, (err, data) => {
            if (err) {
            res.status(500).send(err);
            }
            if (data != null) {
                console.log('cache found', req.params.id)
                req.data = JSON.parse(data)
                // console.log(data)
            }
            next();
        });
    }
}