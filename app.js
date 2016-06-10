'use strict'
var Koa = require('koa'),
    sha1 = require('sha1'),
    path = require('path'),
    util = require('./libs/util'),
    wechat = require('./wechat/g');
var wechat_file = path.join(__dirname, './config/wechat.txt');
var config = {
    wechat: {
        AppID: 'wx197d2fe43e9c42b7',
        AppSecret: '7267d53a960d9d1817d779fddbf3d68c',
        token: 'yowangbin',
        getAccessToken: function() {
            return util.readFileAsync(wechat_file, 'utf-8');
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
};

var app = new Koa();
// 中间件：验证服务器地址的有效性
app.use(wechat(config));

app.listen(1234);
console.log('listening1234')
