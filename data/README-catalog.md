# Hướng dẫn thêm sản phẩm

Tài liệu này dành cho người quản lý nội dung website Bạc Hải Yến.
Bạn không cần biết lập trình để làm theo các bước dưới đây.

---

## Hai thứ bạn sẽ làm việc cùng

| Việc | Ở đâu |
|---|---|
| Sản phẩm, danh mục, bộ sưu tập | `data/catalog.json` |
| Ảnh sản phẩm | thư mục `assets/products/` |
| Hotline, địa chỉ cửa hàng, chính sách | `data/config.js` |

Quy tắc chung: **file nào chứa dữ liệu thì sửa file đó, không sửa file HTML.**

---

## Cách thêm một sản phẩm

### 1. Bỏ ảnh vào thư mục

Đặt ảnh vào `assets/products/` và đặt tên theo mã hàng, có số thứ tự:

```
assets/products/nhan-bac-925-nu-da-xanh-1.jpg     ← ảnh chính
assets/products/nhan-bac-925-nu-da-xanh-2.jpg     ← ảnh phụ, hiện khi rê chuột
assets/products/nhan-bac-925-nu-da-xanh-3.jpg
```

Định dạng khuyến nghị: JPG, tỷ lệ **4:5** (ví dụ 1200×1500 px), dung lượng dưới 300 KB mỗi ảnh.

Ảnh nên chụp theo một cách thống nhất để cả website nhìn đồng bộ:

- Nền sáng trung tính
- Một ảnh toàn món
- Một ảnh cận chi tiết (khóa, mặt đá, hoa văn)
- Một ảnh đeo thật nếu có người mẫu

### 2. Mở `data/catalog.json`

File này là một danh sách. Bạn tìm mảng `"products"`, rồi **nhân bản một khối có sẵn** và sửa nội dung.

Một khối sản phẩm trông như thế này:

```json
{
  "id": "nhan-bac-925-nu-da-xanh",
  "sku": "BHY-N001",
  "slug": "nhan-bac-925-nu-da-xanh",
  "name": "Nhẫn bạc 925 nữ đá xanh",
  "shortDescription": "Câu mô tả ngắn, hiện dưới tên sản phẩm.",
  "description": [
    "Đoạn mô tả thứ nhất.",
    "Đoạn mô tả thứ hai."
  ],
  "published": true,
  "featured": true,
  "categoryId": "nhan",
  "collectionIds": ["noi-bat"],
  "price": 680000,
  "compareAtPrice": null,
  "priceNote": "",
  "material": "Bạc 925",
  "plating": "Không mạ",
  "stone": "Đá nhân tạo màu xanh",
  "weightGrams": null,
  "dimensions": "",
  "images": [
    "assets/products/nhan-bac-925-nu-da-xanh-1.jpg"
  ],
  "hoverImage": "assets/products/nhan-bac-925-nu-da-xanh-2.jpg",
  "requiresSize": true,
  "sizeOptions": [],
  "sizeGuideId": "nhan",
  "variants": [],
  "inStock": null,
  "stockNote": "Vui lòng liên hệ cửa hàng để kiểm tra còn hàng.",
  "tags": ["nữ", "đá xanh", "bạc 925"],
  "giftOccasions": ["sinh-nhat"],
  "giftRecipients": ["ban-gai", "vo"],
  "giftStyles": ["thanh-lich"],
  "shopeeUrl": "",
  "pairsWith": []
}
```

---

## Ý nghĩa từng trường

### Bắt buộc phải có

| Trường | Ghi gì | Lưu ý |
|---|---|---|
| `id` | Mã định danh duy nhất | Chữ thường, không dấu, dùng gạch nối. **Không đổi sau khi đã đăng** — giỏ hàng của khách đang giữ mã này. |
| `sku` | Mã hàng hiển thị cho khách | Ví dụ `BHY-N001`. Cũng phải duy nhất. |
| `slug` | Phần cuối đường dẫn web | Ví dụ `nhan-bac-925-nu-da-xanh` → `product.html?slug=nhan-bac-925-nu-da-xanh` |
| `name` | Tên sản phẩm | Viết tự nhiên, có dấu. Nên ghi chất liệu trong tên, ví dụ "Nhẫn bạc 925 nữ đá xanh". |
| `published` | `true` hoặc `false` | `false` thì sản phẩm không hiện ở đâu cả. Dùng khi cần ẩn tạm. |
| `categoryId` | Mã danh mục | Phải khớp một `id` trong mảng `categories`. |
| `images` | Danh sách đường dẫn ảnh | Để mảng rỗng `[]` nếu chưa có ảnh. |

