USE master;
GO

-- Nếu đã tồn tại CSDL thì xóa để tạo mới
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Logistics_MienBac')
BEGIN
    ALTER DATABASE Logistics_MienBac SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Logistics_MienBac;
END
GO

-- Tạo cơ sở dữ liệu mới
CREATE DATABASE Logistics_MienBac;
GO
USE Logistics_MienBac;
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
-- BẢNG NHÂN VIÊN (MIỀN BẮC)
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

-- =================================================
-- DỮ LIỆU RIÊNG MIỀN BẮC
-- =================================================

-- Nhân viên miền Bắc
INSERT INTO NhanVien_Phan1 VALUES
('NVB01', N'Nguyễn Hoàng Nam', N'Trưởng bưu cục', 'BCB01'),
('NVB02', N'Trần Minh Tuấn', N'Shipper', 'BCB01'),
('NVB03', N'Lê Thị Mai', N'Kế toán', 'BCB02'),
('NVB04', N'Phạm Văn Đức', N'Shipper', 'BCB02'),
('NVB05', N'Hoàng Anh Dũng', N'Nhân viên kho', 'BCB03'),
('NVB06', N'Đỗ Thị Thắm', N'Shipper', 'BCB03'),
('NVB07', N'Vũ Văn Hùng', N'Shipper', 'BCB04'),
('NVB08', N'Bùi Thị Huệ', N'Nhân viên hỗ trợ', 'BCB05'),
('NVB09', N'Ngô Minh Long', N'Shipper', 'BCB06'),
('NVB10', N'Đặng Văn Bình', N'Shipper', 'BCB07'),
('NVB11', N'Lý Văn Cường', N'Nhân viên kho', 'BCB08'),
('NVB12', N'Chu Thị Yến', N'Shipper', 'BCB09'),
('NVB13', N'Trịnh Văn Tài', N'Shipper', 'BCB10'),
('NVB14', N'Phùng Văn Khánh', N'Shipper', 'BCB11'),
('NVB15', N'Dương Thị Đào', N'Trưởng bưu cục', 'BCB12');

-- Khách hàng miền Bắc
INSERT INTO KhachHang VALUES
('KHB01', N'Công ty Hải Hà', '0912345678', N'Hoàn Kiếm, Hà Nội', 'BCB01'),
('KHB02', N'Nguyễn Đình Chiểu', '0987654321', N'Lê Chân, Hải Phòng', 'BCB02'),
('KHB03', N'Cửa hàng Minh Tâm', '0901122334', N'Hạ Long, Quảng Ninh', 'BCB03'),
('KHB04', N'Trần Thị Hoa', '0944556677', N'Từ Sơn, Bắc Ninh', 'BCB04'),
('KHB05', N'Lê Văn Lương', '0933221100', N'Thành phố Hải Dương', 'BCB05'),
('KHB06', N'Phạm Minh Tuyết', '0966778899', N'Văn Giang, Hưng Yên', 'BCB06'),
('KHB07', N'Hoàng Gia Bảo', '0977889900', N'Thái Bình', 'BCB07'),
('KHB08', N'Nguyễn Văn Trỗi', '0922334455', N'Nam Định', 'BCB08'),
('KHB09', N'Đặng Thu Thảo', '0911554433', N'Ninh Bình', 'BCB09'),
('KHB10', N'Vũ Anh Thư', '0900112233', N'Vĩnh Yên, Vĩnh Phúc', 'BCB10'),
('KHB11', N'Lý Hải Đăng', '0988009911', N'Việt Trì, Phú Thọ', 'BCB11'),
('KHB12', N'Trần Bảo Nam', '0955443322', N'Sa Pa, Lào Cai', 'BCB12'),
('KHB13', N'Lê Thanh Huyền', '0944112233', N'Sơn La', 'BCB13'),
('KHB14', N'Ngô Quốc Anh', '0933887766', N'Thái Nguyên', 'BCB14'),
('KHB15', N'Võ Thị Sáu', '0922776655', N'Lạng Sơn', 'BCB15');

