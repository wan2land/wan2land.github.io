;(function(global, $){
  // GA
  (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,"script","//www.google-analytics.com/analytics.js","ga")

  ga("create", "UA-35736735-1", "wani.kr")
  ga("send", "pageview")

  // anchor.js
  anchors.add("h2")

  // link
  $("a[href^=\"http://\"], a[href^=\"https://\"]").not("a[href*=wani\\.kr]").attr("target", "_blank")

  // mermaid
  mermaid.initialize({ startOnLoad:true })
})(this, jQuery)
