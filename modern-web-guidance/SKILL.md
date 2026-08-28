---
name: modern-web-guidance
description: แนวทางการพัฒนาเว็บสมัยใหม่ตามมาตรฐาน Google Chrome team ใช้เมื่อสร้าง HTML, CSS, JavaScript ที่ต้องการ modern web platform features, best practices, browser compatibility และ performance optimization
---

# Modern Web Guidance Skill

แนวทางจาก Google Chrome team สำหรับสร้างเว็บที่ใช้ modern web platform features แทนรูปแบบเก่า

> ที่มา: [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance)

---

## หลักการสำคัญ

### 1. ใช้ Native Web APIs แทน JavaScript Libraries

**DO**: ใช้ native browser APIs ที่มีอยู่แล้ว
**DO NOT**: ใช้ heavy JavaScript libraries สำหรับสิ่งที่ browser ทำได้เอง

| งาน | ❌ Legacy Pattern | ✅ Modern Pattern |
|---|---|---|
| Dialog/Modal | สร้าง `<div>` + JS | `<dialog>` element + `showModal()` |
| Tooltip/Popover | JavaScript positioning | Popover API + CSS Anchor Positioning |
| Lazy loading | Intersection Observer library | `loading="lazy"` attribute |
| Smooth scroll | jQuery animation | `scroll-behavior: smooth` |
| Dark mode | JavaScript toggle + class | `prefers-color-scheme` media query + `light-dark()` |
| Form validation | JavaScript validation | `:user-valid` / `:user-invalid` pseudo-classes |

### 2. CSS Layout สมัยใหม่

**DO**: ใช้ CSS features ที่รองรับทุก browser แล้ว

```css
/* Container Queries — responsive ตาม container ไม่ใช่ viewport */
.card-container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card { flex-direction: row; }
}

/* Subgrid — inherit grid จาก parent */
.grid-parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.grid-child {
  display: grid;
  grid-template-columns: subgrid;
}

/* Modern color spaces — oklch สำหรับสีที่สม่ำเสมอ */
:root {
  --primary: oklch(65% 0.25 260);
  --primary-light: oklch(85% 0.15 260);
}

/* text-wrap: balance — จัด heading ให้สวย */
h1, h2, h3 {
  text-wrap: balance;
}

/* field-sizing — input ปรับขนาดตาม content */
textarea {
  field-sizing: content;
}
```

### 3. Performance Best Practices

```html
<!-- Speculation Rules — prerender หน้าถัดไป -->
<script type="speculationrules">
{
  "prerender": [{
    "where": { "href_matches": "/products/*" },
    "eagerness": "moderate"
  }]
}
</script>

<!-- Fetch Priority — ควบคุมลำดับการโหลด -->
<img src="hero.jpg" fetchpriority="high" alt="Hero image">
<img src="thumbnail.jpg" fetchpriority="low" alt="Thumbnail">

<!-- Resource Hints -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
```

```javascript
// Scheduler API — ไม่ block main thread
await scheduler.yield();

// Lazy-loading images
// ใช้ loading="lazy" แทน Intersection Observer สำหรับ images
```

### 4. User Experience สมัยใหม่

```css
/* View Transitions — animated page transitions */
@view-transition {
  navigation: auto;
}

::view-transition-old(main) {
  animation: fade-out 0.3s ease;
}

::view-transition-new(main) {
  animation: fade-in 0.3s ease;
}

/* Scroll-driven Animations — animate ตาม scroll position */
.parallax {
  animation: parallax linear;
  animation-timeline: scroll();
}

/* Animate dialog/popover เข้า-ออก */
dialog {
  transition: opacity 0.3s, overlay 0.3s allow-discrete, display 0.3s allow-discrete;
  @starting-style {
    opacity: 0;
  }
}

/* Anchor Positioning — tooltip/popover ไม่ต้องใช้ JS */
.trigger {
  anchor-name: --my-trigger;
}
.tooltip {
  position: fixed;
  position-anchor: --my-trigger;
  top: anchor(bottom);
  left: anchor(center);
}

/* Scrollbar styling */
:root {
  scrollbar-color: oklch(60% 0 0) transparent;
  scrollbar-width: thin;
}
```

### 5. Forms & Accessibility

```html
<!-- Popover API — ไม่ต้องใช้ JavaScript -->
<button popovertarget="menu">Open Menu</button>
<div id="menu" popover>Menu content here</div>

<!-- Dialog with light dismiss -->
<dialog closedby="any" id="my-dialog">
  <p>Content</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<!-- Invoker Commands -->
<button commandfor="my-dialog" command="show-modal">Open</button>
```

```css
/* :user-invalid — show errors only after user interaction */
input:user-invalid {
  border-color: red;
  outline-color: red;
}

/* accent-color — style form controls natively */
:root {
  accent-color: oklch(65% 0.25 260);
}
```

### 6. Responsive Design

```css
/* ใช้ Container Queries แทน Media Queries สำหรับ component-level */
@container (min-width: 600px) {
  .component { /* wider layout */ }
}

/* interpolate-size — animate to/from auto */
:root {
  interpolate-size: allow-keywords;
}
.collapsible {
  height: 0;
  transition: height 0.3s;
  &.open { height: auto; }
}

/* prefers-reduced-motion — เคารพการตั้งค่าผู้ใช้ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## สรุป Checklist

เมื่อเขียนโค้ดเว็บ ให้ตรวจสอบ:

- [ ] ใช้ `<dialog>` แทน custom modal
- [ ] ใช้ Popover API แทน custom dropdown/tooltip
- [ ] ใช้ CSS Anchor Positioning แทน JS positioning
- [ ] ใช้ Container Queries สำหรับ responsive components
- [ ] ใช้ `oklch()` color space
- [ ] ใช้ `text-wrap: balance` สำหรับ headings
- [ ] ใช้ View Transitions สำหรับ page navigation
- [ ] ใช้ Speculation Rules สำหรับ prerendering
- [ ] ใช้ `fetchpriority` สำหรับ critical resources
- [ ] ใช้ `@starting-style` สำหรับ entry animations
- [ ] ตรวจสอบ `prefers-reduced-motion`
- [ ] ใช้ `:user-invalid` แทน JS form validation
