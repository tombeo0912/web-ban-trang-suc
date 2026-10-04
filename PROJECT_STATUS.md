# Tình trạng website Bạc Hải Yến

Cập nhật: 04/10/2026.

## Hướng vận hành

Website là **catalogue**. Khách xem sản phẩm, lưu món quan tâm trên trình duyệt, rồi gửi danh sách qua Zalo, email hoặc gọi hotline. Website không nhận thanh toán và không tự tạo đơn hàng.

## Dữ liệu đã có

- Ba sản phẩm trong `data/catalog.json` đều có giá tham khảo **500.000đ**. Khi có giá chính thức, chủ cửa hàng sửa trường `price` của từng món.
- Ảnh sản phẩm có trong `assets/products/`: nhẫn 3 ảnh, khuyên nụ 3 ảnh, khuyên tai ngọc trai 2 ảnh.
- Hai chi nhánh trong `data/config.js`: Thái Bình và Hải Phòng, cùng mở **08:00–20:00 hằng ngày**. Mỗi chi nhánh có link Google Maps; địa chỉ dạng chữ chưa được cung cấp.
- Hotline: `0982338388`, `0904868881`; email: `bachaiyenhn@gmail.com`. Link Zalo chưa được xác nhận.
- Mẫu tư vấn size nhận chu vi ngón tay hoặc đường kính trong của nhẫn đang đeo, quy đổi cm sang mm và tạo lời nhắn cho khách tự gửi. Size bán hàng chỉ được xác nhận sau khi cửa hàng đối chiếu sản phẩm thực tế.
- `favicon.ico` và các PNG biểu tượng được tạo từ logo có sẵn bằng `tools/make-favicon.ps1`.

## Dữ liệu còn cần chủ cửa hàng cung cấp

- Link Zalo, Fanpage Facebook, Instagram và Shopee chính thức; các kênh chưa có link sẽ tự ẩn.
- Địa chỉ dạng chữ của hai chi nhánh nếu muốn hiển thị thêm ngoài Google Maps.
- Chính sách đổi trả, bảo hành và giao hàng. Website hiện không tự công bố chính sách chưa được xác nhận.
- Thang size thực tế theo từng mẫu nhẫn nếu muốn hiện bảng size; hiện dùng mẫu nhắn tin để tư vấn cá nhân.
- Câu chuyện thương hiệu, tên miền chính thức và thông tin đăng ký kinh doanh nếu muốn công bố. Các phần chưa được xác nhận không hiển thị cho khách.

## Chỉnh dữ liệu và xem thử

- Sản phẩm, giá, ảnh: `data/catalog.json` và `assets/products/`.
- Hotline, kênh liên hệ, chi nhánh, chính sách: `data/config.js`.
- Hướng dẫn chi tiết: `data/README-catalog.md`.
- Chạy tại thư mục dự án: `python -m http.server 8000`, rồi mở `http://localhost:8000/`. Cần dùng HTTP để trình duyệt đọc được `data/catalog.json`.

Đã kiểm tra giao diện trang chủ, sản phẩm, size, cửa hàng và liên hệ bằng Chrome headless trên máy này; mẫu tư vấn size và danh sách chọn món đã qua thử nghiệm tương tác. Việc xác nhận ảnh, giá và nội dung kinh doanh cuối cùng vẫn thuộc chủ cửa hàng.
