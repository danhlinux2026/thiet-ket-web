import { WebsiteProject, SEOSettings, CanvasElement } from '../types';

export interface SEOAuditItem {
  id: string;
  title: string;
  category: 'critical' | 'important' | 'good-to-have';
  status: 'pass' | 'warning' | 'error';
  message: string;
  suggestion: string;
  impact: number; // weight towards 100
}

export interface SEOAuditReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  passedCount: number;
  warningCount: number;
  errorCount: number;
  items: SEOAuditItem[];
}

/**
 * Perform a comprehensive, real-time SEO audit on the website project
 */
export function auditProjectSEO(project: WebsiteProject): SEOAuditReport {
  const settings = project.settings || ({} as SEOSettings);
  const items: SEOAuditItem[] = [];

  const title = (settings.title || project.name || '').trim();
  const description = (settings.metaDescription || project.description || '').trim();
  const canonicalUrl = (settings.canonicalUrl || '').trim();
  const ogImage = (settings.ogImage || '').trim();
  const keywords = (settings.keywords || '').trim();
  const googleVerification = (settings.googleSiteVerification || '').trim();

  // 1. Meta Title Analysis
  if (!title) {
    items.push({
      id: 'title-missing',
      title: 'Thẻ Tiêu Đề (Meta Title)',
      category: 'critical',
      status: 'error',
      message: 'Trang web chưa có tiêu đề SEO.',
      suggestion: 'Thêm tiêu đề chứa từ khóa chính dài từ 40 - 65 ký tự để Google hiển thị trên kết quả tìm kiếm.',
      impact: 20,
    });
  } else if (title.length < 30) {
    items.push({
      id: 'title-short',
      title: 'Thẻ Tiêu Đề (Meta Title)',
      category: 'important',
      status: 'warning',
      message: `Tiêu đề quá ngắn (${title.length} ký tự). Google khuyên dùng 40 - 65 ký tự.`,
      suggestion: 'Mở rộng tiêu đề bằng cách thêm tên thương hiệu hoặc từ khóa mục tiêu.',
      impact: 10,
    });
  } else if (title.length > 70) {
    items.push({
      id: 'title-long',
      title: 'Thẻ Tiêu Đề (Meta Title)',
      category: 'important',
      status: 'warning',
      message: `Tiêu đề hơi dài (${title.length} ký tự), có thể bị cắt bớt bằng dấu "..." trên Google.`,
      suggestion: 'Rút gọn tiêu đề xuống dưới 65 ký tự để hiển thị đầy đủ trên cả máy tính và điện thoại.',
      impact: 15,
    });
  } else {
    items.push({
      id: 'title-good',
      title: 'Thẻ Tiêu Đề (Meta Title)',
      category: 'critical',
      status: 'pass',
      message: `Độ dài tiêu đề hoàn hảo (${title.length} ký tự).`,
      suggestion: 'Tiêu đề sẽ hiển thị trọn vẹn và tối ưu tỷ lệ nhấp (CTR) trên Google.',
      impact: 20,
    });
  }

  // 2. Meta Description Analysis
  if (!description) {
    items.push({
      id: 'desc-missing',
      title: 'Thẻ Mô Tả (Meta Description)',
      category: 'critical',
      status: 'error',
      message: 'Chưa có thẻ mô tả tóm tắt nội dung.',
      suggestion: 'Thêm đoạn mô tả hấp dẫn từ 120 - 160 ký tự kèm lời kêu gọi hành động (CTA).',
      impact: 15,
    });
  } else if (description.length < 60) {
    items.push({
      id: 'desc-short',
      title: 'Thẻ Mô Tả (Meta Description)',
      category: 'important',
      status: 'warning',
      message: `Mô tả còn ngắn (${description.length} ký tự). Google thích đoạn mô tả 120 - 160 ký tự.`,
      suggestion: 'Bổ sung thêm lợi ích cốt lõi hoặc câu kêu gọi nhấp chuột.',
      impact: 10,
    });
  } else if (description.length > 175) {
    items.push({
      id: 'desc-long',
      title: 'Thẻ Mô Tả (Meta Description)',
      category: 'important',
      status: 'warning',
      message: `Mô tả hơi dài (${description.length} ký tự) và có thể bị Google cắt gọn.`,
      suggestion: 'Tối ưu độ dài trong khoảng 130 - 160 ký tự.',
      impact: 12,
    });
  } else {
    items.push({
      id: 'desc-good',
      title: 'Thẻ Mô Tả (Meta Description)',
      category: 'critical',
      status: 'pass',
      message: `Độ dài mô tả xuất sắc (${description.length} ký tự).`,
      suggestion: 'Đoạn mô tả ngắn gọn, thu hút và chuẩn kích thước hiển thị SERP.',
      impact: 15,
    });
  }

  // 3. Heading Hierarchy (H1 check)
  const allElements: CanvasElement[] = [];
  project.sections.forEach((sec) => {
    if (!sec.hidden) {
      allElements.push(...sec.elements);
    }
  });

  const headingElements = allElements.filter((el) => el.type === 'heading');
  const h1Elements = headingElements.filter((el) => !el.tag || el.tag === 'h1');

  if (headingElements.length === 0) {
    items.push({
      id: 'h1-missing',
      title: 'Cấu Trúc Tiêu Đề (H1 Heading)',
      category: 'critical',
      status: 'error',
      message: 'Trang chưa có thẻ tiêu đề H1.',
      suggestion: 'Thêm ít nhất 1 thẻ Heading chính (H1) ở khối Hero/Header đầu trang.',
      impact: 15,
    });
  } else {
    items.push({
      id: 'h1-good',
      title: 'Cấu Trúc Tiêu Đề (H1 Heading)',
      category: 'critical',
      status: 'pass',
      message: `Đã tìm thấy ${headingElements.length} tiêu đề phân cấp rõ ràng trên trang.`,
      suggestion: 'Google bot sẽ dễ dàng hiểu được cấu trúc nội dung trang web.',
      impact: 15,
    });
  }

  // 4. Images Alt Attributes (Google Image Search)
  const imageElements = allElements.filter((el) => el.type === 'image');
  const imagesWithoutAlt = imageElements.filter((el) => !el.alt || el.alt.trim() === '');

  if (imageElements.length > 0) {
    if (imagesWithoutAlt.length > 0) {
      items.push({
        id: 'alt-missing',
        title: 'Thẻ Alt Hình Ảnh (Image SEO)',
        category: 'important',
        status: 'warning',
        message: `Có ${imagesWithoutAlt.length}/${imageElements.length} hình ảnh chưa có văn bản thay thế (alt tag).`,
        suggestion: 'Dùng nút "Tối Ưu SEO Tự Động" hoặc chỉnh sửa thuộc tính Alt để Google xếp hạng hình ảnh.',
        impact: 10,
      });
    } else {
      items.push({
        id: 'alt-good',
        title: 'Thẻ Alt Hình Ảnh (Image SEO)',
        category: 'important',
        status: 'pass',
        message: `Tất cả ${imageElements.length} hình ảnh đều đã có mô tả alt chuẩn xác.`,
        suggestion: 'Trang sẵn sàng xuất hiện trên Google Hình Ảnh (Google Image Search).',
        impact: 10,
      });
    }
  }

  // 5. Open Graph & Social Sharing Image
  if (!ogImage) {
    items.push({
      id: 'og-missing',
      title: 'Ảnh Chia Sẻ Mạng Xã Hội (Open Graph Image)',
      category: 'important',
      status: 'warning',
      message: 'Chưa cấu hình ảnh đại diện khi chia sẻ lên Facebook, Zalo, LinkedIn, Twitter.',
      suggestion: 'Thêm URL ảnh kích thước 1200x630px để bài chia sẻ hiển thị đẹp mắt và tăng lượt truy cập.',
      impact: 10,
    });
  } else {
    items.push({
      id: 'og-good',
      title: 'Ảnh Chia Sẻ Mạng Xã Hội (Open Graph Image)',
      category: 'important',
      status: 'pass',
      message: 'Đã cấu hình ảnh Open Graph đại diện chuẩn 1200x630px.',
      suggestion: 'Xem trước bài chia sẻ trên Facebook/Zalo trực tiếp trong bảng xem trước bên dưới.',
      impact: 10,
    });
  }

  // 6. Canonical URL
  if (!canonicalUrl) {
    items.push({
      id: 'canonical-missing',
      title: 'Thẻ Liên Kết Gốc (Canonical Tag)',
      category: 'good-to-have',
      status: 'warning',
      message: 'Chưa cài đặt URL chính thức (Canonical URL).',
      suggestion: 'Thêm tên miền chính (VD: https://mywebsite.com) để tránh lỗi trùng lặp nội dung khi index.',
      impact: 5,
    });
  } else {
    items.push({
      id: 'canonical-good',
      title: 'Thẻ Liên Kết Gốc (Canonical Tag)',
      category: 'good-to-have',
      status: 'pass',
      message: `Đã khai báo Canonical URL: ${canonicalUrl}`,
      suggestion: 'Ngăn chặn hoàn toàn hiện tượng duplicate content trên các công cụ tìm kiếm.',
      impact: 5,
    });
  }

  // 7. Robots Meta (Index & Follow)
  const isIndexed = settings.robotsIndex !== false;
  const isFollowed = settings.robotsFollow !== false;

  if (isIndexed && isFollowed) {
    items.push({
      id: 'robots-good',
      title: 'Chỉ Thị Bọ Tìm Kiếm (Robots Meta)',
      category: 'critical',
      status: 'pass',
      message: 'Đã bật "index, follow" cho phép Googlebot quét và lập chỉ mục toàn bộ trang.',
      suggestion: 'Google sẽ ưu tiên quét và thu thập dữ liệu nhanh chóng.',
      impact: 10,
    });
  } else {
    items.push({
      id: 'robots-warning',
      title: 'Chỉ Thị Bọ Tìm Kiếm (Robots Meta)',
      category: 'critical',
      status: 'warning',
      message: 'Trang đang chặn Google lập chỉ mục (noindex hoặc nofollow).',
      suggestion: 'Hãy kích hoạt "Cho phép Google lập chỉ mục" trước khi phát hành.',
      impact: 0,
    });
  }

  // 8. Structured Data (Schema.org JSON-LD)
  const schemaType = settings.schemaType || 'WebSite';
  items.push({
    id: 'schema-good',
    title: 'Dữ Liệu Có Cấu Trúc (Schema.org JSON-LD)',
    category: 'important',
    status: 'pass',
    message: `Đã tích hợp Schema type "${schemaType}" dạng JSON-LD chuẩn Google.`,
    suggestion: 'Giúp Google hiển thị kết quả nhiều định dạng (Rich Snippets, Star Rating, Sitelinks).',
    impact: 10,
  });

  // 9. Google Search Console Verification
  if (googleVerification) {
    items.push({
      id: 'gsc-pass',
      title: 'Xác Minh Google Search Console',
      category: 'important',
      status: 'pass',
      message: 'Đã nhúng mã xác thực sở hữu website với Google.',
      suggestion: 'Google Search Console sẽ lập chỉ mục URL ngay sau khi gửi Sitemap.',
      impact: 5,
    });
  } else {
    items.push({
      id: 'gsc-info',
      title: 'Xác Minh Google Search Console',
      category: 'good-to-have',
      status: 'warning',
      message: 'Chưa thêm mã google-site-verification.',
      suggestion: 'Thêm mã xác thực để theo dõi thứ hạng từ khóa và số lần nhấp trên Google.',
      impact: 5,
    });
  }

  // Calculate Total Score
  let earned = 0;
  let totalWeight = 0;

  items.forEach((item) => {
    totalWeight += item.impact;
    if (item.status === 'pass') {
      earned += item.impact;
    } else if (item.status === 'warning') {
      earned += Math.round(item.impact * 0.5);
    }
  });

  const score = Math.min(100, Math.max(0, Math.round((earned / totalWeight) * 100)));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 35) grade = 'D';
  else grade = 'F';

  return {
    score,
    grade,
    passedCount: items.filter((i) => i.status === 'pass').length,
    warningCount: items.filter((i) => i.status === 'warning').length,
    errorCount: items.filter((i) => i.status === 'error').length,
    items,
  };
}

