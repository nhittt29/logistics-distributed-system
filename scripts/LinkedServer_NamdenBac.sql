-- 1. Xóa nếu đã tồn tại
IF EXISTS (SELECT 1 FROM sys.servers WHERE name = 'LS_HUB_BAC_Local')
    EXEC sp_dropserver 'LS_HUB_BAC_Local', 'droplogins';
GO

-- 2. Tạo Linked Server tới HUB BẮC (port 1440)
EXEC sp_addlinkedserver
    @server = 'LS_HUB_BAC_Local',
    @srvproduct = '',
    @provider = 'MSOLEDBSQL19',
    @datasrc = 'tcp:localhost,1440',
    @provstr = 'TrustServerCertificate=yes;';
GO

-- 3. Login
EXEC sp_addlinkedsrvlogin
    @rmtsrvname = 'LS_HUB_BAC_Local',
    @useself = 'false',
    @rmtuser = 'sa',
    @rmtpassword = 'test123';
GO

-- 4. Options
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'data access', 'true';
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'rpc', 'true';
EXEC sp_serveroption 'LS_HUB_BAC_Local', 'rpc out', 'true';
GO

-- 5. Test
SELECT name AS [Databases_HUB_BAC] FROM [LS_HUB_BAC_Local].master.sys.databases;
GO