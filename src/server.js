

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

        var server = app.listen( process.env.PORT, function () {
            winston.log( "info", "STARTED HEROKU MICROSERVICES ON PORT ", process.env.PORT );
        });

        winston.profile('server');

        return app;
    }

    module.exports = server;