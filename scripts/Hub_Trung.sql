USE master;
GO

-- Nếu đã tồn tại CSDL Logistics_MienTrung thì xóa để tạo mới
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Logistics_MienTrung')
BEGIN
    ALTER DATABASE Logistics_MienTrung SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Logistics_MienTrung;
END
GO

-- Tạo cơ sở dữ liệu Logistics_MienTrung
CREATE DATABASE Logistics_MienTrung;
GO
USE Logistics_MienTrung;
GO

-- =========================
-- BẢNG DANH MỤC KHU VỰC
-- =========================
CREATE TABLE KhuVuc (
    MaKhuVuc VARCHAR(5) PRIMARY KEY,
    TenKhuVuc NVARCHAR(50)
);

-- =========================
-- BẢNG TRẠNG THÁI ĐƠN HÀNG
-- =========================
CREATE TABLE TrangThaiDonHang (
    MaTrangThai VARCHAR(10) PRIMARY KEY,
    TenTrangThai NVARCHAR(50)
);

-- =========================
-- BẢNG BƯU CỤC
-- =========================
CREATE TABLE BuuCuc (
    MaBC VARCHAR(10) PRIMARY KEY,
    TenBC NVARCHAR(100),
    DiaChi NVARCHAR(200),
    MaKhuVuc VARCHAR(5),
    FOREIGN KEY (MaKhuVuc) REFERENCES KhuVuc(MaKhuVuc)
);

-- =========================
-- BẢNG GIÁ DỊCH VỤ
-- =========================
CREATE TABLE BangGia (
    MaDichVu VARCHAR(10) PRIMARY KEY,
    TenDichVu NVARCHAR(100),
    DonGiaNoiMien MONEY,
    DonGiaLienMien MONEY
);

-- =========================
-- BẢNG NHÂN VIÊN (MIỀN TRUNG)
-- =========================
CREATE TABLE NhanVien_Phan1 (
    MaNV VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100),
    ChucVu NVARCHAR(50),
    MaBC VARCHAR(10),
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);

-- =========================
-- BẢNG KHÁCH HÀNG
-- =========================
CREATE TABLE KhachHang (
    MaKH VARCHAR(10) PRIMARY KEY,
    TenKH NVARCHAR(100),
    SDT VARCHAR(15),
    DiaChi NVARCHAR(200),
    MaBC VARCHAR(10),
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);

-- =========================
-- BẢNG ĐƠN HÀNG
-- =========================
CREATE TABLE DonHang (
    MaVanDon VARCHAR(15) PRIMARY KEY,
    NgayGui DATE,
    TrongLuong FLOAT,
    CuocPhi MONEY,
    MaTrangThai VARCHAR(10),
    MaKH_Gui VARCHAR(10),
    MaNV_Giao VARCHAR(10),
    MaDichVu VARCHAR(10),
    MaBC_HienTai VARCHAR(10),
    FOREIGN KEY (MaKH_Gui) REFERENCES KhachHang(MaKH),
    FOREIGN KEY (MaNV_Giao) REFERENCES NhanVien_Phan1(MaNV),
    FOREIGN KEY (MaDichVu) REFERENCES BangGia(MaDichVu),
    FOREIGN KEY (MaBC_HienTai) REFERENCES BuuCuc(MaBC),
    FOREIGN KEY (MaTrangThai) REFERENCES TrangThaiDonHang(MaTrangThai)
);

-- =========================
-- BẢNG LỊCH TRÌNH ĐƠN HÀNG
-- =========================
CREATE TABLE LichTrinh (
    MaLichTrinh INT IDENTITY PRIMARY KEY,
    MaVanDon VARCHAR(15),
    ThoiGian DATETIME,
    MoTa NVARCHAR(200),
    MaBC VARCHAR(10),
    FOREIGN KEY (MaVanDon) REFERENCES DonHang(MaVanDon),
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);

-- =========================
-- BẢNG XE VẬN CHUYỂN
-- =========================
CREATE TABLE XeVanChuyen (
    BienSo VARCHAR(15) PRIMARY KEY,
    TaiTrong FLOAT,
    MaBC VARCHAR(10),
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);

