

    "use strict";

    const IoRedis = require("ioredis");


    //IoRedis.Command.setReplyTransformer('hgetall', function (result) {
    //
    //
    //    if (Array.isArray(result)) {
    //        var out = [];
    //        result.forEach(function (value, index) {
    //            if ((index + 1) % 2 === 0) { // value
    //                out[((index + 1) / 2) - 1].value = value;
    //            } else { // field name
    //                out.push({field: value, value: null});
    //            }
    //        });
    //        console.log("====xxxx===",out )
    //        return out;
    //    } else {
    //        return [];
    //    }
    //});

    module.exports =  IoRedis;