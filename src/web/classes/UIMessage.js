function UIMessage() {
  this.message;
  this.messageDiv;
  this.gameMessageDiv;
}

UIMessage.prototype.init = function () {
  this.messageDiv = document.getElementById('messagesContent');
  this.gameMessageDiv = document.getElementById('gameMessagesContent');
};

UIMessage.prototype.displayMessage = function (text) {
  var newMessageDiv = document.createElement('div');
  newMessageDiv.innerText = text;
  this.messageDiv.append(newMessageDiv);
  this.messageDiv.scrollTop = this.messageDiv.scrollHeight;
};

UIMessage.prototype.displayGameMessages = function (text) {
  this.gameMessageDiv.innerText = text;
};

module.exports = UIMessage;
