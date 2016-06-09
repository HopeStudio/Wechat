'use strict'
var Koa = require('koa'),
    sha1 = require('sha1');
var config = {
    wechat: {
        AppID: 'wx197d2fe43e9c42b7',
        AppSecret: '7267d53a960d9d1817d779fddbf3d68c',
        token: 'yowangbin'
    }
};
// { signature: 'df737dc55a7bc612a114b5e4a6052134c8060a3f',
//   echostr: '4469749067976388605',
//   timestamp: '1465461613',
//   nonce: '82235853' }
var app = new Koa();
app.use(function*(next) {
    var signature = this.query.signature,
        echostr = this.query.echostr,
        timestamp = this.query.timestamp,
        nonce = this.query.nonce,
        token = config.wechat.token;
    var str = [token, timestamp, nonce].sort().join('');
    if (sha1(str) === signature)
        return this.body = echostr + '';
    else
        return this.body = 'error';
    // console.log(this.query)
})
app.listen(1234);
console.log('listening1234')
