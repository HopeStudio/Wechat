'use strict'
// koa框架
var Koa = require('koa');
// 配置信息
var config = require('./config/config');
// 处理与微信服务器之间的交互
var wechat = require('./wechat/g');
// 回复的策略
var weixin = require('./wechat/weixin');

// 新建一个koa实例
var app = new Koa();
// 验证服务器地址的有效性
app.use(wechat(config, weixin.reply));

// 监听1234端口
app.listen(1234);
console.log('listening:1234')