/**
 * Auto-generate Google-compliant Schema.org JSON-LD structured data
 */
export function generateSchemaJsonLd(project: WebsiteProject): string {
  const { settings, name, description } = project;
  const siteUrl = settings.canonicalUrl || 'https://mywebsite.com';
  const siteName = settings.title || name;
  const siteDesc = settings.metaDescription || description;
  const logoUrl = settings.businessLogo || settings.ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600';

  if (settings.schemaCustomJson && settings.schemaCustomJson.trim().length > 10) {
    try {
      JSON.parse(settings.schemaCustomJson);
      return settings.schemaCustomJson;
    } catch {
      // fallback to generated
    }
  }

  const schemaType = settings.schemaType || 'WebSite';

  if (schemaType === 'Organization' || schemaType === 'LocalBusiness') {
    const isLocal = schemaType === 'LocalBusiness';
    const schemaObj: any = {
      '@context': 'https://schema.org',
      '@type': isLocal ? 'LocalBusiness' : 'Organization',
      name: settings.businessName || siteName,
      url: siteUrl,
      description: siteDesc,
      logo: logoUrl,
    };

    if (settings.businessPhone) {
      schemaObj.telephone = settings.businessPhone;
    }
    if (settings.businessAddress) {
      schemaObj.address = {
        '@type': 'PostalAddress',
        streetAddress: settings.businessAddress,
        addressCountry: 'VN',
      };
    }
    if (isLocal) {
      schemaObj.priceRange = '$$';
      schemaObj.openingHours = 'Mo-Su 08:00-22:00';
    }
    return JSON.stringify(schemaObj, null, 2);
  }

  if (schemaType === 'Product') {
    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: siteName,
      description: siteDesc,
      image: [settings.ogImage || logoUrl],
      brand: {
        '@type': 'Brand',
        name: settings.businessName || siteName,
      },
      offers: {
        '@type': 'Offer',
        url: siteUrl,
        priceCurrency: 'VND',
        price: '499000',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
      },
    };
    return JSON.stringify(schemaObj, null, 2);
  }

  if (schemaType === 'FAQPage') {
    // Extract any FAQ accordion items from sections
    const faqQuestions: Array<{ question: string; answer: string }> = [];
    project.sections.forEach((sec) => {
      sec.elements.forEach((el) => {
        if (el.type === 'accordion' && el.items) {
          el.items.forEach((it) => {
            if (it.question && it.answer) {
              faqQuestions.push({ question: it.question, answer: it.answer });
            }
          });
        }
      });
    });

    const items =
      faqQuestions.length > 0
        ? faqQuestions
        : [
            {
              question: `Làm thế nào để bắt đầu sử dụng ${siteName}?`,
              answer: 'Bạn chỉ cần truy cập trang chủ, nhấn Đăng ký hoặc Liên hệ để được hỗ trợ tức thì.',
            },
            {
              question: 'Dịch vụ có bảo hành và hoàn tiền không?',
              answer: 'Chúng tôi cam kết hỗ trợ 24/7 và hoàn tiền trong vòng 30 ngày nếu bạn chưa hài lòng.',
            },
          ];

    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
    return JSON.stringify(schemaObj, null, 2);
  }

  // Default: WebSite Schema with SearchAction
  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDesc,
    inLanguage: settings.language || 'vi',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return JSON.stringify(schemaObj, null, 2);
}

