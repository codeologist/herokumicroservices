
    "use strict";

    var server = require("./server");


    function Router(){

        var app = server();
        app.get("/", require( "./pages/home" ) );

    }

    module.exports = Router;
