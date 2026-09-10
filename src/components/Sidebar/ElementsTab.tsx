import React from 'react';
import {
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  FormInput,
  Minus,
  Maximize2,
  Video,
  BarChart3,
  Move,
  Plus,
} from 'lucide-react';
import { CanvasElement, ElementType } from '../../types';

interface ElementsTabProps {
  onAddElement: (element: CanvasElement) => void;
}

interface ElementDefinition {
  type: ElementType;
  label: string;
  description: string;
  icon: React.ElementType;
  defaultElement: CanvasElement;
}

export const ElementsTab: React.FC<ElementsTabProps> = ({ onAddElement }) => {
  const elementsList: ElementDefinition[] = [
    {
      type: 'heading',
      label: 'Tiêu Đề (Heading)',
      description: 'H1, H2, H3 với kích thước và font chữ nổi bật',
      icon: Heading,
      defaultElement: {
        id: '',
        type: 'heading',
        tag: 'h2',
        content: 'Tiêu Đề Mới Tạo Trực Quan',
        styles: {
          fontSize: '3xl',
          fontWeight: 'bold',
          textColor: '#ffffff',
          marginBottom: 16,
        },
      },
    },
    {
      type: 'paragraph',
      label: 'Đoạn Văn Bản (Paragraph)',
      description: 'Nội dung mô tả, đoạn giới thiệu mượt mà',
      icon: Type,
      defaultElement: {
        id: '',
        type: 'paragraph',
        content: 'Đây là đoạn văn bản mô tả chi tiết nội dung. Bạn có thể nhấp trực tiếp vào đây để chỉnh sửa văn bản theo ý thích.',
        styles: {
          fontSize: 'base',
          textColor: '#94a3b8',
          marginBottom: 16,
        },
      },
    },
    {
      type: 'button',
      label: 'Nút Kêu Gọi (Button)',
      description: 'Nút bấm liên kết với màu sắc và bo góc tùy biến',
      icon: MousePointerClick,
      defaultElement: {
        id: '',
        type: 'button',
        content: 'Khám Phá Ngay',
        variant: 'primary',
        styles: {
          backgroundColor: '#6366f1',
          textColor: '#ffffff',
          borderRadius: 'xl',
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 28,
          paddingRight: 28,
          fontWeight: 'bold',
          marginBottom: 16,
        },
      },
    },
    {
      type: 'badge',
      label: 'Huy Hiệu (Badge)',
      description: 'Nhãn thông báo, trạng thái hoặc ưu đãi đặc biệt',
      icon: Sparkles,
      defaultElement: {
        id: '',
        type: 'badge',
        badgeText: '✨ Tính năng mới nổi bật 2026',
        badgeVariant: 'subtle',
        styles: {
          backgroundColor: '#1e1b4b',
          textColor: '#818cf8',
          borderRadius: 'full',
          marginBottom: 16,
        },
      },
    },
    {
      type: 'image',
      label: 'Hình Ảnh (Image)',
      description: 'Ảnh minh họa chất lượng cao hoặc ảnh tải lên',
      icon: ImageIcon,
      defaultElement: {
        id: '',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        alt: 'Hình ảnh minh họa',
        styles: {
          borderRadius: 'xl',
          marginBottom: 24,
          boxShadow: 'xl',
        },
      },
    },
    {
      type: 'card',
      label: 'Nhóm Thẻ (Card Grid)',
      description: '3 thẻ tính năng / dịch vụ kèm icon và mô tả',
      icon: Layers,
      defaultElement: {
        id: '',
        type: 'card',
        styles: { columns: 3, gap: 24 },
        items: [
          {
            id: '1',
            title: 'Tính Năng Độc Quyền',
            description: 'Tối ưu trải nghiệm với công nghệ tự động hóa hiện đại nhất.',
            icon: 'Zap',
          },
          {
            id: '2',
            title: 'Bảo Mật Cao Cấp',
            description: 'Mã hóa an toàn tuyệt đối theo tiêu chuẩn quốc tế.',
            icon: 'Shield',
          },
          {
            id: '3',
            title: 'Tăng Trưởng Nhanh',
            description: 'Gia tăng lượng khách hàng tiềm năng và doanh số bán hàng.',
            icon: 'TrendingUp',
          },
        ],
      },
    },
    {
      type: 'pricing-card',
      label: 'Bảng Giá (Pricing)',
      description: '3 gói dịch vụ với bảng giá và danh sách tính năng',
      icon: Award,
      defaultElement: {
        id: '',
        type: 'pricing-card',
        styles: { columns: 3, gap: 24 },
        items: [
          {
            id: '1',
            title: 'Cơ Bản',
            price: '199.000₫',
            period: '/ tháng',
            description: 'Dành cho cá nhân',
            features: ['Tính năng cơ bản', 'Hỗ trợ 24/7', '1 Website'],
            buttonText: 'Chọn Gói',
            popular: false,
          },
          {
            id: '2',
            title: 'Chuyên Nghiệp',
            price: '499.000₫',
            period: '/ tháng',
            description: 'Dành cho doanh nghiệp',
            features: ['Mọi tính năng nâng cao', 'Tên miền riêng', 'Hỗ trợ VIP'],
            buttonText: 'Dùng Thử',
            popular: true,
          },
          {
            id: '3',
            title: 'Doanh Nghiệp',
            price: 'Liên hệ',
            period: '',
            description: 'Dành cho tập đoàn',
            features: ['Hạ tầng riêng biệt', 'SLA 99.99%', 'Tùy biến cao'],
            buttonText: 'Tư Vấn',
            popular: false,
          },
        ],
      },
    },
    {
      type: 'accordion',
      label: 'Danh Sách Hỏi Đáp (FAQ)',
      description: 'Khối câu hỏi gập mở accordion mượt mà',
      icon: HelpCircle,
      defaultElement: {
        id: '',
        type: 'accordion',
        styles: { maxWidth: '4xl' },
        items: [
          {
            id: '1',
            title: 'Website này có thể xuất mã nguồn HTML để tải về không?',
            description: 'Có, bạn có thể xuất toàn bộ mã nguồn HTML + Tailwind CSS hoàn chỉnh và tải về máy tính để chạy ở bất kỳ hosting nào.',
          },
          {
            id: '2',
            title: 'Có thể đổi màu sắc và font chữ của toàn bộ trang không?',
            description: 'Có, WebStudio cung cấp bảng màu chủ đề và bộ font phong phú, chỉ cần 1 cú nhấp chuột là toàn bộ website sẽ đổi phong cách tức thì.',
          },
        ],
      },
    },
    {
      type: 'form-input',
      label: 'Biểu Mẫu Nhập Liệu (Form)',
      description: 'Form điền thông tin gửi tin nhắn và liên hệ',
      icon: FormInput,
      defaultElement: {
        id: '',
        type: 'form-input',
        content: 'Gửi Thông Tin',
        styles: { maxWidth: '2xl' },
        items: [
          { id: '1', title: 'Họ và tên', placeholder: 'Nhập họ và tên...' },
          { id: '2', title: 'Email liên hệ', placeholder: 'email@example.com' },
          { id: '3', title: 'Nội dung tin nhắn', placeholder: 'Nhập nội dung cần tư vấn...' },
        ],
      },
    },
    {
      type: 'divider',
      label: 'Đường Phân Cách (Divider)',
      description: 'Đường kẻ ngang phân chia các khối nội dung',
      icon: Minus,
      defaultElement: {
        id: '',
        type: 'divider',
        styles: {
          marginTop: 24,
          marginBottom: 24,
          borderColor: '#334155',
          borderWidth: 1,
        },
      },
    },
  ];

  const handleDragStart = (e: React.DragEvent, item: ElementDefinition) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'element',
        data: {
          ...item.defaultElement,
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          items: item.defaultElement.items?.map((it) => ({
            ...it,
            id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          })),
        },
      })
    );
  };

  const handleInsert = (item: ElementDefinition) => {
    const newEl: CanvasElement = {
      ...item.defaultElement,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      items: item.defaultElement.items?.map((it) => ({
        ...it,
        id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      })),
    };
    onAddElement(newEl);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 space-y-3">
      <div className="text-[11px] font-semibold text-slate-400">PHẦN TỬ KÉO THẢ TRỰC QUAN</div>
      <p className="text-[11px] text-slate-500 italic">
        Kéo thả phần tử vào bất kỳ vùng nào trên canvas hoặc nhấp dấu <strong className="text-indigo-400">+</strong>.
      </p>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {elementsList.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="group p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-indigo-500/80 hover:bg-slate-800/80 transition cursor-grab active:cursor-grabbing flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleInsert(item)}
                  className="p-1 rounded bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                  title="Thêm vào trang"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="p-1 text-slate-500 group-hover:text-slate-300 cursor-grab">
                  <Move className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
