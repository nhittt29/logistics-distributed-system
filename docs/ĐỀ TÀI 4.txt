# ĐỀ TÀI 4

## XÂY DỰNG CƠ SỞ DỮ LIỆU PHÂN TÁN CHO HỆ THỐNG LOGISTICS & CHUYỂN PHÁT NHANH

---

## I. MÔ TẢ NGHIỆP VỤ

Công ty ABC Logistics là đơn vị vận chuyển hàng hóa với mạng lưới bưu cục trải dài trên toàn quốc, được tổ chức thành ba khu vực chính: Miền Bắc, Miền Trung và Miền Nam. Hệ thống mỗi ngày xử lý hàng trăm nghìn đơn hàng với yêu cầu cao về tốc độ và tính chính xác.

### 1. Quản lý nhân sự (Shipper)

Thông tin nhân viên giao nhận được tổ chức theo hướng phân tán kết hợp bảo mật:

* Các thông tin phục vụ vận hành như: Mã nhân viên, Họ tên, Chức vụ, Mã bưu cục được lưu trữ tại các trạm khu vực tương ứng.
* Các thông tin nhạy cảm như: Lương và Mật khẩu được lưu trữ tập trung tại Hub Miền Nam (trụ sở chính).

Dữ liệu nhân viên được chia thành hai bảng:

* **NhanVien_Phan1(MaNV, HoTen, ChucVu, MaBC)**: lưu tại cả ba miền.
* **NhanVien_Phan2(MaNV, Luong, MatKhau)**: chỉ lưu tại Miền Nam.

Cách tổ chức này đảm bảo vừa hỗ trợ vận hành phân tán vừa đảm bảo an toàn dữ liệu.

---

### 2. Vận hành đơn hàng

Mỗi đơn hàng sẽ được lưu trữ và xử lý tại khu vực mà hàng hóa đang hiện diện, giúp tối ưu tốc độ xử lý (ví dụ: quét mã vạch, cập nhật trạng thái).

---

### 3. Luân chuyển & Tracking

Hàng hóa có thể di chuyển qua nhiều khu vực. Hệ thống cho phép khách hàng tra cứu trạng thái đơn hàng theo thời gian thực, bất kể đơn hàng đang ở miền nào.

---

## II. KIẾN TRÚC HỆ THỐNG

Hệ thống được triển khai theo mô hình cơ sở dữ liệu phân tán gồm 3 trạm (Site):

* Site Miền Bắc
* Site Miền Trung
* Site Miền Nam (đóng vai trò trụ sở chính, lưu dữ liệu nhạy cảm)

Các trạm được kết nối với nhau thông qua cơ chế Linked Server, cho phép truy vấn và xử lý dữ liệu liên vùng.

---

## III. THIẾT KẾ CƠ SỞ DỮ LIỆU (GLOBAL SCHEMA)

Hệ thống sử dụng lược đồ toàn cục gồm các bảng sau:

* **KhuVuc(MaKhuVuc, TenKhuVuc)**
  → Quản lý thông tin khu vực (Miền Bắc, Trung, Nam)

* **BuuCuc(MaBC, TenBC, DiaChi, MaKhuVuc)**
  → Liên kết với bảng KhuVuc thông qua MaKhuVuc

* **NhanVien_Phan1(MaNV, HoTen, ChucVu, MaBC)**

* **NhanVien_Phan2(MaNV, Luong, MatKhau)**

* **KhachHang(MaKH, TenKH, SDT, DiaChi, MaBC)**

* **BangGia(MaDichVu, TenDichVu, DonGiaNoiMien, DonGiaLienMien)**

* **TrangThaiDonHang(MaTrangThai, TenTrangThai)**
  → Quản lý trạng thái đơn hàng (Đang giao, Thành công, Thất bại,...)

