'use client';

import { useState, useEffect } from 'react';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage('');
      setIsShaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '147258') {
      setErrorMessage('');
      onSuccess();
    } else {
      setErrorMessage('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleQuickDigit = (digit) => {
    if (password.length < 6) {
      const nextPin = password + digit;
      setPassword(nextPin);
      if (nextPin.length === 6) {
        if (nextPin === '147258') {
          onSuccess();
        } else {
          setErrorMessage('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      }
    }
  };

  const handleDeleteDigit = () => {
    setPassword(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 ${
        isShaking ? 'animate-bounce' : ''
      }`}>
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white">
            ยืนยันรหัสผ่าน Admin
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            กรุณาระบุรหัสผ่านเพื่อเข้าถึงฟังก์ชันจัดการและแก้ไขเมนูอาหาร
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                maxLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="ระบุรหัส 6 หลัก (147258)"
                className="w-full text-center tracking-widest text-lg font-bold p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 text-center animate-fadeIn flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* Quick Number Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuickDigit(num)}
                className="py-3 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-100 text-base font-bold text-slate-700 active:scale-95 transition-all shadow-2xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPassword('')}
              className="py-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-200 active:scale-95 transition-all"
            >
              ล้าง
            </button>
            <button
              type="button"
              onClick={() => handleQuickDigit('0')}
              className="py-3 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-100 text-base font-bold text-slate-700 active:scale-95 transition-all shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDeleteDigit}
              className="py-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-200 active:scale-95 transition-all"
            >
              ⌫ ลบ
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95"
            >
              ยืนยันรหัสผ่าน
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
