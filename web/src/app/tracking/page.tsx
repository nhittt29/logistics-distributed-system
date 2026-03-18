'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Activity,
  Globe,
  Truck
} from 'lucide-react';

export default function TrackingPage() {
  const [maVanDon, setMaVanDon] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Yêu cầu 3: Stored Procedure tra cứu vận đơn xuyên Site (usp_TraCuuVanDon)
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maVanDon.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await api.get(`/orders/track/${maVanDon}`);
      if (response.data) {
        setResult(response.data);
      } else {
        setError('Không tìm thấy mã vận đơn trên toàn bộ hệ thống Hub.');
      }
    } catch (err) {
      setError('Lỗi SQL Gateway hoặc Linked Server không phản hồi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h3 className="text-5xl font-manrope font-black tracking-tighter text-slate-900">Tính năng Express Track</h3>
        <p className="text-slate-500 font-medium">Yêu cầu 3: Thực thi usp_TraCuuVanDon xuyên suốt hệ thống 3 miền.</p>
      </div>

      <section className="bg-white p-2 rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={28} />
            <input 
              type="text" 
              value={maVanDon}
              onChange={(e) => setMaVanDon(e.target.value)}
              placeholder="Nhập mã vận đơn (VD: MD001)..." 
              className="w-full pl-20 pr-8 py-8 bg-slate-50/50 border-2 border-transparent focus:border-primary focus:bg-white rounded-[2.5rem] text-2xl font-black placeholder:text-slate-200 transition-all focus:outline-none"
            />
          </div>
          <button type="submit" className="px-12 py-8 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
            {loading ? 'Đang tìm...' : 'Tra cứu ngay'}
          </button>
        </form>
      </section>

      {error && (
        <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl flex items-center gap-4 text-red-600 font-bold animate-shake">
          <AlertCircle size={24}/> {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
              <Globe size={300} />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                   <Activity size={14}/> Trạng thái: {result.TrangThai}
                </div>
                <h2 className="text-6xl font-manrope font-black tracking-tighter text-slate-900">
                  {result.MaVanDon}
                </h2>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                     <MapPin size={18} className="text-primary"/> Vị trí hiện tại: <span className="text-slate-900">{result.TenBuuCuc}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                     <Clock size={18} className="text-primary"/> Cập nhật từ Site: <span className="text-primary">{result.KhuVuc || 'Search Global'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-6 relative">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-4">
                    <Truck size={24}/>
                 </div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ghi chú vận hành</div>
                 <p className="font-bold text-slate-800 leading-relaxed">Đơn hàng đã được tìm thấy qua truy vấn liên vùng giữa các Hub Miền Bắc, Miền Trung và Miền Nam.</p>
                 <div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Gate: Hub Nam</span>
                    <ChevronRight size={14}/>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
