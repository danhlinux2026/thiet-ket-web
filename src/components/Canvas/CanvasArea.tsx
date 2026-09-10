import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Layers,
  LayoutGrid,
  Laptop,
  Tablet,
  Smartphone,
  FolderOpen,
  UploadCloud,
  Check,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  CanvasElement,
  CanvasSection,
  DeviceMode,
  WebsiteProject,
  WebsiteTheme,
} from '../../types';
import { CanvasSectionWrapper } from './CanvasSectionWrapper';
import { TEMPLATES_CATALOG } from '../../data/templates';

interface CanvasAreaProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  deviceMode: DeviceMode;
  selectedSectionId: string | null;
  selectedElementId: string | null;
  onSelectSection: (id: string | null) => void;
  onSelectElement: (id: string | null) => void;
  onOpenTemplates: () => void;
  onOpenBlocks: () => void;
  onOpenFileModal?: () => void;
  onFileDropped?: (file: File) => void;
  onOpenImagePickerForElement?: (elementId: string) => void;
  onOpenIconPickerForElement?: (elementId: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  project,
  setProject,
  deviceMode,
  selectedSectionId,
  selectedElementId,
  onSelectSection,
  onSelectElement,
  onOpenTemplates,
  onOpenBlocks,
  onOpenFileModal,
  onFileDropped,
  onOpenImagePickerForElement,
  onOpenIconPickerForElement,
}) => {
  const [isSectionDragOver, setIsSectionDragOver] = useState(false);
  const [isFileDragOver, setIsFileDragOver] = useState(false);

  // Viewport width mapping (Responsive for all device screens)
  const viewportWidthClass =
    deviceMode === 'desktop'
      ? 'w-full max-w-full'
      : deviceMode === 'tablet'
      ? 'w-[768px] max-w-full shadow-2xl my-2 sm:my-6 rounded-2xl border border-slate-700 overflow-hidden mx-auto'
      : 'w-full max-w-[375px] shadow-2xl my-2 sm:my-6 rounded-3xl border border-slate-700 overflow-hidden mx-auto';

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsSectionDragOver(false);
    setIsFileDragOver(false);

    // Check if external files dropped from desktop/explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onFileDropped) {
        onFileDropped(e.dataTransfer.files[0]);
        return;
      }
    }

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      if (parsed.type === 'section') {
        setProject((prev) => ({
          ...prev,
          sections: [...prev.sections, parsed.data],
        }));
        onSelectSection(parsed.data.id);
      }
    } catch (err) {
      console.error('Failed to parse dropped section', err);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.sections.length) return;

    const newSections = [...project.sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);

    setProject((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDuplicateSection = (index: number) => {
    const orig = project.sections[index];
    const duplicated: CanvasSection = {
      ...orig,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${orig.name} (Bản sao)`,
      elements: orig.elements.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        items: el.items?.map((it) => ({
          ...it,
          id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        })),
      })),
    };

    const newSections = [...project.sections];
    newSections.splice(index + 1, 0, duplicated);
    setProject((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDeleteSection = (index: number) => {
    const newSections = [...project.sections];
    newSections.splice(index, 1);
    setProject((prev) => ({ ...prev, sections: newSections }));
    onSelectSection(null);
    onSelectElement(null);
  };

  const handleUpdateSection = (index: number, updated: CanvasSection) => {
    setProject((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = updated;
      return { ...prev, sections: newSections };
    });
  };

  const handleUpdateElement = (sectionIndex: number, elementIndex: number, updated: CanvasElement) => {
    setProject((prev) => {
      const newSections = [...prev.sections];
      const newElements = [...newSections[sectionIndex].elements];
      newElements[elementIndex] = updated;
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        elements: newElements,
      };
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteElement = (sectionIndex: number, elementIndex: number) => {
    setProject((prev) => {
      const newSections = [...prev.sections];
      const newElements = [...newSections[sectionIndex].elements];
      newElements.splice(elementIndex, 1);
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        elements: newElements,
      };
      return { ...prev, sections: newSections };
    });
    onSelectElement(null);
  };

  const handleDuplicateElement = (sectionIndex: number, elementIndex: number) => {
    setProject((prev) => {
      const newSections = [...prev.sections];
      const orig = newSections[sectionIndex].elements[elementIndex];
      const duplicated: CanvasElement = {
        ...orig,
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        items: orig.items?.map((it) => ({
          ...it,
          id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        })),
      };
      const newElements = [...newSections[sectionIndex].elements];
      newElements.splice(elementIndex + 1, 0, duplicated);
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        elements: newElements,
      };
      return { ...prev, sections: newSections };
    });
  };

  const handleAddElementToSection = (sectionIndex: number, element: CanvasElement) => {
    setProject((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        elements: [...newSections[sectionIndex].elements, element],
      };
      return { ...prev, sections: newSections };
    });
    onSelectElement(element.id);
  };

  return (
    <main
      onClick={() => {
        onSelectSection(null);
        onSelectElement(null);
      }}
      className="flex-1 bg-slate-950 overflow-y-auto flex flex-col items-center relative select-none"
    >
      {/* Viewport simulation container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsSectionDragOver(true);
        }}
        onDragLeave={() => setIsSectionDragOver(false)}
        onDrop={handleCanvasDrop}
        className={`${viewportWidthClass} transition-all duration-300 min-h-full flex flex-col`}
        style={{
          backgroundColor: project.theme.backgroundColor,
          color: project.theme.textColor,
          fontFamily: project.theme.fontBody,
        }}
      >
        {/* Empty Canvas State */}
        {project.sections.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto min-h-[500px]">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
              <LayoutGrid className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              Trang Web Chưa Có Nội Dung
            </h3>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Hãy mở file HTML / JSON có sẵn từ máy tính, chọn mẫu giao diện từ kho mẫu hoặc bắt đầu kéo thả các khối thành phần dựng sẵn vào đây.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {onOpenFileModal && (
                <button
                  onClick={onOpenFileModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-blue-200" />
                  <span>Mở File HTML / Dự Án Từ Máy</span>
                </button>
              )}

              <button
                onClick={onOpenTemplates}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Khám Phá Kho Mẫu</span>
              </button>

              <button
                onClick={onOpenBlocks}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Khối Trống</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Active Sections */
          <div className="w-full flex-1 flex flex-col relative">
            {/* External Stylesheets for Imported Sites (FontAwesome, Google Fonts, CDN CSS) */}
            {project.settings.externalStylesheets?.map((sheet, i) => (
              <link key={`ext-css-${i}`} rel="stylesheet" href={sheet} />
            ))}

            {/* Scoped Custom CSS for Imported Website Styles */}
            {project.settings.customCss && (
              <style dangerouslySetInnerHTML={{ __html: project.settings.customCss }} />
            )}

            {/* Helper Banner for GitHub Pixel-Perfect Source Sync */}
            {(project.name.toLowerCase().includes('nha trang') ||
              project.name.toLowerCase().includes('đà lạt') ||
              project.name.toLowerCase().includes('xe')) && (
                <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-blue-950/90 border-b border-blue-500/30 p-2.5 px-4 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Mẫu Thuê Xe Nha Trang – Đà Lạt:</strong> Bố cục chuẩn 100% bản gốc GitHub (Form đặt xe nhanh màu trắng, hotline 0911 099 712, bảng giá xe 4-7-16 chỗ).
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const tpl = TEMPLATES_CATALOG.find((t) => t.id === 'xedalatnhatrang-car-rental');
                      if (tpl) {
                        setProject((prev) => ({
                          ...prev,
                          name: tpl.name,
                          description: tpl.description,
                          theme: tpl.theme,
                          sections: JSON.parse(JSON.stringify(tpl.sections)),
                          settings: {
                            ...prev.settings,
                            title: tpl.name,
                            metaDescription: tpl.description,
                            ...(tpl.settings || {}),
                          },
                        }));
                      }
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer shrink-0 text-xs"
                    title="Khôi phục lại giao diện mẫu gốc hoàn chỉnh chuẩn 100% file HTML của bạn"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Khôi Phục Bản Gốc 100%
                  </button>
                </div>
              )}

            {project.sections.map((section, idx) => (
              <CanvasSectionWrapper
                key={section.id}
                section={section}
                index={idx}
                totalSections={project.sections.length}
                theme={project.theme}
                isSelected={selectedSectionId === section.id}
                selectedElementId={selectedElementId}
                onSelectSection={() => {
                  onSelectSection(section.id);
                  onSelectElement(null);
                }}
                onSelectElement={(elId) => {
                  onSelectSection(section.id);
                  onSelectElement(elId);
                }}
                onMoveSection={(dir) => handleMoveSection(idx, dir)}
                onDuplicateSection={() => handleDuplicateSection(idx)}
                onDeleteSection={() => handleDeleteSection(idx)}
                onUpdateSection={(updated) => handleUpdateSection(idx, updated)}
                onUpdateElement={(elIdx, updated) => handleUpdateElement(idx, elIdx, updated)}
                onDeleteElement={(elIdx) => handleDeleteElement(idx, elIdx)}
                onDuplicateElement={(elIdx) => handleDuplicateElement(idx, elIdx)}
                onAddElementToSection={(el) => handleAddElementToSection(idx, el)}
                onOpenImagePickerForElement={onOpenImagePickerForElement}
                onOpenIconPickerForElement={onOpenIconPickerForElement}
              />
            ))}

            {/* Bottom Add Section Button Bar */}
            <div className="py-8 px-4 flex justify-center border-t border-dashed border-slate-800/80 mt-auto">
              <button
                onClick={onOpenBlocks}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-indigo-500 transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Khối Nội Dung Mới Vào Dưới Cùng</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
