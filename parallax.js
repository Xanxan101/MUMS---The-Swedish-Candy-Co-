(function () {
    function tick() {
      var y = window.scrollY || window.pageYOffset || 0;
      var nodes = document.querySelectorAll('[data-px]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var speed = parseFloat(el.getAttribute('data-px')) || 0;
        var rot = el.getAttribute('data-rot') || '0deg';
        el.style.transform = 'translate3d(0,' + (y * speed).toFixed(1) + 'px,0) rotate(' + rot + ')';
      }
    }
    window.__mumsPxTick = tick;
    if (!window.__mumsPxBound) {
      window.__mumsPxBound = true;
      var relay = function () {
        if (window.__mumsPxTick) window.__mumsPxTick();
      };
      window.addEventListener('scroll', relay, { passive: true });
      window.addEventListener('resize', relay, { passive: true });
    }
    [0, 60, 200, 600, 1500, 3000].forEach(function (ms) { setTimeout(tick, ms); });
  })();
