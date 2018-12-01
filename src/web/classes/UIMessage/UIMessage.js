function UIMessage() {
  this.message;
  this.messageDiv;
}

UIMessage.prototype.init = function() {
  this.messageDiv = document.getElementById('messagesContent');
}

UIMessage.prototype.displayMessage = function(message) {
  this.messageDiv.innerHTML = message;
  setTimeout(() => {
    this.messageDiv.innerHTML = null;
  }, 2000);
}

module.exports = UIMessage;
