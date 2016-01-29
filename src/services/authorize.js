
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

    function setToken( sitename, username, salt ){
        return new Promise( function( resolve, reject ){

            var token = sha1( sitename +":" +username + ":" + salt + ":" + new Date().getTime() );

            new IoRedis( DB ).multi().set(token, username ).expire( token,  sessionTimeout ).exec( function ( err ) {

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

                if ( result.password ===  sha1(password+result.salt) ) {
                    setToken( sitename, username, result.salt ).then( function( token ){
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
        endpoint: endpoint
    };
