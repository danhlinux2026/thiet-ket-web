import { BlockPreset } from '../types';

export const BLOCKS_CATALOG: BlockPreset[] = [
  // 1. Navigation Header
  {
    id: 'blk-nav-modern',
    name: 'Thanh Menu Điều Hướng Hiện Đại',
    category: 'header',
    categoryName: 'Thanh Điều Hướng',
    description: 'Header cố định với logo thương hiệu, danh sách liên kết và nút kêu gọi hành động.',
    section: {
      id: '',
      name: 'Thanh Menu Điều Hướng',
      category: 'header',
      layout: 'container',
      styles: {
        backgroundColor: '#0f172a',
        paddingTop: 16,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h3',
          content: '🚀 Brand<span class="text-indigo-400">Hub</span>',
          styles: { fontSize: 'xl', fontWeight: 'bold', textColor: '#f8fafc' },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Trang Chủ • Tính Năng • Bảng Giá • Về Chúng Tôi • Liên Hệ',
          styles: { fontSize: 'sm', textColor: '#94a3b8', textAlign: 'center' },
        },
        {
          id: '',
          type: 'button',
          content: 'Đăng Ký Ngay',
          variant: 'primary',
          styles: {
            backgroundColor: '#6366f1',
            textColor: '#ffffff',
            borderRadius: 'full',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 20,
            paddingRight: 20,
            fontWeight: 'semibold',
          },
        },
      ],
    },
  },

  // 2. Hero Section Center
  {
    id: 'blk-hero-center',
    name: 'Hero Section Trung Tâm & Đồ Họa',
    category: 'hero',
    categoryName: 'Hero Banner',
    description: 'Tiêu đề lớn nổi bật, huy hiệu thông báo, đoạn mô tả chuyển đổi và hình ảnh giao diện dashboard.',
    section: {
      id: '',
      name: 'Hero Banner Trung Tâm',
      category: 'hero',
      layout: 'container',
      styles: {
        backgroundColor: '#0f172a',
        paddingTop: 70,
        paddingBottom: 70,
        textAlign: 'center',
      },
      elements: [
        {
          id: '',
          type: 'badge',
          badgeText: '✨ Tính Năng Mới 2026: Tăng Trưởng Đột Phá',
          badgeVariant: 'subtle',
          styles: {
            backgroundColor: '#1e1b4b',
            textColor: '#818cf8',
            borderRadius: 'full',
            marginBottom: 16,
          },
        },
        {
          id: '',
          type: 'heading',
          tag: 'h1',
          content: 'Xây Dựng Website Đỉnh Cao Không Cần Viết Code',
          styles: {
            fontSize: '4xl',
            fontWeight: 'extrabold',
            textColor: '#ffffff',
            marginBottom: 16,
          },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Công cụ kéo thả mạnh mẽ giúp bạn tạo landing page bán hàng, portfolio và website doanh nghiệp chuẩn SEO chỉ trong 10 phút.',
          styles: {
            fontSize: 'lg',
            textColor: '#94a3b8',
            marginBottom: 28,
            maxWidth: '2xl',
          },
        },
        {
          id: '',
          type: 'button',
          content: 'Tạo Website Của Bạn Ngay',
          variant: 'primary',
          styles: {
            backgroundColor: '#6366f1',
            textColor: '#ffffff',
            borderRadius: 'xl',
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 32,
            paddingRight: 32,
            fontWeight: 'bold',
          },
        },
        {
          id: '',
          type: 'image',
          src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
          alt: 'Dashboard Showcase',
          styles: {
            borderRadius: 'xl',
            marginTop: 40,
            boxShadow: '2xl',
            borderWidth: 1,
            borderColor: '#334155',
          },
        },
      ],
    },
  },

  // 3. Features 3-Card Grid
  {
    id: 'blk-feat-grid',
    name: 'Khối 3 Thẻ Tính Năng Nổi Bật',
    category: 'features',
    categoryName: 'Tính Năng & Dịch Vụ',
    description: 'Bố cục 3 cột trực quan với icon sinh động, tiêu đề tính năng và nội dung chi tiết.',
    section: {
      id: '',
      name: 'Tính Năng Nổi Bật',
      category: 'features',
      layout: 'container',
      styles: {
        backgroundColor: '#0b1120',
        paddingTop: 70,
        paddingBottom: 70,
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Tại Sao Hàng Ngàn Doanh Nghiệp Chọn Chúng Tôi?',
          styles: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: 12,
          },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Tối ưu tốc độ tải trang, nâng cao tỷ lệ chuyển đổi và trải nghiệm người dùng tuyệt vời.',
          styles: {
            fontSize: 'base',
            textColor: '#94a3b8',
            textAlign: 'center',
            marginBottom: 44,
          },
        },
        {
          id: '',
          type: 'card',
          styles: { columns: 3, gap: 24 },
          items: [
            {
              id: 'f-1',
              title: 'Tốc Độ Tải Siêu Nhanh',
              description: 'Tối ưu hóa mã nguồn và nén hình ảnh tự động đạt điểm Google PageSpeed 99/100.',
              icon: 'Zap',
            },
            {
              id: '',
              title: 'Tương Thích Mọi Thiết Bị',
              description: 'Tự động co giãn mượt mà trên Desktop, Máy tính bảng và Điện thoại thông minh.',
              icon: 'Smartphone',
            },
            {
              id: '',
              title: 'Bảo Mật SSL & Sao Lưu Tự Động',
              description: 'Mã hóa an toàn dữ liệu và sao lưu liên tục giúp bạn hoàn toàn an tâm phát triển.',
              icon: 'Shield',
            },
          ],
        },
      ],
    },
  },

  // 4. Stats Counter Bar
  {
    id: 'blk-stats-bar',
    name: 'Thanh Thống Kê Số Liệu Ấn Tượng',
    category: 'stats',
    categoryName: 'Số Liệu & Thống Kê',
    description: '4 cột hiển thị con số thành tích nổi bật, tạo sự tin tưởng tuyệt đối cho khách hàng.',
    section: {
      id: '',
      name: 'Số Liệu Thống Kê',
      category: 'stats',
      layout: 'container',
      styles: {
        backgroundColor: '#1e293b',
        paddingTop: 48,
        paddingBottom: 48,
        borderRadius: 'xl',
      },
      elements: [
        {
          id: '',
          type: 'stats-item',
          styles: { columns: 4, gap: 16 },
          items: [
            { id: '', statNumber: '50.000+', statLabel: 'Khách Hàng Tin Dùng' },
            { id: '', statNumber: '99.9%', statLabel: 'Thời Gian Hoạt Động' },
            { id: '', statNumber: '24/7', statLabel: 'Hỗ Trợ Kỹ Thuật' },
            { id: '', statNumber: '4.9 ★', statLabel: 'Đánh Giá 5 Sao' },
          ],
        },
      ],
    },
  },

  // 5. Pricing Table 3-Tiers
  {
    id: 'blk-pricing-table',
    name: 'Bảng Giá Dịch Vụ 3 Gói Chuyên Nghiệp',
    category: 'pricing',
    categoryName: 'Bảng Giá & Gói Dịch Vụ',
    description: '3 thẻ giá với huy hiệu phổ biến nhất, danh sách tính năng checkmark và nút đặt mua.',
    section: {
      id: '',
      name: 'Bảng Giá Gói Dịch Vụ',
      category: 'pricing',
      layout: 'container',
      styles: {
        backgroundColor: '#0f172a',
        paddingTop: 80,
        paddingBottom: 80,
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Bảng Giá Minh Bạch - Không Phí Ẩn',
          styles: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: 12,
          },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Chọn gói phù hợp với quy mô kinh doanh của bạn. Nâng cấp hoặc hủy bất kỳ lúc nào.',
          styles: {
            fontSize: 'base',
            textColor: '#94a3b8',
            textAlign: 'center',
            marginBottom: 44,
          },
        },
        {
          id: '',
          type: 'pricing-card',
          styles: { columns: 3, gap: 24 },
          items: [
            {
              id: '',
              title: 'Cá Nhân (Starter)',
              price: '199.000₫',
              period: '/ tháng',
              description: 'Hoàn hảo cho người mới bắt đầu lập website cá nhân.',
              features: ['1 Tên miền tùy chỉnh', 'Dung lượng 5GB SSD', 'Băng thông không giới hạn', 'Chứng chỉ SSL miễn phí'],
              buttonText: 'Chọn Gói Này',
              popular: false,
            },
            {
              id: '',
              title: 'Chuyên Nghiệp (Pro)',
              price: '499.000₫',
              period: '/ tháng',
              description: 'Lựa chọn lý tưởng cho các cửa hàng và doanh nghiệp vừa.',
              features: ['5 Tên miền tùy chỉnh', 'Dung lượng 50GB SSD', 'Công cụ Marketing & SEO', 'Hỗ trợ ưu tiên 24/7', 'Xóa bỏ logo bản quyền'],
              buttonText: 'Dùng Thử Miễn Phí',
              popular: true,
            },
            {
              id: '',
              title: 'Doanh Nghiệp (VIP)',
              price: '1.299.000₫',
              period: '/ tháng',
              description: 'Dành cho các hệ thống lớn đòi hỏi tốc độ và bảo mật tuyệt đối.',
              features: ['Không giới hạn tên miền', 'Dung lượng 500GB SSD NVMe', 'IP Riêng biệt & CDN Quốc tế', 'Quản trị viên hỗ trợ riêng'],
              buttonText: 'Liên Hệ Tư Vấn',
              popular: false,
            },
          ],
        },
      ],
    },
  },

  // 6. Testimonials & Social Proof
  {
    id: 'blk-testimonials',
    name: 'Đánh Giá Khách Hàng & Uy Tín',
    category: 'testimonials',
    categoryName: 'Đánh Giá & Uy Tín',
    description: '3 thẻ nhận xét của khách hàng kèm xếp hạng 5 sao, ảnh đại diện và chức danh.',
    section: {
      id: '',
      name: 'Nhận Xét Của Khách Hàng',
      category: 'testimonials',
      layout: 'container',
      styles: {
        backgroundColor: '#0b1120',
        paddingTop: 70,
        paddingBottom: 70,
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Khách Hàng Nói Gì Về Chúng Tôi?',
          styles: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: 40,
          },
        },
        {
          id: '',
          type: 'testimonial-card',
          styles: { columns: 3, gap: 24 },
          items: [
            {
              id: '',
              title: 'Tăng 300% Doanh Thu Trong 2 Tháng',
              description: 'Website tải cực nhanh, giao diện đẹp mắt giúp khách hàng ở lại trang lâu hơn và chốt đơn ngay lập tức.',
              author: 'Nguyễn Thành Nam',
              role: 'CEO @ TechViet Solutions',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
              rating: 5,
            },
            {
              id: '',
              title: 'Dễ Sử Dụng Kể Cả Không Biết Code',
              description: 'Chỉ cần kéo thả và chỉnh sửa chữ trực tiếp, tôi đã tự dựng được trang bán hàng thời trang tuyệt đẹp.',
              author: 'Lê Mai Anh',
              role: 'Founder @ Lumina Boutique',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
              rating: 5,
            },
            {
              id: '',
              title: 'Hỗ Trợ Kỹ Thuật Nhiệt Tình 10/10',
              description: 'Đội ngũ hỗ trợ giải đáp mọi thắc mắc rất nhanh chóng và chuyên nghiệp. Rất đáng đồng tiền!',
              author: 'Trần Hoàng Đức',
              role: 'Marketing Director @ Apex Media',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
              rating: 5,
            },
          ],
        },
      ],
    },
  },

  // 7. FAQ Accordion
  {
    id: 'blk-faq-accordion',
    name: 'Câu Hỏi Thường Gặp (FAQ)',
    category: 'faq',
    categoryName: 'Hỏi Đáp (FAQ)',
    description: 'Khối danh sách câu hỏi đóng mở mượt mà giúp giải đáp nhanh các thắc mắc của khách hàng.',
    section: {
      id: '',
      name: 'Câu Hỏi Thường Gặp',
      category: 'faq',
      layout: 'container',
      styles: {
        backgroundColor: '#0f172a',
        paddingTop: 70,
        paddingBottom: 70,
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Giải Đáp Thắc Mắc Phổ Biến',
          styles: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: 36,
          },
        },
        {
          id: '',
          type: 'accordion',
          styles: { maxWidth: '4xl' },
          items: [
            {
              id: '',
              title: 'Tôi có cần biết lập trình hoặc thiết kế để sử dụng không?',
              description: 'Hoàn toàn không! Mọi thao tác đều được thực hiện qua giao diện kéo thả trực quan và chỉnh sửa trực tiếp trên màn hình.',
            },
            {
              id: '',
              title: 'Tôi có thể gắn tên miền riêng (.com, .vn) của mình vào không?',
              description: 'Có, bạn hoàn toàn có thể kết nối tên miền riêng của mình chỉ với vài thao tác cấu hình DNS đơn giản.',
            },
            {
              id: '',
              title: 'Website có chuẩn SEO và tối ưu trên điện thoại không?',
              description: 'Tất cả mẫu giao diện và khối nội dung đều được tối ưu hóa cấu trúc chuẩn SEO Google và phản hồi mượt mà 100% trên mọi thiết bị di động.',
            },
            {
              id: '',
              title: 'Chính sách hoàn tiền và hỗ trợ khách hàng như thế nào?',
              description: 'Chúng tôi cam kết hoàn tiền 100% trong vòng 14 ngày nếu bạn không hài lòng với bất kỳ lý do gì.',
            },
          ],
        },
      ],
    },
  },

  // 8. Call To Action Banner
  {
    id: 'blk-cta-banner',
    name: 'Kêu Gọi Hành Động (CTA Box)',
    category: 'cta',
    categoryName: 'Kêu Gọi Hành Động (CTA)',
    description: 'Hộp banner nổi bật thúc đẩy người dùng đăng ký hoặc để lại thông tin liên hệ ngay.',
    section: {
      id: '',
      name: 'Kêu Gọi Hành Động',
      category: 'cta',
      layout: 'container',
      styles: {
        backgroundColor: '#1e1b4b',
        paddingTop: 60,
        paddingBottom: 60,
        borderRadius: '2xl',
        borderWidth: 1,
        borderColor: '#4338ca',
        textAlign: 'center',
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Sẵn Sàng Đột Phá Doanh Số Của Bạn?',
          styles: {
            fontSize: '3xl',
            fontWeight: 'extrabold',
            textColor: '#ffffff',
            marginBottom: 16,
          },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Tham gia cùng hơn 50.000+ nhà sáng tạo và doanh nghiệp đang phát triển vượt bậc mỗi ngày.',
          styles: {
            fontSize: 'base',
            textColor: '#c7d2fe',
            marginBottom: 28,
            maxWidth: 'xl',
          },
        },
        {
          id: '',
          type: 'button',
          content: 'Bắt Đầu Miễn Phí Hôm Nay →',
          variant: 'primary',
          styles: {
            backgroundColor: '#ffffff',
            textColor: '#4338ca',
            borderRadius: 'xl',
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 36,
            paddingRight: 36,
            fontWeight: 'bold',
            boxShadow: 'xl',
          },
        },
      ],
    },
  },

  // 9. Contact & Form
  {
    id: 'blk-contact-form',
    name: 'Form Liên Hệ & Tư Vấn Trực Tuyến',
    category: 'contact',
    categoryName: 'Liên Hệ & Bản Đồ',
    description: 'Biểu mẫu điền thông tin gửi tin nhắn kèm địa chỉ văn phòng, hotline và email hỗ trợ.',
    section: {
      id: '',
      name: 'Liên Hệ Với Chúng Tôi',
      category: 'contact',
      layout: 'container',
      styles: {
        backgroundColor: '#0f172a',
        paddingTop: 70,
        paddingBottom: 70,
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h2',
          content: 'Liên Hệ Đội Ngũ Chuyên Gia',
          styles: {
            fontSize: '3xl',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: 12,
          },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Hãy để lại lời nhắn, chuyên viên tư vấn của chúng tôi sẽ phản hồi bạn trong vòng 15 phút.',
          styles: {
            fontSize: 'base',
            textColor: '#94a3b8',
            textAlign: 'center',
            marginBottom: 36,
          },
        },
        {
          id: '',
          type: 'form-input',
          styles: { maxWidth: '2xl' },
          items: [
            { id: '', title: 'Họ và tên của bạn', placeholder: 'Ví dụ: Nguyễn Văn A' },
            { id: '', title: 'Địa chỉ Email', placeholder: 'name@example.com' },
            { id: '', title: 'Số điện thoại liên hệ', placeholder: '0987 654 321' },
            { id: '', title: 'Nội dung yêu cầu tư vấn', placeholder: 'Mô tả dự án hoặc mong muốn của bạn...' },
          ],
          content: 'Gửi Thông Tin Ngay',
        },
      ],
    },
  },

  // 10. Footer Modern
  {
    id: 'blk-footer-full',
    name: 'Chân Trang Đầy Đủ Liên Kết',
    category: 'footer',
    categoryName: 'Chân Trang (Footer)',
    description: 'Chân trang chuyên nghiệp nhiều cột: giới thiệu, sản phẩm, giải pháp, pháp lý và bản quyền.',
    section: {
      id: '',
      name: 'Chân Trang Đa Cột',
      category: 'footer',
      layout: 'container',
      styles: {
        backgroundColor: '#090d16',
        paddingTop: 60,
        paddingBottom: 36,
        borderWidth: 1,
        borderColor: '#1e293b',
      },
      elements: [
        {
          id: '',
          type: 'heading',
          tag: 'h3',
          content: '⚡ WebStudio Platform',
          styles: { fontSize: 'xl', fontWeight: 'bold', textColor: '#ffffff', marginBottom: 12 },
        },
        {
          id: '',
          type: 'paragraph',
          content: 'Nền tảng tạo và xuất bản website trực quan thế hệ mới dành cho các doanh nghiệp và nhà sáng tạo hiện đại.',
          styles: { fontSize: 'sm', textColor: '#64748b', marginBottom: 24, maxWidth: 'md' },
        },
        {
          id: '',
          type: 'paragraph',
          content: '© 2026 WebStudio. Bảo lưu mọi quyền. Được phát triển với công nghệ tối tân.',
          styles: { fontSize: 'xs', textColor: '#475569', textAlign: 'center' },
        },
      ],
    },
  },
];
