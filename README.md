# Mộc 83 landing page

Website tiếng Đức và tiếng Anh cho nhà hàng Mộc 83, Steinweg 79, 06484 Quedlinburg.

## Chạy tại máy

```sh
npm install
npm run dev
```

Build tĩnh: `npm run build`. Xem build: `npm run preview`. Nội dung xuất bản nằm trong `dist/`. Build cũng cập nhật `index.html` và `assets/` ở gốc để GitHub Pages host trực tiếp nhánh `main`. `index.html` chứa HTML sẵn, hiển thị nội dung ngay; JavaScript trên trang xuất bản chỉ bổ sung tương tác (không tải React).

## Nội dung và thiết kế

- Nguồn yêu cầu: `Tài liệu không có tiêu đề.docx`.
- Món, khẩu phần và giá: `Menu-new.docx`. 31 nhóm thực đơn; bản gốc có thể tải từ website.
- Dùng logo gốc được cung cấp. Tông nâu đen và vàng ấm theo [Tobisu](https://www.tobisu-restaurant.de/).
- Tham khảo cách giới thiệu ẩm thực và bố trí liên hệ của [HanVi](https://www.hanvi.de/) và [Van Long](https://www.van-long.de/). Không sử dụng nội dung, đánh giá hay hình ảnh của các nhà hàng này.
- Font được lưu cùng website, không gọi Google Fonts. Có bộ ký tự tiếng Việt.
- Mặc định giao diện tối theo brief; nút đổi giao diện sáng ở chân trang.

## Chỉnh sửa

- `src/data.js`: nội dung Đức/Anh và các món nổi bật.
- `src/menu.json`: thực đơn đầy đủ theo tài liệu gốc. Giữ thông tin thành phần và ký hiệu dị ứng từ nguồn.
- `src/main.jsx`: mẫu HTML cho các phần trang và hộp thoại đặt bàn.
- `src/client.js`: tương tác nhẹ trên trang tĩnh; bản tiếng Anh và các danh mục món tải khi khách cần.
- `src/menu-template.html`, `src/menu-client.js`, `src/pages.css`: mẫu trang thực đơn, tìm kiếm, lọc danh mục và đổi ngôn ngữ. `menu.html` là kết quả build, có sẵn 30 nhóm món/đồ uống và bảng 14 nhóm dị ứng ngay trong HTML.
- `scripts/page-content.mjs`: metadata, schema Restaurant, bảng chú giải dị ứng và nội dung pháp lý.
- `src/legal-data.json`: thông tin pháp nhân. Chỉ điền dữ liệu có xác nhận; bật `operatorDetailsConfirmed` sau khi xác nhận đầy đủ để bỏ thông báo thiếu dữ liệu/noindex ở hai trang pháp lý.
- `src/MapConsent.jsx`, `src/map-consent.js`: bản đồ chỉ tải sau khi khách đồng ý, có nút đóng và rút lại sự đồng ý.
- `scripts/check-mobile.cjs`: kiểm tra giao diện và thao tác ở 6 kích thước màn hình bằng Playwright.
- `src/style.css`: màu sắc và responsive.
- `public/assets/logo.jpg`: logo được cung cấp.
- `public/assets/sushi.webp`, `drinks.webp`: ảnh AI minh họa.
- `public/assets/pho.webp`, `vorspeisen.jpg` và `sushi-gallery-*.webp`: ảnh được cung cấp. Các bản AVIF/WebP nhỏ được dùng theo kích thước màn hình.
- `public/assets/Moc83-Speisekarte.docx`: thực đơn gốc để tải xuống.

## Đặt bàn

Nút đặt bàn mở lựa chọn gọi `03946 4159682` hoặc soạn email đến `legiahan0102@gmail.com`. Email được mở trong ứng dụng thư của khách; website không tự gửi email và không tự xác nhận đặt bàn. Liên kết chỉ đường mở Google Maps, Facebook mở đúng trang được cung cấp.

Giờ mở cửa liên tục: thứ 2–thứ 6 từ 11:00–21:00; thứ 7 và Chủ nhật từ 11:00–22:00. Lịch này được hiển thị đồng bộ ở màn hình đầu trên điện thoại, thanh thông tin, phần liên hệ, hộp thoại đặt bàn và schema Restaurant, bằng tiếng Đức và tiếng Anh.

Website được cấu hình cho [GitHub Pages](https://ngocngoccm1.github.io/M-c-83/). Build tạo `index.html`, `menu.html`, `impressum.html`, `datenschutz.html` và `assets/` ở gốc. Các URL ảnh/JS/font dùng đường dẫn tương đối. Canonical, OG URL và schema mặc định trỏ đến host GitHub Pages; có thể đặt `SITE_URL` khi thực sự đổi host, không thực hiện chuyển tên miền trong lần chỉnh này.

Hai trang Impressum/Datenschutz đã có mẫu dựa trên dữ liệu thực tế, nhưng **chưa hoàn thiện pháp lý** vì thiếu tên pháp lý và loại hình/người đại diện của bên vận hành, cùng thông tin đăng ký/VAT nếu áp dụng. Trạng thái thiếu dữ liệu được ghi rõ và các trang tạm thời có `noindex`. Email liên hệ hiện lấy từ brief; cần chủ nhà hàng xác nhận là địa chỉ liên hệ pháp lý.

Trang GitHub Pages không cài tracking và không tự đặt cookie. Google Maps không kết nối trước khi có sự đồng ý, không lưu lựa chọn vào trình duyệt. Bản đồ có thể dùng cookie của Google sau khi khách cho phép. Không dùng một banner cookie trang trí khi không có công cụ nào cần chặn.

**Lớp Webcake bên ngoài:** tên miền `moc83restaurant.com` hiện nhúng trang GitHub Pages trong iframe. Các thẻ SEO rỗng, popup “Thank you / Invalid Code” và script fingerprint của lớp này không thuộc mã nguồn trang con. Đã chuẩn bị các file tích hợp trong `deployment/`; xem `deployment/README.md`. Sửa trang con không tự sửa được metadata hay tracking của tài liệu ngoài.

Ký hiệu dị ứng được giữ theo menu cung cấp, không tự suy đoán công thức. Nhà hàng cần rà soát các món/biến thể và nước sốt trước khi xác nhận: ví dụ nguồn gốc ghi Udon Xào có F/K/N nhưng không ghi A1, và Sushi Menu 3 có cá nhưng chỉ ghi K. Bảng chú giải đủ 14 nhóm không thay thế việc xác nhận từng món.

## Kiểm tra mobile

Thanh liên hệ cố định gồm Anrufen, Route và Tisch reservieren trên cả trang chủ và thực đơn. Ảnh sushi thật và giờ mở cửa được đưa vào màn hình đầu trên điện thoại. Các liên kết gọi điện và Google Maps dùng URL trực tiếp; đặt bàn mở lựa chọn gọi điện hoặc email.

Ảnh có nhiều kích thước, dùng WebP (ảnh đầu trang có thêm AVIF), các ảnh dưới màn hình đầu tải khi cần. Ảnh hero lấy từ ảnh thật được cung cấp; bản AVIF 480px khoảng 15 KB và 640px khoảng 24 KB. Ảnh chia sẻ JPEG 1200×630 tương thích trình đọc OG. Tạo lại bằng `python scripts/prepare-social-image.py` với Pillow. Font có Unicode range riêng cho ký tự Latin và tiếng Việt. Phần gallery, đồ uống và liên hệ dùng content-visibility; mobile bỏ hiệu ứng ẩn nội dung khi cuộn.

Sau build, chạy `node scripts/check-mobile.cjs` với Playwright đã cài và website đang được phục vụ ở `http://127.0.0.1:4173/M-c-83/`. Có thể truyền URL khác làm tham số đầu tiên; đặt `PLAYWRIGHT_MODULE` và `CHROME_PATH` nếu runtime nằm ngoài dự án. Ảnh kiểm tra lưu vào `notes/mobile-qa/` (không commit).
