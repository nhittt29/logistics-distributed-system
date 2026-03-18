'use client';

import React from 'react';
import { DollarSign, Package, Zap, AlertCircle, Activity, Globe, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: () => api.get('/shippers/stats').then(res => res.data)
  });

  const totalRevenue = stats?.reduce((acc: number, curr: any) => acc + curr.DoanhThu, 0) || 0;

  return (
    <div className="space-y-8 text-slate-900 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black tracking-tight uppercase italic text-slate-900">Hệ thống Logistics</h3>
          <p className="text-slate-500 font-medium mt-1">Báo cáo tổng quan tình trạng vận chuyển toàn quốc.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-700 font-bold text-sm">
          <Activity size={18} />
          <span>Real-time Gateway: Bắc - Trung - Nam</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng Doanh Thu" 
          value={isLoading ? '...' : `${new Intl.NumberFormat('vi-VN').format(totalRevenue)} đ`} 
          change="+12.5%" 
          icon={<DollarSign size={24} />} 
          color="blue" 
        />
        <StatCard title="Đơn hàng" value="1,284" change="+3.2%" icon={<Package size={24} />} color="emerald" />
        <StatCard title="Thất bại" value="0.8%" change="-2.1%" icon={<AlertCircle size={24} />} color="rose" />
        <StatCard title="Hiệu suất" value="98.5%" change="+0.4%" icon={<Zap size={24} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border shadow-sm border-slate-100 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h4 className="text-xl font-black tracking-tight">Doanh thu theo vùng miền</h4>
              <p className="text-slate-400 text-sm font-bold flex items-center gap-1">
                <TrendingUp size={14} className="text-emerald-500" />
                Dữ liệu phân tán thời thực
              </p>
            </div>
            <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowUpRight size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="h-64 flex items-end gap-6 relative z-10">
            {stats ? stats.map((hub: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                <div className="w-full relative">
                  <div 
                    className="w-full bg-slate-50 rounded-2xl group-hover/bar:bg-slate-100 transition-colors border-2 border-transparent group-hover/bar:border-slate-200" 
                    style={{ height: '240px' }}
                  ></div>
                  <div 
                    className="absolute bottom-0 w-full bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-700 ease-out" 
                    style={{ height: `${(hub.DoanhThu / (totalRevenue || 1)) * 240}px` }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hub.KhuVuc}</p>
                  <p className="text-sm font-black text-slate-700">{Math.round((hub.DoanhThu / (totalRevenue || 1)) * 100)}%</p>
                </div>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest italic animate-pulse">
                Đang tải dữ liệu Gateway...
              </div>
            )}
          </div>
          
          {/* Background Decorative patterns */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
        </div>

        {/* Hub Status */}
        <div className="space-y-6">
          <h4 className="text-lg font-black tracking-tight pl-2">Trạng thái Hub Kết nối</h4>
          <HubStatus hub="Miền Bắc" status="Online" load={45} color="emerald" id="LS_HUB_BAC_Local" />
          <HubStatus hub="Miền Trung" status="Online" load={12} color="emerald" id="LS_HUB_TRUNG_Local" />
          <HubStatus hub="Miền Nam" status="Gateway" load={88} color="blue" id="LOCALHOST_NAM" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border shadow-sm border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl border", colors[color])}>
          {icon}
        </div>
        <div className={cn("px-2 py-1 rounded-lg text-[10px] font-black tracking-widest", colors[color])}>
          {change}
        </div>
      </div>
      <div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function HubStatus({ hub, status, load, color, id }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500 shadow-emerald-500/40',
    blue: 'bg-blue-500 shadow-blue-500/40',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
      <div className="flex gap-4 items-center">
        <div className={cn("w-3 h-3 rounded-full shadow-lg animate-pulse", colors[color])}></div>
        <div>
          <h5 className="font-black text-slate-700">{hub}</h5>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-black text-slate-400 mb-1">{load}% Load</p>
        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000", colors[color].split(' ')[0])} 
            style={{ width: `${load}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
