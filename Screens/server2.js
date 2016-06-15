

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}
function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
app.use(logger);
app.use(serveStatic('public'));
app.use(hello);
app.listen(3000);
