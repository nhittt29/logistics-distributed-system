const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME, // Logistics_MienNam
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const sqlScripts = [
  // 1. View Shipper Miền Bắc (Execute AT Hub Bac)
  {
    name: 'View Shipper Miền Bắc (Hub Bac)',
    query: `
      EXEC ('
        USE Logistics_MienBac;
        EXEC (''
            CREATE OR ALTER VIEW vw_ShipperMienBac AS
            SELECT 
                nv.MaNV, 
                nv.HoTen, 
                nv.ChucVu, 
                bc.TenBC,
                bc.DiaChi
            FROM Logistics_MienBac.dbo.NhanVien_Phan1 nv
            JOIN Logistics_MienBac.dbo.BuuCuc bc ON nv.MaBC = bc.MaBC
            WHERE nv.ChucVu = N''''Shipper''''
        '')
      ') AT [LS_HUB_BAC_Local];
    `
  },
  // 2. SP Tra cứu vận đơn (Gateway Nam)
  {
    name: 'SP Tra cứu vận đơn (Gateway Nam)',
    query: `
      CREATE OR ALTER PROCEDURE usp_TraCuuVanDon @MaVanDon VARCHAR(20) AS
      BEGIN
          DECLARE @Status NVARCHAR(50), @BC NVARCHAR(100)
          
          -- Check Local (Nam)
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC 
          FROM DonHang dh 
          JOIN BuuCuc bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN TrangThaiDonHang ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon
          
          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Nam' as KhuVuc RETURN END

          -- Check Bac via LS
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC
          FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] dh
          JOIN BuuCuc bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN TrangThaiDonHang ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon

          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Bắc' as KhuVuc RETURN END

          -- Check Trung via LS
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC
          FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] dh
          JOIN BuuCuc bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN TrangThaiDonHang ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon

          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Trung' as KhuVuc RETURN END
          
          SELECT NULL as MaVanDon
      END
    `
  },
  // 3. Trigger kiểm tra xóa dịch vụ (Gateway Nam)
  {
    name: 'Trigger xóa dịch vụ (Gateway Nam)',
    query: `
      CREATE OR ALTER TRIGGER trg_CheckDeleteService ON BangGia INSTEAD OF DELETE AS
      BEGIN
          DECLARE @Ma VARCHAR(20)
          SELECT @Ma = MaDichVu FROM deleted
          
          IF EXISTS (SELECT 1 FROM DonHang WHERE MaDichVu = @Ma) OR
             EXISTS (SELECT 1 FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] WHERE MaDichVu = @Ma) OR
             EXISTS (SELECT 1 FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] WHERE MaDichVu = @Ma)
          BEGIN
              RAISERROR(N'Không thể xóa: Dịch vụ đang được sử dụng bởi các đơn hàng trong hệ thống.', 16, 1)
              ROLLBACK TRANSACTION
          END
          ELSE
          BEGIN
              DELETE FROM BangGia WHERE MaDichVu = @Ma
          END
      END
    `
  },
  // 4. SP Thống kê Shipper Thu nhập (Gateway Nam - Đã có nhưng cập nhật chuẩn)
  {
    name: 'SP Xem thu nhập Shipper (Gateway Nam)',
    query: `
      CREATE OR ALTER PROCEDURE usp_XemThuNhapShipper @MaNV VARCHAR(10) AS
      BEGIN
          SET NOCOUNT ON;
          IF @MaNV LIKE 'NVB%'
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[NhanVien_Phan1] p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
          ELSE IF @MaNV LIKE 'NVT%'
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[NhanVien_Phan1] p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
          ELSE
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN NhanVien_Phan1 p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
      END
    `
  },
  // 5. Thống kê doanh thu 3 miền (Gateway Nam)
  {
    name: 'SP Thống kê doanh thu (Gateway Nam)',
    query: `
      CREATE OR ALTER PROCEDURE usp_ThongKeDoanhThu AS
      BEGIN
          DECLARE @r1 DECIMAL(18,2), @r2 DECIMAL(18,2), @r3 DECIMAL(18,2)
          SELECT @r1 = SUM(CuocPhi) FROM DonHang
          SELECT @r2 = SUM(CuocPhi) FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]
          SELECT @r3 = SUM(CuocPhi) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
          SELECT ISNULL(@r1,0) as Nam, ISNULL(@r2,0) as Bac, ISNULL(@r3,0) as Trung
      END
    `
  },
  // 6. Đếm đơn hàng thất bại 2025 (Gateway Nam)
  {
    name: 'SP Đếm đơn thất bại 2025 (Gateway Nam)',
    query: `
      CREATE OR ALTER PROCEDURE usp_DemDonThatBai_2025 AS
      BEGIN
          DECLARE @c1 INT, @c2 INT, @c3 INT
          SELECT @c1 = COUNT(*) FROM DonHang WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025
          SELECT @c2 = COUNT(*) FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025
          SELECT @c3 = COUNT(*) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025
          SELECT ISNULL(@c1,0) + ISNULL(@c2,0) + ISNULL(@c3,0) as TotalFailed
      END
    `
  }
];

async function deploy() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang triển khai SQL Requirements ---');
    
    for (const script of sqlScripts) {
      try {
        await pool.request().query(script.query);
        console.log(`✅ OK: ${script.name}`);
      } catch (e) {
        console.error(`❌ Lỗi [${script.name}]:`, e.message);
      }
    }

  } catch (err) {
    console.error('❌ Lỗi kết nối:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

deploy();
