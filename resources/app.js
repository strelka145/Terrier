function addElement(element) {
  let new_element = document.createElement('textarea');
  new_element.setAttribute('name', 'P');
  new_element.value = "text"
  new_element.addEventListener("blur", function(event) {
    selectColumnType(element = event.target);
  });
  element.after(new_element);
  element.focus();
}

function selectColumnType(element) {
  var text
  if (element.value.startsWith("# ")) {
    element.setAttribute('name', 'H1');
    text = element.value.substr(2);
  } else if (element.value = "#t") {
    element.setAttribute('name', 'TABLE');
    text = "";
  } else {
    element.setAttribute('name', 'P');
    text = element.value;
  }
  convertToText(element = element, value = text)
}

function convertToTextarea(element) {
  var text = element.textContent.trim();

  var textarea = document.createElement("textarea");
  textarea.setAttribute('name', element.tagName);
  textarea.value = text;
  textarea.addEventListener("blur", function(event) {
    convertToText(element = event.target, value = textarea.value);
  });

  element.parentNode.replaceChild(textarea, element);
  textarea.focus();
}

function getRandomID() {
  idBase64 = "id" + btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(40)))).substring(0, 40);
  idHtml = idBase64.replace(/=/g, '.').replace(/\//g, '_').replace(/\+/g, '-');
  return idHtml;
}

function convertToText(element, value) {
  var text = value.trim();
  if (element.name === "H1" || element.name === "P") {
    element.textContent = text;
  }

  var parent = element.parentNode;
  var newTextElement;
  var getid = getRandomID()
  if (element.name === "H1") {
    newTextElement = document.createElement("h1");
    newTextElement.textContent = text;
    newTextElement.setAttribute('ondblclick', "convertToTextarea(this)");
    newTextElement.setAttribute('oncontextmenu', "addElement(this)");
    newTextElement.setAttribute('name', element.name);
    parent.replaceChild(newTextElement, element);
  } else if (element.name === "P") {
    newTextElement = document.createElement("p");
    newTextElement.textContent = text;
    newTextElement.setAttribute('ondblclick', "convertToTextarea(this)");
    newTextElement.setAttribute('oncontextmenu', "addElement(this)");
    newTextElement.setAttribute('name', element.name);
    parent.replaceChild(newTextElement, element);
  } else if (element.name === "TABLE") {
    newTextElement = document.createElement("div");
    newTextElement.setAttribute('name', element.name);
    newTextElement.setAttribute('id', getid);
    parent.replaceChild(newTextElement, element);
    var data = [['', '', ''], ['', '', '']];
    jspreadsheet(document.getElementById(getid), {
      data: data,
      columns: [
        { type: 'text' },
        { type: 'text' },
        { type: 'text' }
      ]
    });
  }



}
