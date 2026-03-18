'use client';

import React from 'react';
import { Truck, MapPin, Package, Calendar } from 'lucide-react';

const trucks = [
  { id: 'T001', plate: '51A-11111', type: 'Xe tải 5 tấn', status: 'Đang vận hành', location: 'Quận 1, TP.HCM' },
  { id: 'T002', plate: '61A-22222', type: 'Xe tải 8 tấn', status: 'Đang nghỉ', location: 'Thuận An, Bình Dương' },
  { id: 'T003', plate: '60A-33333', type: 'Xe Van 2 tấn', status: 'Đang bảo trì', location: 'Biên Hòa, Đồng Nai' },
];

export default function TrucksPage() {
  return (
    <div className="space-y-8 text-slate-900 font-sans">
      <div>
        <h3 className="text-3xl font-black tracking-tight">Quản lý Đội xe</h3>
        <p className="text-slate-500 font-medium mt-1">Theo dõi vị trí và trạng thái vận hành của toàn bộ đội xe vận chuyển.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <div key={truck.id} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Truck size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                truck.status === 'Đang vận hành' ? 'bg-emerald-50 text-emerald-600' : 
                truck.status === 'Đang nghỉ' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600'
              }`}>
                {truck.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-black tracking-tight">{truck.plate}</h4>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{truck.type}</p>
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <MapPin size={16} className="text-slate-300" />
                  <span>{truck.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Package size={16} className="text-slate-300" />
                  <span>Đang chở 12 đơn hàng</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
