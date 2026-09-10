import { TemplateDefinition } from '../types';
import { THEME_PRESETS } from './themes';
import { REAL_CAR_RENTAL_TEMPLATE } from './carRentalRealTemplate';

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
  // 6. Dịch Vụ Thuê Xe Nha Trang - Đà Lạt (Bản Chuẩn Gốc 100%)
  REAL_CAR_RENTAL_TEMPLATE,
];

// Ensure originalRawHtml is preserved for raw_html sections
TEMPLATES_CATALOG.forEach((tpl) => {
  tpl.sections.forEach((sec) => {
    if (sec.rawHtml && !sec.originalRawHtml) {
      sec.originalRawHtml = sec.rawHtml;
    }
  });
});

