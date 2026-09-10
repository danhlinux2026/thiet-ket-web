import { TemplateDefinition } from '../types';
import { THEME_PRESETS } from './themes';

export const TEMPLATES_CATALOG: TemplateDefinition[] = [
  // 1. SaaS & AI Tech Platform
  {
    id: 'nexus-ai-saas',
    name: 'NexusAI - Nền tảng AI Thông minh',
    category: 'saas',
    categoryName: 'SaaS & Công Nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    description: 'Giao diện hiện đại công nghệ cao, phối màu Dark mode với hiệu ứng gradient, bảng giá động và khối tính năng Bento Grid.',
    tags: ['SaaS', 'AI', 'Dark Mode', 'Bento Grid', 'Tech'],
    theme: THEME_PRESETS[0], // modern-dark
    sections: [
      {
        id: 'sec-nav-1',
        name: 'Thanh Điều Hướng Sticky',
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
            id: 'el-nav-logo',
            type: 'heading',
            tag: 'h3',
            content: '⚡ Nexus<span class="text-indigo-400">AI</span>',
            styles: { fontSize: 'xl', fontWeight: 'bold', textColor: '#f8fafc' },
          },
          {
            id: 'el-nav-links',
            type: 'paragraph',
            content: 'Tính năng • Bảng giá • Đánh giá • Hỏi đáp',
            styles: { fontSize: 'sm', textColor: '#94a3b8', textAlign: 'center' },
          },
          {
            id: 'el-nav-btn',
            type: 'button',
            content: 'Dùng Thử Miễn Phí',
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
      {
        id: 'sec-hero-1',
        name: 'Hero Banner Công Nghệ AI',
        category: 'hero',
        layout: 'container',
        styles: {
          backgroundColor: '#0f172a',
          paddingTop: 80,
          paddingBottom: 80,
          textAlign: 'center',
        },
        elements: [
          {
            id: 'el-hero-badge',
            type: 'badge',
            badgeText: '✨ Ra mắt phiên bản Nexus 4.0 với Siêu Tốc Độ',
            badgeVariant: 'subtle',
            styles: {
              backgroundColor: '#1e1b4b',
              textColor: '#818cf8',
              borderRadius: 'full',
              marginBottom: 20,
              fontSize: 'sm',
            },
          },
          {
            id: 'el-hero-h1',
            type: 'heading',
            tag: 'h1',
            content: 'Tự Động Hóa Mọi Quy Trình Với <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Trí Tuệ Nhân Tạo</span>',
            styles: {
              fontSize: '5xl',
              fontWeight: 'extrabold',
              textColor: '#ffffff',
              marginBottom: 20,
              maxWidth: '4xl',
            },
          },
          {
            id: 'el-hero-desc',
            type: 'paragraph',
            content: 'Tối ưu hóa năng suất làm việc gấp 10 lần, xử lý dữ liệu thông minh trong vài giây và gia tăng doanh thu vượt trội cho doanh nghiệp của bạn.',
            styles: {
              fontSize: 'lg',
              textColor: '#94a3b8',
              marginBottom: 32,
              maxWidth: '2xl',
            },
          },
          {
            id: 'el-hero-cta-btn',
            type: 'button',
            content: 'Bắt Đầu Miễn Phí Ngay (14 Ngày)',
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
              boxShadow: 'lg',
            },
          },
          {
            id: 'el-hero-img',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
            alt: 'NexusAI Analytics Dashboard Preview',
            styles: {
              borderRadius: 'xl',
              marginTop: 48,
              boxShadow: '2xl',
              borderWidth: 1,
              borderColor: '#334155',
            },
          },
        ],
      },
      {
        id: 'sec-features-1',
        name: 'Khối Tính Năng Nổi Bật',
        category: 'features',
        layout: 'container',
        styles: {
          backgroundColor: '#0b1120',
          paddingTop: 80,
          paddingBottom: 80,
        },
        elements: [
          {
            id: 'el-feat-head',
            type: 'heading',
            tag: 'h2',
            content: 'Giải Pháp Toàn Diện Cho Doanh Nghiệp',
            styles: {
              fontSize: '3xl',
              fontWeight: 'bold',
              textColor: '#ffffff',
              textAlign: 'center',
              marginBottom: 12,
            },
          },
          {
            id: 'el-feat-sub',
            type: 'paragraph',
            content: 'Tích hợp đầy đủ các công cụ phân tích, tự động hóa và bảo mật cấp doanh nghiệp.',
            styles: {
              fontSize: 'base',
              textColor: '#94a3b8',
              textAlign: 'center',
              marginBottom: 48,
            },
          },
          {
            id: 'el-feat-grid',
            type: 'card',
            styles: { gap: 24, columns: 3 },
            items: [
              {
                id: 'feat-1',
                title: 'Tự Động Hóa Thông Minh',
                description: 'Xây dựng kịch bản luồng công việc phức tạp chỉ với vài thao tác kéo thả không cần code.',
                icon: 'Zap',
              },
              {
                id: 'feat-2',
                title: 'Bảo Mật Cấp Doanh Nghiệp',
                description: 'Mã hóa đầu cuối chuẩn quân sự AES-256 đảm bảo tài liệu bí mật tuyệt đối.',
                icon: 'Shield',
              },
              {
                id: 'feat-3',
                title: 'Phân Tích Dữ Liệu Thời Gian Thực',
                description: 'Dự báo xu hướng tài chính và khách hàng bằng các mô hình học máy chuẩn xác.',
                icon: 'TrendingUp',
              },
            ],
          },
        ],
      },
      {
        id: 'sec-pricing-1',
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
            id: 'el-price-title',
            type: 'heading',
            tag: 'h2',
            content: 'Lựa Chọn Gói Phù Hợp Với Bạn',
            styles: {
              fontSize: '3xl',
              fontWeight: 'bold',
              textColor: '#ffffff',
              textAlign: 'center',
              marginBottom: 12,
            },
          },
          {
            id: 'el-price-cards',
            type: 'pricing-card',
            styles: { columns: 3, gap: 24 },
            items: [
              {
                id: 'p-1',
                title: 'Cơ Bản (Starter)',
                price: '299.000₫',
                period: '/ tháng',
                description: 'Dành cho cá nhân và freelancer muốn khám phá sức mạnh AI.',
                features: ['5.000 AI Credits / tháng', '1 dự án kích hoạt', 'Hỗ trợ qua email trong 24h', 'Xuất báo cáo PDF tiêu chuẩn'],
                buttonText: 'Bắt Đầu Ngay',
                popular: false,
              },
              {
                id: 'p-2',
                title: 'Chuyên Nghiệp (Pro)',
                price: '799.000₫',
                period: '/ tháng',
                description: 'Gói phổ biến nhất cho nhóm làm việc và công ty vừa & nhỏ.',
                features: ['Không giới hạn AI Credits', '10 thành viên cùng làm việc', 'Tích hợp API không giới hạn', 'Hỗ trợ VIP 24/7 qua Livechat', 'Phân tích dự báo chuyên sâu'],
                buttonText: 'Dùng Thử Gói Pro',
                popular: true,
              },
              {
                id: 'p-3',
                title: 'Doanh Nghiệp (Enterprise)',
                price: 'Liên Hệ',
                period: '',
                description: 'Tùy biến riêng biệt theo hạ tầng và yêu cầu đặc thù của tập đoàn.',
                features: ['Máy chủ riêng Dedicated', 'SLA cam kết 99.99%', 'Quản lý tài khoản riêng', 'Đào tạo nhân sự trực tiếp'],
                buttonText: 'Tư Vấn Doanh Nghiệp',
                popular: false,
              },
            ],
          },
        ],
      },
      {
        id: 'sec-footer-1',
        name: 'Chân Trang Hiện Đại',
        category: 'footer',
        layout: 'container',
        styles: {
          backgroundColor: '#090d16',
          paddingTop: 60,
          paddingBottom: 40,
          borderWidth: 1,
          borderColor: '#1e293b',
        },
        elements: [
          {
            id: 'el-foot-copy',
            type: 'paragraph',
            content: '© 2026 NexusAI Inc. Tất cả quyền được bảo lưu. Thiết kế và tối ưu bởi WebStudio.',
            styles: {
              fontSize: 'sm',
              textColor: '#64748b',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  },

  // 2. E-commerce Fashion Store
  {
    id: 'lumina-fashion',
    name: 'LUMINA - Thời Trang Cao Cấp',
    category: 'ecommerce',
    categoryName: 'Thời Trang & Shop',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    description: 'Phong cách tối giản thanh lịch, tôn vinh hình ảnh sản phẩm thời trang, giỏ hàng trực quan và bộ sưu tập xu hướng.',
    tags: ['Thời Trang', 'E-commerce', 'Minimal', 'Sản Phẩm', 'Luxury'],
    theme: THEME_PRESETS[1], // clean-saas (light)
    sections: [
      {
        id: 'sec-lum-nav',
        name: 'Thanh Menu Thương Hiệu',
        category: 'header',
        layout: 'container',
        styles: {
          backgroundColor: '#ffffff',
          paddingTop: 18,
          paddingBottom: 18,
          borderWidth: 1,
          borderColor: '#f1f5f9',
        },
        elements: [
          {
            id: 'el-lum-logo',
            type: 'heading',
            tag: 'h3',
            content: 'L U M I N A',
            styles: {
              fontSize: '2xl',
              fontWeight: 'extrabold',
              textColor: '#0f172a',
              textAlign: 'center',
            },
          },
          {
            id: 'el-lum-menu',
            type: 'paragraph',
            content: 'Bộ Sưu Tập Mới • Áo Khoác • Phụ Kiện • Lookbook • Giảm Giá',
            styles: {
              fontSize: 'sm',
              fontWeight: 'medium',
              textColor: '#475569',
              textAlign: 'center',
            },
          },
        ],
      },
      {
        id: 'sec-lum-hero',
        name: 'Hero Banner Bộ Sưu Tập Mùa Mới',
        category: 'hero',
        layout: 'container',
        styles: {
          backgroundColor: '#fafafa',
          paddingTop: 60,
          paddingBottom: 60,
        },
        elements: [
          {
            id: 'el-lum-hero-img',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
            alt: 'LUMINA New Season Fashion Collection',
            styles: {
              borderRadius: 'lg',
              boxShadow: 'xl',
              marginBottom: 32,
            },
          },
          {
            id: 'el-lum-hero-h1',
            type: 'heading',
            tag: 'h1',
            content: 'AUTUMN / WINTER 2026 EDIT',
            styles: {
              fontSize: '4xl',
              fontWeight: 'extrabold',
              textColor: '#0f172a',
              textAlign: 'center',
              marginBottom: 12,
            },
          },
          {
            id: 'el-lum-hero-p',
            type: 'paragraph',
            content: 'Đường nét cắt may tinh tế kết hợp chất liệu len Cashmere thượng hạng mang đến vẻ đẹp sang trọng vượt thời gian.',
            styles: {
              fontSize: 'base',
              textColor: '#64748b',
              textAlign: 'center',
              marginBottom: 24,
              maxWidth: 'xl',
            },
          },
          {
            id: 'el-lum-hero-btn',
            type: 'button',
            content: 'Khám Phá Bộ Sưu Tập',
            variant: 'primary',
            styles: {
              backgroundColor: '#0f172a',
              textColor: '#ffffff',
              borderRadius: 'none',
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 36,
              paddingRight: 36,
              fontWeight: 'semibold',
            },
          },
        ],
      },
      {
        id: 'sec-lum-products',
        name: 'Sản Phẩm Bán Chạy Nhất',
        category: 'gallery',
        layout: 'container',
        styles: {
          backgroundColor: '#ffffff',
          paddingTop: 80,
          paddingBottom: 80,
        },
        elements: [
          {
            id: 'el-lum-prod-head',
            type: 'heading',
            tag: 'h2',
            content: 'Sản Phẩm Được Yêu Thích',
            styles: {
              fontSize: '3xl',
              fontWeight: 'bold',
              textColor: '#0f172a',
              textAlign: 'center',
              marginBottom: 40,
            },
          },
          {
            id: 'el-lum-prod-grid',
            type: 'card',
            styles: { columns: 3, gap: 28 },
            items: [
              {
                id: 'prod-1',
                title: 'Áo Khoác Trench Coat Dáng Dài',
                subtitle: 'Chất liệu chống thấm cao cấp',
                price: '1.850.000₫',
                image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
                buttonText: 'Thêm Vào Giỏ Hàng',
              },
              {
                id: 'prod-2',
                title: 'Đồng Hồ Minimalist Classic',
                subtitle: 'Mặt kính Sapphire nguyên khối',
                price: '3.200.000₫',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
                buttonText: 'Thêm Vào Giỏ Hàng',
              },
              {
                id: 'prod-3',
                title: 'Túi Xách Da Thủ Công Thượng Hạng',
                subtitle: 'Da bò Ý cao cấp khâu tay',
                price: '2.450.000₫',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
                buttonText: 'Thêm Vào Giỏ Hàng',
              },
            ],
          },
        ],
      },
    ],
  },

  // 3. Portfolio & Creative Studio
  {
    id: 'portfolio-creative',
    name: 'Minh Khang - UI/UX & Brand Designer',
    category: 'portfolio',
    categoryName: 'Portfolio Cá Nhân',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    description: 'Trang cá nhân giới thiệu kinh nghiệm, dự án tiêu biểu, kỹ năng nổi bật và form liên hệ hợp tác trực tiếp.',
    tags: ['Portfolio', 'Designer', 'Developer', 'Freelancer', 'Personal'],
    theme: THEME_PRESETS[4], // vibrant-purple
    sections: [
      {
        id: 'sec-port-hero',
        name: 'Hero Giới Thiệu Chuyên Môn',
        category: 'hero',
        layout: 'container',
        styles: {
          backgroundColor: '#18181b',
          paddingTop: 90,
          paddingBottom: 80,
          textAlign: 'center',
        },
        elements: [
          {
            id: 'el-port-avatar',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
            alt: 'Minh Khang Avatar',
            styles: {
              borderRadius: 'full',
              boxShadow: 'xl',
              marginBottom: 24,
              borderWidth: 3,
              borderColor: '#8b5cf6',
            },
          },
          {
            id: 'el-port-title',
            type: 'heading',
            tag: 'h1',
            content: 'Xin chào, tôi là <span class="text-violet-400">Minh Khang</span> 👋<br/>Senior Product Designer & Web Creator',
            styles: {
              fontSize: '4xl',
              fontWeight: 'extrabold',
              textColor: '#fafafa',
              marginBottom: 16,
            },
          },
          {
            id: 'el-port-bio',
            type: 'paragraph',
            content: 'Hơn 7 năm kinh nghiệm thiết kế trải nghiệm người dùng trực quan, tối ưu chuyển đổi cho hơn 50+ startup công nghệ và thương hiệu toàn cầu.',
            styles: {
              fontSize: 'lg',
              textColor: '#a1a1aa',
              marginBottom: 32,
              maxWidth: '2xl',
            },
          },
          {
            id: 'el-port-btn-group',
            type: 'button',
            content: 'Xem Dự Án Tiêu Biểu ↓',
            variant: 'primary',
            styles: {
              backgroundColor: '#8b5cf6',
              textColor: '#ffffff',
              borderRadius: 'full',
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 30,
              paddingRight: 30,
              fontWeight: 'bold',
            },
          },
        ],
      },
      {
        id: 'sec-port-stats',
        name: 'Thống Kê Thành Tựu',
        category: 'stats',
        layout: 'container',
        styles: {
          backgroundColor: '#27272a',
          paddingTop: 50,
          paddingBottom: 50,
          borderRadius: 'xl',
        },
        elements: [
          {
            id: 'el-port-stat-items',
            type: 'stats-item',
            styles: { columns: 4, gap: 16 },
            items: [
              { id: 'st-1', statNumber: '7+', statLabel: 'Năm Kinh Nghiệm' },
              { id: 'st-2', statNumber: '85+', statLabel: 'Dự Án Hoàn Tất' },
              { id: 'st-3', statNumber: '99%', statLabel: 'Khách Hàng Hài Lòng' },
              { id: 'st-4', statNumber: '12', statLabel: 'Giải Thưởng Thiết Kế' },
            ],
          },
        ],
      },
    ],
  },

  // 4. Restaurant & Bistro
  {
    id: 'la-maison-bistro',
    name: 'La Maison Bistro - Ẩm Thực Pháp',
    category: 'restaurant',
    categoryName: 'Nhà Hàng & Cafe',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
    description: 'Thiết kế sang trọng, ấm cúng dành cho nhà hàng, quán cafe cao cấp kèm thực đơn món ăn đặc sắc và form đặt bàn nhanh.',
    tags: ['Nhà Hàng', 'Ẩm Thực', 'Menu', 'Đặt Bàn', 'Bistro'],
    theme: THEME_PRESETS[2], // luxury-gold
    sections: [
      {
        id: 'sec-rest-hero',
        name: 'Hero Nhà Hàng Quý Phái',
        category: 'hero',
        layout: 'container',
        styles: {
          backgroundColor: '#0c0a09',
          paddingTop: 90,
          paddingBottom: 90,
          textAlign: 'center',
        },
        elements: [
          {
            id: 'el-rest-h1',
            type: 'heading',
            tag: 'h1',
            content: 'LA MAISON BISTRO',
            styles: {
              fontSize: '5xl',
              fontWeight: 'bold',
              textColor: '#f59e0b',
              marginBottom: 12,
              fontFamily: 'Playfair Display',
            },
          },
          {
            id: 'el-rest-tagline',
            type: 'paragraph',
            content: 'Trải Nghiệm Ẩm Thực Tinh Hoa Nước Pháp Giữa Lòng Thành Phố',
            styles: {
              fontSize: 'xl',
              textColor: '#fafaf9',
              marginBottom: 32,
            },
          },
          {
            id: 'el-rest-btn',
            type: 'button',
            content: 'Đặt Bàn Ngay Hôm Nay',
            variant: 'primary',
            styles: {
              backgroundColor: '#d97706',
              textColor: '#0c0a09',
              borderRadius: 'none',
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 36,
              paddingRight: 36,
              fontWeight: 'bold',
            },
          },
        ],
      },
      {
        id: 'sec-rest-menu',
        name: 'Thực Đơn Món Ăn Bếp Trưởng',
        category: 'features',
        layout: 'container',
        styles: {
          backgroundColor: '#1c1917',
          paddingTop: 80,
          paddingBottom: 80,
        },
        elements: [
          {
            id: 'el-rest-menu-h2',
            type: 'heading',
            tag: 'h2',
            content: 'Món Ăn Đặc Sắc (Signature Dishes)',
            styles: {
              fontSize: '3xl',
              fontWeight: 'bold',
              textColor: '#f59e0b',
              textAlign: 'center',
              marginBottom: 40,
            },
          },
          {
            id: 'el-rest-menu-items',
            type: 'card',
            styles: { columns: 3, gap: 24 },
            items: [
              {
                id: 'menu-1',
                title: 'Bò Wagyu Nướng Than Hồng',
                subtitle: 'Kèm sốt nấm Truffle đen Pháp',
                price: '950.000₫',
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
              },
              {
                id: 'menu-2',
                title: 'Gan Ngỗng Áp Chảo Bơ Pháp',
                subtitle: 'Sốt rượu vang đỏ và bánh mì Brioche',
                price: '680.000₫',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
              },
              {
                id: 'menu-3',
                title: 'Cà Phê Specialty & Bánh Soufflé',
                subtitle: 'Hạt Arabica rang mộc tuyển chọn',
                price: '180.000₫',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
              },
            ],
          },
        ],
      },
    ],
  },

  // 5. Education & Masterclass
  {
    id: 'edu-masterclass',
    name: 'EduPro - Khóa Học Masterclass',
    category: 'education',
    categoryName: 'Giáo Dục & Khóa Học',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
    description: 'Trang bán khóa học trực tuyến với lộ trình học chi tiết, đánh giá học viên, giảng viên chuyên gia và đếm ngược ưu đãi.',
    tags: ['Khóa Học', 'Học Trực Tuyến', 'Giáo Dục', 'Masterclass', 'Webinar'],
    theme: THEME_PRESETS[3], // emerald-growth
    sections: [
      {
        id: 'sec-edu-hero',
        name: 'Hero Đăng Ký Khóa Học',
        category: 'hero',
        layout: 'container',
        styles: {
          backgroundColor: '#f0fdf4',
          paddingTop: 80,
          paddingBottom: 80,
          textAlign: 'center',
        },
        elements: [
          {
            id: 'el-edu-badge',
            type: 'badge',
            badgeText: '🔥 Đã có 4.500+ Học viên Đăng ký Thành công',
            badgeVariant: 'solid',
            styles: {
              backgroundColor: '#059669',
              textColor: '#ffffff',
              borderRadius: 'full',
              marginBottom: 16,
            },
          },
          {
            id: 'el-edu-h1',
            type: 'heading',
            tag: 'h1',
            content: 'Làm Chủ Kỹ Năng Lập Trình & AI Từ Con Số 0',
            styles: {
              fontSize: '4xl',
              fontWeight: 'extrabold',
              textColor: '#064e3b',
              marginBottom: 16,
            },
          },
          {
            id: 'el-edu-desc',
            type: 'paragraph',
            content: 'Khóa học thực chiến 12 tuần giúp bạn nắm vững tư duy xây dựng sản phẩm web hiện đại và làm chủ các công cụ AI thế hệ mới.',
            styles: {
              fontSize: 'lg',
              textColor: '#047857',
              marginBottom: 32,
              maxWidth: '2xl',
            },
          },
          {
            id: 'el-edu-btn',
            type: 'button',
            content: 'Nhận Ưu Đãi Giảm 50% Ngay',
            variant: 'primary',
            styles: {
              backgroundColor: '#059669',
              textColor: '#ffffff',
              borderRadius: 'lg',
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 32,
              paddingRight: 32,
              fontWeight: 'bold',
            },
          },
        ],
      },
    ],
  },
  // 6. Dịch Vụ Thuê Xe Nha Trang - Đà Lạt (Pixel-Perfect 100% Giao Diện Gốc GitHub)
  {
    id: 'xedalatnhatrang-car-rental',
    name: 'Thuê Xe Nha Trang – Đà Lạt (Bản Chuẩn Gốc GitHub)',
    category: 'landing',
    categoryName: 'Dịch Vụ & Vận Tải',
    thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop',
    description: 'Bản thiết kế chuẩn 100% giao diện website Thuê Xe Nha Trang - Đà Lạt trên GitHub: bố cục 2 cột, form đặt xe trắng nổi bật, bảng giá 4 loại xe chuyên tuyến và nút gọi hotline tức thì.',
    tags: ['Thuê Xe', 'Nha Trang', 'Đà Lạt', 'Pixel-Perfect', 'GitHub', 'Đặt Xe'],
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
      fontHeading: 'Outfit',
      fontBody: 'Plus Jakarta Sans',
      radius: '1rem',
    },
    sections: [
      {
        id: 'sec-xd-header',
        name: 'Thanh Thông Tin Đầu Trang',
        category: 'header',
        layout: 'full-width',
        mode: 'raw_html',
        styles: { backgroundColor: '#0f172a', paddingTop: 0, paddingBottom: 0 },
        rawHtml: `<header class="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800">
  <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-4">
      <span class="flex items-center gap-1.5 text-slate-300">
        <i class="fa-solid fa-phone text-amber-400"></i> Hotline: <a href="tel:0911099712" class="font-bold text-white hover:text-amber-400 transition">0911 099 712</a>
      </span>
      <span class="hidden sm:flex items-center gap-1.5 text-slate-400">
        <i class="fa-solid fa-envelope text-indigo-400"></i> taxi@xedalatnhatrang.xyz
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="bg-amber-500/20 text-amber-400 font-semibold px-2.5 py-0.5 rounded-full text-[11px] border border-amber-500/30 flex items-center gap-1">
        <i class="fa-solid fa-bolt"></i> Đón trả tận nơi 24/7
      </span>
      <a href="tel:0911099712" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-md text-[11px] transition shadow-sm">
        Gọi Ngay
      </a>
    </div>
  </div>
</header>`,
        elements: [],
      },
      {
        id: 'sec-xd-hero',
        name: 'Khối Hero & Biểu Mẫu Đặt Xe',
        category: 'hero',
        layout: 'full-width',
        mode: 'raw_html',
        styles: { backgroundColor: '#1e3a8a', paddingTop: 0, paddingBottom: 0 },
        rawHtml: `<section class="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-12 md:py-16 px-4 overflow-hidden">
  <!-- Decorative Ambient Glows -->
  <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

  <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
    <!-- Left Column: Title & Key Selling Points -->
    <div class="lg:col-span-7 space-y-6">
      <div class="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-sm">
        <i class="fa-solid fa-award text-amber-400"></i>
        <span>DỊCH VỤ XE RIÊNG UY TÍN HÀNG ĐẦU</span>
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
        Thuê Xe Nha Trang – Đà Lạt Uy Tín, <span class="text-amber-400">Giá Tốt Nhất</span>
      </h1>

      <p class="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
        Dịch vụ xe riêng 4 - 7 - 16 - 29 chỗ đưa đón tận nơi Nha Trang đi Đà Lạt và ngược lại. Lái xe an toàn, lịch sự, đúng giờ, cam kết không phát sinh bất kỳ phụ phí nào.
      </p>

      <!-- Key Benefits List -->
      <div class="grid sm:grid-cols-2 gap-3 py-2">
        <div class="flex items-center gap-2.5 text-sm text-slate-100 font-medium">
          <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0"><i class="fa-solid fa-check"></i></span>
          <span>Xe đời mới, điều hòa mát sâu sạch sẽ</span>
        </div>
        <div class="flex items-center gap-2.5 text-sm text-slate-100 font-medium">
          <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0"><i class="fa-solid fa-check"></i></span>
          <span>Đón tận nơi tại khách sạn, sân bay</span>
        </div>
        <div class="flex items-center gap-2.5 text-sm text-slate-100 font-medium">
          <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0"><i class="fa-solid fa-check"></i></span>
          <span>Bao trọn phí cầu đường, trạm thu phí</span>
        </div>
        <div class="flex items-center gap-2.5 text-sm text-slate-100 font-medium">
          <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0"><i class="fa-solid fa-check"></i></span>
          <span>Tài xế chuyên nghiệp, chạy an toàn</span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-3 pt-2">
        <a href="tel:0911099712" class="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5">
          <i class="fa-solid fa-phone"></i>
          <span>Gọi Hotline: 0911 099 712</span>
        </a>
        <a href="https://zalo.me/0911099712" target="_blank" class="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/40 transition transform hover:-translate-y-0.5">
          <i class="fa-solid fa-comment-dots"></i>
          <span>Đặt Xe Nhanh Qua Zalo</span>
        </a>
      </div>
    </div>

    <!-- Right Column: White Interactive Booking Card (Pixel-Perfect) -->
    <div class="lg:col-span-5">
      <div class="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-car text-blue-600"></i>
              <span>Đặt Xe Nhanh Chóng</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Nhận báo giá và giữ xe chỉ sau 30 giây</p>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Có xe ngay
          </span>
        </div>

        <form onsubmit="event.preventDefault(); alert('Cảm ơn bạn! Tài xế sẽ liên hệ số điện thoại của bạn trong 5 phút để xác nhận.');" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Điểm đón khách</label>
            <div class="relative">
              <input type="text" placeholder="Ví dụ: Khách sạn tại Nha Trang hoặc Sân bay Cam Ranh" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-xs" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Điểm đến</label>
            <div class="relative">
              <input type="text" placeholder="Ví dụ: Trung tâm TP. Đà Lạt hoặc Khách sạn" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Loại xe</label>
              <select class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-xs font-medium">
                <option value="4">Xe 4 chỗ (750k)</option>
                <option value="7" selected>Xe 7 chỗ (850k)</option>
                <option value="16">Xe 16 chỗ (1.800k)</option>
                <option value="29">Xe 29 chỗ (3.200k)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Ngày & Giờ đón</label>
              <input type="datetime-local" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-xs" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
            <input type="tel" placeholder="Nhập số điện thoại (có Zalo)" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white text-xs font-semibold" />
          </div>

          <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2">
            <i class="fa-solid fa-paper-plane"></i>
            <span>GỬI YÊU CẦU ĐẶT XE NGAY</span>
          </button>

          <div class="text-center text-[11px] text-slate-400 pt-1">
            🔒 Cam kết giữ đúng giá, tài xế liên hệ xác nhận sau 3 phút.
          </div>
        </form>
      </div>
    </div>
  </div>
</section>`,
        elements: [],
      },
      {
        id: 'sec-xd-pricing',
        name: 'Khối Bảng Giá Tuyến Rõ Ràng',
        category: 'pricing',
        layout: 'full-width',
        mode: 'raw_html',
        styles: { backgroundColor: '#f8fafc', paddingTop: 0, paddingBottom: 0 },
        rawHtml: `<section class="py-16 px-4 bg-slate-50 text-slate-900">
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
      <span class="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
        MINH BẠCH & TRỌN GÓI
      </span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">
        Giá Xe Chuyên Tuyến Rõ Ràng
      </h2>
      <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
        Bảng giá niêm yết tuyến cố định Nha Trang ⇄ Đà Lạt (và chiều ngược lại). Đã bao gồm trọn gói tài xế, xăng dầu và phí cầu đường, cam kết không phát sinh.
      </p>
    </div>

    <!-- 4 Pricing Cards Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: 4 Chỗ -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
            <i class="fa-solid fa-car-side"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">XE 4 CHỖ RIÊNG</h3>
          <p class="text-xs text-slate-500 mb-4">Sedan Vios, Accent, City đời mới sang trọng</p>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4">
            750.000đ <span class="text-xs font-normal text-slate-500">/ chuyến</span>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Phù hợp 1 - 3 khách + hành lý</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Đón trả tận khách sạn</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Bao vé cầu đường trọn gói</li>
          </ul>
        </div>
        <a href="tel:0911099712" class="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-phone"></i> Đặt Xe 4 Chỗ
        </a>
      </div>

      <!-- Card 2: 7 Chỗ (Phổ biến nhất) -->
      <div class="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-xl relative flex flex-col justify-between group">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
          Được Đặt Nhiều Nhất
        </div>
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-4">
            <i class="fa-solid fa-van-shuttle"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">XE 7 CHỖ RIÊNG</h3>
          <p class="text-xs text-slate-500 mb-4">Innova, Xpander, Veloz gầm cao rộng rãi</p>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4">
            850.000đ <span class="text-xs font-normal text-slate-500">/ chuyến</span>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i> Phù hợp gia đình 4 - 6 người</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i> Khoang hành lý cực kỳ rộng</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500 font-bold"></i> Đón trả sân bay Cam Ranh</li>
          </ul>
        </div>
        <a href="tel:0911099712" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30">
          <i class="fa-solid fa-phone"></i> Đặt Xe 7 Chỗ
        </a>
      </div>

      <!-- Card 3: 16 Chỗ -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
            <i class="fa-solid fa-bus-simple"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">XE 16 CHỖ RIÊNG</h3>
          <p class="text-xs text-slate-500 mb-4">Ford Transit, Hyundai Solati êm ái tiện nghi</p>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4">
            1.800.000đ <span class="text-xs font-normal text-slate-500">/ chuyến</span>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Dành cho đoàn 8 - 15 người</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Ghế ngả da cao cấp êm ái</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Lái xe nhiều năm kinh nghiệm đèo dốc</li>
          </ul>
        </div>
        <a href="tel:0911099712" class="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-phone"></i> Đặt Xe 16 Chỗ
        </a>
      </div>

      <!-- Card 4: 29 Chỗ -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
            <i class="fa-solid fa-bus"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">XE 29 CHỖ RIÊNG</h3>
          <p class="text-xs text-slate-500 mb-4">Thaco Town, Universe du lịch cao cấp</p>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4">
            3.200.000đ <span class="text-xs font-normal text-slate-500">/ chuyến</span>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Dành cho công ty, đoàn lớn</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Hầm hành lý siêu rộng</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> Xuất hóa đơn VAT theo yêu cầu</li>
          </ul>
        </div>
        <a href="tel:0911099712" class="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-phone"></i> Đặt Xe 29 Chỗ
        </a>
      </div>
    </div>
  </div>
</section>`,
        elements: [],
      },
      {
        id: 'sec-xd-footer',
        name: 'Khối Chân Trang & Hotline',
        category: 'footer',
        layout: 'full-width',
        mode: 'raw_html',
        styles: { backgroundColor: '#020617', paddingTop: 0, paddingBottom: 0 },
        rawHtml: `<footer class="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-800 text-xs">
  <div class="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
    <div class="space-y-3">
      <div class="text-base font-extrabold text-white flex items-center gap-2">
        <i class="fa-solid fa-car text-blue-500"></i>
        <span>XE ĐÀ LẠT NHA TRANG</span>
      </div>
      <p class="leading-relaxed text-slate-400">
        Chuyên tuyến xe riêng đưa đón tận nơi Nha Trang – Đà Lạt – Sân bay Cam Ranh. Uy tín, an toàn, giá rẻ nhất thị trường.
      </p>
    </div>

    <div class="space-y-2">
      <div class="font-bold text-white text-sm">Liên Hệ Đặt Xe</div>
      <div class="flex items-center gap-2"><i class="fa-solid fa-phone text-amber-400"></i> Hotline/Zalo: <a href="tel:0911099712" class="text-white font-bold hover:text-amber-400">0911 099 712</a></div>
      <div class="flex items-center gap-2"><i class="fa-solid fa-envelope text-indigo-400"></i> taxi@xedalatnhatrang.xyz</div>
      <div class="flex items-center gap-2"><i class="fa-solid fa-globe text-blue-400"></i> xedalatnhatrang.click</div>
    </div>

    <div class="space-y-2">
      <div class="font-bold text-white text-sm">Các Tuyến Phổ Biến</div>
      <div>• Nha Trang ⇄ Trung tâm Đà Lạt</div>
      <div>• Sân bay Cam Ranh ⇄ Đà Lạt</div>
      <div>• Xe tham quan city tour Đà Lạt / Nha Trang</div>
      <div>• Đưa đón liên tỉnh theo yêu cầu</div>
    </div>

    <div class="space-y-2">
      <div class="font-bold text-white text-sm">Cam Kết Dịch Vụ</div>
      <div>✓ Đón đúng giờ 100%</div>
      <div>✓ Không phát sinh chi phí</div>
      <div>✓ Miễn phí hủy chuyến trước 2h</div>
      <div>✓ Tài xế nhiệt tình, hỗ trợ hành lý</div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
    © 2026 Thuê Xe Nha Trang – Đà Lạt Uy Tín. Mọi quyền được bảo lưu.
  </div>
</footer>`,
        elements: [],
      },
    ],
  },
];

// Ensure originalRawHtml is preserved for raw_html sections
TEMPLATES_CATALOG.forEach((tpl) => {
  tpl.sections.forEach((sec) => {
    if (sec.rawHtml && !sec.originalRawHtml) {
      sec.originalRawHtml = sec.rawHtml;
    }
  });
});

