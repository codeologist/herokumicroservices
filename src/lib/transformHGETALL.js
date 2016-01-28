
    "use strict";

    /**
     * Transform redis HGETALL output to field/value pair objects.
     * @param {String[]} result
     * @returns {{field:string, value:string}[]}
     */
    function transformHGETALL (result) {
        if (Array.isArray(result)) {
            var out = [];
            result.forEach(function (value, index) {
                if ((index + 1) % 2 === 0) { // value
                    out[((index + 1) / 2) - 1].value = value;
                } else { // field name
                    out.push({field: value, value: null});
                }
            });
            return out;
        } else {
            return [];
        }
    }

    module.exports = transformHGETALL;