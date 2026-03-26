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

async function createTrigger() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang khởi tạo Trigger tr_KiemTraXoaDichVu tại Trạm Quản trị (Gateway) ---');
    
    // The exact SQL defined in our plan
    const triggerSQL = `
      CREATE OR ALTER TRIGGER tr_KiemTraXoaDichVu
      ON BangGia
      INSTEAD OF DELETE
      AS
      BEGIN
          DECLARE @Count int = 0;
          DECLARE @MaDV varchar(20);
          
          SELECT @MaDV = MaDichVu FROM deleted;

          -- 1. Check Gateway (Local)
          DECLARE @LocalCount int;
          SELECT @LocalCount = COUNT(*) FROM DonHang WHERE MaDichVu = @MaDV;
          SET @Count = @Count + @LocalCount;

          -- 2. Check Miền Bắc (Remote)
          DECLARE @BacCount int;
          SELECT @BacCount = COUNT(*) FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang] WHERE MaDichVu = @MaDV;
          SET @Count = @Count + @BacCount;

          -- 3. Check Miền Trung (Remote)
          DECLARE @TrungCount int;
          SELECT @TrungCount = COUNT(*) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] WHERE MaDichVu = @MaDV;
          SET @Count = @Count + @TrungCount;

          IF @Count > 0
          BEGIN
              RAISERROR (N'Không thể xóa Dịch vụ này vì hiện đang có %d Đơn hàng trên toàn hệ thống sử dụng!', 16, 1, @Count);
              ROLLBACK TRANSACTION;
              RETURN;
          END

          -- If safe to delete:
          DELETE FROM BangGia WHERE MaDichVu = @MaDV;
      END
    `;
    
    await pool.request().query(triggerSQL);
    console.log('✅ Đã nạp thành công Trigger vào Cơ sở dữ liệu.');

    console.log('\\n--- Test Xóa Dịch vụ đang được sử dụng (DV01) ---');
    try {
      await pool.request().query("DELETE FROM BangGia WHERE MaDichVu = 'DV01'");
      console.log('⚠️ Dịch vụ đã bị xóa (Lỗi: Lẽ ra không được xóa vì có đơn hàng).');
    } catch (testErr) {
      console.log('🔒 Kết quả Test (Thành công chặn xóa):', testErr.message);
    }

  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

createTrigger();
