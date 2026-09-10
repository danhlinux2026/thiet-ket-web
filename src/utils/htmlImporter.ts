import { CanvasElement, CanvasSection, WebsiteProject, WebsiteTheme } from '../types';

/**
 * Parses raw HTML string into WebStudio CanvasSection[] and CanvasElement[]
 */
export const parseHtmlToWebStudioSections = (
  html: string,
  baseTheme: WebsiteTheme
): { sections: CanvasSection[]; title?: string; metaDescription?: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract page meta
  const title = doc.querySelector('title')?.innerText || '';
  const metaDescription =
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

  const sections: CanvasSection[] = [];

  // Find structural containers (header, nav, section, article, main, footer, div.container)
  const body = doc.body;
  if (!body) {
    return { sections: [], title, metaDescription };
  }

  const topElements = Array.from(body.children);

  let currentElementsBuffer: CanvasElement[] = [];

  const flushBufferToSection = (name: string, category: any = 'features') => {
    if (currentElementsBuffer.length === 0) return;
    sections.push({
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      category,
      layout: 'container',
      styles: {
        backgroundColor: baseTheme.backgroundColor || '#090d16',
        paddingTop: 64,
        paddingBottom: 64,
      },
      elements: [...currentElementsBuffer],
    });
    currentElementsBuffer = [];
  };

  const processNode = (node: Element) => {
    const tagName = node.tagName.toLowerCase();

    // 1. Headings
    if (/^h[1-6]$/.test(tagName)) {
      const tag = tagName as 'h1' | 'h2' | 'h3' | 'h4';
      const text = node.textContent?.trim() || '';
      if (text) {
        currentElementsBuffer.push({
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'heading',
          tag: tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h4',
          content: text,
          styles: {
            textColor: '#ffffff',
            fontSize: tag === 'h1' ? '4xl' : tag === 'h2' ? '3xl' : '2xl',
            fontWeight: 'bold',
            textAlign: 'left',
            marginBottom: 16,
          },
        });
      }
      return;
    }

    // 2. Paragraphs & Blockquotes
    if (tagName === 'p' || tagName === 'blockquote') {
      const text = node.innerHTML.trim();
      if (text) {
        currentElementsBuffer.push({
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'paragraph',
          content: text,
          styles: {
            textColor: '#94a3b8',
            fontSize: 'base',
            textAlign: 'left',
            marginBottom: 16,
          },
        });
      }
      return;
    }

    // 3. Images
    if (tagName === 'img') {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || 'Ảnh minh họa';
      if (src) {
        currentElementsBuffer.push({
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'image',
          src: src,
          alt: alt,
          styles: {
            borderRadius: '1rem',
            marginBottom: 20,
          },
        });
      }
      return;
    }

    // 4. Buttons & Links
    if (tagName === 'button' || (tagName === 'a' && (node.classList.contains('btn') || node.classList.contains('button') || node.textContent?.trim().length! < 30))) {
      const text = node.textContent?.trim();
      const href = node.getAttribute('href') || '#';
      if (text && text.length > 0) {
        currentElementsBuffer.push({
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'button',
          content: text,
          href: href,
          styles: {
            backgroundColor: baseTheme.primaryColor || '#6366f1',
            textColor: '#ffffff',
            borderRadius: '0.5rem',
            marginBottom: 16,
          },
        });
      }
      return;
    }

    // 5. Lists (convert to card grid if multi-item)
    if (tagName === 'ul' || tagName === 'ol') {
      const items = Array.from(node.querySelectorAll('li'));
      if (items.length > 0) {
        currentElementsBuffer.push({
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'card',
          styles: {
            columns: Math.min(items.length, 3),
            marginBottom: 24,
          },
          items: items.map((li, idx) => ({
            id: `it-${Date.now()}-${idx}`,
            title: li.querySelector('strong, h3, h4, h5')?.textContent?.trim() || `Mục ${idx + 1}`,
            description: li.textContent?.trim() || '',
            icon: 'Sparkles',
          })),
        });
      }
      return;
    }

    // 6. Section or Container blocks
    if (['section', 'header', 'footer', 'nav', 'article', 'main'].includes(tagName)) {
      flushBufferToSection('Khối Nội Dung');
      // Process children
      Array.from(node.children).forEach(processNode);
      const sectionName =
        tagName === 'header'
          ? 'Khối Đầu Trang (Header)'
          : tagName === 'footer'
          ? 'Khối Chân Trang (Footer)'
          : tagName === 'nav'
          ? 'Khối Điều Hướng (Nav)'
          : `Khối ${tagName.toUpperCase()}`;
      flushBufferToSection(sectionName, tagName === 'header' ? 'hero' : tagName === 'footer' ? 'footer' : 'features');
      return;
    }

    // Recurse into child nodes
    if (node.children.length > 0) {
      Array.from(node.children).forEach(processNode);
    }
  };

  topElements.forEach(processNode);
  flushBufferToSection('Nội Dung Trang');

  // Fallback if no sections parsed
  if (sections.length === 0) {
    sections.push({
      id: `sec-${Date.now()}`,
      name: 'Khối Nhập Từ HTML',
      category: 'hero',
      layout: 'container',
      styles: {
        backgroundColor: baseTheme.backgroundColor || '#090d16',
        paddingTop: 60,
        paddingBottom: 60,
      },
      elements: [
        {
          id: `el-${Date.now()}-h`,
          type: 'heading',
          tag: 'h1',
          content: title || 'Trang Nhập Từ GitHub',
          styles: { fontSize: '4xl', fontWeight: 'bold', textColor: '#ffffff', marginBottom: 16 },
        },
        {
          id: `el-${Date.now()}-p`,
          type: 'paragraph',
          content: metaDescription || body.textContent?.slice(0, 300) || 'Nội dung trang đã được nhập thành công.',
          styles: { fontSize: 'base', textColor: '#94a3b8', marginBottom: 24 },
        },
      ],
    });
  }

  return { sections, title, metaDescription };
};
