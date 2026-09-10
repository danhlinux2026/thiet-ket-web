import { CanvasSection, TemplateDefinition, WebsiteTheme, SEOSettings } from '../types';

export const CAR_RENTAL_CSS = `
:root {
    --navy: #0f172a;
    --navy-2: #1e293b;
    --blue: #2563eb;
    --blue-dark: #1d4ed8;
    --amber: #f59e0b;
    --amber-dark: #d97706;
    --green: #10b981;
    --green-dark: #059669;
    --ink: #0f172a;
    --muted: #64748b;
    --line: #e2e8f0;
    --bg: #f8fafc;
    --card: #ffffff;
    --radius: 16px;
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, .06), 0 1px 2px rgba(15, 23, 42, .04);
    --shadow-md: 0 8px 24px rgba(15, 23, 42, .08);
    --shadow-lg: 0 20px 50px rgba(15, 23, 42, .14);
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
    font-family: 'Be Vietnam Pro', Roboto, sans-serif;
    color: var(--ink);
    background: var(--bg);
    line-height: 1.6;
}

.container {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ===== TOP BAR ===== */
.topbar {
    background: var(--navy);
    color: #cbd5e1;
    font-size: .8em;
}
.topbar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
}
.topbar a { color: #fff; text-decoration: none; font-weight: 600; }
.topbar .dot { color: var(--green); }

/* ===== HEADER ===== */
.header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, .95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
}
.header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
}
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}
.logo-badge {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--blue), var(--navy));
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15em;
    box-shadow: var(--shadow-sm);
}
.logo-text b {
    display: block;
    font-size: 1.02em;
    font-weight: 800;
    line-height: 1.2;
}
.logo-text span {
    font-size: .72em;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: .3px;
}
.nav-list {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
}
.nav-list a {
    display: block;
    padding: 10px 14px;
    border-radius: 10px;
    color: #334155;
    font-weight: 600;
    font-size: .92em;
    text-decoration: none;
    transition: all .2s ease;
}
.nav-list a:hover { color: var(--blue); background: #eff6ff; }
.nav-list a i { margin-right: 6px; font-size: .9em; }

.header-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: .95em;
    padding: 11px 20px;
    border-radius: 999px;
    box-shadow: 0 6px 16px rgba(245, 158, 11, .35);
    transition: transform .2s ease, box-shadow .2s ease;
    white-space: nowrap;
}
.header-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(245, 158, 11, .45); }

.nav-toggle {
    display: none;
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 10px;
    width: 44px;
    height: 44px;
    font-size: 1.2em;
    color: var(--ink);
    cursor: pointer;
}

/* ===== HERO ===== */
.hero {
    position: relative;
    color: #fff;
    padding: 96px 0 150px;
    background:
        linear-gradient(160deg, rgba(15, 23, 42, .93) 0%, rgba(30, 64, 175, .82) 55%, rgba(37, 99, 235, .65) 100%),
        url('https://picsum.photos/seed/carhero/1920/800.jpg') center/cover no-repeat;
}
.hero-inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1.15fr .85fr;
    gap: 48px;
    align-items: center;
}
.hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(16, 185, 129, .15);
    border: 1px solid rgba(16, 185, 129, .4);
    color: #6ee7b7;
    font-size: .82em;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
}
.hero h1 {
    font-size: clamp(2em, 4.6vw, 3.3em);
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -.5px;
    margin-bottom: 16px;
}
.hero h1 .accent { color: var(--amber); }
.hero p.lead {
    font-size: 1.08em;
    color: #cbd5e1;
    max-width: 540px;
    margin-bottom: 28px;
}
.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 36px;
}
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 14px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 1em;
    text-decoration: none;
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.btn:active { transform: scale(.97); }
.btn-primary {
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    color: #fff;
    box-shadow: 0 10px 24px rgba(245, 158, 11, .4);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(245, 158, 11, .5); }
.btn-ghost {
    background: rgba(255, 255, 255, .1);
    border: 1.5px solid rgba(255, 255, 255, .35);
    color: #fff;
    backdrop-filter: blur(6px);
}
.btn-ghost:hover { background: rgba(255, 255, 255, .2); }

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
.stat {
    background: rgba(255, 255, 255, .08);
    border: 1px solid rgba(255, 255, 255, .15);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 14px 20px;
    min-width: 130px;
}
.stat b {
    display: block;
    font-size: 1.35em;
    font-weight: 800;
}
.stat span {
    font-size: .78em;
    color: #94a3b8;
    font-weight: 500;
}

/* Hero card – form gọi lại nhanh */
.hero-card {
    background: #fff;
    color: var(--ink);
    border-radius: 20px;
    box-shadow: var(--shadow-lg);
    padding: 28px;
}
.hero-card h3 {
    font-size: 1.15em;
    font-weight: 800;
    margin-bottom: 4px;
}
.hero-card .sub {
    color: var(--muted);
    font-size: .85em;
    margin-bottom: 20px;
}
.hotline-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
}
.hotline-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 800;
    color: #fff;
    transition: transform .2s ease;
}
.hotline-btn:active { transform: scale(.98); }
.hotline-btn.main { background: linear-gradient(135deg, var(--blue), var(--blue-dark)); box-shadow: 0 8px 18px rgba(37, 99, 235, .3); }
.hotline-btn.sub-line { background: linear-gradient(135deg, var(--green), var(--green-dark)); box-shadow: 0 8px 18px rgba(16, 185, 129, .3); }
.hotline-btn i {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, .18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05em;
}
.hotline-btn small { display: block; font-weight: 500; font-size: .72em; opacity: .85; }
.hero-card-note {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .8em;
    color: var(--muted);
    background: var(--bg);
    border: 1px dashed var(--line);
    border-radius: 10px;
    padding: 10px 12px;
}
.hero-card-note i { color: var(--amber); }

/* ===== SECTION chung ===== */
.section { padding: 72px 0; }
.section-head { text-align: center; max-width: 640px; margin: 0 auto 44px; }
.section-kicker {
    display: inline-block;
    color: var(--blue);
    background: #eff6ff;
    font-size: .78em;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 999px;
    margin-bottom: 14px;
}
.section-title {
    font-size: clamp(1.5em, 3vw, 2.1em);
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 10px;
}
.section-desc { color: var(--muted); font-size: .98em; }

/* ===== BẢNG GIÁ ===== */
.price-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
}
.price-card {
    background: var(--card);
    border-radius: var(--radius);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-sm);
    padding: 26px;
    transition: transform .25s ease, box-shadow .25s ease;
}
.price-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
.price-card .route {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
}
.route-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    color: #fff;
    flex-shrink: 0;
}
.route-icon.blue { background: linear-gradient(135deg, var(--blue), var(--blue-dark)); }
.route-icon.indigo { background: linear-gradient(135deg, #6366f1, #4338ca); }
.route-icon.sky { background: linear-gradient(135deg, #0ea5e9, #0369a1); }
.price-card h3 { font-size: 1.08em; font-weight: 800; margin: 0; }
.price-card .route-sub { font-size: .78em; color: var(--muted); }
.price-rows { margin-top: 16px; }
.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px dashed var(--line);
    font-size: .93em;
}
.price-row:last-child { border-bottom: none; }
.price-row .label { color: #475569; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.price-row .label i { color: #94a3b8; font-size: .85em; width: 16px; text-align: center; }
.price-row .val { font-weight: 800; color: var(--amber-dark); white-space: nowrap; }
.price-note {
    margin-top: 14px;
    font-size: .78em;
    color: var(--muted);
    background: var(--bg);
    border-radius: 10px;
    padding: 9px 12px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
}
.price-note i { color: var(--green); margin-top: 3px; }

/* ===== DỊCH VỤ ===== */
.services-band { background: var(--navy); color: #fff; }
.services-band .section-kicker { background: rgba(37, 99, 235, .18); color: #93c5fd; }
.services-band .section-desc { color: #94a3b8; }
.service-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
.service-card {
    background: var(--navy-2);
    border: 1px solid rgba(255, 255, 255, .07);
    border-radius: var(--radius);
    padding: 24px;
    transition: transform .25s ease, border-color .25s ease;
}
.service-card:hover { transform: translateY(-5px); border-color: rgba(37, 99, 235, .5); }
.service-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}
.service-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: rgba(37, 99, 235, .18);
    color: #60a5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    flex-shrink: 0;
}
.service-card h3 { font-size: 1.02em; font-weight: 700; margin: 0; color: #fff; }
.service-rows { display: flex; flex-direction: column; gap: 8px; }
.service-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .88em;
    color: #cbd5e1;
    background: rgba(255, 255, 255, .04);
    border-radius: 10px;
    padding: 9px 13px;
}
.service-row b { color: var(--amber); font-weight: 800; white-space: nowrap; }

/* ===== LOẠI XE ===== */
.vehicle-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
}
.vehicle-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform .25s ease, box-shadow .25s ease;
}
.vehicle-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
.vehicle-img { width: 100%; height: 130px; object-fit: cover; }
.vehicle-info { padding: 14px; text-align: center; }
.vehicle-info h4 { font-size: .95em; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.vehicle-info p { font-size: .78em; color: var(--muted); display: flex; align-items: center; justify-content: center; gap: 5px; margin: 0; }
.vehicle-info p i { color: var(--green); }

/* ===== ĐÁNH GIÁ ===== */
.testimonials-band { background: #eef2f7; }
.testimonial-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}
.testimonial-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
}
.stars { color: var(--amber); font-size: .85em; margin-bottom: 12px; letter-spacing: 2px; }
.testimonial-text {
    color: #334155;
    font-size: .9em;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 16px;
}
.testimonial-author { display: flex; align-items: center; gap: 11px; }
.author-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--navy));
    color: #fff;
    font-weight: 700;
    font-size: .85em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.author-info h4 { font-size: .9em; font-weight: 700; margin: 0; }
.author-info span { font-size: .75em; color: var(--muted); }

/* ===== CTA ===== */
.cta {
    position: relative;
    color: #fff;
    text-align: center;
    padding: 80px 0;
    background:
        radial-gradient(ellipse at top, rgba(37, 99, 235, .35), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e3a8a);
    overflow: hidden;
}
.cta h2 { font-size: clamp(1.6em, 3.4vw, 2.3em); font-weight: 800; margin-bottom: 12px; }
.cta p { color: #cbd5e1; max-width: 560px; margin: 0 auto 30px; font-size: 1em; }
.cta-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; }
.cta-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #6ee7b7;
    background: rgba(16, 185, 129, .12);
    border: 1px solid rgba(16, 185, 129, .35);
    border-radius: 999px;
    padding: 7px 16px;
    font-size: .82em;
    font-weight: 600;
    margin-bottom: 20px;
}

/* ===== FOOTER ===== */
.footer { background: #0b1120; color: #94a3b8; padding: 60px 0 0; }
.footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 36px;
    padding-bottom: 44px;
}
.footer h3 {
    color: #fff;
    font-size: .92em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-bottom: 16px;
}
.footer-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-brand .logo-badge { width: 38px; height: 38px; font-size: 1em; }
.footer-brand b { color: #fff; font-size: 1em; }
.footer p, .footer li { font-size: .88em; line-height: 1.7; }
.footer ul { list-style: none; margin: 0; padding: 0; }
.footer ul li { margin-bottom: 9px; }
.footer a { color: #94a3b8; text-decoration: none; transition: color .2s ease; }
.footer a:hover { color: var(--amber); }
.footer-contact p { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
.footer-contact i { color: var(--amber); margin-top: 4px; width: 16px; text-align: center; }
.footer-trust li { color: #94a3b8; }
.footer-trust i { color: var(--green); margin-right: 8px; }
.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, .08);
    padding: 20px 0;
    text-align: center;
    font-size: .8em;
    color: #64748b;
}

/* ===== NÚT NỔI ===== */
.floating-calls {
    position: fixed;
    right: 18px;
    bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999;
}
.floating-call {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.3em;
    text-decoration: none;
    box-shadow: var(--shadow-md);
    transition: transform .2s ease;
}
.floating-call:hover { transform: scale(1.08); }
.floating-call.main { background: linear-gradient(135deg, var(--green), var(--green-dark)); }
.floating-call.secondary { background: linear-gradient(135deg, var(--blue), var(--blue-dark)); width: 48px; height: 48px; font-size: 1.15em; }

.back-to-top {
    position: fixed;
    left: 18px;
    bottom: 18px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(15, 23, 42, .75);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    text-decoration: none;
    opacity: 0.8;
    z-index: 998;
    backdrop-filter: blur(6px);
}

/* ===== WIDGET TRỢ LÝ AI ===== */
.ai-fab {
    position: fixed;
    right: 18px;
    bottom: 140px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--blue), var(--blue-dark));
    color: #fff;
    font-size: 1.6em;
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(37, 99, 235, .45);
    transition: transform .25s ease, box-shadow .25s ease;
    z-index: 999;
}
.ai-fab:hover { transform: scale(1.08) rotate(-6deg); box-shadow: 0 14px 32px rgba(37, 99, 235, .55); }
.ai-fab .ai-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--amber);
    border: 2.5px solid #fff;
}
.ai-panel {
    position: fixed;
    right: 18px;
    bottom: 216px;
    width: min(440px, calc(100vw - 24px));
    height: min(680px, calc(100dvh - 230px));
    background: #fff;
    border-radius: 24px;
    border: 1px solid var(--line);
    box-shadow: 0 30px 70px rgba(15, 23, 42, .28);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 1001;
}
.ai-panel.open { display: flex; }
.ai-head {
    position: relative;
    background: linear-gradient(135deg, var(--navy) 0%, #1e3a8a 55%, var(--blue) 100%);
    color: #fff;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 13px;
    overflow: hidden;
}
.ai-head .ai-avatar {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background: linear-gradient(135deg, var(--amber), var(--amber-dark));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4em;
    flex-shrink: 0;
}
.ai-head b { display: block; font-size: 1.05em; font-weight: 800; }
.ai-head span { font-size: .78em; display: flex; align-items: center; gap: 6px; color: #bbf7d0; }
.ai-close {
    margin-left: auto;
    background: rgba(255, 255, 255, .12);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    cursor: pointer;
    font-size: 1em;
}

@media (max-width: 1024px) {
    .price-grid, .service-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .vehicle-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .testimonial-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .hero-inner { grid-template-columns: 1fr; gap: 32px; }
    .hero { padding: 48px 0 80px; text-align: center; }
    .hero-btns { justify-content: center; }
    .hero-badges { justify-content: center; }
}

@media (max-width: 768px) {
    .nav-list { display: none; }
    .nav-toggle { display: flex; align-items: center; justify-content: center; }
    .topbar-inner { flex-direction: column; align-items: flex-start; gap: 6px; text-align: left; }
    .topbar .hide-sm { display: none; }
    .price-grid, .service-grid { grid-template-columns: 1fr; gap: 16px; }
    .vehicle-grid { grid-template-columns: 1fr; gap: 16px; }
    .testimonial-grid { grid-template-columns: 1fr; gap: 16px; }
    .footer-grid { grid-template-columns: 1fr; gap: 24px; }
    .header-inner { padding: 10px 0; }
    .logo-text span { display: none; }
    
    /* Table Responsive Wrapper */
    table { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    
    /* Mobile Touch Buttons */
    .btn { width: 100%; text-align: center; justify-content: center; padding: 14px 20px; font-size: 1rem; }
    .hero-btns { flex-direction: column; width: 100%; gap: 10px; }
    .hero-btns .btn { width: 100%; }
    
    /* Vehicle Card Touch Optimization */
    .vehicle-card { padding: 16px; }
    .vehicle-img { height: 180px; object-fit: cover; }
    .vehicle-actions { flex-direction: column; gap: 8px; }
    .vehicle-actions .btn { width: 100%; }
}

@media (max-width: 480px) {
    .container { padding: 0 14px; }
    .hero { padding: 36px 0 60px; }
    .hero-title { font-size: 1.5rem; line-height: 1.3; }
    .section-title { font-size: 1.35rem; }
    .stat { flex: 1; min-width: calc(50% - 6px); padding: 12px; }
    .stat-num { font-size: 1.25rem; }
    .vehicle-img { height: 160px; }
    .price-card { padding: 16px; }
}

/* Floating Call & Zalo Bar for Mobile Phones */
@media (max-width: 768px) {
    .mobile-call-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: #0f172a;
        border-top: 1px solid #1e293b;
        padding: 8px 12px;
        display: flex;
        gap: 10px;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
    }
    .mobile-call-bar a {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px;
        border-radius: 12px;
        color: #fff;
        font-weight: 700;
        font-size: 0.9rem;
        text-decoration: none;
    }
    .mobile-btn-call { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
    .mobile-btn-zalo { background: linear-gradient(135deg, #059669, #10b981); }
    
    body { padding-bottom: 70px; }
}
`;

