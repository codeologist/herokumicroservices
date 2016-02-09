

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var authenticate = require('../src/services/authenticate');
    var register = require('../src/services/register');
    var nuke = require('../src/lib/nuke');

    nuke();

    describe('addContent', function() {

        it('should return a 200', function (done) {

            authenticate.func2("QWERTY12345","peter", 60 * 15 ).then( function(){

                fetch( "http://localhost:5000/add/content", {
                    'token':'QWERTY12345',
                    'text': 'some content text',
                    'uri':'http://hostname.com/a/b/c/1/2/3/post'
                }).then( function( result ){
                    assert.equal( result.statusCode, 200 );
                    done();
                }).catch( function( err ){
                    assert( false );
                    done();
                });
            });


        });

        it('should return a 400', function (done) {

            fetch( "http://localhost:5000/add/content", {

            }).then( function( result ){
                assert.equal( result.statusCode, 400 );
                done();
            }).catch( function( err ){
                assert( false );
                done();
            });

        });
    });