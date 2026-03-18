'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  TrendingUp, 
  Package, 
  AlertCircle, 
  ChevronRight, 
  BarChart3, 
  Globe, 
  Zap, 
  Activity,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/shippers/stats');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400 animate-pulse">Đang đồng bộ dữ liệu toàn quốc...</p>
        </div>
      </div>
    );
  }

  const revenues = stats?.revenues || [];
  const totalRev = revenues.reduce((acc: any, cur: any) => acc + cur.DoanhThu, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Operational Hub Overview */}
      <section className="relative overflow-hidden bg-midnight-purple text-white p-12 rounded-[3.5rem] shadow-2xl">
        <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
          <Activity size={300} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full border border-white/15 text-[10px] font-black uppercase tracking-[0.3em] leading-none">
            <Zap size={14} className="text-emerald-400 animate-pulse" />
            <span>Hệ thống Quản trị Phân tán v2.4</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <h1 className="text-6xl font-manrope font-black tracking-tighter leading-none">
                Trung tâm <br/><span className="text-starlight-gold">Điều hành Toàn quốc</span>
              </h1>
              <p className="text-lg text-white/60 font-bold max-w-md">
                Theo dõi thời gian thực dữ liệu từ các Node miền Bắc, Trung và Nam qua SQL Server Distributed Gateway.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Status</div>
                <div className="text-xl font-black text-emerald-400">OPERATIONAL</div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Active Nodes</div>
                <div className="text-xl font-black text-white">03 SITE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Yêu cầu 5: Thống kê doanh thu toàn hệ thống */}
        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl shadow-slate-200/40 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <BarChart3 size={32} />
            </div>
            <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">Live Gateway</div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[10px]">Doanh thu tích lũy 3 Site</p>
            <h3 className="text-6xl font-manrope font-black text-slate-900 tracking-tighter">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRev)}
            </h3>
          </div>
          <div className="mt-10 flex gap-3">
            {revenues.map((reg: any, i: number) => (
              <div key={reg.KhuVuc} className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-amber-500' : 'bg-emerald-500'} transition-all duration-1000`} 
                  style={{ width: `${(reg.DoanhThu / (totalRev || 1)) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-[11px] font-black uppercase text-slate-700 tracking-widest">
            {revenues.map((reg: any) => <span key={reg.KhuVuc}>{reg.KhuVuc}</span>)}
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl shadow-slate-200/40 group overflow-hidden">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8">
            <Package size={32} />
          </div>
          <p className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[10px]">Vận đơn toàn quốc</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-5xl font-manrope font-black text-slate-900 tracking-tighter">1,248</h3>
            <span className="text-slate-500 font-black text-sm uppercase">kiện</span>
          </div>
          <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between group-hover:translate-x-2 transition-transform cursor-pointer">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Tra cứu nhanh</span>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
        </div>

        {/* Yêu cầu 7: Hàm đếm đơn hàng thất bại 2025 */}
        <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-red-100 shadow-2xl shadow-red-200/20 group">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-8 group-hover:animate-shake">
            <AlertCircle size={32} />
          </div>
          <p className="text-red-900/60 font-extrabold uppercase tracking-[0.2em] text-[10px]">Thất bại 2025 (fn_Count)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-5xl font-manrope font-black text-red-600 tracking-tighter">{stats?.totalFailed2025 || 0}</h3>
            <span className="text-red-900/60 font-black text-sm uppercase">kiện</span>
          </div>
          <div className="mt-10 pt-10 border-t border-red-200 flex items-center justify-between cursor-pointer group-hover:translate-x-2 transition-transform">
            <span className="text-xs font-black text-red-900 uppercase tracking-widest">Xem rủi ro Site</span>
            <ChevronRight size={18} className="text-red-600" />
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl space-y-8">
          <h4 className="text-2xl font-manrope font-black tracking-tight flex items-center gap-4 text-slate-900">
            <Activity className="text-primary" size={28} /> Hub Status Monitoring
          </h4>
          <div className="space-y-5">
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-black text-slate-700">LS_HUB_BAC_Local</span>
               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">Synchronized</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-black text-slate-700">LS_HUB_TRUNG_Local</span>
               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">Synchronized</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
               <span className="text-sm font-black text-primary">Gateway Nam (Master)</span>
               <span className="text-[10px] font-black text-primary bg-white px-3 py-1 rounded-lg shadow-sm border border-primary/10 uppercase tracking-widest">Authority</span>
             </div>
          </div>
        </div>
        <div className="bg-midnight-purple p-12 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
             <Globe size={300} />
           </div>
           <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Distributed Database Control</div>
                <h4 className="text-3xl font-manrope font-black mt-2">Hệ quản trị <br/>ABC Logistics</h4>
              </div>
              <Globe size={48} className="text-primary-fixed" />
           </div>
           <button className="relative z-10 w-full py-5 bg-white/10 hover:bg-primary hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/5 shadow-xl active:scale-95">
             Quản lý cấu hình Site
           </button>
        </div>
      </section>
    </div>
  );
}
