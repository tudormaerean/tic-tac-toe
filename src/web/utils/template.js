function instantiateTemplate(selector) {
  var template = document.querySelector(selector).innerHTML;
  var createElementDiv = document.createElement('div');
  createElementDiv.innerHTML = template;
  return createElementDiv;
}

module.exports = instantiateTemplate;
