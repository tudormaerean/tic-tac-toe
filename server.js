var http = require('http');
var url = require('url');
var routesController = require('./src/backend/routes/routesController');
var Main = require('./src/backend/classes/Main');

var port = 3000;

var server = http.createServer((req, res) => {
  var path = url.parse(req.url).pathname;
  routesController(req, res, path, __dirname);
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

var application = new Main();
application.init(server);
