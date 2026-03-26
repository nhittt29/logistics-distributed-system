const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function fixStatsSP() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang cập nhật SP usp_ThongKeDoanhThu tại Gateway Nam ---');
    
    const fixQuery = `
      CREATE OR ALTER PROCEDURE usp_ThongKeDoanhThu AS
      BEGIN
          SELECT N'Miền Nam' as KhuVuc, ISNULL(SUM(CAST(CuocPhi AS BIGINT)), 0) as DoanhThu FROM DonHang
          UNION ALL
          SELECT N'Miền Bắc' as KhuVuc, ISNULL(SUM(CAST(CuocPhi AS BIGINT)), 0) as DoanhThu FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]
          UNION ALL
          SELECT N'Miền Trung' as KhuVuc, ISNULL(SUM(CAST(CuocPhi AS BIGINT)), 0) as DoanhThu FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
      END
    `;
    
    await pool.request().query(fixQuery);
    console.log('✅ Cập nhật SP Thống kê Doanh thu thành công!');

    console.log('\\n--- Test Dữ liệu SP Mới ---');
    const testResult = await pool.request().query("EXEC usp_ThongKeDoanhThu");
    console.log(testResult.recordset);

  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

fixStatsSP();
