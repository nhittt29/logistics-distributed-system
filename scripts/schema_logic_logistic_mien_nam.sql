USE Logistics_MienNam;
GO

--------------------------------------------------
-- CÂU 6: TRIGGER KIỂM TRA XÓA DỊCH VỤ
-- Vị trí: Thực thi tại Trạm Quản Trị (Miền Nam)
-- Nghiệp vụ: Chỉ xóa dịch vụ khi không còn đơn hàng nào sử dụng trên toàn quốc
--------------------------------------------------
CREATE OR ALTER TRIGGER tr_KiemTraXoaDichVu
ON BangGia
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; -- Đảm bảo an toàn, tự động Rollback nếu kết nối mạng lỗi

    DECLARE @MaXoa VARCHAR(10);
    SELECT @MaXoa = MaDichVu FROM deleted;

    -- 1. KIỂM TRA ĐƠN HÀNG TOÀN HỆ THỐNG (3 MIỀN)
    -- Sử dụng UNION ALL để gom dữ liệu từ các Linked Server _LOCAL
    IF EXISTS (
        -- Kiểm tra tại Miền Nam (Cục bộ)
        SELECT 1 FROM DonHang WHERE MaDichVu = @MaXoa
        UNION ALL
        -- Kiểm tra tại Miền Bắc (Qua Linked Server)
        SELECT 1 FROM LS_HUB_BAC_LOCAL.Logistics_MienBac.dbo.DonHang WHERE MaDichVu = @MaXoa
        UNION ALL
        -- Kiểm tra tại Miền Trung (Qua Linked Server)
        SELECT 1 FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.DonHang WHERE MaDichVu = @MaXoa
    )
    BEGIN
        -- Nếu phát hiện đơn hàng đang dùng dịch vụ này ở bất kỳ đâu, thực hiện ROLLBACK [cite: 53]
        RAISERROR (N'Lỗi: Dịch vụ %s đang có đơn hàng sử dụng tại một chi nhánh. Không thể xóa!', 16, 1, @MaXoa);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- 2. THỰC HIỆN XÓA ĐỒNG BỘ NẾU KHÔNG CÒN ĐƠN HÀNG NÀO SỬ DỤNG [cite: 51]
    
    -- Xóa tại bảng giá trạm Miền Bắc
    DELETE FROM LS_HUB_BAC_LOCAL.Logistics_MienBac.dbo.BangGia WHERE MaDichVu = @MaXoa;

    -- Xóa tại bảng giá trạm Miền Trung
    DELETE FROM LS_HUB_TRUNG_LOCAL.Logistics_MienTrung.dbo.BangGia WHERE MaDichVu = @MaXoa;

    -- Xóa tại bảng giá trạm Miền Nam (Cục bộ)
    DELETE FROM BangGia WHERE MaDichVu = @MaXoa;

    PRINT N'Xác nhận: Đã xóa dịch vụ ' + @MaXoa + N' thành công trên toàn hệ thống 3 miền.';
END;
GO

--Trường hợp 1:
-- Thực hiện lệnh xóa dịch vụ đang có đơn hàng sử dụng
DELETE FROM BangGia 
WHERE MaDichVu = 'DV01'; 

-- KIỂM TRA LẠI: Dữ liệu chắc chắn vẫn còn vì Trigger đã ROLLBACK
SELECT * FROM BangGia WHERE MaDichVu = 'DV01';

--Trường hợp 2:
-- Thực hiện lệnh xóa tại Miền Nam
DELETE FROM BangGia WHERE MaDichVu = 'DV16';

-- Sau đó chạy lệnh kiểm tra này để thấy dữ liệu đã mất ở cả 3 nơi:
SELECT MaDichVu, TenDichVu, N'Miền Nam' AS Hub FROM BangGia WHERE MaDichVu = 'DV16'
UNION ALL
SELECT MaDichVu, TenDichVu, N'Miền Bắc' FROM [LS_HUB_BAC_LOCAL].[Logistics_MienBac].[dbo].BangGia WHERE MaDichVu = 'DV16'
UNION ALL
SELECT MaDichVu, TenDichVu, N'Miền Trung' FROM [LS_HUB_TRUNG_LOCAL].[Logistics_MienTrung].[dbo].BangGia WHERE MaDichVu = 'DV16';


-- Replication
-- Cập nhật giá & Thêm dịch vụ mới (Bảng BangGia)

