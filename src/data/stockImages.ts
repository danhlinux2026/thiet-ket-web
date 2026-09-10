export interface StockImage {
  id: string;
  category: 'tech' | 'fashion' | 'food' | 'business' | 'portfolio' | 'education' | 'abstract' | 'people';
  categoryLabel: string;
  url: string;
  title: string;
  alt: string;
}

export const STOCK_IMAGES: StockImage[] = [
  // Tech & SaaS
  {
    id: 'tech-1',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    title: 'Dashboard Phân tích Dữ liệu',
    alt: 'Data Analytics Dashboard interface',
  },
  {
    id: 'tech-2',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    title: 'Nền Gradient 3D Hiện đại',
    alt: 'Abstract 3D digital gradient mesh',
  },
  {
    id: 'tech-3',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    title: 'Lập trình viên làm việc',
    alt: 'Developer coding screen dark mode',
  },
  {
    id: 'tech-4',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    title: 'Nhóm phát triển phần mềm',
    alt: 'Tech team collaborating in modern office',
  },

  // Fashion & E-commerce
  {
    id: 'fashion-1',
    category: 'fashion',
    categoryLabel: 'Thời trang & Shop',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    title: 'Bộ sưu tập Thu Đông cao cấp',
    alt: 'High fashion collection showcase',
  },
  {
    id: 'fashion-2',
    category: 'fashion',
    categoryLabel: 'Thời trang & Shop',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    title: 'Không gian cửa hàng quần áo',
    alt: 'Boutique store interior minimal',
  },
  {
    id: 'fashion-3',
    category: 'fashion',
    categoryLabel: 'Thời trang & Shop',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    title: 'Đồng hồ thông minh tối giản',
    alt: 'Minimal luxury product watch',
  },
  {
    id: 'fashion-4',
    category: 'fashion',
    categoryLabel: 'Thời trang & Shop',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    title: 'Người mẫu thời trang phong cách',
    alt: 'Fashion model posing modern streetwear',
  },

  // Food & Restaurant
  {
    id: 'food-1',
    category: 'food',
    categoryLabel: 'Nhà hàng & Ẩm thực',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    title: 'Không gian nhà hàng sang trọng',
    alt: 'Fine dining restaurant ambient lighting',
  },
  {
    id: 'food-2',
    category: 'food',
    categoryLabel: 'Nhà hàng & Ẩm thực',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    title: 'Món ăn bếp trưởng chuẩn bị',
    alt: 'Gourmet dish plated beautifully',
  },
  {
    id: 'food-3',
    category: 'food',
    categoryLabel: 'Nhà hàng & Ẩm thực',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    title: 'Cà phê Specialty thơm ngon',
    alt: 'Artisanal latte art coffee cup',
  },

  // Business & Agency
  {
    id: 'biz-1',
    category: 'business',
    categoryLabel: 'Doanh nghiệp & Dịch vụ',
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop',
    title: 'Buổi họp chiến lược kinh doanh',
    alt: 'Business strategy meeting professionals',
  },
  {
    id: 'biz-2',
    category: 'business',
    categoryLabel: 'Doanh nghiệp & Dịch vụ',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    title: 'Tòa nhà văn phòng hiện đại',
    alt: 'Skyscraper architectural perspective',
  },
  {
    id: 'biz-3',
    category: 'business',
    categoryLabel: 'Doanh nghiệp & Dịch vụ',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
    title: 'Ký kết hợp đồng đối tác',
    alt: 'Handshake partnership deal closed',
  },

  // Portfolio & Creative
  {
    id: 'port-1',
    category: 'portfolio',
    categoryLabel: 'Portfolio & Cá nhân',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    title: 'Chân dung Chuyên gia Sáng tạo',
    alt: 'Portrait of creative professional man smiling',
  },
  {
    id: 'port-2',
    category: 'portfolio',
    categoryLabel: 'Portfolio & Cá nhân',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    title: 'Chân dung Nữ Thiết kế UI/UX',
    alt: 'Portrait of modern woman designer',
  },
  {
    id: 'port-3',
    category: 'portfolio',
    categoryLabel: 'Portfolio & Cá nhân',
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop',
    title: 'Dự án Thiết kế Thương hiệu',
    alt: 'Branding design project showcase',
  },

  // Education
  {
    id: 'edu-1',
    category: 'education',
    categoryLabel: 'Khóa học & Đào tạo',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    title: 'Lớp học trực tuyến Masterclass',
    alt: 'Students learning online course seminar',
  },
  {
    id: 'edu-2',
    category: 'education',
    categoryLabel: 'Khóa học & Đào tạo',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    title: 'Học tập tương tác kỹ thuật số',
    alt: 'Digital interactive learning technology',
  },
];
