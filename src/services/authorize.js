
"use strict";
const IoRedis = require("../lib/redis");

const redis = new IoRedis({
    port: process.env.REDISCLOUD_PORT,
    host: process.env.REDISCLOUD_ENDPOINT,   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: process.env.REDISCLOUD_PASSWORD ,
    db: 0
});


const crypto = require('crypto');
const winston = require('winston');

function sha1(str){
    return crypto.createHash('sha1').update(str).digest('hex');
}

function fail( req, res  ){
    winston.warn("REGISTER FAIL %s@%s", req.query.username, req.hostname );
    res.status(400).json( {} );
}

module.exports = function( req, res) {

    winston.profile('register user');
    winston.info("REGISTER");


    var user = req.query.username;
    var password = req.query.password;
    var salt="salt";
    var key = "USER:" + user;

    if ( !user || !password ){
        fail( req, res );
    }

    redis.multi().hmset( key, {
        hostname:req.hostname,
        username: user,
        password: sha1(password+salt),
        salt: salt
    }).exec( function( err, result ) {
        if ( err ){
            fail( req, res );
        } else {
            winston.profile('register user');
            winston.info("REGISTER DONE");
            res.json({ status: true });
        }
    });
};
