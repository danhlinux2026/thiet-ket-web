import { WebsiteProject, CanvasSection, CanvasElement } from '../types';

export function generateStandaloneHtml(project: WebsiteProject): string {
  const { theme, sections, settings } = project;

  const sectionsHtml = sections
    .filter((s) => !s.hidden)
    .map((section) => renderSectionHtml(section, theme))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(settings.title || project.name)}</title>
  <meta name="description" content="${escapeHtml(settings.metaDescription || project.description)}">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
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
</body>
</html>`;
}

function renderSectionHtml(section: CanvasSection, theme: any): string {
  const bg = section.styles.backgroundColor || 'transparent';
  const pt = section.styles.paddingTop || 60;
  const pb = section.styles.paddingBottom || 60;
  const br = section.styles.borderRadius ? `border-radius: ${section.styles.borderRadius};` : '';
  const bw = section.styles.borderWidth ? `border: ${section.styles.borderWidth}px solid ${section.styles.borderColor || '#334155'};` : '';

  const elementsHtml = section.elements.map((el) => renderElementHtml(el, theme)).join('\n');

  return `  <!-- Section: ${escapeHtml(section.name)} -->
  <section class="w-full relative overflow-hidden" style="background-color: ${bg}; padding-top: ${pt}px; padding-bottom: ${pb}px; ${br} ${bw}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      ${elementsHtml}
    </div>
  </section>`;
}

function renderElementHtml(el: CanvasElement, theme: any): string {
  const styles = el.styles || {};
  const textAlign = styles.textAlign || 'left';
  const textColor = styles.textColor || 'inherit';

  switch (el.type) {
    case 'heading': {
      const Tag = el.tag || 'h2';
      const sizeClass =
        styles.fontSize === '5xl'
          ? 'text-4xl md:text-5xl lg:text-6xl leading-tight'
          : styles.fontSize === '4xl'
          ? 'text-3xl md:text-4xl lg:text-5xl leading-tight'
          : styles.fontSize === '3xl'
          ? 'text-2xl md:text-3xl lg:text-4xl'
          : styles.fontSize === 'xl'
          ? 'text-xl md:text-2xl'
          : 'text-2xl md:text-3xl';
      return `<${Tag} class="${sizeClass} font-extrabold tracking-tight" style="color: ${textColor}; text-align: ${textAlign}; margin-bottom: ${styles.marginBottom || 16}px;">${el.content || ''}</${Tag}>`;
    }

    case 'paragraph': {
      const sizeClass = styles.fontSize === 'lg' ? 'text-lg md:text-xl' : 'text-base';
      return `<p class="${sizeClass} leading-relaxed" style="color: ${textColor}; text-align: ${textAlign}; margin-bottom: ${styles.marginBottom || 16}px;">${el.content || ''}</p>`;
    }

    case 'badge': {
      return `<div style="text-align: ${textAlign}; margin-bottom: ${styles.marginBottom || 16}px;">
        <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold" style="background-color: ${styles.backgroundColor || '#1e1b4b'}; color: ${styles.textColor || '#818cf8'};">
          ${escapeHtml(el.badgeText || '')}
        </span>
      </div>`;
    }

    case 'button': {
      return `<div style="text-align: ${textAlign}; margin-bottom: ${styles.marginBottom || 16}px;">
        <a href="${el.href || '#'}" class="inline-flex items-center justify-center font-bold transition-all shadow-md hover:opacity-90" style="background-color: ${styles.backgroundColor || theme.primaryColor}; color: ${styles.textColor || '#ffffff'}; padding: ${styles.paddingTop || 12}px ${styles.paddingRight || 28}px; border-radius: ${styles.borderRadius || '0.5rem'};">
          ${escapeHtml(el.content || 'Nút Bấm')}
        </a>
      </div>`;
    }

    case 'image': {
      return `<div class="w-full overflow-hidden flex justify-center" style="margin-top: ${styles.marginTop || 0}px; margin-bottom: ${styles.marginBottom || 24}px;">
        <img src="${el.src || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'}" alt="${escapeHtml(el.alt || '')}" class="w-full max-w-5xl object-cover rounded-xl shadow-xl" style="border: ${styles.borderWidth || 0}px solid ${styles.borderColor || 'transparent'};" />
      </div>`;
    }

    case 'card': {
      const items = el.items || [];
      const cols = styles.columns || 3;
      const colClass = cols === 3 ? 'grid-cols-1 md:grid-cols-3' : cols === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-4';

      return `<div class="grid ${colClass} gap-6 my-6">
        ${items
          .map(
            (item) => `
          <div class="p-6 rounded-xl border border-slate-800 bg-slate-800/60 shadow-lg hover:border-slate-700 transition">
            ${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.title)}" class="w-full h-48 object-cover rounded-lg mb-4" />` : ''}
            <h4 class="text-xl font-bold text-white mb-2">${escapeHtml(item.title)}</h4>
            ${item.subtitle ? `<p class="text-sm text-indigo-400 font-medium mb-2">${escapeHtml(item.subtitle)}</p>` : ''}
            ${item.description ? `<p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(item.description)}</p>` : ''}
            ${item.price ? `<p class="text-lg font-bold text-emerald-400 mt-3">${escapeHtml(item.price)}</p>` : ''}
            ${item.buttonText ? `<button class="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">${escapeHtml(item.buttonText)}</button>` : ''}
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'pricing-card': {
      const items = el.items || [];
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        ${items
          .map(
            (item) => `
          <div class="p-8 rounded-2xl border ${item.popular ? 'border-indigo-500 bg-slate-800/90 ring-2 ring-indigo-500 shadow-2xl relative' : 'border-slate-800 bg-slate-800/50'} flex flex-col justify-between">
            ${item.popular ? `<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">Phổ Biến Nhất</div>` : ''}
            <div>
              <h3 class="text-2xl font-bold text-white">${escapeHtml(item.title)}</h3>
              <p class="text-sm text-slate-400 mt-2">${escapeHtml(item.description || '')}</p>
              <div class="my-6">
                <span class="text-4xl font-extrabold text-white">${escapeHtml(item.price || '')}</span>
                <span class="text-slate-400 text-sm">${escapeHtml(item.period || '')}</span>
              </div>
              <ul class="space-y-3 mb-8 text-sm text-slate-300">
                ${(item.features || [])
                  .map(
                    (f) => `
                  <li class="flex items-center gap-2">
                    <span class="text-emerald-400 font-bold">✓</span> ${escapeHtml(f)}
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
            <button class="w-full py-3 rounded-xl font-bold transition ${item.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}">
              ${escapeHtml(item.buttonText || 'Chọn Gói')}
            </button>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'testimonial-card': {
      const items = el.items || [];
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        ${items
          .map(
            (item) => `
          <div class="p-6 rounded-2xl border border-slate-800 bg-slate-800/60 shadow-lg flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1 text-amber-400 mb-3">
                ${'★'.repeat(item.rating || 5)}
              </div>
              <h4 class="text-lg font-bold text-white mb-2">"${escapeHtml(item.title)}"</h4>
              <p class="text-slate-300 text-sm leading-relaxed mb-6">${escapeHtml(item.description || '')}</p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-700/60">
              ${item.avatar ? `<img src="${item.avatar}" alt="${escapeHtml(item.author || '')}" class="w-10 h-10 rounded-full object-cover border border-slate-600" />` : ''}
              <div>
                <p class="text-sm font-bold text-white">${escapeHtml(item.author || '')}</p>
                <p class="text-xs text-slate-400">${escapeHtml(item.role || '')}</p>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'stats-item': {
      const items = el.items || [];
      return `<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center my-6">
        ${items
          .map(
            (item) => `
          <div class="p-4">
            <div class="text-3xl md:text-4xl font-extrabold text-indigo-400">${escapeHtml(item.statNumber || '')}</div>
            <div class="text-sm text-slate-400 mt-1">${escapeHtml(item.statLabel || '')}</div>
          </div>
        `
          )
          .join('')}
      </div>`;
    }

    case 'accordion': {
      const items = el.items || [];
      return `<div class="space-y-4 max-w-3xl mx-auto my-8">
        ${items
          .map(
            (item) => `
          <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/40">
            <button class="accordion-header w-full px-6 py-4 text-left flex items-center justify-between font-bold text-white hover:bg-slate-800/80 transition">
              <span>${escapeHtml(item.title)}</span>
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
