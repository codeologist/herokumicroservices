
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

    const actions = {
        POST:  function( username, data ){
          return new Promise( function( resolve, reject ) {

              delete data.token;
              var m = new IoRedis( DB ).multi();

              m.hmset( "PROFILE:"+username, data );
              m.exec( function ( err,result ) {
                  if ( err || !result ){
                      reject( err );
                  }
                  if (result){
                      resolve({});
                  }
              });
          });
        },
        GET:function(){
            return new Promise( function( resolve, reject ) {
                new IoRedis( DB ).hgetall( "PROFILE:ALICE", function ( err, obj ) {

                    if ( err ){
                        reject(err);
                    }

                    if ( obj ){
                        resolve(obj);
                    }
                });

            });
        }
    };


    function profile( req, res  ){
        return new Promise( function( resolve, reject ) {
            resolveUsernameFromToken( req.body.token ).then(function( username ){
                actions[req.method]( username.toUpperCase(), req.body ).then( function( output ){
                    resolve( output );
                }).catch( function( err ){
                   reject( err );
                });
            });
        });
    }

    function notify( req, res ){
        return new Promise( function( resolve, reject ){
            winston.profile('PROFILE');

            profile( req, res ).then( function( profile ){
                winston.profile('PROFILE');
                resolve( profile );
            }).catch( function( err ){
                winston.profile('PROFILE');
                reject( err );
            });
        });
    }

    function endpoint( req, res, next ) {
        notify(...arguments).then( function( profile ){


            res.status(200).json( profile );
        }).catch( function(){
            res.status(403).json( {} );
        });
    }

    module.exports = {
        func: profile,
        func2: notify,
        endpoint: endpoint
    };
