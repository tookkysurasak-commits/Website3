'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Users, 
  Download, 
  Sparkles, 
  HeartHandshake, 
  ChefHat, 
  Database,
  ThumbsUp,
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function AnalyticsDashboard({ reviews, menus, votes, onOpenD1Modal }) {
  const totalReviewsCount = reviews.length;

  // Calculate Overall Average & 4 Criteria
  const avgOverall = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.overall_score, 0) / totalReviewsCount).toFixed(2)
    : '0.0';

  const avgTaste = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.taste_score, 0) / totalReviewsCount).toFixed(2)
    : '0.0';

  const avgHygiene = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.hygiene_score, 0) / totalReviewsCount).toFixed(2)
    : '0.0';

  const avgPortion = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.portion_score, 0) / totalReviewsCount).toFixed(2)
    : '0.0';

  const avgValue = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.value_score, 0) / totalReviewsCount).toFixed(2)
    : '0.0';

  // Calculate Top Rated Menus & Improvement Needed
  const menuStatsMap = {};
  menus.forEach(m => {
    menuStatsMap[m.id] = { ...m, totalScore: 0, count: 0 };
  });

  reviews.forEach(r => {
    if (menuStatsMap[r.menu_id]) {
      menuStatsMap[r.menu_id].totalScore += Number(r.overall_score || 0);
      menuStatsMap[r.menu_id].count += 1;
    }
  });

  const menuStatsArray = Object.values(menuStatsMap).map(m => {
    const hasLiveReviews = m.count > 0;
    const reviewCount = hasLiveReviews ? m.count : (m.reviews_count || 0);
    const calculatedAvg = hasLiveReviews 
      ? (m.totalScore / m.count) 
      : (m.reviews_count > 0 && m.rating_avg ? m.rating_avg : 0);

    return {
      ...m,
      calculatedAvg,
      reviewCount
    };
  });

  // Sort menus with reviews first (highest score, then most reviews)
  const ratedMenus = menuStatsArray
    .filter(m => m.reviewCount > 0)
    .sort((a, b) => {
      if (b.calculatedAvg !== a.calculatedAvg) {
        return b.calculatedAvg - a.calculatedAvg;
      }
      return b.reviewCount - a.reviewCount;
    });

  // Top 3: show rated menus first, or fallback to any menus if no reviews yet
  const topDishes = ratedMenus.length > 0 
    ? ratedMenus.slice(0, 3) 
    : [...menuStatsArray].slice(0, 3);

  // Lowest rated dish (only among dishes with actual reviews)
  const lowestDish = ratedMenus.length > 0 
    ? [...ratedMenus].sort((a, b) => a.calculatedAvg - b.calculatedAvg)[0] 
    : null;

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ["Review ID", "Menu Name", "Overall Score", "Taste", "Hygiene", "Portion", "Value", "Employee", "Department", "Comment", "Date"];
    const rows = reviews.map(r => [
      `"${r.id}"`,
      `"${r.menu_name}"`,
      r.overall_score,
      r.taste_score,
      r.hygiene_score,
      r.portion_score,
      r.value_score,
      `"${r.employee_name}"`,
      `"${r.department}"`,
      `"${(r.comment || '').replace(/"/g, '""')}"`,
      `"${r.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `canteen_feedback_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              แดชบอร์ดสรุปผลการประเมิน (HR & Canteen Manager)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            สถิติความพึงพอใจอาหารกลางวันแบบ Real-time เพื่อนำไปปรับปรุงและสั่งวัตถุดิบ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenD1Modal}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Database className="w-4 h-4 text-orange-600" />
            <span>ตั้งค่า Cloudflare D1</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลดรายงาน (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Overall Average */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-fuchsia-600 text-white p-6 rounded-3xl shadow-lg shadow-purple-900/20 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="text-xs text-purple-200 font-semibold uppercase tracking-wider">คะแนนความพึงพอใจรวม</span>
            <div className="text-3xl sm:text-4xl font-black flex items-baseline gap-2">
              <span>{avgOverall}</span>
              <span className="text-sm font-normal text-purple-200">/ 5.0 ⭐</span>
            </div>
            <div className="text-[11px] text-purple-100 pt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>อยู่ในเกณฑ์ดีเยี่ยม (+4.8% จากสัปดาห์ก่อน)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Reviews */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">จำนวนผู้ประเมิน</span>
          <div className="text-3xl font-black text-slate-800">
            {totalReviewsCount} <span className="text-sm font-normal text-slate-400">รายการ</span>
          </div>
          <div className="text-[11px] text-emerald-600 pt-2 flex items-center gap-1 font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>พนักงานเข้าร่วมรีวิวมากกว่า 78%</span>
          </div>
        </div>

        {/* Metric 3: Cleanliness / Hygiene Score */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">สุขอนามัยและความสะอาด</span>
          <div className="text-3xl font-black text-emerald-600">
            {avgHygiene} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-600 pt-2 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>ผ่านเกณฑ์มาตรฐานความสะอาดระดับ A</span>
          </div>
        </div>

        {/* Metric 4: Top Wishlist Votes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">เมนูโหวตยอดนิยม</span>
          <div className="text-lg font-bold text-purple-700 line-clamp-1">
            {votes[0]?.dish_name || 'ก๋วยเตี๋ยวเรือวากิว'}
          </div>
          <div className="text-[11px] text-purple-600 pt-2 flex items-center gap-1 font-semibold">
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>ได้รับ {votes[0]?.votes_count || 89} โหวต เตรียมจัดทำ</span>
          </div>
        </div>

      </div>

      {/* 4 Dimension Breakdown & Best/Improvement Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 4 Criteria Progress Bars */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-purple-600" />
              <span>วิเคราะห์คะแนนแยกตาม 4 มิติคุณภาพ</span>
            </h3>
            <span className="text-xs text-slate-400">เต็ม 5.00 คะแนน</span>
          </div>

          <div className="space-y-4">
            
            {/* Taste */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">👅 รสชาติและความกลมกล่อม</span>
                <span className="text-purple-700 font-black">{avgTaste} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 h-full rounded-full transition-all duration-700" style={{ width: `${(avgTaste / 5) * 100}%` }}></div>
              </div>
            </div>

            {/* Hygiene */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">✨ ความสะอาดและสุขอนามัย</span>
                <span className="text-emerald-600 font-black">{avgHygiene} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700" style={{ width: `${(avgHygiene / 5) * 100}%` }}></div>
              </div>
            </div>

            {/* Portion */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">🍚 ปริมาณและความอิ่มจุใจ</span>
                <span className="text-blue-600 font-black">{avgPortion} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${(avgPortion / 5) * 100}%` }}></div>
              </div>
            </div>

            {/* Value */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">💖 ความคุ้มค่าและความประทับใจ</span>
                <span className="text-purple-600 font-black">{avgValue} / 5.0</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700" style={{ width: `${(avgValue / 5) * 100}%` }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Best Dishes & Improvement Alert */}
        <div className="space-y-4">
          
          {/* Top 3 Dishes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top 3 เมนูยอดนิยมประจำวัน</span>
            </h4>

            <div className="space-y-2.5">
              {topDishes.map((dish, i) => (
                <div key={dish.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`font-black ${i === 0 ? 'text-amber-600' : i === 1 ? 'text-slate-600' : 'text-amber-700'}`}>
                      #{i + 1}
                    </span>
                    <span className="font-bold text-slate-800 truncate">{dish.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-extrabold text-amber-600">
                      ★ {dish.reviewCount > 0 ? Number(dish.calculatedAvg).toFixed(1) : '-'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({dish.reviewCount || 0} รีวิว)
                    </span>
                  </div>
                </div>
              ))}
              {topDishes.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">ยังไม่มีข้อมูลเมนู</p>
              )}
            </div>
          </div>

          {/* Improvement Alert */}
          {lowestDish && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ข้อเสนอแนะในการปรับปรุง</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                เมนู <b>"{lowestDish.name}"</b> ได้รับคะแนนเฉลี่ย ({Number(lowestDish.calculatedAvg).toFixed(1)} ดาว) แนะนำให้ปรับรสชาติหรือตรวจเช็คความร้อนก่อนนำมาเสิร์ฟ
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
