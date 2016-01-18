
    "use strict";

    var server = require("./server");

    function echoname( req, res ){
        res.send( req.hostname );
    }

    function Router(){

        var app = server();
        app.get("/", echoname );

    }

    module.exports = Router;
