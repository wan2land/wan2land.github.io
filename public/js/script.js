// anchor.js
anchors.add(".post-content h2, .post-content h3")

// link
document.querySelectorAll("a[href^=\"http://\"]:not([href*=wan2\\.land]), a[href^=\"https://\"]:not([href*=wan2\\.land])").forEach(node => node.setAttribute("target", "_blank"))

// mermaid
mermaid.initialize({ startOnLoad:true })

var toggle = document.querySelector('.sidebar-toggle');
var sidebar = document.querySelector('#sidebar');
var checkbox = document.querySelector('#sidebar-checkbox');

document.addEventListener('click', function(e) {
  var target = e.target;

  if(!checkbox.checked ||
      sidebar.contains(target) ||
      (target === checkbox || target === toggle)) return;

  checkbox.checked = false;
}, false);
