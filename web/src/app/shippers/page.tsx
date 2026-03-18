'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  User, 
  Wallet, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Search, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

export default function ShippersPage() {
  const [activeTab, setActiveTab] = useState<'shippers' | 'income'>('shippers');
  const [region, setRegion] = useState<'BAC' | 'TRUNG' | 'NAM'>('BAC');
  const [maNV, setMaNV] = useState('');
  const [shipper, setShipper] = useState<any>(null);
  const [shippers, setShippers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchShippers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/shippers', { params: { region } });
      setShippers(response.data);
    } catch (err) {
      setError(`Lỗi kết nối Hub ${region}.`);
      setShippers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'shippers') fetchShippers();
  }, [activeTab, region]);

  const handleSearchIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maNV.trim()) return;
    setLoading(true);
    setError('');
    setShipper(null);
    try {
      const response = await api.get(`/shippers/${maNV}/income`);
      setShipper(response.data);
    } catch (err: any) {
      setError('Mã nhân viên không tồn tại hoặc lỗi SQL Gateway Nam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h3 className="text-5xl font-manrope font-black tracking-tighter text-slate-900">Quản lý Nhân sự</h3>
          <p className="text-slate-800 font-extrabold mt-2 uppercase tracking-widest text-[10px]">Nghiệp vụ phân tán & bảo mật dữ liệu nhạy cảm (Đề tài 4).</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border-2 border-white shadow-xl">
          <button 
            onClick={() => setActiveTab('shippers')}
            className={`px-10 py-3.5 text-xs font-black rounded-2xl transition-all ${activeTab === 'shippers' ? 'bg-midnight-purple text-white shadow-lg' : 'text-slate-500 hover:text-midnight-purple'}`}
          >
            Danh sách Shipper
          </button>
          <button 
            onClick={() => setActiveTab('income')}
            className={`px-10 py-3.5 text-xs font-black rounded-2xl transition-all ${activeTab === 'income' ? 'bg-midnight-purple text-white shadow-lg' : 'text-slate-500 hover:text-midnight-purple'}`}
          >
            Tra cứu Thu nhập (Req 4)
          </button>
        </div>
      </div>

      {activeTab === 'shippers' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border-2 border-white shadow-xl w-fit">
            {['BAC', 'TRUNG', 'NAM'].map((r) => (
              <button 
                key={r}
                onClick={() => setRegion(r as any)}
                className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all duration-300 ${region === r ? 'bg-midnight-purple text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
               HUB {r === 'BAC' ? 'MIỀN BẮC (View)' : r === 'TRUNG' ? 'MIỀN TRUNG' : 'MIỀN NAM'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
              <div className="space-y-1">
                <h4 className="font-manrope font-black text-2xl tracking-tight text-slate-900">
                  {region === 'BAC' ? 'View: vw_ShipperMienBac (Yêu cầu 1)' : `Nhân sự Hub ${region}`}
                </h4>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-lg w-fit mt-2">
                  {region === 'BAC' ? 'Security: Local Activity View' : 'General staff database'}
                </p>
              </div>
              <Users size={32} className="text-slate-200" />
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-32 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-black text-[10px] text-slate-800 uppercase tracking-widest">Đang quét Site {region}...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-800 border-b-2 border-slate-100 bg-slate-50/50">
                      <th className="px-12 py-8">Mã nhân viên</th>
                      <th className="px-12 py-8">Họ Tên</th>
                      <th className="px-12 py-8">Chức Vụ</th>
                      <th className="px-12 py-8">Mã Bưu Cục</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shippers.map((s) => (
                      <tr key={s.MaNV} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                        <td className="px-12 py-6 font-black text-midnight-purple-light">{s.MaNV}</td>
                        <td className="px-12 py-6 font-black text-slate-900">{s.HoTen}</td>
                        <td className="px-12 py-6">
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {s.ChucVu}
                          </span>
                        </td>
                        <td className="px-12 py-6 font-black text-slate-800">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-midnight-purple" /> {s.MaBC}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
          <section className="bg-white p-2 rounded-[3rem] border-2 border-slate-50 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
              <ShieldCheck size={200} />
            </div>
            <form onSubmit={handleSearchIncome} className="relative z-10 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={28} />
                <input 
                  type="text" 
                  value={maNV}
                  onChange={(e) => setMaNV(e.target.value)}
                  placeholder="Nhập ID NV (VD: NVB01, NVB02)..." 
                  className="w-full pl-22 pr-8 py-8 bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white rounded-[2.5rem] text-2xl font-black placeholder:text-slate-200 transition-all focus:outline-none"
                />
              </div>
              <button type="submit" className="px-12 py-8 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
                {loading ? 'Đang gọi SP...' : 'Xem Thu Nhập'}
              </button>
            </form>
          </section>

          {error && (
            <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 font-black animate-shake">
              <AlertCircle size={28}/> {error}
            </div>
          )}

          {shipper && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in-95 duration-500">
              <div className="lg:col-span-1 bg-white p-12 rounded-[3.5rem] border-2 border-slate-50 shadow-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-midnight-purple rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl rotate-3">
                  <User size={48} />
                </div>
                <div>
                  <h4 className="text-3xl font-black tracking-tighter">{shipper.HoTen}</h4>
                  <p className="text-primary font-black text-xs uppercase tracking-[0.4em] mt-2">{shipper.MaNV}</p>
                </div>
                <div className="pt-8 border-t border-slate-50 text-left space-y-6">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="font-bold text-slate-400 text-xs uppercase tracking-widest text-[10px]">Đơn vị (BC):</span>
                    <span className="font-black text-slate-900">{shipper.MaBC || 'Hub Trung Tâm'}</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-12 text-white/5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Wallet size={350} />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 font-bold">
                       $
                    </div>
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Secure Transaction Hash: LS_NAM_P2</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-emerald-400 tracking-[0.3em]">Thu nhập thực nhận</p>
                    <h2 className="text-8xl font-manrope font-black tracking-tighter text-white">
                      {new Intl.NumberFormat('vi-VN').format(shipper.Luong)}
                      <span className="text-2xl text-white/30 ml-6 font-bold uppercase tracking-widest">VNĐ</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10">
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                      <div className="text-[10px] uppercase text-white/40 mb-2 font-black tracking-widest">Base Salary</div>
                      <div className="text-3xl font-black text-white">{new Intl.NumberFormat('vi-VN').format(shipper.Luong)} đ</div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                        <div className="text-[10px] uppercase text-white/40 mb-2 font-black tracking-widest">Commission (LS)</div>
                        <div className="text-3xl font-black text-emerald-400">03.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
