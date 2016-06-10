'use strict'
var sha1 = require('sha1');
var getRawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');
module.exports = function(config) {
    var wechat = new Wechat(config.wechat);
    return function*(next) {
        var signature = this.query.signature,
            echostr = this.query.echostr,
            timestamp = this.query.timestamp,
            nonce = this.query.nonce,
            token = config.wechat.token;
        var str = [token, timestamp, nonce].sort().join('');
        if (this.method === "GET") {
            if (sha1(str) === signature)
                return this.body = echostr + '';
            else
                return this.body = 'error';
        } else if (this.method === "POST") {
            if (sha1(str) !== signature) {
                this.body = 'wrong';
                return false;
            }
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            });
            var content = yield util.parseXMLAsync(data);
            var message = util.formatMessage(content.xml);
            this.weixin = message;
            yield handler.call(this, next);
            wechat.reply.call(this);
        }
    }
}
