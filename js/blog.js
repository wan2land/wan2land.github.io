;(function(global, $){

    'use strict';

    //Disqus
    var disqus_shortname = global.disqus_shortname = 'wan2land';

    var s = document.createElement('script');
    s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    document.getElementsByTagName('HEAD')[0].appendChild(s);

    //Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-35736735-1', 'wani.kr');
    ga('send', 'pageview');

    $('a[href^="http://"]').not('a[href*=wani\\.kr]').attr('target','_blank');
    $('pre > code').each(function() {
        var $this = $(this);
        var options = $this.data('lang');
        if (options && options !== 'text') {
            options = options.split(',');
            $this.addClass('prettyprint lang-' + options[0]);
            if (options[1] && options[1] === 'linenums') {
                $this.addClass('linenums');
            }
        }
    });

    prettyPrint();

})(this, jQuery);