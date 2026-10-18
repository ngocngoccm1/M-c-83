# Áp dụng cho lớp Webcake của moc83restaurant.com

Website đang có hai lớp: tên miền mở trang Webcake, bên trong nhúng iframe GitHub Pages. Các file trong thư mục này **chưa được áp dụng lên tên miền**. Yêu cầu bỏ qua mục 1 được giữ nguyên: cả hai cách dưới đều tiếp tục dùng iframe GitHub Pages.

## Phương án A: thay mã HTML lớp ngoài

Dùng toàn bộ `moc83restaurant-wrapper.html` làm tài liệu HTML của tên miền, nếu bên quản lý hosting cho phép thay source. File giữ iframe hiện tại, thêm meta chia sẻ và ảnh sushi, đặt ngôn ngữ Đức, bỏ nội dung popup không dùng và không chứa script fingerprint/tracking của Webcake. Không dán toàn bộ file này vào bên trong iframe hoặc một khối HTML của trang: metadata phải nằm ở `<head>` của tài liệu ngoài.

## Phương án B: tiếp tục dùng trình dựng Webcake

1. Trong cài đặt SEO của trang ngoài, thay các trường title, description, OG title/description/image đang rỗng bằng nội dung trong `webcake-head.html`. Giữ mỗi loại thẻ đúng một bản. Đặt ngôn ngữ trang thành `de`.
2. Đưa phần `<style>` của file này vào custom head/CSS. Selector nhắm đúng các popup đang chứa “Thank you” và “Expired or Invalid Code!”, không đụng hộp thoại đặt bàn của trang con.
3. Xóa popup/form mặc định không dùng trong Webcake nếu có thể để cả mã HTML cũng sạch.
4. Kiểm tra và tắt fingerprint/marketing pixels ở Webcake nếu không dùng. Trang ngoài hiện có script `a.pancake.vn/js/fingerprint.js`, `page_view.gif` và các kết nối tới dịch vụ nền tảng. CSS ẩn popup hoặc banner bên trong iframe **không chặn được** các xử lý của trang ngoài. Nếu giữ công cụ cần sự đồng ý, phải cấu hình cơ chế đồng ý trên trang ngoài trước khi chúng chạy và cập nhật chính sách bảo mật theo cấu hình thực tế.

## Kiểm tra sau khi xuất bản

- Triển khai thay đổi GitHub Pages trước để URL ảnh `moc83-sushi-social.jpg` truy cập được.
- Xem **source của tên miền**, kiểm tra các thẻ OG không rỗng và không trùng; ảnh JPEG trả HTTP 200.
- Kiểm tra trang trên điện thoại, cả popup ẩn và ba nút liên hệ trong iframe.
- Dùng công cụ kiểm tra chia sẻ của nền tảng mạng xã hội để làm mới cache ảnh/link cũ.
- Trang Impressum và Datenschutzerklärung vẫn cần thông tin pháp nhân đã xác nhận trong `src/legal-data.json`. Nội dung bảo mật hiện mô tả website GitHub Pages; nếu giữ lớp nền tảng có xử lý dữ liệu riêng, bên vận hành phải bổ sung phần đó.

Các file HTML trong thư mục này được tạo lại bằng `npm run build`.
