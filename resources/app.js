function convertMarkdownToList(markdownText) {
  const lines = markdownText.split('\n');
  let html = [];
  let currentIndentation = 0;
  let currentIndex = 0;
  var isNumFstList=false;

  function processNestedList(indentation) {
    let nestedHtml = [];
    var isNumList=false;
    var reg = new RegExp("^\t{"+indentation+"}[0-9]+\. (?=.+)");
    var reg1 = new RegExp("^\t{"+(indentation+1)+"}[0-9]+\. (?=.+)");
    while (currentIndex < lines.length) {
      const line = lines[currentIndex];
      if (line.startsWith('\t'.repeat(indentation) + '- ')) {
        const listItem = line.substring(indentation + 2).trim();
        var liElement=document.createElement('li');
        liElement.textContent=listItem;
        nestedHtml.push(liElement);
        currentIndex++;
      } else if (line.startsWith('\t'.repeat(indentation + 1) + '- ')||line.match(reg1)) {
        nestedHtml.push(processNestedList(indentation + 1));
      } else if(line.match(reg)){
        isNumList=true;
        const listItem = line.substring(line.match(reg)[0].length).trim();
        var liElement=document.createElement('li');
        liElement.textContent=listItem;
        nestedHtml.push(liElement);
        currentIndex++;
      }else {
        break;
      }
    }

    if (isNumList){
      var retElem=document.createElement('ol');
      for (const elem of nestedHtml){
        retElem.appendChild(elem);
      }
      return retElem;
    }else{
      var retElem=document.createElement('ul');
      for (const elem of nestedHtml){
        retElem.appendChild(elem);
      }
      return retElem;
    }
  }
  while (currentIndex < lines.length) {
    const line = lines[currentIndex];

    if (line.startsWith('- ')) {
      const listItem = line.substring(2).trim();
      var liElement=document.createElement('li');
      liElement.textContent=listItem;
      html.push(liElement);
      currentIndex++;
    }else if(line.match(/^[0-9]+\. (?=.+)/)){
      isNumFstList=true;
      const listItem = line.substring(line.match(/^[0-9]+\. (?=.+)/)[0].length).trim();
      var liElement=document.createElement('li');
      liElement.textContent=listItem;
      html.push(liElement);
      currentIndex++;
    } else if (line.startsWith('\t- ')||line.match(/^\t[0-9]+\. (?=.+)/)) {
      html.push(processNestedList(1));
    } else {
      currentIndex++;
    }
  }

  if (isNumFstList){
    var retElem=document.createElement('ol');
    for (const elem of html){
      retElem.appendChild(elem);
    }
    return retElem;
  }else{
    var retElem=document.createElement('ul');
    for (const elem of html){
      retElem.appendChild(elem);
    }
    return retElem;
  }
}

function showContextMenu(element) {
  window.api.showContextMenu(element.id);
}

function addElementForward(element) {
  let new_element = document.createElement('textarea');
  new_element.value = "text";
  new_element.onkeydown = function( e ){ OnTabKey( e, this ); }
  new_element.addEventListener("blur", function(event) {
    selectColumnType(element = event.target);
  });
  element.before(new_element);
  element.focus();
}

function addElementBehind(element) {
  let new_element = document.createElement('textarea');
  new_element.value = "text";
  new_element.onkeydown = function( e ){ OnTabKey( e, this ); }
  new_element.addEventListener("blur", function(event) {
    selectColumnType(element = event.target);
  });
  element.after(new_element);
  element.focus();
}

function OnTabKey( e, obj ){
  if( e.keyCode!=9 ){ return; }
  e.preventDefault();

  var cursorPosition = obj.selectionStart;
  var cursorLeft     = obj.value.substr( 0, cursorPosition );
  var cursorRight    = obj.value.substr( cursorPosition, obj.value.length );

  obj.value = cursorLeft+"\t"+cursorRight;
  obj.selectionEnd = cursorPosition+1;
}

function selectColumnType(element) {
  var text
  if (element.value.startsWith("# ")) {
    element.setAttribute('name', 'H1');
    text = element.value.substr(2);
  } else if (element.value == "#t") {
    element.setAttribute('name', 'TABLE');
    text = "";
  } else if(element.value.startsWith("- ")||element.value.startsWith("1. ")){
    element.setAttribute('name', 'LIST');
    text = element.value;
  }else if (element.value == "") {
    element.remove();
    return 0;
  } else {
    element.setAttribute('name', 'P');
    text = element.value;
  }
  convertToText(element = element, value = text)
}

function convertToTextarea(element) {
  var text = element.textContent.trim();

  var textarea = document.createElement("textarea");
  textarea.onkeydown = function( e ){ OnTabKey( e, this ); }
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

function createElementsFromHTML(htmlString) {
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlString;
  return tempContainer.children;
}

function htmlSpecialChars(unsafeText){
  var text = document.createTextNode(unsafeText);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
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
    newTextElement.setAttribute('oncontextmenu', "showContextMenu(this)");
    newTextElement.setAttribute('name', element.name);
    newTextElement.setAttribute('id', getid);
    parent.replaceChild(newTextElement, element);
  } else if (element.name === "P") {
    newTextElement = document.createElement("p");
    newTextElement.textContent = text;
    newTextElement.setAttribute('ondblclick', "convertToTextarea(this)");
    newTextElement.setAttribute('oncontextmenu', "showContextMenu(this)");
    newTextElement.setAttribute('name', element.name);
    newTextElement.setAttribute('id', getid);
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
  } else if (element.name === "LIST"){
    newTextElement = convertMarkdownToList(text);
    newTextElement.setAttribute('name', element.name);
    newTextElement.setAttribute('id', getid);
    parent.replaceChild(newTextElement, element);
  }
  
}

window.api.on('addForward', (event, elementID)=>{
  addElementForward(document.getElementById(elementID));
});

window.api.on('addBehind', (event, elementID)=>{
  addElementBehind(document.getElementById(elementID));
});
