const redis = require("redis");

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);


module.exports = {
    battlesRedisMDW: function (req, res, next) {
        redis_client.get(`battles`, (err, data) => { //${req.params.offset}
            if (err) {
            res.status(500).send(err);
            }
            if (data != null) {
                console.log('cache found', req.params.offset)
                dataParse = JSON.parse(data)
                dataSorted = dataParse.sort((a,b) => (a.startTime > b.startTime) ? -1 : ((b.startTime > a.startTime) ? 1 : 0));
                console.log('begin slice')
                req.data = dataSorted.slice(req.params.offset, (parseInt(req.params.offset) + 50))
                console.log('end slice', req.data.length)

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