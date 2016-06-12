var koa = require('koa');
var app = koa();

// x-response-time

app.use(function*(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log(1)
});

// logger

app.use(function*(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log(2)
});

// response

app.use(function*() {
    console.log(3)
    this.body = 'Hello World';
});

app.listen(3000);
