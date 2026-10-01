# Tình trạng dự án — Website Bạc Hải Yến

Cập nhật lần cuối: **01/10/2026**

---

## TRẠNG THÁI HIỆN TẠI

> ### 🟡 BẢN XEM TRƯỚC
>
> Website có giao diện đầy đủ và chạy được, nhưng **chưa nhận đơn hàng thật**.
>
> Lý do: chưa có máy chủ lưu đơn, chưa có giá cho hai trong ba sản phẩm, chưa có
> địa chỉ cửa hàng, chưa chọn phương thức nhận tiền, chưa có biểu phí giao hàng và
> chính sách đổi trả.
>
> Đây **không phải** bản đã sẵn sàng bán hàng. Đừng công khai địa chỉ website cho
> khách cho tới khi hoàn thành danh sách ở mục *Việc cần làm để nhận đơn thật*.

---

## ĐÃ XONG

### Bộ nhận diện thương hiệu

Từ đúng một file logo gốc (nền đen, mark chữ Y + wordmark BACHAIYEN.VN), đã tách ra
bảy tệp dùng cho các ngữ cảnh khác nhau:

| Tệp | Dùng ở đâu | Đặc điểm |
|---|---|---|
| `assets/logo/logo-lockup-on-light.png` | Header | Mark + chữ, màu `#1A1A1A`, nền trong suốt |
| `assets/logo/logo-lockup-on-dark.png` | Footer | Mark + chữ, màu trắng, nền trong suốt |
| `assets/logo/logo-mark-on-light.png` | Khi cần chỉ mark trên nền sáng | 338 × 415 px |
| `assets/logo/logo-mark-on-dark.png` | Ảnh chia sẻ, favicon lớn | 338 × 415 px |
| `assets/logo/favicon-32.png` | Favicon trình duyệt | 32 × 32 |
| `assets/logo/favicon-48.png` | Favicon màn hình lớn | 48 × 48 |
| `assets/logo/favicon-180.png` | Biểu tượng khi lưu lên iPhone | 180 × 180 |

Cách làm: ảnh gốc là hình bạc vẽ trên nền đen, nên **độ sáng của từng điểm ảnh
chính là độ đục**. Giữ nguyên độ sáng đó làm kênh alpha rồi đổi màu điểm ảnh, ta được
bản nền trong suốt giữ nguyên toàn bộ khối bạc và chi tiết kim loại — không phải vẽ lại
hay đè một lớp phẳng lên.

Script tạo lại bộ này nằm ở `tools/make-logo-assets.ps1`. Chạy lại khi có logo mới
cùng kích thước.

> **Còn thiếu:** file `favicon.ico` đa kích thước. Hiện đang dùng PNG, hầu hết trình
> duyệt hiện đại đều chấp nhận. Nếu cần `.ico`, phải dùng công cụ chuyển đổi riêng.

### Hệ thống thiết kế

`css/tokens.css` và `css/main.css` — khoảng 1.500 dòng, không dùng thư viện ngoài.

Bảng màu **trắng — đen — ánh bạc**, lấy trực tiếp từ logo:

| Vai trò | Mã màu | Ghi chú |
|---|---|---|
| Nền chính | `#FAF9F7` | Trắng ngà ấm, đỡ chói hơn trắng tuyệt đối |
| Nền thẻ | `#FFFFFF` | |
| Chữ chính | `#1A1A1A` | Gần đen, khớp màu chữ trong logo |
| Chữ phụ | `#6A6A6A` | |
| Đường viền | `#DEDAD4` | |
| Màu nhấn | `#9A7B4F` | Vàng đồng ấm, dùng tiết chế cho nút chính |

Không dùng bạc nhạt làm màu chữ hay nút hành động, vì không đủ tương phản.
Ánh bạc chỉ là màu của sản phẩm và chi tiết trang trí.

Đã có sẵn: thang khoảng cách 8px, thang cỡ chữ co giãn bằng `clamp()`, bo góc 6–10px,
 đổ bóng rất nhẹ, hỗ trợ `prefers-reduced-motion` và `prefers-contrast`.

### Các trang đã dựng

