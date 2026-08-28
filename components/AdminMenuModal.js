'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Edit3, Trash2, Image, Sparkles, CheckCircle2, Flame, Utensils, AlertCircle, ChefHat, Calendar, Upload, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENU_CATEGORIES, ALLERGEN_OPTIONS, getMenuDayInfo } from '@/lib/initial-data';

// Default preset images
const DEFAULT_PRESET_IMAGES = [
  { id: 'img-1', name: 'ผัดกะเพราหมูกรอบ', url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-2', name: 'ต้มยำกุ้งน้ำข้น', url: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-3', name: 'สลัดอกไก่คลีน', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-4', name: 'แกงเขียวหวานไก่', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-5', name: 'ข้าวเหนียวมะม่วง', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-6', name: 'น้ำแตงโม/ผลไม้สด', url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-7', name: 'ข้าวขาหมูเยอรมัน', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-8', name: 'ก๋วยเตี๋ยวเรือเนื้อ', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { id: 'img-9', name: 'ปลาแซลมอนย่าง', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80' },
];

const STORAGE_CUSTOM_IMAGES = 'canteen_custom_food_images_v2';

export default function AdminMenuModal({ isOpen, onClose, menuToEdit, onSaveMenu, onDeleteMenu }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('main');
  const [station, setStation] = useState('ซุ้มตามสั่งจานด่วน (เชฟสมชาย)');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(450);
  const [allergens, setAllergens] = useState([]);
  const [imageUrl, setImageUrl] = useState(DEFAULT_PRESET_IMAGES[0].url);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic image list (presets + uploaded images)
  const [imageList, setImageList] = useState(DEFAULT_PRESET_IMAGES);
  const fileInputRef = useRef(null);

  const isEditing = Boolean(menuToEdit);

  // Load custom images from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_IMAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImageList(parsed);
          return;
        }
      }
    } catch (e) {}
    setImageList(DEFAULT_PRESET_IMAGES);
  }, [isOpen]);

  // Sync form values when editing a menu
  useEffect(() => {
    if (menuToEdit) {
      setName(menuToEdit.name || '');
      setCategory(menuToEdit.category || 'main');
      const safeStation = (menuToEdit.station && !menuToEdit.station.includes('?') && !menuToEdit.station.includes('w'))
        ? menuToEdit.station 
        : 'ซุ้มตามสั่งจานด่วน (เชฟสมชาย)';
      setStation(safeStation);
      setDescription(menuToEdit.description || '');
      setCalories(menuToEdit.calories || 450);
      
      const parsedAllergens = Array.isArray(menuToEdit.allergens) 
        ? menuToEdit.allergens 
        : (typeof menuToEdit.allergens === 'string' && menuToEdit.allergens ? menuToEdit.allergens.split(',') : []);
      setAllergens(parsedAllergens);

      const targetImg = menuToEdit.image_url || DEFAULT_PRESET_IMAGES[0].url;
      setImageUrl(targetImg);

      // If the editing menu's image isn't in the list, add it as a thumbnail
      setImageList(prev => {
        if (!prev.some(item => item.url === targetImg)) {
          return [{ id: `img-current-${Date.now()}`, name: menuToEdit.name || 'รูปปัจจุบัน', url: targetImg }, ...prev];
        }
        return prev;
      });

      setDate(menuToEdit.date || new Date().toISOString().split('T')[0]);
      setIsSpecial(Boolean(menuToEdit.is_special));
    } else {
      setName('');
      setCategory('main');
      setStation('ซุ้มตามสั่งจานด่วน (เชฟสมชาย)');
      setDescription('');
      setCalories(450);
      setAllergens(['Gluten']);
      setImageUrl(DEFAULT_PRESET_IMAGES[0].url);
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

  // Handle local image file upload & compression
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress & resize image via Canvas for optimal D1 payload size
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        const newImageItem = {
          id: `img-custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 15),
          url: compressedDataUrl,
          isCustom: true
        };

        const updatedList = [newImageItem, ...imageList];
        setImageList(updatedList);
        setImageUrl(compressedDataUrl);

        try {
          localStorage.setItem(STORAGE_CUSTOM_IMAGES, JSON.stringify(updatedList));
        } catch (err) {}

        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  // Delete image from preset/uploaded list
  const handleDeleteImageFromList = (e, imgItem) => {
    e.stopPropagation();
    if (imageList.length <= 1) {
      alert('ต้องมีรูปภาพในลิสต์อย่างน้อย 1 รูปครับ');
      return;
    }

    const updatedList = imageList.filter(item => item.id !== imgItem.id);
    setImageList(updatedList);

    try {
      localStorage.setItem(STORAGE_CUSTOM_IMAGES, JSON.stringify(updatedList));
    } catch (err) {}

    // If deleted image was currently selected, select another one
    if (imageUrl === imgItem.url) {
      setImageUrl(updatedList[0].url);
    }
  };

  // Reset to default presets
  const handleResetDefaultImages = () => {
    if (confirm('คุณต้องการรีเซ็ตลิสต์รูปภาพกลับเป็นค่าเริ่มต้นทั้งหมดหรือไม่?')) {
      setImageList(DEFAULT_PRESET_IMAGES);
      setImageUrl(DEFAULT_PRESET_IMAGES[0].url);
      try {
        localStorage.removeItem(STORAGE_CUSTOM_IMAGES);
      } catch (err) {}
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อเมนูอาหาร');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      id: isEditing ? menuToEdit.id : `m-${Date.now()}`,
      name: name.trim(),
      category,
      station,
      description: description.trim(),
      calories: Number(calories) || 0,
      allergens,
      image_url: imageUrl.trim() || DEFAULT_PRESET_IMAGES[0].url,
      date,
      is_special: isSpecial,
      rating_avg: menuToEdit?.rating_avg || 0,
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
                placeholder="เช่น ซุ้มตามสั่งจานด่วน (เชฟสมชาย)"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span>วันที่เสิร์ฟ</span>
                </label>
                <span className="text-[11px] font-bold text-orange-600">
                  {getMenuDayInfo(date).name}
                </span>
              </div>

              {/* Quick Day Selector (Mon - Sat) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { name: 'จันทร์', dayNum: 1 },
                  { name: 'อังคาร', dayNum: 2 },
                  { name: 'พุธ', dayNum: 3 },
                  { name: 'พฤหัสฯ', dayNum: 4 },
                  { name: 'ศุกร์', dayNum: 5 },
                  { name: 'เสาร์', dayNum: 6 },
                ].map((d) => {
                  const isCurrent = getMenuDayInfo(date).dayNum === d.dayNum;
                  return (
                    <button
                      key={d.dayNum}
                      type="button"
                      onClick={() => {
                        const current = new Date(date || new Date());
                        const currentDay = current.getDay();
                        const diff = d.dayNum - (currentDay === 0 ? 7 : currentDay);
                        const targetDate = new Date(current);
                        targetDate.setDate(current.getDate() + diff);
                        setDate(targetDate.toISOString().split('T')[0]);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isCurrent
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-orange-100 text-slate-600'
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
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

          {/* Row 5: Food Image Selector & Upload & Delete in List */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-orange-500" />
                <span>รูปภาพอาหาร (เลือกจากลิสต์ หรืออัปโหลดรูปเอง):</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Upload Image Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'กำลังประมวลผลรูป...' : '📸 อัปโหลดรูปภาพใหม่'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultImages}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs transition-colors"
                  title="รีเซ็ตลิสต์รูปภาพเป็นค่าเริ่มต้น"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Presets & Uploaded Images Grid with Delete Button */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1">
              {imageList.map((img) => {
                const isSelected = imageUrl === img.url;
                return (
                  <div
                    key={img.id}
                    onClick={() => setImageUrl(img.url)}
                    className={`relative rounded-2xl overflow-hidden h-20 border-2 transition-all cursor-pointer group ${
                      isSelected ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105 shadow-md' : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] text-white px-1 py-0.5 text-center font-medium truncate">
                      {img.name}
                    </span>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shadow">
                        ✓
                      </div>
                    )}

                    {/* Delete Image from list Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteImageFromList(e, img)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow"
                      title="ลบรูปนี้ออกจากลิสต์"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom URL Input */}
            <div className="pt-1">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="หรือวางลิงก์รูปภาพอาหาร (https://... หรือ data:image/...)"
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
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

          {/* Delete Confirmation Box (when active) */}
          {isEditing && showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>คุณแน่ใจหรือไม่ว่าต้องการลบเมนู "{menuToEdit?.name}" ออกจาก Cloudflare D1?</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-colors"
                >
                  {isSubmitting ? 'กำลังลบ...' : 'ยืนยันลบเมนู'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          {/* Bottom Actions & Delete */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Delete button (only when editing) */}
            {isEditing ? (
              !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
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