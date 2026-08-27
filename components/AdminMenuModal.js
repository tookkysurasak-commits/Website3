'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Image, Sparkles, CheckCircle2, Flame, Utensils, AlertCircle, ChefHat, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENU_CATEGORIES, ALLERGEN_OPTIONS } from '@/lib/initial-data';

// Preset appetizing food images for 1-click selection
const PRESET_FOOD_IMAGES = [
  { name: 'ผัดกะเพราหมูกรอบ', url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80' },
  { name: 'ต้มยำกุ้งน้ำข้น', url: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80' },
  { name: 'สลัดอกไก่คลีน', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { name: 'แกงเขียวหวานไก่', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80' },
  { name: 'ข้าวเหนียวมะม่วง', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80' },
  { name: 'น้ำแตงโม/ผลไม้สด', url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80' },
  { name: 'ข้าวขาหมูเยอรมัน', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'ก๋วยเตี๋ยวเรือเนื้อ', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { name: 'ปลาแซลมอนย่าง', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminMenuModal({ isOpen, onClose, menuToEdit, onSaveMenu, onDeleteMenu }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('main');
  const [station, setStation] = useState('ซุ้มตามสั่งจานด่วน (เชฟสมชาย)');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(450);
  const [allergens, setAllergens] = useState([]);
  const [imageUrl, setImageUrl] = useState(PRESET_FOOD_IMAGES[0].url);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = Boolean(menuToEdit);

  useEffect(() => {
    if (menuToEdit) {
      const safeStation = (menuToEdit.station && !menuToEdit.station.includes('?') && !menuToEdit.station.includes('w'))
        ? menuToEdit.station 
        : 'ซุ้มตามสั่งจานด่วน (เชฟสมชาย)';
      setStation(safeStation);
      setCalories(menuToEdit.calories || 450);
      setAllergens(Array.isArray(menuToEdit.allergens) ? menuToEdit.allergens : []);
      setImageUrl(menuToEdit.image_url || PRESET_FOOD_IMAGES[0].url);
      setDate(menuToEdit.date || new Date().toISOString().split('T')[0]);
      setIsSpecial(Boolean(menuToEdit.is_special));
    } else {
      setName('');
      setCategory('main');
      setStation('ซุ้มตามสั่งจานด่วน (เชฟสมชาย)');
      setDescription('');
      setCalories(450);
      setAllergens(['Gluten']);
      setImageUrl(PRESET_FOOD_IMAGES[0].url);
      setDate(new Date().toISOString().split('T')[0]);
      setIsSpecial(false);
    }
    setShowDeleteConfirm(false);
  }, [menuToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAllergen = (allergenId) => {
    setAllergens(prev =>
      prev.includes(allergenId)
        ? prev.filter(a => a !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const payload = {
      id: isEditing ? menuToEdit.id : `m-${Date.now()}`,
      name: name.trim(),
      category,
      station,
      description: description.trim(),
      calories: Number(calories) || 0,
      allergens,
      image_url: imageUrl.trim() || PRESET_FOOD_IMAGES[0].url,
      date,
      is_special: isSpecial,
      rating_avg: menuToEdit?.rating_avg || 5.0,
      reviews_count: menuToEdit?.reviews_count || 0
    };

    try {
      await onSaveMenu(payload, isEditing);
      
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!menuToEdit) return;
    setIsSubmitting(true);
    try {
      await onDeleteMenu(menuToEdit.id);
      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-orange-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-500/30">
              {isEditing ? <Edit3 className="w-6 h-6" /> : <ChefHat className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
                Canteen Menu Management (Cloudflare D1)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                {isEditing ? `แก้ไขเมนู: ${menuToEdit.name}` : 'เพิ่มเมนูอาหารกลางวันใหม่ 🍛'}
              </h2>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700">
          
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ชื่อเมนูอาหาร *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ข้าวผัดต้มยำกุ้งแม่น้ำ, ข้าวซอยไก่..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                หมวดหมู่อาหาร *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              >
                <option value="main">อาหารจานหลัก / ผัด-ทอด</option>
                <option value="soup_curry">แกง / ต้มยำ / ซุป</option>
                <option value="healthy_veg">เพื่อสุขภาพ / คลีน / สลัด</option>
                <option value="dessert">ของหวาน / ขนมไทย</option>
                <option value="drink_fruit">ผลไม้ / เครื่องดื่ม</option>
              </select>
            </div>
          </div>

          {/* Row 2: Station & Calories & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ซุ้มอาหาร / แม่ครัว
              </label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="เช่น ซุ้มตามสั่งจานด่วน"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>พลังงาน (แคลอรี่ kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                max="2500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-orange-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>วันที่เสิร์ฟ</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              คำบรรยาย / วัตถุดิบเด่น
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="บอกรายละเอียด เช่น หมูกรอบคัดพิเศษ ผัดพริกแห้งหอมกลิ่นกระทะ เสิร์ฟพร้อมไข่ดาว..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Row 4: Allergens Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              ข้อมูลสารก่อภูมิแพ้ (Allergens - เลือกได้หลายข้อ):
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((item) => {
                const isSelected = allergens.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAllergen(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-600 shadow-sm scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Food Image Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              รูปภาพอาหาร (เลือกภาพตัวอย่างสำเร็จรูป หรือระบุลิงก์รูปเอง):
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PRESET_FOOD_IMAGES.map((img, idx) => {
                const isSelected = imageUrl === img.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`relative rounded-2xl overflow-hidden h-20 border-2 transition-all group ${
                      isSelected ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105 shadow-md' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white p-1 text-center font-medium truncate">
                      {img.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input */}
            <div className="pt-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="หรือวางลิงก์รูปภาพอาหาร (https://...)"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Row 6: Special Menu Flag */}
          <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-slate-800">ตั้งเป็น "เมนูแนะนำประจำวัน ⭐"</div>
                <div className="text-[11px] text-slate-500">จะมีป้ายไฮไลท์สีทองโดดเด่นบนหน้าเว็บ</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSpecial(!isSpecial)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSpecial ? 'bg-orange-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSpecial ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Bottom Actions & Delete */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Delete button (only when editing) */}
            {isEditing ? (
              showDeleteConfirm ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-rose-600">ยืนยันลบเมนูนี้?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    ลบเลย
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ลบเมนูนี้ออกจากระบบ</span>
                </button>
              )
            ) : <div />}

            {/* Save / Cancel buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังบันทึกลง D1...' : isEditing ? 'บันทึกการแก้ไขลง D1' : 'เพิ่มเมนูลง Cloudflare D1 🎉'}</span>
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
