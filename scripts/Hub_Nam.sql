USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Logistics_MienNam')
BEGIN
    ALTER DATABASE Logistics_MienNam SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Logistics_MienNam;
END
GO

CREATE DATABASE Logistics_MienNam;
GO

USE Logistics_MienNam;
GO

-- CẤU TRÚC BẢNG (Giữ nguyên như cũ)
CREATE TABLE KhuVuc 
(
    MaKhuVuc VARCHAR(5) PRIMARY KEY, 
    TenKhuVuc NVARCHAR(50)
);
GO

CREATE TABLE TrangThaiDonHang 
(
    MaTrangThai VARCHAR(10) PRIMARY KEY, 
    TenTrangThai NVARCHAR(50)
);
GO

CREATE TABLE BuuCuc 
(
    MaBC VARCHAR(10) PRIMARY KEY, 
    TenBC NVARCHAR(100), 
    DiaChi NVARCHAR(200), 
    MaKhuVuc VARCHAR(5), 
    FOREIGN KEY (MaKhuVuc) REFERENCES KhuVuc(MaKhuVuc)
);
GO

CREATE TABLE BangGia 
(
    MaDichVu VARCHAR(10) PRIMARY KEY, 
    TenDichVu NVARCHAR(100), 
    DonGiaNoiMien MONEY, 
    DonGiaLienMien MONEY
);
GO

CREATE TABLE NhanVien_Phan1 
(
    MaNV VARCHAR(10) PRIMARY KEY, 
    HoTen NVARCHAR(100), 
    ChucVu NVARCHAR(50), 
    MaBC VARCHAR(10), 
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);
GO

CREATE TABLE NhanVien_Phan2 
(
    MaNV VARCHAR(10) PRIMARY KEY, 
    Luong MONEY, 
    MatKhau NVARCHAR(100)
); -- Dữ liệu mật
GO

CREATE TABLE KhachHang 
(
    MaKH VARCHAR(10) PRIMARY KEY, 
    TenKH NVARCHAR(100), 
    SDT VARCHAR(15), 
    DiaChi NVARCHAR(200), 
    MaBC VARCHAR(10), 
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);
GO

