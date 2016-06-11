'use strict'
// bluebird模块
var Promise = require('bluebird');
// request模块
var request = Promise.promisify(require('request'));

var util = require('./util')
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};

function Wechat(config) {
    var self = this;
    this.AppID = config.AppID;
    this.AppSecret = config.AppSecret;
    this.getAccessToken = config.getAccessToken;
    this.saveAccessToken = config.saveAccessToken;
    this.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return self.updateAccessToken();
            }
            if (self.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return self.updateAccessToken();
            }
        })
        .then(function(data) {
            self.access_token = data.access_token;
            self.expires_in = data.expires_in;
            self.saveAccessToken(data);
        });
};
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = new Date().getTime();
    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
};
Wechat.prototype.updateAccessToken = function(data) {
    var AppID = this.AppID;
    var AppSecret = this.AppSecret;
    var url = api.accessToken + '&appid=' + AppID + '&secret=' + AppSecret;
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true }).then(function(response) {
            var data = response[1];
            var now = new Date().getTime();
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        });
    })
};
Wechat.prototype.reply = function() {
    var content = this.body;
    var message = this.weixin;
    var xml = util.tpl(content, message);
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
}
module.exports = Wechat;
