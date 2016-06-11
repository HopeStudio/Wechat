'use strict'
// bluebird模块
var Promise = require('bluebird');
// request模块
var request = Promise.promisify(require('request'));
var util = require('./util');
var fs = require('fs');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'
};

function Wechat(config) {
    var self = this;
    this.AppID = config.AppID;
    this.AppSecret = config.AppSecret;
    this.getAccessToken = config.getAccessToken;
    this.saveAccessToken = config.saveAccessToken;
    this.fetchAccessToken();
};
// 检查票据的有效性
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
// 更新票据
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
// 获取票据
Wechat.prototype.fetchAccessToken = function() {
    var self = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this))
            return new Promise.resolve(this);
    }
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
            return new Promise.resolve(data);
        });
}

Wechat.prototype.reply = function() {
    var content = this.body;
    var message = this.weixin;
    var xml = util.tpl(content, message);
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
}
Wechat.prototype.uploadMaterial = function(type, fpath) {
    // 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
    var self = this;
    var form = {
        media: fs.createReadStream(fpath)
    }
    return new Promise(function(resolve, reject) {
        self
            .fetchAccessToken()
            .then(function(data) {
                var url = api.upload + "access_token=" + data.access_token + "&type=" + type;
                request({ method: "POST", url: url, formData: form, json: true })
                    .then(function(response) {
                        var _data = response[1];
                        if (_data) {
                            resolve(_data);
                        } else {
                            throw new Error('资源上传失败');
                        }
                    })
                    .catch(function(err) {
                        reject(err);
                    })
            })
    })
}

module.exports = Wechat;