CREATE OR ALTER TRIGGER tr_DongBoBangGia
ON BangGia
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Đồng bộ sang Miền Bắc
    MERGE INTO LS_HUB_BAC.Logistics_MienBac.dbo.BangGia AS Target
    USING inserted AS Source
    ON (Target.MaDichVu = Source.MaDichVu)
    WHEN MATCHED THEN
        UPDATE SET TenDichVu = Source.TenDichVu, 
                   DonGiaNoiMien = Source.DonGiaNoiMien, 
                   DonGiaLienMien = Source.DonGiaLienMien
    WHEN NOT MATCHED THEN
        INSERT (MaDichVu, TenDichVu, DonGiaNoiMien, DonGiaLienMien)
        VALUES (Source.MaDichVu, Source.TenDichVu, Source.DonGiaNoiMien, Source.DonGiaLienMien);

    -- 2. Đồng bộ sang Miền Trung
    MERGE INTO LS_HUB_TRUNG.Logistics_MienTrung.dbo.BangGia AS Target
    USING inserted AS Source
    ON (Target.MaDichVu = Source.MaDichVu)
    WHEN MATCHED THEN
        UPDATE SET TenDichVu = Source.TenDichVu, 
                   DonGiaNoiMien = Source.DonGiaNoiMien, 
                   DonGiaLienMien = Source.DonGiaLienMien
    WHEN NOT MATCHED THEN
        INSERT (MaDichVu, TenDichVu, DonGiaNoiMien, DonGiaLienMien)
        VALUES (Source.MaDichVu, Source.TenDichVu, Source.DonGiaNoiMien, Source.DonGiaLienMien);

    PRINT N'Đã nhân bản dữ liệu bảng giá sang Bắc và Trung thành công.';
END;
GO

INSERT INTO BangGia (MaDichVu, TenDichVu, DonGiaNoiMien, DonGiaLienMien)
VALUES ('DV16', N'Giao hàng bằng Drone', 150000, 300000);
-- Kết quả: DV16 tự xuất hiện ở cả 3 miền.

UPDATE BangGia 
SET DonGiaNoiMien = 18000 -- Tăng giá cước tiêu chuẩn
WHERE MaDichVu = 'DV01';
-- Kết quả: Giá mới tự cập nhật toàn hệ thống.

-- Thay đổi thông tin Bưu cục (Bảng BuuCuc)
CREATE OR ALTER TRIGGER tr_DongBoBuuCuc
ON BuuCuc
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Đồng bộ sang Miền Bắc
    MERGE INTO LS_HUB_BAC.Logistics_MienBac.dbo.BuuCuc AS Target
    USING inserted AS Source
    ON (Target.MaBC = Source.MaBC)
    WHEN MATCHED THEN
        UPDATE SET TenBC = Source.TenBC, DiaChi = Source.DiaChi, MaKhuVuc = Source.MaKhuVuc
    WHEN NOT MATCHED THEN
        INSERT (MaBC, TenBC, DiaChi, MaKhuVuc)
        VALUES (Source.MaBC, Source.TenBC, Source.DiaChi, Source.MaKhuVuc);

    -- Đồng bộ sang Miền Trung
    MERGE INTO LS_HUB_TRUNG.Logistics_MienTrung.dbo.BuuCuc AS Target
    USING inserted AS Source
    ON (Target.MaBC = Source.MaBC)
    WHEN MATCHED THEN
        UPDATE SET TenBC = Source.TenBC, DiaChi = Source.DiaChi, MaKhuVuc = Source.MaKhuVuc
    WHEN NOT MATCHED THEN
        INSERT (MaBC, TenBC, DiaChi, MaKhuVuc)
        VALUES (Source.MaBC, Source.TenBC, Source.DiaChi, Source.MaKhuVuc);
END;
GO

UPDATE BuuCuc 
SET DiaChi = N'Số 1 Lê Duẩn, Quận 1, TP.HCM' 
WHERE MaBC = 'BCN01';
-- Kết quả: Địa chỉ bưu cục trung tâm được đồng bộ.


-- Cấp quyền sysadmin để đảm bảo không bị chặn bởi quyền hạn bảng (Permissions)
ALTER SERVER ROLE [sysadmin] ADD MEMBER [test123];
GO
-- Cho phép Linked Server tham gia vào các giao dịch phân tán
EXEC sp_serveroption 'LS_HUB_BAC', 'remote proc transaction promotion', 'false';
GO

SELECT * FROM [LS_HUB_Trung].[Logistics_MienTrung].[dbo].[BuuCuc]

DELETE FROM [LS_HUB_Trung].[Logistics_MienTrung].[dbo].[BuuCuc]
WHERE MaBC = 'BCTest1';