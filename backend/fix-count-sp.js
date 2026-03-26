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

async function optimizeCountSP() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang Cập nhật Tối ưu hóa SP Đếm Đơn Thất Bại (Gateway) ---');
    
    const countSQL = `
      CREATE OR ALTER PROCEDURE usp_DemDonThatBai_2025 AS
      BEGIN
          -- Tối ưu hóa: Thay vì Pull data về Gateway để Count, ta dùng OPENQUERY
          -- để Server đầu bên kia tự Count và chỉ trả về 1 dòng số học (Integer).
          DECLARE @Local INT, @Bac INT, @Trung INT 
          
          -- 1. Local Count (Miền Nam)
          SELECT @Local = COUNT(*) FROM DonHang WHERE MaTrangThai = 'FAILED' AND YEAR(NgayGui) = 2025;
          
          -- 2. Remote Count (Miền Bắc) via OPENQUERY
          SELECT @Bac = Cnt FROM OPENQUERY([LS_HUB_BAC_Local], '
              SELECT COUNT(*) as Cnt 
              FROM Logistics_MienBac.dbo.DonHang 
              WHERE MaTrangThai = ''FAILED'' AND YEAR(NgayGui) = 2025
          ');
          
          -- 3. Remote Count (Miền Trung) via OPENQUERY
          SELECT @Trung = Cnt FROM OPENQUERY([LS_HUB_TRUNG_Local], '
              SELECT COUNT(*) as Cnt 
              FROM Logistics_MienTrung.dbo.DonHang 
              WHERE MaTrangThai = ''FAILED'' AND YEAR(NgayGui) = 2025
          ');

          -- 4. Trả về kết quả tổng (1 Record int)
          SELECT (ISNULL(@Local,0) + ISNULL(@Bac,0) + ISNULL(@Trung,0)) as TotalFailed;
      END
    `;
    
    await pool.request().query(countSQL);
    console.log('✅ Cập nhật SP thành công và đã áp dụng Push-down Count (OPENQUERY).');

    console.log('\\n--- Test Dữ liệu Thực tế ---');
    const result = await pool.request().query("EXEC usp_DemDonThatBai_2025");
    console.log('📦 Tổng Đơn hàng Thất Bại (Toàn quốc, 2025):', result.recordset[0].TotalFailed);

  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

optimizeCountSP();
