'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ChevronRight
} from 'lucide-react';

export default function ReportsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['reports-stats'],
    queryFn: async () => {
      const response = await api.get('/shippers/stats');
      return response.data;
    },
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h3 className="text-4xl font-manrope font-black tracking-tighter">Báo cáo & Phân tích</h3>
          <p className="text-slate-500 font-medium mt-2">Tổng hợp dữ liệu kinh doanh và vận hành từ mạng lưới Hub toàn quốc.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
            <Download size={18} />
            Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            <Filter size={18} />
            Bộ lọc nâng cao
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard 
          label="Tổng doanh thu" 
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)} 
          change="+15.2%" 
          positive 
          icon={<TrendingUp size={24} />} 
        />
        <ReportCard label="Tổng đơn hàng" value="12,482" change="+5.4%" positive icon={<BarChart3 size={24} />} />
        <ReportCard label="Tỷ lệ giao đúng hạn" value="98.5%" change="+0.2%" positive icon={<CheckCircle2 size={24} />} />
        <ReportCard label="Sự cố vận chuyển" value="12" change="-24%" positive={false} icon={<AlertCircle size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-slate-200/40 space-y-8">
          <div className="flex justify-between items-center">
            <h4 className="font-manrope font-black text-xl tracking-tight">Doanh thu theo vùng miền</h4>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"></div> Bắc</span>
              <span className="flex items-center gap-1 ml-4"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Trung</span>
              <span className="flex items-center gap-1 ml-4"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Nam</span>
            </div>
          </div>
          <div className="h-64 flex items-end gap-10 px-4">
            <RevenueBar label="Miền Bắc" value={stats?.northRevenue || 0} total={stats?.totalRevenue || 1} color="bg-primary" />
            <RevenueBar label="Miền Trung" value={stats?.centralRevenue || 0} total={stats?.totalRevenue || 1} color="bg-amber-500" />
            <RevenueBar label="Miền Nam" value={stats?.southRevenue || 0} total={stats?.totalRevenue || 1} color="bg-emerald-500" />
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <h4 className="font-manrope font-black text-xl tracking-tight">Báo cáo định kỳ</h4>
            <div className="space-y-3">
              <ReportItem label="Theo dõi chi phí nhiên liệu" date="Hôm nay, 08:30" />
              <ReportItem label="Hiệu suất shipper tháng 2" date="Hôm qua, 17:45" />
              <ReportItem label="Phân tích vùng bưu cục rủi ro" date="15 Th03, 2026" />
              <ReportItem label="Tối ưu lộ trình Highway A1" date="12 Th03, 2026" />
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-widest transition-all">
              Xem toàn bộ lưu trữ
            </button>
          </div>
          <FileText size={200} className="absolute -right-10 -bottom-10 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-700" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h4 className="font-manrope font-black text-xl tracking-tight">So sánh chỉ số KPIs giữa các Hub</h4>
          <div className="flex bg-slate-50 p-1 rounded-xl">
            <button className="px-4 py-1.5 text-[10px] font-black bg-white rounded-lg shadow-sm">6 tháng qua</button>
            <button className="px-4 py-1.5 text-[10px] font-black text-slate-400">12 tháng qua</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-10 py-6">Hub Khu vực</th>
                <th className="px-10 py-6">Sản lượng đơn</th>
                <th className="px-10 py-6">Thời gian xử lý TB</th>
                <th className="px-10 py-6">Mức độ hài lòng</th>
                <th className="px-10 py-6 text-right">Biến động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <KPIRow hub="Logistics Hub Miền Bắc" volume="4,520" time="1.2s" score="4.8/5" change="+3.2%" />
              <KPIRow hub="Logistics Hub Miền Trung" volume="2,840" time="1.5s" score="4.6/5" change="-1.5%" />
              <KPIRow hub="Logistics Hub Miền Nam" volume="5,122" time="1.1s" score="4.9/5" change="+5.7%" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ label, value, change, positive, icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-all">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all mb-6">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h3 className="text-3xl font-manrope font-black text-slate-800 tracking-tighter">{value}</h3>
      <div className={`mt-4 text-[10px] font-black uppercase tracking-widest ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
        {change} <span className="text-slate-300 ml-1">so với tháng trước</span>
      </div>
    </div>
  );
}

function RevenueBar({ label, value, total, color }: any) {
  const percent = (value / total) * 100;
  return (
    <div className="flex-1 flex flex-col items-center gap-4 h-full pt-10">
      <div className="flex-1 w-full bg-slate-50 rounded-2xl relative overflow-hidden group">
        <div className={`absolute bottom-0 w-full ${color} transition-all duration-[2000ms] shadow-lg`} style={{ height: `${percent}%` }}></div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

function ReportItem({ label, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all group">
      <div>
        <div className="text-sm font-bold tracking-tight">{label}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{date}</div>
      </div>
      <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function KPIRow({ hub, volume, time, score, change }: any) {
  return (
    <tr className="group hover:bg-slate-50/50 transition-all">
      <td className="px-10 py-6 font-black text-slate-800 tracking-tight">{hub}</td>
      <td className="px-10 py-6 text-sm font-bold text-slate-500">{volume}</td>
      <td className="px-10 py-6 text-sm font-bold text-slate-500">{time}</td>
      <td className="px-10 py-6 font-black text-primary italic">{score}</td>
      <td className={`px-10 py-6 text-right font-black ${change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{change}</td>
    </tr>
  );
}
