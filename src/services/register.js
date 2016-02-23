
    "use strict";

    /*
    *
    *  There are two goals to this project.
    *  1: create a psuedo microservices api inside a heroku app
    *  2: actually have a functioning app consuming the api
    *
    *  This is very experiemental so there are currently only functional
    *  tests - although that also jibes with the MS ethos.  AKA dont need so many tests
    *
    *  There is still a lot of duplication in the code which is to be factored out at some
    *  point when there is enough duplication and enough of a pattern of use to warrant it
    *
    *
    */
    const winston = require('winston');
    const crypto = require('crypto');
    const IoRedis = require("../lib/redis");
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


    /*
    *
    * The main function in each microservice attempts to stick to the
    * microservice is a very short ( 40 odd lines ) simple peice of code that doesnt need
    * a great deal of testing and is only as complex as it needs to be
    */
    function register( appname, username, password ) {
        return new Promise( function( resolve, reject ){

            if ( !username || !password ){
                reject();
            }

            var salt = crypto.randomBytes( 256 ).toString();

            var userdata = {
                appname: appname,
                username: username,
                password:  sha1(password+salt),
                salt: salt
            };

            new IoRedis( DB ).hmset( "USER:" + username, userdata, function( err ) {
                if ( err ){
                    reject( new Error( err ) )
                }
                resolve({});
            });
        });
    }

    /*
    *
    *
    *  The endpoont and notify are to become generic boilerplate
    *  used by all microservices
    *
    * */
    function notify( req, res ){
        return new Promise( function( resolve, reject ){
            winston.profile('REGISTERUSER');

            register( req.body.appname, req.body.username, req.body.password  ).then( function(){
                winston.profile('REGISTERUSER');
                winston.info("REGISTER SUCCESSFUL FOR USER %s@%s", req.body.username, req.body.appname);
                resolve();
            }).catch( function( token ){
                winston.profile('REGISTERUSER');
                winston.warn("REGISTER FAIL %s@%s", req.body.username, req.body.appname );
                reject();
            });
        });
    }



    function endpoint( req, res) {

        notify(...arguments).then( function(){
            res.status(201).json({});
        }).catch( function( err ){
            res.status(400).json( {} );
        });
    }

    module.exports = {
        func: register,
        endpoint: endpoint
    };

