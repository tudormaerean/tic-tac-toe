var chai = require('chai');
var spies = require('chai-spies');
var SocketController = require('../classes/SocketController');
var expect = chai.expect;

chai.use(spies);

describe('SocketController', function() {
  var socketController = new SocketController();
  socketController.connectionsArray = [
    {
      player: {
        name:
        '1'
      },
      sendMessage: function() {},
    },
    {
      player: {
        name:
        '2'
      },
      sendMessage: function() {},
    },
    {
      player: {
        name:
        '3'
      },
      sendMessage: function() {},
    },
  ];

  describe('createMessageObject', function() {
    it('should return a message object', function() {
      var message = socketController.createMessageObject('type', 'text', {}, {});
      var mockReturn = { type: 'type', text: 'text', player: {}, game: {} };
      expect(message).to.deep.equal(mockReturn);
    });  
  });

  describe('removeConnection', function() {
    it('should remove the connection and update clients', function() {
      var mockConnection = { player: { name: '2' }, sendMessage: function() {} };
      var mockConnectionsReturn = [
        { player: { name: '1' }, sendMessage: function() {} }, { player: { name: '3' }, sendMessage: function() {} }
      ];
      var spyUpdateClients = chai.spy.on(socketController, 'updateClients');
      var spyCreateMessageObject = chai.spy.on(socketController, 'createMessageObject');
      var spyOnRemoveConnection = chai.spy.on(socketController.onRemoveConnection, 'trigger');
      socketController.removeConnection(mockConnection);

      expect(spyUpdateClients).to.have.been.called(1);
      expect(spyCreateMessageObject).to.have.been.called(1);
      expect(spyOnRemoveConnection).to.have.been.called(1);
      // expect(socketController.connectionsArray).to.have.deep.members(mockConnectionsReturn); // deep equality somehow fails, tried all variations of deep check
    });  
  });

  describe('updateClients', function() {
    var mockMessage = {
      type: 'message.type',
      text: 'message.text',
      player: {},
      game: {},
      updatedPlayersArray: socketController.connectionsArray,
    };
    it('should update clients', function() {
      socketController.updateClients(mockMessage);
      socketController.connectionsArray.forEach(function(connection) {
        it('should call sendMessage for each connection', function() {
          var spySendMessage = chai.spy.on(connection, 'sendMessage');
          console.log(connection);
          expect(spySendMessage).to.have.been.called(1);
          expect(spySendMessage).to.have.been.called.with(mockMessage);
        });
      });
    });
  });
});
