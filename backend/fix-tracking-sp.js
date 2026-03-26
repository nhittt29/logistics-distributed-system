const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME, // Gateway Connects to Logistics_MienNam
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function fixTrackingSP() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang sửa lỗi SP usp_TraCuuVanDon tại Gateway Nam ---');
    
    const fixQuery = `
      CREATE OR ALTER PROCEDURE usp_TraCuuVanDon @MaVanDon VARCHAR(20) AS
      BEGIN
          DECLARE @Status NVARCHAR(50), @BC NVARCHAR(100)
          
          -- 1. Check Local (Miền Nam)
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC 
          FROM DonHang dh 
          JOIN BuuCuc bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN TrangThaiDonHang ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon
          
          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Nam' as KhuVuc RETURN END

          -- 2. Check Bắc (Qua Linked Server, JOIN trực tiếp bảng BuuCuc của Miền Bắc)
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC
          FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] dh
          JOIN [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[BuuCuc] bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[TrangThaiDonHang] ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon

          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Bắc' as KhuVuc RETURN END

          -- 3. Check Trung (Qua Linked Server, JOIN trực tiếp bảng BuuCuc của Miền Trung)
          SELECT @Status = ts.TenTrangThai, @BC = bc.TenBC
          FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] dh
          JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[BuuCuc] bc ON dh.MaBC_HienTai = bc.MaBC
          JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[TrangThaiDonHang] ts ON dh.MaTrangThai = ts.MaTrangThai
          WHERE dh.MaVanDon = @MaVanDon

          IF @Status IS NOT NULL BEGIN SELECT @MaVanDon as MaVanDon, @Status as TrangThai, @BC as TenBuuCuc, N'Miền Trung' as KhuVuc RETURN END
          
          -- 4. Not Found
          SELECT NULL as MaVanDon
      END
    `;
    
    await pool.request().query(fixQuery);
    console.log('✅ Cập nhật SP thành công!');

    // Chạy lại test
    console.log('\\n--- Test Tra Cứu MD001 (Nam) ---');
    const test1 = await pool.request().query("EXEC usp_TraCuuVanDon @MaVanDon = 'MD001'");
    console.log(test1.recordset);

    console.log('\\n--- Test Tra Cứu MDB01 (Bắc) ---');
    const test2 = await pool.request().query("EXEC usp_TraCuuVanDon @MaVanDon = 'MDB01'");
    console.log(test2.recordset);

    console.log('\\n--- Test Tra Cứu MDT01 (Trung) ---');
    const test3 = await pool.request().query("EXEC usp_TraCuuVanDon @MaVanDon = 'MDT01'");
    console.log(test3.recordset);

  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

fixTrackingSP();
