/* ============================================================================
   Bạc Hải Yến — Logic cho các trang còn lại
   ----------------------------------------------------------------------------
   Một file duy nhất phục vụ nhiều trang, chọn nhánh theo thuộc tính data-page
   trên thẻ body. Cách này tránh phải tạo mười file JS nhỏ gần giống nhau.

   Các trang được xử lý ở đây:
     stores, store    — hệ thống cửa hàng
     guides, guide    — cẩm nang
     about            — giới thiệu
     contact          — liên hệ
     faq              — câu hỏi thường gặp
     policy           — trang chính sách
     care             — chăm sóc bạc
     size-guide       — hướng dẫn đo size
     notfound         — trang 404
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  var page = document.body.getAttribute('data-page');
  var catalog = null;

  /* ==========================================================================
     TIỆN ÍCH DÙNG CHUNG
     ========================================================================== */

  /** Khối thông báo cho biết mục này đang chờ dữ liệu thật. */
  function pendingBlock(title, body) {
    return el('div', { class: 'notice notice--warning' }, [
      el('span', { class: 'notice__icon', html: H.ICON.alert }),
      el('div', {}, [
        el('p', {}, [el('strong', { text: title })]),
        el('p', { class: 'text-sm', text: body })
      ])
    ]);
  }

  /** Dòng liên hệ dạng nhãn — giá trị, chỉ dựng khi có dữ liệu. */
  function contactRow(label, nodes) {
    if (!nodes || (Array.isArray(nodes) && !nodes.length)) return null;
    return el('div', {
      style: 'display:grid;grid-template-columns:130px 1fr;gap:16px;padding:16px 0;border-bottom:1px solid var(--c-line)'
    }, [
      el('dt', { class: 'text-sm text-soft', style: 'margin:0', text: label }),
      el('dd', { style: 'margin:0' }, Array.isArray(nodes) ? nodes : [nodes])
    ]);
  }

  function hotlineLinks() {
    return ((H.CFG.contacts || {}).hotlines || []).filter(Boolean).map(function (h) {
      return el('a', {
        class: 'btn',
        href: 'tel:' + String(h).replace(/\s/g, ''),
        text: 'Gọi ' + h
      });
    });
  }

  /* ==========================================================================
     TRANG: HỆ THỐNG CỬA HÀNG
     ========================================================================== */

  function renderStores() {
    var mount = $('#stores-root');
    if (!mount) return;

    var branches = H.CFG.branches || [];

    if (!branches.length) {
      mount.appendChild(pendingBlock('Chưa có thông tin cửa hàng',
        'Chủ cửa hàng chưa cung cấp danh sách chi nhánh.'));
      return;
    }

    mount.innerHTML = '';

    branches.forEach(function (b) {
      var rows = [];

      if (b.address) {
        rows.push(el('dt', { class: 'text-sm text-soft', text: 'Địa chỉ' }));
        rows.push(el('dd', { style: 'margin:0', text: b.address }));
      }
      if (b.hours) {
        rows.push(el('dt', { class: 'text-sm text-soft', text: 'Giờ mở cửa' }));
        rows.push(el('dd', { style: 'margin:0', text: b.hours }));
      }

      var phone = b.phone || ((H.CFG.contacts || {}).hotlines || [])[0] || '';
      if (phone) {
        rows.push(el('dt', { class: 'text-sm text-soft', text: 'Điện thoại' }));
        rows.push(el('dd', { style: 'margin:0' }, [
          el('a', { href: 'tel:' + String(phone).replace(/\s/g, ''), text: phone })
        ]));
      }

      if (b.note) {
        rows.push(el('dt', { class: 'text-sm text-soft', text: 'Ghi chú' }));
        rows.push(el('dd', { style: 'margin:0', text: b.note }));
      }

      var body = el('div', { class: 'branch-card__body' }, [
        el('div', { class: 'branch-card__name', text: b.label }),

        rows.length
          ? el('dl', { style: 'display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:0;font-size:.9375rem' }, rows)
          : el('div', {}, [
              el('span', { class: 'pending', text: 'Đang cập nhật địa chỉ' }),
              el('p', { class: 'text-sm text-soft mt-3',
                text: 'Cửa hàng tại ' + b.name + '. Địa chỉ và giờ mở cửa sẽ được cập nhật khi chủ cửa hàng xác nhận.' })
            ]),

        el('div', { class: 'row mt-3' }, [
          el('a', { class: 'btn btn--ghost btn--sm', href: 'store.html?id=' + b.id, text: 'Xem chi tiết' }),
          b.mapUrl
            ? el('a', {
                class: 'btn btn--ghost btn--sm',
                href: b.mapUrl,
                rel: 'noopener',
                target: '_blank',
                text: 'Chỉ đường'
              })
            : null
        ])
      ]);

      mount.appendChild(el('div', { class: 'branch-card' }, [
        H.picture({ src: b.image, alt: 'Cửa hàng ' + b.name, ratio: '3x2', label: 'Ảnh cửa hàng ' + b.name }),
        body
      ]));
    });
  }

  /* ==========================================================================
     TRANG: MỘT CỬA HÀNG
     ========================================================================== */

  function renderStore() {
    var mount = $('#store-root');
    if (!mount) return;

    var id = H.param('id');

    if (!id) {
      mount.innerHTML = '';
      mount.appendChild(pendingBlock('Chưa chọn cửa hàng', 'Bạn vào trang hệ thống cửa hàng để chọn một chi nhánh.'));
      return;
    }

    var b = (H.CFG.branches || []).filter(function (x) { return x.id === id; })[0];

    if (!b) {
      mount.innerHTML = '';
      mount.appendChild(pendingBlock('Không tìm thấy cửa hàng này', 'Đường dẫn có thể đã thay đổi.'));
      return;
    }

    document.title = b.label + ' — Bạc Hải Yến';

    var title = $('#store-title');
    if (title) title.textContent = b.label;

    var crumb = $('#store-crumb');
    if (crumb) crumb.textContent = b.label;

    mount.innerHTML = '';

    var phone = b.phone || ((H.CFG.contacts || {}).hotlines || [])[0] || '';

    var rows = el('dl', { style: 'margin:0' }, [
      contactRow('Địa chỉ', b.address ? b.address : null),
      contactRow('Giờ mở cửa', b.hours ? b.hours : null),
      contactRow('Điện thoại', phone ? [
        el('a', { href: 'tel:' + String(phone).replace(/\s/g, ''), text: phone })
      ] : null),
      contactRow('Ghi chú', b.note ? b.note : null),
      contactRow('Chỉ đường', b.mapUrl ? [
        el('a', { href: b.mapUrl, rel: 'noopener', target: '_blank', text: 'Mở bản đồ' })
      ] : null)
    ]);

    var missing = !b.address || !b.hours;

    mount.appendChild(el('div', { class: 'grid', style: 'gap:32px' }, [
      el('div', {}, [
        H.picture({ src: b.image, alt: 'Cửa hàng ' + b.name, ratio: '3x2', label: 'Ảnh cửa hàng ' + b.name })
      ]),
      el('div', {}, [
        rows,
        missing
          ? el('div', { class: 'mt-4' }, [
              pendingBlock('Thông tin cửa hàng đang được cập nhật',
                'Địa chỉ chi tiết và giờ mở cửa của cửa hàng tại ' + b.name + ' chưa được xác nhận. ' +
                'Bạn gọi hotline để được hướng dẫn đường tới cửa hàng.')
            ])
          : null,
        el('div', { class: 'row mt-4' }, hotlineLinks())
      ])
    ]));

    /* ------------------------------------------------- MÓN ĐANG BÁN */
    // Lưu ý: đây là danh mục chung của cửa hàng, KHÔNG phải tồn kho riêng
    // của chi nhánh này, vì chưa có hệ thống tồn kho theo cửa hàng.
    var stockSection = $('#store-stock');
    if (stockSection) {
      stockSection.innerHTML = '';

      var products = H.visibleProducts(catalog).slice(0, 4);

      if (!products.length) {
        stockSection.closest('section').hidden = true;
        return;
      }

      stockSection.closest('section').hidden = false;

      var note = el('div', { class: 'notice notice--info mb-4' }, [
        el('span', { class: 'notice__icon', html: H.ICON.info }),
        el('div', {}, [
          el('p', {
            class: 'text-sm',
            text: 'Đây là danh mục chung của Bạc Hải Yến. Hệ thống chưa theo dõi tồn kho riêng cho từng cửa hàng, ' +
                  'nên bạn vui lòng gọi điện để xác nhận món mình cần còn hàng tại ' + b.name + ' hay không.'
          })
        ])
      ]);

      stockSection.appendChild(note);

      var grid = el('div', { class: 'product-grid mt-4' });

      products.forEach(function (p) {
        var price = H.priceLabel(p);
        var href = 'product.html?slug=' + encodeURIComponent(p.slug || p.id);

        grid.appendChild(el('article', { class: 'pcard' }, [
          el('a', { class: 'pcard__media', href: href, 'aria-label': p.name }, [
            H.picture({ src: (p.images && p.images[0]) || '', alt: p.name, ratio: '4x5', label: p.name })
          ]),
          el('div', { class: 'pcard__body' }, [
            el('a', { class: 'pcard__name', href: href, text: p.name }),
            el('div', { class: 'pcard__price' + (price.ask ? ' pcard__price--ask' : ''), text: price.text })
          ])
        ]));
      });

      stockSection.appendChild(grid);
    }
  }

  /* ==========================================================================
     TRANG: CẨM NANG (DANH SÁCH)
     ========================================================================== */

  function renderGuides() {
    var mount = $('#guides-root');
    if (!mount) return;

    var guides = H.CFG.guides || [];

    if (!guides.length) {
      mount.appendChild(pendingBlock('Chưa có bài viết nào', 'Cẩm nang sẽ được bổ sung sau.'));
      return;
    }

    mount.innerHTML = '';

    guides.forEach(function (g) {
      mount.appendChild(el('a', { class: 'guide-card', href: 'guide.html?slug=' + encodeURIComponent(g.slug) }, [
        H.picture({ src: g.image, alt: '', ratio: '3x2', label: '' }),
        el('div', { class: 'guide-card__body' }, [
          el('h2', { style: 'font-size:1.0625rem;font-weight:600', text: g.title }),
          el('p', { text: g.excerpt || '' }),
          el('span', { class: 'text-xs', style: 'color:var(--c-accent-deep);font-weight:600', text: 'Đọc bài →' })
        ])
      ]));
    });
  }

  /* ==========================================================================
     TRANG: MỘT BÀI CẨM NANG
     ========================================================================== */

  function renderGuide() {
    var mount = $('#guide-root');
    if (!mount) return;

    var slug = H.param('slug');
    var guides = H.CFG.guides || [];
    var g = guides.filter(function (x) { return x.slug === slug; })[0];

    if (!g) {
      mount.innerHTML = '';
      mount.appendChild(pendingBlock('Không tìm thấy bài viết này',
        'Đường dẫn có thể đã thay đổi. Bạn xem danh sách bài viết trong mục Cẩm nang.'));
      var back = el('p', { class: 'mt-3' }, [el('a', { href: 'guides.html', text: '← Về danh sách cẩm nang' })]);
      mount.appendChild(back);
      return;
    }

    document.title = g.title + ' — Bạc Hải Yến';

    var crumb = $('#guide-crumb');
    if (crumb) crumb.textContent = g.title;

    mount.innerHTML = '';

    mount.appendChild(el('article', {}, [
      H.picture({ src: g.image, alt: '', ratio: '3x2', label: '' }),

      el('header', { class: 'mt-5' }, [
        el('h1', { text: g.title }),
        g.excerpt ? el('p', { class: 'text-soft mt-3', style: 'font-size:1.0625rem', text: g.excerpt }) : null
      ]),

      el('div', { class: 'mt-5', style: 'font-size:1.0625rem;line-height:1.75' },
        (g.body || []).map(function (p) {
          return el('p', { text: p });
        }))
    ]));

    /* ------------------------------------------------- CÁC BÀI KHÁC */
    var others = guides.filter(function (x) { return x.slug !== g.slug; });
    var otherMount = $('#guide-others');

    if (otherMount && others.length) {
      otherMount.innerHTML = '';

      var grid = el('div', { class: 'grid grid--3' });

      others.slice(0, 3).forEach(function (o) {
        grid.appendChild(el('a', { class: 'guide-card', href: 'guide.html?slug=' + encodeURIComponent(o.slug) }, [
          H.picture({ src: o.image, alt: '', ratio: '3x2', label: '' }),
          el('div', { class: 'guide-card__body' }, [
            el('h3', { style: 'font-size:1rem;font-weight:600', text: o.title }),
            el('p', { text: o.excerpt || '' })
          ])
        ]));
      });

      otherMount.appendChild(grid);
    }
  }

  /* ==========================================================================
     TRANG: GIỚI THIỆU
     ========================================================================== */

  function renderAbout() {
    var mount = $('#about-root');
    if (!mount) return;

    mount.innerHTML = '';

    var B = H.CFG.brand || {};
    var biz = H.CFG.business || {};
    var branches = H.CFG.branches || [];

    // Những gì thực sự biết chắc: tên thương hiệu, ngành hàng, các khu vực cửa hàng.
    // Câu chuyện thương hiệu, số năm kinh nghiệm, chứng nhận — chưa có, KHÔNG bịa.
    mount.appendChild(el('div', { class: 'stack stack--5' }, [

      el('div', {}, [
        el('h2', { text: 'Bạc Hải Yến' }),
        el('p', {
          class: 'text-soft',
          text: 'Bạc Hải Yến là cửa hàng trang sức bạc tại miền Bắc, hiện có mặt ở Thái Bình, Hà Nội và Hải Phòng. ' +
                'Chúng tôi tập trung vào trang sức bạc 925 với thiết kế thanh lịch, dễ đeo hằng ngày.'
        })
      ]),

      el('div', {}, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Cửa hàng' }),
        el('ul', { style: 'list-style:none;padding:0;margin:0' },
          branches.map(function (b) {
            return el('li', { style: 'padding:10px 0;border-bottom:1px solid var(--c-line)' }, [
              el('a', { href: 'store.html?id=' + b.id, text: b.label })
            ]);
          }))
      ]),

      /* PHẦN NÀY CHỜ CHỦ CỬA HÀNG */
      el('div', {}, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Câu chuyện cửa hàng' }),
        pendingBlock('Phần này đang chờ nội dung từ chủ cửa hàng',
          'Website cố ý không tự viết câu chuyện thương hiệu, số năm kinh nghiệm hay các chứng nhận, ' +
          'vì đó là những điều chỉ chủ cửa hàng biết và chịu trách nhiệm. ' +
          'Khi bạn gửi nội dung, phần này sẽ được đưa lên ngay.')
      ]),

      /* THÔNG TIN PHÁP LÝ */
      el('div', {}, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Thông tin đơn vị kinh doanh' }),
        biz.taxCode || biz.registeredAddress
          ? el('dl', { style: 'margin:0' }, [
              contactRow('Tên đơn vị', biz.legalName || null),
              contactRow('Mã số thuế', biz.taxCode || null),
              contactRow('Địa chỉ đăng ký', biz.registeredAddress || null)
            ])
          : pendingBlock('Thông tin đăng ký kinh doanh chưa được công bố',
              'Website không tự đặt mã số thuế, địa chỉ đăng ký hay các nhãn xác nhận thủ tục thương mại điện tử. ' +
              'Những thông tin này sẽ được đưa lên sau khi chủ cửa hàng xác nhận.')
      ])

    ]));
  }

  /* ==========================================================================
     TRANG: LIÊN HỆ
     ========================================================================== */

  function renderContact() {
    var mount = $('#contact-root');
    if (!mount) return;

    var c = H.CFG.contacts || {};
    mount.innerHTML = '';

    /* -------------------------------------------------- CÁCH LIÊN HỆ */
    mount.appendChild(el('div', { class: 'stack stack--4' }, [

      el('div', {}, [
        el('h2', { text: 'Gọi điện hoặc gửi email' }),
        el('p', {
          class: 'text-soft',
          text: 'Website đang trong giai đoạn chuẩn bị nên chưa nhận đơn trực tuyến. ' +
                'Cách nhanh nhất để đặt hàng hoặc hỏi về một món cụ thể là gọi hotline.'
        })
      ]),

      (c.hotlines || []).filter(Boolean).length
        ? el('div', {}, [
            el('h3', { style: 'font-size:1.125rem;margin-bottom:12px', text: 'Hotline' }),
            el('div', { class: 'row' }, hotlineLinks())
          ])
        : null,

      el('dl', { style: 'margin:0' }, [
        contactRow('Email', c.email ? [el('a', { href: 'mailto:' + c.email, text: c.email })] : null),
        contactRow('Giờ liên hệ', c.hours ? c.hours : null),
        contactRow('Zalo', c.zalo ? [el('a', { href: c.zalo, rel: 'noopener', text: 'Mở Zalo' })] : null),
        contactRow('Facebook', c.facebook ? [el('a', { href: c.facebook, rel: 'noopener', text: 'Mở Facebook' })] : null),
        contactRow('Instagram', c.instagram ? [el('a', { href: c.instagram, rel: 'noopener', text: 'Mở Instagram' })] : null),
        contactRow('Shopee', c.shopee ? [el('a', { href: c.shopee, rel: 'noopener', text: 'Mở gian hàng Shopee' })] : null)
      ]),

      // Nói rõ kênh nào chưa có, thay vì để trống không giải thích
      buildMissingChannels(c),

      /* ------------------------------------------------------ BIỂU MẪU */
      el('div', { class: 'mt-5' }, [
        el('h3', { style: 'font-size:1.125rem;margin-bottom:8px', text: 'Hoặc để lại lời nhắn' }),
        el('p', {
          class: 'text-sm text-soft mb-3',
          text: 'Biểu mẫu này mở sẵn trong ứng dụng email của bạn, nên nội dung đi thẳng tới hộp thư của cửa hàng ' +
                'mà không cần máy chủ trung gian. Bạn kiểm tra lại nội dung rồi bấm Gửi trong ứng dụng mail.'
        }),
        buildContactForm(c)
      ])

    ]));
  }

  function buildContactForm(c) {
    if (!c.email) {
      return pendingBlock('Chưa có địa chỉ email',
        'Cửa hàng chưa cung cấp email nên chưa thể nhận lời nhắn qua biểu mẫu. Bạn gọi hotline để liên hệ.');
    }

    var name = el('input', { class: 'input', type: 'text', id: 'c-name', name: 'name', autocomplete: 'name', required: true });
    var phone = el('input', { class: 'input', type: 'tel', id: 'c-phone', name: 'phone', autocomplete: 'tel', inputmode: 'tel' });
    var msg = el('textarea', { class: 'textarea', id: 'c-msg', name: 'message', required: true });

    var form = el('form', { class: 'stack stack--3', novalidate: true }, [
      el('div', { class: 'field' }, [
        el('label', { for: 'c-name', text: 'Tên của bạn' }),
        name,
        el('span', { class: 'error', text: 'Bạn cho chúng tôi biết tên nhé.' })
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'c-phone', text: 'Số điện thoại (không bắt buộc)' }),
        phone,
        el('span', { class: 'hint', text: 'Để lại số điện thoại nếu bạn muốn cửa hàng gọi lại.' })
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'c-msg', text: 'Nội dung' }),
        msg,
        el('span', { class: 'hint', text: 'Ví dụ: bạn muốn hỏi về món nào, hoặc muốn đặt hàng món gì.' }),
        el('span', { class: 'error', text: 'Bạn viết giúp chúng tôi nội dung cần hỏi.' })
      ]),
      el('button', { class: 'btn btn--lg', type: 'submit', text: 'Mở ứng dụng email' })
    ]);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;

      // Kiểm tra phía máy khách chỉ để báo lỗi sớm.
      // Nếu có backend, máy chủ vẫn phải kiểm tra lại toàn bộ.
      [['#c-name', name], ['#c-msg', msg]].forEach(function (pair) {
        var field = $(pair[0]).closest('.field');
        var valid = pair[1].value.trim().length > 0;
        field.classList.toggle('has-error', !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        var firstError = $('.field.has-error .input, .field.has-error .textarea');
        if (firstError) firstError.focus();
        H.toast('Bạn kiểm tra lại các ô còn thiếu.', 'error');
        return;
      }

      var subject = 'Liên hệ từ website — ' + name.value.trim();
      var body = 'Tên: ' + name.value.trim() + '\n' +
                 'Số điện thoại: ' + (phone.value.trim() || '(không để lại)') + '\n\n' +
                 msg.value.trim();

      window.location.href = 'mailto:' + c.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      H.toast('Ứng dụng email đang mở. Bạn kiểm tra nội dung rồi bấm Gửi nhé.', 'success', 6000);
    });

    return form;
  }

  /* ==========================================================================
     TRANG: CÂU HỎI THƯỜNG GẶP
     ========================================================================== */

  function renderFaq() {
    var mount = $('#faq-root');
    if (!mount) return;

    var faqs = (H.CFG.faqs || []).filter(function (f) { return f.q && f.a; });

    mount.innerHTML = '';

    if (!faqs.length) {
      mount.appendChild(pendingBlock('Chưa có câu hỏi nào',
        'Các câu hỏi thường gặp sẽ được bổ sung sau. Trong lúc đó, bạn gọi hotline để được giải đáp.'));
      return;
    }

    var box = el('div', { class: 'accordion' });

    faqs.forEach(function (f, i) {
      var panel = el('div', { class: 'accordion__panel', id: 'faq-panel-' + i, hidden: true }, [
        el('p', { text: f.a })
      ]);

      var trigger = el('button', {
        class: 'accordion__trigger',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': 'faq-panel-' + i
      }, [
        el('span', { text: f.q }),
        el('span', { html: H.ICON.chevron })
      ]);

      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.hidden = open;
      });

      box.appendChild(el('div', { class: 'accordion__item' }, [trigger, panel]));
    });

    mount.appendChild(box);

    mount.appendChild(el('div', { class: 'mt-5' }, [
      el('p', { class: 'text-soft', text: 'Chưa thấy câu trả lời bạn cần?' }),
      el('div', { class: 'row mt-2' }, [
        el('a', { class: 'btn btn--ghost', href: 'contact.html', text: 'Liên hệ cửa hàng' })
      ])
    ]));
  }

  /* ==========================================================================
     TRANG: CHÍNH SÁCH
     ========================================================================== */

  var POLICY_LABEL = {
    shippingPolicy: 'Chính sách giao hàng',
    returnPolicy: 'Chính sách đổi trả',
    warrantyPolicy: 'Chính sách bảo hành',
    cleaningService: 'Dịch vụ làm sáng bạc',
    giftWrap: 'Dịch vụ gói quà',
    engraving: 'Dịch vụ khắc tên',
    privacyPolicy: 'Chính sách bảo mật',
    termsOfService: 'Điều khoản sử dụng'
  };

  function renderPolicy() {
    var mount = $('#policy-root');
    var listMount = $('#policy-list');
    if (!mount) return;

    var pol = H.CFG.policies || {};
    var id = H.param('id');

    // Danh sách các chính sách đã có nội dung thật
    var available = Object.keys(POLICY_LABEL).filter(function (k) {
      return pol[k] && String(pol[k]).trim().length > 0;
    });

    if (listMount) {
      listMount.innerHTML = '';

      if (available.length) {
        var ul = el('ul', { style: 'list-style:none;padding:0;margin:0' });
        available.forEach(function (k) {
          ul.appendChild(el('li', { style: 'padding:8px 0;border-bottom:1px solid var(--c-line)' }, [
            el('a', {
              href: 'policy.html?id=' + k,
              text: POLICY_LABEL[k],
              'aria-current': k === id ? 'page' : null
            })
          ]));
        });
        listMount.appendChild(ul);
      } else {
        listMount.appendChild(el('p', { class: 'text-sm text-soft' },
          ['Cửa hàng chưa công bố chính sách nào trên website.']));
      }
    }

    mount.innerHTML = '';

    /* -------------------------------------- CHƯA CÓ CHÍNH SÁCH NÀO */
    if (!available.length) {
      mount.appendChild(el('h1', { text: 'Chính sách cửa hàng' }));
      mount.appendChild(el('div', { class: 'mt-4' }, [
        pendingBlock('Cửa hàng chưa công bố chính sách',
          'Các nội dung như giao hàng, đổi trả, bảo hành và bảo mật phải do chủ cửa hàng xác nhận trước khi công bố. ' +
          'Website không tự đặt ra chính sách, vì khách sẽ dựa vào đó để quyết định mua hàng. ' +
          'Trong lúc chờ, bạn gọi hotline để hỏi trực tiếp.')
      ]));
      mount.appendChild(el('div', { class: 'row mt-4' }, hotlineLinks()));
      return;
    }

    /* ------------------------------------------ CÓ, NHƯNG THIẾU THAM SỐ */
    if (!id || !pol[id]) {
      mount.appendChild(el('h1', { text: 'Chính sách cửa hàng' }));
      mount.appendChild(el('p', { class: 'text-soft mt-3' },
        ['Bạn chọn một mục ở danh sách bên cạnh để xem nội dung chi tiết.']));
      return;
    }

    document.title = POLICY_LABEL[id] + ' — Bạc Hải Yến';

    mount.appendChild(el('h1', { text: POLICY_LABEL[id] }));

    // Nội dung chính sách được chủ cửa hàng cung cấp.
    // Mỗi đoạn cách nhau bằng dòng trống trong cấu hình.
    String(pol[id]).split(/\n\s*\n/).forEach(function (para) {
      mount.appendChild(el('p', { class: 'mt-3', style: 'white-space:pre-line', text: para.trim() }));
    });
  }

  /* ==========================================================================
     TRANG: CHĂM SÓC BẠC
     ========================================================================== */

  function renderCare() {
    var mount = $('#care-root');
    if (!mount) return;

    // Nội dung lấy từ cẩm nang để chỉ có MỘT nguồn duy nhất,
    // tránh hai nơi ghi hai kiểu khác nhau.
    var g = (H.CFG.guides || []).filter(function (x) { return x.slug === 'cham-soc-bac'; })[0];

    mount.innerHTML = '';

    if (!g) {
      mount.appendChild(pendingBlock('Chưa có nội dung hướng dẫn',
        'Bài hướng dẫn chăm sóc bạc sẽ được bổ sung sau.'));
      return;
    }

    mount.appendChild(el('p', { class: 'text-soft', style: 'font-size:1.0625rem', text: g.excerpt || '' }));

    mount.appendChild(el('div', { style: 'font-size:1.0625rem;line-height:1.75' },
      (g.body || []).map(function (p) { return el('p', { text: p }); })));

    mount.appendChild(el('div', { class: 'notice notice--info mt-5' }, [
      el('span', { class: 'notice__icon', html: H.ICON.info }),
      el('div', {}, [
        el('p', {
          text: 'Bạc xỉn màu là phản ứng tự nhiên của kim loại với môi trường, không phải lỗi sản phẩm. ' +
                'Không có cách nào giữ bạc sáng mãi mà không cần vệ sinh định kỳ.'
        })
      ])
    ]));
  }

  /* ==========================================================================
     TRANG: HƯỚNG DẪN ĐO SIZE
     ========================================================================== */

  function renderSizeGuide() {
    var mount = $('#size-guide-root');
    if (!mount) return;

    var g = (H.CFG.guides || []).filter(function (x) { return x.slug === 'do-size-nhan'; })[0];

    mount.innerHTML = '';

    if (g) {
      mount.appendChild(el('p', { class: 'text-soft', style: 'font-size:1.0625rem', text: g.excerpt || '' }));
      mount.appendChild(el('div', { style: 'font-size:1.0625rem;line-height:1.75' },
        (g.body || []).map(function (p) { return el('p', { text: p }); })));
    } else {
      mount.appendChild(pendingBlock('Chưa có nội dung hướng dẫn',
        'Bài hướng dẫn đo size sẽ được bổ sung sau.'));
    }

    /* -------------------------------------------------- BẢNG SIZE */
    var tableMount = $('#size-table-root');
    if (!tableMount) return;

    H.loadCatalog().then(function (cat) {
      tableMount.innerHTML = '';

      var guide = (cat.sizeGuides || []).filter(function (x) { return x.id === 'nhan'; })[0];

      if (!guide || !guide.rows || !guide.rows.length) {
        // Chưa có thang size thật: nói thẳng, KHÔNG dùng bảng quy đổi chung
        tableMount.appendChild(el('h2', { text: 'Bảng size nhẫn' }));
        tableMount.appendChild(el('div', { class: 'mt-3' }, [
          pendingBlock('Bảng size chưa được đăng',
            'Mỗi xưởng chế tác dùng một thang size khác nhau, nên bảng quy đổi chung trên mạng ' +
            'thường dẫn tới chọn sai cỡ. Cửa hàng đang xác nhận thang size thực tế của mình. ' +
            'Trong lúc chờ, bạn gọi hotline để được hướng dẫn đo và chọn size.')
        ]));
        tableMount.appendChild(el('div', { class: 'row mt-4' }, hotlineLinks()));
        return;
      }

      tableMount.appendChild(el('h2', { text: guide.title || 'Bảng size nhẫn' }));
      if (guide.note) tableMount.appendChild(el('p', { class: 'text-soft mt-3', text: guide.note }));

      var table = el('table', { class: 'size-table' }, [
        el('thead', {}, [
          el('tr', {}, guide.headers.map(function (h) { return el('th', { scope: 'col', text: h }); }))
        ]),
        el('tbody', {}, guide.rows.map(function (row) {
          return el('tr', {}, row.map(function (c) { return el('td', { text: String(c) }); }));
        }))
      ]);

      tableMount.appendChild(el('div', { class: 'table-wrap mt-3' }, [table]));
    });
  }

  /* ==========================================================================
     TRANG: 404
     ========================================================================== */

  function renderNotFound() {
    var mount = $('#notfound-root');
    if (!mount) return;

    mount.innerHTML = '';

    mount.appendChild(el('div', { class: 'empty' }, [
      el('span', { html: H.ICON.search }),
      el('h1', { text: 'Không tìm thấy trang này' }),
      el('p', {
        text: 'Đường dẫn có thể đã đổi hoặc bị gõ nhầm. Bạn thử một trong các lối vào dưới đây nhé.'
      }),
      el('div', { class: 'row', style: 'justify-content:center' }, [
        el('a', { class: 'btn', href: 'index.html', text: 'Về trang chủ' }),
        el('a', { class: 'btn btn--ghost', href: 'catalog.html', text: 'Xem trang sức' }),
        el('a', { class: 'btn btn--ghost', href: 'contact.html', text: 'Liên hệ cửa hàng' })
      ])
    ]));
  }

  /* ==========================================================================
     KHỞI TẠO
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    // Các trang cần catalog
    var needsCatalog = ['store', 'notfound'];

    if (needsCatalog.indexOf(page) !== -1) {
      H.loadCatalog().then(function (cat) {
        catalog = cat;
        if (page === 'store') renderStore();
        if (page === 'notfound') renderNotFound();
      });
      return;
    }

    switch (page) {
      case 'stores':     renderStores(); break;
      case 'guides':     renderGuides(); break;
      case 'guide':      renderGuide(); break;
      case 'about':      renderAbout(); break;
      case 'contact':    renderContact(); break;
      case 'faq':        renderFaq(); break;
      case 'policy':     renderPolicy(); break;
      case 'care':       renderCare(); break;
      case 'size-guide': renderSizeGuide(); break;
    }
  });

})();
