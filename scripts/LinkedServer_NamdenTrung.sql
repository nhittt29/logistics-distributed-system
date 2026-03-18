-- 1. Xóa nếu đã tồn tại
IF EXISTS (SELECT 1 FROM sys.servers WHERE name = 'LS_HUB_TRUNG_Local')
    EXEC sp_dropserver 'LS_HUB_TRUNG_Local', 'droplogins';
GO

-- 2. Tạo Linked Server tới HUB TRUNG (port 1435)
EXEC sp_addlinkedserver
    @server = 'LS_HUB_TRUNG_Local',
    @srvproduct = '',
    @provider = 'MSOLEDBSQL19',
    @datasrc = 'localhost,1435',
    @provstr = 'TrustServerCertificate=yes;';
GO

-- 3. Cấu hình Login
EXEC sp_addlinkedsrvlogin
    @rmtsrvname = 'LS_HUB_TRUNG_Local',
    @useself = 'false',
    @rmtuser = 'sa',
    @rmtpassword = 'test123';
GO

-- 4. Bật RPC
EXEC sp_serveroption 'LS_HUB_TRUNG_Local', 'data access', 'true';
EXEC sp_serveroption 'LS_HUB_TRUNG_Local', 'rpc', 'true';
EXEC sp_serveroption 'LS_HUB_TRUNG_Local', 'rpc out', 'true';
GO

-- 5. Test
SELECT name AS DB_MienTrung
FROM [LS_HUB_TRUNG_Local].master.sys.databases;
GO