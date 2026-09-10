import { CanvasElement, CanvasSection, WebsiteProject, WebsiteTheme, SEOSettings } from '../types';

export interface GitHubSourceContext {
  owner?: string;
  repo?: string;
  branch?: string;
  filePath?: string;
}

/**
 * Resolves relative URLs (e.g. assets/img.png, ./pic.jpg) to absolute GitHub Raw URLs
 */
export const resolveGitHubUrl = (
  relativeUrl: string,
  context?: GitHubSourceContext
): string => {
  if (!relativeUrl) return '';
  const trimmed = relativeUrl.trim();

  // If already absolute URL or data URL, return as is
  if (/^(https?:|\/\/|data:|mailto:|tel:|#|javascript:)/i.test(trimmed)) {
    return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  }

  if (!context || !context.owner || !context.repo) {
    return trimmed;
  }

  const { owner, repo, branch = 'main', filePath = '' } = context;

  // Calculate directory of the current file
  const pathSegments = filePath.split('/').filter(Boolean);
  pathSegments.pop(); // Remove file name, keep directory

  let cleanRelative = trimmed.replace(/^\.\//, ''); // Remove ./

  // Handle ../ parent navigation
  while (cleanRelative.startsWith('../')) {
    pathSegments.pop();
    cleanRelative = cleanRelative.substring(3);
  }

  // Remove leading slash if any
  cleanRelative = cleanRelative.replace(/^\//, '');

  const resolvedPath = pathSegments.length > 0 ? `${pathSegments.join('/')}/${cleanRelative}` : cleanRelative;

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolvedPath}`;
};

/**
 * Resolves all relative image src, href, and CSS url(...) attributes in an HTML node
 */
export const resolveNodeUrls = (node: Element, context?: GitHubSourceContext) => {
  if (!context || !context.owner || !context.repo) return;

  // 1. Resolve img[src]
  const images = node.querySelectorAll('img[src]');
  images.forEach((img) => {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', resolveGitHubUrl(src, context));
  });

  // 2. Resolve source[srcset] / img[srcset]
  const srcsets = node.querySelectorAll('[srcset]');
  srcsets.forEach((el) => {
    const srcset = el.getAttribute('srcset');
    if (srcset) {
      const resolved = srcset
        .split(',')
        .map((part) => {
          const [url, size] = part.trim().split(/\s+/);
          return `${resolveGitHubUrl(url, context)}${size ? ' ' + size : ''}`;
        })
        .join(', ');
      el.setAttribute('srcset', resolved);
    }
  });

  // 3. Resolve a[href] if relative and not anchor
  const links = node.querySelectorAll('a[href]');
  links.forEach((a) => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
      a.setAttribute('href', resolveGitHubUrl(href, context));
    }
  });

  // 4. Resolve inline style="background-image: url(...)"
  const elementsWithStyle = node.querySelectorAll('[style*="url("]');
  elementsWithStyle.forEach((el) => {
    const style = el.getAttribute('style');
    if (style) {
      const fixed = style.replace(/url\(['"]?([^'"()]+)['"]?\)/gi, (match, url) => {
        if (/^(https?:|\/\/|data:)/i.test(url)) return match;
        return `url('${resolveGitHubUrl(url, context)}')`;
      });
      el.setAttribute('style', fixed);
    }
  });
};

/**
 * High-fidelity HTML Parser:
 * Preserves 100% of the visual styling, CSS classes, Tailwind CDN scripts,
 * FontAwesome links, backgrounds, inline styles, flex/grid layouts, and components.
 */
export const parseHtmlToWebStudioSections = (
  html: string,
  baseTheme: WebsiteTheme,
  context?: GitHubSourceContext
): {
  sections: CanvasSection[];
  title?: string;
  metaDescription?: string;
  extractedCss?: string;
  externalStylesheets?: string[];
  externalScripts?: string[];
  bodyClasses?: string;
  businessPhone?: string;
  businessName?: string;
} => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract Page Meta
  const title = doc.querySelector('title')?.innerText?.trim() || '';
  const metaDescription =
    doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
    doc.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() ||
    '';

  // Extract Phone & Business Name from HTML if present
  let businessPhone: string | undefined;
  const phoneLinks = doc.querySelectorAll('a[href^="tel:"]');
  if (phoneLinks.length > 0) {
    businessPhone = phoneLinks[0].getAttribute('href')?.replace('tel:', '').trim();
  }

  const businessName =
    doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content')?.trim() ||
    doc.querySelector('.logo, .brand, header h1, header strong')?.textContent?.trim() ||
    title;

  // Extract External Stylesheets (<link rel="stylesheet">)
  const externalStylesheets: string[] = [];
  const linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  linkTags.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const resolved = resolveGitHubUrl(href, context);
      if (!externalStylesheets.includes(resolved)) {
        externalStylesheets.push(resolved);
      }
    }
  });

  // Always ensure FontAwesome is available for icons like fa-phone, fa-car, fa-check
  const hasFa = html.includes('fa-') || html.includes('fontawesome');
  if (hasFa && !externalStylesheets.some((s) => s.includes('font-awesome') || s.includes('fontawesome'))) {
    externalStylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
  }

  // Extract External Scripts (<script src="...">)
  const externalScripts: string[] = [];
  const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
  scriptTags.forEach((s) => {
    const src = s.getAttribute('src');
    if (src) {
      const resolved = resolveGitHubUrl(src, context);
      if (!externalScripts.includes(resolved)) {
        externalScripts.push(resolved);
      }
    }
  });

  // Check if Tailwind is used via CDN or standard Tailwind classes
  const hasTailwindCdn = html.includes('cdn.tailwindcss.com');
  const hasTailwindClasses =
    html.includes('grid-cols') ||
    html.includes('bg-') ||
    html.includes('text-') ||
    html.includes('flex') ||
    html.includes('rounded-');
  if ((hasTailwindCdn || hasTailwindClasses) && !externalScripts.some((s) => s.includes('tailwindcss'))) {
    externalScripts.push('https://cdn.tailwindcss.com');
  }

  // Extract <style> blocks
  const styleTags = Array.from(doc.querySelectorAll('style'));
  let extractedCss = styleTags.map((st) => st.innerHTML).join('\n\n');

  // Convert relative URLs inside CSS url(...)
  if (context && context.owner && context.repo && extractedCss) {
    extractedCss = extractedCss.replace(/url\(['"]?([^'"()]+)['"]?\)/gi, (match, url) => {
      if (/^(https?:|\/\/|data:)/i.test(url)) return match;
      return `url('${resolveGitHubUrl(url, context)}')`;
    });
  }

  // Extract body classes
  const body = doc.body;
  const bodyClasses = body?.getAttribute('class') || '';

  const sections: CanvasSection[] = [];

  if (!body) {
    return {
      sections: [],
      title,
      metaDescription,
      extractedCss,
      externalStylesheets,
      externalScripts,
      bodyClasses,
      businessPhone,
      businessName,
    };
  }

  // Helper to determine meaningful section name & category
  const categorizeNode = (node: Element, idx: number): { name: string; category: CanvasSection['category'] } => {
    const tag = node.tagName.toLowerCase();
    const id = node.id.toLowerCase();
    const className = (node.getAttribute('class') || '').toLowerCase();
    const textSample = (node.textContent || '').slice(0, 100).toLowerCase();

    if (tag === 'header' || className.includes('header') || className.includes('navbar') || className.includes('nav') || tag === 'nav') {
      return { name: 'Khối Đầu Trang & Điều Hướng (Header / Nav)', category: 'header' };
    }
    if (tag === 'footer' || className.includes('footer') || id.includes('footer')) {
      return { name: 'Khối Chân Trang (Footer)', category: 'footer' };
    }
    if (className.includes('hero') || id.includes('hero') || idx === 0 || textSample.includes('chào mừng') || textSample.includes('thuê xe')) {
      return { name: 'Khối Hero & Biểu Ngữ Chính', category: 'hero' };
    }
    if (className.includes('price') || className.includes('pricing') || id.includes('price') || textSample.includes('bảng giá') || textSample.includes('giá xe')) {
      return { name: 'Khối Bảng Giá Tuyến Đường & Dịch Vụ', category: 'pricing' };
    }
    if (className.includes('review') || className.includes('testimonial') || id.includes('review') || textSample.includes('đánh giá') || textSample.includes('khách hàng')) {
      return { name: 'Khối Đánh Giá Khách Hàng', category: 'testimonials' };
    }
    if (className.includes('contact') || id.includes('contact') || textSample.includes('liên hệ') || textSample.includes('hotline') || textSample.includes('đặt xe')) {
      return { name: 'Khối Đặt Xe Nhanh & Liên Hệ', category: 'contact' };
    }
    if (className.includes('stat') || id.includes('stat')) {
      return { name: 'Khối Thống Kê & Con Số', category: 'stats' };
    }
    if (className.includes('gallery') || className.includes('image') || id.includes('gallery')) {
      return { name: 'Khối Hình Ảnh & Đội Xe', category: 'gallery' };
    }

    // Try finding inner h1/h2 text
    const innerHeading = node.querySelector('h1, h2, h3')?.textContent?.trim();
    if (innerHeading) {
      return { name: `Khối: ${innerHeading.slice(0, 40)}`, category: 'features' };
    }

    return { name: `Khối Nội Dung #${idx + 1}`, category: 'features' };
  };

  // Extract top-level elements from body (excluding scripts/styles)
  const topElements: Element[] = [];
  Array.from(body.children).forEach((child) => {
    const tagName = child.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'meta', 'link'].includes(tagName)) {
      return;
    }
    topElements.push(child);
  });

  // If the body is wrapped in a single main/div container with multiple section children, unwrap it
  let elementsToProcess = topElements;
  if (topElements.length === 1 && ['div', 'main', 'body', 'wrapper'].includes(topElements[0].tagName.toLowerCase()) && topElements[0].children.length >= 2) {
    const unwrapped: Element[] = [];
    Array.from(topElements[0].children).forEach((child) => {
      const tn = child.tagName.toLowerCase();
      if (!['script', 'style', 'noscript'].includes(tn)) {
        unwrapped.push(child);
      }
    });
    if (unwrapped.length > 0) {
      elementsToProcess = unwrapped;
    }
  }

  // Process each major element as a high-fidelity Pixel-Perfect CanvasSection
  elementsToProcess.forEach((node, idx) => {
    // Resolve all relative URLs inside this section
    resolveNodeUrls(node, context);

    const { name, category } = categorizeNode(node, idx);

    // Extract inline background or padding
    const inlineStyle = node.getAttribute('style') || '';
    const styleBg = inlineStyle.match(/background(?:-color)?:\s*([^;]+)/i)?.[1]?.trim();
    const styleBgImage = inlineStyle.match(/background-image:\s*url\(['"]?([^'"()]+)['"]?\)/i)?.[1]?.trim();

    // Get the exact HTML of the section
    const rawSectionHtml = node.outerHTML;

    // Also extract child elements for visual property inspection
    const elements: CanvasElement[] = [];
    const headings = node.querySelectorAll('h1, h2, h3, h4');
    headings.forEach((h, hIdx) => {
      const text = h.textContent?.trim();
      if (text) {
        elements.push({
          id: `el-h-${Date.now()}-${idx}-${hIdx}`,
          type: 'heading',
          tag: h.tagName.toLowerCase() as any,
          content: text,
          styles: {
            textColor: '#ffffff',
            fontSize: h.tagName.toLowerCase() === 'h1' ? '4xl' : '2xl',
            fontWeight: 'bold',
          },
        });
      }
    });

    const paragraphs = node.querySelectorAll('p');
    paragraphs.forEach((p, pIdx) => {
      const text = p.textContent?.trim();
      if (text && text.length > 10) {
        elements.push({
          id: `el-p-${Date.now()}-${idx}-${pIdx}`,
          type: 'paragraph',
          content: text,
          styles: {
            textColor: '#cbd5e1',
            fontSize: 'base',
          },
        });
      }
    });

    const buttons = node.querySelectorAll('button, a.btn, a[role="button"], a[href^="tel:"]');
    buttons.forEach((btn, bIdx) => {
      const text = btn.textContent?.trim();
      const href = btn.getAttribute('href') || '#';
      if (text) {
        elements.push({
          id: `el-btn-${Date.now()}-${idx}-${bIdx}`,
          type: 'button',
          content: text,
          href,
          styles: {
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
          },
        });
      }
    });

    sections.push({
      id: `sec-imported-${Date.now()}-${idx}`,
      name,
      category,
      layout: 'full-width',
      mode: 'raw_html',
      rawHtml: rawSectionHtml,
      customClasses: node.getAttribute('class') || '',
      backgroundImage: styleBgImage,
      styles: {
        backgroundColor: styleBg || 'transparent',
        paddingTop: 0,
        paddingBottom: 0,
      },
      elements,
    });
  });

  // Fallback if no top-level sections were found
  if (sections.length === 0) {
    resolveNodeUrls(body, context);
    sections.push({
      id: `sec-full-${Date.now()}`,
      name: 'Toàn Bộ Trang Gốc (Pixel-Perfect)',
      category: 'hero',
      layout: 'full-width',
      mode: 'raw_html',
      rawHtml: body.innerHTML,
      styles: {
        backgroundColor: 'transparent',
        paddingTop: 0,
        paddingBottom: 0,
      },
      elements: [],
    });
  }

  return {
    sections,
    title,
    metaDescription,
    extractedCss,
    externalStylesheets,
    externalScripts,
    bodyClasses,
    businessPhone,
    businessName,
  };
};
