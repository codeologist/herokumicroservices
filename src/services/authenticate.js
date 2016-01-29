
    "use strict";


    const IoRedis = require("../lib/redis");
    const transformHGETALL = require("../lib/transformHGETALL");
    const crypto = require('crypto');
    const winston = require('winston');
    const sessionTimeout = 60 * 15;
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

    function setToken( token, data, timeout){
        return new Promise( function( resolve, reject ){

            new IoRedis( DB ).multi().set(token, data ).expire( token,  timeout ).exec( function ( err ) {

                if ( err ){
                    reject( err );
                }

                resolve( token );
            });
        });
    }

    function authenticate( sitename, username, password ){
        return new Promise( function( resolve, reject ){
            new IoRedis( DB ).hgetall( "USER:" + username, function( err, result ) {

                if ( err ){
                    reject( new Error( err ));
                }

                var token = sha1( sitename   +username  + result.salt   + new Date().getTime() );


                if ( result.password ===  sha1(password+result.salt) ) {
                    setToken( token, username, sessionTimeout ).then( function( token ){
                        resolve( token );
                    });
                } else {
                    reject( new Error( "Authentication Failed" ) );
                }


            });
        });
    }

    function endpoint( req, res) {
        winston.profile('AUTHENTICATEUSER');

        authenticate( req.hostname, req.body.username, req.body.password ).then( function( token ){
            winston.profile('AUTHENTICATEUSER');
            res.status(200).json({ token: token });
        }).catch( function( err ){
            winston.profile('AUTHENTICATEUSER');
            winston.warn("AUTHENTICATION FAIL %s@%s (%s)", req.body.username, req.hostname, err );
            res.status(400).json( {} );
        });
    }

    module.exports = {
        func: authenticate,
        func2: setToken,
        endpoint: endpoint
    };
