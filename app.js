/* MUMS — interactions for the exported static pages */
(function () {
  'use strict';

  /* ---------- Product gallery ---------- */
  var shots = [
    'assets/menu-gelatin-free.jpg',
    'assets/product-all-in-one-bucket.png',
    'assets/section-what-makes-mums-special.png',
    'assets/product-marshmallow-squares.png',
    'assets/section-made-in-sweden.png'
  ];
  var main = document.getElementById('mainShot');
  var thumbs = [].slice.call(document.querySelectorAll('[data-thumb]'));
  thumbs.forEach(function (el) {
    el.addEventListener('click', function () {
      var i = +el.getAttribute('data-thumb');
      if (main) main.src = shots[i];
      thumbs.forEach(function (t, n) {
        t.style.boxShadow = n === i ? '0 0 0 3px #241f1a' : '0 0 0 1px #eadfc7';
      });
    });
  });

  /* ---------- TikTok clip rail ---------- */
  var rail = document.getElementById('clipRail');
  [].slice.call(document.querySelectorAll('[data-clip]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (rail) rail.scrollBy({ left: 448 * +btn.getAttribute('data-clip'), behavior: 'smooth' });
    });
  });

  /* ---------- Size, plan, quantity, totals ---------- */
  var sizeRows = [].slice.call(document.querySelectorAll('.size-row'));
  var planCards = [].slice.call(document.querySelectorAll('[data-plan-card]'));
  var state = { price: 34.99, was: 54.98, plan: 'once', qty: 1 };

  function money(n) { return '$' + n.toFixed(2); }

  function paint(nodes, active, radioSel) {
    nodes.forEach(function (n) {
      var on = n === active;
      n.style.background = on ? '#fffdf6' : '#fbf6e9';
      n.style.boxShadow = '0 0 0 ' + (on ? '2px #241f1a' : '1px #eadfc7');
      if (!radioSel) return;
      var dot = n.querySelector(radioSel);
      if (!dot) return;
      dot.style.border = '2px solid ' + (on ? '#241f1a' : '#c9bda7');
      dot.style.background = on ? '#ff9000' : 'transparent';
      dot.style.boxShadow = on ? 'inset 0 0 0 3px #fffdf6' : 'none';
    });
  }

  function render() {
    var unit = state.plan === 'sub' ? state.price * 0.85 : state.price;
    var total = unit * state.qty;
    var was = state.was * state.qty;
    var pct = Math.min(100, (total / 59) * 100);

    [].slice.call(document.querySelectorAll('.total')).forEach(function (el) {
      el.textContent = money(total);
    });
    var qv = document.getElementById('qtyVal');
    if (qv) qv.textContent = state.qty;
    var tw = document.getElementById('totalWas');
    if (tw) tw.textContent = money(was);
    var sv = document.getElementById('savings');
    if (sv) {
      sv.textContent = 'You save ' + money(was - total) +
        (state.plan === 'sub' ? ' incl. 15% subscriber discount' : ' vs. buying loose');
    }
    var bar = document.getElementById('shipBar');
    if (bar) {
      bar.style.width = pct.toFixed(0) + '%';
      bar.style.background = pct >= 100 ? '#00bfa8' : '#ff9000';
    }
    var lbl = document.getElementById('shipLabel');
    if (lbl) {
      lbl.textContent = total >= 59
        ? '\uD83C\uDF89 Free shipping unlocked'
        : 'Add ' + money(59 - total) + ' more for free shipping';
    }
  }

  sizeRows.forEach(function (row) {
    row.addEventListener('click', function () {
      state.price = parseFloat(row.getAttribute('data-price'));
      state.was = parseFloat(row.getAttribute('data-was'));
      paint(sizeRows, row, '.size-radio');
      render();
    });
  });

  planCards.forEach(function (card) {
    card.addEventListener('click', function () {
      state.plan = card.getAttribute('data-plan-card');
      paint(planCards, card, null);
      render();
    });
  });

  [].slice.call(document.querySelectorAll('[data-qty]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.qty = Math.max(1, Math.min(9, state.qty + (+btn.getAttribute('data-qty'))));
      render();
    });
  });

  /* ---------- Review sorting ---------- */
  var ORDERS = {
    recent: [1, 2, 3, 4, 5, 6],
    highest: [1, 2, 4, 5, 3, 6],
    lowest: [5, 6, 1, 2, 3, 4],
    'pics-only': [1, 2, 3, 4, 5, 6],
    'pics-first': [1, 2, 4, 3, 5, 6],
    'videos-first': [2, 1, 4, 3, 5, 6],
    helpful: [2, 1, 5, 3, 4, 6]
  };
  var HAS_PHOTOS = [true, true, false, true, false, false];
  var sort = document.getElementById('sortSelect');
  if (sort) {
    sort.addEventListener('change', function () {
      var order = ORDERS[sort.value] || ORDERS.recent;
      [].slice.call(document.querySelectorAll('.review')).forEach(function (el) {
        var i = +el.getAttribute('data-review');
        el.style.order = order[i];
        el.style.display = (sort.value === 'pics-only' && !HAS_PHOTOS[i]) ? 'none' : 'flex';
      });
    });
  }

  if (sizeRows.length) render();
})();
