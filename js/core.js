/* ============================================================================
   Bạc Hải Yến — Thư viện dùng chung
   ----------------------------------------------------------------------------
   File này chạy trên mọi trang. Nó chịu trách nhiệm:
     - Nạp cấu hình thương hiệu và file catalog
     - Định dạng giá tiền VND
     - Quản lý giỏ hàng, yêu thích, sản phẩm đã xem (lưu trên máy khách)
     - Dựng khung header, footer, drawer dùng chung
     - Hiện khung giữ chỗ khi ảnh chưa có
     - Thông báo nhanh (toast) và hộp xem ảnh lớn (lightbox)

   NGUYÊN TẮC QUAN TRỌNG:
   Giỏ hàng lưu trên máy khách chỉ là tiện ích giữ chỗ trong lúc chọn hàng.
   Khi có backend, giá và tồn kho PHẢI được kiểm tra lại ở máy chủ trước khi
   chốt đơn. Xem PROJECT_STATUS.md phần "Việc còn thiếu".
   ========================================================================== */

(function () {
  'use strict';

  var CFG = window.BHY_CONFIG || {};
  var B = CFG.brand || {};
  var REL = CFG.release || 'preview';

  /* ==========================================================================
     ĐÁNH DẤU CÓ JAVASCRIPT
     Lớp này cho phép CSS chỉ bật hiệu ứng xuất hiện khi chắc chắn JS đã chạy.
     Nếu JS lỗi, nội dung vẫn hiện đầy đủ thay vì bị ẩn vĩnh viễn.
     ========================================================================== */
  document.documentElement.classList.add('js');

  /* ==========================================================================
     BỘ BIỂU TƯỢNG
     Tất cả là SVG nội tuyến nên không phụ thuộc mạng, không bị nháy hình.
     ========================================================================== */
  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.5c0 5.1-7.5 9.8-7.5 9.8Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.5c0 5.1-7.5 9.8-7.5 9.8Z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16l-1.3 12.2a1.5 1.5 0 0 1-1.5 1.3H6.8a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M9 7V5.6A3 3 0 0 1 12 2.6a3 3 0 0 1 3 3V7"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8.5v5M8.5 11h5"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l3 6-9 12L3 9Z"/><path d="M3 9h18M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 21 19H3Z"/><path d="M12 9.5v4.5M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16Z"/><path d="M3.5 8 12 12.5 20.5 8M12 12.5v8"/></svg>'
  };

  /* ==========================================================================
     TIỆN ÍCH CHUNG
     ========================================================================== */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Tạo phần tử với thuộc tính và con cho trước. */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /** Chuẩn hóa tiếng Việt: bỏ dấu, chữ thường — dùng cho tìm kiếm không dấu. */
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Đọc tham số truy vấn trên URL. */
  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /** Thay tham số URL mà không tải lại trang, để nút Back hoạt động đúng. */
  function setParams(patch, replace) {
    var u = new URL(window.location.href);
    Object.keys(patch).forEach(function (k) {
      var v = patch[k];
      if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
      else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    });
    var url = u.pathname + (u.search ? u.search : '') + u.hash;
    if (replace) window.history.replaceState({}, '', url);
    else window.history.pushState({}, '', url);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ==========================================================================
     ĐỊNH DẠNG GIÁ
     Tiền VND luôn là số nguyên đồng. Không dùng số thập phân.
     ========================================================================== */

  function formatVnd(n) {
    var num = Math.round(Number(n) || 0);
    return num.toLocaleString('vi-VN') + (CFG.currency && CFG.currency.symbol ? CFG.currency.symbol : '₫');
  }

  /**
   * Trả về nhãn giá để hiển thị.
   * Có giá        -> '680.000₫'
   * Nhiều mức giá -> 'Từ 320.000₫'
   * Chưa có giá   -> nhãn liên hệ, và cờ ask = true để giao diện tắt nút mua.
   */
  function priceLabel(product) {
    if (!product) return { text: 'Liên hệ', ask: true };

    // Sản phẩm có biến thể: lấy khoảng giá nhỏ nhất
    if (product.variants && product.variants.length) {
      var prices = product.variants
        .map(function (v) { return v.price; })
        .filter(function (p) { return typeof p === 'number' && p > 0; });
      if (prices.length) {
        var min = Math.min.apply(null, prices);
        var max = Math.max.apply(null, prices);
        return {
          text: min === max ? formatVnd(min) : 'Từ ' + formatVnd(min),
          ask: false,
          min: min,
          max: max
        };
      }
    }

    if (typeof product.price === 'number' && product.price > 0) {
      return { text: formatVnd(product.price), ask: false, min: product.price, max: product.price };
    }

    return {
      text: product.priceNote || 'Liên hệ để biết giá',
      ask: true
    };
  }

  /* ==========================================================================
     LƯU TRỮ TRÊN MÁY KHÁCH
     Chỉ chứa mã sản phẩm, lựa chọn và số lượng.
     TUYỆT ĐỐI không lưu tên, số điện thoại, địa chỉ hay thông tin thanh toán.
     ========================================================================== */

  var KEY = {
    cart: 'bhy.cart.v1',
    wish: 'bhy.wishlist.v1',
    seen: 'bhy.seen.v1'
  };

  function readStore(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      // Trình duyệt chặn lưu trữ, hoặc dữ liệu hỏng: dùng giá trị mặc định
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Hết dung lượng hoặc chế độ riêng tư: bỏ qua, không làm hỏng trang
    }
  }

  /* --------------------------------------------------------------- GIỎ HÀNG */

  var Cart = {
    items: function () {
      var v = readStore(KEY.cart, []);
      return Array.isArray(v) ? v : [];
    },

    save: function (items) {
      writeStore(KEY.cart, items);
      document.dispatchEvent(new CustomEvent('bhy:cart-changed', { detail: { items: items } }));
    },

    /** Khóa nhận diện một dòng giỏ: mã sản phẩm cộng các lựa chọn đã chọn. */
    lineKey: function (productId, options) {
      var o = options || {};
      var parts = [productId];
      Object.keys(o).sort().forEach(function (k) { parts.push(k + ':' + o[k]); });
      return parts.join('|');
    },

    add: function (product, qty, options) {
      var items = Cart.items();
      var key = Cart.lineKey(product.id, options);
      var found = null;

      for (var i = 0; i < items.length; i++) {
        if (items[i].key === key) { found = items[i]; break; }
      }

      if (found) {
        found.qty += qty;
      } else {
        // Lưu lại ảnh chụp thông tin tại thời điểm thêm vào giỏ.
        // Khi có backend, server phải chụp lại lần nữa lúc tạo đơn.
        items.push({
          key: key,
          productId: product.id,
          sku: product.sku || '',
          slug: product.slug || product.id,
          name: product.name,
          image: (product.images && product.images[0]) || '',
          options: options || {},
          // Giá có thể là null khi chưa có giá — giữ nguyên null, không thay bằng 0
          price: typeof product.price === 'number' ? product.price : null,
          qty: qty
        });
      }

      Cart.save(items);
      return items;
    },

    setQty: function (key, qty) {
      var items = Cart.items();
      items = items.map(function (it) {
        if (it.key === key) it.qty = Math.max(1, Math.min(99, qty));
        return it;
      });
      Cart.save(items);
    },

    remove: function (key) {
      Cart.save(Cart.items().filter(function (it) { return it.key !== key; }));
    },

    clear: function () { Cart.save([]); },

    count: function () {
      return Cart.items().reduce(function (n, it) { return n + (Number(it.qty) || 0); }, 0);
    },

    /** Tổng tiền. Trả về null nếu trong giỏ còn món chưa có giá. */
    subtotal: function () {
      var items = Cart.items();
      var sum = 0;
      for (var i = 0; i < items.length; i++) {
        if (typeof items[i].price !== 'number') return null;
        sum += items[i].price * items[i].qty;
      }
      return sum;
    }
  };

  /* -------------------------------------------------------------- YÊU THÍCH */

  var Wish = {
    ids: function () {
      var v = readStore(KEY.wish, []);
      return Array.isArray(v) ? v : [];
    },
    has: function (id) { return Wish.ids().indexOf(id) !== -1; },
    toggle: function (id) {
      var ids = Wish.ids();
      var i = ids.indexOf(id);
      if (i === -1) ids.push(id); else ids.splice(i, 1);
      writeStore(KEY.wish, ids);
      document.dispatchEvent(new CustomEvent('bhy:wish-changed', { detail: { ids: ids } }));
      return i === -1;  // true nghĩa là vừa thêm vào
    },
    clear: function () {
      writeStore(KEY.wish, []);
      document.dispatchEvent(new CustomEvent('bhy:wish-changed', { detail: { ids: [] } }));
    }
  };

  /* -------------------------------------------------------- SẢN PHẨM ĐÃ XEM */

  var Seen = {
    ids: function () {
      var v = readStore(KEY.seen, []);
      return Array.isArray(v) ? v : [];
    },
    push: function (id) {
      var ids = Seen.ids().filter(function (x) { return x !== id; });
      ids.unshift(id);
      writeStore(KEY.seen, ids.slice(0, 12));
    },
    clear: function () { writeStore(KEY.seen, []); }
  };

  /* ==========================================================================
     NẠP CATALOG
     ========================================================================== */

  var _catalogPromise = null;

  function loadCatalog() {
    if (_catalogPromise) return _catalogPromise;

    _catalogPromise = fetch('data/catalog.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .catch(function (err) {
        // Không dùng file:// thì fetch có thể bị trình duyệt chặn.
        // Báo rõ cách khắc phục thay vì hiện trang trắng.
        console.error('[Bạc Hải Yến] Không đọc được data/catalog.json:', err);
        return { products: [], categories: [], collections: [], sizeGuides: [], _loadError: true };
      });

    return _catalogPromise;
  }

  /** Chỉ lấy sản phẩm đang bật hiển thị. */
  function visibleProducts(cat) {
    return (cat.products || []).filter(function (p) { return p.published !== false; });
  }

  function findProduct(cat, idOrSlug) {
    return visibleProducts(cat).filter(function (p) {
      return p.id === idOrSlug || p.slug === idOrSlug || p.sku === idOrSlug;
    })[0] || null;
  }

  function categoryName(cat, id) {
    var c = (cat.categories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.name : '';
  }

  /* ==========================================================================
     ẢNH GIỮ CHỖ
     ----------------------------------------------------------------------------
     Khi file ảnh thật chưa tồn tại, thay vì hiện biểu tượng ảnh vỡ, ta dựng
     một khung chờ có chủ ý: nền nhạt, tên sản phẩm và đường dẫn file cần bỏ vào.
     Nhìn vào là biết ngay cần đặt file gì, ở đâu.
     ========================================================================== */

  function placeholder(opts) {
    var o = opts || {};
    var hint = o.path || '';
    // Rút gọn đường dẫn cho vừa khung nhỏ
    var shortHint = hint.replace(/^assets\/products\//, '').replace(/^assets\/img\//, 'img/');

    return el('div', { class: 'ph', 'aria-hidden': 'true' }, [
      el('div', { class: 'ph__icon', html: ICON.gem }),
      o.label ? el('div', { class: 'ph__text', text: o.label }) : null,
      shortHint ? el('div', { class: 'ph__hint', text: shortHint }) : null
    ]);
  }

  /**
   * Dựng một ảnh có khung tỷ lệ cố định, tự hiện khung giữ chỗ khi thiếu file.
   * @param {object} o - { src, alt, ratio, label, loading, className, sizes }
   */
  function picture(o) {
    var opts = o || {};
    var ratio = opts.ratio || '4x5';
    var frame = el('div', { class: 'frame frame--' + ratio });
    var src = opts.src || '';

    if (!src) {
      frame.appendChild(placeholder({ label: opts.label, path: '' }));
      return frame;
    }

    var img = el('img', {
      src: src,
      alt: opts.alt || '',
      loading: opts.loading || 'lazy',
      decoding: 'async'
    });

    if (opts.className) img.className = opts.className;

    // Ảnh lỗi hoặc file chưa có: đổi sang khung giữ chỗ, không để biểu tượng vỡ.
    // Khi khối gọi không truyền nhãn (ví dụ ảnh phụ trong thư viện), vẫn phải
    // ghi ra đường dẫn tệp để người quản trị biết cần đặt ảnh gì vào đâu.
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (!frame.querySelector('.ph')) {
        frame.appendChild(placeholder({
          label: opts.label || '',
          path: src
        }));
      }
    });

    frame.appendChild(img);
    return frame;
  }

  /* ==========================================================================
     THÔNG BÁO NHANH (TOAST)
     Vùng chứa có aria-live để trình đọc màn hình đọc nội dung thông báo.
     ========================================================================== */

  function toastRegion() {
    var r = $('.toast-region');
    if (!r) {
      r = el('div', { class: 'toast-region', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
      document.body.appendChild(r);
    }
    return r;
  }

  function toast(message, type, ms) {
    var region = toastRegion();
    var icon = type === 'error' ? ICON.alert : (type === 'success' ? ICON.check : ICON.info);
    var node = el('div', { class: 'toast' + (type ? ' toast--' + type : '') }, [
      el('span', { class: 'toast__icon', html: icon }),
      el('span', { text: message })
    ]);
    region.appendChild(node);

    window.setTimeout(function () {
      node.style.transition = 'opacity 200ms, transform 200ms';
      node.style.opacity = '0';
      node.style.transform = 'translateY(8px)';
      window.setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 220);
    }, ms || 3600);
  }

  /* ==========================================================================
     DRAWER
     Quản lý mở/đóng, khóa cuộn nền, giữ tiêu điểm bên trong, đóng bằng Escape
     và trả tiêu điểm về nút đã mở nó.
     ========================================================================== */

  var openDrawers = [];
  var lastFocus = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openDrawer(node, trigger) {
    if (!node || openDrawers.indexOf(node) !== -1) return;

    if (!openDrawers.length) {
      lastFocus = trigger || document.activeElement;
      // Khóa cuộn nền nhưng bù lại độ rộng thanh cuộn để bố cục không nhảy
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
    }

    node.hidden = false;
    // Ép trình duyệt tính lại bố cục trước khi thêm lớp mở, để có chuyển động
    void node.offsetWidth;
    node.classList.add('is-open');
    openDrawers.push(node);

    var panel = $('.drawer__panel', node);
    var first = panel ? $(FOCUSABLE, panel) : null;
    if (first) {
      window.setTimeout(function () { first.focus(); }, 60);
    }
  }

  function closeDrawer(node) {
    if (!node) return;
    var i = openDrawers.indexOf(node);
    if (i === -1) return;

    openDrawers.splice(i, 1);
    node.classList.remove('is-open');

    var finish = function () {
      node.hidden = true;
      if (!openDrawers.length) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
        lastFocus = null;
      }
    };

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) finish();
    else window.setTimeout(finish, 280);
  }

  function closeAllDrawers() {
    openDrawers.slice().forEach(closeDrawer);
  }

  // Đóng drawer đang mở bằng phím Escape, và giữ tiêu điểm bên trong drawer
  document.addEventListener('keydown', function (e) {
    if (!openDrawers.length) return;
    var top = openDrawers[openDrawers.length - 1];

    if (e.key === 'Escape') {
      e.preventDefault();
      closeDrawer(top);
      return;
    }

    if (e.key === 'Tab') {
      var panel = $('.drawer__panel', top);
      if (!panel) return;
      var items = $$(FOCUSABLE, panel).filter(function (n) {
        return n.offsetWidth > 0 || n.offsetHeight > 0;
      });
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ==========================================================================
     HỘP XEM ẢNH LỚN (LIGHTBOX)
     Ảnh đủ nét mới cho phóng to. Không phóng ảnh mờ thành ảnh nét giả.
     ========================================================================== */

  var lbState = { items: [], index: 0, trigger: null };

  function ensureLightbox() {
    var lb = $('.lightbox');
    if (lb) return lb;

    lb = el('div', {
      class: 'lightbox',
      hidden: true,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Xem ảnh lớn'
    }, [
      el('button', { class: 'lightbox__close', type: 'button', 'aria-label': 'Đóng', html: ICON.close }),
      el('button', { class: 'lightbox__nav lightbox__nav--prev', type: 'button', 'aria-label': 'Ảnh trước', html: ICON.prev }),
      el('img', { alt: '' }),
      el('button', { class: 'lightbox__nav lightbox__nav--next', type: 'button', 'aria-label': 'Ảnh sau', html: ICON.next }),
      el('div', { class: 'lightbox__caption' })
    ]);

    document.body.appendChild(lb);

    $('.lightbox__close', lb).addEventListener('click', closeLightbox);
    $('.lightbox__nav--prev', lb).addEventListener('click', function () { stepLightbox(-1); });
    $('.lightbox__nav--next', lb).addEventListener('click', function () { stepLightbox(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

    return lb;
  }

  function renderLightbox() {
    var lb = ensureLightbox();
    var item = lbState.items[lbState.index];
    if (!item) return;

    var img = $('img', lb);
    img.src = item.src;
    img.alt = item.alt || '';

    $('.lightbox__caption', lb).textContent =
      (lbState.items.length > 1 ? (lbState.index + 1) + '/' + lbState.items.length + ' — ' : '') +
      (item.caption || '');

    var multi = lbState.items.length > 1;
    $('.lightbox__nav--prev', lb).hidden = !multi;
    $('.lightbox__nav--next', lb).hidden = !multi;
  }

  function openLightbox(items, index, trigger) {
    lbState.items = items || [];
    lbState.index = index || 0;
    lbState.trigger = trigger || document.activeElement;

    var lb = ensureLightbox();
    lb.hidden = false;
    renderLightbox();
    document.body.style.overflow = 'hidden';
    $('.lightbox__close', lb).focus();
  }

  function stepLightbox(dir) {
    if (lbState.items.length < 2) return;
    lbState.index = (lbState.index + dir + lbState.items.length) % lbState.items.length;
    renderLightbox();
  }

  function closeLightbox() {
    var lb = $('.lightbox');
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lbState.trigger && lbState.trigger.focus) lbState.trigger.focus();
  }

  document.addEventListener('keydown', function (e) {
    var lb = $('.lightbox');
    if (!lb || lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  /* ==========================================================================
     HEADER
     ========================================================================== */

  function headerMarkup() {
    var nav = (CFG.nav || []).map(function (n) {
      return el('a', { class: 'nav__link', href: n.href, text: n.label });
    });

    var header = el('header', { class: 'header' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'header__inner' }, [
          // Nút menu chỉ hiện trên mobile
          el('button', {
            class: 'icon-btn nav-toggle',
            type: 'button',
            'aria-label': 'Mở menu',
            'aria-expanded': 'false',
            'aria-controls': 'drawer-menu',
            html: ICON.menu
          }),

          el('a', { class: 'header__logo', href: 'index.html', 'aria-label': B.name + ' — về trang chủ' }, [
            el('img', {
              src: (B.logo && B.logo.lockupOnLight) || '',
              alt: B.name || '',
              width: '150',
              height: '40'
            })
          ]),

          el('nav', { class: 'nav', 'aria-label': 'Điều hướng chính' }, nav),

          el('div', { class: 'actions' }, [
            el('a', { class: 'icon-btn', href: 'search.html', 'aria-label': 'Tìm kiếm', html: ICON.search }),

            el('a', { class: 'icon-btn', href: 'wishlist.html', 'aria-label': 'Sản phẩm yêu thích' }, [
              el('span', { html: ICON.heart }),
              el('span', { class: 'icon-btn__count', 'data-wish-count': '', hidden: true })
            ]),

            el('button', {
              class: 'icon-btn',
              type: 'button',
              'data-open-cart': '',
              'aria-label': 'Mở giỏ hàng',
              'aria-controls': 'drawer-cart',
              html: ICON.cart
            }, [
              el('span', { class: 'icon-btn__count', 'data-cart-count': '', hidden: true })
            ])
          ])
        ])
      ])
    ]);

    return header;
  }

  function footerMarkup() {
    var c = CFG.contacts || {};
    var biz = CFG.business || {};
    var branches = CFG.branches || [];

    // Chỉ dựng link liên hệ khi thực sự có dữ liệu
    var contactItems = [];
    (c.hotlines || []).forEach(function (h) {
      if (!h) return;
      contactItems.push(el('li', {}, [
        el('a', { href: 'tel:' + String(h).replace(/\s/g, ''), text: h })
      ]));
    });
    if (c.email) contactItems.push(el('li', {}, [el('a', { href: 'mailto:' + c.email, text: c.email })]));
    if (c.zalo) contactItems.push(el('li', {}, [el('a', { href: c.zalo, text: 'Zalo', rel: 'noopener' })]));
    if (c.facebook) contactItems.push(el('li', {}, [el('a', { href: c.facebook, text: 'Facebook', rel: 'noopener' })]));
    if (c.instagram) contactItems.push(el('li', {}, [el('a', { href: c.instagram, text: 'Instagram', rel: 'noopener' })]));
    if (c.shopee) contactItems.push(el('li', {}, [el('a', { href: c.shopee, text: 'Shopee', rel: 'noopener' })]));

    var branchItems = branches.map(function (b) {
      return el('li', {}, [
        el('a', { href: 'store.html?id=' + b.id, text: b.label })
      ]);
    });

    // Cột chính sách: chỉ hiện mục nào đã có nội dung thật
    var pol = CFG.policies || {};
    var policyItems = [];
    if (pol.shippingPolicy)  policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=shippingPolicy', text: 'Giao hàng' })]));
    if (pol.returnPolicy)    policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=returnPolicy', text: 'Đổi trả' })]));
    if (pol.warrantyPolicy)  policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=warrantyPolicy', text: 'Bảo hành' })]));
    if (pol.cleaningService) policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=cleaningService', text: 'Làm sáng bạc' })]));
    if (pol.privacyPolicy)   policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=privacyPolicy', text: 'Bảo mật' })]));
    if (pol.termsOfService)  policyItems.push(el('li', {}, [el('a', { href: 'policy.html?id=termsOfService', text: 'Điều khoản' })]));
    policyItems.push(el('li', {}, [el('a', { href: 'faq.html', text: 'Câu hỏi thường gặp' })]));

    var footer = el('footer', { class: 'footer' }, [
      el('div', { class: 'wrap' }, [
        el('div', { class: 'footer__top' }, [

          el('div', { class: 'footer__brand' }, [
            el('img', {
              src: (B.logo && B.logo.lockupOnDark) || '',
              alt: B.name || '',
              width: '170',
              height: '46'
            }),
            el('p', { text: B.tagline || '' }),
            c.hours ? el('p', { class: 'text-xs', style: 'margin-top:12px', text: 'Giờ liên hệ: ' + c.hours }) : null
          ]),

          contactItems.length ? el('div', {}, [
            el('h3', { text: 'Liên hệ' }),
            el('ul', {}, contactItems)
          ]) : null,

          branchItems.length ? el('div', {}, [
            el('h3', { text: 'Cửa hàng' }),
            el('ul', {}, branchItems)
          ]) : null,

          policyItems.length ? el('div', {}, [
            el('h3', { text: 'Hỗ trợ' }),
            el('ul', {}, policyItems)
          ]) : null
        ]),

        el('div', { class: 'footer__bottom' }, [
          el('div', {}, [
            el('span', { text: '© ' + new Date().getFullYear() + ' ' + (biz.legalName || B.name) + '.' })
          ]),
          el('div', { class: 'footer__legal' }, [
            biz.taxCode ? el('span', { text: 'MST: ' + biz.taxCode }) : null,
            el('a', { href: 'guides.html', text: 'Cẩm nang' }),
            el('a', { href: 'contact.html', text: 'Liên hệ' })
          ])
        ])
      ])
    ]);

    return footer;
  }

  /* ==========================================================================
     DRAWER DÙNG CHUNG: GIỎ HÀNG, MENU MOBILE
     ========================================================================== */

  function cartDrawerMarkup() {
    return el('div', {
      class: 'drawer drawer--right',
      id: 'drawer-cart',
      hidden: true,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Giỏ hàng'
    }, [
      el('div', { class: 'drawer__scrim', 'data-close': '' }),
      el('div', { class: 'drawer__panel' }, [
        el('div', { class: 'drawer__head' }, [
          el('h2', { text: 'Giỏ hàng' }),
          el('button', { class: 'drawer__close', type: 'button', 'data-close': '', 'aria-label': 'Đóng giỏ hàng', html: ICON.close })
        ]),
        el('div', { class: 'drawer__body', 'data-cart-body': '' }),
        el('div', { class: 'drawer__foot', 'data-cart-foot': '', hidden: true })
      ])
    ]);
  }

  function menuDrawerMarkup() {
    var c = CFG.contacts || {};

    var links = (CFG.nav || []).map(function (n) {
      return el('a', { class: 'mnav__link', href: n.href, text: n.label });
    });

    links.push(el('a', { class: 'mnav__link', href: 'search.html', text: 'Tìm kiếm' }));
    links.push(el('a', { class: 'mnav__link', href: 'wishlist.html', text: 'Yêu thích' }));

    var footLinks = [];
    if (c.hotlines && c.hotlines[0]) {
      footLinks.push(el('a', { href: 'tel:' + String(c.hotlines[0]).replace(/\s/g, ''), text: 'Hotline ' + c.hotlines[0] }));
    }
    if (c.email) footLinks.push(el('a', { href: 'mailto:' + c.email, text: c.email }));
    footLinks.push(el('a', { href: 'faq.html', text: 'Câu hỏi thường gặp' }));
    footLinks.push(el('a', { href: 'contact.html', text: 'Liên hệ' }));

    return el('div', {
      class: 'drawer drawer--left',
      id: 'drawer-menu',
      hidden: true,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Menu'
    }, [
      el('div', { class: 'drawer__scrim', 'data-close': '' }),
      el('div', { class: 'drawer__panel' }, [
        el('div', { class: 'drawer__head' }, [
          el('h2', { text: 'Menu' }),
          el('button', { class: 'drawer__close', type: 'button', 'data-close': '', 'aria-label': 'Đóng menu', html: ICON.close })
        ]),
        el('div', { class: 'drawer__body' }, [
          el('nav', { class: 'mnav', 'aria-label': 'Điều hướng mobile' }, links),
          el('div', { class: 'mnav__foot' }, footLinks)
        ])
      ])
    ]);
  }

  /* ==========================================================================
     DỰNG GIỎ HÀNG TRONG DRAWER
     ========================================================================== */

  function renderCart() {
    var body = $('[data-cart-body]');
    var foot = $('[data-cart-foot]');
    if (!body || !foot) return;

    var items = Cart.items();

    body.innerHTML = '';
    foot.innerHTML = '';
    foot.hidden = true;

    if (!items.length) {
      body.appendChild(el('div', { class: 'empty' }, [
        el('span', { html: ICON.cart }),
        el('h3', { text: 'Giỏ hàng đang trống' }),
        el('p', { text: 'Bạn chưa chọn món nào. Ghé xem các món đang có ở cửa hàng nhé.' }),
        el('a', { class: 'btn', href: 'catalog.html', text: 'Xem trang sức' })
      ]));
      return;
    }

    items.forEach(function (it) {
      var priceTxt = typeof it.price === 'number' ? formatVnd(it.price * it.qty) : 'Liên hệ';
      // Hiện lựa chọn đã chọn, ví dụ "Size: 12"
      var optTxt = Object.keys(it.options || {}).map(function (k) {
        return k.charAt(0).toUpperCase() + k.slice(1) + ': ' + it.options[k];
      }).join(' · ');

      var line = el('div', { class: 'cart-line' }, [
        el('div', { class: 'cart-line__media' }, [ picture({ src: it.image, alt: it.name, ratio: '1x1', label: it.name }) ]),

        el('div', { class: 'cart-line__info' }, [
          el('a', { class: 'cart-line__name', href: 'product.html?slug=' + encodeURIComponent(it.slug), text: it.name }),
          optTxt ? el('div', { class: 'cart-line__opts', text: optTxt }) : null,
          el('div', { class: 'cart-line__ctl' }, [
            el('div', { class: 'qty' }, [
              el('button', {
                type: 'button',
                'aria-label': 'Giảm số lượng',
                text: '−',
                disabled: it.qty <= 1,
                onclick: function () { Cart.setQty(it.key, it.qty - 1); renderCart(); }
              }),
              el('input', {
                type: 'number',
                value: it.qty,
                min: '1',
                max: '99',
                'aria-label': 'Số lượng của ' + it.name,
                onchange: function (e) {
                  var v = parseInt(e.target.value, 10);
                  Cart.setQty(it.key, isNaN(v) ? 1 : v);
                  renderCart();
                }
              }),
              el('button', {
                type: 'button',
                'aria-label': 'Tăng số lượng',
                text: '+',
                disabled: it.qty >= 99,
                onclick: function () { Cart.setQty(it.key, it.qty + 1); renderCart(); }
              })
            ]),
            el('button', {
              class: 'link-quiet',
              type: 'button',
              text: 'Xóa',
              onclick: function () {
                Cart.remove(it.key);
                renderCart();
                toast('Đã xóa khỏi giỏ hàng.');
              }
            })
          ])
        ]),

        el('div', { class: 'cart-line__price', text: priceTxt })
      ]);

      body.appendChild(line);
    });

    // Chân drawer: tổng tiền và nút tới trang giỏ hàng
    var sub = Cart.subtotal();

    foot.hidden = false;

    foot.appendChild(el('div', { class: 'totals-row' }, [
      el('span', { text: 'Tạm tính' }),
      el('strong', { text: sub === null ? 'Liên hệ' : formatVnd(sub) })
    ]));

    if (sub === null) {
      foot.appendChild(el('p', { class: 'text-xs text-soft mb-3' },
        ['Trong giỏ có món chưa niêm yết giá. Vui lòng liên hệ cửa hàng để được báo giá chính xác.']));
    }

    foot.appendChild(el('p', { class: 'text-xs text-faint mb-3' },
      ['Phí giao hàng được xác định ở bước thanh toán.']));

    foot.appendChild(el('a', { class: 'btn btn--block', href: 'cart.html', text: 'Xem giỏ hàng' }));
    foot.appendChild(el('button', {
      class: 'btn btn--ghost btn--block mt-2',
      type: 'button',
      text: 'Tiếp tục chọn hàng',
      onclick: closeAllDrawers
    }));
  }

  /* ==========================================================================
     CẬP NHẬT SỐ LƯỢNG TRÊN HEADER
     ========================================================================== */

  function refreshCounts() {
    var cc = Cart.count();
    $$('[data-cart-count]').forEach(function (n) {
      n.textContent = cc > 99 ? '99+' : String(cc);
      n.hidden = cc === 0;
    });

    var wc = Wish.ids().length;
    $$('[data-wish-count]').forEach(function (n) {
      n.textContent = wc > 99 ? '99+' : String(wc);
      n.hidden = wc === 0;
    });
  }

  /* ==========================================================================
     GẮN SỰ KIỆN DÙNG CHUNG
     ========================================================================== */

  function wireCommon() {
    // Mở giỏ hàng từ mọi nút có data-open-cart
    document.addEventListener('click', function (e) {
      var opener = e.target.closest && e.target.closest('[data-open-cart]');
      if (opener) {
        e.preventDefault();
        renderCart();
        openDrawer($('#drawer-cart'), opener);
        return;
      }

      // Đóng drawer khi bấm lớp phủ hoặc nút đóng
      var closer = e.target.closest && e.target.closest('[data-close]');
      if (closer) {
        e.preventDefault();
        var d = closer.closest('.drawer');
        if (d) closeDrawer(d);
        return;
      }

      // Nút mở menu mobile
      var toggle = e.target.closest && e.target.closest('.nav-toggle');
      if (toggle) {
        e.preventDefault();
        openDrawer($('#drawer-menu'), toggle);
        return;
      }

      // Nút yêu thích trên thẻ sản phẩm
      var wishBtn = e.target.closest && e.target.closest('[data-wish-toggle]');
      if (wishBtn) {
        e.preventDefault();
        e.stopPropagation();
        var id = wishBtn.getAttribute('data-wish-toggle');
        var added = Wish.toggle(id);
        wishBtn.setAttribute('aria-pressed', added ? 'true' : 'false');
        wishBtn.innerHTML = added ? ICON.heartFill : ICON.heart;
        wishBtn.setAttribute('aria-label', added ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích');
        toast(added ? 'Đã thêm vào danh sách yêu thích.' : 'Đã bỏ khỏi danh sách yêu thích.');
        refreshCounts();
        return;
      }
    });

    // Đồng bộ số lượng khi giỏ hoặc yêu thích thay đổi ở nơi khác
    document.addEventListener('bhy:cart-changed', function () {
      refreshCounts();
      renderCart();
    });

    document.addEventListener('bhy:wish-changed', refreshCounts);

    // Đồng bộ khi mở nhiều tab
    window.addEventListener('storage', function (e) {
      if (!e.key) return;
      if (e.key.indexOf('bhy.') === 0) { refreshCounts(); renderCart(); }
    });
  }

  /* ==========================================================================
     KHỞI TẠO TRANG
     ========================================================================== */

  function buildChrome() {
    // Chèn header vào đầu trang
    var headerMount = $('[data-header]');
    if (headerMount) headerMount.replaceWith(headerMarkup());

    // Chèn footer
    var footerMount = $('[data-footer]');
    if (footerMount) footerMount.replaceWith(footerMarkup());

    // Chèn các drawer dùng chung
    document.body.appendChild(cartDrawerMarkup());
    document.body.appendChild(menuDrawerMarkup());

    // Thanh thông báo: chỉ hiện khi chủ cửa hàng đã duyệt nội dung
    var ann = CFG.announcement || {};
    if (ann.enabled && ann.text) {
      var bar = el('div', { class: 'announce' }, [
        el('span', { text: ann.text }),
        ann.linkHref && ann.linkLabel
          ? el('span', {}, [' ', el('a', { href: ann.linkHref, text: ann.linkLabel })])
          : null
      ]);
      document.body.insertBefore(bar, document.body.firstChild);
    }

    // Thanh báo bản xem trước: chỉ hiện ở chế độ preview
    if (REL === 'preview') {
      var pb = el('div', { class: 'preview-bar' }, [
        el('span', { text: 'Bản xem trước — website chưa nhận đơn hàng. ' }),
        el('a', { href: 'contact.html', text: 'Liên hệ cửa hàng để đặt hàng' }),
        el('span', { text: '.' })
      ]);
      var anchor = $('.announce');
      if (anchor) anchor.parentNode.insertBefore(pb, anchor.nextSibling);
      else document.body.insertBefore(pb, document.body.firstChild);
    }

    wireCommon();
    refreshCounts();
    renderCart();
  }

  /* ==========================================================================
     HIỆU ỨNG XUẤT HIỆN DẦN
     Chạy một lần cho mỗi khối khi cuộn tới. Nếu trình duyệt không hỗ trợ
     IntersectionObserver thì bỏ qua và hiện nội dung ngay.
     ========================================================================== */

  function setupReveal() {
    var nodes = $$('.reveal');
    if (!nodes.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ==========================================================================
     XUẤT RA NGOÀI
     ========================================================================== */

  window.BHY = {
    CFG: CFG,
    REL: REL,
    ICON: ICON,

    $: $, $$: $$, el: el,
    normalize: normalize, param: param, setParams: setParams, esc: esc,

    formatVnd: formatVnd, priceLabel: priceLabel,

    Cart: Cart, Wish: Wish, Seen: Seen,
    KEY: KEY, readStore: readStore, writeStore: writeStore,

    loadCatalog: loadCatalog,
    visibleProducts: visibleProducts,
    findProduct: findProduct,
    categoryName: categoryName,

    picture: picture, placeholder: placeholder,

    toast: toast,
    openDrawer: openDrawer, closeDrawer: closeDrawer, closeAllDrawers: closeAllDrawers,
    openLightbox: openLightbox, closeLightbox: closeLightbox,

    refreshCounts: refreshCounts,
    renderCart: renderCart,
    setupReveal: setupReveal
  };

  /* ==========================================================================
     CHẠY KHI DOM SẴN SÀNG
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildChrome();
      setupReveal();
    });
  } else {
    buildChrome();
    setupReveal();
  }
})();
