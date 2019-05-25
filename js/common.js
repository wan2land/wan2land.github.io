;(function(global, $){
  // Disqus
  (function() {
  var d = document, s = d.createElement("script");
  s.src = "https://wan2land.disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
  })();

  // GA
  (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,"script","//www.google-analytics.com/analytics.js","ga")

  ga("create", "UA-35736735-1", "wani.kr")
  ga("send", "pageview")

  // anchor
  anchors.add("h2")

  // link
  $("a[href^=\"http://\"], a[href^=\"https://\"]").not("a[href*=wani\\.kr]").attr("target", "_blank")

  // linkenums
  $("pre > code").each(function() {
    var lines = this.innerHTML.split("\n")
    if (lines.length > 5) {
      var i
      var ol = "<ol class=\"linenums\">"
      for (i in lines) {
        ol += "<li>" + lines[i] + "</li>"
      }
      this.innerHTML = ol
      $(this).addClass("linenums")
    }
  })

  // mermaid
  mermaid.initialize({startOnLoad:true})
})(this, jQuery)
