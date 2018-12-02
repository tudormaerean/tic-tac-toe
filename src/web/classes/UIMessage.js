function UIMessage() {
  this.message;
  this.messageDiv;
}

UIMessage.prototype.init = function() {
  this.messageDiv = document.getElementById('messagesContent');
};

UIMessage.prototype.displayMessage = function(message) {
  var newMessageDiv = document.createElement('div');
  newMessageDiv.innerText = message;
  this.messageDiv.append(newMessageDiv);
  this.messageDiv.scrollTop = this.messageDiv.scrollHeight;
};

module.exports = UIMessage;
