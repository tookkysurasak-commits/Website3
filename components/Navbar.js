'use client';

import { Utensils, MessageSquareHeart, Vote, BarChart3, Plus, Database, CalendarDays, Lock, Unlock, ShieldCheck, Settings } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  todayStats, 
  onOpenD1Modal, 
  onOpenAddMenu, 
  onOpenSiteConfigModal,
  isAdmin, 
  onToggleAdmin,
  siteConfig 
}) {
  const tabs = [
    { id: 'menu', label: siteConfig?.tabMenu || 'เมนูวันนี้', icon: Utensils, badge: `${todayStats?.totalMenus || 5} เมนู` },
    { id: 'reviews', label: siteConfig?.tabReviews || 'รีวิว & ความคิดเห็น', icon: MessageSquareHeart, badge: `${todayStats?.totalReviews || 0}` },
    { id: 'voting', label: siteConfig?.tabVoting || 'โหวตเมนูสัปดาห์หน้า', icon: Vote, badge: '🔥 Hot' },
    { id: 'dashboard', label: siteConfig?.tabDashboard || 'แดชบอร์ด HR/แม่ครัว', icon: BarChart3, badge: 'Admin' },
  ];

  const currentDateFormatted = new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-transform">
              <span className="text-2xl">🍱</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-purple-800 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                  {siteConfig?.brandName || 'YumCanteen'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                  {siteConfig?.brandSubtitle || 'ระบบประเมินอาหารพนักงาน'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <CalendarDays className="w-3.5 h-3.5 text-fuchsia-600" />
                {currentDateFormatted}
              </p>
            </div>
          </div>

          {/* Actions: Add Menu Button, Admin Edit Header Button, Admin Lock Status & D1 Status Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Add Menu Button */}
            <button
              onClick={onOpenAddMenu}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">เพิ่มเมนูใหม่</span>
            </button>

            {/* Admin Header Customization Button (Visible to all or highlighted for admin) */}
            <button
              onClick={onOpenSiteConfigModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200 transition-all shadow-sm"
              title="แก้ไขชื่อหัวข้อใหญ่ & ข้อความแบนเนอร์นโยบาย"
            >
              <Settings className="w-3.5 h-3.5 text-fuchsia-600" />
              <span className="hidden md:inline">แก้ไขหัวข้อ & แบนเนอร์</span>
            </button>

            {/* Admin Lock / Unlock Status Button */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAdmin
                  ? 'bg-slate-900 text-amber-300 border-slate-800 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title={isAdmin ? 'คลิกเพื่อล็อคโหมด Admin' : 'คลิกเพื่อปลดล็อคโหมด Admin (รหัส 147258)'}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Admin (ปลดล็อคแล้ว)</span>
                  <span className="sm:hidden">Admin ✓</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">ล็อค Admin</span>
                  <span className="sm:hidden">ล็อค</span>
                </>
              )}
            </button>

            {/* D1 Connection Badge */}
            <button 
              onClick={onOpenD1Modal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-xs font-medium text-purple-800 transition-all hover:shadow-sm"
              title="ดูการเชื่อมต่อ Cloudflare D1"
            >
              <Database className="w-4 h-4 text-purple-600" />
              <span>D1 Connected</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-purple-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