### Về giá — quan trọng

```json
"price": 680000
```

Ghi **số nguyên đồng, không dấu chấm, không chữ "đ"**. `680000` đúng, `680.000đ` sai.

Chưa có giá thì ghi:

```json
"price": null,
"priceNote": "Liên hệ cửa hàng để biết giá"
```

Khi đó website sẽ hiện dòng "Liên hệ cửa hàng để biết giá", nút thêm vào giỏ tự chuyển
sang hướng dẫn gọi điện, và sản phẩm **không** bị tính vào các khoảng giá ở trang chủ
và trang quà tặng. Đây là cách đúng: không bịa một mức giá rồi khách gọi tới mới biết khác.

Giá khuyến mại:

```json
"price": 590000,
"compareAtPrice": 680000
```

Chỉ điền `compareAtPrice` khi **thực sự có giá gốc đang bán ở mức đó** và có quy tắc
khuyến mại đã được duyệt. Đây là quy định pháp luật về giá, không chỉ là chuyện giao diện.

### Về size nhẫn

```json
"requiresSize": true,
"sizeOptions": [],
"sizeGuideId": "nhan"
```

- `requiresSize: true` → website **bắt buộc** khách chọn size trước khi thêm vào giỏ. Không thể mua nhẫn mà bỏ qua bước này.
- `sizeOptions` → danh sách cỡ của riêng món này. Đang để rỗng vì chưa có thang size thật.
- `sizeGuideId` → trỏ tới bảng size trong mảng `sizeGuides`.

**Việc bạn cần làm:** điền `sizeOptions` theo thang size thực tế của xưởng, ví dụ:

```json
"sizeOptions": [
  { "label": "10", "inStock": true },
  { "label": "11", "inStock": true },
  { "label": "12", "inStock": false }
]
```

Và điền bảng size ở mảng `sizeGuides`:

```json
{
  "id": "nhan",
  "title": "Bảng size nhẫn",
  "note": "Bảng size theo thang của xưởng Bạc Hải Yến, đo theo chu vi ngón tay.",
  "headers": ["Cỡ", "Chu vi ngón tay (mm)", "Đường kính trong (mm)"],
  "rows": [
    ["10", "49,6", "15,8"],
    ["11", "50,9", "16,2"]
  ],
  "needsStoreData": false
}
```

Đừng suy ra bảng này từ một bảng quy đổi chung trên mạng. Mỗi xưởng dùng một thang
khác nhau, nên chép bảng chung sẽ khiến khách chọn sai cỡ.

### Về tồn kho

```json
"inStock": null
```

- `null` → chưa có dữ liệu tồn. Website ghi "Vui lòng liên hệ cửa hàng để kiểm tra còn hàng". Lọc "còn hàng" không loại sản phẩm này ra.
- `true` → còn hàng, hiện dấu ✓ xanh.
- `false` → hết hàng, hiện thông báo riêng.

Hiện tại nên **để `null`** cho tất cả, vì chưa có quy trình cập nhật tồn kho. Ghi `true`
khi chưa kiểm tra sẽ khiến khách đặt món không có hàng.

### Về thẻ phân loại

Ba trường này dùng cho trang **Quà tặng**. Chỉ gắn tag nào thật đúng với sản phẩm,
vì tag sai sẽ khiến khách nhận gợi ý không phù hợp.

```json
"giftRecipients": ["ban-gai", "vo", "chi-em"]
```

Giá trị hợp lệ:

- `giftRecipients`: `ban-gai`, `vo`, `me`, `chi-em`, `ban-than`, `dong-nghiep`, `chinh-minh`
- `giftOccasions`: `sinh-nhat`, `ky-niem`, `cam-on`, `valentine`, `ngay-le`
- `giftStyles`: `toi-gian`, `thanh-lich`, `noi-bat`, `nu-tinh`

Danh mục và bộ lọc trên website được dựng **từ dữ liệu thật** trong file này.
Nếu bạn thêm một tag mới chưa có trong danh sách trên, nó sẽ không hiện ra.
Hãy báo lại để bổ sung nhãn hiển thị.

### Về phối cùng

```json
"pairsWith": ["khuyen-tai-bac-925-ngoc-trai"]
```

Ghi `id` của những món hay được đeo cùng. Khối "Phối cùng" ở trang chủ và trang
chi tiết sản phẩm sẽ dùng danh sách này để gợi ý.

---

## Thêm một danh mục mới

Tìm mảng `"categories"` và thêm:

