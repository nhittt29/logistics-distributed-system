-- 1. Xóa nếu đã tồn tại Linked Server tới Nam Local
IF EXISTS (SELECT 1 FROM sys.servers WHERE name = 'LS_HUB_NAM_Local')
    EXEC sp_dropserver 'LS_HUB_NAM_Local', 'droplogins';
GO

-- 2. Tạo Linked Server tới HUB NAM Local
-- Lưu ý: Nếu instance Nam của bạn chạy ở port khác (ví dụ 1433 hoặc 1434), hãy sửa lại ở @datasrc
EXEC sp_addlinkedserver
    @server = 'LS_HUB_NAM_Local',
    @srvproduct = '',
    @provider = 'MSOLEDBSQL19',
    @datasrc = 'localhost,1436', -- Thay đổi port 1433 cho phù hợp với instance Nam của bạn
    @provstr = 'TrustServerCertificate=yes;';
GO

-- 3. Cấu hình Login cho máy Nam
EXEC sp_addlinkedsrvlogin
    @rmtsrvname = 'LS_HUB_NAM_Local',
    @useself = 'false',
    @rmtuser = 'sa',
    @rmtpassword = 'test123'; -- Thay bằng mật khẩu sa của instance Miền Nam
GO

-- 4. Bật các tùy chọn truy cập dữ liệu và RPC
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'data access', 'true';
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'rpc', 'true';
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'rpc out', 'true';
GO

-- 5. Test
SELECT name AS DB_MienTrung
FROM [LS_HUB_NAM_Local].master.sys.databases;
GO