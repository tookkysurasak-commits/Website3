'use client';

import { useState } from 'react';
import { X, Star, Sparkles, User, Building2, Upload, Camera, Trash2, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUICK_TAGS } from '@/lib/initial-data';

export default function RatingModal({ menu, onClose, onSubmitReview }) {
  const [scores, setScores] = useState({
    taste: 5,
    hygiene: 5,
    portion: 5,
    value: 5,
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('ฝ่ายปฏิบัติการ');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!menu) return null;

  const criteriaList = [
    { key: 'taste', label: '1. รสชาติและความกลมกล่อม (Taste)', icon: '👅', desc: 'ความอร่อย ความสด และความเข้ากันของเครื่องปรุง' },
    { key: 'hygiene', label: '2. ความสะอาดและสุขอนามัย (Hygiene)', icon: '✨', desc: 'ภาชนะ ความสะอาดของสถานที่และผู้ปรุงอาหาร' },
    { key: 'portion', label: '3. ปริมาณและความอิ่ม (Portion)', icon: '🍚', desc: 'สัดส่วนเนื้อสัตว์ ข้าว และผัก พอเหมาะพอดี' },
    { key: 'value', label: '4. ความคุ้มค่าและความประทับใจ (Overall)', icon: '💖', desc: 'ความน่าทาน คุณภาพวัตถุดิบ ตรงปก' },
  ];

  const scoreLabels = {
    5: 'ยอดเยี่ยม (5/5)',
    4: 'ดี (4/5)',
    3: 'ปานกลาง (3/5)',
    2: 'ควรปรับปรุง (2/5)',
    1: 'ไม่ผ่าน (1/5)',
  };

  const handleScoreChange = (key, value) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tagLabel) => {
    setSelectedTags(prev => 
      prev.includes(tagLabel) 
        ? prev.filter(t => t !== tagLabel)
        : [...prev, tagLabel]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateOverallScore = () => {
    const sum = scores.taste + scores.hygiene + scores.portion + scores.value;
    return Number((sum / 4).toFixed(1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const overallScore = calculateOverallScore();

    const newReview = {
      id: `rev-${Date.now()}`,
      menu_id: menu.id,
      menu_name: menu.name,
      taste_score: scores.taste,
      hygiene_score: scores.hygiene,
      portion_score: scores.portion,
      value_score: scores.value,
      overall_score: overallScore,
      employee_name: isAnonymous ? 'พนักงานไม่ประสงค์ออกนาม' : (employeeName.trim() || 'พนักงาน'),
      department: isAnonymous ? 'ไม่ระบุ' : department,
      is_anonymous: isAnonymous,
      comment: comment.trim(),
      tags: selectedTags,
      photo_url: photoPreview,
      helpful_count: 0,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#10b981', '#3b82f6']
      });
    } catch (err) {}

    setTimeout(() => {
      onSubmitReview(newReview);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-950 via-zinc-900 to-amber-950 text-white p-6 relative border-b border-amber-500/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              ⭐
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                แบบประเมินคุณภาพ & รสชาติอาหาร
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white line-clamp-1">
                {menu.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: 4 Dimensions Star Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <span>ให้คะแนนคุณภาพ 4 มิติ</span>
                <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 shadow-sm">
                  เฉลี่ย: {calculateOverallScore()} / 5.0 ⭐
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {criteriaList.map((crit) => (
                <div key={crit.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>{crit.icon}</span>
                      <span>{crit.label}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-orange-600">
                      {scoreLabels[scores[crit.key]]}
                    </span>
                  </div>

                  {/* Star Selector */}
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = starVal <= scores[crit.key];
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => handleScoreChange(crit.key, starVal)}
                          className="star-btn p-1 text-2xl focus:outline-none"
                        >
                          <span className={active ? 'text-amber-400' : 'text-slate-300'}>
                            ★
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Quick Reaction Tags */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              แท็กความรู้สึกด่วน (เลือกได้หลายข้อ):
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-sm scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Feedback Comment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              ข้อเสนอแนะเพิ่มเติม / ความคิดเห็นถึงแม่ครัวและโรงอาหาร:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="บอกความรู้สึก เช่น รสชาติเข้มข้นมาก, ข้าวเหนียวนุ่ม, อยากให้เพิ่มน้ำแกงอีกนิด ฯลฯ"
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Section 4: Photo Upload (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                แนบภาพถ่ายอาหารจริง (ถ้ามี)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">ทางเลือก</span>
            </label>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 w-36 h-36 group">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-orange-50/30 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-600 font-medium">คลิกเพื่ออัปโหลดภาพถ่ายจานอาหาร</span>
                <span className="text-[10px] text-slate-400">PNG, JPG ขนาดไม่เกิน 5MB</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Section 5: Anonymous vs Name Toggle */}
          <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">ส่งแบบไม่เปิดเผยตัวตน (Anonymous)</div>
                  <div className="text-[11px] text-slate-500">ระบบจะไม่แสดงชื่อและข้อมูลติดต่อของคุณ</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnonymous ? 'bg-orange-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-orange-200/50 animate-fadeIn">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ชื่อ / ชื่อเล่น</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="เช่น คุณณัฐพล (Dev)"
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">แผนก / ฝ่าย</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Engineering / IT">Engineering / IT</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Admin">Finance & Admin</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 border border-amber-300/30"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันและส่งคะแนนประเมิน 🎉'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