```json
{ "id": "lac-chan", "name": "Lắc chân", "image": "assets/img/cat-lac-chan.jpg", "order": 7 }
```

- `id`: chữ thường, không dấu, dùng gạch nối
- `order`: số nhỏ hiện trước
- Danh mục chỉ hiện trên website khi **có ít nhất một sản phẩm** thuộc danh mục đó.

---

## Thêm một bộ sưu tập

```json
{
  "id": "tet-2027",
  "name": "Bộ sưu tập Tết",
  "description": "Vài dòng về phong cách của bộ sưu tập này.",
  "image": "assets/img/collection-tet-2027.jpg",
  "skus": []
}
```

Rồi gắn vào sản phẩm: `"collectionIds": ["tet-2027"]`.

Lưu ý: **đừng viết câu chuyện chế tác hay lịch sử bộ sưu tập nếu chưa có thật.**
Phần mô tả nên nói về phong cách và cảm hứng, không nên bịa quy trình sản xuất.

---

## Sửa hotline, địa chỉ, chính sách

Mở `data/config.js`. Các mục quan trọng:

**Địa chỉ cửa hàng** — hiện đang để trống có chủ ý:

```js
{ id: 'thai-binh', name: 'Thái Bình', label: 'Cửa hàng Thái Bình',
  address: '', phone: '', hours: '', mapUrl: '' }
```

Điền vào là website tự hiện. Chưa điền thì trang cửa hàng ghi
"Đang cập nhật địa chỉ" chứ không hiện địa chỉ giả.

> Khi ghi địa chỉ, dùng đơn vị hành chính đang áp dụng tại thời điểm điền.

**Phương thức nhận tiền:**

```js
payment: {
  cod: false,
  bankTransfer: false,
  onlineGateway: false
}
```

Hiện cả ba đang `false`, nên website chưa nhận đơn trực tuyến và nói rõ điều đó
với khách. Chỉ bật khi đã có quy trình thật để nhận và đối soát tiền.

**Chính sách:**

```js
policies: {
  returnPolicy: '',
  warrantyPolicy: '',
  ...
}
```

Mục nào để trống thì tự ẩn trên footer. Chỉ điền nội dung đã được chủ cửa hàng duyệt.

---

## Lưu ý kỹ thuật

**Giữ đúng dấu phẩy và dấu ngoặc.** JSON rất khắt khe. Nếu thiếu một dấu phẩy,
cả danh sách sản phẩm sẽ không đọc được và website hiện thông báo lỗi.

**Cách tự kiểm tra:** mở https://jsonlint.com, dán toàn bộ nội dung file vào, bấm
Validate. Nếu báo lỗi vàng đỏ, sửa theo chỉ dẫn của nó.

**Trang không hiện sản phẩm mới?** Kiểm tra ba điều:

1. `"published": true` chưa?
2. `categoryId` có khớp một danh mục trong mảng `categories` không?
3. Trình duyệt có đang dùng bản cũ trong bộ nhớ đệm không? Bấm `Ctrl + F5`.

**Ảnh không hiện?** Kiểm tra đường dẫn có đúng chữ hoa chữ thường và đúng thư mục
`assets/products/` không. Website sẽ hiện một khung chờ có ghi tên file cần tìm —
nhìn vào khung đó là biết phải đặt file gì, ở đâu.

---

## Định dạng ảnh nên dùng

| Loại ảnh | Tỷ lệ | Kích thước gợi ý | Đặt ở đâu |
|---|---|---|---|
| Ảnh sản phẩm | 4:5 | 1200 × 1500 px | `assets/products/` |
| Ảnh danh mục | 3:4 | 900 × 1200 px | `assets/img/` |
| Ảnh hero | ngang, có bản mobile riêng | 2400 × 1350 px | `assets/img/hero-lifestyle.jpg` |
| Ảnh cửa hàng | 3:2 | 1200 × 800 px | `assets/img/branch-*.jpg` |
| Ảnh bài cẩm nang | 3:2 | 1200 × 800 px | `assets/img/guide-*.jpg` |
| Ảnh bộ phối | 4:5 | 1200 × 1500 px | `assets/img/pairing-lifestyle.jpg` |

Nén ảnh trước khi đưa lên (dùng tinypng.com hoặc Squoosh). Ảnh nặng là nguyên nhân
số một khiến website chậm trên điện thoại.

Quy chuẩn chụp ảnh để cả website đồng bộ: **nền sáng trung tính, một hướng sáng,
một khoảng cách máy** cho tất cả sản phẩm. Chụp tốt nhóm sản phẩm chủ lực trước,
không cần chụp hết mọi món trong một lần.