| Trang | Tệp | Ghi chú |
|---|---|---|
| Trang chủ | `index.html` | Đủ 12 khối theo master prompt phần D |
| Danh mục | `catalog.html` | Lọc, sắp xếp, phân trang, giữ trạng thái trong URL |
| Chi tiết sản phẩm | `product.html` | Thư viện ảnh, chọn size, phóng to, thanh mua mobile |
| Tìm kiếm | `search.html` | Tìm không dấu, tìm theo cả mã hàng |
| Yêu thích | `wishlist.html` | Lưu trên máy khách |
| Quà tặng | `gift.html` | Ba bước: người nhận → ngân sách → phong cách |
| Giỏ hàng | `cart.html` | Drawer và trang riêng |
| Đặt hàng | `checkout.html` | Chưa nhận đơn, có giải thích lý do |
| Cửa hàng | `stores.html`, `store.html` | Ba chi nhánh, xử lý được trường hợp thiếu địa chỉ |
| Cẩm nang | `guides.html`, `guide.html` | Ba bài đã viết đầy đủ |
| Giới thiệu | `about.html` | Chờ nội dung từ chủ cửa hàng |
| Liên hệ | `contact.html` | Biểu mẫu mở ứng dụng email, không cần máy chủ |
| FAQ | `faq.html` | |
| Chính sách | `policy.html` | Tự ẩn khi chưa có nội dung |
| Chăm sóc bạc | `care.html` | |
| Hướng dẫn đo size | `size-guide.html` | Chờ bảng size thật |
| 404 | `404.html` | Có thử cứu khách bằng mã hàng trên URL |

### Catalogue sản phẩm

`data/catalog.json` — chứa **3 sản phẩm** theo đúng dữ liệu bạn cung cấp:

| Mã hàng | Tên | Giá |
|---|---|---|
| BHY-N001 | Nhẫn bạc 925 nữ đá xanh | Chưa có — cần điền |
| BHY-K002 | Khuyên nụ bạc 925 xi vàng trắng | Chưa có — cần điền |
| BHY-K003 | Khuyên tai bạc 925 kết hợp ngọc trai | 680.000₫ |

Hai sản phẩm đầu để `price: null` vì bạn chưa cho giá. Website hiện dòng
"Liên hệ cửa hàng để biết giá", tắt nút thêm vào giỏ và **không** tính chúng vào
các khoảng giá ở trang chủ và trang quà tặng. Đây là cách đúng: nếu bịa một mức giá,
khách gọi tới sẽ thấy khác và mất tin.

### Xử lý khi thiếu dữ liệu

Đây là phần quan trọng nhất và đã làm xuyên suốt:

- **Ảnh chưa có** → hiện khung chờ có ghi rõ đường dẫn cần đặt file. Không hiện
  biểu tượng ảnh vỡ, cũng không dùng ảnh AI giả làm ảnh thật của sản phẩm.
- **Chưa có giá** → nút mua chuyển sang hướng dẫn gọi điện, kèm lý do.
- **Chưa có size nhẫn** → nói thẳng là cửa hàng chưa đăng bảng size, hướng khách
  gọi hotline. Không dùng bảng quy đổi chung trên mạng.
- **Chưa có địa chỉ cửa hàng** → ghi "Đang cập nhật địa chỉ", không bịa.
- **Chưa có chính sách** → mục đó tự ẩn trên footer, không hiện chỗ trống.
- **Chưa bật thanh toán** → trang giỏ hàng và đặt hàng nói rõ website chưa nhận đơn.

### Cách thêm sản phẩm cho bạn

Đã có `data/README-catalog.md` — hướng dẫn tiếng Việt từng bước, giải thích ý nghĩa
mọi trường, cách ghi giá, cách gắn size, và cách tự kiểm tra file.

Quy trình: bỏ ảnh vào `assets/products/` → mở `data/catalog.json`, nhân bản một khối
có sẵn, sửa nội dung → lưu → tải lại trang.

---

## ĐANG LÀM

Không có việc nào đang dang dở. Giai đoạn dựng giao diện đã xong.

---

## VIỆC CẦN LÀM ĐỂ NHẬN ĐƠN THẬT

Xếp theo thứ tự cần làm trước sau.

### 1. Dữ liệu chỉ chủ cửa hàng cung cấp được

- [ ] **Giá của BHY-N001 và BHY-K002.** Hai sản phẩm này đang không bán được vì chưa có giá.
- [ ] **Địa chỉ thật của ba cửa hàng** — số nhà, đường, phường, tỉnh. Ghi theo đơn vị hành chính đang áp dụng.
- [ ] **Giờ mở cửa từng cửa hàng.**
- [ ] **Số điện thoại riêng từng cửa hàng** (nếu khác hotline chung).
- [ ] **Link Google Maps** của từng cửa hàng.
- [ ] **Bảng size nhẫn thật** — thang size theo xưởng của cửa hàng. Đây là điều kiện bắt buộc để bán được nhẫn trực tuyến.
- [ ] **Link Zalo và Facebook** — hiện để trống nên hai mục này ẩn trên toàn website.
- [ ] **Link shop Shopee** — hiện để trống.
- [ ] **Câu chuyện thương hiệu** cho trang Giới thiệu. Website cố ý không tự viết phần này.
- [ ] **Mã số thuế và địa chỉ đăng ký kinh doanh** — nếu muốn công bố trên footer.

