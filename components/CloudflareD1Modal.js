'use client';

import { useState } from 'react';
import { X, Database, Terminal, Check, Copy, Code2, Sparkles, ExternalLink } from 'lucide-react';

export default function CloudflareD1Modal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. สร้างฐานข้อมูล Cloudflare D1',
      desc: 'รันคำสั่ง Wrangler CLI ในโฟลเดอร์โปรเจกต์:',
      cmd: 'npx wrangler d1 create canteen-db'
    },
    {
      title: '2. นำ database_id มาใส่ใน wrangler.toml',
      desc: 'ไฟล์ wrangler.toml ในโปรเจกต์นี้ถูกเตรียมไว้แล้ว เพียงใส่ database_id:',
      cmd: `[[d1_databases]]\nbinding = "DB"\ndatabase_name = "canteen-db"\ndatabase_id = "xxxx-xxxx-xxxx-xxxx"`
    },
    {
      title: '3. รัน Migration สร้างตารางใน D1 ด้วย schema.sql',
      desc: 'สร้างตาราง menus, reviews, menu_votes ลงใน D1:',
      cmd: 'npx wrangler d1 execute canteen-db --local --file=./lib/schema.sql'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
                  Edge SQL Database
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                การเชื่อมต่อ Cloudflare D1
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700">
          
          <div className="bg-orange-50 border border-orange-200/80 p-4 rounded-2xl space-y-1">
            <h4 className="font-bold text-xs text-orange-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>โปรเจกต์นี้รองรับ Cloudflare D1 เต็มรูปแบบ</span>
            </h4>
            <p className="text-xs text-orange-800 leading-relaxed">
              เราได้จัดเตรียมไฟล์ Schema (<code className="font-mono bg-orange-100 px-1 py-0.5 rounded">lib/schema.sql</code>), ไฟล์ Config (<code className="font-mono bg-orange-100 px-1 py-0.5 rounded">wrangler.toml</code>) และตัวเชื่อมต่อ Database Layer (<code className="font-mono bg-orange-100 px-1 py-0.5 rounded">lib/db.js</code>) ไว้ให้เรียบร้อยแล้ว
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {step.title}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(step.cmd, idx)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-all"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกคำสั่ง</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">{step.desc}</p>
                <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {step.cmd}
                </pre>
              </div>
            ))}
          </div>

          {/* Example D1 Query */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-orange-600" />
              <span>ตัวอย่างการ Query ข้อมูลใน Next.js API / Worker:</span>
            </h4>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto">
{`// ดึงคะแนนรีวิวเฉลี่ยของเมนูวันนี้จาก Cloudflare D1
const { results } = await env.DB.prepare(\`
  SELECT 
    menu_id,
    AVG(overall_score) as avg_score,
    COUNT(*) as total_reviews
  FROM reviews
  WHERE date = ?
  GROUP BY menu_id
\`).bind(todayDate).all();`}
            </pre>
          </div>

          {/* Close Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
