

    "use strict";


    var assert = require('assert');

    var fetch = require('../src/lib/fetch');
    var addContent = require('../src/services/addContent');
    var authenticate = require('../src/services/authenticate');
    var nuke = require('../src/lib/nuke');


    describe('timeline', function() {

        it('should return 1 timeline item', function (done) {

            nuke().then( function(){
                authenticate.persitAuthToken("QWERTY12345","peter", 60 * 15 ).then( function() {

                    addContent.func( "localhost", { 'token':'QWERTY12345', 'uri': '/a/b/c', text:'this is some text' }).then( function(){

                        fetch( "http://localhost:5000/timeline", {
                            'appname':'testapp',
                            'token':'QWERTY12345'
                        }).then( function( result ){
                            assert.equal( result.statusCode, 200 );
                            assert.equal( result.data.timeline.length, 1 );
                            assert.equal( result.data.timeline[0].text, "this is some text" );

                            done();
                        }).catch( function( err ){
                            assert( false );
                            done();
                        });
                    });
                });

            });

        });
    });
