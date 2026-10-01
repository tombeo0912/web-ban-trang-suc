/* ============================================================================
   Bạc Hải Yến — Trang chủ
   Dựng các khối theo thứ tự trong Master Prompt phần D.
   Mọi khối đều đọc dữ liệu thật từ data/catalog.json và data/config.js.
   Khối nào chưa có dữ liệu thì ẩn hẳn, không hiện chỗ trống.
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  /* ==========================================================================
     KHỐI HERO — MỘT ẢNH CHỦ ĐẠO
     ========================================================================== */

  function renderHero() {
    var mount = $('[data-hero-media]');
    if (!mount) return;

    // Ảnh chủ đạo cần: assets/img/hero-lifestyle.jpg
    // Ảnh riêng cho mobile để không cắt mất trang sức: assets/img/hero-lifestyle-mobile.jpg
    mount.appendChild(H.picture({
      src: 'assets/img/hero-lifestyle.jpg',
      alt: 'Người đeo trang sức bạc của Bạc Hải Yến',
      ratio: '4x5',
      loading: 'eager',           // ảnh lớn nhất trang, không lazy-load
      label: 'Ảnh chủ đạo — đeo bạc'
    }));
  }

  /* ==========================================================================
     THẺ SẢN PHẨM
     Dùng chung cho trang chủ, danh mục, tìm kiếm và yêu thích.
     ========================================================================== */

  function productCard(p, cat) {
    var price = H.priceLabel(p);
    var wished = H.Wish.has(p.id);
    var catName = H.categoryName(cat, p.categoryId);

    // Ảnh phụ để đổi khi rê chuột — chỉ dùng khi có file thật
    var hasAlt = p.hoverImage && p.images && p.images.length > 1;

    var media = el('a', {
      class: 'pcard__media',
      href: 'product.html?slug=' + encodeURIComponent(p.slug || p.id),
      'aria-label': p.name
    });

    var mainFrame = H.picture({
      src: (p.images && p.images[0]) || '',
      alt: p.name,
      ratio: '4x5',
      className: 'pcard__img--main',
      label: p.name
    });
    media.appendChild(mainFrame);

    if (hasAlt) {
      // Ảnh thứ hai chồng lên, hiện dần khi rê chuột
      var altFrame = H.picture({
        src: p.hoverImage,
        alt: '',
        ratio: '4x5',
        className: 'pcard__img--alt',
        label: ''
      });
      altFrame.className += ' pcard__img--alt';
      media.appendChild(altFrame);
    }

    // Nhãn góc ảnh: chỉ hiện khi có căn cứ thật
    var badges = [];
    if (p.compareAtPrice && p.price && p.compareAtPrice > p.price) {
      badges.push(el('span', { class: 'badge badge--accent', text: 'Giá tốt' }));
    }
    if (p.featured) {
      badges.push(el('span', { class: 'badge', text: 'Gợi ý từ cửa hàng' }));
    }
    if (badges.length) {
      media.appendChild(el('div', { class: 'pcard__badges' }, badges));
    }

    // Nút yêu thích: nằm ngoài thẻ liên kết để không lồng thẻ a vào nhau
    var wishBtn = el('button', {
      class: 'pcard__wish',
      type: 'button',
      'data-wish-toggle': p.id,
      'aria-pressed': wished ? 'true' : 'false',
      'aria-label': wished ? 'Bỏ ' + p.name + ' khỏi yêu thích' : 'Thêm ' + p.name + ' vào yêu thích',
      html: wished ? H.ICON.heartFill : H.ICON.heart
    });

    var wrap = el('article', { class: 'pcard' }, [
      el('div', { style: 'position:relative' }, [media, wishBtn]),
      el('div', { class: 'pcard__body' }, [
        el('a', {
          class: 'pcard__name',
          href: 'product.html?slug=' + encodeURIComponent(p.slug || p.id),
          text: p.name
        }),
        catName || p.material
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

    return wrap;
  }

  /* ==========================================================================
     KHỐI 2 — KHÁM PHÁ THEO LOẠI
     Chỉ hiện danh mục ĐANG CÓ sản phẩm thật.
     Danh mục rỗng không được dựng lên.
     ========================================================================== */

  function renderCategories(cat) {
    var mount = $('#home-categories');
    if (!mount) return;

    var products = H.visibleProducts(cat);

    // Đếm số sản phẩm thật trong từng danh mục
    var counted = (cat.categories || []).map(function (c) {
      var n = products.filter(function (p) { return p.categoryId === c.id; }).length;
      return { cat: c, count: n };
    })
    .filter(function (x) { return x.count > 0; })
    .sort(function (a, b) { return (a.cat.order || 99) - (b.cat.order || 99); })
    .slice(0, 4);   // Tối đa bốn ô cho vừa một hàng

    if (!counted.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    counted.forEach(function (x) {
      // Lấy ảnh từ sản phẩm đầu tiên của danh mục nếu danh mục chưa có ảnh riêng
      var firstProduct = products.filter(function (p) { return p.categoryId === x.cat.id; })[0];
      var src = x.cat.image || (firstProduct && firstProduct.images && firstProduct.images[0]) || '';

      mount.appendChild(el('a', {
        class: 'cat-tile',
        href: 'catalog.html?category=' + encodeURIComponent(x.cat.id)
      }, [
        H.picture({ src: src, alt: x.cat.name, ratio: '3x4', label: x.cat.name }),
        el('span', { class: 'cat-tile__label', text: x.cat.name + ' (' + x.count + ')' })
      ]));
    });
  }

  /* ==========================================================================
     KHỐI 3 — SẢN PHẨM NỔI BẬT
     ========================================================================== */

  function renderFeatured(cat) {
    var mount = $('#home-featured');
    if (!mount) return;

    var products = H.visibleProducts(cat);

    // Ưu tiên sản phẩm được đánh dấu featured; nếu chưa đánh dấu thì lấy theo thứ tự
    var featured = products.filter(function (p) { return p.featured; });
    if (!featured.length) featured = products;

    featured = featured.slice(0, 8);

    if (!featured.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';
    featured.forEach(function (p) { mount.appendChild(productCard(p, cat)); });
  }

  /* ==========================================================================
     KHỐI 4 — BỘ SƯU TẬP BIÊN TẬP
     Dùng nhóm sản phẩm do quản trị tạo. Không bịa câu chuyện chế tác.
     ========================================================================== */

  function renderEditorial(cat) {
    var mount = $('#home-editorial');
    if (!mount) return;

    var products = H.visibleProducts(cat);
    var col = (cat.collections || [])[0];

    if (!col || !products.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    // Sản phẩm thuộc bộ sưu tập, hoặc nếu chưa gắn thì lấy ba món đầu
    var inCollection = products.filter(function (p) {
      return (p.collectionIds || []).indexOf(col.id) !== -1;
    });
    if (!inCollection.length) inCollection = products.slice(0, 3);

    mount.innerHTML = '';

    var media = el('div', { class: 'editorial__media' });
    media.appendChild(H.picture({
      src: col.image || (inCollection[0].images && inCollection[0].images[0]) || '',
      alt: col.name,
      ratio: '3x2',
      label: col.name
    }));

    var body = el('div', { class: 'editorial__content' }, [
      el('span', { class: 'eyebrow', style: 'color:rgba(255,255,255,.6)', text: 'Bộ sưu tập' }),
      el('h2', { text: col.name }),
      col.description ? el('p', { text: col.description }) : null,
      el('ul', { class: 'mt-3', style: 'list-style:none;padding:0;font-size:.9375rem' },
        inCollection.slice(0, 3).map(function (p) {
          var pr = H.priceLabel(p);
          return el('li', { style: 'padding:8px 0;border-bottom:1px solid rgba(255,255,255,.14)' }, [
            el('a', {
              href: 'product.html?slug=' + encodeURIComponent(p.slug || p.id),
              style: 'color:#fff;display:flex;justify-content:space-between;gap:16px',
              html: '<span>' + H.esc(p.name) + '</span><span style="white-space:nowrap;opacity:.8">' +
                    H.esc(pr.text) + '</span>'
            })
          ]);
        })),
      el('div', { class: 'mt-4' }, [
        el('a', {
          class: 'btn btn--light',
          href: 'catalog.html?collection=' + encodeURIComponent(col.id),
          text: 'Xem bộ sưu tập'
        })
      ])
    ]);

    mount.appendChild(media);
    mount.appendChild(body);
  }

  /* ==========================================================================
     KHỐI 5 — PHỐI CÙNG
     Ảnh thật + danh sách món chọn được. Điểm nóng là tùy chọn và có danh sách
     tương đương trên mobile.
     ========================================================================== */

  function renderPairing(cat) {
    var mount = $('#home-pairing');
    if (!mount) return;

    var products = H.visibleProducts(cat);

    // Cần ít nhất hai món để tạo thành một bộ phối có ý nghĩa
    var picks = products.filter(function (p) { return p.pairsWith && p.pairsWith.length; });
    if (picks.length < 1 || products.length < 2) {
      mount.closest('.section').hidden = true;
      return;
    }

    // Bắt đầu từ món đầu tiên rồi lấy các món phối kèm
    var start = picks[0];
    var ids = [start.id].concat(start.pairsWith || []);
    var set = ids.map(function (id) {
      return products.filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean).slice(0, 3);

    if (set.length < 2) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    // Ảnh bộ phối: ưu tiên ảnh lifestyle riêng, nếu chưa có thì dùng ảnh món đầu
    var media = el('div', { class: 'pairing__media' });
    media.appendChild(H.picture({
      src: 'assets/img/pairing-lifestyle.jpg',
      alt: 'Bộ trang sức phối cùng nhau',
      ratio: '4x5',
      label: 'Ảnh phối cùng'
    }));

    // Điểm nóng chỉ hiện trên màn hình lớn — trên mobile danh sách bên cạnh
    // đã thay thế hoàn toàn, nên không cần và không nên hiện.
    var positions = [
      { top: '32%', left: '42%' },
      { top: '56%', left: '64%' },
      { top: '72%', left: '38%' }
    ];

    set.forEach(function (p, i) {
      if (!positions[i]) return;
      var hs = el('button', {
        class: 'pairing__hotspot',
        type: 'button',
        style: 'top:' + positions[i].top + ';left:' + positions[i].left,
        text: String(i + 1),
        'aria-label': 'Xem món ' + (i + 1) + ': ' + p.name,
        onclick: function () {
          var target = document.querySelector('[data-pair-item="' + p.id + '"]');
          if (target) {
            target.scrollIntoView({ block: 'center' });
            var btn = target.querySelector('a, button');
            if (btn) btn.focus();
          }
        }
      });
      media.appendChild(hs);
    });

    var list = el('ul', { class: 'pairing__list' });

    set.forEach(function (p, i) {
      var pr = H.priceLabel(p);
      var info = el('div', { class: 'pairing__info' }, [
        el('strong', { text: p.name }),
        el('span', { text: [p.material, pr.text].filter(Boolean).join(' · ') })
      ]);

      var item = el('li', { class: 'pairing__item', 'data-pair-item': p.id }, [
        el('span', { class: 'pairing__num', text: String(i + 1) }),
        el('span', { class: 'pairing__thumb' }, [
          H.picture({ src: (p.images && p.images[0]) || '', alt: '', ratio: '1x1', label: '' })
        ]),
        info,
        el('a', {
          class: 'btn btn--ghost btn--sm',
          href: 'product.html?slug=' + encodeURIComponent(p.slug || p.id),
          text: 'Xem'
        })
      ]);

      list.appendChild(item);
    });

    mount.appendChild(media);
    mount.appendChild(el('div', {}, [
      el('p', { class: 'text-sm text-soft', style: 'margin:0 0 16px',
        text: 'Chọn từng món theo ý bạn. Bấm vào món để xem chi tiết, chọn size rồi thêm vào giỏ.' }),
      list
    ]));
  }

  /* ==========================================================================
     KHỐI 6 — CHỌN QUÀ THEO NGÂN SÁCH
     Khoảng giá dựng từ catalog thật. Sản phẩm chưa có giá KHÔNG được đưa vào
     khoảng giá, vì sẽ khiến khách hiểu sai về mức giá của cửa hàng.
     ========================================================================== */

  function renderBudget(cat) {
    var mount = $('#home-budget');
    if (!mount) return;

    var products = H.visibleProducts(cat);

    var priced = products.map(function (p) {
      var pr = H.priceLabel(p);
      return { p: p, min: pr.min };
    }).filter(function (x) { return typeof x.min === 'number'; });

    if (priced.length < 2) {
      // Chưa đủ dữ liệu giá để chia khoảng: ẩn khối thay vì bịa mức giá
      mount.closest('.section').hidden = true;
      return;
    }

    // Dựng khoảng giá từ giá thực tế, chia thành bốn mức tròn
    var lo = Math.min.apply(null, priced.map(function (x) { return x.min; }));
    var hi = Math.max.apply(null, priced.map(function (x) { return x.min; }));
    var step = Math.max(100000, Math.round((hi - lo) / 4 / 100000) * 100000);

    var bands = [];
    var from = Math.floor(lo / step) * step;

    for (var i = 0; i < 4; i++) {
      var a = from + i * step;
      var b = a + step;
      if (a > hi) break;

      var n = priced.filter(function (x) { return x.min >= a && x.min < b; }).length;
      bands.push({ from: a, to: b, count: n });
    }

    if (!bands.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    bands.forEach(function (band) {
      mount.appendChild(el('a', {
        class: 'budget-card',
        href: 'catalog.html?min=' + band.from + '&max=' + band.to,
        'aria-label': 'Xem quà từ ' + H.formatVnd(band.from) + ' đến ' + H.formatVnd(band.to)
      }, [
        el('strong', { text: H.formatVnd(band.from) + ' – ' + H.formatVnd(band.to) }),
        el('span', { text: band.count + ' món' })
      ]));
    });
  }

  /* ==========================================================================
     KHỐI 7 — BA CỬA HÀNG
     ========================================================================== */

  function renderBranches() {
    var mount = $('#home-branches');
    if (!mount) return;

    var branches = H.CFG.branches || [];
    if (!branches.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    branches.forEach(function (b) {
      var rows = [];

      if (b.address) {
        rows.push(el('dt', { text: 'Địa chỉ' }));
        rows.push(el('dd', { text: b.address }));
      }
      if (b.hours) {
        rows.push(el('dt', { text: 'Giờ mở' }));
        rows.push(el('dd', { text: b.hours }));
      }

      var phone = b.phone || (H.CFG.contacts && H.CFG.contacts.hotlines && H.CFG.contacts.hotlines[0]) || '';
      if (phone) {
        rows.push(el('dt', { text: 'Điện thoại' }));
        rows.push(el('dd', {}, [el('a', { href: 'tel:' + String(phone).replace(/\s/g, ''), text: phone })]));
      }

      var body = el('div', { class: 'branch-card__body' }, [
        el('div', { class: 'branch-card__name', text: b.label }),
        // Chưa có địa chỉ: hiện trạng thái chờ dữ liệu, KHÔNG bịa địa chỉ
        rows.length
          ? el('dl', {}, rows)
          : el('div', {}, [
              el('span', { class: 'pending', text: 'Đang cập nhật địa chỉ' }),
              el('p', { class: 'text-xs text-soft mt-3',
                text: 'Cửa hàng tại ' + b.name + '. Vui lòng gọi hotline để được hướng dẫn đường tới cửa hàng.' })
            ]),
        el('div', { class: 'mt-3' }, [
          el('a', { class: 'btn btn--ghost btn--sm', href: 'store.html?id=' + b.id, text: 'Xem cửa hàng' })
        ])
      ]);

      mount.appendChild(el('div', { class: 'branch-card' }, [
        H.picture({ src: b.image, alt: 'Cửa hàng ' + b.name, ratio: '3x2', label: 'Ảnh cửa hàng ' + b.name }),
        body
      ]));
    });
  }

  /* ==========================================================================
     KHỐI 8 — CẨM NANG
     ========================================================================== */

  function renderGuides() {
    var mount = $('#home-guides');
    if (!mount) return;

    var guides = (H.CFG.guides || []).slice(0, 3);
    if (!guides.length) {
      mount.closest('.section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    guides.forEach(function (g) {
      mount.appendChild(el('a', { class: 'guide-card', href: 'guide.html?slug=' + encodeURIComponent(g.slug) }, [
        H.picture({ src: g.image, alt: '', ratio: '3x2', label: '' }),
        el('div', { class: 'guide-card__body' }, [
          el('h3', { text: g.title }),
          el('p', { text: g.excerpt || '' })
        ])
      ]));
    });
  }

  /* ==========================================================================
     CHẠY
     ========================================================================== */

  renderHero();

  H.loadCatalog().then(function (cat) {
    renderCategories(cat);
    renderFeatured(cat);
    renderEditorial(cat);
    renderPairing(cat);
    renderBudget(cat);
    renderGuides();
    renderBranches();
    H.setupReveal();
  });

})();
