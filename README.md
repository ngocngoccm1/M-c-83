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
- `menu.html`: trang thực đơn đầy đủ, tìm kiếm và lọc danh mục.
- `scripts/check-mobile.cjs`: kiểm tra giao diện và thao tác ở 6 kích thước màn hình bằng Playwright.
- `src/style.css`: màu sắc và responsive.
- `public/assets/logo.jpg`: logo được cung cấp.
- `public/assets/sushi.webp`, `drinks.webp`: ảnh AI minh họa.
- `public/assets/pho.webp`, `vorspeisen.jpg` và `sushi-gallery-*.webp`: ảnh được cung cấp. Các bản AVIF/WebP nhỏ được dùng theo kích thước màn hình.
- `public/assets/Moc83-Speisekarte.docx`: thực đơn gốc để tải xuống.

## Đặt bàn

Nút đặt bàn mở lựa chọn gọi `03946 4159682` hoặc soạn email đến `legiahan0102@gmail.com`. Email được mở trong ứng dụng thư của khách; website không tự gửi email và không tự xác nhận đặt bàn. Liên kết chỉ đường mở Google Maps, Facebook mở đúng trang được cung cấp.

Giờ mở cửa: thứ 2–thứ 6 từ 11:00–15:00 và 17:00–22:00; thứ 7 và Chủ nhật mở liên tục từ 11:00–22:00. Lịch này được hiển thị đồng bộ ở thanh thông tin, phần liên hệ và hộp thoại đặt bàn, bằng tiếng Đức và tiếng Anh.

Website xuất bản trên [GitHub Pages](https://ngocngoccm1.github.io/M-c-83/). Thông tin pháp nhân cho Impressum/Datenschutz chưa được cung cấp nên không tạo nội dung pháp lý giả.

## Kiểm tra mobile

Thanh liên hệ cố định gồm Anrufen, Route và Tisch reservieren trên cả trang chủ và thực đơn. Các liên kết gọi điện và Google Maps dùng URL trực tiếp; đặt bàn mở lựa chọn gọi điện hoặc email.

Ảnh có nhiều kích thước, dùng WebP (ảnh đầu trang có thêm AVIF), các ảnh dưới màn hình đầu tải khi cần. Font có Unicode range riêng cho ký tự Latin và tiếng Việt. Phần gallery, đồ uống và liên hệ dùng content-visibility; mobile bỏ hiệu ứng ẩn nội dung khi cuộn.

Sau build, chạy `node scripts/check-mobile.cjs` với Playwright đã cài và website đang được phục vụ ở `http://127.0.0.1:4173/M-c-83/`. Có thể truyền URL khác làm tham số đầu tiên; đặt `PLAYWRIGHT_MODULE` và `CHROME_PATH` nếu runtime nằm ngoài dự án. Ảnh kiểm tra lưu vào `notes/mobile-qa/` (không commit).
