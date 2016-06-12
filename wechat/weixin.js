'use strict'
var config = require('../config/config');
var Wechat = require('./wechat');
var wechatApi = new Wechat(config.wechat);
exports.reply = function*(next) {
    var message = this.weixin;
    if (message.MsgType === 'event') {
        switch (message.Event) {
            case 'subscribe':
                // if (message.EventKey) {
                //     console.log("扫二维码进来" + message.EventKey + "," + message.ticket);
                // }
                this.body = '欢迎关注One干货集中营!!!';
                break;
            case 'unsubscribe':
                console.log('取消关注...');
                this.body = '';
                break;
            case 'LOCATION':
                this.body = '当前地理位置' + '经度：' + message.Longitude + '纬度:' + message.Latitude;
                break;
            case 'CLICK':
                this.body = '点击了菜单:' + message.EventKey;
                break;
            case 'SCAN':
                console.log('关注后扫二维码:' + message.EventKey + '' + message.Ticket);
                this.body = '看到你扫了一下哦'
                break;
            case 'VIEW':
                this.body = '点击了菜单中的链接:' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        console.log('hi')
        var content = message.Content;
        var reply = '额，你说的' + content + '太复杂';
        switch (content) {
            case '1':
                reply = '1';
                break;
            case '2':
                reply = '2';
                break;
            case '3':
                reply = [{
                    title: '我是标题1',
                    description: '我是个描述呀',
                    picUrl: 'https://img.alicdn.com/tps/TB1JR.TJVXXXXarXXXXXXXXXXXX-321-80.jpg',
                    url: 'http://yowangbin.com'
                }, {
                    title: '我是标题2',
                    description: '我是个描述呀',
                    picUrl: 'https://img.alicdn.com/tps/TB19hmwJVXXXXafXVXXXXXXXXXX-321-80.jpg'
                }];
                break;
            case '4':
                var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
                reply = {
                    type: 'image',
                    mediaId: data.media_id
                }
                console.log(reply)
                break;
        }
        this.body = reply;
    }
    yield next;
}
