/* ============================================================================
   Bạc Hải Yến — Giỏ hàng và thanh toán
   ----------------------------------------------------------------------------
   Dùng cho cart.html và checkout.html.

   NGUYÊN TẮC BẮT BUỘC:
   - Giỏ hàng trên máy khách chỉ là tiện ích giữ chỗ trong lúc chọn hàng.
   - Giá, phí giao, mã giảm giá và tồn kho PHẢI được kiểm tra lại ở máy chủ
     khi có backend. Không có backend thì KHÔNG được ghi nhận đơn.
   - Ở chế độ xem trước, nút đặt hàng chuyển sang hướng dẫn liên hệ, và
     giao diện nói rõ vì sao. Không tạo đơn ảo rồi báo "đặt hàng thành công".
   ========================================================================== */

(function () {
  'use strict';

  var H = window.BHY;
  var el = H.el, $ = H.$;

  var page = document.body.getAttribute('data-page');

  /* ==========================================================================
     NỘI DUNG TRANG GIỎ HÀNG
     ========================================================================== */

  function renderCartPage() {
    var mount = $('#cart-root');
    if (!mount) return;

    var items = H.Cart.items();

    mount.innerHTML = '';

    /* ---------------------------------------------------- GIỎ TRỐNG */
    if (!items.length) {
      mount.appendChild(el('div', { class: 'empty' }, [
        el('span', { html: H.ICON.cart }),
        el('h2', { text: 'Chưa có món nào trong danh sách' }),
        el('p', { text: 'Bạn chưa chọn món nào. Ghé xem các món đang có ở cửa hàng nhé.' }),
        el('a', { class: 'btn btn--lg', href: 'catalog.html', text: 'Xem trang sức' })
      ]));
      return;
    }

    var layout = el('div', { class: 'grid', style: 'gap:32px' });

    /* ---------------------------------------------- DANH SÁCH DÒNG HÀNG */
    var list = el('div', {});

    items.forEach(function (it) {
      var optTxt = Object.keys(it.options || {}).map(function (k) {
        return k.charAt(0).toUpperCase() + k.slice(1) + ': ' + it.options[k];
      }).join(' · ');

      var priceCell = typeof it.price === 'number'
        ? el('div', { class: 'cart-line__price' }, [
            el('div', { text: H.formatVnd(it.price * it.qty) }),
            typeof it.price === 'number'
              ? el('div', { class: 'text-xs text-soft', text: H.formatVnd(it.price) + ' / món' })
              : null
          ])
        : el('div', { class: 'cart-line__price' }, [
            el('div', { class: 'text-xs', style: 'color:var(--c-accent-deep);font-weight:600', text: 'Liên hệ' })
          ]);

      var line = el('div', { class: 'cart-line' }, [
        el('div', { class: 'cart-line__media' }, [
          H.picture({ src: it.image, alt: it.name, ratio: '1x1', label: it.name })
        ]),

        el('div', { class: 'cart-line__info' }, [
          el('a', {
            class: 'cart-line__name',
            href: 'product.html?slug=' + encodeURIComponent(it.slug),
            text: it.name
          }),
          it.sku ? el('div', { class: 'text-xs text-faint', text: 'Mã: ' + it.sku }) : null,
          optTxt ? el('div', { class: 'cart-line__opts', text: optTxt }) : null,

          el('div', { class: 'cart-line__ctl' }, [
            el('div', { class: 'qty' }, [
              el('button', {
                type: 'button',
                'aria-label': 'Giảm số lượng',
                text: '−',
                disabled: it.qty <= 1,
                onclick: function () { H.Cart.setQty(it.key, it.qty - 1); renderCartPage(); renderSummary(); }
              }),
              el('input', {
                type: 'number',
                value: it.qty,
                min: '1',
                max: '99',
                'aria-label': 'Số lượng của ' + it.name,
                onchange: function (e) {
                  var v = parseInt(e.target.value, 10);
                  H.Cart.setQty(it.key, isNaN(v) ? 1 : v);
                  renderCartPage();
                  renderSummary();
                }
              }),
              el('button', {
                type: 'button',
                'aria-label': 'Tăng số lượng',
                text: '+',
                disabled: it.qty >= 99,
                onclick: function () { H.Cart.setQty(it.key, it.qty + 1); renderCartPage(); renderSummary(); }
              })
            ]),
            el('button', {
              class: 'link-quiet',
              type: 'button',
              text: 'Xóa món này',
              onclick: function () {
                H.Cart.remove(it.key);
                renderCartPage();
                renderSummary();
                H.toast('Đã xóa khỏi danh sách.');
              }
            })
          ])
        ]),

        priceCell
      ]);

      list.appendChild(line);
    });

    layout.appendChild(list);

    /* ------------------------------------------------- TÓM TẮT ĐƠN HÀNG */
    var summary = el('aside', { id: 'summary' });
    layout.appendChild(summary);

    mount.appendChild(layout);

    renderSummary();
  }

  function renderSummary() {
    var mount = $('#summary');
    if (!mount) return;

    var items = H.Cart.items();
    if (!items.length) {
      mount.innerHTML = '';
      return;
    }

    var sub = H.Cart.subtotal();
    mount.innerHTML = '';

    var card = el('div', {
      style: 'border:1px solid var(--c-line);border-radius:10px;padding:24px;background:var(--c-surface)'
    }, [
      el('h2', { style: 'font-size:1.125rem;margin-bottom:16px', text: 'Liên hệ về các món đã chọn' })
    ]);

    card.appendChild(el('div', { class: 'totals-row' }, [
      el('span', { text: 'Giá tham khảo (' + H.Cart.count() + ' món)' }),
      el('strong', { text: sub === null ? 'Liên hệ' : H.formatVnd(sub) })
    ]));
    card.appendChild(el('p', { class: 'text-xs text-soft mb-3' }, [
      'Giá, size nhẫn, tình trạng hàng và cách nhận sẽ được cửa hàng xác nhận khi bạn liên hệ. Website không nhận thanh toán.'
    ]));

    var message = 'Chào Bạc Hải Yến, tôi muốn hỏi về các món sau:\n' + items.map(function (it, i) {
      var opts = Object.keys(it.options || {}).map(function (k) { return k + ': ' + it.options[k]; }).join(', ');
      return (i + 1) + '. ' + it.name + (it.sku ? ' (' + it.sku + ')' : '') + ' × ' + it.qty +
        (opts ? ' — ' + opts : '') + '\n' +
        new URL('product.html?slug=' + encodeURIComponent(it.slug), window.location.href).href;
    }).join('\n') + '\nNhờ cửa hàng kiểm tra giá, tình trạng hàng và tư vấn cách nhận.';

    card.appendChild(el('div', { class: 'field mt-3' }, [
      el('label', { for: 'selection-message', text: 'Lời nhắn gửi cửa hàng' }),
      el('textarea', { id: 'selection-message', class: 'textarea', readonly: true, text: message }),
      el('span', { class: 'hint', text: 'Bạn có thể sao chép lời nhắn và dán vào kênh liên hệ mình dùng.' })
    ]));

    var links = el('div', { class: 'stack stack--2 mt-3' });
    var c = H.CFG.contacts || {};
    if (c.zalo) links.appendChild(el('a', { class: 'btn btn--block', href: c.zalo, target: '_blank', rel: 'noopener', text: 'Mở Zalo để gửi lời nhắn' }));
    if (c.email) links.appendChild(el('a', {
      class: 'btn btn--ghost btn--block',
      href: 'mailto:' + c.email + '?subject=' + encodeURIComponent('Hỏi sản phẩm Bạc Hải Yến') + '&body=' + encodeURIComponent(message),
      text: 'Gửi qua email'
    }));
    ['facebook', 'instagram', 'shopee'].forEach(function (channel) {
      if (!c[channel]) return;
      links.appendChild(el('a', {
        class: 'btn btn--ghost btn--block', href: c[channel], target: '_blank', rel: 'noopener',
        text: 'Mở ' + ({ facebook: 'Facebook', instagram: 'Instagram', shopee: 'Shopee' })[channel]
      }));
    });
    links.appendChild(el('button', {
      class: 'btn btn--ghost btn--block', type: 'button', text: 'Sao chép lời nhắn',
      onclick: function (e) {
        var textarea = $('#selection-message');
        textarea.focus();
        textarea.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(message).then(function () { e.currentTarget.textContent = 'Đã sao chép'; });
        } else if (document.execCommand('copy')) {
          e.currentTarget.textContent = 'Đã sao chép';
        }
      }
    }));
    ((c.hotlines || []).filter(Boolean)).forEach(function (p) {
      links.appendChild(el('a', { class: 'btn btn--ghost btn--block', href: 'tel:' + String(p).replace(/\s/g, ''), text: 'Gọi ' + p }));
    });
    card.appendChild(links);

    mount.appendChild(card);

    /* Nút xóa toàn bộ giỏ */
    mount.appendChild(el('button', {
      class: 'link-quiet mt-3',
      type: 'button',
      text: 'Xóa toàn bộ danh sách',
      onclick: function () {
        if (window.confirm('Bạn xóa tất cả món trong danh sách?')) {
          H.Cart.clear();
          renderCartPage();
        }
      }
    }));
  }

  /* ==========================================================================
     TRANG THANH TOÁN
     ========================================================================== */

  function renderCheckoutPage() {
    var mount = $('#checkout-root');
    if (!mount) return;

    var items = H.Cart.items();
    var pay = H.CFG.payment || {};
    var hasPayment = pay.cod || pay.bankTransfer || pay.onlineGateway;

    /* -------------------------------------------- GIỎ TRỐNG HOẶC CHƯA BẬT */
    if (!items.length || !hasPayment) {
      mount.innerHTML = '';

      mount.appendChild(el('div', { class: 'empty' }, [
        el('span', { html: items.length ? H.ICON.info : H.ICON.cart }),
        el('h2', { text: items.length ? 'Cửa hàng chưa bật đặt hàng trực tuyến' : 'Giỏ hàng đang trống' }),
        el('p', {
          text: items.length
            ? 'Website đang trong giai đoạn chuẩn bị. Bạn gọi hotline để đặt hàng — cửa hàng sẽ xác nhận giá, tình trạng hàng và cách nhận hàng.'
            : 'Bạn chưa chọn món nào. Ghé xem các món đang có ở cửa hàng nhé.'
        }),
        items.length
          ? el('div', { class: 'stack stack--2', style: 'width:min(360px,100%)' },
              ((H.CFG.contacts || {}).hotlines || []).filter(Boolean).map(function (p) {
                return el('a', { class: 'btn btn--block', href: 'tel:' + String(p).replace(/\s/g, ''), text: 'Gọi ' + p });
              }))
          : el('a', { class: 'btn btn--lg', href: 'catalog.html', text: 'Xem trang sức' })
      ]));

      return;
    }

    /* ------------------------------------------------------ BIỂU MẪU THẬT */
    // Phần này chỉ chạy khi chủ cửa hàng đã bật phương thức nhận tiền.
    // Khi có backend, biểu mẫu này phải gửi lên máy chủ và máy chủ phải
    // kiểm tra lại giá, tồn kho và tạo đơn có khóa chống trùng.
    mount.innerHTML = '';
    mount.appendChild(el('div', { class: 'notice notice--warning' }, [
      el('span', { class: 'notice__icon', html: H.ICON.alert }),
      el('div', {}, [
        el('p', {}, [el('strong', { text: 'Phần thanh toán chưa hoàn tất.' })]),
        el('p', {
          class: 'text-sm',
          text: 'Biểu mẫu đặt hàng cần một máy chủ lưu đơn thật, để đơn không bị mất khi khách tắt trình duyệt. ' +
                'Việc này chưa được triển khai, nên website chưa thể nhận đơn. Bạn gọi hotline để đặt hàng.'
        })
      ])
    ]));
  }

  /* ==========================================================================
     KHỞI TẠO
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    if (page === 'cart') renderCartPage();
    if (page === 'checkout') renderCheckoutPage();

    // Cập nhật lại khi giỏ thay đổi ở nơi khác
    document.addEventListener('bhy:cart-changed', function () {
      if (page === 'cart') renderSummary();
    });
  });

})();
