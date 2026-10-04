/* Mẫu hỏi size chạy hoàn toàn trên trình duyệt. Chỉ khách mới gửi nội dung đi. */
(function () {
  'use strict';

  function mountSizeConsult(mount, product) {
    if (!mount) return;
    var c = (window.BHY_CONFIG || {}).contacts || {};
    mount.innerHTML = '';

    var box = document.createElement('section');
    box.className = 'size-consult';
    box.innerHTML =
      '<h2>Nhờ cửa hàng tư vấn size nhẫn</h2>' +
      '<p class="text-sm text-soft">Nhập một số đo bạn có. Cửa hàng sẽ đối chiếu với mẫu nhẫn thực tế trước khi xác nhận cỡ phù hợp.</p>' +
      '<form class="size-consult__form">' +
        '<div class="field"><label>Loại số đo<select class="select" name="measureType"><option value="circumference">Chu vi ngón tay</option><option value="diameter">Đường kính trong của nhẫn đang đeo vừa</option></select></label></div>' +
        '<div class="size-consult__measure"><div class="field"><label>Số đo<input class="input" name="measure" type="text" inputmode="decimal" placeholder="Ví dụ: 1,7" required></label></div>' +
        '<div class="field"><label>Đơn vị<select class="select" name="unit"><option value="mm">mm</option><option value="cm">cm</option></select></label></div></div>' +
        '<div class="field"><label>Ngón tay và bên tay muốn đeo<input class="input" name="finger" type="text" maxlength="80" placeholder="Ví dụ: ngón áp út tay trái"></label></div>' +
        '<div class="field"><label>Điều bạn muốn cửa hàng lưu ý<textarea class="textarea" name="note" maxlength="400" placeholder="Ví dụ: khớp ngón tay to, thích đeo thoải mái"></textarea></label></div>' +
        '<button class="btn" type="submit">Chuẩn bị lời nhắn tư vấn</button>' +
      '</form>' +
      '<div class="size-consult__result" hidden aria-live="polite"><p class="size-consult__estimate"></p>' +
        '<p class="text-sm text-soft">Vui lòng gửi lời nhắn qua một trong các kênh dưới đây. Website chưa tự gửi yêu cầu hoặc xác nhận size.</p>' +
        '<label class="field">Lời nhắn để gửi<textarea class="textarea size-consult__message" readonly></textarea></label>' +
        '<div class="row size-consult__actions"></div>' +
      '</div>';
    mount.appendChild(box);

    var form = box.querySelector('form');
    var result = box.querySelector('.size-consult__result');
    var msgBox = box.querySelector('.size-consult__message');
    var actions = box.querySelector('.size-consult__actions');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var kind = form.elements.measureType.value;
      var raw = Number(form.elements.measure.value.trim().replace(',', '.'));
      var mm = raw * (form.elements.unit.value === 'cm' ? 10 : 1);
      var valid = kind === 'diameter' ? mm >= 10 && mm <= 35 : mm >= 30 && mm <= 110;
      if (!Number.isFinite(mm) || !valid) {
        form.elements.measure.setCustomValidity(kind === 'diameter' ? 'Đường kính hợp lệ từ 10 đến 35 mm.' : 'Chu vi hợp lệ từ 30 đến 110 mm.');
        form.reportValidity();
        return;
      }
      form.elements.measure.setCustomValidity('');
      var circumference = kind === 'diameter' ? mm * Math.PI : mm;
      var measureLabel = kind === 'diameter' ? 'Đường kính trong nhẫn' : 'Chu vi ngón tay';
      var measurement = Math.round(mm * 10) / 10;
      var finger = form.elements.finger.value.trim();
      var note = form.elements.note.value.trim();
      var lines = [
        'Chào Bạc Hải Yến, tôi muốn được tư vấn size nhẫn.',
        product ? 'Sản phẩm: ' + product.name + (product.sku ? ' (' + product.sku + ')' : '') : '',
        measureLabel + ': ' + measurement + ' mm.',
        kind === 'diameter' ? 'Chu vi tương ứng ước tính: ' + (Math.round(circumference * 10) / 10) + ' mm.' : '',
        finger ? 'Ngón muốn đeo: ' + finger : '',
        note ? 'Lưu ý: ' + note : '',
        'Nhờ cửa hàng kiểm tra cỡ phù hợp của mẫu nhẫn trước khi tôi quyết định.'
      ].filter(Boolean);
      var message = lines.join('\n');
      msgBox.value = message;
      box.querySelector('.size-consult__estimate').textContent =
        'Chu vi tham khảo: ' + (Math.round(circumference * 10) / 10) + ' mm. Đây là số đo để trao đổi với cửa hàng, chưa phải size bán hàng.';
      actions.innerHTML = '';

      if (c.zalo) {
        var zalo = document.createElement('a');
        zalo.className = 'btn';
        zalo.href = c.zalo;
        zalo.target = '_blank';
        zalo.rel = 'noopener';
        zalo.textContent = 'Mở Zalo và dán lời nhắn';
        actions.appendChild(zalo);
      }
      if (c.email) {
        var email = document.createElement('a');
        email.className = 'btn btn--ghost';
        email.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Tư vấn size nhẫn Bạc Hải Yến') + '&body=' + encodeURIComponent(message);
        email.textContent = 'Gửi qua email';
        actions.appendChild(email);
      }
      var copy = document.createElement('button');
      copy.className = 'btn btn--ghost';
      copy.type = 'button';
      copy.textContent = 'Sao chép lời nhắn';
      copy.addEventListener('click', function () {
        msgBox.focus();
        msgBox.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(message).then(function () { copy.textContent = 'Đã sao chép'; });
        } else if (document.execCommand('copy')) {
          copy.textContent = 'Đã sao chép';
        }
      });
      actions.appendChild(copy);
      result.hidden = false;
      result.scrollIntoView({ block: 'nearest' });
    });
    form.elements.measure.addEventListener('input', function () { this.setCustomValidity(''); });
    form.elements.measureType.addEventListener('change', function () { form.elements.measure.setCustomValidity(''); });
  }

  window.BHY.mountSizeConsult = mountSizeConsult;
  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('size-consult-root');
    if (mount) mountSizeConsult(mount, null);
  });
})();
