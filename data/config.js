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
     'preview'  — bản xem trước. Khách xem được toàn bộ giao diện nhưng KHÔNG
                  thể chốt đơn. Nút đặt hàng chuyển sang hướng dẫn liên hệ.
                  Dùng đúng chế độ này cho tới khi có đủ: giá, tồn kho thật,
                  địa chỉ cửa hàng, chính sách và phương thức nhận tiền.
     'live'     — chỉ bật khi đã có backend lưu đơn thật (xem PROJECT_STATUS.md).
                  Bật 'live' khi chưa có backend sẽ tạo đơn ảo, không ai nhận
                  được — đừng bật.
     -------------------------------------------------------------------------- */
  release: 'preview',

  /* --------------------------------------------------------------------------
     2. NHẬN DIỆN THƯƠNG HIỆU
     -------------------------------------------------------------------------- */
  brand: {
    name: 'Bạc Hải Yến',
    // Tên viết hoa dùng cho logo/wordmark khi cần chữ thay ảnh
    nameUpper: 'BẠC HẢI YẾN',
    domain: 'bachaiyen.vn',
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
    zalo: 'https://zalo.me/0982338388',
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
      image: 'assets/img/branch-thai-binh.jpg'
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
      image: 'assets/img/branch-hai-phong.jpg'
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
      excerpt: 'Ba cách đo vòng ngón tay bằng giấy, bằng nhẫn đang đeo và đối chiếu bảng size của cửa hàng.',
      image: 'assets/img/guide-size-nhan.jpg',
      body: [
        'Chuẩn bị một mảnh giấy dài khoảng 10cm, một cây bút và một thước có vạch mm.',
        'Quấn mảnh giấy quanh ngón tay ở vị trí đeo nhẫn, vừa đủ ôm khít nhưng không siết vào da. Đánh dấu điểm giao nhau.',
        'Trải phẳng mảnh giấy, đo khoảng cách từ đầu giấy đến vạch đánh dấu. Đó là chu vi ngón tay, đơn vị mm.',
        'Đối chiếu số đo với bảng size của cửa hàng ở trang chi tiết sản phẩm. Nếu số đo nằm giữa hai cỡ, chọn cỡ lớn hơn.',
        'Nên đo vào cuối ngày vì ngón tay hơi to hơn so với buổi sáng. Nếu ngón tay có khớp to, đo cả khớp và chọn cỡ vượt được khớp.',
        'Cách đo tại nhà có sai số nhất định. Nếu bạn chưa chắc, hãy nhắn hotline để được hỗ trợ trước khi đặt hàng.'
      ]
    },
    {
      slug: 'cham-soc-bac',
      title: 'Chăm sóc trang sức bạc',
      excerpt: 'Vì sao bạc xỉn màu, cách làm sáng tại nhà và những thói quen nên tránh để món trang sức bền đẹp.',
      image: 'assets/img/guide-cham-soc-bac.jpg',
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
      image: 'assets/img/guide-chon-qua.jpg',
      body: [
        'Bắt đầu từ dịp tặng. Quà sinh nhật, quà kỷ niệm và quà cảm ơn thường có mức ngân sách và ý nghĩa khác nhau, chọn đúng dịp sẽ dễ chọn đúng món.',
        'Xác định ngân sách trước rồi mới xem sản phẩm. Một khoản ngân sách rõ ràng giúp bạn không bị cuốn theo những món đắt hơn nhu cầu.',
        'Quan sát thói quen đeo của người nhận. Người thường xuyên đeo khuyên tai sẽ dùng được bông tai; người ít đeo phụ kiện thường hợp một món nhỏ như mặt dây hoặc lắc tay mảnh.',
        'Nếu chưa chắc về size nhẫn, hãy chọn dây chuyền hoặc bông tai — hai món này ít phụ thuộc kích cỡ hơn.',
        'Ghi chú thêm một tấm thiệp nhỏ thường khiến món quà được nhớ lâu hơn. Nếu cửa hàng có dịch vụ gói quà, thông tin sẽ hiện ở bước thanh toán.'
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
      a: 'Bạn đo chu vi ngón tay theo hướng dẫn trong Cẩm nang rồi đối chiếu bảng size ở trang chi tiết sản phẩm. Cách đo tại nhà có sai số, nên nếu chưa chắc bạn hãy gọi hotline để được tư vấn trước khi đặt hàng.'
    },
    {
      q: 'Tôi có thể đặt hàng mà không cần tạo tài khoản không?',
      a: 'Được. Website không yêu cầu tạo tài khoản để mua hàng.'
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
