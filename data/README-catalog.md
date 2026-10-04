# Cách tự sửa dữ liệu website Bạc Hải Yến

Website là catalogue: khách xem món, lưu danh sách và liên hệ cửa hàng. Mọi thay đổi dưới đây chỉ cần lưu file rồi tải lại trang; không cần trang quản trị.

| Muốn sửa | Mở file |
|---|---|
| Tên, mô tả, giá, ảnh, danh mục sản phẩm | `data/catalog.json` |
| Hotline, Zalo, Facebook, Instagram, Shopee, chi nhánh, giờ mở cửa, chính sách | `data/config.js` |
| Ảnh sản phẩm | `assets/products/` |

## Sửa giá một món

Trong `data/catalog.json`, tìm sản phẩm theo `sku` hoặc `name`, rồi sửa dòng:

```json
"price": 500000,
"priceIsPlaceholder": true
```

Giá ghi bằng **số nguyên đồng**, không gõ dấu chấm hoặc chữ `đ`. Khi đã chốt giá chính thức, đổi `priceIsPlaceholder` thành `false` để bỏ dòng “Giá tham khảo” trên trang chi tiết. Giá tham khảo trên trang danh sách chọn món vẫn là tổng ước tính; cửa hàng cần xác nhận khi khách liên hệ.

Nếu chưa biết giá, đặt `price` thành `null` và điền `priceNote`. Món đó vẫn xem được, nhưng khách cần hỏi giá qua kênh liên hệ.

## Thay và thêm ảnh

Chép ảnh thật vào `assets/products/`, rồi sửa mảng `images` của món tương ứng. Ảnh đầu tiên là ảnh chính. `hoverImage` là ảnh hiện khi rê chuột trên máy tính; đặt trùng một đường dẫn có thật trong `images`.

```json
"images": [
  "assets/products/nhan-bac-925-nu-da-xanh-1.jpg",
  "assets/products/nhan-bac-925-nu-da-xanh-2.jpg"
],
"hoverImage": "assets/products/nhan-bac-925-nu-da-xanh-2.jpg"
```

Nên dùng ảnh sáng, chụp rõ món, gần tỷ lệ 4:5. Chỉ ghi đường dẫn tới file thực sự có trong thư mục; đường dẫn sai sẽ tạo khung ảnh trống.

## Thêm sản phẩm

Nhân bản một khối trong mảng `products`, rồi sửa ít nhất `id`, `sku`, `slug`, `name`, `categoryId`, `price`, `images`, `hoverImage`, `requiresSize`. Ba mã `id`, `sku`, `slug` phải khác các món đã có. `categoryId` phải khớp một mục trong `categories`. Đặt `published: false` nếu chưa muốn hiện món đó.

Với nhẫn, đặt `requiresSize: true`. Khi `sizeOptions` còn rỗng, trang sản phẩm hiện mẫu cho khách gửi chu vi ngón tay hoặc đường kính trong của chiếc nhẫn đang đeo vừa. Danh sách chọn món vẫn lưu được nhẫn để khách hỏi cửa hàng; việc lưu này không phải đặt hàng.

Chỉ điền `sizeOptions` và `sizeGuides.rows` khi đã xác nhận thang size thực tế của món nhẫn. Không cần tự lấy bảng size chung để gán cỡ cho khách. Có thể để trống và tư vấn thủ công qua lời nhắn.

## Sửa cửa hàng và kênh liên hệ

Trong `data/config.js`, các trường `contacts.facebook`, `contacts.instagram`, `contacts.shopee` đang để `''`. Dán URL chính thức vào giữa hai dấu nháy để nút tương ứng hiện trong footer, trang Liên hệ và danh sách chọn món. Với từng chi nhánh trong `branches`, sửa `address`, `hours`, `mapUrl` khi có thông tin mới. Các trường `policies` chỉ điền nội dung đã được chủ cửa hàng duyệt.

Nếu đổi logo, chạy lại `tools/make-logo-assets.ps1`, sau đó chạy `tools/make-favicon.ps1` trong PowerShell để cập nhật biểu tượng trang.

## Kiểm tra sau khi sửa

Chạy `python -m json.tool data/catalog.json > NUL` trong Command Prompt, hoặc `python -m json.tool data/catalog.json | Out-Null` trong PowerShell. Nếu lệnh báo lỗi, file JSON đang thiếu hoặc thừa dấu phẩy hay dấu nháy. Sau đó chạy `python -m http.server 8000` và mở `http://localhost:8000/` để kiểm tra hình ảnh, giá, trang chi tiết và link liên hệ.
