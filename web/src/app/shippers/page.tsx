'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { User, DollarSign, Briefcase, MapPin, Search, Wallet, TrendingUp } from 'lucide-react';

export default function ShippersPage() {
  const [maNV, setMaNV] = useState('');
  const [shipper, setShipper] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maNV.trim()) return;

    setLoading(true);
    setError('');
    setShipper(null);

    try {
      // Gọi API xem thu nhập shipper (usp_XemThuNhapShipper)
      const response = await api.get(`/shippers/${maNV}/income`);
      setShipper(response.data);
    } catch (err: any) {
      setError('Không tìm thấy thông tin nhân viên hoặc có lỗi xảy ra.');
      // Mock data for demo
      if (maNV === 'NV001') {
        setShipper({
          MaNV: 'NV001',
          HoTen: 'Nguyễn Văn A',
          ChucVu: 'Shipper',
          MaBC: 'BC-Q1',
          Luong: 12500000,
          Thuong: 1500000,
          Tong: 14000000
        });
        setError('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-900 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black tracking-tight">Thu nhập Shipper</h3>
          <p className="text-slate-500 font-medium mt-1">Tra cứu lương và thưởng của nhân viên giao hàng trên toàn hệ thống.</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-700 font-bold text-sm">
          <TrendingUp size={18} />
          <span>Dữ liệu Hub Miền Nam</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xl shadow-slate-200/40">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={maNV}
              onChange={(e) => setMaNV(e.target.value)}
              placeholder="Nhập mã nhân viên (e.g. NV001)..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-300"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Xem thu nhập'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Shipper Profile Card */}
      {shipper && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-4">
              <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center text-blue-600 border-4 border-white shadow-lg">
                <User size={48} />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight">{shipper.HoTen}</h4>
                <p className="text-blue-600 font-black text-sm uppercase tracking-widest">{shipper.MaNV}</p>
              </div>
              <div className="pt-4 border-t space-y-3">
                <ProfileItem icon={<Briefcase size={16} />} label="Chức vụ" value={shipper.ChucVu} />
                <ProfileItem icon={<MapPin size={16} />} label="Bưu cục" value={shipper.MaBC} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="text-blue-100 font-bold uppercase tracking-[0.2em] text-xs">Tổng thu nhập tháng này</div>
                <div className="text-5xl font-black tracking-tighter">
                  {new Intl.NumberFormat('vi-VN').format(shipper.Tong)} <span className="text-2xl font-bold opacity-80">đ</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Lương cơ bản</div>
                    <div className="text-xl font-black">{new Intl.NumberFormat('vi-VN').format(shipper.Luong)} đ</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Thưởng hiệu suất</div>
                    <div className="text-xl font-black">{new Intl.NumberFormat('vi-VN').format(shipper.Thuong)} đ</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs mb-6">Biểu đồ tăng trưởng (Mô phỏng)</h4>
              <div className="h-48 flex items-end gap-4">
                {[40, 65, 45, 80, 55, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-50 rounded-t-xl relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-600" 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span>Tháng 10</span>
                <span>Tháng 11</span>
                <span>Tháng 12</span>
                <span>Tháng 01</span>
                <span>Tháng 02</span>
                <span>Hiện tại</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-slate-400 font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-black text-slate-700">{value}</span>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
