
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

    function authenticate( appname, username, password ){
        return new Promise( function( resolve, reject ){
            new IoRedis( DB ).hgetall( "USER:" + username, function( err, result ) {

                var token;

                if ( err ){
                    reject( err );
                } else {
                    token = sha1( appname + username + result.salt   + new Date().getTime() );

                    if ( result.password ===  sha1(password + result.salt) ) {
                        setToken( token, username, sessionTimeout ).then( function( token ){
                            resolve( token );
                        });
                    } else {
                        reject( "password mismatch" );
                    }
                }
            });
        });
    }

    function notify( req, res, next ){
        return new Promise( function( resolve, reject ){
            const appname = req.body.appname;
            const username = req.body.username;
            const password = req.body.password;

            winston.profile('AUTHENTICATEUSER');

            return authenticate( appname, username, password ).then( function( token ){
                winston.profile('AUTHENTICATEUSER');
                winston.info("AUTHENTICATION SUCCESS FOR USER %s@%s with token %s", username, appname, token );
                resolve(token);
            }).catch( function( err ){
                winston.profile('AUTHENTICATEUSER');
                winston.warn("AUTHENTICATION FAIL for user %s@%s with err [%s]", username, appname, err );
                reject( err );
            });
        });
    }

    function endpoint( req, res, next ) {
        notify(...arguments).then( function( token ){
            res.status(200).json({ token: token });
        }).catch( function( error ){
            res.status(400).json( { error } );
        });
    }

    module.exports = {
        func: authenticate,
        persitAuthToken: setToken,
        func3: notify,
        endpoint: endpoint
    };
