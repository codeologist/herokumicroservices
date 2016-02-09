

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var nuke = require('../src/lib/nuke');

    nuke();
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
