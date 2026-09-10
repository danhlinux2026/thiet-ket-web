import React, { useState } from 'react';
import {
  Sparkles,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link,
  Check,
  Plus,
  Star,
} from 'lucide-react';
import { CanvasElement, WebsiteTheme } from '../../types';
import { getIconComponent } from '../../data/stockIcons';

interface CanvasElementRendererProps {
  element: CanvasElement;
  theme: WebsiteTheme;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onOpenImagePicker?: () => void;
  onOpenIconPicker?: () => void;
}

export const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  theme,
  isSelected,
  onSelect,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onOpenImagePicker,
  onOpenIconPicker,
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  const { styles = {} } = element;
  const textAlign = styles.textAlign || 'left';
  const textColor = styles.textColor || 'inherit';

  // Helper to handle text blur on contentEditable
  const handleContentBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerHTML;
    onUpdateElement({
      ...element,
      content: newText,
    });
  };

  const handleItemTextChange = (
    itemIndex: number,
    field: 'title' | 'description' | 'price' | 'subtitle' | 'author' | 'role',
    value: string
  ) => {
    if (!element.items) return;
    const newItems = [...element.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      [field]: value,
    };
    onUpdateElement({
      ...element,
      items: newItems,
    });
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group/el transition-all ${
        isSelected
          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 rounded-lg'
          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-indigo-400/50 rounded-lg'
      }`}
      style={{
        marginTop: styles.marginTop ? `${styles.marginTop}px` : undefined,
        marginBottom: styles.marginBottom ? `${styles.marginBottom}px` : undefined,
      }}
    >
      {/* Element Quick Floating Toolbar when selected */}
      {isSelected && (
        <div
          className="absolute -top-7 right-2 bg-slate-900 border border-indigo-500 rounded-md shadow-lg flex items-center gap-0.5 px-1.5 py-0.5 z-30 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] font-bold text-indigo-400 uppercase mr-1">
            {element.type}
          </span>
          {element.type === 'image' && onOpenImagePicker && (
            <button
              onClick={onOpenImagePicker}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition text-[10px] flex items-center gap-1 font-medium"
              title="Đổi ảnh"
            >
              <ImageIcon className="w-3 h-3 text-cyan-400" />
              <span>Đổi ảnh</span>
            </button>
          )}
          <button
            onClick={onDuplicateElement}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Nhân bản"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={onDeleteElement}
            className="p-1 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded transition"
            title="Xóa phần tử"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Render Element By Type */}
      {element.type === 'heading' && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleContentBlur}
          dangerouslySetInnerHTML={{ __html: element.content || 'Nhấp để sửa tiêu đề' }}
          className={`outline-none font-extrabold tracking-tight transition cursor-text ${
            styles.fontSize === '5xl'
              ? 'text-4xl md:text-5xl lg:text-6xl'
              : styles.fontSize === '4xl'
              ? 'text-3xl md:text-4xl lg:text-5xl'
              : styles.fontSize === '3xl'
              ? 'text-2xl md:text-3xl lg:text-4xl'
              : styles.fontSize === 'xl'
              ? 'text-xl md:text-2xl'
              : 'text-2xl md:text-3xl'
          }`}
          style={{
            color: textColor,
            textAlign: textAlign,
            fontFamily: theme.fontHeading,
          }}
        />
      )}

      {element.type === 'paragraph' && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleContentBlur}
          dangerouslySetInnerHTML={{ __html: element.content || 'Nhấp để sửa nội dung...' }}
          className={`outline-none leading-relaxed transition cursor-text ${
            styles.fontSize === 'lg' ? 'text-lg md:text-xl' : 'text-base'
          }`}
          style={{
            color: textColor,
            textAlign: textAlign,
            fontFamily: theme.fontBody,
          }}
        />
      )}

      {element.type === 'badge' && (
        <div style={{ textAlign }}>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdateElement({
                ...element,
                badgeText: e.currentTarget.innerText,
              })
            }
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold outline-none cursor-text shadow-sm"
            style={{
              backgroundColor: styles.backgroundColor || '#1e1b4b',
              color: styles.textColor || '#818cf8',
              borderRadius: theme.radius || '9999px',
            }}
          >
            {element.badgeText || '✨ Huy hiệu thông báo'}
          </span>
        </div>
      )}

      {element.type === 'button' && (
        <div style={{ textAlign }}>
          <button
            className="inline-flex items-center justify-center font-bold transition shadow-md cursor-pointer hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: styles.backgroundColor || theme.primaryColor,
              color: styles.textColor || '#ffffff',
              paddingTop: `${styles.paddingTop || 12}px`,
              paddingBottom: `${styles.paddingBottom || 12}px`,
              paddingLeft: `${styles.paddingRight || 28}px`,
              paddingRight: `${styles.paddingRight || 28}px`,
              borderRadius: styles.borderRadius || theme.radius || '0.5rem',
            }}
          >
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdateElement({
                  ...element,
                  content: e.currentTarget.innerText,
                })
              }
              className="outline-none"
            >
              {element.content || 'Nút Kêu Gọi'}
            </span>
          </button>
        </div>
      )}

      {element.type === 'image' && (
        <div className="w-full flex justify-center relative group/img">
          <img
            src={element.src || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'}
            alt={element.alt || 'Hình ảnh'}
            className="w-full max-w-5xl object-cover rounded-xl shadow-xl transition"
            style={{
              borderRadius: styles.borderRadius || theme.radius,
              borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
              borderColor: styles.borderColor,
            }}
          />
          {onOpenImagePicker && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenImagePicker();
              }}
              className="absolute inset-0 m-auto w-36 h-10 bg-slate-900/90 text-white border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition shadow-2xl backdrop-blur-sm"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Thay Đổi Ảnh</span>
            </button>
          )}
        </div>
      )}

      {element.type === 'card' && (
        <div
          className={`grid gap-6 ${
            styles.columns === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : styles.columns === 4
              ? 'grid-cols-1 md:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {(element.items || []).map((item, idx) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <div
                key={item.id || idx}
                className="p-6 rounded-2xl border border-slate-800/80 bg-slate-800/40 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
                style={{
                  backgroundColor: theme.cardBackground || '#1e293b',
                  borderRadius: theme.radius,
                }}
              >
                <div>
                  {item.image && (
                    <div className="relative mb-4 overflow-hidden rounded-xl h-44">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!item.image && (
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  )}

                  <h4
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, 'title', e.currentTarget.innerText)}
                    className="text-lg font-bold text-white mb-2 outline-none cursor-text"
                  >
                    {item.title}
                  </h4>

                  {item.subtitle && (
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemTextChange(idx, 'subtitle', e.currentTarget.innerText)}
                      className="text-xs font-semibold text-indigo-400 mb-2 outline-none cursor-text"
                    >
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemTextChange(idx, 'description', e.currentTarget.innerText)}
                      className="text-sm text-slate-300 leading-relaxed outline-none cursor-text"
                    >
                      {item.description}
                    </p>
                  )}
                </div>

                {item.price && (
                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemTextChange(idx, 'price', e.currentTarget.innerText)}
                      className="text-lg font-bold text-emerald-400 outline-none"
                    >
                      {item.price}
                    </span>
                    {item.buttonText && (
                      <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition">
                        {item.buttonText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {element.type === 'pricing-card' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {(element.items || []).map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-8 rounded-2xl border transition flex flex-col justify-between relative shadow-xl ${
                item.popular
                  ? 'border-indigo-500 ring-2 ring-indigo-500 bg-slate-800/90'
                  : 'border-slate-800/80 bg-slate-800/40'
              }`}
              style={{
                borderRadius: theme.radius,
              }}
            >
              {item.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-3 rounded-full shadow">
                  Phổ Biến Nhất
                </div>
              )}

              <div>
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleItemTextChange(idx, 'title', e.currentTarget.innerText)}
                  className="text-xl font-bold text-white outline-none cursor-text"
                >
                  {item.title}
                </h3>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleItemTextChange(idx, 'description', e.currentTarget.innerText)}
                  className="text-xs text-slate-400 mt-1.5 outline-none cursor-text"
                >
                  {item.description}
                </p>

                <div className="my-5 flex items-baseline gap-1">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, 'price', e.currentTarget.innerText)}
                    className="text-3xl font-extrabold text-white outline-none cursor-text"
                  >
                    {item.price}
                  </span>
                  <span className="text-xs text-slate-400">{item.period}</span>
                </div>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {(item.features || []).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                  item.popular
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {item.buttonText || 'Chọn Gói Này'}
              </button>
            </div>
          ))}
        </div>
      )}

      {element.type === 'testimonial-card' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {(element.items || []).map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-lg flex flex-col justify-between"
              style={{ borderRadius: theme.radius }}
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating || 5)].map((_, r) => (
                    <Star key={r} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <h4
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleItemTextChange(idx, 'title', e.currentTarget.innerText)}
                  className="text-base font-bold text-white mb-2 outline-none cursor-text"
                >
                  "{item.title}"
                </h4>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleItemTextChange(idx, 'description', e.currentTarget.innerText)}
                  className="text-xs text-slate-300 leading-relaxed mb-6 outline-none cursor-text"
                >
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                  />
                )}
                <div>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, 'author', e.currentTarget.innerText)}
                    className="text-xs font-bold text-white outline-none cursor-text"
                  >
                    {item.author}
                  </p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, 'role', e.currentTarget.innerText)}
                    className="text-[10px] text-slate-400 outline-none cursor-text"
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {element.type === 'stats-item' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-4">
          {(element.items || []).map((item, idx) => (
            <div key={item.id || idx} className="p-3">
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemTextChange(idx, 'statNumber' as any, e.currentTarget.innerText)}
                className="text-3xl md:text-4xl font-extrabold text-indigo-400 outline-none cursor-text"
              >
                {item.statNumber}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemTextChange(idx, 'statLabel' as any, e.currentTarget.innerText)}
                className="text-xs text-slate-400 mt-1 outline-none cursor-text"
              >
                {item.statLabel}
              </div>
            </div>
          ))}
        </div>
      )}

      {element.type === 'accordion' && (
        <div className="space-y-3 max-w-3xl mx-auto my-6">
          {(element.items || []).map((item, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div
                key={item.id || idx}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/40"
              >
                <div
                  onClick={() => setOpenAccordionIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-white hover:bg-slate-800/80 transition cursor-pointer select-none"
                >
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => handleItemTextChange(idx, 'title', e.currentTarget.innerText)}
                    className="outline-none cursor-text flex-1 pr-2"
                  >
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemTextChange(idx, 'description', e.currentTarget.innerText)}
                    className="px-5 py-3 text-slate-300 text-xs leading-relaxed bg-slate-900/50 border-t border-slate-800 outline-none cursor-text"
                  >
                    {item.description || item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {element.type === 'form-input' && (
        <div className="max-w-2xl mx-auto space-y-3.5 p-6 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-xl my-6">
          {(element.items || []).map((item, idx) => (
            <div key={item.id || idx}>
              <label
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemTextChange(idx, 'title', e.currentTarget.innerText)}
                className="block text-xs font-semibold text-slate-300 mb-1 outline-none cursor-text"
              >
                {item.title}
              </label>
              <input
                type="text"
                placeholder={item.placeholder}
                disabled
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none opacity-90 cursor-default"
              />
            </div>
          ))}
          <button
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-md mt-2"
          >
            {element.content || 'Gửi Thông Tin'}
          </button>
        </div>
      )}

      {element.type === 'divider' && (
        <div
          className="w-full border-t border-slate-800 my-4"
          style={{
            borderColor: styles.borderColor || '#334155',
            borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
          }}
        />
      )}
    </div>
  );
};
