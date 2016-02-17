

    "use strict";

    var express = require("express");
    var bodyParser = require('body-parser');
    var winston = require('winston');

    var authorize = require('./services/authorize');
    var authenticate = require('./services/authenticate');

    function server(){

        winston.profile('server');

        winston.info("STARTING HEROKU MICROSERVICES");

        var app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.use( function( req, res, next ){
            winston.info("REQUEST FROM APPNAME %s", req.body.appname );
            if ( !req.body.appname ){
                res.status(400).json({});
            } else {
                next();
            }
        });

        app.use( function( req, res, next ){console.log( req.url,JSON.stringify(req.body))
            if ( req.body.token ){console.log("_------->",req.body.token)
                authorize.func2(...arguments).then( function(){
                    next();
                }).catch( function(){
                    res.status(403).json({});
                });
            } else {
                if  ( req.url === "/check/username" || req.url === "/register" ||  req.url === "/authenticate") {
                    next();
                } else {
                    res.status(403).json({});
                }
            }
        });

        var server = app.listen( process.env.PORT, function () {
            winston.log( "info", "STARTED HEROKU MICROSERVICES ON PORT ", process.env.PORT );
        });

        winston.profile('server');

        return app;
    }

    module.exports = server;