### 2. Quyết định vận hành

- [ ] **Chọn phương thức nhận tiền**: COD, chuyển khoản, hay cả hai. Nếu chuyển khoản thì cần số tài khoản, tên chủ tài khoản, chi nhánh.
- [ ] **Chọn đơn vị vận chuyển** và biểu phí giao theo khu vực.
- [ ] **Chính sách đổi trả và bảo hành.** Phải do chủ cửa hàng quyết, website không tự đặt.
- [ ] **Quy trình cập nhật tồn kho.** Hiện chưa có, nên mọi sản phẩm đang để trạng thái "liên hệ để kiểm tra còn hàng".
- [ ] **Xác nhận thủ tục thương mại điện tử** cần thiết tại thời điểm ra mắt, từ nguồn chính thức.

### 3. Phần kỹ thuật chưa làm

Đây là những phần cần lập trình thêm, **không thể bỏ qua nếu muốn bán hàng thật**:

- [ ] **Máy chủ lưu đơn hàng.** Hiện đơn chỉ nằm trong trình duyệt của khách. Nếu khách tắt máy, đơn biến mất và cửa hàng không biết gì. Cần cơ sở dữ liệu với các bảng: Đơn hàng, Dòng đơn, Sản phẩm, Biến thể, Tồn kho, Thanh toán, Vận chuyển, Nhân viên, Nhật ký.
- [ ] **Kiểm tra lại giá và tồn kho ở máy chủ** trước khi chốt đơn. Không tin dữ liệu từ trình duyệt gửi lên.
- [ ] **Chống đặt trùng** bằng khóa idempotency — khách bấm hai lần hoặc mạng chập chờn không tạo ra hai đơn.
- [ ] **Giữ chỗ tồn kho theo giao dịch** để hai khách không mua được cùng món cuối.
- [ ] **Trang quản trị có đăng nhập và phân quyền** cho một nhân sự media: thêm sửa sản phẩm, tải ảnh, sửa banner mà không cần sửa mã.
- [ ] **Tra cứu đơn cho khách** bằng liên kết token khó đoán. Không cho tra cứu chỉ bằng số điện thoại.
- [ ] **Render trang sản phẩm ở phía máy chủ** để máy tìm kiếm đọc được. Hiện nội dung dựng bằng JavaScript nên Google đọc chậm hơn.
- [ ] **Sao lưu và hướng dẫn phục hồi** đã thử trong môi trường riêng.

---

## QUYẾT ĐỊNH KỸ THUẬT ĐÃ CHỌN

**Kiến trúc: HTML, CSS và JavaScript thuần, không cần bước build.**

Lý do: dự án chưa có hạ tầng, ngân sách chưa rõ, và nhân sự vận hành là một người
media không chuyên kỹ thuật. Dựng theo hướng này thì mở file `index.html` là chạy
được ngay, không cần cài Node, không cần `npm install`, và khi bàn giao thì người
sau mở file ra là hiểu.

Đánh đổi đã biết:

- Nội dung dựng bằng JavaScript nên SEO yếu hơn so với render phía máy chủ. Sẽ khắc phục khi làm backend.
- Header và footer được chèn bằng JavaScript để mọi trang dùng chung một nguồn. Nếu JavaScript lỗi, header không hiện — nhưng nội dung chính vẫn hiện đầy đủ.
- Khi số lượng sản phẩm lớn (khoảng trên 300 món), cần chuyển sang render phía máy chủ.

**Khi làm backend:** đề xuất Next.js + TypeScript + PostgreSQL + lưu ảnh trên
dịch vụ lưu trữ đối tượng. Đây là đề xuất, chưa phải quyết định cuối — cần xác nhận
hạ tầng và ngân sách trước.

**Không dùng:** microservices, Redis, Elasticsearch, Kubernetes. Với quy mô ba cửa
hàng và vài trăm sản phẩm, những thứ này chỉ làm hệ thống khó vận hành hơn mà không
giải quyết vấn đề nào có thật.

