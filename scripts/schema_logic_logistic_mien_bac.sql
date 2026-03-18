-- Truy vấn danh sách database trên Hub Miền Trung thông qua Linked Server LS_HUB_TRUNG
SELECT name 
FROM LS_HUB_TRUNG.master.sys.databases;

-- Kiểm tra mình đang đứng ở server nào?
SELECT @@SERVERNAME;

USE Logistics_MienBac;
GO

--------------------------------------------------
-- CÂU 1: TẠI HUB MIỀN BẮC
-- Tạo View vw_ShipperMienBac
-- Hiển thị Shipper làm việc tại các bưu cục Miền Bắc
--------------------------------------------------
CREATE VIEW vw_ShipperMienBac AS
SELECT MaNV, HoTen, ChucVu, MaBC,
    N'Miền Bắc' AS Mien -- Thêm cột "miền" làm định danh ảo
FROM NhanVien_Phan1
WHERE ChucVu = N'Shipper';
GO

SELECT *
FROM vw_ShipperMienBac

--------------------------------------------------
-- CÂU 3: STORED PROCEDURE usp_TraCuuVanDon
-- Vị trí: Thực thi tại Hub Miền Bắc
--------------------------------------------------
CREATE OR ALTER PROCEDURE usp_TraCuuVanDon
    @MaVanDon VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Tìm tại trạm hiện tại (Miền Bắc - Local)
    IF EXISTS (SELECT 1 FROM DonHang WHERE MaVanDon = @MaVanDon)
    BEGIN
        SELECT 
            d.MaVanDon, 
            t.TenTrangThai, 
            bc.TenBC,
            N'Miền Bắc' AS KhuVucLuuTru
        FROM DonHang d
        JOIN TrangThaiDonHang t ON d.MaTrangThai = t.MaTrangThai
        JOIN BuuCuc bc ON d.MaBC_HienTai = bc.MaBC
        WHERE d.MaVanDon = @MaVanDon;
        RETURN;
    END

    -- 2. Nếu không thấy, kết nối sang Miền Trung qua Linked Server
    IF EXISTS (SELECT 1 FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.DonHang 
               WHERE MaVanDon = @MaVanDon)
    BEGIN
        SELECT 
            d.MaVanDon, 
            t.TenTrangThai, 
            bc.TenBC,
            N'Miền Trung' AS KhuVucLuuTru
        FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.DonHang d
        JOIN LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.TrangThaiDonHang t 
             ON d.MaTrangThai = t.MaTrangThai
        JOIN LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.BuuCuc bc 
             ON d.MaBC_HienTai = bc.MaBC
        WHERE d.MaVanDon = @MaVanDon;
        RETURN;
    END

    -- 3. Nếu không thấy, kết nối sang Miền Nam qua Linked Server
    IF EXISTS (SELECT 1 FROM LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.DonHang 
               WHERE MaVanDon = @MaVanDon)
    BEGIN
        SELECT 
            d.MaVanDon, 
            t.TenTrangThai, 
            bc.TenBC,
            N'Miền Nam' AS KhuVucLuuTru
        FROM LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.DonHang d
        JOIN LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.TrangThaiDonHang t 
             ON d.MaTrangThai = t.MaTrangThai
        JOIN LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.BuuCuc bc 
             ON d.MaBC_HienTai = bc.MaBC
        WHERE d.MaVanDon = @MaVanDon;
        RETURN;
    END

    -- 4. Thông báo nếu không tìm thấy
    PRINT N'Không tìm thấy vận đơn: ' + @MaVanDon;
END;
GO

-- Tra cứu vận đơn VDB001 (Miền Bắc)
EXEC usp_TraCuuVanDon @MaVanDon = 'VDB001';
-- Tra cứu vận đơn VDT001 (Miền Trung)
EXEC usp_TraCuuVanDon @MaVanDon = 'VDT001';
-- Tra cứu vận đơn VDN001 (Miền Nam)
EXEC usp_TraCuuVanDon @MaVanDon = 'VDN001';
-- Tra cứu một mã không có trong hệ thống
EXEC usp_TraCuuVanDon @MaVanDon = 'ABC_12345';

