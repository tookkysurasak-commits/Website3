import fs from 'fs';

const dotenv = fs.readFileSync('.env.local', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) env[k.trim()] = rest.join('=').trim();
});

async function main() {
  console.log('--- 1. Testing Cloudflare D1 Connection ---');
  console.log('Account ID:', env.CLOUDFLARE_ACCOUNT_ID);
  console.log('Database ID:', env.CLOUDFLARE_DATABASE_ID);

  const testQuery = "SELECT name FROM sqlite_master WHERE type='table';";
  
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: testQuery })
    }
  );

  const data = await res.json();
  if (!data.success) {
    console.error('Connection Failed:', data.errors);
    return;
  }

  console.log('Tables Found in D1:', data.result[0].results.map(r => r.name));

  console.log('\n--- 2. Populating Initial Menu Data to D1 ---');
  const insertQuery = `
    INSERT OR REPLACE INTO menus (id, name, category, description, calories, allergens, image_url, date, is_special) VALUES 
    ('m-01', 'ข้าวกะเพราหมูกรอบไข่ดาวลาวา', 'main', 'หมูกรอบคัดพิเศษ ผัดกะเพราพริกแห้งหอมกลิ่นกระทะ เสิร์ฟพร้อมไข่ดาวเป็ดเยิ้มๆ', 680, 'Gluten,Egg,Pork', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', '2026-08-27', 1),
    ('m-02', 'ต้มยำกุ้งน้ำข้นยอดมะพร้าวอ่อน', 'soup_curry', 'กุ้งแชบ๊วยตัวโต ซุปต้มยำหอมเครื่องสมุนไพร ข่า ตะไคร้ ใบมะกรูด และนมข้นสดแท้', 340, 'Seafood,Dairy', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80', '2026-08-27', 1),
    ('m-03', 'สลัดอกไก่นุ่มย่างพริกไทยดำ & อะโวคาโด', 'healthy_veg', 'อกไก่หมักสมุนไพรย่างเตาถ่าน ผักไฮโดรโปนิกส์สดกรอบ 5 ชนิด น้ำสลัดงาญี่ปุ่นโฮมเมด', 310, 'Gluten', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', '2026-08-27', 0),
    ('m-04', 'ข้าวเหนียวมะม่วงน้ำดอกไม้มูนกะทิสด', 'dessert', 'มะม่วงน้ำดอกไม้สุกหวานฉ่ำ ข้าวเหนียวมูนเม็ดสวย ราดกะทิอบควันเทียนและถั่วทอง', 420, 'None', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80', '2026-08-27', 1),
    ('m-05', 'น้ำแตงโมปั่นเกล็ดหิมะ & ผลไม้รวม', 'drink_fruit', 'แตงโมสดหวานธรรมชาติ 100% ไม่เติมน้ำเชื่อม พร้อมเซ็ตแตงโม แคนตาลูป', 120, 'None', 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80', '2026-08-27', 0);
  `;

  const seedRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: insertQuery })
    }
  );

  const seedData = await seedRes.json();
  console.log('Menu Seed Status:', seedData.success ? 'SUCCESS (5 menus added)' : seedData.errors);

  console.log('\n--- 3. Verifying Menus in D1 ---');
  const checkRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: 'SELECT id, name, calories, date FROM menus;' })
    }
  );

  const checkData = await checkRes.json();
  console.log('Current Menus in Cloudflare D1:', checkData.result[0].results);
}

main();
