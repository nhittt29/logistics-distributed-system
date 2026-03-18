USE Logistics_MienTrung;
GO

--------------------------------------------------
-- CÂU 2: TẠI HUB MIỀN TRUNG
-- Tìm đơn hàng có cước phí > 1.000.000
-- và đang nằm tại kho Miền Trung hôm nay
--------------------------------------------------
SELECT *
FROM DonHang
WHERE CuocPhi > 1000000
  AND CAST(NgayGui AS DATE) = CAST(GETDATE() AS DATE);
GO
