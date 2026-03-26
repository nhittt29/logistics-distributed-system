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

async function check() {
  let pool;
  try {
    pool = await mssql.connect(config);
    // Let's create the function exactly as in the user's screenshot, but on the GATEWAY NAM
    const q = `
      CREATE OR ALTER FUNCTION fn_DemDonThatBai_2025()
      RETURNS INT
      AS
      BEGIN
          DECLARE @Bac INT = 0, @Trung INT = 0, @Nam INT = 0;
          
          -- "Gửi lệnh đếm (COUNT) xuống từng Trạm để thực hiện tại chỗ, trạm hiện tại chỉ nhận về các con số kết quả và cộng lại"
          -- Without OPENQUERY, SQL Server actually DOES push down simple COUNT(*) queries IF there are no complex local joins.
          -- Let's test standard 4-part name for push-down.
          SELECT @Nam = (SELECT COUNT(*) FROM DonHang WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025);
          SELECT @Bac = (SELECT COUNT(*) FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025);
          SELECT @Trung = (SELECT COUNT(*) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025);
          
          RETURN ISNULL(@Nam,0) + ISNULL(@Bac,0) + ISNULL(@Trung,0);
      END
    `;
    await pool.request().query(q);
    console.log("OK FUNCTION CREATED");
    
    const r = await pool.request().query("SELECT dbo.fn_DemDonThatBai_2025() as res");
    console.log("RESULT", r.recordset[0].res);

  } catch(e) {
    console.error(e.message);
  } finally {
    if(pool) await pool.close();
  }
}
check();
