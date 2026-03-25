'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  CreditCard,
  Truck,
  Calendar,
  Search,
  Plus,
  Bell,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Đơn hàng', href: '/orders', icon: <Package size={20} /> },
    { name: 'Tra cứu', href: '/tracking', icon: <Search size={20} /> },
    { name: 'Shipper', href: '/shippers', icon: <Users size={20} /> },
    { name: 'Báo cáo', href: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Dịch vụ', href: '/services', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-inter">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 bg-primary-container text-on-primary shadow-2xl overflow-y-auto overflow-x-hidden">
        <div className="px-6 py-8 flex-1">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-energy-orange rounded-lg flex items-center justify-center shadow-lg">
              <Truck size={24} className="text-on-primary" />
            </div>
            <div>
              <h1 className="font-manrope font-extrabold text-lg leading-tight tracking-tight">Logistics Auth</h1>
              <p className="text-on-primary/60 text-[10px] uppercase tracking-[0.2em] font-bold">Precision Tectonics</p>
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-primary-gradient text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 mb-8 shadow-xl hover:scale-[0.98] active:scale-95 transition-all">
            <Plus size={18} />
             Vận đơn mới
          </button>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-white/10 text-on-primary border-l-4 border-energy-orange' 
                      : 'text-on-primary/70 hover:bg-white/5 hover:text-on-primary'
                  }`}
                >
                  <span className={`${isActive ? 'text-energy-orange' : 'group-hover:text-energy-orange transition-colors'}`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-6 py-6 space-y-1">
          <Link href="#" className="flex items-center gap-3 text-on-primary/70 py-3 px-4 hover:bg-white/5 hover:text-on-primary transition-all rounded-xl">
            <HelpCircle size={20} />
            <span className="font-semibold text-sm">Hỗ trợ</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 text-on-primary/70 py-3 px-4 hover:bg-white/5 hover:text-on-primary transition-all rounded-xl">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Đăng xuất</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10 px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-manrope font-black text-primary tracking-tighter">
              {navItems.find(i => i.href === pathname)?.name || 'Hệ thống Quản trị'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <HeaderIcon icon={<Bell size={20} />} badge />
              <HeaderIcon icon={<Settings size={20} />} />
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-on-surface leading-none">Admin User</div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Quản trị viên</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-black text-primary border-2 border-white shadow-md group-hover:ring-4 group-hover:ring-primary/10 transition-all">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-8 flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-outline-variant/10 bg-surface-container-low flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Hub Bắc: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Hub Trung: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Hub Nam: Latency</span>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Tài liệu API</a>
            <a href="#" className="hover:text-primary transition-colors">Trạng thái Hệ thống</a>
            <span>v2.4.0-Enterprise</span>
          </div>
        </footer>
      </main>
    </div>
  );
}


function HeaderIcon({ icon, badge = false }: { icon: React.ReactNode; badge?: boolean }) {
  return (
    <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl transition-all active:scale-95 relative group">
      {icon}
      {badge && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error border-2 border-surface-container-low rounded-full"></span>}
    </button>
  );
}
