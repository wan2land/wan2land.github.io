// GA
(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,"script","//www.google-analytics.com/analytics.js","ga")

ga("create", "UA-35736735-1", "wan2.land")
ga("send", "pageview")

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
