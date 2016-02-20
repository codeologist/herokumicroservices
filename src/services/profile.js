
    "use strict";


    const resolveUsernameFromToken = require('../lib/resolveUsernameFromToken');

    const IoRedis = require("../lib/redis");
    const transformHGETALL = require("../lib/transformHGETALL");
    const crypto = require('crypto');
    const winston = require('winston');

    const DB = {
        port:       process.env.REDISCLOUD_PORT,
        host:       process.env.REDISCLOUD_ENDPOINT,
        password:   process.env.REDISCLOUD_PASSWORD,
        family:     4,
        db:         0
    };


    function profile( req, res  ){
        return new Promise( function( resolve, reject ) {

            resolveUsernameFromToken( req.body.token ).then(function( username ){

                username = username.toUpperCase();

                var m = new IoRedis( DB ).multi();
                delete req.body.token;
                m.hmset( "PROFILE:"+username, req.body );
                m.exec( function ( err,result ) {
                    if ( err || !result ){
                        reject( err );
                    }
                    if (result){
                        resolve();
                    }
                });
            });
        });
    }

    function notify( req, res ){
        return new Promise( function( resolve, reject ){
            winston.profile('PROFILE');

            profile( req, res ).then( function(){
                winston.profile('PROFILE');
                resolve();
            }).catch( function( err ){
                winston.profile('PROFILE');
                reject( err );
            });
        });
    }

    function endpoint( req, res, next ) {
        notify(...arguments).then( function( token ){
            res.status(200).json({});
        }).catch( function(){
            res.status(403).json( {} );
        });
    }

    module.exports = {
        func: profile,
        func2: notify,
        endpoint: endpoint
    };
