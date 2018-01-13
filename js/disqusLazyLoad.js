(function() {
  'use strict';

  function disqusLazyLoad(shortname) {
    var element = document.querySelector('#disqus_thread');

    if (!element) {
      return;
    }

    element.style.minHeight = '330px';

    if (typeof IntersectionObserver !== 'undefined') {
      var observer = new IntersectionObserver(function(entries, observer) {
        var intersectingEntries = entries.filter(function(entry) {
          return entry.isIntersecting;
        });

        if (intersectingEntries.length) {
          embedDisqus(shortname);
          observer.disconnect();
        }
      });

      observer.observe(element);
    } else {
      var timeout;
      var verify = function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          var position = element.getBoundingClientRect().top;

          if (position < window.innerHeight) {
            embedDisqus(shortname);
            window.removeEventListener('scroll', verify);
            window.removeEventListener('resize', verify);
          }
        }, 50);
      };

      window.addEventListener('scroll', verify);
      window.addEventListener('resize', verify);

      verify();
    }
  }

  function embedDisqus(shortname) {
    var script = document.createElement('script');
    script.src = 'https://' + shortname + '.disqus.com/embed.js';
    script.async = true;
    script.setAttribute('data-timestamp', +new Date());
    document.body.appendChild(script);
  }

  window.disqusLazyLoad = disqusLazyLoad;
})();