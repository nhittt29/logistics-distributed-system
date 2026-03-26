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

async function updateDates() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang cập nhật ngày gửi cho Đơn hàng cước phí cao Miền Trung thành Hôm nay ---');
    
    // Update the high-fee orders in Mien Trung to have today's date
    const query = `
      UPDATE [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
      SET NgayGui = GETDATE()
      WHERE CuocPhi > 1000000;
    `;
    const result = await pool.request().query(query);
    console.log(`✅ Đã cập nhật ${result.rowsAffected} đơn hàng về GETDATE() (Hôm nay).`);

    const result2 = await pool.request().query("SELECT TOP 5 MaVanDon, NgayGui, CuocPhi FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] WHERE CuocPhi > 1000000");
    console.log('--- Dữ liệu sau khi cập nhật ---');
    console.log(result2.recordset);

  } catch (err) {
    console.error('SQL Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

updateDates();
