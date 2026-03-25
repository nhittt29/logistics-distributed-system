const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME, // Kết nối qua Gateway Nam
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function createView() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Kết nối Gateway Nam thành công. Bắt đầu tạo View tại Hub Bắc ---');
    
    // Tạo View mới
    const createQuery = `
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
    `;
    await pool.request().query(createQuery);
    console.log('✅ View vw_ShipperMienBac đã được khởi tạo qua Remote Execution thành công!');
    
    // Test View trực tiếp qua Linked Server
    const testRes = await pool.request().query('SELECT TOP 5 * FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[vw_ShipperMienBac]');
    console.log('✅ Dữ liệu test (Top 5):', testRes.recordset);

  } catch (err) {
    console.error('❌ Error executing cross-site view creation:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

createView();
