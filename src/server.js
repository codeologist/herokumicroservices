

    "use strict";

    var express = require("express");
    var bodyParser = require('body-parser');
    var winston = require('winston');

    var authorize = require('./services/authorize');
    var authenticate = require('./services/authenticate');

    function server(){

        winston.profile('server');

        console.log("STARTING HEROKU MICROSERVICES");

        function UNAUTHORIZED403( res ){
            res.status(403).json({});
        }

        function filterByAppname( req, res, next ){
            winston.info("REQUEST FROM APPNAME %s", req.body.appname );
            if ( !req.body.appname ){
                res.status(400).json({});
            } else {
                next();
            }
        }

        function isSafeUrl( url ){
            return ["/check/username",  "/register","/authenticate"].indexOf( url ) !== -1;
        }

        function passGo( req, res, next ){
            if ( req.body.token ){
                authorize.func2(...arguments).then( function(){
                    next();
                }).catch( function(){
                    UNAUTHORIZED403( res )
                });
            } else {
                if  ( isSafeUrl( req.url )  ) {
                    next();
                } else {
                    UNAUTHORIZED403( res );
                }
            }
        }

        var app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use( filterByAppname );
        app.use( passGo );

        var server = app.listen( process.env.PORT, function () {
            winston.log( "info", "STARTED HEROKU MICROSERVICES ON PORT ", process.env.PORT );
        });

        winston.profile('server');

        return app;
    }

    module.exports = server;