---

## CÁCH CHẠY THỬ

### Cách 1 — đơn giản nhất

Nhấp đúp vào `index.html`.

Hạn chế: trình duyệt chặn đọc file `data/catalog.json` khi mở bằng đường dẫn file,
nên danh sách sản phẩm sẽ không hiện. Dùng cách 2 nếu muốn xem đầy đủ.

### Cách 2 — có máy chủ tĩnh, xem được đầy đủ

Mở PowerShell tại thư mục dự án và chạy:

```powershell
python -m http.server 8000
```

Hoặc nếu có Node.js:

```powershell
npx serve -l 8000
```

Rồi mở `http://localhost:8000`.

---

## CÒN PHẢI KIỂM CHỨNG

Những điều **chưa** được kiểm tra. Không nên coi là đã đạt:

- [ ] **Chưa chạy trên trình duyệt thật.** Toàn bộ giao diện được viết và kiểm tra
      bằng cách đọc mã, chưa mở trên Chrome hay Safari để xem tận mắt.
- [ ] **Chưa đo hiệu năng.** Mục tiêu LCP ≤ 2,5 giây, INP ≤ 200ms, CLS ≤ 0,1 chưa
      được đo. Kết quả sẽ phụ thuộc chủ yếu vào ảnh thật, hiện chưa có ảnh nào.
- [ ] **Chưa kiểm tra trợ năng bằng công cụ.** Chưa chạy axe hay WAVE. Đã làm theo
      quy tắc thiết kế (vùng chạm 44px, tiêu điểm bàn phím rõ, lỗi biểu mẫu không
      chỉ dùng màu) nhưng chưa xác minh bằng công cụ.
- [ ] **Chưa thử trên điện thoại thật.** Đã viết theo các mốc 360, 390, 768, 1024
      và 1440px, chưa xem trên thiết bị.
- [ ] **Chưa có ảnh sản phẩm.** Mọi khung ảnh đang hiện trạng thái giữ chỗ.
- [ ] **Chưa kiểm thử giao dịch.** Không thể kiểm thử đặt hàng, giữ chỗ tồn kho hay
      chống đặt trùng vì backend chưa tồn tại.

---

## MỘT SỐ ĐIỀU CỐ Ý KHÔNG LÀM

Ghi lại để sau này không ai vô tình thêm vào:

- **Không dựng khối đánh giá khách hàng có số sao.** Chưa có đánh giá thật và chưa
  có văn bản đồng ý sử dụng hình ảnh của khách hàng.
- **Không tự viết câu chuyện thương hiệu, số năm kinh nghiệm hay chứng nhận.**
  Trang Giới thiệu đang chờ nội dung từ chủ cửa hàng.
- **Không đặt huy hiệu "đã thông báo Bộ Công Thương"** khi thủ tục chưa hoàn tất.
- **Không dùng nhãn "Bán chạy"** vì chưa có dữ liệu bán hàng. Đang dùng
  "Gợi ý từ cửa hàng" cho đúng sự thật.
- **Không tạo ảnh AI rồi trình bày như ảnh chụp thật của sản phẩm.**
- **Không nhân bản một ảnh thành nhiều ảnh** để lấp đầy thư viện ảnh.
- **Không bật nút "Mua ngay"** khi chưa có backend xử lý được đơn.
- **Không dùng cửa sổ bật lên xin email** ngay khi khách vừa vào trang.

---

## GHI CHÚ CHO NGƯỜI TIẾP NHẬN

Nếu bạn là người tiếp tục dự án này, đọc theo thứ tự:

1. `data/config.js` — toàn bộ dữ liệu thương hiệu, cửa hàng, chính sách nằm ở đây
2. `data/catalog.json` — sản phẩm, danh mục, bộ sưu tập
3. `data/README-catalog.md` — hướng dẫn thêm sản phẩm bằng tiếng Việt
4. `Master_Prompt_Website_Bac_Trang_Suc.txt` — yêu cầu gốc của chủ cửa hàng
5. `Khao_Sat_Y_Tuong_Website_Trang_Suc.md` — khảo sát định hướng ban đầu

Cấu trúc mã: `css/tokens.css` (biến thiết kế) → `css/main.css` (giao diện) →
`js/core.js` (thư viện dùng chung, chạy mọi trang) → các file `js/` còn lại theo trang.

Mọi hàm dùng chung đều nằm trong đối tượng `window.BHY`. Xem cuối `js/core.js`
để biết danh sách đầy đủ.
