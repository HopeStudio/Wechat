'use strict'
// sha1加密
var sha1 = require('sha1');
// raw-body获取请求体
var getRawBody = require('raw-body');
// 与微信服务器之间的交互
var Wechat = require('./wechat');
// 工具
var util = require('./util');
module.exports = function(config, handler) {
    // 新建一个交互实例
    var wechat = new Wechat(config.wechat);
    // 返回一个generator函数
    return function*(next) {
        // 获取微信服务器POST请求参数
        var signature = this.query.signature,
            echostr = this.query.echostr,
            timestamp = this.query.timestamp,
            nonce = this.query.nonce;
        // 获取配置信息中的token
        var token = config.wechat.token;
        // 将token、时间戳、随机数进行字典排序后合并成字符串str
        var str = [token, timestamp, nonce].sort().join('');
        // 判断微信服务器的请求类型
        if (this.method === "GET") {
            // GET请求，如果加密后的str与签名值相等
            if (sha1(str) === signature)
            // 原样返回echostr
                return this.body = echostr + '';
            else
            // 不等返回error
                return this.body = 'error';
        } else if (this.method === "POST") {
            // POST请求，如果加密后的str与签名值不等
            if (sha1(str) !== signature)
            // 直接返回error
                return this.body = 'error';
            // 如果加密后的str与签名值相等
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