* **DonHang(MaVanDon, NgayGui, TrongLuong, CuocPhi, MaTrangThai, MaKH_Gui, MaNV_Giao, MaDichVu, MaBC_HienTai)**
  → MaBC_HienTai xác định vị trí hiện tại của đơn hàng

* **LichTrinh(MaLichTrinh, MaVanDon, ThoiGian, MoTa, MaBC)**

* **XeVanChuyen(BienSo, TaiTrong, MaBC)**

---

## IV. PHÂN TÁN DỮ LIỆU

### 1. Phân mảnh dọc (Vertical Fragmentation)

Bảng nhân viên được chia thành hai phần:

* **NhanVien_Phan1**: lưu tại cả ba miền theo nơi làm việc
* **NhanVien_Phan2**: chỉ lưu tại Miền Nam (dữ liệu nhạy cảm)

---

### 2. Phân mảnh ngang (Horizontal Fragmentation)

Các bảng sau được phân tán theo khu vực:

* **DonHang** (dựa trên MaBC_HienTai)
* **LichTrinh** (dựa trên MaBC)
* **XeVanChuyen** (dựa trên MaBC)

Nguyên tắc: Dữ liệu thuộc khu vực nào sẽ được lưu tại Server của khu vực đó.

---

### 3. Nhân bản dữ liệu (Replication)

Các bảng được nhân bản toàn bộ đến cả ba miền:

* **BangGia** → phục vụ tính cước nhanh
* **BuuCuc** → phục vụ định tuyến
* **KhuVuc** → hỗ trợ phân vùng dữ liệu
* **TrangThaiDonHang** → đảm bảo thống nhất trạng thái

---

## V. YÊU CẦU LẬP TRÌNH

Sinh viên cần triển khai các chức năng sau, đảm bảo sử dụng truy vấn phân tán thông qua Linked Server:

### 1. Tại Hub Miền Bắc

* Tạo View hiển thị danh sách nhân viên có chức vụ "Shipper" thuộc các bưu cục miền Bắc.

---

### 2. Tại Hub Miền Trung

* Truy vấn các đơn hàng có cước phí lớn hơn 1.000.000 VNĐ đang nằm tại miền Trung trong ngày hiện tại.

---

### 3. Stored Procedure tra cứu vận đơn

* Tìm kiếm tại local trước
* Nếu không có → truy vấn sang các site khác
* Trả về: Mã vận đơn, Trạng thái, Tên bưu cục hiện tại

---

### 4. Stored Procedure xem thu nhập nhân viên

* Kết hợp dữ liệu:

  * Local: NhanVien_Phan1
  * Remote (Miền Nam): NhanVien_Phan2
* Trả về: Mã NV, Họ tên, Lương

---

### 5. Thống kê doanh thu toàn hệ thống

* Tính tổng SUM(CuocPhi) theo từng khu vực
* Phải truy vấn trực tiếp từng trạm (không dùng dữ liệu đồng bộ)

---

### 6. Trigger kiểm tra xóa dịch vụ

* Khi xóa một dịch vụ trong BangGia:

  * Kiểm tra trên toàn hệ thống (cả 3 miền)
  * Nếu còn đơn hàng sử dụng → ROLLBACK

---

### 7. Hàm đếm đơn hàng thất bại

* Đếm số đơn có trạng thái "Giao thất bại" trong năm 2025
* Tối ưu:

  * Gửi lệnh COUNT xuống từng trạm
  * Nhận kết quả và tổng hợp

---

## VI. KẾT LUẬN

Mô hình trên đảm bảo:

* Tối ưu hiệu năng xử lý tại từng khu vực
* Đảm bảo tính bảo mật cho dữ liệu nhạy cảm
* Hỗ trợ truy vấn phân tán và theo dõi đơn hàng toàn hệ thống theo thời gian thực

Đồng thời, việc chuẩn hóa dữ liệu thông qua các bảng KhuVuc và TrangThaiDonHang giúp hệ thống dễ mở rộng và quản lý hơn.