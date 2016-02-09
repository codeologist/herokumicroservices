
    "use strict";


    const IoRedis = require("../lib/redis");
    const transformHGETALL = require("../lib/transformHGETALL");
    const crypto = require('crypto');
    const winston = require('winston');
    const resolveUsernameFromToken = require('../lib/resolveUsernameFromToken');
    const DB = {
        port:       process.env.REDISCLOUD_PORT,
        host:       process.env.REDISCLOUD_ENDPOINT,
        password:   process.env.REDISCLOUD_PASSWORD,
        family:     4,
        db:         0
    };


    function func( host, body ){
        return new Promise( function( resolve, reject ){

            if ( !body.uri || !body.token || !body.text ){
                reject( 400 );
            } else {
                resolveUsernameFromToken( body.token ).then(function( username ){
                    var timestamp = new Date().getTime();
                    var body2 ={};
                    body2.host = host;
                    body2.datetime=timestamp;
                    body2.text = body.text;
                    var uri = "URI:" + host +":"+ body.uri;
                    var m = new IoRedis( DB ).multi();
                    m.lpush( "TIMELINE:" + host + ":" + username, uri  );
                    m.hmset( uri, body2 );
                    m.exec( function ( err,result ) {
                        if ( err || !result ){
                            reject( new Error( err ) );
                        }
                        if (result){
                            resolve( 200 );
                        }
                    });


                }).catch( function( err ){
                    reject( 403 );
                });
            }
        });
    }

    function endpoint( req, res) {
        winston.profile('ADDCONTENT');

        func( req.hostname, req.body ).then( function(){
            winston.profile('ADDCONTENT');
            res.status(200).json({});
        }).catch( function( err ){
            winston.profile('ADDCONTENT');
            winston.warn( err );
            res.status(400).json({});
        });
    }

    module.exports = {
        func: func,
        endpoint: endpoint
    };
