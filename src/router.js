
    "use strict";

    const authenticate = require("./services/authenticate");
    const register = require("./services/register");
    const server = require("./server");

    function echoname( req, res ){
        res.send( req.hostname );
    }

    function Router(){

        var app = server();

        app.get("/", echoname );

        app.post("/register", register.endpoint );
        app.post("/authenticate", authenticate.endpoint );
    }

    module.exports = Router;
