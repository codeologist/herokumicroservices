

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var nuke = require('../src/lib/nuke');


    describe('register', function() {

        it('should return 201 for a successful registration', function (done) {
            nuke().then( function(){
                fetch( "http://localhost:5000/register", {
                    'hostname':'testapp',
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

        it('should return 400 for missing username', function (done) {
            nuke().then( function(){
                fetch( "http://localhost:5000/register", {
                    'appname':'testapp',
                    'password': 'password'
                }).then( function( result ){
                    assert.equal( result.statusCode, 400 );
                    done();
                }).catch( function( err ){
                    console.log( err );
                    assert( false );
                });
            });
        });
    });
