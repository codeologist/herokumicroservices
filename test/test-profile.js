

"use strict";

var assert = require('assert');
var fetch = require('../src/lib/fetch');
var authenticate = require('../src/services/authenticate');
var nuke = require('../src/lib/nuke');
const transformHGETALL = require("../src/lib/transformHGETALL");



const IoRedis = require("../src/lib/redis");

const DB = {
    port:       process.env.REDISCLOUD_PORT,
    host:       process.env.REDISCLOUD_ENDPOINT,
    password:   process.env.REDISCLOUD_PASSWORD,
    family:     4,
    db:         0
};



describe('profile', function() {

    it('should return a 200', function (done) {
        nuke().then( function(){
            authenticate.persitAuthToken("tokenname","alice", 60 * 15 ).then( function(){

                fetch( "http://localhost:5000/profile", {
                    'token': 'tokenname',
                    'appname':'testapp',
                    'name':'Alice Malice'

                }).then( function( result ){
                    assert.equal( result.statusCode, 200 );

                    new IoRedis( DB ).hgetall( "PROFILE:ALICE", function ( err, obj ) {

                        if ( err ){
                            assert(false);
                        }

                        if ( obj ){
                            assert.equal( obj.name, "Alice Malice");
                            assert( !obj.token );
                            done();
                        }
                    });
                }).catch( function( err ){
                    assert( false );
                    done();
                });
            });
        });
    });


    it('should return a status 200 and an object representing a user profile', function (done) {
        nuke().then( function(){
            authenticate.persitAuthToken("tokenname","alice", 60 * 15 ).then( function(){

                var profile = {
                    "name":"Alice Malice"
                };
                new IoRedis( DB ).hmset( "PROFILE:ALICE", profile, function ( err, obj ) {

                    if ( err ){
                        assert(false);
                    }

                    if ( obj ){

                        fetch( "http://localhost:5000/profile", {
                            'token': 'tokenname',
                            'appname': 'testapp'
                        }, null, "GET").then( function( profile ){
                            assert.equal( profile.data.name, "Alice Malice");
                            done();
                        }).catch( function( err ){
                            assert( false );
                            done();
                        });

                    }
                });
            });
        });
    });




});