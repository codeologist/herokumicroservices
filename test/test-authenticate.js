

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var register = require('../src/services/register');
    var authenticate = require('../src/services/authenticate');






    describe('authenticate', function() {

        it('should return 200 and a token', function (done) {

            register.func( "xxx", "john", "doe" ).then( function(){

                fetch( "http://localhost:5000/authenticate", {
                    'username': 'john',
                    'password': 'doe'
                }).then( function( result ){
                    assert.equal( result.statusCode, 200 );
                    assert( result.data.token );
                    done();
                }).catch( function( err ){
                    assert( false );
                    done();
                });
            });

        });
    });

//
//
//describe('chk', function() {
//
//    it('should pass', function (done) {
//
//
//        var querystring = require('querystring');
//        var http = require('http');
//        var fs = require('fs');
//
//
//        var post_data = querystring.stringify({
//            'token': token
//        });
//
//        // An object of options to indicate where to post to
//        var post_options = {
//            host: process.env.server,
//            port: '5000',
//            path: '/chk',
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/x-www-form-urlencoded',
//                'Content-Length': post_data.length
//            }
//        };
//
//        // Set up the request
//        var post_req = http.request(post_options, function(res) {
//            res.setEncoding('utf8');
//            res.on('data', function (chunk) {
//                var res = JSON.parse( chunk);
//                assert(res.chk);
//                done();
//            });
//        });
//
//        // post the data
//        post_req.write(post_data);
//        post_req.end();
//
//    });
//});