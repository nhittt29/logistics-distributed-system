'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  User, 
  Wallet, 
  MapPin, 
  Search, 
  AlertCircle,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Sparkles,
  Activity
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
      if(response.data) {
        setShipper(response.data);
      } else {
        setError('Không tìm thấy dữ liệu thu nhập cho nhân viên này.');
      }
    } catch (err: any) {
      setError('Mã nhân viên không tồn tại hoặc lỗi SQL Gateway Nam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 text-slate-800 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck size={14} /> Hệ thống Phân tán (Đề tài 4)
          </div>
          <h1 className="text-5xl lg:text-6xl font-manrope font-black tracking-tighter text-slate-900 drop-shadow-sm">
            Quản lý Nhân sự
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">
            Giám sát vận hành nhân sự liên vùng và an toàn bảo mật thu nhập thông qua <span className="text-slate-900 font-bold">SQL Gateway</span> trung tâm.
          </p>
        </div>
        
        {/* Main Tab Navigation */}
        <div className="flex bg-white/60 backdrop-blur-md p-2 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20">
          <button 
            onClick={() => setActiveTab('shippers')}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold rounded-[1.5rem] transition-all duration-300 ${activeTab === 'shippers' ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 scale-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 scale-95'}`}
          >
            <Users size={18} /> Danh sách Shipper
          </button>
          <button 
            onClick={() => setActiveTab('income')}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-bold rounded-[1.5rem] transition-all duration-300 ${activeTab === 'income' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 scale-95'}`}
          >
            <Wallet size={18} /> Tra cứu Thu nhập
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'shippers' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Region Selector - Floating Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] border border-slate-200/60 shadow-2xl shadow-slate-200/40 w-fit mx-auto sticky top-4 z-50">
            {['BAC', 'TRUNG', 'NAM'].map((r) => {
              const isActive = region === r;
              return (
                <button 
                  key={r}
                  onClick={() => setRegion(r as any)}
                  className={`relative flex items-center gap-2 px-8 py-3.5 text-xs font-black rounded-2xl transition-all duration-500 overflow-hidden group
                    ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${r === 'BAC' ? 'from-indigo-500 to-purple-600' : r === 'TRUNG' ? 'from-amber-500 to-orange-600' : 'from-blue-500 to-cyan-600'} opacity-100`}></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2 tracking-wider">
                    {r === 'BAC' && isActive && <Sparkles size={14} className="animate-pulse" />}
                    HUB {r === 'BAC' ? 'MIỀN BẮC' : r === 'TRUNG' ? 'MIỀN TRUNG' : 'MIỀN NAM'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Region Hero Banner */}
          <div className={`relative overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl transition-all duration-700
            ${region === 'BAC' ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900' : 
              region === 'TRUNG' ? 'bg-gradient-to-br from-orange-900 via-amber-900 to-slate-900' : 
              'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
              <Activity size={300} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  {region === 'BAC' ? 'Remote View Execution' : 'Direct Table Query'}
                </div>
                <h2 className="text-4xl md:text-5xl font-manrope font-black tracking-tight">
                  {region === 'BAC' ? 'Dữ liệu Bưu cục & Nhân sự Bắc' : `Nhân sự Hub Miền ${region === 'TRUNG' ? 'Trung' : 'Nam'}`}
                </h2>
                <p className="text-white/70 max-w-2xl font-medium text-lg">
                  {region === 'BAC' 
                    ? 'Hiển thị dữ liệu được ánh xạ qua VIEW vw_ShipperMienBac. Kết nối chi tiết Địa chỉ và Tên Bưu cục từ 2 bảng khác nhau.'
                    : 'Danh sách nhân sự được truy xuất trực tiếp từ các Table tương ứng tại node vệ tinh.'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[180px]">
                <div className="text-5xl font-black">{shippers.length}</div>
                <div className="text-xs uppercase tracking-widest text-white/50 font-bold mt-2">Tổng nhân sự</div>
              </div>
            </div>
          </div>

          {/* Data Display */}
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="font-bold text-sm text-slate-400 uppercase tracking-widest animate-pulse">Đang định tuyến query...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shippers.map((s, idx) => (
                <div 
                  key={s.MaNV} 
                  className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-indigo-500 transition-all duration-500"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <User size={28} strokeWidth={2.5} />
                    </div>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      ID: {s.MaNV}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{s.HoTen}</h3>
                  
                  <div className="flex items-center gap-2 mb-6 text-sm">
                    <BriefcaseBusiness size={16} className="text-slate-400" />
                    <span className="font-bold text-slate-600">{s.ChucVu}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-slate-100 mb-6"></div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Bưu Cục</div>
                        <div className="font-bold text-slate-800 tracking-tight">
                          {region === 'BAC' ? s.TenBC : s.MaBC}
                        </div>
                      </div>
                    </div>

                    {region === 'BAC' && (
                      <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <MapPin size={18} className="text-indigo-500 mt-0.5" />
                        <div>
                          <div className="text-[10px] uppercase font-black tracking-widest text-indigo-400/80 mb-1">Địa Chỉ Chi Tiết</div>
                          <div className="font-bold text-indigo-900 text-sm">
                            {s.DiaChi}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {shippers.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <User size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-black text-slate-500">Không có dữ liệu nhân sự</h3>
                  <p className="text-slate-400 mt-2">Vui lòng kiểm tra lại kết nối đến Hub {region}.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Income Tab - Refined Premium Design */
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-8 duration-500">
          <section className="bg-white p-3 rounded-[3rem] border border-slate-200/60 shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50"></div>
            <form onSubmit={handleSearchIncome} className="relative z-10 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors" size={28} />
                <input 
                  type="text" 
                  value={maNV}
                  onChange={(e) => setMaNV(e.target.value)}
                  placeholder="Nhập ID Nhân viên (VD: NVB01)..." 
                  className="w-full pl-20 pr-8 py-8 bg-white/80 backdrop-blur-sm border-2 border-transparent focus:border-emerald-200 rounded-[2.5rem] text-xl md:text-2xl font-black placeholder:text-slate-300 text-slate-800 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !maNV}
                className="px-12 py-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Tra cứu <ChevronRight size={20} /></>
                )}
              </button>
            </form>
          </section>

          {error && (
            <div className="p-8 bg-red-50/80 backdrop-blur-md border border-red-100 rounded-[2.5rem] flex items-center gap-4 text-red-600 font-black shadow-lg animate-in zoom-in-95">
              <AlertCircle size={28}/> {error}
            </div>
          )}

          {shipper && (
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">Kết quả tra cứu thu nhập</h3>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Dữ liệu lấy từ hệ thống trung tâm</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">
                      <th className="px-8 py-5">Mã NV</th>
                      <th className="px-8 py-5">Họ Tên</th>
                      {shipper.MaBC && <th className="px-8 py-5">Đơn vị (Mã BC)</th>}
                      <th className="px-8 py-5 text-right">Tổng Lương</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-black tracking-wider">
                          {shipper.MaNV}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900 text-base">{shipper.HoTen}</td>
                      {shipper.MaBC && (
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center gap-2 font-bold text-slate-600 text-sm">
                            <Building2 size={16} className="text-slate-400" /> {shipper.MaBC}
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-6 font-black text-emerald-600 text-right text-xl tracking-tight">
                        {new Intl.NumberFormat('vi-VN').format(shipper.Luong)} <span className="text-xs text-emerald-500 font-bold ml-1">VNĐ</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
