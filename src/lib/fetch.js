
    "use strict";

    var querystring = require('qs');
    var http = require('http');
    var url = require("url");

    module.exports = function( endpoint, data, callback, method ){
        return new Promise( function( resolve, reject ){

            data = data || {};

            var parsedUrl = url.parse( endpoint );
            var post_data = querystring.stringify( data );

            // An object of options to indicate where to post to
            var post_options = {
                host: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname,
                method: method || 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var post_req = http.request( post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {

                    try {
                        chunk = JSON.parse( chunk );

                        if ( typeof callback === "function" ){
                            callback( null, { statusCode: res.statusCode, data: chunk }  );
                        }

                        resolve( { statusCode: res.statusCode, data: chunk } );

                    } catch( e ){

                        if ( typeof callback === "function" ){
                            callback(  { statusCode: res.statusCode, error: e }  );
                        }

                        reject( { statusCode: res.statusCode, error: e }  );
                    }

                });
            });

// post the data
            post_req.write(post_data);
            post_req.end();

        });
    };