CREATE TABLE DonHang 
(
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
GO

CREATE TABLE LichTrinh 
(
    MaLichTrinh INT IDENTITY PRIMARY KEY, 
    MaVanDon VARCHAR(15), 
    ThoiGian DATETIME, 
    MoTa NVARCHAR(200), 
    MaBC VARCHAR(10), 
    FOREIGN KEY (MaVanDon) REFERENCES DonHang(MaVanDon), 
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);
GO

CREATE TABLE XeVanChuyen 
(
    BienSo VARCHAR(15) PRIMARY KEY, 
    TaiTrong FLOAT, 
    MaBC VARCHAR(10), 
    FOREIGN KEY (MaBC) REFERENCES BuuCuc(MaBC)
);
GO

-- DỮ LIỆU ĐỂ REPLICATION (Gom đủ 3 miền)
INSERT INTO KhuVuc VALUES
('B01', N'Hà Nội'), 
('B02', N'Hải Phòng'), 
('B03', N'Quảng Ninh'), 
('B04', N'Bắc Ninh'), 
('B05', N'Hải Dương'), 
('B06', N'Hưng Yên'), 
('B07', N'Thái Bình'), 
('B08', N'Nam Định'), 
('B09', N'Ninh Bình'), 
('B10', N'Vĩnh Phúc'), 
('B11', N'Phú Thọ'), 
('B12', N'Lào Cai'), 
('B13', N'Sơn La'), 
('B14', N'Thái Nguyên'), 
('B15', N'Lạng Sơn'),
('T01', N'Đà Nẵng'), 
('T02', N'Huế'), 
('T03', N'Quảng Nam'), 
('T04', N'Quảng Ngãi'), 
('T05', N'Bình Định'), 
('T06', N'Phú Yên'), 
('T07', N'Khánh Hòa'), 
('T08', N'Ninh Thuận'), 
('T09', N'Bình Thuận'), 
('T10', N'Kon Tum'), 
('T11', N'Gia Lai'), 
('T12', N'Đắk Lắk'), 
('T13', N'Đắk Nông'), 
('T14', N'Lâm Đồng'), 
('T15', N'Quảng Bình'),
('N01', N'TP. Hồ Chí Minh'), 
('N02', N'Bình Dương'), 
('N03', N'Đồng Nai'), 
('N04', N'Long An'), 
('N05', N'Tiền Giang'), 
('N06', N'Bến Tre'), 
('N07', N'Vĩnh Long'), 
('N08', N'Cần Thơ'), 
('N09', N'Hậu Giang'), 
('N10', N'Sóc Trăng'), 
('N11', N'Bạc Liêu'), 
('N12', N'Cà Mau'), 
('N13', N'Kiên Giang'), 
('N14', N'An Giang'), 
('N15', N'Tây Ninh');
GO

INSERT INTO TrangThaiDonHang VALUES 
('TT01', N'Mới tạo'), 
('TT02', N'Đã xác nhận'), 
('TT03', N'Đang lấy hàng'), 
('TT04', N'Đã nhập kho'), 
('TT05', N'Đang phân loại'), 
('TT06', N'Đang luân chuyển'), 
('TT07', N'Đến kho đích'), 
('TT08', N'Đang giao hàng'), 
('TT09', N'Giao hàng thành công'), 
('TT10', N'Giao hàng thất bại'), 
('TT11', N'Đang chuyển hoàn'), 
('TT12', N'Đã hoàn hàng'), 
('TT13', N'Khách hẹn lại'), 
('TT14', N'Thất lạc'), 
('TT15', N'Đã hủy');
GO

INSERT INTO BuuCuc VALUES
('BCB01', N'Bưu cục Hoàn Kiếm', N'Hà Nội', 'B01'), 
('BCB02', N'Bưu cục Hồng Bàng', N'Hải Phòng', 'B02'), 
('BCB03', N'Bưu cục Hạ Long', N'Quảng Ninh', 'B03'), 
('BCB04', N'Bưu cục Tiên Du', N'Bắc Ninh', 'B04'), 
('BCB05', N'Bưu cục Chí Linh', N'Hải Dương', 'B05'), 
('BCB06', N'Bưu cục Văn Lâm', N'Hưng Yên', 'B06'), 
('BCB07', N'Bưu cục Kiến Xương', N'Thái Bình', 'B07'), 
('BCB08', N'Bưu cục Giao Thủy', N'Nam Định', 'B08'), 
('BCB09', N'Bưu cục Tam Điệp', N'Ninh Bình', 'B09'), 
('BCB10', N'Bưu cục Phúc Yên', N'Vĩnh Phúc', 'B10'), 
('BCB11', N'Bưu cục Việt Trì', N'Phú Thọ', 'B11'), 
('BCB12', N'Bưu cục Sa Pa', N'Lào Cai', 'B12'), 
('BCB13', N'Bưu cục Mộc Châu', N'Sơn La', 'B13'), 
('BCB14', N'Bưu cục Phổ Yên', N'Thái Nguyên', 'B14'), 
('BCB15', N'Bưu cục Hữu Nghị', N'Lạng Sơn', 'B15'),
('BCT01', N'Bưu cục Hải Châu', N'Đà Nẵng', 'T01'), 
('BCT02', N'Bưu cục Hương Thủy', N'Huế', 'T02'), 
('BCT03', N'Bưu cục Tam Kỳ', N'Quảng Nam', 'T03'), 
('BCT04', N'Bưu cục Bình Sơn', N'Quảng Ngãi', 'T04'), 
('BCT05', N'Bưu cục Quy Nhơn', N'Bình Định', 'T05'), 
('BCT06', N'Bưu cục Tuy Hòa', N'Phú Yên', 'T06'), 
('BCT07', N'Bưu cục Nha Trang', N'Khánh Hòa', 'T07'), 
('BCT08', N'Bưu cục Phan Rang', N'Ninh Thuận', 'T08'), 
('BCT09', N'Bưu cục Phan Thiết', N'Bình Thuận', 'T09'), 
('BCT10', N'Bưu cục Ngọc Hồi', N'Kon Tum', 'T10'), 
('BCT11', N'Bưu cục Pleiku', N'Gia Lai', 'T11'), 
('BCT12', N'Bưu cục Buôn Ma Thuột', N'Đắk Lắk', 'T12'), 
('BCT13', N'Bưu cục Gia Nghĩa', N'Đắk Nông', 'T13'), 
('BCT14', N'Bưu cục Đà Lạt', N'Lâm Đồng', 'T14'), 
('BCT15', N'Bưu cục Đồng Hới', N'Quảng Bình', 'T15'),
('BCN01', N'Bưu cục Quận 1', N'TP.HCM', 'N01'), 
('BCN02', N'Bưu cục Thuận An', N'Bình Dương', 'N02'), 
('BCN03', N'Bưu cục Biên Hòa', N'Đồng Nai', 'N03'), 
('BCN04', N'Bưu cục Tân An', N'Long An', 'N04'), 
('BCN05', N'Bưu cục Mỹ Tho', N'Tiền Giang', 'N05'), 
('BCN06', N'Bưu cục Châu Thành', N'Bến Tre', 'N06'), 
('BCN07', N'Bưu cục Long Hồ', N'Vĩnh Long', 'N07'), 
('BCN08', N'Bưu cục Ninh Kiều', N'Cần Thơ', 'N08'), 
('BCN09', N'Bưu cục Vị Thanh', N'Hậu Giang', 'N09'), 
('BCN10', N'Bưu cục Trần Đề', N'Sóc Trăng', 'N10'), 
('BCN11', N'Bưu cục Giá Rai', N'Bạc Liêu', 'N11'), 
('BCN12', N'Bưu cục Đầm Dơi', N'Cà Mau', 'N12'), 
('BCN13', N'Bưu cục Rạch Giá', N'Kiên Giang', 'N13'), 
('BCN14', N'Bưu cục Long Xuyên', N'An Giang', 'N14'), 
('BCN15', N'Bưu cục Hòa Thành', N'Tây Ninh', 'N15');
GO

INSERT INTO BangGia VALUES 
('DV01', N'Chuyển phát tiêu chuẩn', 15000, 35000), 
('DV02', N'Chuyển phát hỏa tốc', 45000, 80000), 
('DV03', N'Chuyển phát tiết kiệm', 12000, 28000), 
('DV04', N'Giao hàng 2h', 55000, 100000), 
('DV05', N'Giao hàng cồng kềnh', 100000, 250000), 
('DV06', N'Chuyển phát tài liệu', 10000, 20000), 
('DV07', N'Giao hàng đông lạnh', 80000, 150000), 
('DV08', N'Vận chuyển xe máy', 500000, 1200000), 
('DV09', N'Giao hàng thu hộ COD', 20000, 45000), 
('DV10', N'Chuyển phát quốc tế', 200000, 500000), 
('DV11', N'Giao hàng trong ngày', 30000, 60000), 
('DV12', N'Giao quà tặng', 25000, 50000), 
('DV13', N'Vận chuyển đồ gốm', 150000, 300000), 
('DV14', N'Dịch vụ lưu kho', 5000, 10000), 
('DV15', N'Bảo hiểm hàng hóa', 50000, 100000);
GO

-- DỮ LIỆU RIÊNG MIỀN NAM
INSERT INTO NhanVien_Phan1 VALUES 
('NVN01', N'Nguyễn Thanh Tùng', N'Trưởng bưu cục', 'BCN01'), 
('NVN02', N'Sơn Tùng MTP', N'Shipper', 'BCN01'), 
('NVN03', N'Trần Thành', N'Kế toán', 'BCN02'), 
('NVN04', N'Nguyễn Khoa Tóc Tiên', N'Shipper', 'BCN03'), 
('NVN05', N'Đông Nhi', N'Nhân viên kho', 'BCN04'), 
('NVN06', N'Ông Cao Thắng', N'Shipper', 'BCN05'), 
('NVN07', N'Hồ Ngọc Hà', N'Shipper', 'BCN06'), 
('NVN08', N'Lệ Quyên', N'Nhân viên hỗ trợ', 'BCN07'), 
('NVN09', N'Đàm Vĩnh Hưng', N'Shipper', 'BCN08'), 
('NVN10', N'Mỹ Tâm', N'Shipper', 'BCN09'), 
('NVN11', N'Lam Trường', N'Nhân viên kho', 'BCN10'), 
('NVN12', N'Đan Trường', N'Shipper', 'BCN11'), 
('NVN13', N'Cẩm Ly', N'Shipper', 'BCN12'), 
('NVN14', N'Quang Dũng', N'Shipper', 'BCN13'), 
('NVN15', N'Thu Minh', N'Trưởng bưu cục', 'BCN14'),
GO

-- DỮ LIỆU NHÂN VIÊN MIỀN BẮC
INSERT INTO NhanVien_Phan1 (MaNV, HoTen, ChucVu, MaBC) VALUES 
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
('NVB12', N'Chu Thị Y Yen', N'Shipper', 'BCB09'),
('NVB13', N'Trịnh Văn Tài', N'Shipper', 'BCB10'),
('NVB14', N'Phùng Văn Khánh', N'Shipper', 'BCB11'),
('NVB15', N'Dương Thị Đào', N'Trưởng bưu cục', 'BCB12');
GO

-- DỮ LIỆU NHÂN VIÊN MIỀN TRUNG
INSERT INTO NhanVien_Phan1 (MaNV, HoTen, ChucVu, MaBC) VALUES 
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
GO

-- 1. Xóa dữ liệu cũ để tránh lỗi trùng khóa chính khi chạy lại
DELETE FROM NhanVien_Phan2;
GO

-- 2. DỮ LIỆU MẬT MIỀN BẮC (Chỉ lưu tại Nam)
INSERT INTO NhanVien_Phan2 (MaNV, Luong, MatKhau) VALUES
('NVB01', 15000000, 'passB01'), ('NVB02', 8500000, 'passB02'), ('NVB03', 10000000, 'passB03'),
('NVB04', 8200000, 'passB04'), ('NVB05', 9000000, 'passB05'), ('NVB06', 8100000, 'passB06'),
('NVB07', 8300000, 'passB07'), ('NVB08', 9200000, 'passB08'), ('NVB09', 8400000, 'passB09'),
('NVB10', 8600000, 'passB10'), ('NVB11', 9500000, 'passB11'), ('NVB12', 8000000, 'passB12'),
('NVB13', 8700000, 'passB13'), ('NVB14', 8800000, 'passB14'), ('NVB15', 14500000, 'passB15');
GO

-- 3. DỮ LIỆU MẬT MIỀN TRUNG (Chỉ lưu tại Nam)
INSERT INTO NhanVien_Phan2 (MaNV, Luong, MatKhau) VALUES
('NVT01', 14000000, 'passT01'), ('NVT02', 8000000, 'passT02'), ('NVT03', 10500000, 'passT03'),
('NVT04', 8300000, 'passT04'), ('NVT05', 9200000, 'passT05'), ('NVT06', 8200000, 'passT06'),
('NVT07', 8400000, 'passT07'), ('NVT08', 9300000, 'passT08'), ('NVT09', 8500000, 'passT09'),
('NVT10', 8600000, 'passT10'), ('NVT11', 9400000, 'passT11'), ('NVT12', 8100000, 'passT12'),
('NVT13', 8700000, 'passT13'), ('NVT14', 8900000, 'passT14'), ('NVT15', 13500000, 'passT15');
GO

-- 4. DỮ LIỆU MẬT MIỀN NAM (Chỉ lưu tại Nam)
INSERT INTO NhanVien_Phan2 (MaNV, Luong, MatKhau) VALUES
('NVN01', 15500000, 'matkhau01'), ('NVN02', 8800000, 'matkhau02'), ('NVN03', 11000000, 'matkhau03'), 
('NVN04', 8400000, 'matkhau04'), ('NVN05', 9200000, 'matkhau05'), ('NVN06', 8300000, 'matkhau06'), 
('NVN07', 8500000, 'matkhau07'), ('NVN08', 9700000, 'matkhau08'), ('NVN09', 8900000, 'matkhau09'), 
('NVN10', 8600000, 'matkhau10'), ('NVN11', 11500000, 'matkhau11'), ('NVN12', 8200000, 'matkhau12'), 
('NVN13', 8700000, 'matkhau13'), ('NVN14', 9000000, 'matkhau14'), ('NVN15', 14800000, 'matkhau15');
GO

INSERT INTO KhachHang VALUES 
('KHN01', N'Công ty CP Sài Gòn', '0901234567', N'Quận 1, TP.HCM', 'BCN01'), 
('KHN02', N'Trần Bảo Thy', '0902345678', N'Dĩ An, Bình Dương', 'BCN02'), 
('KHN03', N'Nguyễn Phi Hùng', '0903456789', N'Biên Hòa, Đồng Nai', 'BCN03'), 
('KHN04', N'Lê Minh', '0904567890', N'Tân An, Long An', 'BCN04'), 
('KHN05', N'Phương Thanh', '0905678901', N'Mỹ Tho, Tiền Giang', 'BCN05'), 
('KHN06', N'Đan Trường', '0906789012', N'Bến Tre', 'BCN06'), 
('KHN07', N'Cẩm Vân', '0907890123', N'Vĩnh Long', 'BCN07'), 
('KHN08', N'Khánh Ly', '0908901234', N'Ninh Kiều, Cần Thơ', 'BCN08'), 
('KHN09', N'Tuấn Ngọc', '0909012345', N'Vị Thanh, Hậu Giang', 'BCN09'), 
('KHN10', N'Ý Lan', '0910123456', N'Sóc Trăng', 'BCN10'), 
('KHN11', N'Bằng Kiều', '0911234567', N'Bạc Liêu', 'BCN11'), 
('KHN12', N'Quang Lê', '0912345678', N'Cà Mau', 'BCN12'), 
('KHN13', N'Như Quỳnh', '0913456789', N'Phú Quốc, Kiên Giang', 'BCN13'), 
('KHN14', N'Mạnh Quỳnh', '0914567890', N'Châu Đốc, An Giang', 'BCN14'), 
('KHN15', N'Phi Nhung', '0915678901', N'Tây Ninh', 'BCN15');
GO

INSERT INTO DonHang VALUES 
('VDN001', '2025-01-20', 0.5, 55000, 'TT09', 'KHN01', 'NVN02', 'DV04', 'BCN01'), 
('VDN002', '2025-01-21', 1.0, 45000, 'TT08', 'KHN02', 'NVN04', 'DV02', 'BCN02'), 
('VDN003', '2025-01-21', 2.0, 35000, 'TT04', 'KHN03', 'NVN06', 'DV01', 'BCN03'), 
('VDN004', '2025-01-22', 0.3, 12000, 'TT01', 'KHN04', 'NVN07', 'DV03', 'BCN04'), 
('VDN005', '2025-01-22', 12.0, 250000, 'TT09', 'KHN05', 'NVN09', 'DV05', 'BCN05'), 
('VDN006', '2025-01-23', 0.7, 15000, 'TT06', 'KHN06', 'NVN10', 'DV01', 'BCN06'), 
('VDN007', '2025-01-23', 0.2, 10000, 'TT09', 'KHN07', 'NVN12', 'DV06', 'BCN07'), 
('VDN008', '2025-01-24', 2.5, 45000, 'TT08', 'KHN08', 'NVN13', 'DV09', 'BCN08'), 
('VDN009', '2025-01-24', 0.9, 20000, 'TT09', 'KHN09', 'NVN14', 'DV09', 'BCN09'), 
('VDN010', '2025-01-25', 1.5, 30000, 'TT02', 'KHN10', 'NVN02', 'DV11', 'BCN10'), 
('VDN011', '2025-01-25', 5.0, 80000, 'TT03', 'KHN11', 'NVN04', 'DV07', 'BCN11'), 
('VDN012', '2025-01-26', 0.5, 15000, 'TT01', 'KHN12', 'NVN06', 'DV01', 'BCN12'), 
('VDN013', '2025-01-26', 15.0, 1200000, 'TT10', 'KHN13', 'NVN07', 'DV08', 'BCN13'), 
('VDN014', '2025-01-27', 0.4, 25000, 'TT01', 'KHN14', 'NVN09', 'DV12', 'BCN14'), 
('VDN015', '2025-01-27', 2.0, 35000, 'TT01', 'KHN15', 'NVN10', 'DV01', 'BCN15');
GO

INSERT INTO LichTrinh (MaVanDon, ThoiGian, MoTa, MaBC) VALUES 
('VDN001', GETDATE(), N'Giao hàng siêu tốc 2h', 'BCN01'), 
('VDN002', GETDATE(), N'Hàng đang ở kho Thuận An', 'BCN02'), 
('VDN003', GETDATE(), N'Đang chờ phân loại tại Biên Hòa', 'BCN03'), 
('VDN004', GETDATE(), N'Hệ thống đã ghi nhận đơn', 'BCN04'), 
('VDN005', GETDATE(), N'Đang giao hàng cồng kềnh', 'BCN05'), 
('VDN006', GETDATE(), N'Xe tải đang di chuyển về miền Tây', 'BCN06'), 
('VDN007', GETDATE(), N'Đã giao tài liệu thành công', 'BCN07'), 
('VDN008', GETDATE(), N'Shipper đang đi giao tại Cần Thơ', 'BCN08'), 
('VDN009', GETDATE(), N'Hoàn tất thu hộ tiền mặt', 'BCN09'), 
('VDN010', GETDATE(), N'Liên hệ người gửi xác nhận lại', 'BCN10'), 
('VDN011', GETDATE(), N'Đang kiểm tra nhiệt độ hàng đông lạnh', 'BCN11'), 
('VDN012', GETDATE(), N'Đang chờ lấy hàng tại Cà Mau', 'BCN12'), 
('VDN013', GETDATE(), N'Xe máy không thể vận chuyển vì quá xa', 'BCN13'), 
('VDN014', GETDATE(), N'Đã chuẩn bị quà tặng theo yêu cầu', 'BCN14'), 
('VDN015', GETDATE(), N'Hàng về đến bưu cục Tây Ninh', 'BCN15');
GO

INSERT INTO XeVanChuyen VALUES 
('51A-11111', 1500, 'BCN01'), 
('61A-22222', 2000, 'BCN02'), 
('60A-33333', 1200, 'BCN03'), 
('62A-44444', 3000, 'BCN04'), 
('63A-55555', 2500, 'BCN05'), 
('71A-66666', 1800, 'BCN06'), 
('64A-77777', 1500, 'BCN07'), 
('65A-88888', 2200, 'BCN08'), 
('95A-99999', 1000, 'BCN09'), 
('83A-12121', 1500, 'BCN10'), 
('94A-23232', 2000, 'BCN11'), 
('69A-34343', 1200, 'BCN12'), 
('68A-45454', 3500, 'BCN13'), 
('67A-56565', 1500, 'BCN14'), 
('70A-67676', 2000, 'BCN15');
GO