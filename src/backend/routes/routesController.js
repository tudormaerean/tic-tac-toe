var browserify = require('browserify');
var fs = require('fs');

var indexPath = '/public/index.html';
var jsPath = '/src/web/index.js';
var cssPath = '/src/web/styles/main.css';

function errorResponse(res, error) {
  res.writeHead(404);
  res.end(JSON.stringify(error));
}

function dataResponse(res, data, contentType) {
  res.writeHead(200, {
    'Content-Type': contentType
  });
  res.write(data);
  res.end();
}

function routesController(req, res, path, basePath) {
  switch (path) {
    case '/':
      fs.readFile(basePath + indexPath, (error, data) => {
        error ? errorResponse(res, error) : dataResponse(res, data, 'text/html');
      });
      break;
    case '/main.css':
      fs.readFile(basePath + cssPath, (error, data) => {
        error ? errorResponse(res, error) : dataResponse(res, data, 'text/css');
      });
      break;
    case '/bundle.js':
      res.setHeader('content-type', 'application/javascript');
      var browserified = browserify(basePath + jsPath, { debug: true }).bundle();
      browserified.on('error', console.error);
      browserified.pipe(res);
      break;
    default:
      errorResponse(res, '404 - Not found.');
      break;
  }
}

module.exports = routesController;
