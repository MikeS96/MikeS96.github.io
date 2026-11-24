// Publication thumbnails: each row's still image swaps to its animated GIF.
//   - mouse: on hover (as before)
//   - touch: when the thumbnail scrolls into view (tapping still works too)
// GIFs are only downloaded the first time they are shown, and restart from their
// first frame on every reveal. Scroll-to-play is skipped for prefers-reduced-motion.
(function () {
  var rows = document.querySelectorAll('tr.thumb-row');
  if (!rows.length) return;

  function show(row) {
    var box = row.querySelector('.two');
    if (!box) return;
    var img = box.querySelector('img[data-src]');
    if (img) {
      img.src = '';                               // re-assigning restarts the GIF
      img.src = img.getAttribute('data-src');
    }
    box.classList.add('on');
  }

  function hide(row) {
    var box = row.querySelector('.two');
    if (box) box.classList.remove('on');
  }

  rows.forEach(function (row) {
    row.addEventListener('mouseenter', function () { show(row); });
    row.addEventListener('mouseleave', function () { hide(row); });
  });

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canHover || reduceMotion || !('IntersectionObserver' in window)) return;

  // Observe the thumbnail itself (rows can be taller than the screen on phones).
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var row = entry.target.closest('tr.thumb-row');
      if (!row) return;
      if (entry.isIntersecting) show(row); else hide(row);
    });
  }, { threshold: 0.6 });

  rows.forEach(function (row) {
    var thumb = row.querySelector('.aligned, .one') || row.querySelector('.two');
    if (thumb) observer.observe(thumb);
  });
})();
