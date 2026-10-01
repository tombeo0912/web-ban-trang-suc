/* ============================================================================
   Bạc Hải Yến — Chọn quà theo ba bước
   ----------------------------------------------------------------------------
   Quy trình: người nhận → ngân sách → phong cách hoặc dịp tặng.
   Mỗi bước đều bỏ qua được, vì khách thường chưa biết rõ khi mới bắt đầu tìm.
   Kết quả lọc trên dữ liệu tag THẬT của sản phẩm, và chỉ hiện món còn bán.
   Không dùng chatbot hay dịch vụ AI bên ngoài.
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  var catalog = null;
  var step = 1;

  var answers = {
    recipient: '',
    min: '',
    max: '',
    style: '',
    occasion: ''
  };

  /* ==========================================================================
     NHÃN HIỂN THỊ
     Khóa lưu trong catalog là dạng không dấu; nhãn hiện trên giao diện có dấu.
     ========================================================================== */

  var LABEL = {
    recipient: {
      'ban-gai': 'Bạn gái',
      'vo': 'Vợ',
      'me': 'Mẹ',
      'chi-em': 'Chị hoặc em gái',
      'ban-than': 'Bạn thân',
      'dong-nghiep': 'Đồng nghiệp',
      'chinh-minh': 'Tự thưởng cho mình'
    },
    style: {
      'toi-gian': 'Tối giản, dễ đeo hằng ngày',
      'thanh-lich': 'Thanh lịch, đi làm và dự tiệc',
      'noi-bat': 'Nổi bật, có điểm nhấn',
      'nu-tinh': 'Nhẹ nhàng, nữ tính'
    },
    occasion: {
      'sinh-nhat': 'Sinh nhật',
      'ky-niem': 'Kỷ niệm',
      'cam-on': 'Cảm ơn',
      'valentine': 'Lễ tình nhân',
      'ngay-le': 'Dịp lễ khác'
    }
  };

  var ICON = {
    'ban-gai': '💐', 'vo': '💍', 'me': '🌷', 'chi-em': '🎀',
    'ban-than': '✨', 'dong-nghiep': '🎁', 'chinh-minh': '🪞'
  };

  /* ==========================================================================
     BƯỚC 1 — NGƯỜI NHẬN
     ========================================================================== */

  function renderRecipients() {
    var mount = $('#step-recipient');
    if (!mount) return;

    // Chỉ dựng lựa chọn nào thật sự có sản phẩm gắn tag tương ứng
    var products = H.visibleProducts(catalog);

    var recipients = Object.keys(LABEL.recipient).filter(function (key) {
      return products.some(function (p) {
        return (p.giftRecipients || []).indexOf(key) !== -1;
      });
    });

    if (!recipients.length) {
      mount.closest('section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    recipients.forEach(function (key) {
      var n = products.filter(function (p) {
        return (p.giftRecipients || []).indexOf(key) !== -1;
      }).length;

      mount.appendChild(el('button', {
        class: 'budget-card',
        type: 'button',
        'aria-pressed': answers.recipient === key ? 'true' : 'false',
        onclick: function () {
          answers.recipient = key;
          goStep(2);
        }
      }, [
        el('span', { style: 'font-size:24px;line-height:1', 'aria-hidden': 'true', text: ICON[key] || '🎁' }),
        el('strong', { text: LABEL.recipient[key] }),
        el('span', { text: n + ' món phù hợp' })
      ]));
    });
  }

  /* ==========================================================================
     BƯỚC 2 — NGÂN SÁCH
     Khoảng giá dựng từ giá thật. Sản phẩm chưa có giá không được đưa vào,
     vì sẽ khiến khách hiểu sai về mức giá của cửa hàng.
     ========================================================================== */

  function renderBudgets() {
    var mount = $('#step-budget');
    if (!mount) return;

    var products = H.visibleProducts(catalog);

    // Chỉ tính những món đã có giá
    var priced = products.map(function (p) {
      var pr = H.priceLabel(p);
      return { p: p, min: pr.min };
    }).filter(function (x) { return typeof x.min === 'number'; });

    if (priced.length < 2) {
      // Chưa đủ dữ liệu giá để chia khoảng: ẩn bước này,
      // và ở bước 3 sẽ không lọc theo giá.
      mount.closest('section').hidden = true;
      return;
    }

    // Chia thành các khoảng tròn từ giá thực tế
    var lo = Math.min.apply(null, priced.map(function (x) { return x.min; }));
    var hi = Math.max.apply(null, priced.map(function (x) { return x.min; }));

    var bands = [
      { min: 0, max: 500000 },
      { min: 500000, max: 1000000 },
      { min: 1000000, max: 2000000 },
      { min: 2000000, max: null }
    ];

    // Giữ lại khoảng nào thật sự có món, và bỏ khoảng vượt quá giá cao nhất
    bands = bands.filter(function (b) {
      return priced.some(function (x) {
        if (x.min < b.min) return false;
        if (b.max !== null && x.min >= b.max) return false;
        return true;
      });
    });

    if (!bands.length) {
      mount.closest('section').hidden = true;
      return;
    }

    mount.innerHTML = '';

    bands.forEach(function (b) {
      var n = priced.filter(function (x) {
        if (x.min < b.min) return false;
        if (b.max !== null && x.min >= b.max) return false;
        return true;
      }).length;

      var label = b.max === null
        ? 'Trên ' + H.formatVnd(b.min)
        : (b.min === 0 ? 'Dưới ' + H.formatVnd(b.max) : H.formatVnd(b.min) + ' – ' + H.formatVnd(b.max));

      mount.appendChild(el('button', {
        class: 'budget-card',
        type: 'button',
        'aria-pressed': String(answers.min) === String(b.min) ? 'true' : 'false',
        onclick: function () {
          answers.min = b.min;
          answers.max = b.max === null ? '' : b.max;
          goStep(3);
        }
      }, [
        el('strong', { text: label }),
        el('span', { text: n + ' món' })
      ]));
    });
  }

  /* ==========================================================================
     BƯỚC 3 — PHONG CÁCH VÀ DỊP TẶNG
     ========================================================================== */

  function renderStyles() {
    var mount = $('#step-style');
    if (!mount) return;

    var products = H.visibleProducts(catalog);

    var styles = Object.keys(LABEL.style).filter(function (key) {
      return products.some(function (p) { return (p.giftStyles || []).indexOf(key) !== -1; });
    });

    var occasions = Object.keys(LABEL.occasion).filter(function (key) {
      return products.some(function (p) { return (p.giftOccasions || []).indexOf(key) !== -1; });
    });

    mount.innerHTML = '';

    if (styles.length) {
      var styleBlock = el('div', { class: 'mb-5' }, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Phong cách người nhận thích' }),
        el('div', { class: 'budget-grid', id: 'style-set' })
      ]);
      mount.appendChild(styleBlock);

      var styleSet = $('#style-set', mount);
      styles.forEach(function (key) {
        styleSet.appendChild(el('button', {
          class: 'budget-card',
          type: 'button',
          'aria-pressed': answers.style === key ? 'true' : 'false',
          onclick: function () {
            answers.style = key;
            showResults();
          }
        }, [el('strong', { text: LABEL.style[key] })]));
      });
    }

    if (occasions.length) {
      var occBlock = el('div', {}, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Hoặc chọn theo dịp tặng' }),
        el('div', { class: 'budget-grid', id: 'occ-set' })
      ]);
      mount.appendChild(occBlock);

      var occSet = $('#occ-set', mount);
      occasions.forEach(function (key) {
        occSet.appendChild(el('button', {
          class: 'budget-card',
          type: 'button',
          'aria-pressed': answers.occasion === key ? 'true' : 'false',
          onclick: function () {
            answers.occasion = key;
            showResults();
          }
        }, [el('strong', { text: LABEL.occasion[key] })]));
      });
    }

    // Nút bỏ qua bước này
    mount.appendChild(el('div', { class: 'text-center mt-4' }, [
      el('button', {
        class: 'btn btn--quiet',
        type: 'button',
        text: 'Xem gợi ý luôn',
        onclick: showResults
      })
    ]));
  }

  /* ==========================================================================
     ĐIỀU HƯỚNG GIỮA CÁC BƯỚC
     ========================================================================== */

  function goStep(n) {
    step = n;
    renderSteps();
    var anchor = $('#gift-steps');
    if (anchor) anchor.scrollIntoView({ block: 'start' });
  }

  function renderSteps() {
    ['#step-recipient', '#step-budget', '#step-style'].forEach(function (sel, i) {
      var node = $(sel);
      if (!node) return;
      var section = node.closest('section');
      if (section) section.hidden = (i + 1) !== step;
    });

    // Thanh tiến trình
    var prog = $('#gift-progress');
    if (prog) {
      prog.textContent = 'Bước ' + step + ' / 3';
    }

    var back = $('#gift-back');
    if (back) {
      back.hidden = step === 1;
      back.onclick = function () { goStep(step - 1); };
    }

    var results = $('#gift-results');
    if (results) results.hidden = true;
  }

  /* ==========================================================================
     KẾT QUẢ
     ========================================================================== */

  function showResults() {
    var mount = $('#gift-results');
    if (!mount) return;

    ['#step-recipient', '#step-budget', '#step-style'].forEach(function (sel) {
      var node = $(sel);
      if (node) {
        var section = node.closest('section');
        if (section) section.hidden = true;
      }
    });

    mount.hidden = false;

    var products = H.visibleProducts(catalog);

    var result = products.filter(function (p) {
      // Người nhận
      if (answers.recipient && (p.giftRecipients || []).indexOf(answers.recipient) === -1) return false;

      // Ngân sách: chỉ áp dụng cho món đã có giá
      if (answers.min || answers.max) {
        var pr = H.priceLabel(p);
        if (typeof pr.min !== 'number') return false;
        if (answers.min && pr.min < Number(answers.min)) return false;
        if (answers.max && pr.min >= Number(answers.max)) return false;
      }

      // Phong cách
      if (answers.style && (p.giftStyles || []).indexOf(answers.style) === -1) return false;

      // Dịp tặng
      if (answers.occasion && (p.giftOccasions || []).indexOf(answers.occasion) === -1) return false;

      return true;
    });

    mount.innerHTML = '';

    /* Tóm tắt lựa chọn, để khách điều chỉnh được */
    var summaryBits = [];
    if (answers.recipient) summaryBits.push('cho ' + LABEL.recipient[answers.recipient].toLowerCase());
    if (answers.min || answers.max) {
      summaryBits.push('trong khoảng ' + (answers.min ? H.formatVnd(answers.min) : '0₫') +
        ' – ' + (answers.max ? H.formatVnd(answers.max) : 'không giới hạn'));
    }
    if (answers.style) summaryBits.push(LABEL.style[answers.style].toLowerCase());
    if (answers.occasion) summaryBits.push('dịp ' + LABEL.occasion[answers.occasion].toLowerCase());

    var head = el('div', { class: 'section-head' }, [
      el('span', { class: 'eyebrow', text: 'Gợi ý' }),
      el('h2', { text: result.length ? result.length + ' món phù hợp' : 'Chưa có món nào phù hợp' })
    ]);

    if (summaryBits.length) {
      head.appendChild(el('p', { text: 'Bạn đang tìm quà ' + summaryBits.join(', ') + '.' }));
    }

    mount.appendChild(head);

    /* ------------------------------------------------------ KHÔNG CÓ KẾT QUẢ */
    if (!result.length) {
      mount.appendChild(el('div', { class: 'empty' }, [
        el('span', { html: H.ICON.gem }),
        el('p', {
          text: 'Cửa hàng chưa có món nào khớp với cả ba điều kiện bạn chọn. Bạn thử nới rộng ngân sách, ' +
                'hoặc bỏ bớt một điều kiện xem sao.'
        }),
        el('div', { class: 'row', style: 'justify-content:center' }, [
          el('button', {
            class: 'btn',
            type: 'button',
            text: 'Chọn lại từ đầu',
            onclick: function () {
              answers = { recipient: '', min: '', max: '', style: '', occasion: '' };
              goStep(1);
              renderRecipients();
              renderBudgets();
              renderStyles();
            }
          }),
          el('a', { class: 'btn btn--ghost', href: 'catalog.html', text: 'Xem tất cả trang sức' })
        ])
      ]));
      return;
    }

    /* -------------------------------------------------------------- KẾT QUẢ */
    var grid = el('div', { class: 'product-grid' });

    result.forEach(function (p) {
      var price = H.priceLabel(p);
      var wished = H.Wish.has(p.id);
      var href = 'product.html?slug=' + encodeURIComponent(p.slug || p.id);

      grid.appendChild(el('article', { class: 'pcard' }, [
        el('div', { style: 'position:relative' }, [
          el('a', { class: 'pcard__media', href: href, 'aria-label': p.name }, [
            H.picture({ src: (p.images && p.images[0]) || '', alt: p.name, ratio: '4x5', label: p.name })
          ]),
          el('button', {
            class: 'pcard__wish',
            type: 'button',
            'data-wish-toggle': p.id,
            'aria-pressed': wished ? 'true' : 'false',
            'aria-label': (wished ? 'Bỏ ' : 'Thêm ') + p.name + (wished ? ' khỏi yêu thích' : ' vào yêu thích'),
            html: wished ? H.ICON.heartFill : H.ICON.heart
          })
        ]),
        el('div', { class: 'pcard__body' }, [
          el('a', { class: 'pcard__name', href: href, text: p.name }),
          el('div', { class: 'pcard__meta', text: p.material || '' }),
          el('div', { class: 'pcard__price' + (price.ask ? ' pcard__price--ask' : ''), text: price.text })
        ])
      ]));
    });

    mount.appendChild(grid);

    mount.appendChild(el('div', { class: 'row mt-5', style: 'justify-content:center' }, [
      el('button', {
        class: 'btn btn--ghost',
        type: 'button',
        text: 'Chọn lại điều kiện khác',
        onclick: function () {
          answers = { recipient: '', min: '', max: '', style: '', occasion: '' };
          goStep(1);
          renderRecipients();
          renderBudgets();
          renderStyles();
        }
      })
    ]));

    /* ------------------------------------------------- DỊCH VỤ GÓI QUÀ */
    var pol = H.CFG.policies || {};
    if (pol.giftWrap || pol.engraving) {
      var svc = [];
      if (pol.giftWrap) svc.push(el('li', { text: 'Gói quà: ' + pol.giftWrap }));
      if (pol.engraving) svc.push(el('li', { text: 'Khắc tên: ' + pol.engraving }));

      mount.appendChild(el('div', { class: 'notice notice--info mt-5' }, [
        el('span', { class: 'notice__icon', html: H.ICON.box }),
        el('div', {}, [
          el('p', {}, [el('strong', { text: 'Dịch vụ kèm theo' })]),
          el('ul', { style: 'margin:8px 0 0' }, svc)
        ])
      ]));
    }

    mount.scrollIntoView({ block: 'start' });
  }

  /* ==========================================================================
     KHỞI TẠO
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    H.loadCatalog().then(function (cat) {
      catalog = cat;

      if (cat._loadError) {
        var mount = $('#gift-results');
        if (mount) {
          mount.hidden = false;
          mount.appendChild(el('div', { class: 'notice notice--warning' }, [
            el('span', { class: 'notice__icon', html: H.ICON.alert }),
            el('div', {}, [
              el('p', {}, [el('strong', { text: 'Chưa đọc được danh sách sản phẩm.' })]),
              el('p', { text: 'Hãy chạy một máy chủ tĩnh tại thư mục dự án rồi mở lại bằng địa chỉ http.' })
            ])
          ]));
        }
        return;
      }

      renderRecipients();
      renderBudgets();
      renderStyles();
      renderSteps();
    });
  });

})();
