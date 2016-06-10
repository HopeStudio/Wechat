'use strict'
var xml2js = require('xml2js');
var Promise = require('bluebird');

exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml, { trim: true }, function(err, content) {
            if (err)
                reject(err)
            else
                resolve(content)
        });
    })
}
exports.formatMessage = function(re) {
    var message = {};
    if (typeof re === 'object') {
        var keys = Object.keys(re);
        for (var i = 0, l = keys.length; i < l; i++) {
            var item = re[keys[i]];
            var key = keys[i];
            if (!(item instanceof Array) || item.length === 0)
                continue;
            if (item.length === 1) {
                var val = item[0];
                if (typeof val === 'object')
                    message[key] = formatMessage(val)
                else
                    message[key] = (val || '').trim();
            } else {
                message[key] = [];
                for (var j = 0, k = item.length; j < k; j++) {
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}