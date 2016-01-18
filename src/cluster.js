
    "use strict";

    var throng = require("throng");
    var router = require("./router");
    var WORKERS = process.env.WEB_CONCURRENCY || 1;


    throng( router, {
        workers: WORKERS,
        lifetime: Infinity
    });

