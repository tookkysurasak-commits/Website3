'use client';

import { useState } from 'react';
import { Vote, Plus, Sparkles, Trophy, Heart, Flame, Utensils, CheckCircle, User, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WeeklyVotingSection({ votes, onVoteDish, onProposeDish, userVotedIds }) {
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newCategory, setNewCategory] = useState('main');
  const [proposerName, setProposerName] = useState('');

  // Calculate total votes
  const totalVotes = votes.reduce((acc, curr) => acc + curr.votes_count, 0);

  // Sort descending by votes
  const sortedVotes = [...votes].sort((a, b) => b.votes_count - a.votes_count);

  const handleVote = (dishId) => {
    onVoteDish(dishId);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f97316', '#fbbf24', '#ec4899']
      });
    } catch (e) {}
  };

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    onProposeDish({
      id: `vote-${Date.now()}`,
      dish_name: newDishName.trim(),
      category: newCategory,
      votes_count: 1,
      proposed_by: proposerName.trim() || 'พนักงานใจดี',
      tags: ['🌟 เมนูใหม่'],
      status: 'active'
    });

    setNewDishName('');
    setProposerName('');
    setIsProposeModalOpen(false);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  const getRankBadge = (index) => {
    if (index === 0) return { label: '🥇 อันดับ 1 (จัดทำแน่นอน)', color: 'bg-amber-400 text-amber-950 font-black' };
    if (index === 1) return { label: '🥈 อันดับ 2', color: 'bg-slate-300 text-slate-900 font-bold' };
    if (index === 2) return { label: '🥉 อันดับ 3', color: 'bg-amber-700 text-white font-bold' };
    return { label: `#${index + 1}`, color: 'bg-slate-100 text-slate-700 font-semibold' };
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-br from-stone-950 via-zinc-900 to-amber-950 rounded-3xl text-white p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-black/40 border border-amber-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              โหวตเมนูสำหรับสัปดาห์หน้า
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              อยากทานอะไรในสัปดาห์หน้า? โหวตเลย! 🗳️
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              เมนูที่ได้รับคะแนนโหวตสูงสุด 3 อันดับแรก จะถูกบรรจุลงในตารางอาหารกลางวันของสัปดาห์ถัดไปโดยทีมเชฟ
            </p>
          </div>

          <button
            onClick={() => setIsProposeModalOpen(true)}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap border border-amber-300/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>เสนอเมนูใหม่ที่คุณอยากกิน</span>
          </button>
        </div>
      </div>

      {/* Voting Leaderboard */}
      <div className="grid grid-cols-1 gap-4">
        {sortedVotes.map((dish, index) => {
          const rank = getRankBadge(index);
          const percent = totalVotes > 0 ? Math.round((dish.votes_count / totalVotes) * 100) : 0;
          const hasVoted = userVotedIds.includes(dish.id);

          return (
            <div
              key={dish.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${
                index === 0
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md bg-gradient-to-b from-amber-50/40 to-white'
                  : 'border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1">
                  <span className={`px-3 py-1 rounded-xl text-xs flex items-center gap-1 shrink-0 ${rank.color}`}>
                    {rank.label}
                  </span>

                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                      <span>{dish.dish_name}</span>
                      {dish.tags?.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-stone-900 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                          {t}
                        </span>
                      ))}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>เสนอโดย: <b className="text-slate-600">{dish.proposed_by}</b></span>
                      <span>•</span>
                      <span>หมวดหมู่: <b className="text-slate-600">{dish.category === 'main' ? 'อาหารจานหลัก' : dish.category === 'dessert' ? 'ของหวาน' : 'อาหารสุขภาพ'}</b></span>
                    </div>
                  </div>
                </div>

                {/* Vote Action & Stats */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-black text-slate-800">
                      {dish.votes_count} <span className="text-xs font-semibold text-slate-500">โหวต</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {percent}% ของผู้โหวตทั้งหมด
                    </div>
                  </div>

                  <button
                    onClick={() => handleVote(dish.id)}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all transform active:scale-95 ${
                      hasVoted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black shadow-md shadow-amber-500/20 hover:shadow-amber-500/30'
                    }`}
                  >
                    {hasVoted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>โหวตแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-stone-950" />
                        <span>โหวตเมนูนี้</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    index === 0
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400'
                      : 'bg-gradient-to-r from-stone-600 to-amber-600'
                  }`}
                  style={{ width: `${Math.max(percent, 4)}%` }}
                ></div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Propose Dish Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            
            <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>💡 เสนอเมนูอาหารใหม่</span>
              </h3>
              <p className="text-xs text-purple-100 mt-1">
                บอกเมนูที่คุณอยากให้แม่ครัวทำ หากได้รับความนิยม จะถูกนำไปพิจารณาเสิร์ฟจริง!
              </p>
            </div>

            <form onSubmit={handleProposeSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ชื่อเมนูอาหารที่ต้องการเสนอ *
                </label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="เช่น ข้าวผัดสับปะรดกุ้งสด, แกงกะหรี่หมูทงคัตสึ..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  หมวดหมู่อาหาร
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="main">อาหารจานหลัก / ทอด-ผัด</option>
                  <option value="soup_curry">แกง / ต้มยำ / ซุป</option>
                  <option value="healthy_veg">อาหารคลีน / สลัด / สุขภาพ</option>
                  <option value="dessert">ของหวาน / ขนมไทย</option>
                  <option value="drink_fruit">ผลไม้ / เครื่องดื่ม</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ชื่อผู้เสนอ / ทีม (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={proposerName}
                  onChange={(e) => setProposerName(e.target.value)}
                  placeholder="เช่น ฝ่ายการตลาด, ทีม Dev..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  ส่งรายชื่อเมนู 🎉
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
