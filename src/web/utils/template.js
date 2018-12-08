function instantiateTemplate(selector) {
  var template = document.querySelector(selector).innerHTML;
  var createdElementDiv = document.createElement('div');
  createdElementDiv.innerHTML = template;
  return createdElementDiv.firstElementChild;
}

module.exports = instantiateTemplate;
