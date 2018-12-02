function CEvent() {
  this.callbacks = [];
}

CEvent.prototype.addEventListener = function (callback) {
  this.callbacks.push(callback);
};

CEvent.prototype.removeEventFromCallbacks = function (callback) {
  var filteredCallbacks = this.callbacks.filter(filteredCallback => filteredCallback !== callback)
  this.callbacks = filteredCallbacks;
};

CEvent.prototype.trigger = function () {
  this.callbacks.forEach(callback => callback.apply(null, arguments));
};

module.exports = CEvent;