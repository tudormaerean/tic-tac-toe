var http = require('http');
var url = require('url');
var chai = require('chai');
var SocketController = require('../classes/SocketController');
var routesController = require('../routes/routesController');
var assert = require('assert');
var expect = require('expect');

describe('SocketController', function() {
  it('init method should create a websocket server', function(done) {
    var socketController = new SocketController();
    socketController.startConnectedListener = function() {};
    var server = http.createServer((req, res) => {
      var path = url.parse(req.url).pathname;
      routesController(req, res, path, __dirname);
    });
    // var mockServer = {};
    socketController.init(server);
    expect(socketController.startConnectedListener).toHaveBeenCalled();
  });

  it('create message object method should return a message object', function(done) {
    var type = 'type';
    var text = 'text';
    var player = {};
    var game = {};
    var socketController = new SocketController();
    // var spy = chai.spy(socketController.createMessageObject);
    // socketController.createMessageObject = spy;
    // socketController.createMessageObject = function() {};
    socketController.createMessageObject(type, text, player, game);
    expect(socketController.createMessageObject).toHaveBeenCalled();
    // expect(spy).toEqual({type, text, player, game});
  });
});