--------------------------------------------------
-- CÂU 4: STORED PROCEDURE usp_XemThuNhapShipper
-- Vị trí: Thực thi tại Hub Miền Bắc hoặc Miền Trung
-- Nghiệp vụ: Kết hợp dữ liệu Local (Họ tên) và Remote (Lương)
--------------------------------------------------
CREATE OR ALTER PROCEDURE usp_XemThuNhapShipper
    @MaNV VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra xem nhân viên có tồn tại trong danh sách quản lý địa phương không
    -- Bảng NhanVien_Phan1 chứa thông tin hoạt động cơ bản [cite: 24]
    IF NOT EXISTS (SELECT 1 FROM NhanVien_Phan1 WHERE MaNV = @MaNV)
    BEGIN
        PRINT N'Nhân viên ' + @MaNV + N' không thuộc quản lý của khu vực này.';
        RETURN;
    END

    -- 2. Truy vấn kết hợp (JOIN) dữ liệu Local và Remote (Miền Nam)
    -- nv: Bảng NhanVien_Phan1 tại chỗ (Bắc hoặc Trung) [cite: 24]
    -- p2: Bảng NhanVien_Phan2 chứa thông tin mật (Lương) tại Miền Nam [cite: 25]
    SELECT 
        nv.MaNV, 
        nv.HoTen, 
        p2.Luong
    FROM NhanVien_Phan1 nv
    INNER JOIN LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.NhanVien_Phan2 p2
        ON nv.MaNV = p2.MaNV
    WHERE nv.MaNV = @MaNV;

    -- 3. Thông báo nếu tìm thấy tên nhưng không thấy bảng lương ở Miền Nam
    IF @@ROWCOUNT = 0
    BEGIN
        PRINT N'Tìm thấy nhân viên nhưng không có dữ liệu lương tại hệ thống Miền Nam.';
    END
END;
GO

-- Tra cứu thu nhập của nhân viên
EXEC usp_XemThuNhapShipper @MaNV = 'NVB01';

-- Nếu bạn đang ở Hub Bắc và tra cứu một mã không có trong bảng NhanVien_Phan1 địa phương
EXEC usp_XemThuNhapShipper @MaNV = 'NV_GIA_DINH';

--------------------------------------------------
-- CÂU 5: QUERY THỐNG KÊ DOANH THU TOÀN HỆ THỐNG
--------------------------------------------------
SELECT N'Miền Bắc' AS KhuVuc, ISNULL(SUM(CuocPhi), 0) AS TongDoanhThu
FROM DonHang -- Dữ liệu tại chỗ

UNION ALL

SELECT N'Miền Trung', ISNULL(SUM(CuocPhi), 0)
FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.DonHang -- Qua Linked Server Miền Trung

UNION ALL

SELECT N'Miền Nam', ISNULL(SUM(CuocPhi), 0)
FROM LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.DonHang; -- Qua Linked Server Miền Nam
GO

--------------------------------------------------
-- CÂU 7: HÀM ĐẾM ĐƠN "GIAO THẤT BẠI" NĂM 2025
--------------------------------------------------
CREATE OR ALTER FUNCTION fn_DemDonThatBai_2025()
RETURNS INT
AS
BEGIN
    DECLARE @Bac INT = 0, @Trung INT = 0, @Nam INT = 0;

    -- 1. Đếm tại Miền Bắc (Xử lý tại chỗ nếu đang đứng ở trạm Bắc)
    SELECT @Bac = COUNT(*) 
    FROM DonHang d
    JOIN TrangThaiDonHang t ON d.MaTrangThai = t.MaTrangThai
    WHERE t.MaTrangThai = 'TT10' -- Mã trạng thái 'Giao hàng thất bại'
      AND d.NgayGui BETWEEN '2025-01-01' AND '2025-12-31';

    -- 2. Đếm tại Miền Trung (Gửi lệnh COUNT qua LS_HUB_TRUNG_LOCAL)
    -- Tối ưu: Chỉ nhận về 1 con số kết quả qua mạng
    SELECT @Trung = (
        SELECT COUNT(*) 
        FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.DonHang d
        JOIN LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.TrangThaiDonHang t 
             ON d.MaTrangThai = t.MaTrangThai
        WHERE t.MaTrangThai = 'TT10'
          AND d.NgayGui BETWEEN '2025-01-01' AND '2025-12-31'
    );

    -- 3. Đếm tại Miền Nam (Gửi lệnh COUNT qua LS_HUB_NAM_LOCAL)
    -- Tối ưu: Chỉ nhận về 1 con số kết quả qua mạng
    SELECT @Nam = (
        SELECT COUNT(*) 
        FROM LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.DonHang d
        JOIN LS_HUB_NAM_LOCAL.Logistics_MienNam.dbo.TrangThaiDonHang t 
             ON d.MaTrangThai = t.MaTrangThai
        WHERE t.MaTrangThai = 'TT10'
          AND d.NgayGui BETWEEN '2025-01-01' AND '2025-12-31'
    );

    -- Trả về tổng số lượng cộng dồn từ 3 trạm
    RETURN ISNULL(@Bac, 0) + ISNULL(@Trung, 0) + ISNULL(@Nam, 0);
END;
GO

-- Chạy hàm để xem tổng số đơn hàng thất bại toàn quốc trong năm 2025
SELECT dbo.fn_DemDonThatBai_2025() AS TongDonThatBai_2025;


