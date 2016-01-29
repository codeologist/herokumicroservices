

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var authenticate = require('../src/services/authenticate');


    describe('authorize', function() {

        it('should return a 200', function (done) {

            authenticate.func2("qwerty","data", 60 * 15 ).then( function(){

                fetch( "http://localhost:5000/authorize", {
                    'token': 'qwerty'
                }).then( function( result ){
                    assert.equal( result.statusCode, 200 );
                    done();
                }).catch( function( err ){
                    assert( false );
                    done();
                });

            });


        });
    });