---
name: ui-ux-pro-max
description: Design intelligence สำหรับสร้าง UI/UX ระดับมืออาชีพ ใช้เมื่อออกแบบหน้าเว็บ, landing page, dashboard, mobile app หรือ UI ใดๆ ที่ต้องการดีไซน์สวย สี ฟอนต์ layout และ animation ที่เหมาะกับประเภทธุรกิจ
---

# UI UX Pro Max — Design Intelligence Skill

> ดัดแปลงจาก [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT License)

สกิลนี้ช่วยให้ AI สร้าง UI/UX ระดับมืออาชีพ โดยเลือก สไตล์, สี, ฟอนต์, layout, animation ที่เหมาะกับแต่ละประเภทธุรกิจ

---

## 1. Design System Generation Flow

เมื่อผู้ใช้ขอสร้าง UI ให้ทำตามขั้นตอนนี้:

```
1. วิเคราะห์ประเภทธุรกิจ/ผลิตภัณฑ์
2. เลือก UI Style ที่เหมาะสม
3. เลือก Color Palette
4. เลือกคู่ Font
5. เลือก Landing Page Pattern (ถ้าเป็นเว็บ)
6. กำหนด Effects & Animation
7. ตรวจ Anti-patterns & Checklist
```

---

## 2. UI Styles — เลือกสไตล์ตามประเภทงาน

### Minimalism
- **Keywords**: Clean, whitespace, simple, functional
- **เหมาะกับ**: Portfolio, SaaS, blog, agency
- **CSS**: `background: #fff; color: #1a1a1a; font-weight: 300; letter-spacing: 0.02em;`
- **DO**: ใช้ whitespace เยอะ, typography เป็นหลัก
- **DO NOT**: ใส่ element มากเกินไป, ใช้สีฉูดฉาด

### Glassmorphism
- **Keywords**: Frosted glass, translucent, blur, depth
- **เหมาะกับ**: Dashboard, fintech, modern SaaS, crypto
- **CSS**: `background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px;`
- **DO**: ใช้บน background gradient หรือรูปภาพ
- **DO NOT**: ใช้กับ text หนาแน่น (อ่านยาก)

### Neubrutalism
- **Keywords**: Bold borders, raw, offset shadows, playful
- **เหมาะกับ**: Creative agency, portfolio, startup, indie product
- **CSS**: `border: 3px solid #000; box-shadow: 4px 4px 0px #000; border-radius: 0;`
- **DO**: ใช้สีสด, borders หนา, typography ใหญ่
- **DO NOT**: ใช้กับ corporate/finance

### Soft UI (Neumorphism)
- **Keywords**: Soft shadows, subtle depth, calming
- **เหมาะกับ**: Wellness, beauty, spa, healthcare, lifestyle
- **CSS**: `background: #f0f0f3; box-shadow: 8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff; border-radius: 12px;`

### Dark Mode Premium
- **Keywords**: Dark background, neon accents, sleek
- **เหมาะกับ**: Gaming, crypto, dev tools, AI platform, music
- **CSS**: `background: #0a0a0f; color: #e0e0e0;`
- **Accent**: Neon blue `#00d4ff`, Neon green `#00ff88`, Purple `#8b5cf6`

### Corporate Professional
- **Keywords**: Trust, reliability, structured, clean
- **เหมาะกับ**: Banking, insurance, legal, enterprise, consulting
- **CSS**: `font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.7;`
- **DO**: ใช้ grid ชัดเจน, consistent spacing
- **DO NOT**: ใช้ animation มากเกินไป

### Editorial / Magazine
- **Keywords**: Typography-driven, storytelling, rich imagery
- **เหมาะกับ**: News, blog, magazine, publishing, content platform
- **CSS**: `font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 5vw, 4rem);`

### E-commerce Modern
- **Keywords**: Product-focused, clean grid, trust signals
- **เหมาะกับ**: Online store, marketplace, fashion, food delivery
- **DO**: Product hero images, clear CTA, trust badges
- **DO NOT**: Hide pricing, complicate checkout

---

## 3. Color Palettes — เลือกสีตามประเภทธุรกิจ

### Tech / SaaS
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Electric Blue | `#2563eb` | `#7c3aed` | `#f59e0b` | `#f8fafc` |
| Midnight Tech | `#0f172a` | `#1e40af` | `#06b6d4` | `#020617` |

### Finance / Fintech
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Trust Navy | `#1e3a5f` | `#2d6a4f` | `#f4a261` | `#f8f9fa` |
| Crypto Dark | `#0d1117` | `#7c3aed` | `#00ff88` | `#0a0a0f` |

### Healthcare / Wellness
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Calming Sage | `#a8d5ba` | `#e8b4b8` | `#d4af37` | `#fff5f5` |
| Medical Blue | `#0077b6` | `#00b4d8` | `#e63946` | `#f0f4f8` |

### E-commerce
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Modern Store | `#1a1a2e` | `#16213e` | `#e94560` | `#ffffff` |
| Luxury Gold | `#2c2c2c` | `#b8860b` | `#d4af37` | `#faf9f6` |

### Food / Restaurant
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Warm Appetite | `#b7410e` | `#f4a261` | `#e76f51` | `#fefae0` |
| Fresh Organic | `#2d6a4f` | `#95d5b2` | `#f77f00` | `#f0fff4` |

### Creative / Portfolio
| ชื่อ | Primary | Secondary | CTA | Background |
|---|---|---|---|---|
| Bold Creative | `#ff006e` | `#8338ec` | `#ffbe0b` | `#ffffff` |
| Monochrome | `#1a1a1a` | `#444444` | `#ff4444` | `#fafafa` |

