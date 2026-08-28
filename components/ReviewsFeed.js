'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Filter, User, Building, Sparkles, CheckCircle2, Shield, Calendar } from 'lucide-react';

export default function ReviewsFeed({ reviews, menus, onToggleHelpful, helpfulIds, onOpenRatingModal }) {
  const [selectedMenuFilter, setSelectedMenuFilter] = useState('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');

  const filteredReviews = reviews.filter((rev) => {
    const matchesMenu = selectedMenuFilter === 'all' || rev.menu_id === selectedMenuFilter;
    const matchesRating = selectedRatingFilter === 'all' || Math.floor(rev.overall_score) === Number(selectedRatingFilter);
    return matchesMenu && matchesRating;
  });

  const getScoreBadgeColor = (score) => {
    if (score >= 4.5) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 3.5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-stone-900 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              ความคิดเห็นและคะแนนรีวิวจากพนักงาน
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ร่วมแชร์รสชาติและความรู้สึก เพื่อพัฒนาโรงอาหารร่วมกัน (พบทั้งหมด {reviews.length} รีวิว)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Menu dropdown */}
          <select
            value={selectedMenuFilter}
            onChange={(e) => setSelectedMenuFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">ทุกเมนูอาหาร</option>
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Star Filter */}
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">ทุกระดับคะแนน</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 ดาว)</option>
            <option value="4">⭐⭐⭐⭐ (4 ดาว)</option>
            <option value="3">⭐⭐⭐ (3 ดาว)</option>
            <option value="2">⭐⭐ (2 ดาว)</option>
            <option value="1">⭐ (1 ดาว)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => {
          const isLiked = helpfulIds.includes(rev.id);
          const parsedTags = Array.isArray(rev.tags) 
            ? rev.tags 
            : typeof rev.tags === 'string' 
              ? (rev.tags.startsWith('[') ? JSON.parse(rev.tags) : rev.tags.split(',')) 
              : [];

          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header: Menu Name & Overall Score */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-stone-900 bg-amber-100/70 px-2.5 py-0.5 rounded-md border border-amber-300">
                      🍱 {rev.menu_name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                      {rev.is_anonymous ? (
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          พนักงานไม่ประสงค์ออกนาม
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          {rev.employee_name} ({rev.department})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className={`px-2.5 py-1 rounded-xl font-extrabold text-xs flex items-center gap-1 border ${getScoreBadgeColor(rev.overall_score)}`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rev.overall_score.toFixed(1)}</span>
                  </div>
                </div>

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2 rounded-xl text-[10px] text-center font-medium text-slate-600 border border-slate-100">
                  <div>รสชาติ <b className="text-amber-700 block">{rev.taste_score}★</b></div>
                  <div>ความสะอาด <b className="text-emerald-600 block">{rev.hygiene_score}★</b></div>
                  <div>ปริมาณ <b className="text-blue-600 block">{rev.portion_score}★</b></div>
                  <div>ความคุ้มค่า <b className="text-amber-600 block">{rev.value_score}★</b></div>
                </div>
              </div>

              {/* Comment Content */}
              {rev.comment && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                  "{rev.comment}"
                </p>
              )}

              {/* Attached Photo */}
              {rev.photo_url && (
                <div className="rounded-2xl overflow-hidden max-h-48 border border-slate-100">
                  <img src={rev.photo_url} alt="Review attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Reaction Tags */}
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {parsedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: Date & Helpful Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {rev.date || 'วันนี้'}
                </span>

                <button
                  onClick={() => onToggleHelpful(rev.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isLiked
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 shadow-sm border border-amber-300/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-stone-950' : ''}`} />
                  <span>เป็นประโยชน์ ({rev.helpful_count + (isLiked ? 1 : 0)})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="text-3xl">💬</div>
          <h3 className="font-bold text-slate-700 text-base">ยังไม่มีรีวิวตามเงื่อนไขที่เลือก</h3>
          <p className="text-xs text-slate-400">ลองเปลี่ยนตัวกรอง หรือเป็นคนแรกที่รีวิวเมนูนี้!</p>
        </div>
      )}

    </div>
  );
}
