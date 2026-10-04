/* ============================================================================
   Bạc Hải Yến — Cấu hình thương hiệu và vận hành
   ----------------------------------------------------------------------------
   Đây là nơi DUY NHẤT chứa dữ liệu thật của cửa hàng. Sửa file này là đổi
   được toàn bộ website, không cần đụng vào mã giao diện.

   Trường nào để chuỗi rỗng ("") thì giao diện TỰ ĐỘNG ẨN mục đó đi,
   không hiển thị chỗ trống hay chữ "đang cập nhật".
   ========================================================================== */

window.BHY_CONFIG = {

  /* --------------------------------------------------------------------------
     1. TRẠNG THÁI PHÁT HÀNH
     --------------------------------------------------------------------------
     'catalogue' — khách xem sản phẩm, lưu danh sách và liên hệ cửa hàng.
     'preview'   — như catalogue, nhưng có thêm dải thông báo bản xem trước.
     Website hiện không có luồng thanh toán hoặc lưu đơn trực tuyến.
     -------------------------------------------------------------------------- */
  release: 'catalogue',

  /* --------------------------------------------------------------------------
     2. NHẬN DIỆN THƯƠNG HIỆU
     -------------------------------------------------------------------------- */
  brand: {
    name: 'Bạc Hải Yến',
    // Tên viết hoa dùng cho logo/wordmark khi cần chữ thay ảnh
    nameUpper: 'BẠC HẢI YẾN',
    domain: '', // điền tên miền chính thức sau khi xác nhận với chủ cửa hàng
    slogan: 'Một chút bạc, một nét riêng.',
    tagline: 'Chọn món trang sức đồng hành cùng những khoảnh khắc của bạn.',

    // Bộ nhận diện: trắng — đen, ánh bạc.
    colors: {
      paper:   '#FAF9F7',   // nền chính, trắng ngà ấm rất nhẹ
      surface: '#FFFFFF',   // nền thẻ, nền khối nội dung
      muted:   '#F0EFEC',   // nền phụ
      ink:     '#1A1A1A',   // chữ chính, gần đen
      inkSoft: '#6A6A6A',   // chữ phụ
      line:    '#DEDAD4',   // đường viền
      accent:  '#9A7B4F'    // màu nhấn duy nhất, dùng tiết chế cho CTA và liên kết
    },

    logo: {
      // Bản nền trong suốt, chữ/mark màu #1A1A1A — dùng trên nền sáng
      lockupOnLight: 'assets/logo/logo-lockup-on-light.png',
      markOnLight:   'assets/logo/logo-mark-on-light.png',
      // Bản nền trong suốt, mark màu trắng — dùng trên nền tối (footer)
      lockupOnDark:  'assets/logo/logo-lockup-on-dark.png',
      markOnDark:    'assets/logo/logo-mark-on-dark.png',
      favicon:       'assets/logo/favicon.ico'
    }
  },

  /* --------------------------------------------------------------------------
     3. PHÁP NHÂN VÀ LIÊN HỆ
     -------------------------------------------------------------------------- */
  business: {
    legalName: 'Bạc Hải Yến',
    // Thông tin đăng ký kinh doanh: điền khi có giấy tờ thật.
    // Không tự bịa mã số thuế hay địa chỉ đăng ký.
    taxCode: '',
    registeredAddress: '',
    legalRepresentative: ''
  },

  contacts: {
    hotlines: ['0982338388', '0904868881'],
    email: 'bachaiyenhn@gmail.com',
    // Để trống thì mục tương ứng tự ẩn trên toàn site.
    // Khi có đường dẫn thật, dán vào đây và web tự hiện.
    zalo: '', // chờ xác nhận link Zalo chính thức
    facebook: '',
    instagram: '',
    shopee: '',
    // Giờ trả lời tin nhắn/điện thoại
    hours: ''
  },

  /* --------------------------------------------------------------------------
     4. HAI CHI NHÁNH
     --------------------------------------------------------------------------
     Cập nhật 01/10/2026: cửa hàng Hà Nội đã đóng, chỉ còn Thái Bình và Hải Phòng.

     TÌNH TRẠNG ĐỊA CHỈ:
     Chủ cửa hàng đã cung cấp link Google Maps của cả hai nơi, và giờ mở cửa.
     ĐỊA CHỈ DẠNG CHỮ (số nhà, đường, phường) VẪN CHƯA CÓ.
     Vì vậy trường `address` để trống, và trang cửa hàng sẽ hiện nút "Mở bản đồ"
     dẫn tới đúng vị trí — khách vẫn tới được, mà không cần bịa địa chỉ.

     Khi có địa chỉ chữ, điền vào `address` theo đơn vị hành chính đang áp dụng
     tại thời điểm điền. Điền xong thì địa chỉ tự hiện thêm bên cạnh nút bản đồ.
     -------------------------------------------------------------------------- */
  branches: [
    {
      id: 'thai-binh',
      name: 'Thái Bình',
      label: 'Bạc Hải Yến Thái Bình',
      address: '',          // chờ địa chỉ dạng chữ
      phone: '',            // để trống thì dùng hotline chung
      hours: '08:00 – 20:00 hằng ngày',
      mapUrl: 'https://maps.app.goo.gl/vCycxWPsr8hCR3x79',
      note: '',
      image: ''
    },
    {
      id: 'hai-phong',
      name: 'Hải Phòng',
      label: 'Bạc Hải Yến Hải Phòng',
      address: '',
      phone: '',
      hours: '08:00 – 20:00 hằng ngày',
      mapUrl: 'https://maps.app.goo.gl/RrZqPWzGdcQpsyiR6',
      note: '',
      image: ''
    }
  ],

  /* --------------------------------------------------------------------------
     5. THANH THÔNG BÁO ĐẦU TRANG
     --------------------------------------------------------------------------
     Để trống thì thanh này tự ẩn. Không dùng chữ chạy liên tục.
     Chỉ điền vào đây thông điệp đã được chủ cửa hàng duyệt.
     -------------------------------------------------------------------------- */
  announcement: {
    enabled: false,
    text: '',
    linkLabel: '',
    linkHref: ''
  },

  /* --------------------------------------------------------------------------
     6. ĐIỀU HƯỚNG CHÍNH
     -------------------------------------------------------------------------- */
  nav: [
    { label: 'Trang sức',   href: 'catalog.html' },
    { label: 'Bộ sưu tập',  href: 'catalog.html?collection=noi-bat' },
    { label: 'Quà tặng',    href: 'gift.html' },
    { label: 'Cửa hàng',    href: 'stores.html' },
    { label: 'Cẩm nang',    href: 'guides.html' }
  ],

  /* --------------------------------------------------------------------------
     7. GIAO HÀNG, THANH TOÁN, CHÍNH SÁCH
     --------------------------------------------------------------------------
     TẤT CẢ ĐANG ĐỂ TRỐNG CÓ CHỦ Ý.
     Biểu phí giao hàng, chính sách đổi trả, bảo hành và phương thức nhận tiền
     là những nội dung phải do chủ cửa hàng xác nhận. Website sẽ ẩn các mục này
     thay vì tự đặt ra chính sách rồi khách hiểu sai.
     -------------------------------------------------------------------------- */
  shipping: {
    // Ví dụ cấu hình khi có dữ liệu thật:
    // zones: [{ name: 'Nội thành Hà Nội', fee: 25000, freeFrom: 500000 }]
    zones: [],
    freeShippingFrom: null,   // số VND, ví dụ 500000
    carriers: [],             // ví dụ ['Viettel Post', 'GHTK']
    estimateNote: ''
  },

  payment: {
    // Bật sau khi chủ cửa hàng xác nhận và cung cấp thông tin.
    cod: false,               // thu tiền khi nhận hàng
    bankTransfer: false,      // chuyển khoản — cần số tài khoản thật
    onlineGateway: false,     // cổng thanh toán — cần hợp đồng và khóa API
    bankInfo: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: ''
    }
  },

  policies: {
    // Để trống thì mục tương ứng được ẩn trên footer và trang chính sách.
    returnPolicy: '',
    warrantyPolicy: '',
    shippingPolicy: '',
    privacyPolicy: '',
    termsOfService: '',
    cleaningService: '',
    giftWrap: '',        // gói quà: chỉ điền khi cửa hàng thực sự có dịch vụ
    engraving: ''        // khắc tên: chỉ điền khi cửa hàng thực sự có dịch vụ
  },

  /* --------------------------------------------------------------------------
     8. CẨM NANG — NỘI DUNG BỀN, MỘT NGƯỜI MEDIA QUẢN ĐƯỢC
     -------------------------------------------------------------------------- */
  guides: [
    {
      slug: 'do-size-nhan',
      title: 'Cách đo size nhẫn tại nhà',
      excerpt: 'Đo chu vi ngón tay hoặc đường kính trong của nhẫn đang đeo, rồi gửi số đo để cửa hàng tư vấn cỡ phù hợp.',
      image: '',
      body: [
        'Chuẩn bị một mảnh giấy dài khoảng 10cm, một cây bút và một thước có vạch mm.',
        'Quấn mảnh giấy quanh ngón tay ở vị trí đeo nhẫn, vừa đủ ôm khít nhưng không siết vào da. Đánh dấu điểm giao nhau.',
        'Trải phẳng mảnh giấy, đo khoảng cách từ đầu giấy đến vạch đánh dấu. Đó là chu vi ngón tay, đơn vị mm.',
        'Nếu có một chiếc nhẫn đang đeo vừa, đặt nhẫn lên thước và đo khoảng cách giữa hai mép bên trong vòng nhẫn. Đó là đường kính trong; không đo cả phần kim loại.',
        'Nhập số đo vào mẫu tư vấn trên website. Cửa hàng sẽ đối chiếu với mẫu nhẫn thực tế trước khi xác nhận cỡ phù hợp.',
        'Nên đo vào cuối ngày vì ngón tay hơi to hơn so với buổi sáng. Nếu ngón tay có khớp to, đo cả khớp và chọn cỡ vượt được khớp.',
        'Cách đo tại nhà có sai số nhất định. Nếu bạn chưa chắc, hãy gửi email hoặc gọi hotline để được hỗ trợ.'
      ]
    },
    {
      slug: 'cham-soc-bac',
      title: 'Chăm sóc trang sức bạc',
      excerpt: 'Vì sao bạc xỉn màu, cách làm sáng tại nhà và những thói quen nên tránh để món trang sức bền đẹp.',
      image: '',
      body: [
        'Bạc là kim loại quý có phản ứng tự nhiên với lưu huỳnh trong không khí, mồ hôi và một số loại mỹ phẩm. Hiện tượng xỉn màu là phản ứng hóa học bình thường, không phải lỗi sản phẩm.',
        'Nên tháo trang sức khi tắm, khi bơi, khi tập thể thao và khi làm việc nhà. Nước có clo và hóa chất tẩy rửa làm bạc xỉn nhanh hơn.',
        'Nên thoa nước hoa, kem dưỡng và xịt tóc trước rồi mới đeo trang sức, để mỹ phẩm khô hoàn toàn.',
        'Cách làm sáng đơn giản: dùng khăn mềm chuyên dụng cho trang sức lau nhẹ theo một chiều. Với món xỉn lâu, dùng dung dịch làm sáng bạc pha loãng theo hướng dẫn trên nhãn, ngâm thời gian ngắn rồi rửa lại bằng nước sạch và lau khô.',
        'Không dùng bàn chải sắt, không chà bằng muối hạt hay baking soda lên đá vì có thể làm xước bề mặt và hỏng viên đá.',
        'Khi không đeo, cất trang sức trong hộp kín hoặc túi zip chống ẩm, để riêng từng món tránh cọ xát vào nhau.'
      ]
    },
    {
      slug: 'chon-qua-tang',
      title: 'Chọn quà tặng trang sức',
      excerpt: 'Gợi ý chọn món phù hợp khi bạn chưa rõ người nhận thích gì: bắt đầu từ dịp tặng, mức ngân sách và thói quen đeo.',
      image: '',
      body: [
        'Bắt đầu từ dịp tặng. Quà sinh nhật, quà kỷ niệm và quà cảm ơn thường có mức ngân sách và ý nghĩa khác nhau, chọn đúng dịp sẽ dễ chọn đúng món.',
        'Xác định ngân sách trước rồi mới xem sản phẩm. Một khoản ngân sách rõ ràng giúp bạn không bị cuốn theo những món đắt hơn nhu cầu.',
        'Quan sát thói quen đeo của người nhận. Người thường xuyên đeo khuyên tai sẽ dùng được bông tai; người ít đeo phụ kiện thường hợp một món nhỏ như mặt dây hoặc lắc tay mảnh.',
        'Nếu chưa chắc về size nhẫn, hãy chọn dây chuyền hoặc bông tai — hai món này ít phụ thuộc kích cỡ hơn.',
        'Nếu muốn kèm thiệp hoặc gói quà, hãy hỏi cửa hàng về dịch vụ hiện có khi liên hệ.'
      ]
    }
  ],

  /* --------------------------------------------------------------------------
     9. CÂU HỎI THƯỜNG GẶP
     --------------------------------------------------------------------------
     Chỉ ghi những điều đã được chủ cửa hàng xác nhận.
     Để mảng rỗng thì khối FAQ tự ẩn.
     -------------------------------------------------------------------------- */
  faqs: [
    {
      q: 'Bạc có bị xỉn màu không?',
      a: 'Bạc phản ứng tự nhiên với không khí và mồ hôi nên có thể xỉn màu theo thời gian. Đây là đặc tính của bạc, không phải lỗi sản phẩm. Bạn có thể làm sáng lại tại nhà theo hướng dẫn trong Cẩm nang, hoặc mang tới cửa hàng để được hỗ trợ.'
    },
    {
      q: 'Làm sao biết mình chọn đúng size nhẫn?',
      a: 'Bạn đo chu vi ngón tay hoặc đường kính trong của nhẫn đang đeo, rồi gửi số đo qua mẫu tư vấn size. Cửa hàng sẽ đối chiếu với món nhẫn thực tế và tư vấn cỡ phù hợp.'
    },
    {
      q: 'Website có nhận thanh toán trực tuyến không?',
      a: 'Chưa. Bạn xem sản phẩm trên website, lưu món mình thích rồi liên hệ cửa hàng qua Zalo, điện thoại hoặc các kênh chính thức để được tư vấn.'
    }
  ],

  /* --------------------------------------------------------------------------
     10. HIỆU ỨNG
     -------------------------------------------------------------------------- */
  motion: {
    hoverSwapMs: 220,     // đổi ảnh khi rê chuột, trong khoảng 180–250ms
    drawerMs: 260,        // mở drawer giỏ hàng và bộ lọc, 220–300ms
    revealMs: 320         // fade nhẹ cho khối biên tập, chạy một lần
  },

  /* --------------------------------------------------------------------------
     11. ĐƠN VỊ TIỀN TỆ
     -------------------------------------------------------------------------- */
  currency: {
    code: 'VND',
    symbol: '₫',
    // Giá luôn lưu dạng số nguyên đồng, không dùng số thập phân.
    locale: 'vi-VN'
  }
};
