'use client';

import { useState, useEffect } from 'react';
import { X, Settings, RotateCcw, Check, Sparkles, Layout, MessageSquare, Megaphone, Heading } from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '@/lib/initial-data';
import confetti from 'canvas-confetti';

export default function AdminSiteConfigModal({ isOpen, onClose, siteConfig, onSaveConfig }) {
  const [formData, setFormData] = useState(siteConfig || DEFAULT_SITE_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (siteConfig) {
      setFormData(siteConfig);
    }
  }, [siteConfig, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetToDefault = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อความหัวข้อทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setFormData(DEFAULT_SITE_CONFIG);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(formData);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">แก้ไขข้อความหัวข้อ & แบนเนอร์ (Admin)</h3>
              <p className="text-xs text-slate-300">กำหนดชื่อแท็บเมนู, หัวข้อแบนเนอร์, และนโยบายอาหารกลางวัน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Tab Titles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
              <Layout className="w-4 h-4 text-orange-500" />
              <span>1. ชื่อแท็บนำทาง (Navigation Tabs)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">แท็บ 1: เมนูอาหาร</label>
                <input
                  type="text"
                  value={formData.tabMenu || ''}
                  onChange={(e) => handleChange('tabMenu', e.target.value)}
                  placeholder="เช่น เมนูวันนี้"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">แท็บ 2: รีวิว & ความคิดเห็น</label>
                <input
                  type="text"
                  value={formData.tabReviews || ''}
                  onChange={(e) => handleChange('tabReviews', e.target.value)}
                  placeholder="เช่น รีวิว & ความคิดเห็น"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">แท็บ 3: โหวตเมนู</label>
                <input
                  type="text"
                  value={formData.tabVoting || ''}
                  onChange={(e) => handleChange('tabVoting', e.target.value)}
                  placeholder="เช่น โหวตเมนูสัปดาห์หน้า"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">แท็บ 4: แดชบอร์ดสรุปผล</label>
                <input
                  type="text"
                  value={formData.tabDashboard || ''}
                  onChange={(e) => handleChange('tabDashboard', e.target.value)}
                  placeholder="เช่น แดชบอร์ด HR/แม่ครัว"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banner & Policy Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
              <Megaphone className="w-4 h-4 text-orange-500" />
              <span>2. แบนเนอร์ & นโยบายอาหารกลางวัน (Hero Banner)</span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">ป้ายกำกับด้านบน (Badge)</label>
                <input
                  type="text"
                  value={formData.bannerBadge || ''}
                  onChange={(e) => handleChange('bannerBadge', e.target.value)}
                  placeholder="เช่น เมนูมื้อเที่ยงพร้อมเสิร์ฟแล้ววันนี้"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">หัวข้อใหญ่แบนเนอร์ (Main Headline / Slogan)</label>
                <input
                  type="text"
                  value={formData.bannerTitle || ''}
                  onChange={(e) => handleChange('bannerTitle', e.target.value)}
                  placeholder="เช่น อิ่มอร่อย สด สะอาด พร้อมฟังทุกเสียงของคุณ 🍽️"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">คำโปรย / นโยบายความสะอาดและการรับฟังความคิดเห็น (Subtitle / Policy)</label>
                <textarea
                  rows={3}
                  value={formData.bannerSubtitle || ''}
                  onChange={(e) => handleChange('bannerSubtitle', e.target.value)}
                  placeholder="เช่น ร่วมประเมินรสชาติและคุณภาพอาหาร เพื่อเป็นกำลังใจให้แม่ครัวและพัฒนาเมนูในทุกๆ วัน..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium leading-relaxed focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Brand & App Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
              <Heading className="w-4 h-4 text-orange-500" />
              <span>3. ชื่อระบบ & คำอธิบายส่วนหัว (System Branding)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">ชื่อระบบ (Brand Name)</label>
                <input
                  type="text"
                  value={formData.brandName || ''}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  placeholder="เช่น YumCanteen"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">คำขยายชื่อระบบ (Subtitle Badge)</label>
                <input
                  type="text"
                  value={formData.brandSubtitle || ''}
                  onChange={(e) => handleChange('brandSubtitle', e.target.value)}
                  placeholder="เช่น ระบบประเมินอาหารพนักงาน"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              ตัวอย่างการแสดงผลบนแบนเนอร์ (Preview):
            </span>
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-4 rounded-2xl space-y-1 shadow-sm">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
                {formData.bannerBadge || 'เมนูมื้อเที่ยงพร้อมเสิร์ฟแล้ววันนี้'}
              </div>
              <h4 className="text-base sm:text-lg font-black leading-snug">
                {formData.bannerTitle || 'อิ่มอร่อย สด สะอาด พร้อมฟังทุกเสียงของคุณ 🍽️'}
              </h4>
              <p className="text-[11px] text-orange-100 leading-relaxed">
                {formData.bannerSubtitle || 'ร่วมประเมินรสชาติและคุณภาพอาหาร...'}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าเริ่มต้น</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
