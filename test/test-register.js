

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');

    describe('register', function() {

        it('should return 201 for a successful registration', function (done) {

            fetch( "http://localhost:5000/register", {
                'username': 'tony',
                'password': 'password'
            }).then( function( result ){
                assert.equal( result.statusCode, 201 );
                done();
            }).catch( function( err ){
                console.log( err );
                assert( false );
            });
        });
    });
//
//
//describe('auth', function() {
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
//            'username': 'tony',
//            'password': 'password'
//        });
//
//        // An object of options to indicate where to post to
//        var post_options = {
//            host: process.env.server,
//            port: '5000',
//            path: '/auth',
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
//                token = res.token;
//                assert( res.token, "We can only assert the token exists" );
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
//
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