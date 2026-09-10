import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Code,
  Eye,
  Edit3,
  Check,
  Sparkles,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { CanvasElement, CanvasSection, WebsiteTheme } from '../../types';
import { CanvasElementRenderer } from './CanvasElementRenderer';

interface CanvasSectionWrapperProps {
  section: CanvasSection;
  index: number;
  totalSections: number;
  theme: WebsiteTheme;
  isSelected: boolean;
  selectedElementId: string | null;
  onSelectSection: () => void;
  onSelectElement: (elementId: string) => void;
  onMoveSection: (direction: 'up' | 'down') => void;
  onDuplicateSection: () => void;
  onDeleteSection: () => void;
  onUpdateSection?: (updated: CanvasSection) => void;
  onUpdateElement: (elementIndex: number, updated: CanvasElement) => void;
  onDeleteElement: (elementIndex: number) => void;
  onDuplicateElement: (elementIndex: number) => void;
  onAddElementToSection: (element: CanvasElement) => void;
  onOpenImagePickerForElement?: (elementId: string) => void;
  onOpenIconPickerForElement?: (elementId: string) => void;
}

export const CanvasSectionWrapper: React.FC<CanvasSectionWrapperProps> = ({
  section,
  index,
  totalSections,
  theme,
  isSelected,
  selectedElementId,
  onSelectSection,
  onSelectElement,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onUpdateSection,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onAddElementToSection,
  onOpenImagePickerForElement,
  onOpenIconPickerForElement,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingRawCode, setIsEditingRawCode] = useState(false);
  const [rawCodeInput, setRawCodeInput] = useState(section.rawHtml || '');
  const rawContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRawCodeInput(section.rawHtml || '');
  }, [section.rawHtml]);

  if (section.hidden) return null;

  const { styles = {} } = section;
  const bg = styles.backgroundColor || 'transparent';
  const pt = styles.paddingTop ?? (section.rawHtml ? 0 : 60);
  const pb = styles.paddingBottom ?? (section.rawHtml ? 0 : 60);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      if (parsed.type === 'element') {
        onAddElementToSection(parsed.data);
      }
    } catch (err) {
      console.error('Failed to parse drag drop element', err);
    }
  };

  const handleSaveRawCode = () => {
    if (onUpdateSection) {
      onUpdateSection({
        ...section,
        rawHtml: rawCodeInput,
      });
    }
    setIsEditingRawCode(false);
  };

  const handleRestoreOriginalHtml = () => {
    if (section.originalRawHtml && onUpdateSection) {
      onUpdateSection({
        ...section,
        rawHtml: section.originalRawHtml,
        styles: {
          ...section.styles,
          backgroundColor: 'transparent',
        },
      });
      setRawCodeInput(section.originalRawHtml);
    }
  };

  return (
    <section
      id={section.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`w-full relative transition-all group/sec ${
        isSelected
          ? 'ring-2 ring-indigo-500 ring-inset shadow-2xl z-10'
          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-indigo-500/40'
      } ${isDragOver ? 'ring-2 ring-cyan-400 bg-cyan-950/20' : ''}`}
      style={{
        backgroundColor: bg,
        paddingTop: `${pt}px`,
        paddingBottom: `${pb}px`,
        borderRadius: styles.borderRadius,
        borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
        borderColor: styles.borderColor,
      }}
    >
      {/* Floating Section Action Bar */}
      <div
        className={`absolute top-2 left-2 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 text-slate-300 shadow-xl backdrop-blur-sm z-20 select-none transition-opacity duration-150 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover/sec:opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[10px] font-bold text-indigo-400 px-1.5 uppercase border-r border-slate-700 flex items-center gap-1">
          {section.rawHtml ? (
            <span className="text-amber-400 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Gốc
            </span>
          ) : null}
          <span>{section.name || `Khối ${index + 1}`}</span>
        </span>

        {/* Edit Raw HTML toggle if rawHtml present */}
        {section.rawHtml && (
          <button
            onClick={() => setIsEditingRawCode(!isEditingRawCode)}
            className={`p-1 rounded text-xs flex items-center gap-1 transition ${
              isEditingRawCode ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-amber-300'
            }`}
            title="Sửa mã nguồn HTML của khối này"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Sửa Mã</span>
          </button>
        )}

        {/* Restore Original HTML if available */}
        {section.rawHtml && section.originalRawHtml && (
          <button
            onClick={handleRestoreOriginalHtml}
            className="p-1 rounded text-xs flex items-center gap-1 transition hover:bg-slate-800 text-cyan-300"
            title="Khôi phục lại mã HTML gốc ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Gốc</span>
          </button>
        )}

        {/* Move Up */}
        <button
          onClick={() => onMoveSection('up')}
          disabled={index === 0}
          className="p-1 hover:bg-slate-800 hover:text-white rounded disabled:opacity-20 transition"
          title="Di chuyển lên"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Move Down */}
        <button
          onClick={() => onMoveSection('down')}
          disabled={index === totalSections - 1}
          className="p-1 hover:bg-slate-800 hover:text-white rounded disabled:opacity-20 transition"
          title="Di chuyển xuống"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Duplicate */}
        <button
          onClick={onDuplicateSection}
          className="p-1 hover:bg-slate-800 hover:text-indigo-400 rounded transition"
          title="Nhân bản khối này"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={onDeleteSection}
          className="p-1 hover:bg-slate-800 hover:text-red-400 rounded transition"
          title="Xóa khối này"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Raw Code Editor Drawer (When toggled) */}
      {isEditingRawCode && (
        <div
          className="p-4 bg-slate-900 border-b border-indigo-500/40 relative z-20 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              <span>Chỉnh sửa mã HTML trực tiếp cho khối này</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingRawCode(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-md transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRawCode}
                className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
          <textarea
            value={rawCodeInput}
            onChange={(e) => setRawCodeInput(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 text-indigo-300 font-mono text-xs p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>
      )}

      {/* Render Mode 1: High-Fidelity Pixel-Perfect Raw HTML */}
      {section.rawHtml ? (
        <div
          ref={rawContainerRef}
          dangerouslySetInnerHTML={{ __html: section.rawHtml }}
          className={`w-full overflow-hidden transition-all ${
            isSelected ? 'outline-none cursor-pointer' : ''
          }`}
        />
      ) : (
        /* Render Mode 2: Standard Visual Element Cards */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {section.elements.length === 0 ? (
            <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center text-xs text-slate-500">
              Khối này chưa có phần tử nào. Kéo thả phần tử từ thanh bên trái vào đây!
            </div>
          ) : (
            section.elements.map((el, elIdx) => (
              <CanvasElementRenderer
                key={el.id || elIdx}
                element={el}
                theme={theme}
                isSelected={selectedElementId === el.id}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelectElement(el.id);
                }}
                onUpdateElement={(updated) => onUpdateElement(elIdx, updated)}
                onDeleteElement={() => onDeleteElement(elIdx)}
                onDuplicateElement={() => onDuplicateElement(elIdx)}
                onOpenImagePicker={
                  onOpenImagePickerForElement ? () => onOpenImagePickerForElement(el.id) : undefined
                }
                onOpenIconPicker={
                  onOpenIconPickerForElement ? () => onOpenIconPickerForElement(el.id) : undefined
                }
              />
            ))
          )}
        </div>
      )}

      {/* Drag Drop Hint on Hover */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/40 border-2 border-dashed border-indigo-400 rounded-lg pointer-events-none z-30">
          <div className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Thả phần tử vào khối này</span>
          </div>
        </div>
      )}
    </section>
  );
};
