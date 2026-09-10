# Kiểm tra bản hoàn thiện

- `npm run build`: thành công.
- Kiểm tra trực tiếp bằng trình duyệt ở 320, 390, 768 và 1440 px: không có tràn ngang trang.
- Đã xem hero, giới thiệu, danh mục món, đồ uống và liên hệ; kiểm tra giao diện sáng/tối.
- Menu mobile mở và đóng khi chọn liên kết.
- Chuyển Đức/Anh cập nhật nội dung, tên trang, thuộc tính ngôn ngữ và nội dung email.
- Các tab món ăn cập nhật danh sách, giá và ảnh. Có hỗ trợ phím mũi tên, Home, End.
- Tìm `Phở Hà Nội` trả đúng nhóm món và ba mức giá; tìm chuỗi không có kết quả hiển thị thông báo.
- Hộp thoại đặt bàn hiển thị số gọi và liên kết email; không gửi tin thử hoặc gọi số thật.
- Tải DOCX qua HTTP thành công, 82.468 byte, khớp file nguồn.
- Không có lỗi console trong bản build được kiểm tra. Ảnh đã tải đầy đủ khi kiểm tra cuối trang.
- Lighthouse mobile trên bản production tại localhost: Performance 81, Accessibility 100, Best Practices 100, SEO 100; LCP mô phỏng 4,4 giây, CLS 0,001. Đây là số đo cục bộ, không phải kết quả trên hosting thật. Báo cáo: `lighthouse-final.json`.
- Lighthouse có lỗi dọn thư mục profile tạm trên Windows sau khi ghi báo cáo; báo cáo audit đã tạo thành công.

Ảnh AI chỉ dùng minh họa theo brief chờ ảnh thực tế. Website chưa được xuất bản lên Internet. Chưa có backend đặt bàn; sử dụng gọi điện và soạn email với thông báo cần nhà hàng xác nhận.