-- Đơn hàng miền Bắc
INSERT INTO DonHang VALUES
('VDB001', '2025-01-20', 1.2, 35000, 'TT09', 'KHB01', 'NVB02', 'DV01', 'BCB01'),
('VDB002', '2025-01-21', 0.5, 45000, 'TT08', 'KHB02', 'NVB04', 'DV02', 'BCB02'),
('VDB003', '2025-01-21', 5.0, 100000, 'TT04', 'KHB03', 'NVB06', 'DV05', 'BCB03'),
('VDB004', '2025-01-22', 2.0, 55000, 'TT01', 'KHB04', 'NVB07', 'DV04', 'BCB04'),
('VDB005', '2025-01-22', 0.8, 15000, 'TT09', 'KHB05', 'NVB09', 'DV01', 'BCB05'),
('VDB006', '2025-01-23', 10.5, 250000, 'TT06', 'KHB06', 'NVB10', 'DV05', 'BCB06'),
('VDB007', '2025-01-23', 0.3, 12000, 'TT09', 'KHB07', 'NVB12', 'DV03', 'BCB07'),
('VDB008', '2025-01-24', 1.5, 45000, 'TT08', 'KHB08', 'NVB13', 'DV09', 'BCB08'),
('VDB009', '2025-01-24', 0.2, 10000, 'TT09', 'KHB09', 'NVB14', 'DV06', 'BCB09'),
('VDB010', '2025-01-25', 1.0, 30000, 'TT02', 'KHB10', 'NVB02', 'DV11', 'BCB10'),
('VDB011', '2025-01-25', 4.0, 80000, 'TT03', 'KHB11', 'NVB04', 'DV07', 'BCB11'),
('VDB012', '2025-01-26', 0.5, 15000, 'TT01', 'KHB12', 'NVB06', 'DV01', 'BCB12'),
('VDB013', '2025-01-26', 15.0, 500000, 'TT10', 'KHB13', 'NVB07', 'DV08', 'BCB13'),
('VDB014', '2025-01-27', 0.7, 25000, 'TT01', 'KHB14', 'NVB09', 'DV12', 'BCB14'),
('VDB015', '2025-01-27', 2.5, 150000, 'TT01', 'KHB15', 'NVB10', 'DV13', 'BCB15');

-- Lịch trình đơn hàng
INSERT INTO LichTrinh (MaVanDon, ThoiGian, MoTa, MaBC) VALUES
('VDB001', GETDATE(), N'Đã nhận hàng thành công', 'BCB01'),
('VDB002', GETDATE(), N'Đang đi giao hàng', 'BCB02'),
('VDB003', GETDATE(), N'Hàng đã nhập kho Hải Phòng', 'BCB03'),
('VDB004', GETDATE(), N'Vừa tạo đơn hàng mới', 'BCB04'),
('VDB005', GETDATE(), N'Hoàn tất giao hàng', 'BCB05'),
('VDB006', GETDATE(), N'Đang chuyển về kho trung chuyển', 'BCB06'),
('VDB007', GETDATE(), N'Giao hàng thành công', 'BCB07'),
('VDB008', GETDATE(), N'Shipper đang lấy hàng', 'BCB08'),
('VDB009', GETDATE(), N'Đã ký nhận', 'BCB09'),
('VDB010', GETDATE(), N'Chờ xác nhận từ người gửi', 'BCB10'),
('VDB011', GETDATE(), N'Đang đóng gói hàng hóa', 'BCB11'),
('VDB012', GETDATE(), N'Chờ shipper đến lấy', 'BCB12'),
('VDB013', GETDATE(), N'Khách không nghe máy', 'BCB13'),
('VDB014', GETDATE(), N'Đơn hàng đang chờ xử lý', 'BCB14'),
('VDB015', GETDATE(), N'Đang kiểm tra hàng cồng kềnh', 'BCB15');

-- Xe vận chuyển miền Bắc
INSERT INTO XeVanChuyen VALUES
('29A-11111', 1500, 'BCB01'),
('15A-22222', 2000, 'BCB02'),
('14A-33333', 1200, 'BCB03'),
('99A-44444', 3000, 'BCB04'),
('34A-55555', 2500, 'BCB05'),
('89A-66666', 1800, 'BCB06'),
('17A-77777', 1500, 'BCB07'),
('18A-88888', 2200, 'BCB08'),
('35A-99999', 1000, 'BCB09'),
('88A-12121', 1500, 'BCB10'),
('19A-23232', 2000, 'BCB11'),
('24A-34343', 1200, 'BCB12'),
('26A-45454', 3500, 'BCB13'),
('20A-56565', 1500, 'BCB14'),
('12A-67676', 2000, 'BCB15');
