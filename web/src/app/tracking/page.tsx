'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Search, Package, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Gọi API tra cứu vận đơn (gọi Stored Procedure ở Backend)
      const response = await api.get(`/orders/track/${trackingId}`);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không tìm thấy thông tin vận đơn này trong hệ thống.');
      // Mock data for demo
      if (trackingId === 'VD123') {
        setResult({
          MaVanDon: 'VD123',
          TrangThai: 'Đang giao hàng',
          TenBuuCuc: 'Bưu cục Quận 1',
          KhuVuc: 'Miền Nam',
          NgayCapNhat: '2026-03-18 09:30',
          LichSu: [
            { location: 'Kho Tổng Miền Nam', status: 'Xuất kho', time: '2026-03-18 07:00' },
            { location: 'Hub Miền Nam', status: 'Nhập kho', time: '2026-03-17 21:00' },
          ]
        });
        setError('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900 font-sans">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold tracking-tight">Tra cứu Vận đơn</h3>
        <p className="text-slate-500">Nhập mã vận đơn để kiểm tra trạng thái trên toàn hệ thống phân tán.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleTrack} className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
        </div>
        <input 
          type="text" 
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="VD: VD123456789..." 
          className="w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl text-xl font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-xl shadow-slate-200/50 transition-all placeholder:text-slate-300"
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Đang tra cứu...' : 'Tra cứu'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-medium animate-shake">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-3xl border shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="space-y-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Mã vận đơn</div>
              <div className="text-2xl font-black tracking-tight tracking-wider">{result.MaVanDon}</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Trạng thái hiện tại</div>
              <div className="px-4 py-1.5 bg-emerald-500 text-white font-black rounded-full text-sm uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} />
                {result.TrangThai}
              </div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1 space-y-8">
              <InfoBlock label="Vị trí hiện tại" value={result.TenBuuCuc} icon={<Package className="text-blue-500" />} />
              <InfoBlock label="Khu vực Hub" value={result.KhuVuc} icon={<MapPin className="text-emerald-500" />} />
              <InfoBlock label="Cập nhật cuối" value={result.NgayCapNhat} icon={<Clock className="text-amber-500" />} />
            </div>

            <div className="md:col-span-2 border-l pl-10">
              <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs mb-8">Lịch trình chi tiết</h4>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                {(result.LichSu || []).map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-blue-500 z-10 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <div className="font-black text-slate-800">{step.status}</div>
                      <div className="text-sm font-bold text-slate-500">{step.location}</div>
                      <div className="text-xs font-medium text-slate-400">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, icon }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-600 border border-slate-100 shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-lg font-black text-slate-900 tracking-tight">{value}</div>
      </div>
    </div>
  );
}
