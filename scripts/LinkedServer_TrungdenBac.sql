-- 1. Xóa nếu đã tồn tại
IF EXISTS (SELECT 1 FROM sys.servers WHERE name = 'LS_HUB_BAC_Local')
    EXEC sp_dropserver 'LS_HUB_BAC_Local', 'droplogins';
GO

-- 2. Tạo Linked Server tới HUB BẮC (Cổng 1440)
EXEC sp_addlinkedserver
    @server = 'LS_HUB_BAC_Local',
    @srvproduct = '',
    @provider = 'MSOLEDBSQL19', 
    @datasrc = 'localhost,1440', 
    @provstr = 'TrustServerCertificate=yes;';
GO

-- 3. Cấu hình tài khoản đăng nhập (sa)
EXEC sp_addlinkedsrvlogin
    @rmtsrvname = 'LS_HUB_BAC_Local',
    @useself = 'false',
    @rmtuser = 'sa',
    @rmtpassword = 'test123';
GO

-- 4. Bật các tùy chọn kết nối và RPC để hỗ trợ gọi Procedure xuyên trạm
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'data access', 'true';
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'rpc', 'true';
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'rpc out', 'true';
GO

-- 5. Kiểm tra thử kết nối đến danh sách Database của Miền Bắc
SELECT name AS [Databases_Mien_Bac_tu_Trung] 
FROM [LS_HUB_BAC_Local].master.sys.databases;
GO