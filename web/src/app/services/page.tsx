'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { 
  Package, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Info,
  X
} from 'lucide-react';

export default function ServicesPage() {
  const [dichVu, setDichVu] = useState<any[]>([
    { MaDichVu: 'DV01', TenDichVu: 'Chuyển phát tiêu chuẩn', DonGiaNoiMien: 15000, DonGiaLienMien: 25000 },
    { MaDichVu: 'DV02', TenDichVu: 'Chuyển phát hỏa tốc', DonGiaNoiMien: 35000, DonGiaLienMien: 55000 },
  ]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Yêu cầu 6: Trigger kiểm tra xóa dịch vụ (Kiểm tra toàn hệ thống)
  const executeDelete = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);

    try {
      // Giả lập thanh tiến trình kiểm tra toàn hệ thống
      setLoading(true);
      setStatus({ type: 'success', msg: 'Đang bắt đầu kiểm tra tính toàn vẹn dữ liệu trên toàn quốc...' });
      await new Promise(r => setTimeout(r, 800));
      setStatus({ type: 'success', msg: '-> Đang quét Hub Miền Bắc (LS_HUB_BAC_Local)...' });
      await new Promise(r => setTimeout(r, 600));
      setStatus({ type: 'success', msg: '-> Đang quét Hub Miền Trung (LS_HUB_TRUNG_Local)...' });
      await new Promise(r => setTimeout(r, 600));

      await api.delete(`/services/${id}`); 
      setStatus({ type: 'success', msg: 'Duyệt lệnh thành công: Không có đơn hàng tồn đọng. Dịch vụ đã bị xóa.' });
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        msg: 'ROLLBACK: Không thể xóa vì còn đơn hàng sử dụng dịch vụ này trên hệ thống phân tán.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 text-slate-900 pb-20">
      <div>
        <h3 className="text-4xl font-manrope font-black tracking-tighter">Quản lý Bảng giá & Dịch vụ</h3>
        <p className="text-slate-500 font-medium mt-2">Dữ liệu nhân bản (Replication) - Kiểm soát toàn vẹn bằng Distributed Trigger.</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0"><Zap size={24}/></div>
        <div>
           <div className="font-black text-amber-900 text-sm flex items-center gap-2">Yêu cầu 6: Kiểm tra xóa dịch vụ <Info size={14}/></div>
           <p className="text-xs font-bold text-amber-900/60 mt-1 uppercase tracking-widest">Trigger tại Site Nam sẽ quét bảng DonHang tại cả 3 site trước khi cho phép xóa.</p>
        </div>
      </div>

      {status && (
        <div className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 font-bold animate-shake ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {status.type === 'success' ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
          {status.msg}
        </div>
      )}

      <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl overflow-hidden relative">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-10 py-8">Mã DV</th>
              <th className="px-10 py-8">Tên Dịch Vụ</th>
              <th className="px-10 py-8">Giá Nội Miền</th>
              <th className="px-10 py-8">Giá Liên Miền</th>
              <th className="px-10 py-8 text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {dichVu.map((dv) => (
              <tr key={dv.MaDichVu} className="hover:bg-slate-50/20 transition-all">
                <td className="px-10 py-6 font-black text-primary">{dv.MaDichVu}</td>
                <td className="px-10 py-6 font-bold text-slate-700">{dv.TenDichVu}</td>
                <td className="px-10 py-6 font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(dv.DonGiaNoiMien)} đ</td>
                <td className="px-10 py-6 font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(dv.DonGiaLienMien)} đ</td>
                <td className="px-10 py-6 text-right">
                  <button 
                    disabled={loading}
                    onClick={() => setDeletingId(dv.MaDichVu)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Xác nhận */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-2 border-red-50 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Xác nhận xóa</h4>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Hệ thống chuẩn bị xóa dịch vụ <strong className="text-red-500 font-black">{deletingId}</strong>. Trigger SQL phân tán sẽ tự động quét qua toàn bộ 3 Hub Miền Bắc, Miền Trung và Gateway.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:-translate-y-0.5"
              >
                Chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
