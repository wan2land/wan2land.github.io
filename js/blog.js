;(function(global, $){

    'use strict';

    //Disqus
    var disqus_shortname = global.disqus_shortname = 'wan2land';

    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);


    //Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-35736735-1', 'wani.kr');
    ga('send', 'pageview');

    $('a[href^="http://"]').not('a[href*=wani\\.kr]').attr('target','_blank');
    $('pre > code').each(function() {
        var lines = this.innerHTML.split("\n");
        if (lines.length > 5) {
            var i;
            var ol = '<ol class="linenums">';
            for (i in lines) {
                ol += '<li>' + lines[i] + '</li>';
            }
            this.innerHTML = ol;
            $(this).addClass('linenums');
        }
    });

})(this, jQuery);