-- =========================
-- DỮ LIỆU NHÂN VIÊN MIỀN TRUNG
-- =========================
INSERT INTO NhanVien_Phan1 VALUES
('NVT01', N'Lê Công Vinh', N'Trưởng bưu cục', 'BCT01'),
('NVT02', N'Phan Văn Tài Em', N'Shipper', 'BCT01'),
('NVT03', N'Nguyễn Anh Đức', N'Kế toán', 'BCT02'),
('NVT04', N'Trần Đình Đồng', N'Shipper', 'BCT03'),
('NVT05', N'Quế Ngọc Hải', N'Nhân viên kho', 'BCT04'),
('NVT06', N'Nguyễn Quang Hải', N'Shipper', 'BCT05'),
('NVT07', N'Đoàn Văn Hậu', N'Shipper', 'BCT06'),
('NVT08', N'Đỗ Hùng Dũng', N'Nhân viên hỗ trợ', 'BCT07'),
('NVT09', N'Nguyễn Văn Toàn', N'Shipper', 'BCT08'),
('NVT10', N'Nguyễn Tuấn Anh', N'Shipper', 'BCT09'),
('NVT11', N'Lương Xuân Trường', N'Nhân viên kho', 'BCT10'),
('NVT12', N'Phạm Xuân Mạnh', N'Shipper', 'BCT11'),
('NVT13', N'Nguyễn Phong Hồng Duy', N'Shipper', 'BCT12'),
('NVT14', N'Vũ Văn Thanh', N'Shipper', 'BCT13'),
('NVT15', N'Nguyễn Công Phượng', N'Trưởng bưu cục', 'BCT14');

-- =========================
-- DỮ LIỆU KHÁCH HÀNG MIỀN TRUNG
-- =========================
INSERT INTO KhachHang VALUES
('KHT01', N'Nguyễn Phan Anh', '0935112233', N'Hải Châu, Đà Nẵng', 'BCT01'),
('KHT02', N'Lê Thị Thu', '0945223344', N'TP Huế', 'BCT02'),
('KHT03', N'Trần Văn Đạo', '0915334455', N'Hội An, Quảng Nam', 'BCT03'),
('KHT04', N'Phạm Bình Minh', '0905445566', N'TP Quảng Ngãi', 'BCT04'),
('KHT05', N'Bùi Xuân Phái', '0985556677', N'Quy Nhơn, Bình Định', 'BCT05'),
('KHT06', N'Đặng Lê Nguyên Vũ', '0975667788', N'Tuy Hòa, Phú Yên', 'BCT06'),
('KHT07', N'Nguyễn Văn Linh', '0965778899', N'Nha Trang, Khánh Hòa', 'BCT07'),
('KHT08', N'Lý Thường Kiệt', '0925889900', N'Phan Rang, Ninh Thuận', 'BCT08'),
('KHT09', N'Trần Hưng Đạo', '0915990011', N'Phan Thiết, Bình Thuận', 'BCT09'),
('KHT10', N'Nguyễn Du', '0905001122', N'Kon Tum', 'BCT10'),
('KHT11', N'Hồ Xuân Hương', '0935113355', N'Pleiku, Gia Lai', 'BCT11'),
('KHT12', N'Bà Huyện Thanh Quan', '0945224466', N'Buôn Ma Thuột', 'BCT12'),
('KHT13', N'Xuân Quỳnh', '0915335577', N'Gia Nghĩa, Đắk Nông', 'BCT13'),
('KHT14', N'Hàn Mặc Tử', '0905446688', N'Đà Lạt, Lâm Đồng', 'BCT14'),
('KHT15', N'Nguyễn Bỉnh Khiêm', '0985557799', N'Đồng Hới, Quảng Bình', 'BCT15');

