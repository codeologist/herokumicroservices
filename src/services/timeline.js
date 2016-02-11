
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


    function func( req ){
        return new Promise( function( resolve, reject ){
            var token = req.body.token;
            var host = req.hostname;
            if ( !token ){
                reject( 400 );
            } else {

                resolveUsernameFromToken(token).then( function (username) {

                    var m = new IoRedis( DB );
                    m.lrange( "TIMELINE:" + host + ":" + username, 0, 50, function ( err,result ) {
                        if ( err   ){
                            reject( 400 );
                        }

                        if (result){
                            var m = new IoRedis( DB ).multi();

                            result.forEach( function( post ){
                                m.hgetall( post );
                            });

                            m.exec( function( errb, resultb ){
                                if ( errb  ){
                                    reject( 400 );
                                }
                                if (resultb){
                                    var out=[];
                                    resultb.forEach( function( result ){
                                        var obj={};
                                        transformHGETALL( result[1] ).forEach( function(fd){
                                            obj[fd.field] = fd.value;
                                        });
                                        out.push(obj);
                                    });
                                    resolve( out );
                                }
                            });
                        }
                    });
                }).catch( function( err ){
                    reject( err );
                });
            }
        });
    }

    function endpoint( req, res) {
        winston.profile('TIMELINE');
        func( req ).then( function( posts ){
            winston.profile('TIMELINE');
            res.status(200).json({ timeline: posts });

        }).catch( function( err ){
            winston.profile('TIMELINE');
            winston.warn( err );
            res.status(400).json( { text: err } );
        });
    }

    module.exports = {
        func: func,
        endpoint: endpoint
    };