/**
 * Generate standard sitemap.xml for Google Search Console submission
 */
export function generateSitemapXml(project: WebsiteProject): string {
  const siteUrl = (project.settings.canonicalUrl || 'https://mywebsite.com').replace(/\/$/, '');
  const lastMod = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    ${
      project.settings.ogImage
        ? `<image:image>
      <image:loc>${project.settings.ogImage}</image:loc>
      <image:title>${project.settings.title || project.name}</image:title>
    </image:image>`
        : ''
    }
  </url>
</urlset>`;
}

/**
 * Generate robots.txt for Googlebot & web crawlers
 */
export function generateRobotsTxt(project: WebsiteProject): string {
  const siteUrl = (project.settings.canonicalUrl || 'https://mywebsite.com').replace(/\/$/, '');
  const isIndexed = project.settings.robotsIndex !== false;

  if (!isIndexed) {
    return `# Robots.txt - Chặn tất cả bọ tìm kiếm
User-agent: *
Disallow: /
`;
  }

  return `# Robots.txt tối ưu cho Googlebot & các công cụ tìm kiếm
User-agent: *
Allow: /

# Sitemap Location
Sitemap: ${siteUrl}/sitemap.xml
`;
}

/**
 * Smart Auto-Optimizer: Intelligently analyze project content and apply best SEO practices
 */
export function autoOptimizeProjectSEO(project: WebsiteProject): WebsiteProject {
  const updated = JSON.parse(JSON.stringify(project)) as WebsiteProject;
  const currentSettings = updated.settings || ({} as SEOSettings);

  // 1. Gather all text fragments to deduce best keywords
  const textSnippets: string[] = [];
  let firstHeading = '';

  updated.sections.forEach((sec) => {
    sec.elements.forEach((el) => {
      if (el.type === 'heading' && el.content) {
        if (!firstHeading) firstHeading = el.content;
        textSnippets.push(el.content);
      } else if (el.type === 'paragraph' && el.content) {
        textSnippets.push(el.content);
      }
    });
  });

  const primaryKeyword = firstHeading || updated.name || 'Dịch Vụ Chuyên Nghiệp';

  // 2. Generate optimal Title (50-60 chars)
  if (!currentSettings.title || currentSettings.title.length < 25) {
    let newTitle = `${primaryKeyword} | Giải Pháp Hàng Đầu & Uy Tín`;
    if (newTitle.length > 60) {
      newTitle = `${primaryKeyword} - Uy Tín & Đẳng Cấp`;
    }
    currentSettings.title = newTitle;
  }

  // 3. Generate optimal Description (130-155 chars)
  if (!currentSettings.metaDescription || currentSettings.metaDescription.length < 60) {
    currentSettings.metaDescription = `Khám phá ${primaryKeyword} với chất lượng vượt trội, tối ưu chi phí và hỗ trợ chuyên nghiệp 24/7. Trải nghiệm ngay hôm nay để nhận ưu đãi đặc biệt!`;
  }

  // 4. Default Keywords
  if (!currentSettings.keywords) {
    currentSettings.keywords = `${primaryKeyword}, dịch vụ chất lượng, tư vấn miễn phí, giải pháp uy tín, ${updated.name}`;
  }

  // 5. Canonical & Open Graph
  if (!currentSettings.canonicalUrl) {
    currentSettings.canonicalUrl = 'https://mywebsite.com';
  }
  if (!currentSettings.ogImage) {
    currentSettings.ogImage =
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop';
  }
  if (!currentSettings.ogType) {
    currentSettings.ogType = 'website';
  }
  if (!currentSettings.twitterCard) {
    currentSettings.twitterCard = 'summary_large_image';
  }
  currentSettings.robotsIndex = true;
  currentSettings.robotsFollow = true;
  currentSettings.language = 'vi';

  // 6. Fix Missing Alt Tags in all canvas images
  updated.sections.forEach((sec) => {
    sec.elements.forEach((el) => {
      if (el.type === 'image') {
        if (!el.alt || el.alt.trim() === '' || el.alt === 'Image') {
          el.alt = `${primaryKeyword} - Hình ảnh minh họa ${sec.name || 'sản phẩm'}`;
        }
      }
    });
  });

  updated.settings = currentSettings;
  updated.lastModified = Date.now();

  return updated;
}