-- =========================
-- DỮ LIỆU ĐƠN HÀNG MIỀN TRUNG
-- =========================
INSERT INTO DonHang VALUES
('VDT001', '2025-01-20', 0.5, 15000, 'TT09', 'KHT01', 'NVT02', 'DV01', 'BCT01'),
('VDT002', '2025-01-21', 1.0, 45000, 'TT08', 'KHT02', 'NVT04', 'DV02', 'BCT02'),
('VDT003', '2025-01-21', 2.2, 55000, 'TT04', 'KHT03', 'NVT06', 'DV04', 'BCT03'),
('VDT004', '2025-01-22', 0.4, 12000, 'TT01', 'KHT04', 'NVT07', 'DV03', 'BCT04'),
('VDT005', '2025-01-22', 15.0, 500000, 'TT09', 'KHT05', 'NVT09', 'DV08', 'BCT05'),
('VDT006', '2025-01-23', 3.0, 35000, 'TT06', 'KHT06', 'NVT10', 'DV01', 'BCT06'),
('VDT007', '2025-01-23', 0.2, 10000, 'TT09', 'KHT07', 'NVT12', 'DV06', 'BCT07'),
('VDT008', '2025-01-24', 5.5, 100000, 'TT08', 'KHT08', 'NVT13', 'DV05', 'BCT08'),
('VDT009', '2025-01-24', 0.8, 20000, 'TT09', 'KHT09', 'NVT14', 'DV09', 'BCT09'),
('VDT010', '2025-01-25', 1.2, 30000, 'TT02', 'KHT10', 'NVT02', 'DV11', 'BCT10'),
('VDT011', '2025-01-25', 4.5, 80000, 'TT03', 'KHT11', 'NVT04', 'DV07', 'BCT11'),
('VDT012', '2025-01-26', 0.6, 15000, 'TT01', 'KHT12', 'NVT06', 'DV01', 'BCT12'),
('VDT013', '2025-01-26', 10.0, 250000, 'TT10', 'KHT13', 'NVT07', 'DV05', 'BCT13'),
('VDT014', '2025-01-27', 0.3, 25000, 'TT01', 'KHT14', 'NVT09', 'DV12', 'BCT14'),
('VDT015', '2025-01-27', 1.5, 35000, 'TT01', 'KHT15', 'NVT10', 'DV01', 'BCT15');

-- =========================
-- LỊCH TRÌNH ĐƠN HÀNG MIỀN TRUNG
-- =========================
INSERT INTO LichTrinh (MaVanDon, ThoiGian, MoTa, MaBC) VALUES
('VDT001', GETDATE(), N'Giao hàng tại Hải Châu', 'BCT01'),
('VDT002', GETDATE(), N'Đang rời kho Huế', 'BCT02'),
('VDT003', GETDATE(), N'Hàng đang được phân loại', 'BCT03'),
('VDT004', GETDATE(), N'Nhận thông tin đơn hàng', 'BCT04'),
('VDT005', GETDATE(), N'Đã bàn giao xe máy vận chuyển', 'BCT05'),
('VDT006', GETDATE(), N'Đang đi liên tỉnh', 'BCT06'),
('VDT007', GETDATE(), N'Đã nhận hàng tại Nha Trang', 'BCT07'),
('VDT008', GETDATE(), N'Hàng quá khổ chờ xe tải', 'BCT08'),
('VDT009', GETDATE(), N'Đã thu tiền COD', 'BCT09'),
('VDT010', GETDATE(), N'Kiểm tra địa chỉ giao', 'BCT10'),
('VDT011', GETDATE(), N'Bảo quản đông lạnh', 'BCT11'),
('VDT012', GETDATE(), N'Sẵn sàng giao hàng', 'BCT12'),
('VDT013', GETDATE(), N'Khách hàng từ chối nhận', 'BCT13'),
('VDT014', GETDATE(), N'Chờ xe đi Lâm Đồng', 'BCT14'),
('VDT015', GETDATE(), N'Đã nhập bưu cục Đồng Hới', 'BCT15');

-- =========================
-- XE VẬN CHUYỂN MIỀN TRUNG
-- =========================
INSERT INTO XeVanChuyen VALUES
('43A-11111', 1500, 'BCT01'),
('75A-22222', 2000, 'BCT02'),
('92A-33333', 1200, 'BCT03'),
('76A-44444', 3000, 'BCT04'),
('77A-55555', 2500, 'BCT05'),
('78A-66666', 1800, 'BCT06'),
('79A-77777', 1500, 'BCT07'),
('85A-88888', 2200, 'BCT08'),
('86A-99999', 1000, 'BCT09'),
('82A-12121', 1500, 'BCT10'),
('81A-23232', 2000, 'BCT11'),
('47A-34343', 1200, 'BCT12'),
('48A-45454', 3500, 'BCT13'),
('49A-56565', 1500, 'BCT14'),
('73A-67676', 2000, 'BCT15');