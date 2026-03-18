-- 1. Xóa nếu đã tồn tại
IF EXISTS (SELECT 1 FROM sys.servers WHERE name = 'LS_HUB_NAM_Local')
    EXEC sp_dropserver 'LS_HUB_NAM_Local', 'droplogins';
GO

-- 2. Tạo Linked Server Miền Nam với Port 1436
EXEC sp_addlinkedserver
    @server = 'LS_HUB_NAM_Local',
    @srvproduct = '',
    @provider = 'MSOLEDBSQL19', 
    @datasrc = 'localhost,1436', 
    @provstr = 'TrustServerCertificate=yes;';
GO

-- 3. Cấu hình tài khoản đăng nhập (sa)
EXEC sp_addlinkedsrvlogin
    @rmtsrvname = 'LS_HUB_NAM_Local',
    @useself = 'false',
    @rmtuser = 'sa',
    @rmtpassword = 'test123';
GO

-- 4. Bật các tùy chọn kết nối và gọi thủ tục (RPC)
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'data access', 'true';
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'rpc', 'true';
EXEC sp_serveroption 'LS_HUB_NAM_Local', 'rpc out', 'true';
GO

-- 5. Kiểm tra thử kết nối
SELECT name AS [Databases_Mien_Nam] FROM [LS_HUB_NAM_Local].master.sys.databases;