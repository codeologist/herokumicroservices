

    "use strict";

    var express = require("express");
    var bodyParser = require('body-parser');
    var winston = require('winston');

    function server(){

        winston.profile('server');

        winston.info("STARTING HEROKU MICROSERVICES");

        var app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.use( function( req, res, next ){
            winston.info("REQUEST FROM HOST %s %s", req.get("origin"),req.get("host"));
            winston.info( "-----------", JSON.stringify(req.headers) );
            winston.info( "-----------", 'User-Agent: ' + req.headers['user-agent'] );


            next();
        });
        var server = app.listen( process.env.PORT, function () {
            winston.log( "info", "STARTED HEROKU MICROSERVICES ON PORT ", process.env.PORT );
        });

        winston.profile('server');

        return app;
    }

    module.exports = server;