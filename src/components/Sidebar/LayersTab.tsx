import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  GripVertical,
} from 'lucide-react';
import { CanvasSection } from '../../types';

interface LayersTabProps {
  sections: CanvasSection[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onToggleHideSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onMoveSection,
  onToggleHideSection,
  onDuplicateSection,
  onDeleteSection,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">CÂY CẤU TRÚC TRANG ({sections.length} Khối)</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sections.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Trang hiện đang trống. Hãy thêm mẫu hoặc kéo thả khối nội dung vào!
          </div>
        ) : (
          sections.map((sec, idx) => {
            const isSelected = selectedSectionId === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`group p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/70 text-slate-300'
                } ${sec.hidden ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 w-4">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">
                      {sec.name || `Khối ${idx + 1}`}
                    </p>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      {sec.category} • {sec.elements.length} phần tử
                    </span>
                  </div>
                </div>

                {/* Layer Quick Controls */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Move Up */}
                  <button
                    onClick={() => onMoveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-700 rounded transition"
                    title="Di chuyển lên"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => onMoveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-700 rounded transition"
                    title="Di chuyển xuống"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Hide */}
                  <button
                    onClick={() => onToggleHideSection(sec.id)}
                    className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded transition"
                    title={sec.hidden ? 'Hiện khối này' : 'Ẩn khối này'}
                  >
                    {sec.hidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => onDuplicateSection(sec.id)}
                    className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded transition"
                    title="Nhân bản khối này"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteSection(sec.id)}
                    className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
                    title="Xóa khối"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
