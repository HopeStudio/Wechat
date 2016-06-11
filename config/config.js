'use strict'
var path = require('path'),
    util = require('../libs/util');
var wechat_file = path.join(__dirname, './wechat.txt');
module.exports = {
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
