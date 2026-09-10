import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Move,
  Lock,
  Eye,
  EyeOff,
  Settings2,
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
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onAddElementToSection,
  onOpenImagePickerForElement,
  onOpenIconPickerForElement,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  if (section.hidden) return null;

  const { styles = {} } = section;
  const bg = styles.backgroundColor || 'transparent';
  const pt = styles.paddingTop ?? 60;
  const pb = styles.paddingBottom ?? 60;

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
        <span className="text-[10px] font-bold text-indigo-400 px-1.5 uppercase border-r border-slate-700">
          {section.name || `Khối ${index + 1}`}
        </span>

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

      {/* Section Container Content */}
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
