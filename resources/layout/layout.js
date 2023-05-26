window.addEventListener('load', function() {
  var container = document.getElementById('container');
  var dragbar = document.getElementById('dragbar');
  var left = document.getElementById('left');
  var right = document.getElementById('right');
  var isDragging = false;

  dragbar.addEventListener('mousedown', function(e) {
    isDragging = true;
  });

  window.addEventListener('mouseup', function(e) {
    isDragging = false;
  });

  window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    var containerRect = container.getBoundingClientRect();
    var containerWidth = containerRect.width;
    var leftWidth = e.clientX - containerRect.left;

    left.style.width = leftWidth + 'px';
    right.style.width = containerWidth - leftWidth - dragbar.offsetWidth + 'px';
  });
});
