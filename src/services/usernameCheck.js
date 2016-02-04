
    "use strict";


    const IoRedis = require("../lib/redis");
    var db = new Set();

    const DB = {
        port:       process.env.REDISCLOUD_PORT,
        host:       process.env.REDISCLOUD_ENDPOINT,
        password:   process.env.REDISCLOUD_PASSWORD,
        family:     4,
        db:         0
    };


    module.exports = function( req, res ){
        new IoRedis( DB ).exists( "USER:" + req.body.username, function ( err, result) {

            if ( err ){
                res.status(404).json({});
            } else{
                if ( result  ){
                    res.status(200).json({});
                } else {
                    db.add(req.body.username);
                    res.status(404).json({});
                }
            }
        });
    };