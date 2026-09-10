import { WebsiteProject, CanvasSection, CanvasElement } from '../types';
import { generateSchemaJsonLd } from '../services/seoService';

export function generateStandaloneHtml(project: WebsiteProject): string {
  const { theme, sections, settings } = project;

  const siteTitle = settings.title || project.name || 'Website của tôi';
  const siteDesc = settings.metaDescription || project.description || 'Trang web được thiết kế chuyên nghiệp với WebStudio';
  const canonicalUrl = settings.canonicalUrl || 'https://mywebsite.com';
  const ogImage = settings.ogImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200';
  const ogType = settings.ogType || 'website';
  const twitterCard = settings.twitterCard || 'summary_large_image';
  const language = settings.language || 'vi';
  const robotsDirective = `${settings.robotsIndex !== false ? 'index' : 'noindex'}, ${settings.robotsFollow !== false ? 'follow' : 'nofollow'}`;
  const keywords = settings.keywords || '';
  const schemaJson = generateSchemaJsonLd(project);

  const sectionsHtml = sections
    .filter((s) => !s.hidden)
    .map((section) => renderSectionHtml(section, theme))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${escapeHtml(siteTitle)}</title>
  <meta name="description" content="${escapeHtml(siteDesc)}">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ''}
  <meta name="robots" content="${robotsDirective}">
  ${settings.author ? `<meta name="author" content="${escapeHtml(settings.author)}">` : ''}
  
  <!-- Canonical URL for Google Indexing -->
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  
  ${settings.googleSiteVerification ? `<!-- Google Search Console Verification -->\n  <meta name="google-site-verification" content="${escapeHtml(settings.googleSiteVerification)}">` : ''}
  ${settings.bingSiteVerification ? `<!-- Bing Webmaster Verification -->\n  <meta name="msvalidate.01" content="${escapeHtml(settings.bingSiteVerification)}">` : ''}

  <!-- Open Graph / Facebook / Zalo -->
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(siteTitle)}">
  <meta property="og:description" content="${escapeHtml(siteDesc)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:site_name" content="${escapeHtml(settings.businessName || siteTitle)}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="${escapeHtml(twitterCard)}">
  <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  <meta name="twitter:title" content="${escapeHtml(siteTitle)}">
  <meta name="twitter:description" content="${escapeHtml(siteDesc)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  ${settings.twitterHandle ? `<meta name="twitter:creator" content="${escapeHtml(settings.twitterHandle)}">` : ''}

  ${settings.faviconUrl ? `<link rel="icon" type="image/x-icon" href="${escapeHtml(settings.faviconUrl)}">` : ''}

  <!-- Google Structured Data (Schema.org JSON-LD for Rich Snippets) -->
  <script type="application/ld+json">
${schemaJson}
  </script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Font Awesome & External Stylesheets -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  ${(settings.externalStylesheets || [])
    .map((sheet) => `<link rel="stylesheet" href="${escapeHtml(sheet)}">`)
    .join('\n  ')}

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  ${(settings.externalScripts || [])
    .filter((s) => !s.includes('tailwindcss'))
    .map((src) => `<script src="${escapeHtml(src)}"></script>`)
    .join('\n  ')}
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            heading: ['${theme.fontHeading}', 'sans-serif'],
            body: ['${theme.fontBody}', 'sans-serif'],
          },
          colors: {
            primary: '${theme.primaryColor}',
            secondary: '${theme.secondaryColor}',
            accent: '${theme.accentColor}',
          }
        }
      }
    }
  </script>
  
  <style>
    body {
      font-family: '${theme.fontBody}', sans-serif;
      background-color: ${theme.backgroundColor};
      color: ${theme.textColor};
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: '${theme.fontHeading}', sans-serif;
    }
    ${settings.customCss || ''}
  </style>
</head>
<body class="antialiased selection:bg-indigo-500 selection:text-white">

