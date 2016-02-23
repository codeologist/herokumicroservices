
    "use strict";

    const authorize = require("./services/authorize");
    const authenticate = require("./services/authenticate");
    const register = require("./services/register");
    const checkUsername = require("./services/usernameCheck");
    const addContent = require("./services/addContent");
    const timeline = require("./services/timeline");
    const profile = require("./services/profile");
    const server = require("./server");



    function Router(){

        var app = server();

        app.post("/register", register.endpoint );
        app.post("/authenticate", authenticate.endpoint );
        app.post("/authorize", authorize.endpoint );
        app.post("/check/username", checkUsername );
        app.post("/add/content", addContent.endpoint );
        app.post("/timeline", timeline.endpoint );
        app.post("/profile", profile.endpoint );

        app.get("/profile", profile.endpoint );


        app.use( function( req, res, next ){
            console.log( "CALLING URL: %s, JSON BODY: %s",req.url,JSON.stringify(req.body));
            console.log("AUTHORIZATION TOKEN: %s",req.body.token);
            console.log("----------------------------------------------------------------------");
            console.log("");
            console.log("");
            next();
        });


    }

    module.exports = Router;
