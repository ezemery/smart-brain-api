var redis = require("redis");
var client = redis.createClient(process.env.REDIS_URI);


const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).json({"something went wrong": "unauthorized"})
    }
    return client.get(authorization, function(err, reply) {
        // reply is null when the key is missing
       if(err || !reply){
          return res.status(401).json({"something went wrong":"unauthorized"})
       }
       return next();
    });
}

module.exports = {
    requireAuth : requireAuth
}