${sectionsHtml}

  <!-- Interactive Scripts -->
  <script>
    // Accordion Toggle
    document.querySelectorAll('.accordion-header').forEach(button => {
      button.addEventListener('click', () => {
        const body = button.nextElementSibling;
        const icon = button.querySelector('.accordion-icon');
        const isHidden = body.classList.contains('hidden');
        
        // Toggle current
        if (isHidden) {
          body.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          body.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    });

    // Form Submission Simulation
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn! Thông tin đã được gửi thành công.');
        form.reset();
      });
    });
  </script>
  ${settings.customJs ? `<script>\n${settings.customJs}\n</script>` : ''}
</body>
</html>`;
}

function renderSectionHtml(section: CanvasSection, theme: any): string {
  if (section.rawHtml) {
    return section.rawHtml;
  }

  const bg = section.styles.backgroundColor || 'transparent';
  const pt = section.styles.paddingTop || 60;
  const pb = section.styles.paddingBottom || 60;
  const br = section.styles.borderRadius ? `border-radius: ${section.styles.borderRadius};` : '';
  const bw = section.styles.borderWidth ? `border: ${section.styles.borderWidth}px solid ${section.styles.borderColor || '#334155'};` : '';

  const elementsHtml = section.elements.map((el) => renderElementHtml(el, theme)).join('\n');

  let layoutClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  if (section.layout === 'full-width') layoutClass = 'w-full px-4';
  if (section.layout === 'split-2') layoutClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center';
  if (section.layout === 'grid-3') layoutClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6';
  if (section.layout === 'grid-4') layoutClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6';

  const sectionTag = section.category === 'header' ? 'header' : section.category === 'footer' ? 'footer' : 'section';

  return `<${sectionTag} id="${section.id}" class="relative transition-all" style="background-color: ${bg}; padding-top: ${pt}px; padding-bottom: ${pb}px; ${br} ${bw}">
  <div class="${layoutClass}">
${elementsHtml}
  </div>
