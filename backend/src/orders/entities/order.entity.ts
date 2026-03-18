import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'DonHang' })
export class Order {
  @PrimaryColumn()
  MaVanDon: string;

  @Column()
  NgayGui: Date;

  @Column('float')
  TrongLuong: number;

  @Column('money')
  CuocPhi: number;

  @Column()
  MaTrangThai: string;

  @Column()
  MaKH_Gui: string;

  @Column()
  MaNV_Giao: string;

  @Column()
  MaDichVu: string;

  @Column()
  MaBC_HienTai: string;
}
