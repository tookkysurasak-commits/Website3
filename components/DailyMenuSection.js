'use client';

import { useState } from 'react';
import { 
  Star, 
  Flame, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2,
  Search, 
  ChefHat, 
  MessageSquare, 
  Info, 
  ShieldCheck,
  Lock,
  Unlock,
  Calendar,
  Utensils,
  AlertCircle,
  X
} from 'lucide-react';
import { MENU_CATEGORIES, ALLERGEN_OPTIONS, DAYS_OF_WEEK, getMenuDayInfo } from '@/lib/initial-data';

export default function DailyMenuSection({ 
  menus, 
  onOpenRatingModal, 
  onViewMenuReviews,
  onOpenAddMenu,
  onOpenEditMenu,
  onDeleteMenu,
  onOpenSiteConfigModal,
  isAdmin, 
  onToggleAdmin,
  siteConfig
}) {
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Sort menus chronologically by Day (Monday = 1 -> Saturday = 6)
  const filteredMenus = menus
    .filter((menu) => {
      const dayInfo = getMenuDayInfo(menu.date);
      const matchesDay = selectedDay === 'all' || String(dayInfo.dayNum) === String(selectedDay);
      const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            menu.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (menu.station && menu.station.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDay && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const dayA = getMenuDayInfo(a.date).dayNum;
      const dayB = getMenuDayInfo(b.date).dayNum;
      if (dayA !== dayB) {
        return dayA - dayB; // 1 (วันจันทร์) -> 2 (วันอังคาร) -> ... -> 6 (วันเสาร์)
      }
      if (a.is_special !== b.is_special) {
        return b.is_special ? 1 : -1;
      }
      return a.name.localeCompare(b.name, 'th');
    });

  const getAllergenBadge = (allergenId) => {
    const found = ALLERGEN_OPTIONS.find(a => a.id === allergenId);
    return found ? found : { label: allergenId, color: 'bg-slate-100 text-slate-700' };
  };

  const handleConfirmDelete = async () => {
    if (!menuToDelete || !onDeleteMenu) return;
    setIsDeleting(true);
    try {
      await onDeleteMenu(menuToDelete.id);
      setMenuToDelete(null);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบเมนู: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Quick Highlights */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-zinc-900 to-amber-950 text-white p-6 sm:p-8 shadow-2xl shadow-black/40 border border-amber-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {siteConfig?.bannerBadge || 'เมนูมื้อเที่ยงพร้อมเสิร์ฟแล้ววันนี้'}
              </div>
              <button
                onClick={onOpenSiteConfigModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-300 hover:text-white text-[11px] font-semibold backdrop-blur-sm transition-all border border-amber-500/30"
                title="คลิกเพื่อแก้ไขหัวข้อ & ข้อความแบนเนอร์"
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>แก้ไขข้อความแบนเนอร์/นโยบาย</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {siteConfig?.bannerTitle || 'อิ่มอร่อย สด สะอาด พร้อมฟังทุกเสียงของคุณ 🍽️'}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              {siteConfig?.bannerSubtitle || 'ร่วมประเมินรสชาติและคุณภาพอาหาร เพื่อเป็นกำลังใจให้แม่ครัวและพัฒนาเมนูในทุกๆ วัน (สามารถประเมินแบบไม่ระบุชื่อได้)'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Admin Action Buttons */}
            <button
              onClick={onOpenAddMenu}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-amber-300/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ เพิ่มเมนูอาหารใหม่ (D1)</span>
            </button>

            <button
              onClick={onToggleAdmin}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all border ${
                isAdmin 
                  ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-lg border-emerald-400/40' 
                  : 'bg-stone-900/80 hover:bg-stone-900 text-amber-300 border-amber-500/30'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-300" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>{isAdmin ? 'Admin ปลดล็อคแล้ว' : 'ปลดล็อค Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day of Week Selector Bar (จันทร์ - เสาร์) */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
            <div className="p-1.5 rounded-xl bg-stone-900 text-amber-400 border border-amber-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <span>ตารางเมนูอาหารประจำสัปดาห์ (เรียงตามวันจันทร์ - เสาร์):</span>
          </div>

          <span className="text-[11px] text-slate-400">
            แสดงทั้งหมด {filteredMenus.length} เมนู
          </span>
        </div>

        {/* Day Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day.id;
            const count = day.id === 'all'
              ? menus.length
              : menus.filter(m => String(getMenuDayInfo(m.date).dayNum) === String(day.dayNum)).length;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? `${day.activeBtn || 'bg-slate-900 text-white'} scale-105`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${day.dotColor || 'bg-slate-400'}`}></span>
                <span>{day.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-black/15 text-current' : 'bg-slate-200/80 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Scrollable Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{cat.name}</span>
                {cat.id !== 'all' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {menus.filter(m => m.category === cat.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเมนู, ซุ้มอาหาร..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => {
          const dayInfo = getMenuDayInfo(menu.date);

          return (
            <div
              key={menu.id}
              className={`group rounded-3xl overflow-hidden border ${dayInfo.borderColor} ${dayInfo.cardBg} transition-all duration-300 flex flex-col justify-between relative hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Top Floating Admin Actions & Day Badge */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    onClick={() => onOpenEditMenu(menu)}
                    className="bg-slate-900/85 hover:bg-slate-900 text-amber-300 hover:text-white px-2.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold shadow-lg flex items-center gap-1 border border-slate-700 transition-all transform hover:scale-105"
                    title="แก้ไขเมนูนี้ (ใส่รหัส 147258)"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </button>

                  <button
                    onClick={() => setMenuToDelete(menu)}
                    className="bg-rose-900/85 hover:bg-rose-900 text-rose-200 hover:text-white px-2 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold shadow-lg flex items-center gap-1 border border-rose-700 transition-all transform hover:scale-105"
                    title="ลบเมนูนี้ออกจากระบบ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Badge */}
                <div className={`pointer-events-auto px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-md border backdrop-blur-md flex items-center gap-1.5 ${dayInfo.badge}`}>
                  <span>🗓️ {dayInfo.name}</span>
                </div>
              </div>

              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={menu.image_url}
                  alt={menu.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                {/* Calories Pill */}
                <div className="absolute bottom-12 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{menu.calories} kcal</span>
                </div>

                {/* Station Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-medium drop-shadow-sm bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                    {(!menu.station || menu.station.includes('?') || menu.station.includes('w')) ? 'ซุ้มอาหารหลัก (เชฟประจำวัน)' : menu.station}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-500 text-white font-bold px-2 py-0.5 rounded-lg shadow-sm">
                    ★ {menu.reviews_count > 0 ? Number(menu.rating_avg || 0).toFixed(1) : '-'} ({menu.reviews_count || 0})
                  </span>
                </div>
              </div>

            {/* Body Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-amber-700 transition-colors leading-snug">
                    {menu.name}
                  </h3>
                  {menu.is_special && (
                    <span className="shrink-0 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      ⭐ แนะนำ
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {menu.description || 'เมนูอาหารกลางวันแสนอร่อย ปรุงสดใหม่ทุกวัน'}
                </p>
              </div>

              {/* Allergen Information */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400" />
                  ข้อมูลสำหรับผู้แพ้อาหาร:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {menu.allergens && (Array.isArray(menu.allergens) ? menu.allergens : (typeof menu.allergens === 'string' ? menu.allergens.split(',') : [])).map((allergenId) => {
                    const badge = getAllergenBadge(allergenId);
                    return (
                      <span
                        key={allergenId}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenRatingModal(menu)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-black shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 border border-amber-300/30"
                >
                  <Star className="w-3.5 h-3.5 fill-stone-950" />
                  <span>ให้คะแนน / รีวิวเมนูนี้</span>
                </button>
                <button
                  onClick={() => onViewMenuReviews(menu.id)}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-600 text-xs transition-colors"
                  title="ดูรีวิวของเมนูนี้"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenEditMenu(menu)}
                  className="p-2.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 text-xs transition-colors"
                  title="แก้ไขเมนู"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMenuToDelete(menu)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 text-xs transition-colors"
                  title="ลบเมนูนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

      {filteredMenus.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-2xl border border-amber-500/30">
            🍽️
          </div>
          <h3 className="font-bold text-stone-800 text-lg">ไม่พบเมนูอาหารที่คุณค้นหา</h3>
          <p className="text-sm text-stone-400">ลองค้นหาด้วยคำค้นอื่น หรือคลิกปุ่มเพิ่มเมนูอาหารใหม่ด้านล่าง</p>
          <button
            onClick={onOpenAddMenu}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 text-xs font-black hover:from-amber-400 hover:to-yellow-400 transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>เพิ่มเมนูอาหารใหม่</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">ยืนยันการลบเมนูอาหาร?</h3>
              <p className="text-xs text-slate-500">
                คุณต้องการลบเมนู <strong className="text-slate-800 font-bold">"{menuToDelete.name}"</strong> ออกจากระบบ Cloudflare D1 ใช่หรือไม่?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMenuToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบเมนู'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}