---

## 4. Typography Pairings — คู่ฟอนต์ที่เข้ากัน

| Heading | Body | Mood | เหมาะกับ |
|---|---|---|---|
| **Inter** | Inter | Clean, modern, neutral | SaaS, dashboard, tech |
| **Playfair Display** | Source Sans 3 | Elegant, editorial | Magazine, luxury, blog |
| **Space Grotesk** | Inter | Techy, modern | Dev tools, crypto, AI |
| **Cormorant Garamond** | Montserrat | Sophisticated, calming | Spa, beauty, luxury |
| **DM Sans** | DM Sans | Friendly, approachable | Startup, SaaS, mobile |
| **Outfit** | Outfit | Geometric, clean | Modern dashboard, fintech |
| **Sora** | Inter | Futuristic, geometric | AI, tech, innovation |
| **Fraunces** | Commissioner | Warm, editorial | Food, lifestyle, blog |
| **Archivo** | Archivo | Strong, industrial | E-commerce, sports, auto |
| **Bricolage Grotesque** | Instrument Sans | Playful, unique | Creative, portfolio, indie |

```html
<!-- ตัวอย่างการใช้ Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
```

---

## 5. Landing Page Patterns

### Hero-Centric + Social Proof (แนะนำสำหรับส่วนใหญ่)
```
1. Hero (headline + CTA + hero image)
2. Social proof (logos/testimonials)
3. Features/Benefits
4. How it works
5. Pricing
6. FAQ
7. Final CTA
```

### Product-Led Growth
```
1. Hero with product screenshot/demo
2. Problem → Solution
3. Feature deep-dives (3-4)
4. Integration logos
5. Testimonials
6. Pricing comparison
7. CTA
```

### Storytelling / Emotional
```
1. Full-screen hero (video/image)
2. Brand story
3. Services/Products
4. Gallery/Portfolio
5. Testimonials
6. Contact/Booking
```

---

## 6. Animation Guidelines

### ระดับ Motion ตามสไตล์

| สไตล์ | ระดับ Animation | ตัวอย่าง |
|---|---|---|
| Corporate | ต่ำ | Fade in เบาๆ, hover subtle |
| SaaS / Tech | ปานกลาง | Scroll reveal, card hover lift |
| Creative / Portfolio | สูง | Parallax, page transitions, stagger |
| E-commerce | ต่ำ-ปานกลาง | Product hover zoom, cart animation |

### CSS Animation Defaults

```css
/* Hover effect พื้นฐาน */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger > * {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}
.stagger > *:nth-child(1) { animation-delay: 0.1s; }
.stagger > *:nth-child(2) { animation-delay: 0.2s; }
.stagger > *:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 7. Icons — ใช้ SVG Icon Library เท่านั้น

| Library | ใช้กับ | Import |
|---|---|---|
| **Lucide** | ทั่วไป, SaaS, dashboard | `lucide-react` หรือ `lucide-static` |
| **Heroicons** | ทั่วไป, corporate | `@heroicons/react` |
| **Phosphor** | Friendly, playful | `@phosphor-icons/react` |

**MANDATORY**: ห้ามใช้ Emoji เป็น icon ในงานจริง — ใช้ SVG icon เสมอ

---

## 8. Responsive Breakpoints

```css
/* Mobile First */
/* Default: 0 - 767px (mobile) */

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large desktop */
}
```

**ต้องทดสอบที่**: 375px, 768px, 1024px, 1440px

---

## 9. Pre-Delivery Checklist

ก่อนส่งมอบ UI ต้องตรวจสอบทุกครั้ง:

- [ ] **ไม่ใช้ Emoji เป็น icon** — ใช้ SVG (Lucide/Heroicons/Phosphor)
- [ ] **`cursor: pointer`** บนทุก clickable element
- [ ] **Contrast ratio** อย่างน้อย 4.5:1 สำหรับ text (WCAG AA)
- [ ] **Focus states** มองเห็นได้สำหรับ keyboard navigation
- [ ] **`prefers-reduced-motion`** เคารพการตั้งค่าผู้ใช้
- [ ] **Text ไม่ถูกตัด** — reflow ได้ดีทุกขนาดหน้าจอ
- [ ] **Responsive** ทดสอบที่ 375px, 768px, 1024px, 1440px
- [ ] **Loading state** มี skeleton/spinner สำหรับ async content
- [ ] **Error state** แสดง error message ที่เข้าใจง่าย
- [ ] **Empty state** มี UI สำหรับเมื่อไม่มีข้อมูล

---

## 10. Anti-patterns — สิ่งที่ห้ามทำ

| ❌ ห้ามทำ | ✅ ทำแทน |
|---|---|
| ใช้ Emoji เป็น icon | ใช้ SVG icon library |
| สีสุ่มที่ไม่มี system | ใช้ color palette ที่กำหนด |
| Font มากกว่า 2 ตระกูล | เลือก 1 heading + 1 body font |
| Animation ทุกที่ | Animation เฉพาะจุดสำคัญ |
| Gradient สี AI (ม่วง-ชมพู) ทุกงาน | เลือกสีตามประเภทธุรกิจ |
| ข้อความยาวไม่มี hierarchy | ใช้ heading, subheading, body ชัดเจน |
| Button ไม่มี hover state | ทุก button ต้องมี hover + active state |
| Layout ไม่ consistent | ใช้ spacing system (4px, 8px, 16px, 24px, 32px, 48px, 64px) |
