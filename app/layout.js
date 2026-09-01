import './globals.css';

export const metadata = {
  title: 'DOD Canteen - ระบบประเมินและรีวิวอาหารกลางวันพนักงาน | Cloudflare D1',
  description: 'ระบบประเมินคุณภาพอาหารกลางวันพนักงาน โหวตเมนูประจำสัปดาห์ และแดชบอร์ดสรุปสถิติความพึงพอใจสำหรับโรงอาหารและฝ่ายบุคคล (HR)',
  keywords: 'ประเมินอาหารกลางวัน, ระบบรีวิวอาหารพนักงาน, สวัสดิการอาหาร, Cloudflare D1, Next.js, Canteen Feedback, DOD Canteen',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className="overflow-x-hidden w-full max-w-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍱</text></svg>" />
      </head>
      <body className="min-h-screen bg-[#faf7f2] text-slate-800 antialiased selection:bg-orange-500 selection:text-white overflow-x-hidden w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
