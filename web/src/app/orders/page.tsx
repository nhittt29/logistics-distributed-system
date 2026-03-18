'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Package, 
  Search, 
  MapPin, 
  Download, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  Zap
} from 'lucide-react';

export default function OrdersPage() {
  const [region, setRegion] = useState<'NAM' | 'BAC' | 'TRUNG'>('NAM');
  const [mode, setMode] = useState<'standard' | 'high-fee'>('standard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    // Tạo hiệu ứng delay nhẹ để người dùng cảm nhận được sự chuyển vùng (UX)
    const startTime = Date.now();
    try {
      let url = mode === 'high-fee' ? '/orders/central-high-fee' : `/orders?region=${region}`;
      const response = await api.get(url);
      
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));
      
      setOrders(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [region, mode]);

  const regions = [
    { id: 'BAC', label: 'MIỀN BẮC', color: 'primary' },
    { id: 'TRUNG', label: 'MIỀN TRUNG', color: 'primary' },
    { id: 'NAM', label: 'MIỀN NAM', color: 'primary' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-4xl font-manrope font-black tracking-tighter">Vận hành Đơn hàng</h3>
          <p className="text-slate-700 font-extrabold mt-1">Nghiệp vụ phân vùng (Horizontal Sharding) trực quan.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border-2 border-white shadow-xl">
          {regions.map((reg) => (
            <button 
              key={reg.id}
              onClick={() => {setRegion(reg.id); setMode('standard')}} 
              className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all duration-300 ${region === reg.id && mode === 'standard' ? 'bg-midnight-purple text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {reg.label}
            </button>
          ))}
          <div className="w-[1px] bg-slate-200 mx-3"></div>
          {/* Yêu cầu 2: Đơn hàng cước phí cao Miền Trung */}
          <button 
            onClick={() => {setRegion('TRUNG'); setMode('high-fee')}} 
            className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all duration-300 ${mode === 'high-fee' ? 'bg-starlight-gold text-midnight-purple shadow-lg font-black' : 'text-amber-500 hover:opacity-80'}`}
          >
            CƯỚC CAO MT (Req 2)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden min-h-[500px]">
        <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-manrope font-black text-2xl tracking-tight flex items-center gap-4 text-slate-900">
                {mode === 'high-fee' ? (
                  <>
                    <Zap className="text-energy-orange" />
                    Đơn hàng cước {'>'} 1.000.000đ (Today)
                  </>
                ) : (
                  <>
                    <Package className="text-primary" />
                    Vận đơn {region === 'BAC' ? 'Miền Bắc' : region === 'TRUNG' ? 'Miền Trung' : 'Miền Nam'}
                  </>
                )}
              </h4>
              <p className="text-[10px] font-black text-slate-800 mt-1 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-lg w-fit">
                Gateway: Hub Nam {'->'} {mode === 'high-fee' || region !== 'NAM' ? `LS_HUB_${region}_Local` : 'Local Buffer'}
              </p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-800 hover:border-primary hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
                 <Download size={16}/> Export CSV
               </button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 border-b-2 border-slate-100 bg-slate-50/50">
                <th className="px-12 py-8">Mã vận đơn</th>
                <th className="px-12 py-8">Ngày gửi</th>
                <th className="px-12 py-8">Cước phí</th>
                <th className="px-12 py-8">Trạng thái</th>
                <th className="px-12 py-8">Bưu cục</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-12 py-8">
                       <div className="h-6 bg-slate-200 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Search size={48} />
                      <p className="font-black text-lg uppercase tracking-widest">Không có dữ liệu tại trạm này</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map((order, idx) => (
                <tr 
                  key={order.MaVanDon} 
                  className="hover:bg-slate-50 transition-all group border-b border-slate-100"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-12 py-6 font-black text-slate-900 group-hover:text-primary transition-colors">{order.MaVanDon}</td>
                  <td className="px-12 py-6 text-sm font-black text-slate-700">
                    {order.NgayGui ? new Date(order.NgayGui).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-12 py-6 font-black text-slate-900 text-lg">
                    {new Intl.NumberFormat('vi-VN').format(order.CuocPhi)} đ
                  </td>
                  <td className="px-12 py-6">
                    <span className="px-5 py-2 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                      {order.TrangThai || 'Đang xử lý'}
                    </span>
                  </td>
                  <td className="px-12 py-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                      <MapPin size={14} className="text-midnight-purple-light" />
                      {order.BuuCuc || 'Site ' + region}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
