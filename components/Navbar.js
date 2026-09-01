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
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-500/25 shadow-xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/30 transform hover:scale-105 transition-transform font-bold border border-amber-300/40">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  {siteConfig?.brandName || 'DOD Canteen'}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold bg-stone-900 text-amber-300 rounded-full border border-amber-500/30 shadow-sm">
                  {siteConfig?.brandSubtitle || 'ระบบประเมินอาหารพนักงาน'}
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                {currentDateFormatted}
              </p>
            </div>
          </div>

          {/* Actions: Add Menu Button, Admin Edit Header Button, Admin Lock Status & D1 Status Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Add Menu Button */}
            <button
              onClick={onOpenAddMenu}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-black shadow-md shadow-amber-500/25 transition-all transform active:scale-95 border border-amber-300/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">+ เพิ่มเมนูอาหาร</span>
            </button>

            {/* Admin Header Customization Button (Visible to all or highlighted for admin) */}
            <button
              onClick={onOpenSiteConfigModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
              title="แก้ไขชื่อหัวข้อใหญ่ & ข้อความแบนเนอร์นโยบาย"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">แก้ไขหัวข้อ & แบนเนอร์</span>
            </button>

            {/* Admin Lock / Unlock Status Button */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAdmin
                  ? 'bg-stone-900 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border-stone-800'
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
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden sm:inline">ล็อค Admin</span>
                  <span className="sm:hidden">ล็อค</span>
                </>
              )}
            </button>

            {/* System Status: Ready with Green Dot */}
            <div 
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium select-none"
              title="สถานะระบบ: Ready"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 font-bold text-xs">Ready</span>
            </div>

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
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-stone-900/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400/80'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-black/20 text-stone-950'
                        : 'bg-stone-900 text-amber-300 border border-amber-500/20'
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
