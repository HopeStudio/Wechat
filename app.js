'use strict'
var Koa = require('koa');
var config = require('wechat/config');
var wechat = require('./wechat/g');
var weixin = require('weixin');
var app = new Koa();
// 中间件：验证服务器地址的有效性
app.use(wechat(config, weixin.reply));

app.listen(1234);
console.log('listening1234')
