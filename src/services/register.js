
    "use strict";

    const winston = require('winston');
    const crypto = require('crypto');
    const IoRedis = require("../lib/redis");
    const DB = {
        port:       process.env.REDISCLOUD_PORT,
        host:       process.env.REDISCLOUD_ENDPOINT,
        password:   process.env.REDISCLOUD_PASSWORD,
        family:     4,
        db:         0
    };

    function sha1(str){
        return crypto.createHash('sha1').update(str).digest('hex');
    }

    function register( sitename, username, password ) {
        return new Promise( function( resolve, reject ){

            if ( !username || !password ){
                reject();
            }

            var salt = crypto.randomBytes( 256 ).toString();

            var userdata = {
                sitename: sitename,
                username: username,
                password:  sha1(password+salt),
                salt: salt
            };

            new IoRedis( DB ).hmset( "USER:" + username, userdata, function( err ) {
                if ( err ){
                    reject( new Error( err ) )
                }

                resolve({});
            });
        });
    }

    function endpoint( req, res) {

        winston.profile('REGISTERUSER');

        register( req.get('origin'), req.body.username, req.body.password ).then( function(){
            winston.profile('REGISTERUSER');
            winston.info("REGISTER SUCCESSFUL FOR USER %s@%s", req.body.username, req.body.appname);
            res.status(201).json({});
        }).catch( function( err ){
            winston.profile('REGISTERUSER');
            winston.warn("REGISTER FAIL %s@%s", req.body.username, req.hostname );
            res.status(400).json( {} );
        });
    }

    module.exports = {
        func: register,
        endpoint: endpoint
    };

