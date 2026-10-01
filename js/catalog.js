/* ============================================================================
   Bạc Hải Yến — Danh mục, tìm kiếm và bộ lọc
   ----------------------------------------------------------------------------
   Dùng chung cho catalog.html, search.html và wishlist.html.

   NGUYÊN TẮC:
   - Bộ lọc chỉ dựng từ dữ liệu THẬT có trong catalog. Không hiện bộ lọc cho
     thuộc tính chưa dùng tới, vì sẽ tạo ra bộ lọc luôn trả về rỗng.
   - Trạng thái lọc, sắp xếp và trang được giữ trong URL, để chia sẻ link và
     bấm Back đều đúng.
   - Tìm kiếm hỗ trợ cả có dấu và không dấu.
   - Không dùng cuộn vô hạn, vì khách sẽ mất vị trí đang xem.
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  var PER_PAGE = 12;

  /* Trạng thái đọc từ URL. Đây là nguồn dữ liệu duy nhất cho bộ lọc. */
  var state = {
    q: H.param('q') || '',
    category: (H.param('category') || '').split(',').filter(Boolean),
    collection: H.param('collection') || '',
    material: (H.param('material') || '').split(',').filter(Boolean),
    plating: (H.param('plating') || '').split(',').filter(Boolean),
    stone: (H.param('stone') || '').split(',').filter(Boolean),
    min: H.param('min') || '',
    max: H.param('max') || '',
    inStock: H.param('inStock') === '1',
    sort: H.param('sort') || 'newest',
    page: Math.max(1, parseInt(H.param('page') || '1', 10) || 1)
  };

  var catalog = null;
  var allProducts = [];

  /* ==========================================================================
     ĐỌC GIÁ NHỎ NHẤT CỦA MỘT SẢN PHẨM
     Dùng cho lọc khoảng giá và sắp xếp theo giá.
     Sản phẩm chưa có giá trả về null và bị loại khỏi lọc giá.
     ========================================================================== */

  function priceMin(p) {
    var pr = H.priceLabel(p);
    return typeof pr.min === 'number' ? pr.min : null;
  }

  /* ==========================================================================
     LỌC
     ========================================================================== */

  function applyFilters(products) {
    var q = H.normalize(state.q);

    return products.filter(function (p) {
      // Tìm theo tên, mã SKU, chất liệu, đá và thẻ — có dấu hoặc không dấu
      if (q) {
        var haystack = H.normalize([
          p.name, p.sku, p.material, p.plating, p.stone,
          (p.tags || []).join(' '),
          p.shortDescription
        ].filter(Boolean).join(' '));

        // Mọi từ khóa đều phải xuất hiện, để kết quả khớp chính xác hơn
        var words = q.split(' ').filter(Boolean);
        var hit = words.every(function (w) { return haystack.indexOf(w) !== -1; });
        if (!hit) return false;
      }

      if (state.category.length && state.category.indexOf(p.categoryId) === -1) return false;

      if (state.collection && (p.collectionIds || []).indexOf(state.collection) === -1) return false;

      if (state.material.length && state.material.indexOf(p.material) === -1) return false;
      if (state.plating.length && state.plating.indexOf(p.plating) === -1) return false;
      if (state.stone.length && state.stone.indexOf(p.stone) === -1) return false;

      // Lọc khoảng giá: chỉ áp dụng cho sản phẩm ĐÃ có giá
      if (state.min || state.max) {
        var pm = priceMin(p);
        if (pm === null) return false;
        if (state.min && pm < Number(state.min)) return false;
        if (state.max && pm > Number(state.max)) return false;
      }

      // Lọc còn hàng: chỉ áp dụng khi sản phẩm thực sự có thông tin tồn kho.
      // Chưa có dữ liệu tồn thì không loại sản phẩm ra, chỉ ghi chú ở trang chi tiết.
      if (state.inStock) {
        if (p.inStock === false) return false;
        var variantsOut = p.variants && p.variants.length &&
          p.variants.every(function (v) { return v.inStock === false; });
        if (variantsOut) return false;
        if (p.inStock !== true && !(p.variants && p.variants.some(function (v) { return v.inStock === true; }))) {
          // Không có thông tin tồn: coi như cần liên hệ, giữ lại trong kết quả
        }
      }

      return true;
    });
  }

  /* ==========================================================================
     SẮP XẾP
     Chỉ có sắp xếp bán chạy khi thật sự có dữ liệu bán hàng — hiện chưa có,
     nên không dựng tùy chọn đó.
     ========================================================================== */

  function sortProducts(products) {
    var list = products.slice();

    switch (state.sort) {
      case 'price-asc':
        return list.sort(function (a, b) {
          var pa = priceMin(a), pb = priceMin(b);
          if (pa === null && pb === null) return 0;
          if (pa === null) return 1;   // chưa có giá xuống cuối
          if (pb === null) return -1;
          return pa - pb;
        });

      case 'price-desc':
        return list.sort(function (a, b) {
          var pa = priceMin(a), pb = priceMin(b);
          if (pa === null && pb === null) return 0;
          if (pa === null) return 1;
          if (pb === null) return -1;
          return pb - pa;
        });

      case 'name-asc':
        return list.sort(function (a, b) {
          return H.normalize(a.name).localeCompare(H.normalize(b.name), 'vi');
        });

      case 'newest':
      default:
        // Giữ thứ tự trong file catalog: quản trị viên sắp xếp bằng tay.
        return list;
    }
  }

  /* ==========================================================================
     DỰNG THẺ SẢN PHẨM
     Bản sao rút gọn của thẻ ở trang chủ, để trang danh mục không phụ thuộc home.js.
     ========================================================================== */

  function card(p) {
    var price = H.priceLabel(p);
    var wished = H.Wish.has(p.id);
    var catName = H.categoryName(catalog, p.categoryId);
    var hasAlt = p.hoverImage && p.images && p.images.length > 1;
    var href = 'product.html?slug=' + encodeURIComponent(p.slug || p.id);

    var media = el('a', { class: 'pcard__media', href: href, 'aria-label': p.name });

    media.appendChild(H.picture({
      src: (p.images && p.images[0]) || '',
      alt: p.name,
      ratio: '4x5',
      className: 'pcard__img--main',
      label: p.name
    }));

    if (hasAlt) {
      var altFrame = H.picture({ src: p.hoverImage, alt: '', ratio: '4x5', label: '' });
      altFrame.className += ' pcard__img--alt';
      media.appendChild(altFrame);
    }

    var badges = [];
    if (p.compareAtPrice && p.price && p.compareAtPrice > p.price) {
      badges.push(el('span', { class: 'badge badge--accent', text: 'Giá tốt' }));
    }
    if (badges.length) media.appendChild(el('div', { class: 'pcard__badges' }, badges));

    var wishBtn = el('button', {
      class: 'pcard__wish',
      type: 'button',
      'data-wish-toggle': p.id,
      'aria-pressed': wished ? 'true' : 'false',
      'aria-label': (wished ? 'Bỏ ' : 'Thêm ') + p.name + (wished ? ' khỏi yêu thích' : ' vào yêu thích'),
      html: wished ? H.ICON.heartFill : H.ICON.heart
    });

    return el('article', { class: 'pcard' }, [
      el('div', { style: 'position:relative' }, [media, wishBtn]),
      el('div', { class: 'pcard__body' }, [
        el('a', { class: 'pcard__name', href: href, text: p.name }),
        (catName || p.material)
          ? el('div', { class: 'pcard__meta', text: [catName, p.material].filter(Boolean).join(' · ') })
          : null,
        el('div', { class: 'pcard__price' + (price.ask ? ' pcard__price--ask' : '') }, [
          document.createTextNode(price.text),
          p.compareAtPrice && p.price && p.compareAtPrice > p.price
            ? el('s', { text: H.formatVnd(p.compareAtPrice) })
            : null
        ])
      ])
    ]);
  }

  /* ==========================================================================
     DỰNG BỘ LỌC
     Chỉ dựng nhóm lọc khi có ÍT NHẤT HAI giá trị khác nhau trong dữ liệu thật.
     Một nhóm lọc chỉ có một lựa chọn là vô nghĩa.
     ========================================================================== */

  function facets(products) {
    function distinct(key) {
      var map = {};
      products.forEach(function (p) {
        var v = p[key];
        if (!v) return;
        map[v] = (map[v] || 0) + 1;
      });
      return Object.keys(map).sort().map(function (k) { return { value: k, count: map[k] }; });
    }

    return {
      category: (catalog.categories || []).map(function (c) {
        return {
          value: c.id,
          label: c.name,
          count: products.filter(function (p) { return p.categoryId === c.id; }).length
        };
      }).filter(function (x) { return x.count > 0; }),

      material: distinct('material'),
      plating: distinct('plating'),
      stone: distinct('stone')
    };
  }

  function filterGroup(title, options, selected, key) {
    if (options.length < 1) return null;

    var group = el('div', { class: 'filter-group' }, [
      el('h3', { text: title })
    ]);

    options.forEach(function (o) {
      var id = 'f-' + key + '-' + String(o.value).replace(/\s+/g, '-').toLowerCase();
      var checked = selected.indexOf(o.value) !== -1;

      var input = el('input', {
        type: 'checkbox',
        id: id,
        value: o.value,
        checked: checked || null
      });

      input.addEventListener('change', function () {
        var next = selected.slice();
        var i = next.indexOf(o.value);
        if (input.checked && i === -1) next.push(o.value);
        if (!input.checked && i !== -1) next.splice(i, 1);
        state[key] = next;
        state.page = 1;
        syncUrl();
        render();
      });

      group.appendChild(el('label', {
        class: 'filter-option' + (o.count === 0 ? ' is-empty' : ''),
        for: id
      }, [
        input,
        el('span', { text: o.label || o.value }),
        o.count !== undefined ? el('span', { class: 'filter-option__count', text: String(o.count) }) : null
      ]));
    });

    return group;
  }

  function buildFilters(f) {
    var box = $('#filters');
    var mbox = $('#filters-mobile');
    if (!box && !mbox) return;

    function build() {
      var nodes = [];

      nodes.push(filterGroup('Danh mục', f.category, state.category, 'category'));
      nodes.push(filterGroup('Chất liệu', f.material, state.material, 'material'));
      nodes.push(filterGroup('Lớp mạ', f.plating, state.plating, 'plating'));
      nodes.push(filterGroup('Loại đá', f.stone, state.stone, 'stone'));

      // Nhóm khoảng giá
      var priceGroup = el('div', { class: 'filter-group' }, [
        el('h3', { text: 'Khoảng giá' }),
        el('div', { class: 'price-range' }, [
          el('input', {
            class: 'input', type: 'number', inputmode: 'numeric',
            placeholder: 'Từ', 'aria-label': 'Giá từ', value: state.min,
            onchange: function (e) {
              state.min = e.target.value; state.page = 1; syncUrl(); render();
            }
          }),
          el('span', { class: 'text-faint', text: '–' }),
          el('input', {
            class: 'input', type: 'number', inputmode: 'numeric',
            placeholder: 'Đến', 'aria-label': 'Giá đến', value: state.max,
            onchange: function (e) {
              state.max = e.target.value; state.page = 1; syncUrl(); render();
            }
          })
        ])
      ]);
      nodes.push(priceGroup);

      // Lọc còn hàng chỉ hiện khi catalog thật sự có thông tin tồn kho
      var hasStockData = allProducts.some(function (p) {
        return typeof p.inStock === 'boolean' ||
          (p.variants || []).some(function (v) { return typeof v.inStock === 'boolean'; });
      });

      if (hasStockData) {
        var stockInput = el('input', { type: 'checkbox', id: 'f-instock', checked: state.inStock || null });
        stockInput.addEventListener('change', function () {
          state.inStock = stockInput.checked;
          state.page = 1;
          syncUrl();
          render();
        });
        nodes.push(el('div', { class: 'filter-group' }, [
          el('label', { class: 'filter-option', for: 'f-instock' }, [
            stockInput,
            el('span', { text: 'Chỉ hiện món còn hàng' })
          ])
        ]));
      }

      // Nút xóa toàn bộ lọc
      var anyFilter = state.category.length || state.material.length || state.plating.length ||
        state.stone.length || state.min || state.max || state.inStock || state.q;
      if (anyFilter) {
        nodes.push(el('div', { class: 'filter-group' }, [
          el('button', {
            class: 'btn btn--ghost btn--block',
            type: 'button',
            text: 'Xóa toàn bộ lọc',
            onclick: clearAll
          })
        ]));
      }

      return nodes;
    }

    [box, mbox].forEach(function (mount) {
      if (!mount) return;
      mount.innerHTML = '';
      build().forEach(function (n) { if (n) mount.appendChild(n); });
    });
  }

  function clearAll() {
    state.q = '';
    state.category = [];
    state.collection = '';
    state.material = [];
    state.plating = [];
    state.stone = [];
    state.min = '';
    state.max = '';
    state.inStock = false;
    state.page = 1;
    syncUrl();
    render();
  }

  /* ==========================================================================
     URL VÀ CHIPS LỌC ĐANG ÁP DỤNG
     ========================================================================== */

  function syncUrl(replace) {
    H.setParams({
      q: state.q,
      category: state.category,
      collection: state.collection,
      material: state.material,
      plating: state.plating,
      stone: state.stone,
      min: state.min,
      max: state.max,
      inStock: state.inStock ? '1' : '',
      sort: state.sort !== 'newest' ? state.sort : '',
      page: state.page > 1 ? state.page : ''
    }, replace !== false);
  }

  function renderChips() {
    var box = $('#chips');
    if (!box) return;

    var chips = [];

    if (state.q) chips.push({ label: 'Tìm: ' + state.q, clear: function () { state.q = ''; state.page = 1; } });

    state.category.forEach(function (v) {
      chips.push({
        label: H.categoryName(catalog, v),
        clear: function () { state.category = state.category.filter(function (x) { return x !== v; }); state.page = 1; }
      });
    });

    ['material', 'plating', 'stone'].forEach(function (key) {
      state[key].forEach(function (v) {
        chips.push({
          label: v,
          clear: function () {
            state[key] = state[key].filter(function (x) { return x !== v; });
            state.page = 1;
          }
        });
      });
    });

    if (state.collection) {
      var col = (catalog.collections || []).filter(function (c) { return c.id === state.collection; })[0];
      chips.push({
        label: col ? col.name : state.collection,
        clear: function () { state.collection = ''; state.page = 1; }
      });
    }

    if (state.min || state.max) {
      var lbl = (state.min ? H.formatVnd(state.min) : '0₫') + ' – ' + (state.max ? H.formatVnd(state.max) : 'trở lên');
      chips.push({
        label: lbl,
        clear: function () { state.min = ''; state.max = ''; state.page = 1; }
      });
    }

    if (state.inStock) {
      chips.push({
        label: 'Còn hàng',
        clear: function () { state.inStock = false; state.page = 1; }
      });
    }

    if (!chips.length) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }

    box.hidden = false;
    box.innerHTML = '';

    chips.forEach(function (c) {
      var btn = el('button', { type: 'button', 'aria-label': 'Bỏ lọc ' + c.label, text: '×' });
      btn.addEventListener('click', function () {
        c.clear();
        syncUrl();
        render();
      });
      box.appendChild(el('span', { class: 'chip' }, [el('span', { text: c.label }), btn]));
    });
  }

  /* ==========================================================================
     DỰNG KẾT QUẢ
     ========================================================================== */

  function render() {
    var grid = $('#results');
    var countBox = $('#count');
    var pager = $('#pagination');
    if (!grid) return;

    var filtered = sortProducts(applyFilters(allProducts));

    // Số lượng hiển thị
    if (countBox) {
      countBox.textContent = filtered.length
        ? filtered.length + ' sản phẩm'
        : 'Không có sản phẩm nào khớp';
    }

    grid.innerHTML = '';

    /* ------------------------------------------------- TRẠNG THÁI RỖNG */
    if (!filtered.length) {
      var anyFilter = state.category.length || state.material.length || state.plating.length ||
        state.stone.length || state.min || state.max || state.q || state.inStock;

      grid.appendChild(el('div', { class: 'empty', style: 'grid-column:1/-1' }, [
        el('span', { html: H.ICON.search }),
        el('h3', { text: 'Không tìm thấy món nào' }),
        el('p', {
          text: state.q
            ? 'Cửa hàng chưa có món nào khớp với từ khóa "' + state.q + '". Bạn thử từ khóa ngắn hơn, hoặc bỏ bớt bộ lọc xem sao.'
            : 'Chưa có món nào phù hợp với cách lọc hiện tại. Bạn thử bỏ bớt một vài điều kiện lọc nhé.'
        }),
        anyFilter
          ? el('button', {
              class: 'btn btn--outline',
              type: 'button',
              text: 'Xóa toàn bộ lọc',
              onclick: clearAll
            })
          : el('a', { class: 'btn', href: 'catalog.html', text: 'Xem tất cả trang sức' })
      ]));
    } else {
      /* ---------------------------------------------------- PHÂN TRANG */
      var pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      if (state.page > pages) state.page = pages;

      var start = (state.page - 1) * PER_PAGE;
      filtered.slice(start, start + PER_PAGE).forEach(function (p) {
        grid.appendChild(card(p));
      });

      /* Hiện nút và số trang. Dùng liên kết thật để bấm Back và mở tab mới
         đều hoạt động, không phụ thuộc JavaScript. */
      if (pager) {
        pager.innerHTML = '';

        if (pages > 1) {
          function pageLink(n, label, opts) {
            var o = opts || {};
            var a = el('a', {
              class: 'btn ' + (o.current ? '' : 'btn--ghost'),
              href: pageUrl(n),
              text: label || String(n),
              'aria-label': o.aria || 'Trang ' + n
            });
            if (o.current) {
              a.setAttribute('aria-current', 'page');
              a.href = pageUrl(n);
            }
            return a;
          }

          if (state.page > 1) {
            pager.appendChild(pageLink(state.page - 1, '← Trước', { aria: 'Trang trước' }));
          }

          // Hiện tối đa năm số trang quanh trang hiện tại
          var from = Math.max(1, state.page - 2);
          var to = Math.min(pages, from + 4);
          from = Math.max(1, to - 4);

          for (var n = from; n <= to; n++) {
            pager.appendChild(pageLink(n, null, { current: n === state.page, aria: 'Trang ' + n }));
          }

          if (state.page < pages) {
            pager.appendChild(pageLink(state.page + 1, 'Sau →', { aria: 'Trang sau' }));
          }
        }
      }
    }

    renderChips();
  }

  function pageUrl(n) {
    var u = new URL(window.location.href);
    if (n > 1) u.searchParams.set('page', n);
    else u.searchParams.delete('page');
    return u.pathname + (u.search || '');
  }

  /* ==========================================================================
     SẮP XẾP
     ========================================================================== */

  function wireSort() {
    var sel = $('#sort');
    if (!sel) return;

    sel.value = state.sort;
    sel.addEventListener('change', function () {
      state.sort = sel.value;
      state.page = 1;
      syncUrl();
      render();
    });
  }

  /* ==========================================================================
     BỘ LỌC MOBILE
     ========================================================================== */

  function wireMobileFilter() {
    var trigger = $('#open-filters');
    var drawer = $('#drawer-filters');
    if (!trigger || !drawer) return;

    trigger.addEventListener('click', function () {
      H.openDrawer(drawer, trigger);
    });

    var apply = $('#apply-filters');
    if (apply) {
      apply.addEventListener('click', function () {
        H.closeDrawer(drawer);
      });
    }

    var clearBtn = $('#clear-filters-mobile');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearAll();
        H.closeDrawer(drawer);
      });
    }
  }

  /* ==========================================================================
     NÚT XEM THÊM
     ========================================================================== */

  function wireLoadMore() {
    var btn = $('#load-more');
    if (!btn) return;

    btn.addEventListener('click', function () {
      state.page += 1;
      syncUrl();
      render();
      var grid = $('#results');
      if (grid) grid.scrollIntoView({ block: 'start' });
    });
  }

  /* ==========================================================================
     NẠP VÀ CHẠY
     ========================================================================== */

  function boot() {
    // Chế độ tìm kiếm: đọc từ khóa từ URL và đổ vào ô nhập
    var searchInput = $('#search-input');
    if (searchInput) {
      searchInput.value = state.q;

      var form = $('#search-form');
      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          state.q = searchInput.value.trim();
          state.page = 1;
          syncUrl();
          render();
        });
      }
    }

    H.loadCatalog().then(function (cat) {
      catalog = cat;

      if (cat._loadError) {
        var grid = $('#results');
        if (grid) {
          grid.innerHTML = '';
          grid.appendChild(el('div', { class: 'notice notice--warning', style: 'grid-column:1/-1' }, [
            el('span', { class: 'notice__icon', html: H.ICON.alert }),
            el('div', {}, [
              el('p', {}, [el('strong', { text: 'Chưa đọc được danh sách sản phẩm.' })]),
              el('p', { text: 'Trình duyệt chặn việc đọc file data/catalog.json khi mở trực tiếp bằng đường dẫn file. Hãy chạy một máy chủ tĩnh tại thư mục dự án rồi mở lại bằng địa chỉ http.' })
            ])
          ]));
        }
        return;
      }

      allProducts = H.visibleProducts(cat);

      // Trang yêu thích: chỉ lấy những món đã lưu
      if (document.body.getAttribute('data-page') === 'wishlist') {
        var ids = H.Wish.ids();
        allProducts = allProducts.filter(function (p) { return ids.indexOf(p.id) !== -1; });

        var t = $('#wish-title');
        if (t) t.textContent = ids.length ? 'Bạn đã lưu ' + ids.length + ' món' : 'Chưa có món nào được lưu';

        var clearBtn = $('#wish-clear');
        if (clearBtn) {
          clearBtn.hidden = !ids.length;
          clearBtn.addEventListener('click', function () {
            H.Wish.clear();
            window.location.reload();
          });
        }
      }

      // Lọc còn hàng chỉ có ý nghĩa khi có dữ liệu tồn: nếu không có thì bỏ cờ
      buildFilters(facets(allProducts));
      wireSort();
      wireMobileFilter();
      wireLoadMore();
      render();

      // Đồng bộ khi người dùng bấm Back hoặc tới
      window.addEventListener('popstate', function () {
        state.q = H.param('q') || '';
        state.category = (H.param('category') || '').split(',').filter(Boolean);
        state.collection = H.param('collection') || '';
        state.material = (H.param('material') || '').split(',').filter(Boolean);
        state.plating = (H.param('plating') || '').split(',').filter(Boolean);
        state.stone = (H.param('stone') || '').split(',').filter(Boolean);
        state.min = H.param('min') || '';
        state.max = H.param('max') || '';
        state.inStock = H.param('inStock') === '1';
        state.sort = H.param('sort') || 'newest';
        state.page = Math.max(1, parseInt(H.param('page') || '1', 10) || 1);

        var si = $('#search-input');
        if (si) si.value = state.q;

        buildFilters(facets(allProducts));
        wireSort();
        render();
      });
    });
  }

  /* Cập nhật tiêu đề trang theo danh mục đang xem */
  function setHeading() {
    var h = $('#catalog-title');
    if (!h) return;

    H.loadCatalog().then(function (cat) {
      if (state.q) {
        h.textContent = 'Kết quả cho “' + state.q + '”';
        return;
      }
      if (state.category.length === 1) {
        h.textContent = H.categoryName(cat, state.category[0]);
        return;
      }
      if (state.collection) {
        var col = (cat.collections || []).filter(function (c) { return c.id === state.collection; })[0];
        if (col) { h.textContent = col.name; return; }
      }
      h.textContent = h.getAttribute('data-default') || h.textContent;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setHeading();
    boot();
  });

})();
