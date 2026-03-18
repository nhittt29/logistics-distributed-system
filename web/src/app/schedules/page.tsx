'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const schedules = [
  { id: 'S001', route: 'TP.HCM - Đà Nẵng', time: '08:00 - 18:00', driver: 'Nguyễn Văn A', status: 'Đúng giờ' },
  { id: 'S002', route: 'Hà Nội - Hải Phòng', time: '09:30 - 11:00', driver: 'Trần Minh B', status: 'Đang chạy' },
  { id: 'S003', route: 'Cần Thơ - TP.HCM', time: '13:00 - 16:30', driver: 'Lê Hoàng C', status: 'Trễ 15p' },
];

export default function SchedulesPage() {
  return (
    <div className="space-y-8 text-slate-900 font-sans">
      <div>
        <h3 className="text-3xl font-black tracking-tight">Lịch trình Chuyến xe</h3>
        <p className="text-slate-500 font-medium mt-1">Quản lý và điều phối các lộ trình vận chuyển hàng hóa liên tỉnh.</p>
      </div>

      <div className="overflow-hidden bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lộ trình</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài xế</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-black text-slate-700">
                        {schedule.route.split(' - ')[0]}
                        <ArrowRight size={14} className="text-slate-300" />
                        {schedule.route.split(' - ')[1]}
                      </div>
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mã lộ trình: {schedule.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Clock size={16} className="text-slate-300" />
                    <span>{schedule.time}</span>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-slate-600">{schedule.driver}</td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${
                    schedule.status === 'Đúng giờ' ? 'bg-emerald-50 text-emerald-600' :
                    schedule.status === 'Đang chạy' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {schedule.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
