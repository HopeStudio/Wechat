function* helloWorldGenerator() {
    var b = yield 'hello';
    console.log(b)
    var a = yield 'world';
    console.log(a)
    return a;
}

var hw = helloWorldGenerator();
console.log(hw.next())
console.log(hw.next('hii'))
console.log(hw.next('hiiii'))
