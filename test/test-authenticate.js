

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
