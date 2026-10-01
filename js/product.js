/* ============================================================================
   Bạc Hải Yến — Trang chi tiết sản phẩm
   ----------------------------------------------------------------------------
   Trách nhiệm:
     - Đọc sản phẩm theo ?slug= trên URL
     - Dựng thư viện ảnh, thông tin mua, bộ chọn biến thể và size
     - Bắt buộc chọn size với nhẫn — không cho thêm vào giỏ khi thiếu size
     - Hiện khung giữ chỗ khi ảnh chưa có, không hiện ảnh vỡ
     - Thanh mua cố định trên mobile khi nút gốc đã ra khỏi màn hình
     - Khối mở rộng: mô tả, chất liệu và chăm sóc, giao hàng, đổi trả, câu hỏi

   KHÔNG được làm ở đây:
     - Không tự sinh ảnh AI rồi trình bày như ảnh chụp thật của SKU
     - Không nhân bản một ảnh thành nhiều ảnh để lấp thư viện
     - Không cam kết bạc không bao giờ xỉn màu hay an toàn cho mọi người
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  var product = null;
  var catalog = null;
  var selected = {};       // lựa chọn hiện tại, ví dụ { size: '12' }
  var galleryItems = [];
  var currentImage = 0;

  /* ==========================================================================
     ĐỌC SẢN PHẨM
     ========================================================================== */

  function notFound(message, hint) {
    var main = $('#pdp-root');
    if (!main) return;

    main.innerHTML = '';
    main.appendChild(el('div', { class: 'empty' }, [
      el('span', { html: H.ICON.gem }),
      el('h3', { text: message || 'Không tìm thấy sản phẩm' }),
      el('p', { text: hint || 'Đường dẫn có thể đã đổi hoặc sản phẩm đã ngừng bán.' }),
      el('div', { class: 'row', style: 'justify-content:center' }, [
        el('a', { class: 'btn', href: 'catalog.html', text: 'Xem trang sức' }),
        el('a', { class: 'btn btn--ghost', href: 'index.html', text: 'Về trang chủ' })
      ])
    ]));
  }

  /* ==========================================================================
     THƯ VIỆN ẢNH
     Chỉ dựng ảnh có thật trong danh sách. Nếu chỉ có một ảnh thì trình bày
     tốt một ảnh, không nhân bản thành nhiều khung.
     ========================================================================== */

  function buildGallery() {
    var wrap = $('#gallery');
    if (!wrap) return;

    // Danh sách ảnh có thật (bỏ chuỗi rỗng)
    var srcs = (product.images || []).filter(Boolean);

    wrap.innerHTML = '';

    if (!srcs.length) {
      // Chưa có ảnh: hiện một khung chờ lớn, ghi rõ cần đặt file gì
      var box = el('div', { class: 'frame frame--4x5' });
      box.appendChild(H.placeholder({
        label: product.name,
        path: 'assets/products/…-1.jpg'
      }));
      wrap.appendChild(el('div', { class: 'gallery__main' }, [box]));
      return;
    }

    galleryItems = srcs.map(function (s) { return { src: s, alt: product.name, caption: product.name }; });

    var main = el('div', { class: 'gallery__main' });

    function renderMain(i) {
      currentImage = i;
      main.innerHTML = '';

      main.appendChild(H.picture({
        src: srcs[i],
        alt: product.name + (srcs.length > 1 ? ' — ảnh ' + (i + 1) : ''),
        ratio: '4x5',
        loading: 'eager',
        label: product.name
      }));

      // Chỉ cho phóng to khi ảnh có thật. Không phóng ảnh giữ chỗ.
      var zoom = el('button', {
        class: 'gallery__zoom',
        type: 'button',
        'aria-label': 'Xem ảnh lớn',
        html: H.ICON.zoom + '<span>Phóng to</span>'
      });
      zoom.addEventListener('click', function () {
        H.openLightbox(galleryItems, currentImage, zoom);
      });
      main.appendChild(zoom);
    }

    renderMain(0);
    wrap.appendChild(main);

    // Thumbnail: chỉ hiện khi có từ hai ảnh trở lên
    if (srcs.length > 1) {
      var thumbs = el('div', { class: 'gallery__thumbs', role: 'tablist', 'aria-label': 'Ảnh sản phẩm' });

      srcs.forEach(function (s, i) {
        var t = el('button', {
          class: 'gallery__thumb',
          type: 'button',
          role: 'tab',
          'aria-selected': i === 0 ? 'true' : 'false',
          'aria-label': 'Xem ảnh ' + (i + 1)
        }, [
          H.picture({ src: s, alt: '', ratio: '1x1', label: '' })
        ]);

        t.addEventListener('click', function () {
          renderMain(i);
          Array.prototype.forEach.call(thumbs.children, function (c) {
            c.setAttribute('aria-selected', 'false');
          });
          t.setAttribute('aria-selected', 'true');
        });

        thumbs.appendChild(t);
      });

      wrap.appendChild(thumbs);
    }
  }

  /* ==========================================================================
     BỘ CHỌN BIẾN THỂ VÀ SIZE
     ========================================================================== */

  function buildOptions() {
    var box = $('#options');
    if (!box) return;

    box.innerHTML = '';

    /* ---------------------------------------------------------- BIẾN THỂ */
    if (product.variants && product.variants.length) {
      // Gom biến thể theo từng thuộc tính, ví dụ màu hoặc lớp mạ
      var keys = {};
      product.variants.forEach(function (v) {
        Object.keys(v.options || {}).forEach(function (k) {
          keys[k] = keys[k] || {};
          keys[k][v.options[k]] = true;
        });
      });

      Object.keys(keys).forEach(function (k) {
        var values = Object.keys(keys[k]);
        var group = el('div', { class: 'opt-block' }, [
          el('div', { class: 'opt-block__head' }, [
            el('span', { class: 'opt-block__label', text: k.charAt(0).toUpperCase() + k.slice(1) })
          ])
        ]);

        var set = el('div', { class: 'option-set' });

        values.forEach(function (v) {
          var match = product.variants.filter(function (x) {
            return x.options && x.options[k] === v;
          })[0];

          var out = match && match.inStock === false;

          var btn = el('button', {
            class: 'option-btn',
            type: 'button',
            text: v,
            'aria-pressed': selected[k] === v ? 'true' : 'false',
            disabled: out || null,
            title: out ? 'Tạm hết hàng' : null
          });

          btn.addEventListener('click', function () {
            selected[k] = v;
            Array.prototype.forEach.call(set.children, function (c) {
              c.setAttribute('aria-pressed', 'false');
            });
            btn.setAttribute('aria-pressed', 'true');
            updateBuyState();
          });

          set.appendChild(btn);
        });

        group.appendChild(set);
        box.appendChild(group);
      });
    }

    /* --------------------------------------------------------------- SIZE */
    if (product.requiresSize) {
      var sizes = (product.sizeOptions || []).slice();

      var sizeBlock = el('div', { class: 'opt-block', id: 'size-block' }, [
        el('div', { class: 'opt-block__head' }, [
          el('span', { class: 'opt-block__label', text: 'Chọn size' }),
          el('a', { class: 'opt-block__link', href: '#size-guide', text: 'Hướng dẫn đo size' })
        ])
      ]);

      if (!sizes.length) {
        /* CHƯA CÓ BẢNG SIZE THẬT.
           Đây là điểm dừng có chủ ý: nhẫn không thể bán đúng nếu chưa có
           danh sách size của cửa hàng. Thay vì bịa ra size rồi khách đặt sai,
           ta hướng khách sang hotline. */
        sizeBlock.appendChild(el('div', { class: 'notice notice--warning' }, [
          el('span', { class: 'notice__icon', html: H.ICON.alert }),
          el('div', {}, [
            el('p', {}, [el('strong', { text: 'Cửa hàng chưa đăng danh sách size cho món này.' })]),
            el('p', {
              class: 'text-sm',
              text: 'Nhẫn cần đúng size ngón tay mới đeo vừa. Bạn gọi hotline để được tư vấn chọn size trước khi đặt hàng.'
            }),
            el('div', { class: 'row mt-2' }, phoneButtons())
          ])
        ]));
      } else {
        var sizeSet = el('div', { class: 'option-set', id: 'size-set' });

        sizes.forEach(function (s) {
          var label = typeof s === 'string' ? s : (s.label || String(s.size || ''));
          var out = typeof s === 'object' && s.inStock === false;

          var btn = el('button', {
            class: 'option-btn',
            type: 'button',
            text: label,
            'aria-pressed': 'false',
            disabled: out || null,
            title: out ? 'Tạm hết hàng' : null
          });

          btn.addEventListener('click', function () {
            selected.size = label;
            Array.prototype.forEach.call(sizeSet.children, function (c) {
              c.setAttribute('aria-pressed', 'false');
            });
            btn.setAttribute('aria-pressed', 'true');
            // Xóa cảnh báo thiếu size nếu đang hiện
            var warn = $('#size-warning');
            if (warn) warn.hidden = true;
            updateBuyState();
          });

          sizeSet.appendChild(btn);
        });

        sizeBlock.appendChild(sizeSet);
      }

      box.appendChild(sizeBlock);
    }
  }

  function phoneButtons() {
    var hotlines = (H.CFG.contacts && H.CFG.contacts.hotlines) || [];
    return hotlines.filter(Boolean).map(function (h) {
      return el('a', {
        class: 'btn btn--sm',
        href: 'tel:' + String(h).replace(/\s/g, ''),
        text: 'Gọi ' + h
      });
    });
  }

  /* ==========================================================================
     TRẠNG THÁI NÚT MUA
     Nút bị khóa và kèm lý do cụ thể, không chỉ mờ đi không giải thích.
     ========================================================================== */

  function updateBuyState() {
    var btn = $('#add-to-cart');
    var warn = $('#size-warning');
    var barBtn = $('#buybar-add');
    var barMeta = $('#buybar-meta');

    if (!product) return;

    var price = H.priceLabel(product);
    // Cần liên hệ khi chưa có giá, hoặc khi là nhẫn mà chưa chọn size
    var needSize = product.requiresSize && !selected.size && (product.sizeOptions || []).length;
    var needPrice = price.ask;

    if (warn) {
      // Chỉ hiện cảnh báo thiếu size khi cửa hàng ĐÃ có bảng size để chọn
      warn.hidden = !needSize;
    }

    if (btn) {
      if (needPrice) {
        btn.textContent = 'Liên hệ để đặt hàng';
        btn.setAttribute('aria-disabled', 'false');
        btn.removeAttribute('disabled');
      } else if (needSize) {
        btn.textContent = 'Chọn size trước';
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('disabled', '');
      } else {
        btn.textContent = 'Thêm vào giỏ';
        btn.setAttribute('aria-disabled', 'false');
        btn.removeAttribute('disabled');
      }
    }

    if (barBtn) {
      if (needPrice) {
        barBtn.textContent = 'Liên hệ';
        barBtn.removeAttribute('disabled');
        barBtn.setAttribute('aria-disabled', 'false');
      } else if (needSize) {
        barBtn.textContent = 'Chọn size';
        barBtn.setAttribute('aria-disabled', 'true');
        barBtn.setAttribute('disabled', '');
      } else {
        barBtn.textContent = 'Thêm vào giỏ';
        barBtn.removeAttribute('disabled');
        barBtn.setAttribute('aria-disabled', 'false');
      }
    }

    // Dòng phụ trên thanh mua mobile cho biết đang thiếu gì
    if (barMeta) {
      if (needSize) barMeta.textContent = 'Bạn chưa chọn size';
      else if (needPrice) barMeta.textContent = 'Cửa hàng sẽ báo giá';
      else barMeta.textContent = price.text;
    }
  }

  /* ==========================================================================
     THÊM VÀO GIỎ
     ========================================================================== */

  function addToCart(trigger) {
    if (!product) return;

    var price = H.priceLabel(product);

    // Sản phẩm chưa có giá: không thêm vào giỏ, chuyển sang hướng liên hệ
    if (price.ask) {
      showContactInstead();
      return;
    }

    if (product.requiresSize && !selected.size && (product.sizeOptions || []).length) {
      var warn = $('#size-warning');
      if (warn) {
        warn.hidden = false;
        warn.scrollIntoView({ block: 'center' });
      }
      var firstSize = $('#size-set .option-btn');
      if (firstSize) firstSize.focus();
      return;
    }

    var qtyInput = $('#qty');
    var qty = qtyInput ? Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1)) : 1;

    // Ở chế độ xem trước, không ghi nhận đơn: chỉ giữ trong giỏ trên máy khách
    H.Cart.add(product, qty, selected);
    H.renderCart();
    H.toast('Đã thêm vào giỏ hàng.', 'success');

    if (trigger) {
      trigger.classList.add('is-busy');
      window.setTimeout(function () { trigger.classList.remove('is-busy'); }, 500);
    }

    // Mở drawer giỏ để khách thấy ngay món vừa thêm
    H.openDrawer($('#drawer-cart'), trigger || document.activeElement);
  }

  /** Khi chưa có giá: hiện khối liên hệ ngay dưới nút mua. */
  function showContactInstead() {
    var box = $('#contact-instead');
    if (!box) return;
    box.hidden = false;
    box.scrollIntoView({ block: 'center' });
  }

  /* ==========================================================================
     KHỐI NỘI DUNG MỞ RỘNG
     ========================================================================== */

  function accordionItem(id, title, contentNodes, open) {
    var panel = el('div', { class: 'accordion__panel', id: 'panel-' + id, hidden: !open }, contentNodes);

    var trigger = el('button', {
      class: 'accordion__trigger',
      type: 'button',
      'aria-expanded': open ? 'true' : 'false',
      'aria-controls': 'panel-' + id
    }, [
      el('span', { text: title }),
      el('span', { html: H.ICON.chevron })
    ]);

    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      panel.hidden = isOpen;
    });

    return el('div', { class: 'accordion__item' }, [trigger, panel]);
  }

  function buildDetails() {
    var box = $('#details');
    if (!box) return;

    box.innerHTML = '';

    /* ------------------------------------------------------------ MÔ TẢ */
    if (product.description && product.description.length) {
      box.appendChild(accordionItem('desc', 'Mô tả sản phẩm',
        product.description.map(function (p) { return el('p', { text: p }); }), true));
    }

    /* ------------------------------------------- CHẤT LIỆU VÀ CHĂM SÓC */
    var care = [];

    care.push(el('p', {
      text: 'Bạc là kim loại quý có phản ứng tự nhiên với không khí, mồ hôi và một số loại mỹ phẩm. ' +
            'Bạc có thể xỉn màu theo thời gian — đây là đặc tính của vật liệu, không phải lỗi sản phẩm.'
    }));

    if (product.plating && product.plating !== 'Không mạ') {
      care.push(el('p', {
        text: 'Món này có lớp mạ ' + product.plating + '. Lớp mạ là lớp phủ bề mặt, có thể mờ dần ở vị trí ' +
              'ma sát nhiều như mặt trong nhẫn hoặc chỗ móc khóa. Cách giữ lớp mạ lâu: tháo ra khi tắm, ' +
              'khi tập thể thao và khi làm việc nhà, và thoa mỹ phẩm trước khi đeo.'
      }));
    }

    if (product.stone && product.stone !== 'Không đá') {
      care.push(el('p', {
        text: 'Món này gắn ' + product.stone.toLowerCase() + '. Đá tự nhiên có thể chênh lệch nhẹ về màu và ' +
              'độ trong giữa các viên; đá nhân tạo thì đều hơn nhưng vẫn có sai khác nhỏ. Cả hai đều là ' +
              'đặc điểm bình thường, không phải lỗi.'
      }));
    }

    care.push(el('ul', {}, [
      el('li', { text: 'Lau bằng khăn mềm chuyên dụng sau khi đeo, lau theo một chiều.' }),
      el('li', { text: 'Không dùng bàn chải sắt hay chà muối hạt lên bề mặt và lên đá.' }),
      el('li', { text: 'Cất trong hộp kín hoặc túi zip chống ẩm khi không đeo.' }),
      el('li', {}, [
        document.createTextNode('Xem hướng dẫn đầy đủ tại '),
        el('a', { href: 'guide.html?slug=cham-soc-bac', text: 'Cẩm nang chăm sóc trang sức bạc' }),
        document.createTextNode('.')
      ])
    ]));

    box.appendChild(accordionItem('care', 'Chất liệu và cách chăm sóc', care, false));

    /* ------------------------------------------------ GIAO HÀNG, ĐỔI TRẢ */
    var shipNodes = [];

    var pol = H.CFG.policies || {};
    var pay = H.CFG.payment || {};
    var hasPayment = pay.cod || pay.bankTransfer || pay.onlineGateway;

    if (!hasPayment) {
      shipNodes.push(el('div', { class: 'notice notice--info' }, [
        el('span', { class: 'notice__icon', html: H.ICON.info }),
        el('div', {}, [
          el('p', {}, [el('strong', { text: 'Cửa hàng chưa bật đặt hàng trực tuyến.' })]),
          el('p', {
            class: 'text-sm',
            text: 'Bạn vui lòng gọi hotline hoặc ghé cửa hàng để đặt món này. Chúng tôi sẽ xác nhận tình trạng hàng và hướng dẫn nhận hàng.'
          })
        ])
      ]));
    }

    if (pol.shippingPolicy) {
      shipNodes.push(el('p', { text: pol.shippingPolicy }));
    } else {
      shipNodes.push(el('p', {
        text: 'Chính sách giao hàng chi tiết đang được cửa hàng xác nhận. Bạn gọi hotline để biết thời gian và phí giao cho khu vực của mình.'
      }));
    }

    if (pol.returnPolicy) {
      shipNodes.push(el('p', {}, [el('strong', { text: 'Đổi trả: ' }), document.createTextNode(pol.returnPolicy)]));
    }

    if (pol.warrantyPolicy) {
      shipNodes.push(el('p', {}, [el('strong', { text: 'Bảo hành: ' }), document.createTextNode(pol.warrantyPolicy)]));
    }

    if (pol.cleaningService) {
      shipNodes.push(el('p', {}, [el('strong', { text: 'Làm sáng bạc: ' }), document.createTextNode(pol.cleaningService)]));
    }

    box.appendChild(accordionItem('ship', 'Giao hàng, đổi trả và bảo hành', shipNodes, false));

    /* ------------------------------------------------------ HƯỚNG DẪN SIZE */
    if (product.requiresSize) {
      var guide = (catalog.sizeGuides || []).filter(function (g) {
        return g.id === product.sizeGuideId;
      })[0];

      var sizeNodes = [];

      if (guide && guide.rows && guide.rows.length) {
        if (guide.note) sizeNodes.push(el('p', { text: guide.note }));

        var table = el('table', { class: 'size-table' }, [
          el('thead', {}, [
            el('tr', {}, guide.headers.map(function (h) { return el('th', { text: h }); }))
          ]),
          el('tbody', {}, guide.rows.map(function (row) {
            return el('tr', {}, row.map(function (c) { return el('td', { text: String(c) }); }));
          }))
        ]);

        sizeNodes.push(el('div', { class: 'table-wrap' }, [table]));
      } else {
        sizeNodes.push(el('div', { class: 'notice notice--warning' }, [
          el('span', { class: 'notice__icon', html: H.ICON.alert }),
          el('div', {}, [
            el('p', {}, [el('strong', { text: 'Bảng size chi tiết chưa được đăng.' })]),
            el('p', {
              class: 'text-sm',
              text: 'Cửa hàng đang xác nhận thang size thực tế. Chúng tôi không dùng bảng quy đổi chung, ' +
                    'vì size nhẫn khác nhau giữa các nhà sản xuất và có thể khiến bạn chọn sai cỡ.'
            })
          ])
        ]));
      }

      sizeNodes.push(el('p', {
        text: 'Cách đo tại nhà: quấn một mảnh giấy quanh ngón tay ở vị trí đeo nhẫn, đánh dấu điểm giao nhau, ' +
              'rồi đo chiều dài bằng thước có vạch mm. Nên đo vào cuối ngày. Cách đo này có sai số, nên ' +
              'nếu bạn chưa chắc, hãy gọi hotline để được tư vấn.'
      }));

      sizeNodes.push(el('p', {}, [
        el('a', { href: 'guide.html?slug=do-size-nhan', text: 'Xem hướng dẫn đo size chi tiết' })
      ]));

      box.appendChild(accordionItem('size', 'Hướng dẫn chọn size', sizeNodes, false));
    }

    /* -------------------------------------------------------------- FAQ */
    var faqs = (H.CFG.faqs || []).filter(function (f) { return f.q && f.a; });
    if (faqs.length) {
      box.appendChild(accordionItem('faq', 'Câu hỏi thường gặp',
        faqs.map(function (f) {
          return el('div', { class: 'mb-3' }, [
            el('p', {}, [el('strong', { text: f.q })]),
            el('p', { text: f.a })
          ]);
        }), false));
    }
  }

  /* ==========================================================================
     PHỐI CÙNG
     ========================================================================== */

  function buildPairs() {
    var box = $('#pairs');
    if (!box) return;

    var ids = product.pairsWith || [];
    if (!ids.length) {
      box.closest('section').hidden = true;
      return;
    }

    var picks = ids.map(function (id) {
      return H.visibleProducts(catalog).filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean);

    if (!picks.length) {
      box.closest('section').hidden = true;
      return;
    }

    box.innerHTML = '';

    picks.forEach(function (p) {
      var price = H.priceLabel(p);
      var href = 'product.html?slug=' + encodeURIComponent(p.slug || p.id);

      box.appendChild(el('article', { class: 'pcard' }, [
        el('a', { class: 'pcard__media', href: href, 'aria-label': p.name }, [
          H.picture({ src: (p.images && p.images[0]) || '', alt: p.name, ratio: '4x5', label: p.name })
        ]),
        el('div', { class: 'pcard__body' }, [
          el('a', { class: 'pcard__name', href: href, text: p.name }),
          el('div', { class: 'pcard__price' + (price.ask ? ' pcard__price--ask' : ''), text: price.text })
        ])
      ]));
    });
  }

  /* ==========================================================================
     SẢN PHẨM ĐÃ XEM
     ========================================================================== */

  function buildSeen() {
    var box = $('#seen');
    if (!box) return;

    var ids = H.Seen.ids().filter(function (id) { return id !== product.id; });
    var picks = ids.map(function (id) {
      return H.visibleProducts(catalog).filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean).slice(0, 4);

    if (!picks.length) {
      box.closest('section').hidden = true;
      return;
    }

    box.innerHTML = '';

    picks.forEach(function (p) {
      var price = H.priceLabel(p);
      var href = 'product.html?slug=' + encodeURIComponent(p.slug || p.id);

      box.appendChild(el('article', { class: 'pcard' }, [
        el('a', { class: 'pcard__media', href: href, 'aria-label': p.name }, [
          H.picture({ src: (p.images && p.images[0]) || '', alt: p.name, ratio: '4x5', label: p.name })
        ]),
        el('div', { class: 'pcard__body' }, [
          el('a', { class: 'pcard__name', href: href, text: p.name }),
          el('div', { class: 'pcard__price' + (price.ask ? ' pcard__price--ask' : ''), text: price.text })
        ])
      ]));
    });
  }

  /* ==========================================================================
     THANH MUA CỐ ĐỊNH TRÊN MOBILE
     Chỉ hiện khi nút mua gốc đã ra khỏi màn hình, theo yêu cầu phần F.
     ========================================================================== */

  function setupBuyBar() {
    var bar = $('#buybar');
    var anchorBtn = $('#add-to-cart');
    if (!bar || !anchorBtn) return;

    if (!('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // Nút gốc ra khỏi màn hình theo hướng lên trên thì hiện thanh dưới
        var out = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        bar.classList.toggle('is-visible', out);
      });
    }, { threshold: 0 });

    io.observe(anchorBtn);
  }

  /* ==========================================================================
     DỰNG TOÀN BỘ TRANG
     ========================================================================== */

  function render() {
    var root = $('#pdp-root');
    if (!root) return;

    /* ------------------------------------------------------- TIÊU ĐỀ TRANG */
    document.title = product.name + ' — Bạc Hải Yến';

    var metaDesc = $('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', (product.shortDescription || product.name) +
        ' — ' + (product.material || 'Trang sức bạc') + ' tại Bạc Hải Yến.');
    }

    /* ------------------------------------------------------------- ĐIỀU HƯỚNG */
    var crumbs = $('#crumbs');
    if (crumbs) {
      crumbs.innerHTML = '';
      var catName = H.categoryName(catalog, product.categoryId);
      var ol = el('ol', {}, [
        el('li', {}, [el('a', { href: 'index.html', text: 'Trang chủ' })]),
        el('li', {}, [el('a', { href: 'catalog.html', text: 'Trang sức' })])
      ]);

      if (catName) {
        ol.appendChild(el('li', {}, [
          el('a', { href: 'catalog.html?category=' + encodeURIComponent(product.categoryId), text: catName })
        ]));
      }

      ol.appendChild(el('li', {}, [el('span', { 'aria-current': 'page', text: product.name })]));
      crumbs.appendChild(ol);
    }

    /* --------------------------------------------------------- THÔNG TIN MUA */
    var price = H.priceLabel(product);

    var priceNode = el('div', {
      class: price.ask ? 'pdp__price pdp__price--ask' : 'pdp__price'
    }, [
      document.createTextNode(price.text),
      !price.ask && product.compareAtPrice && product.compareAtPrice > product.price
        ? el('s', { text: H.formatVnd(product.compareAtPrice) })
        : null
    ]);

    /* Bảng thông số: chỉ hiện dòng nào có dữ liệu thật */
    var specRows = [];
    if (product.sku) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Mã hàng' }), el('dd', { text: product.sku })]));
    if (product.material) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Chất liệu' }), el('dd', { text: product.material })]));
    if (product.plating) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Lớp mạ' }), el('dd', { text: product.plating })]));
    if (product.stone) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Đá' }), el('dd', { text: product.stone })]));
    if (product.dimensions) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Kích thước' }), el('dd', { text: product.dimensions })]));
    if (product.weightGrams) specRows.push(el('div', { class: 'specs__row' }, [el('dt', { text: 'Khối lượng' }), el('dd', { text: product.weightGrams + ' g' })]));

    /* Tình trạng hàng: chỉ khẳng định khi có dữ liệu tồn thật */
    var stockNode = null;
    if (product.inStock === true) {
      stockNode = el('p', { class: 'text-sm', style: 'color:var(--c-success)', text: '✓ Còn hàng' });
    } else if (product.inStock === false) {
      stockNode = el('div', { class: 'notice notice--danger' }, [
        el('span', { class: 'notice__icon', html: H.ICON.alert }),
        el('div', {}, [el('p', { text: 'Món này đang tạm hết hàng. Bạn gọi hotline để được thông báo khi có hàng.' })])
      ]);
    } else {
      // Chưa có dữ liệu tồn: ghi đúng sự thật, không hứa còn hàng
      stockNode = el('p', { class: 'text-sm text-soft' }, [
        document.createTextNode(product.stockNote || 'Vui lòng liên hệ cửa hàng để kiểm tra còn hàng.')
      ]);
    }

    var info = el('div', { class: 'pdp__info' }, [
      el('span', { class: 'eyebrow', text: H.categoryName(catalog, product.categoryId) }),
      el('h1', { class: 'pdp__title', text: product.name }),
      product.shortDescription ? el('p', { class: 'text-soft', text: product.shortDescription }) : null,
      priceNode,
      stockNode,
      specRows.length ? el('dl', { class: 'specs' }, specRows) : null,

      // Khối chứa biến thể và size, dựng bằng buildOptions
      el('div', { id: 'options' }),

      // Cảnh báo thiếu size, ẩn cho tới khi cần
      el('div', { class: 'notice notice--warning', id: 'size-warning', hidden: true }, [
        el('span', { class: 'notice__icon', html: H.ICON.alert }),
        el('div', {}, [el('p', { text: 'Bạn chưa chọn size. Nhẫn cần đúng size ngón tay mới đeo vừa.' })])
      ]),

      // Số lượng và nút thêm vào giỏ
      el('div', { class: 'buy-row' }, [
        el('div', { class: 'qty' }, [
          el('button', {
            type: 'button', 'aria-label': 'Giảm số lượng', text: '−',
            onclick: function () {
              var i = $('#qty');
              i.value = Math.max(1, (parseInt(i.value, 10) || 1) - 1);
            }
          }),
          el('input', { id: 'qty', type: 'number', value: '1', min: '1', max: '99', 'aria-label': 'Số lượng' }),
          el('button', {
            type: 'button', 'aria-label': 'Tăng số lượng', text: '+',
            onclick: function () {
              var i = $('#qty');
              i.value = Math.min(99, (parseInt(i.value, 10) || 1) + 1);
            }
          })
        ]),
        el('button', {
          class: 'btn btn--lg',
          type: 'button',
          id: 'add-to-cart',
          text: 'Thêm vào giỏ',
          onclick: function () { addToCart(this); }
        })
      ]),

      // Khối liên hệ thay thế khi chưa có giá
      el('div', { class: 'notice notice--info', id: 'contact-instead', hidden: true }, [
        el('span', { class: 'notice__icon', html: H.ICON.info }),
        el('div', {}, [
          el('p', {}, [el('strong', { text: 'Món này chưa niêm yết giá trên website.' })]),
          el('p', {
            class: 'text-sm',
            text: 'Bạc thay đổi theo giá kim loại và theo từng đợt hàng, nên cửa hàng báo giá trực tiếp để chính xác. Bạn gọi hotline hoặc nhắn tin, chúng tôi sẽ báo giá và tình trạng hàng.'
          }),
          el('div', { class: 'row mt-2' }, phoneButtons())
        ])
      ]),

      // Liên kết sang Shopee chỉ hiện khi có link thật
      product.shopeeUrl
        ? el('p', { class: 'text-sm mt-2' }, [
            el('a', { href: product.shopeeUrl, rel: 'noopener', target: '_blank', text: 'Xem món này trên Shopee →' })
          ])
        : null
    ]);

    /* ------------------------------------------------------------- LẮP RÁP */
    root.innerHTML = '';

    var gallery = el('div', { class: 'gallery', id: 'gallery' });
    root.appendChild(gallery);
    root.appendChild(info);

    buildGallery();
    buildOptions();
    buildDetails();
    buildPairs();
    buildSeen();
    updateBuyState();
  }

  /* ==========================================================================
     NẠP VÀ CHẠY
     ========================================================================== */

  function boot() {
    var slug = H.param('slug');

    if (!slug) {
      notFound('Chưa chọn sản phẩm', 'Bạn vào trang danh mục để chọn một món cụ thể.');
      return;
    }

    H.loadCatalog().then(function (cat) {
      catalog = cat;

      if (cat._loadError) {
        notFound('Chưa đọc được danh sách sản phẩm',
          'Hãy chạy một máy chủ tĩnh tại thư mục dự án rồi mở lại bằng địa chỉ http, vì trình duyệt chặn đọc file JSON khi mở trực tiếp.');
        return;
      }

      product = H.findProduct(cat, slug);

      if (!product) {
        notFound('Không tìm thấy sản phẩm này',
          'Đường dẫn có thể đã đổi, hoặc món này đã ngừng bán. Bạn xem các món khác đang có ở cửa hàng nhé.');
        return;
      }

      // Ghi vào lịch sử đã xem SAU khi đã xác nhận sản phẩm tồn tại
      render();
      H.Seen.push(product.id);
      setupBuyBar();

      // Đổ tên sản phẩm vào thanh mua cố định trên mobile
      var barName = $('#buybar-name');
      if (barName) barName.textContent = product.name;
      var barMeta = $('#buybar-meta');
      if (barMeta) barMeta.textContent = H.priceLabel(product).text;

      // Thanh mua mobile cũng thêm vào giỏ như nút gốc
      var barBtn = $('#buybar-add');
      if (barBtn) {
        barBtn.addEventListener('click', function () {
          addToCart($('#add-to-cart'));
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', boot);

})();
