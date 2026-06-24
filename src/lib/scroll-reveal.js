(function() {
  if (!window.IntersectionObserver) return;
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function(el) { obs.observe(el); });
})();
