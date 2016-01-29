
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

    function authorize( token ){
        return new Promise( function( resolve, reject ){
            new IoRedis( DB ).get(token, function ( err ) {

                if ( err ){
                    reject( new Error( err ) );
                }

                resolve();
            });
        });
    }


    function endpoint( req, res) {
        winston.profile('AUTHORIZE');

        authorize( req.body.token ).then( function(){
            winston.profile('AUTHORIZE');
            res.status(200).json({});
        }).catch( function( err ){
            winston.profile('AUTHORIZE');
            winston.warn( err );
            res.status(403).json( {} );
        });
    }

    module.exports = {
        func: authorize,
        endpoint: endpoint
    };
