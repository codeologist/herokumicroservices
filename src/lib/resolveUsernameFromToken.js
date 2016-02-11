
    "use strict";


    const IoRedis = require("../lib/redis");

    const DB = {
        port:       process.env.REDISCLOUD_PORT,
        host:       process.env.REDISCLOUD_ENDPOINT,
        password:   process.env.REDISCLOUD_PASSWORD,
        family:     4,
        db:         0
    };

    function resolveUsernameFromToken( token ){
        return new Promise( function( resolve, reject ){
            new IoRedis( DB ).get( token, function ( err, result ) {

                if ( err || result === "" ){console.log("ZXZXZXZXZXZXZXZX")
                    reject( 403 );
                }

                if ( result ){
                    resolve( result );
                }
            });
        });
    }

    module.exports = resolveUsernameFromToken;