
    "use strict";

    const authorize = require("./services/authorize");
    const authenticate = require("./services/authenticate");
    const register = require("./services/register");
    const checkUsername = require("./services/usernameCheck");
    const server = require("./server");

    function echoname( req, res ){
        res.send( req.hostname );
    }

    function Router(){

        var app = server();

        app.get("/", echoname );

        app.post("/register", register.endpoint );
        app.post("/authenticate", authenticate.endpoint );
        app.post("/authorize", authorize.endpoint );
        app.post("/check/username", checkUsername );
    }

    module.exports = Router;
