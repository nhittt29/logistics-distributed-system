KE HOACH XAY DUNG WEB DEMO HE THONG LOGISTICS PHAN TAN

======================================================
KIEN TRUC HE THONG
======================================================

WEB
 │
Hub Nam (Gateway / Tru so)
 │
 ├── Linked Server → Hub Bac
 └── Linked Server → Hub Trung

Nguyen tac:
- Web chi ket noi database Hub Nam
- Hub Nam truy van local hoac thong qua Linked Server

======================================================
1. DASHBOARD HE THONG
======================================================

Muc dich:
- Hien thi tong quan he thong

Thong tin:
- Doanh thu theo mien
- Tong so don hang
- So don giao that bai

Database:
- Thuc thi tai Hub Nam

Nguon du lieu:
- Mien Nam: Hub Nam
- Mien Bac: Linked Server → Hub Bac
- Mien Trung: Linked Server → Hub Trung

======================================================
2. XEM DU LIEU THEO MIEN
======================================================

Cho phep chon:
- Mien Bac
- Mien Trung
- Mien Nam

2.1 Don hang:
- Bac: Hub Nam → Hub Bac
- Trung: Hub Nam → Hub Trung
- Nam: Hub Nam

Hien thi:
- MaVanDon
- NgayGui
- CuocPhi
- TrangThai
- BuuCuc

2.2 Xe van chuyen:
- Bac: Hub Bac
- Trung: Hub Trung
- Nam: Hub Nam

2.3 Lich trinh:
- Bac: Hub Bac
- Trung: Hub Trung
- Nam: Hub Nam

======================================================
3. SHIPPER MIEN BAC
======================================================

Truy van:
- vw_ShipperMienBac

Luong truy van:
Web → Hub Nam → Hub Bac

Hien thi:
- MaNV
- HoTen
- ChucVu
- MaBC

======================================================
4. DON HANG CUOC PHI CAO MIEN TRUNG
======================================================

Dieu kien:
- CuocPhi > 1000000
- Ngay hom nay

Luong truy van:
Web → Hub Nam → Hub Trung

Hien thi:
- MaVanDon
- NgayGui
- CuocPhi
- TrangThai

======================================================
5. TRA CUU VAN DON
======================================================

Nhap:
- MaVanDon

Procedure:
- usp_TraCuuVanDon

Thuc thi tai:
- Hub Nam

Logic:
1. Tim o Hub Nam
2. Neu khong co → Hub Bac
3. Neu khong co → Hub Trung

Hien thi:
- MaVanDon
- TrangThai
- TenBuuCuc
- KhuVuc

======================================================
6. XEM THU NHAP SHIPPER
======================================================

Nhap:
- MaNV

Procedure:
- usp_XemThuNhapShipper

Thuc thi:
- Hub Nam

Du lieu:
- HoTen: cac mien
- Luong: Hub Nam

Hien thi:
- MaNV
- HoTen
- Luong

======================================================
7. THONG KE DOANH THU
======================================================

Thuc thi:
- Hub Nam

Du lieu:
- Hub Nam
- Hub Bac
- Hub Trung

Hien thi:
- Doanh thu tung mien

======================================================
8. XOA DICH VU
======================================================

Thao tac:
- DELETE BangGia

Trigger tai Hub Nam:
- Kiem tra DonHang tat ca mien

Neu co su dung:
- ROLLBACK

Neu khong:
- Xoa

======================================================
9. THONG KE DON THAT BAI 2025
======================================================

Ham:
- fn_DemDonThatBai_2025

Thuc thi:
- Hub Nam

Logic:
- COUNT moi mien
- Cong tong

======================================================
TONG KET
======================================================

- Web chi ket noi Hub Nam
- Hub Nam la Gateway
- Truy van du lieu thong qua Linked Server

Mo hinh nay the hien dung:
- Distributed Database
- Centralized Gateway