</${sectionTag}>`;
}

function renderElementHtml(el: CanvasElement, theme: any): string {
  const align = el.styles.textAlign ? `text-${el.styles.textAlign}` : '';
  const textColor = el.styles.textColor ? `color: ${el.styles.textColor};` : '';
  const fontSize = el.styles.fontSize ? `font-size: ${el.styles.fontSize};` : '';
  const fontWeight = el.styles.fontWeight ? `font-weight: ${el.styles.fontWeight};` : '';
  const customStyle = `${textColor} ${fontSize} ${fontWeight}`;

  switch (el.type) {
    case 'heading': {
      const tag = el.tag || 'h2';
      let sizeClass = 'text-3xl sm:text-4xl font-extrabold tracking-tight';
      if (tag === 'h1') sizeClass = 'text-4xl sm:text-6xl font-black tracking-tight leading-tight';
      if (tag === 'h3') sizeClass = 'text-2xl sm:text-3xl font-bold';
      if (tag === 'h4') sizeClass = 'text-xl sm:text-2xl font-semibold';
      return `<${tag} class="${sizeClass} ${align} mb-4" style="${customStyle}">${escapeHtml(el.content || '')}</${tag}>`;
    }

    case 'paragraph': {
      return `<p class="text-base sm:text-lg text-slate-300 ${align} leading-relaxed mb-6 max-w-3xl" style="${customStyle}">${escapeHtml(
        el.content || ''
      )}</p>`;
    }

    case 'button': {
      const isPrimary = el.variant !== 'secondary' && el.variant !== 'outline';
      const bgClass = isPrimary ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30' : 'border border-slate-700 hover:bg-slate-800 text-slate-200';
      return `<div class="${align} my-4">
        <a href="${escapeHtml(el.href || '#')}" class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${bgClass}">
          ${escapeHtml(el.content || 'Nhấp vào đây')}
        </a>
      </div>`;
    }

    case 'image': {
      return `<figure class="${align} my-6">
        <img src="${escapeHtml(el.src || '')}" alt="${escapeHtml(el.alt || 'Hình ảnh website')}" class="rounded-2xl max-w-full h-auto mx-auto shadow-2xl border border-slate-800/80" loading="lazy" />
      </figure>`;
    }

    case 'badge': {
      return `<div class="${align} mb-3">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          ${escapeHtml(el.content || 'HOT FEATURE')}
        </span>
      </div>`;
    }

    case 'card': {
      const items = el.items || [];
      return `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        ${items
          .map(
            (item) => `
          <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 transition duration-300 shadow-xl">
            ${item.icon ? `<div class="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center text-xl font-bold mb-4">✦</div>` : ''}
            <h3 class="text-lg font-bold text-white mb-2">${escapeHtml(item.title)}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">${escapeHtml(item.description || '')}</p>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'pricing-card': {
      const items = el.items || [];
      return `<div class="grid md:grid-cols-3 gap-8 my-10 max-w-6xl mx-auto">
        ${items
          .map(
            (item) => `
          <div class="p-8 rounded-3xl border ${item.popular ? 'border-indigo-500 bg-indigo-950/20 shadow-2xl shadow-indigo-600/20 relative' : 'border-slate-800 bg-slate-900/40'} flex flex-col justify-between">
            ${item.popular ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-full">Phổ Biến Nhất</span>` : ''}
            <div>
              <h3 class="text-xl font-bold text-white mb-2">${escapeHtml(item.title)}</h3>
              <p class="text-xs text-slate-400 mb-6">${escapeHtml(item.description || '')}</p>
              <div class="flex items-baseline gap-1 mb-6">
                <span class="text-4xl font-extrabold text-white">${escapeHtml(item.price || '0đ')}</span>
                <span class="text-xs text-slate-400">/${escapeHtml(item.period || 'tháng')}</span>
              </div>
              <ul class="space-y-3 mb-8 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                ${(item.features || [])
                  .map((feat) => `<li class="flex items-center gap-2"><span class="text-emerald-400">✓</span> ${escapeHtml(feat)}</li>`)
                  .join('')}
              </ul>
            </div>
            <a href="#" class="w-full py-3 text-center rounded-xl font-bold text-sm transition ${item.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}">
              ${escapeHtml(item.buttonText || 'Bắt Đầu Ngay')}
            </a>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'testimonial-card': {
      const items = el.items || [];
      return `<div class="grid md:grid-cols-3 gap-6 my-8">
        ${items
          .map(
            (item) => `
          <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 shadow-lg">
            <div class="flex gap-1 text-amber-400 text-sm mb-4">★★★★★</div>
            <p class="text-slate-300 text-sm italic mb-6 leading-relaxed">"${escapeHtml(item.description || '')}"</p>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                ${escapeHtml(item.author?.[0] || 'U')}
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">${escapeHtml(item.author || '')}</h4>
                <p class="text-[11px] text-slate-400">${escapeHtml(item.role || '')}</p>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'accordion': {
      const items = el.items || [];
      return `<div class="max-w-3xl mx-auto space-y-3 my-8">
        ${items
          .map(
            (item) => `
          <div class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <button class="accordion-header w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm text-slate-200 hover:text-indigo-400 transition">
              <span>${escapeHtml(item.title || item.question || '')}</span>
              <span class="accordion-icon transition-transform duration-200">▼</span>
            </button>
            <div class="px-6 py-4 text-slate-300 text-sm leading-relaxed bg-slate-900/40 hidden border-t border-slate-800">
              ${escapeHtml(item.description || item.answer || '')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'form-input': {
      const items = el.items || [];
      return `<form class="max-w-2xl mx-auto space-y-4 p-8 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-xl my-6">
        ${items
          .map(
            (item) => `
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">${escapeHtml(item.title)}</label>
            <input type="text" placeholder="${escapeHtml(item.placeholder || '')}" required class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          </div>
        `
          )
          .join('')}
        <button type="submit" class="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg mt-4">
          ${escapeHtml(el.content || 'Gửi Thông Tin')}
        </button>
      </form>`;
    }

    default:
      return `<div class="my-4 text-slate-300">${el.content || ''}</div>`;
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
