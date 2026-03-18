'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, MapPin, Filter, Search as SearchIcon, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const [region, setRegion] = useState<'NAM' | 'BAC' | 'TRUNG'>('NAM');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (reg: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders?region=${reg}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for demo if API not ready
      setOrders([
        { MaVanDon: 'VD001', NgayGui: '2026-03-18', CuocPhi: 150000, TrangThai: 'Delivered', BuuCuc: 'BC-Q1' },
        { MaVanDon: 'VD002', NgayGui: '2026-03-18', CuocPhi: 220000, TrangThai: 'Shipping', BuuCuc: 'BC-Q3' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(region);
  }, [region]);

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Quản lý Đơn hàng</h3>
          <p className="text-slate-500">Xem danh sách vận đơn theo từng khu vực miền.</p>
        </div>
        
        <div className="flex bg-white border rounded-lg p-1 shadow-sm">
          <RegionTab active={region === 'BAC'} onClick={() => setRegion('BAC')} label="Miền Bắc" />
          <RegionTab active={region === 'TRUNG'} onClick={() => setRegion('TRUNG')} label="Miền Trung" />
          <RegionTab active={region === 'NAM'} onClick={() => setRegion('NAM')} label="Miền Nam" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã vận đơn..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors">
          <Filter size={18} />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Vận Đơn</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày Gửi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cước Phí</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bưu Cục</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">Đang tải dữ liệu...</td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.MaVanDon} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-blue-600 tracking-tight">{order.MaVanDon}</td>
                <td className="px-6 py-4 text-slate-600">{order.NgayGui}</td>
                <td className="px-6 py-4 font-bold">{new Intl.NumberFormat('vi-VN').format(order.CuocPhi)} đ</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.TrangThai === 'Giao hàng thành công' ? 'bg-emerald-50 text-emerald-600' : 
                    order.TrangThai === 'Giao hàng thất bại' ? 'bg-rose-50 text-rose-600' :
                    order.TrangThai === 'Đang giao hàng' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.TrangThai}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="text-slate-600">{order.BuuCuc || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all group-hover:scale-110">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RegionTab({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 text-sm font-bold tracking-tight rounded-md transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}
