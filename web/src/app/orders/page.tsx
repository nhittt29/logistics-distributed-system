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
  Zap,
  Plus,
  X,
  Trash2
} from 'lucide-react';

export default function OrdersPage() {
  const [region, setRegion] = useState<'NAM' | 'BAC' | 'TRUNG'>('NAM');
  const [mode, setMode] = useState<'standard' | 'high-fee'>('standard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    MaVanDon: '',
    TrongLuong: 1,
    CuocPhi: 20000,
    MaTrangThai: 'TT01',
    MaKH_Gui: 'KHN01',
    MaDichVu: 'DV01',
    MaBC_HienTai: 'BCN01'
  });
  // State for deletion process and status messages
  const [deletionStatus, setDeletionStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', newOrder);
      setShowCreateModal(false);
      await fetchOrders();
      alert(`Đã điều phối INSERT đơn hàng ${newOrder.MaVanDon} tới Hub tương ứng thành công!`);
    } catch (err) {
      alert('Lỗi khi tạo đơn hàng phân tán.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Xác nhận cập nhật trạng thái đơn ${id} thành "${status}"?\nLệnh sẽ được điều phối tới node gốc của đơn hàng.`)) return;
    setLoading(true);
    try {
      await api.patch(`/orders/${id}`, { MaTrangThai: status });
      await fetchOrders();
      alert(`Đã cập nhật đơn hàng ${id} thành công.`);
    } catch (err) {
      alert('Lỗi cập nhật trạng thái hoặc đơn hàng không còn tồn tại trên node.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`CẢNH BÁO: Bạn có chắc muốn XÓA đơn hàng ${id}?\nThao tác này sẽ xóa dữ liệu trực tiếp tại trạm lưu trữ gốc.`)) return;
    setLoading(true);
    try {
      await api.delete(`/orders/${id}`);
      await fetchOrders();
      alert(`Đơn hàng ${id} đã được xóa sạch khỏi hệ thống phân tán.`);
    } catch (err) {
      alert('Lỗi khi xóa đơn hàng.');
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
              className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all duration-300 ${region === reg.id && mode === 'standard' ? 'bg-primary-container text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {reg.label}
            </button>
          ))}
          <div className="w-[1px] bg-slate-200 mx-3"></div>
          {/* Yêu cầu 2: Đơn hàng cước phí cao Miền Trung */}
          <button 
            onClick={() => {setRegion('TRUNG'); setMode('high-fee')}} 
            className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all duration-300 ${mode === 'high-fee' ? 'bg-energy-orange text-white shadow-lg font-black' : 'text-amber-500 hover:opacity-80'}`}
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
               <button 
                 onClick={() => setShowCreateModal(true)}
                 className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
               >
                 <Plus size={16}/> Tạo vận đơn mới
               </button>
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
                <th className="px-12 py-8 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-12 py-8 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                       Querying {region} Hub...
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
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
                      <MapPin size={14} className="text-primary" />
                      {order.BuuCuc || 'Site ' + region}
                      <span className="ml-2 text-[8px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 uppercase">NODE_{region}</span>
                    </div>
                  </td>
                  <td className="px-12 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <select 
                        onChange={(e) => handleUpdateStatus(order.MaVanDon, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black px-2 py-1 outline-none focus:border-primary"
                        value={order.MaTrangThai}
                      >
                        <option value="TT01">Chờ lấy</option>
                        <option value="TT02">Đang giao</option>
                        <option value="TT03">Thành công</option>
                        <option value="TT05">Thất bại</option>
                      </select>
                      <button 
                        onClick={() => handleDelete(order.MaVanDon)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h4 className="text-3xl font-manrope font-black tracking-tighter text-slate-900">Tạo vận đơn mới</h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Distributed Write Routing enabled</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mã vận đơn</label>
                  <input 
                    required
                    value={newOrder.MaVanDon}
                    onChange={e => setNewOrder({...newOrder, MaVanDon: e.target.value})}
                    type="text" placeholder="MD00X..." 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Hub đích (Định tuyến)</label>
                  <select 
                    value={newOrder.MaBC_HienTai}
                    onChange={e => {
                      const val = e.target.value;
                      let kh = 'KHN01';
                      if (val.startsWith('BCB')) kh = 'KHB01';
                      if (val.startsWith('BCT')) kh = 'KHT01';
                      setNewOrder({...newOrder, MaBC_HienTai: val, MaKH_Gui: kh});
                    }}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                  >
                    <option value="BCB01">Hub Bắc (BCB01)</option>
                    <option value="BCT13">Hub Trung (BCT13)</option>
                    <option value="BCN01">Gateway Nam (BCN01)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Cước phí (VNĐ)</label>
                  <input 
                    required
                    value={newOrder.CuocPhi}
                    onChange={e => setNewOrder({...newOrder, CuocPhi: parseInt(e.target.value)})}
                    type="number" 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Trọng lượng (kg)</label>
                  <input 
                    required
                    value={newOrder.TrongLuong}
                    onChange={e => setNewOrder({...newOrder, TrongLuong: parseFloat(e.target.value)})}
                    type="number" step="0.1" 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-manrope font-black"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 font-manrope font-black"
                >
                  {loading ? 'Đang điều phối...' : 'Xác nhận tạo đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
