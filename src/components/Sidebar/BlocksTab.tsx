import React, { useState } from 'react';
import { Plus, Move, Layout, Sparkles, HelpCircle, Phone, MessageSquare, Tag } from 'lucide-react';
import { BlockCategory, BlockPreset, CanvasSection } from '../../types';
import { BLOCKS_CATALOG } from '../../data/blocksCatalog';

interface BlocksTabProps {
  onAddSection: (section: CanvasSection) => void;
}

export const BlocksTab: React.FC<BlocksTabProps> = ({ onAddSection }) => {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('all');

  const categories: Array<{ id: BlockCategory; label: string }> = [
    { id: 'all', label: 'Tất cả' },
    { id: 'header', label: 'Menu & Nav' },
    { id: 'hero', label: 'Hero Banner' },
    { id: 'features', label: 'Tính năng' },
    { id: 'stats', label: 'Số liệu' },
    { id: 'pricing', label: 'Bảng giá' },
    { id: 'testimonials', label: 'Đánh giá' },
    { id: 'faq', label: 'Hỏi đáp' },
    { id: 'cta', label: 'Kêu gọi CTA' },
    { id: 'contact', label: 'Liên hệ & Form' },
    { id: 'footer', label: 'Chân trang' },
  ];

  const filteredBlocks = BLOCKS_CATALOG.filter((blk) =>
    activeCategory === 'all' ? true : blk.category === activeCategory
  );

  const handleDragStart = (e: React.DragEvent, block: BlockPreset) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'section',
        data: {
          ...block.section,
          id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          elements: block.section.elements.map((el) => ({
            ...el,
            id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            items: el.items?.map((it) => ({
              ...it,
              id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            })),
          })),
        },
      })
    );
  };

  const handleInsert = (block: BlockPreset) => {
    const newSec: CanvasSection = {
      ...block.section,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      elements: block.section.elements.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        items: el.items?.map((it) => ({
          ...it,
          id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        })),
      })),
    };
    onAddSection(newSec);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category Pills */}
      <div className="p-3 border-b border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2">DANH MỤC KHỐI THÀNH PHẦN</div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg transition font-medium ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <p className="text-[11px] text-slate-500 italic">
          💡 Bạn có thể <strong className="text-slate-400">kéo thả</strong> khối trực tiếp vào trang hoặc bấm <strong className="text-indigo-400">+ Thêm</strong>.
        </p>

        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="group p-3 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-indigo-500/80 hover:bg-slate-800/80 transition cursor-grab active:cursor-grabbing flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">
                  {block.categoryName}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                  {block.name}
                </h4>
              </div>
              <div className="p-1 rounded bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-700 transition">
                <Move className="w-3.5 h-3.5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {block.description}
            </p>

            <button
              onClick={() => handleInsert(block)}
              className="w-full py-1.5 px-3 bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Khối Vào Trang</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
