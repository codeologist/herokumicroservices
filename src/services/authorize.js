
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
            new IoRedis( DB ).exists(token, function ( err,result ) {

                if ( err || !result ){
                    reject( token );
                }

                if ( result ){
                    resolve( token );
                }

            });
        });
    }


    function endpoint( req, res) {
        winston.profile('AUTHORIZE');

        authorize( req.body.token ).then( function( token ){
            winston.profile('AUTHORIZE');
            winston.info("AUTHORIZE SUCCESS for token %s", token );
            res.status(200).json({});
        }).catch( function( token ){
            winston.profile('AUTHORIZE');
            winston.info("AUTHORIZE FAIL for token %s", token );
            res.status(403).json( {} );
        });
    }

    module.exports = {
        func: authorize,
        endpoint: endpoint
    };