export const REAL_CAR_RENTAL_TEMPLATE: TemplateDefinition = {
  id: 'xedalatnhatrang-car-rental',
  name: 'Thuê Xe Đà Lạt Nha Trang – Bản Chuẩn Gốc 100%',
  category: 'landing',
  categoryName: 'Dịch Vụ & Vận Tải',
  thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop',
  description: 'Trang đặt xe chuyên tuyến Nha Trang – Đà Lạt – Cam Ranh – Sài Gòn. Tích hợp bảng giá niêm yết, danh mục hình ảnh xe thật, hotline đón 5 phút và Trợ lý AI tư vấn 24/7.',
  tags: ['Thuê Xe', 'Nha Trang', 'Đà Lạt', 'Bản Gốc 100%', 'Bảng Giá', 'Trợ Lý AI'],
  theme: {
    id: 'nha-trang-dalat-theme',
    name: 'Nha Trang - Đà Lạt Theme',
    primaryColor: '#2563eb',
    secondaryColor: '#f59e0b',
    accentColor: '#10b981',
    backgroundColor: '#f8fafc',
    cardBackground: '#ffffff',
    textColor: '#0f172a',
    textMuted: '#64748b',
    fontHeading: 'Be Vietnam Pro',
    fontBody: 'Be Vietnam Pro',
    radius: '1rem',
  },
  settings: {
    title: 'Thuê Xe Đà Lạt Nha Trang – Xe Đón 5 Phút, Giá Tốt Nhất',
    metaDescription: 'Dịch vụ thuê xe chuyên tuyến Nha Trang – Đà Lạt – Cam Ranh – Sài Gòn – Mũi Né. Xe đời mới, tài xế chuyên nghiệp, phục vụ 24/24. Hotline: 0911099712 (A Huy) – 0877 019 712',
    businessName: 'Hộ Kinh Doanh Nguyễn Trọng Tài',
    businessPhone: '0911 099 712',
    bodyClasses: 'bg-slate-50 text-slate-900',
    externalStylesheets: [
      'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    ],
    customCss: CAR_RENTAL_CSS,
  },
  sections: [
    {
      id: 'sec-topbar',
      name: 'Thanh Thông Báo Đầu Trang (Top Bar)',
      category: 'header',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<div class="topbar">
    <div class="container topbar-inner">
        <span><i class="fas fa-circle dot" style="font-size:.6em; vertical-align:middle;"></i> Phục vụ 24/24 – Xe đón sau 5 phút</span>
        <span class="hide-sm">Email: <a href="mailto:taxi@xedalatnhatrang.xyz">taxi@xedalatnhatrang.xyz</a></span>
    </div>
</div>`,
      elements: [],
    },
    {
      id: 'sec-header',
      name: 'Thanh Menu Điều Hướng & Hotline (Header)',
      category: 'header',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<header class="header">
    <div class="container header-inner">
        <a href="#home" class="logo">
            <span class="logo-badge"><i class="fas fa-car-side"></i></span>
            <span class="logo-text">
                <b>Thuê Xe Đà Lạt</b>
                <span>NHA TRANG ⇄ ĐÀ LẠT</span>
            </span>
        </a>
        <nav>
            <ul class="nav-list" id="navList">
                <li><a href="#home"><i class="fas fa-house"></i>Trang Chủ</a></li>
                <li><a href="#services"><i class="fas fa-concierge-bell"></i>Dịch Vụ</a></li>
                <li><a href="#prices"><i class="fas fa-tags"></i>Bảng Giá</a></li>
                <li><a href="#gallery"><i class="fas fa-images"></i>Hình Xe</a></li>
                <li><a href="#criteria"><i class="fas fa-star"></i>Đánh Giá</a></li>
            </ul>
        </nav>
        <div style="display:flex; align-items:center; gap:10px;">
            <a href="tel:0911099712" data-tel="main" class="header-cta"><i class="fas fa-phone"></i><span>0911 099 712</span></a>
            <button class="nav-toggle" id="navToggle" aria-label="Mở menu"><i class="fas fa-bars"></i></button>
        </div>
    </div>
</header>`,
      elements: [],
    },
    {
      id: 'sec-hero',
      name: 'Khối Hero & Biểu Mẫu Gọi Xe Nhanh',
      category: 'hero',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="hero" id="home">
    <div class="hero-inner">
        <div>
            <span class="hero-chip"><i class="fas fa-bolt"></i> Gọi là có xe đón ngay – chỉ 5 phút</span>
            <h1>Thuê Xe <span class="accent">Nha Trang</span> – <span class="accent">Đà Lạt</span> Uy Tín, Giá Tốt Nhất</h1>
            <p class="lead">Chuyên tuyến Nha Trang – Đà Lạt – Cam Ranh – Sài Gòn – Mũi Né. Xe đời mới, sạch sẽ, tài xế người trong tỉnh rành đường, phục vụ 24/24.</p>
            <div class="hero-actions">
                <a href="tel:0911099712" data-tel="main" class="btn btn-primary"><i class="fas fa-phone-alt"></i> Gọi Ngay: 0911099712 (A. Huy)</a>
                <a href="tel:0877019712" data-tel="sub" class="btn btn-ghost"><i class="fas fa-phone-volume"></i> Line phụ: 0877 019 712 (A. Huy)</a>
            </div>
            <div class="hero-stats">
                <div class="stat"><b>5 phút</b><span>Có xe đón ngay</span></div>
                <div class="stat"><b>24/24</b><span>Phục vụ ngày đêm</span></div>
                <div class="stat"><b>5+ loại xe</b><span>4 đến 29 chỗ</span></div>
                <div class="stat"><b>100%</b><span>Tài xế trong tỉnh</span></div>
            </div>
        </div>
        <aside class="hero-card">
            <h3><i class="fas fa-headset" style="color:var(--blue);"></i> Đặt xe nhanh</h3>
            <p class="sub">Gọi hotline – ưu tiên đặt lịch trước để được xe đời mới nhất</p>
            <div class="hotline-row">
                <a href="tel:0911099712" data-tel="main" class="hotline-btn main">
                    <i class="fas fa-phone-alt"></i>
                    <span>0911 099 712<small>Hotline chính – Gọi là đi ngay</small></span>
                </a>
                <a href="tel:0877019712" data-tel="sub" class="hotline-btn sub-line">
                    <i class="fas fa-phone-volume"></i>
                    <span>0877 019 712<small>Line phụ – Zalo hỗ trợ</small></span>
                </a>
            </div>
            <div class="hero-card-note">
                <i class="fas fa-shield-halved"></i>
                <span>Hộ Kinh Doanh Nguyễn Trọng Tài – đã xác thực, uy tín nhiều năm</span>
            </div>
        </aside>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-prices',
      name: 'Bảng Giá Chuyên Tuyến Minh Bạch',
      category: 'pricing',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="section" id="prices">
    <div class="container">
        <div class="section-head reveal">
            <span class="section-kicker"><i class="fas fa-tags"></i> Bảng Giá</span>
            <h2 class="section-title">Giá Xe Chuyên Tuyến Rõ Ràng</h2>
            <p class="section-desc">Giá trọn gói, không phát sinh – khớp giá khi đặt. Ưu tiên đặt trước để chọn đúng xe phù hợp.</p>
        </div>
        <div class="price-grid">
            <!-- Nha Trang ⇄ Đà Lạt -->
            <article class="price-card reveal">
                <div class="route">
                    <span class="route-icon blue"><i class="fas fa-route"></i></span>
                    <div>
                        <h3>Nha Trang ⇄ Đà Lạt</h3>
                        <span class="route-sub">Tuyến phổ biến nhất</span>
                    </div>
                </div>
                <div class="price-rows">
                    <div class="price-row"><span class="label"><i class="fas fa-car"></i>Xe 5 chỗ</span><span class="val">1.000.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-car-side"></i>Xe 7 chỗ</span><span class="val">1.200.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-van-shuttle"></i>Xe 16 chỗ</span><span class="val">2.000.000₫</span></div>
                </div>
                <div class="price-note"><i class="fas fa-circle-check"></i><span>Đưa đón tận nơi 2 đầu, hỗ trợ dừng nghỉ trên đường.</span></div>
            </article>

            <!-- Đà Lạt ⇄ Sài Gòn -->
            <article class="price-card reveal">
                <div class="route">
                    <span class="route-icon blue"><i class="fas fa-route"></i></span>
                    <div>
                        <h3>Đà Lạt ⇄ Sài Gòn</h3>
                        <span class="route-sub">Tuyến phổ biến nhất</span>
                    </div>
                </div>
                <div class="price-rows">
                    <div class="price-row"><span class="label"><i class="fas fa-car"></i>Xe 4 chỗ</span><span class="val">2.700.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-car-side"></i>Xe 7 chỗ</span><span class="val">3.000.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-van-shuttle"></i>Xe 16 chỗ</span><span class="val">5.000.000₫</span></div>
                </div>
                <div class="price-note"><i class="fas fa-circle-check"></i><span>Đưa đón tận nơi 2 đầu, hỗ trợ dừng nghỉ trên đường.</span></div>
            </article>

            <!-- Đà Lạt ⇄ S.B Liên Khương -->
            <article class="price-card reveal">
                <div class="route">
                    <span class="route-icon blue"><i class="fas fa-route"></i></span>
                    <div>
                        <h3>Đà Lạt ⇄ S.B Liên khương</h3>
                        <span class="route-sub">Đón tiễn sân bay</span>
                    </div>
                </div>
                <div class="price-rows">
                    <div class="price-row"><span class="label"><i class="fas fa-car"></i>Xe 4 chỗ</span><span class="val">2.700.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-car-side"></i>Xe 7 chỗ</span><span class="val">3.000.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-van-shuttle"></i>Xe 16 chỗ</span><span class="val">5.000.000₫</span></div>
                </div>
                <div class="price-note"><i class="fas fa-circle-check"></i><span>Đưa đón tận nơi 2 đầu, hỗ trợ dừng nghỉ trên đường.</span></div>
            </article>
            
            <!-- Cam Ranh ⇄ Đà Lạt -->
            <article class="price-card reveal">
                <div class="route">
                    <span class="route-icon indigo"><i class="fas fa-road"></i></span>
                    <div>
                        <h3>Cam Ranh ⇄ Đà Lạt</h3>
                        <span class="route-sub">Sân bay – Đà Lạt</span>
                    </div>
                </div>
                <div class="price-rows">
                    <div class="price-row"><span class="label"><i class="fas fa-car"></i>Xe 5 chỗ</span><span class="val">1.000.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-car-side"></i>Xe 7 chỗ</span><span class="val">1.200.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-van-shuttle"></i>Xe 16 chỗ</span><span class="val">2.200.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-gem"></i>Limousine 9 chỗ</span><span class="val">2.400.000₫</span></div>
                </div>
                <div class="price-note"><i class="fas fa-circle-check"></i><span>Đón tại sân bay Cam Ranh, theo dõi chuyến bay trễ.</span></div>
            </article>

            <!-- Nha Trang ⇄ Sân Bay -->
            <article class="price-card reveal">
                <div class="route">
                    <span class="route-icon sky"><i class="fas fa-plane"></i></span>
                    <div>
                        <h3>Nha Trang ⇄ Sân Bay</h3>
                        <span class="route-sub">Cam Ranh – Nha Trang</span>
                    </div>
                </div>
                <div class="price-rows">
                    <div class="price-row"><span class="label"><i class="fas fa-car"></i>Xe 5 chỗ</span><span class="val">300.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-car-side"></i>Xe 7 chỗ</span><span class="val">350.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-van-shuttle"></i>Xe 16 chỗ</span><span class="val">600.000₫</span></div>
                    <div class="price-row"><span class="label"><i class="fas fa-gem"></i>Limousine 9 chỗ</span><span class="val">1.000.000₫</span></div>
                </div>
                <div class="price-note"><i class="fas fa-circle-check"></i><span>Đúng giờ bay, tài xế đón sảnh với bảng tên.</span></div>
            </article>
        </div>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-services',
      name: 'Đầy Đủ Tuyến & Loại Hình Du Lịch',
      category: 'features',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="section services-band" id="services">
    <div class="container">
        <div class="section-head reveal">
            <span class="section-kicker"><i class="fas fa-concierge-bell"></i> Dịch Vụ</span>
            <h2 class="section-title" style="color:#fff;">Đầy Đủ Tuyến &amp; Loại Hình Du Lịch</h2>
            <p class="section-desc">Từ xe đưa đón sân bay đến tour săn mây – thuê xe theo ngày và hợp đồng dài hạn.</p>
        </div>
        <div class="service-grid">
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-car-side"></i></span>
                    <h3>Mũi Né ⇄ Đà Lạt</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>🚗 Xe 5 chỗ</span><b>1.400k</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>1.600k</b></div>
                    <div class="service-row"><span>🚌 Xe 16 chỗ</span><b>2.400k</b></div>
                </div>
            </article>
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-bus"></i></span>
                    <h3>Sài Gòn ⇄ Đà Lạt</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>🚗 Xe 5 chỗ</span><b>2.700k</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>3.000k</b></div>
                    <div class="service-row"><span>🚌 Xe 16 chỗ</span><b>5.000k</b></div>
                </div>
            </article>
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-mountain-sun"></i></span>
                    <h3>Tour Săn Mây</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>👥 Ghép đoàn</span><b>199k/người</b></div>
                    <div class="service-row"><span>🚗 Xe 4 chỗ</span><b>699k</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>799k</b></div>
                    <div class="service-row"><span>🚌 Xe 16 chỗ</span><b>1.199k</b></div>
                </div>
            </article>
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-clock"></i></span>
                    <h3>Thuê 1 Ngày Tại Đà Lạt</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>🚗 Xe 5 chỗ</span><b>899k</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>999k</b></div>
                    <div class="service-row"><span>🚌 Xe 16 chỗ</span><b>1.399k</b></div>
                </div>
            </article>
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-road"></i></span>
                    <h3>Sài Gòn ⇄ Nha Trang</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>🚗 Xe 5 chỗ</span><b>2.700k</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>3.000k</b></div>
                    <div class="service-row"><span>🚌 Xe 16 chỗ</span><b>5.000k</b></div>
                </div>
            </article>
            <article class="service-card reveal">
                <div class="service-top">
                    <span class="service-icon"><i class="fas fa-file-contract"></i></span>
                    <h3>Thuê Xe Hợp Đồng</h3>
                </div>
                <div class="service-rows">
                    <div class="service-row"><span>🚗 Xe 4 chỗ</span><b>8k/km</b></div>
                    <div class="service-row"><span>🚙 Xe 7 chỗ</span><b>9k/km</b></div>
                    <div class="service-row"><span>🚐 16 chỗ / Limo 9 chỗ</span><b>12–15k/km</b></div>
                    <div class="service-row"><span>👑 Xe sang</span><b>25k/km</b></div>
                </div>
            </article>
        </div>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-gallery',
      name: 'Hình Ảnh Các Dòng Xe Phục Vụ Thực Tế',
      category: 'gallery',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="section" id="gallery">
    <div class="container">
        <div class="section-head reveal">
            <span class="section-kicker"><i class="fas fa-images"></i> Hình Xe</span>
            <h2 class="section-title">Đa Dạng Loại Xe – Đủ Mọi Nhóm Khách</h2>
            <p class="section-desc">Từ xe gia đình 4 chỗ đến limousine cao cấp và xe 29 chỗ cho đoàn lớn.</p>
        </div>
        <div class="vehicle-grid">
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-46-01.png" alt="Toyota Raize – xe 4 chỗ tiết kiệm" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Toyota Raize</h4>
                    <p><i class="fas fa-user-group"></i> 1–4 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-46-15.png" alt="Hyundai Creta – xe 4 chỗ hiện đại" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Hyundai Creta</h4>
                    <p><i class="fas fa-user-group"></i> 1–4 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-47-19.png" alt="Ford EcoSport – xe 4 chỗ" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Ford EcoSport</h4>
                    <p><i class="fas fa-user-group"></i> 1–4 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-44-34.png" alt="Honda BR-V – xe 7 chỗ" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Honda BR-V</h4>
                    <p><i class="fas fa-user-group"></i> 5–7 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-44-43.png" alt="Hyundai Santa Fe – xe 7 chỗ rộng rãi" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Hyundai Santa Fe</h4>
                    <p><i class="fas fa-user-group"></i> 6–7 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-56-18.png" alt="Limousine 9 chỗ cao cấp" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Limousine 9 chỗ</h4>
                    <p><i class="fas fa-user-group"></i> 5–9 khách</p>
                </div>
            </article>
            <article class="vehicle-card reveal">
                <img src="https://raw.githubusercontent.com/danhcan/xedalatnhatrang/main/Ch%E1%BB%A5p%20m%C3%A0n%20h%C3%ACnh%20t%E1%BB%AB%202026-09-08%2004-56-30.png" alt="Nội thất Limousine – ghế da cao cấp" class="vehicle-img" loading="lazy">
                <div class="vehicle-info">
                    <h4>Limousine Nội Thất</h4>
                    <p><i class="fas fa-couch"></i> Ghế da sang trọng</p>
                </div>
            </article>
        </div>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-criteria',
      name: 'Đánh Giá Của Khách Hàng',
      category: 'testimonials',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="section testimonials-band" id="criteria">
    <div class="container">
        <div class="section-head reveal">
            <span class="section-kicker"><i class="fas fa-star"></i> Đánh Giá</span>
            <h2 class="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <p class="section-desc">Hàng nghìn chuyến đi an toàn – sự hài lòng của khách là ưu tiên số 1.</p>
        </div>
        <div class="testimonial-grid">
            <article class="testimonial-card reveal">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"Tôi rất hay đi Nha Trang và đã sử dụng nhiều hãng, nhưng thích dịch vụ ở đây vì sự nhiệt tình, giá cả phải chăng."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">MN</div>
                    <div class="author-info">
                        <h4>Minh Nhật</h4>
                        <span>Khách hàng</span>
                    </div>
                </div>
            </article>
            <article class="testimonial-card reveal">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"Đặt xe nhanh, đi Nha Trang – Đà Lạt xe 7 chỗ sạch sẽ giá 1tr2, giá oke xe chất lượng. Sẽ tiếp tục ủng hộ!"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">PC</div>
                    <div class="author-info">
                        <h4>Phạm Cương</h4>
                        <span>Khách hàng</span>
                    </div>
                </div>
            </article>
            <article class="testimonial-card reveal">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"Được bạn giới thiệu, đi Nha Trang – Đà Lạt xe 4 chỗ giá 1 triệu. Tài xế thông thạo đường, không phải chờ lâu."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">AN</div>
                    <div class="author-info">
                        <h4>An Nghi</h4>
                        <span>Khách hàng</span>
                    </div>
                </div>
            </article>
            <article class="testimonial-card reveal">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"Xe đẹp, mới, tài xế người trong tỉnh nhiệt tình, rành đường không đi lòng vòng. Sẽ tiếp tục ủng hộ khi quay lại!"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">TT</div>
                    <div class="author-info">
                        <h4>Thanh Thủy</h4>
                        <span>Khách hàng</span>
                    </div>
                </div>
            </article>
        </div>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-cta',
      name: 'Khối Kêu Gọi Đón Xe Ngay (CTA)',
      category: 'contact',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<section class="cta">
    <div class="container">
        <span class="cta-badge"><i class="fas fa-bolt"></i> Có mặt sau 5 phút</span>
        <h2>Gọi Là Có Xe Đón Ngay</h2>
        <p>Ưu tiên đặt lịch trước để chúng tôi bố trí xe tốt nhất và đời mới nhất. Chỉ 5 phút là có xe phục vụ bạn!</p>
        <div class="cta-actions">
            <a href="tel:0911099712" data-tel="main" class="btn btn-primary"><i class="fas fa-phone-alt"></i> Gọi: 0911 099 712</a>
            <a href="tel:0877019712" data-tel="sub" class="btn btn-ghost"><i class="fas fa-phone-volume"></i> Line phụ: 0877 019 712</a>
        </div>
    </div>
</section>`,
      elements: [],
    },
    {
      id: 'sec-footer',
      name: 'Chân Trang & Thông Tin Liên Hệ (Footer)',
      category: 'footer',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div>
                <div class="footer-brand">
                    <span class="logo-badge"><i class="fas fa-car-side"></i></span>
                    <b>Thuê Xe Đà Lạt Nha Trang</b>
                </div>
                <p>Dịch vụ thuê xe chuyên tuyến uy tín tại Tây Nguyên – Nam Trung Bộ. Xe đời mới, giá minh bạch, tài xế chuyên nghiệp, phục vụ 24/24.</p>
            </div>
            <div>
                <h3>Liên Kết</h3>
                <ul>
                    <li><a href="#home">Trang Chủ</a></li>
                    <li><a href="#services">Dịch Vụ</a></li>
                    <li><a href="#prices">Bảng Giá</a></li>
                    <li><a href="#gallery">Hình Ảnh</a></li>
                    <li><a href="#criteria">Đánh Giá</a></li>
                </ul>
            </div>
            <div>
                <h3>Chính Sách</h3>
                <ul>
                    <li><a href="#">Chính sách bảo hành</a></li>
                    <li><a href="#">Chính sách bảo mật</a></li>
                    <li><a href="#">Chính sách vận chuyển</a></li>
                    <li><a href="#">Chính sách khách hàng</a></li>
                </ul>
            </div>
            <div>
                <h3>Liên Hệ</h3>
                <div class="footer-contact">
                    <p><i class="fas fa-map-marker-alt"></i><span>Hộ Kinh Doanh Nguyễn Trọng Tài</span></p>
                    <p><i class="fas fa-phone-alt"></i><span><strong>HOTLINE: <a href="tel:0911099712" data-tel="main" style="color:#fff;">0911 099 712</a></strong></span></p>
                    <p><i class="fas fa-phone-volume"></i><span>Line phụ: <a href="tel:0877019712" data-tel="sub">0877 019 712</a></span></p>
                    <p><i class="fas fa-envelope"></i><span><a href="mailto:taxi@xedalatnhatrang.xyz">taxi@xedalatnhatrang.xyz</a></span></p>
                </div>
            </div>
        </div>
        <div class="footer-trust" style="display:flex; flex-wrap:wrap; gap:18px; padding-bottom:40px; font-size:.85em;">
            <span><i class="fas fa-circle-check"></i>Thuê xe giá rẻ</span>
            <span><i class="fas fa-circle-check"></i>Xe đời mới, sạch sẽ</span>
            <span><i class="fas fa-circle-check"></i>Website đã xác thực</span>
            <span><i class="fas fa-circle-check"></i>Tài xế chuyên nghiệp</span>
            <span><i class="fas fa-circle-check"></i>Phục vụ 24/24</span>
        </div>
    </div>
    <div class="footer-bottom">
        © 2024 Thuê Xe Đà Lạt Nha Trang. All Rights Reserved.<br>
        Cảm ơn quý khách đã tin dùng dịch vụ của chúng tôi!
    </div>
</footer>`,
      elements: [],
    },
    {
      id: 'sec-floating-widgets',
      name: 'Nút Gọi Nổi & Tiện Ích Trợ Lý AI 24/7',
      category: 'contact',
      layout: 'full-width',
      mode: 'raw_html',
      styles: { backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 },
      rawHtml: `<!-- Nút gọi nổi -->
<div class="floating-calls">
    <a href="tel:0911099712" data-tel="main" class="floating-call main" title="Gọi hotline chính" aria-label="Gọi hotline chính"><i class="fas fa-phone"></i></a>
    <a href="tel:0877019712" data-tel="sub" class="floating-call secondary" title="Gọi line phụ" aria-label="Gọi line phụ"><i class="fas fa-phone-volume"></i></a>
</div>
<a href="#" class="back-to-top" id="backToTop" title="Lên đầu trang" aria-label="Lên đầu trang"><i class="fas fa-arrow-up"></i></a>

<!-- Thanh Gọi & Zalo Cố Định Đáy Điện Thoại -->
<div class="mobile-call-bar">
    <a href="tel:0911099712" class="mobile-btn-call">
        <i class="fas fa-phone-alt"></i> Gọi Đặt Xe Ngay
    </a>
    <a href="https://zalo.me/0911099712" target="_blank" rel="noopener noreferrer" class="mobile-btn-zalo">
        <i class="fas fa-comment-dots"></i> Chat Zalo Báo Giá
    </a>
</div>

<!-- Trợ lý AI -->
<button class="ai-fab" id="aiFab" aria-label="Mở trợ lý AI">
    <i class="fas fa-robot"></i>
    <span class="ai-dot"></span>
</button>
<div class="ai-panel" id="aiPanel" role="dialog" aria-label="Trợ lý AI">
    <div class="ai-head">
        <span class="ai-avatar"><i class="fas fa-robot"></i></span>
        <div class="ai-title">
            <b>Trợ Lý Xe 24/7</b>
            <span><i class="fas fa-circle"></i> Đang hoạt động – trả lời trong 1 phút</span>
        </div>
        <button class="ai-close" id="aiClose" aria-label="Đóng chat"><i class="fas fa-times"></i></button>
    </div>
    <div class="ai-msgs" id="aiMsgs"></div>
    <div class="ai-input">
        <input type="text" id="aiInput" placeholder="Nhập câu hỏi của bạn..." autocomplete="off">
        <button id="aiSend" aria-label="Gửi"><i class="fas fa-paper-plane"></i></button>
    </div>
    <div class="ai-foot">AI có thể nhầm lẫn – Liên hệ hotline để được xác nhận</div>
</div>`,
      elements: [],
    },
  ],
};
