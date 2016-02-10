

    "use strict";

    var assert = require('assert');
    var fetch = require('../src/lib/fetch');
    var authenticate = require('../src/services/authenticate');
    var addContent = require('../src/services/addContent');
    var nuke = require('../src/lib/nuke');



    describe('addContent', function() {

        it('should return a 200', function (done) {

            nuke().then( function(){
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
        });

        it('should return a 400', function (done) {

            nuke().then( function(){
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


        it('should return a 400', function (done) {
            nuke().then(function () {
                authenticate.func2( "QWERTY12345", "peter", 60 * 15 ).then(function () {
                    addContent.func("localhost", {
                        'token': 'QWERTY12345',
                        'uri': 'http://hostname.com/uniqueuri',
                        'text': 'this is some text1'
                    }).then(function () {

                        fetch( "http://localhost:5000/add/content", {
                            'token': 'QWERTY12345',
                            'text': 'some content text',
                            'uri': 'http://hostname.com/uniqueuri'
                        }).then(function (result) {

                            assert.equal(result.statusCode, 400);
                            done();
                        }).catch(function () {
                           assert(false);
                            done();
                        });
                    });
                });
            });
        });

    });