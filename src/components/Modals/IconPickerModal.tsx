import React, { useState } from 'react';
import { Search, X, Check, Sparkles } from 'lucide-react';
import { AVAILABLE_ICONS } from '../../data/stockIcons';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  currentIcon?: string;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const iconNames = Object.keys(AVAILABLE_ICONS).filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl h-[70vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Chọn Biểu Tượng (Icon)</h3>
              <p className="text-[11px] text-slate-400">
                Tìm kiếm và nhấp chọn biểu tượng phù hợp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm biểu tượng (VD: Star, Zap, Shield, Rocket...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {iconNames.map((name) => {
            const IconComp = AVAILABLE_ICONS[name];
            const isSelected = currentIcon === name;
            return (
              <button
                key={name}
                onClick={() => {
                  onSelectIcon(name);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-400'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={name}
              >
                <IconComp className="w-5 h-5" />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
