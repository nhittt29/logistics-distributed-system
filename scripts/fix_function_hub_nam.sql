USE Logistics_MienNam;
GO

--------------------------------------------------
-- CÂU 7: HÀM ĐẾM ĐƠN "GIAO THẤT BẠI" NĂM 2025 (AGGREGATOR)
-- Vị trí: Thực thi tại Hub Miền Nam (Master)
--------------------------------------------------
CREATE OR ALTER FUNCTION fn_DemDonThatBai_2025()
RETURNS INT
AS
BEGIN
    DECLARE @Bac INT = 0, @Trung INT = 0, @Nam INT = 0;

    -- 1. Đếm tại Miền Nam (Local)
    SELECT @Nam = COUNT(*) 
    FROM DonHang d
    JOIN TrangThaiDonHang t ON d.MaTrangThai = t.MaTrangThai
    WHERE t.MaTrangThai = 'TT10' -- Giả định mã 'Giao thất bại' là TT10
      AND YEAR(d.NgayGui) = 2025;

    -- 2. Đếm tại Miền Bắc (Remote LS)
    -- Thủ thuật: Vì Function không cho phép gọi LS trực tiếp một cách linh hoạt,
    -- nhưng trong SQL Server 2012+ hoặc tùy config có thể dùng 4-part name.
    -- Nếu bị lỗi "Remote access not allowed", Master Query sẽ phải dùng OPENQUERY hoặc gọi từ Service.
    -- Tuy nhiên theo đề tài, ta viết Aggregator Function:
    
    SET @Bac = (SELECT ISNULL(COUNT(*), 0) FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] d 
                JOIN [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[TrangThaiDonHang] t ON d.MaTrangThai = t.MaTrangThai
                WHERE t.MaTrangThai = 'TT10' AND YEAR(d.NgayGui) = 2025);

    SET @Trung = (SELECT ISNULL(COUNT(*), 0) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] d 
                  JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[TrangThaiDonHang] t ON d.MaTrangThai = t.MaTrangThai
                  WHERE t.MaTrangThai = 'TT10' AND YEAR(d.NgayGui) = 2025);

    RETURN @Nam + @Bac + @Trung;
END;
GO
