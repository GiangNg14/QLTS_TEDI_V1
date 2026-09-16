import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, MessageSquare, Clock, Building2, Code, Smartphone, HelpCircle,
  LayoutGrid, Settings, Check, Search, User, X, FileDown
} from 'lucide-react';

interface HeaderProps {
  activeGroup: string;
  setActiveGroup: (grp: string) => void;
  activeScreen: string;
  setActiveScreen: (screen: string, recordId?: string) => void;
  onOpenIsoGuide?: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  code?: string;
}

export interface MenuGroup {
  key: string;
  label: string;
  items: MenuItem[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    key: 'taisan',
    label: 'TÀI SẢN',
    items: [
      { id: 'pbg', label: 'Phiếu bàn giao tài sản', code: 'PBG' },
      { id: 'mh6', label: 'Danh sách tài sản', code: 'MH6' },
      { id: 'mh10', label: 'Điều chuyển nội bộ', code: 'MH10' },
      { id: 'mh9', label: 'Kiểm kê tài sản định kỳ', code: 'MH9' },
      { id: 'mh11', label: 'Thanh lý & Ghi giảm', code: 'MH11' },
      { id: 'mh13', label: 'Bản quyền phần mềm', code: 'MH13' },
      { id: 'mh12', label: 'Dự toán XDCB & Cải tạo', code: 'MH12' }
    ]
  },
  {
    key: 'kho',
    label: 'KHO & VẬT TƯ',
    items: [
      { id: 'mh4', label: 'Nhận hàng & Bàn giao kho', code: 'MH4' },
      { id: 'mh5', label: 'Cấp phát vật tư & CCDC', code: 'MH5' }
    ]
  },
  {
    key: 'muasam',
    label: 'MUA SẮM',
    items: [
      { id: 'mh18', label: 'Kế hoạch mua sắm năm', code: 'MH18' },
      { id: 'mh1', label: 'Đề xuất mua sắm', code: 'MH1' },
      { id: 'mh2', label: 'So sánh báo giá', code: 'MH2' },
      { id: 'mh15', label: 'Đánh giá NCU trước HĐ', code: 'MH15' },
      { id: 'mh14', label: 'Hồ sơ chuyên gia', code: 'MH14' },
      { id: 'mh17', label: 'Quản lý Hợp đồng', code: 'MH17' },
      { id: 'mh16', label: 'Nghiệm thu dịch vụ', code: 'MH16' },
      { id: 'mh3', label: 'Đánh giá NCU sau HĐ', code: 'MH3' }
    ]
  },
  {
    key: 'baotri',
    label: 'KỸ THUẬT',
    items: [
      { id: 'mh7', label: 'Kiểm định & Bảo dưỡng định kỳ', code: 'MH7' },
      { id: 'mh8', label: 'Báo hỏng & Sửa chữa đột xuất', code: 'MH8' }
    ]
  }
];

export const GROUPS = MENU_GROUPS;

export const Header: React.FC<HeaderProps> = ({
  activeGroup,
  setActiveGroup,
  activeScreen,
  setActiveScreen,
  onOpenIsoGuide
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGroupClick = (grp: MenuGroup) => {
    setActiveGroup(grp.key);
    // If not already on an item in this group, switch to first item
    if (!grp.items.some(it => it.id === activeScreen)) {
      setActiveScreen(grp.items[0].id);
    }
    setOpenDropdown(openDropdown === grp.key ? null : grp.key);
  };

  const handleSelectMenuItem = (groupKey: string, itemId: string) => {
    setActiveGroup(groupKey);
    setActiveScreen(itemId);
    setOpenDropdown(null);
  };

  const handleDownloadAppHtml = () => {
    const a = document.createElement('a');
    a.href = '/tedi-app-standalone.html';
    a.download = 'TEDI_Quan_Ly_Tai_San_App.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAppZip = () => {
    const a = document.createElement('a');
    a.href = '/tedi-app-production.zip';
    a.download = 'TEDI_Quan_Ly_Tai_San_Production_Dist.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <header className="w-full select-none sticky top-0 z-50 shadow-xs font-sans" ref={dropdownRef}>
      {/* 1. Top Identity Bar (TEDI Slogan & User guide) */}
      <div className="h-10 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* TEDI Stylized Circular Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSelectMenuItem('bangiao', 'pbg')}>
            <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#E11D48" strokeWidth="12" strokeDasharray="220 60" />
                <path d="M20 50 C20 30, 80 30, 80 50 C80 70, 20 70, 20 50" fill="none" stroke="#1D6CB0" strokeWidth="10" />
              </svg>
              <span className="absolute font-black text-[9px] text-blue-900 tracking-tighter">TEDI</span>
            </div>
            <span className="font-extrabold text-blue-900 text-xs sm:text-sm tracking-wider uppercase">
              ĐỘC LẬP – SÁNG TẠO – TRUNG THỰC – TRÁCH NHIỆM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#help"
            onClick={(e) => { e.preventDefault(); onOpenIsoGuide?.(); }}
            className="text-blue-700 hover:text-blue-900 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            HƯỚNG DẪN SỬ DỤNG
          </a>
        </div>
      </div>

      {/* 2. Main Portal Deep Blue Navigation Header Bar */}
      <div className="h-11 bg-[#1C6AA9] text-white px-3 sm:px-4 flex items-center justify-between relative z-40 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 h-full">
          {/* Grid App Launcher Icon */}
          <button
            onClick={() => setOpenDropdown(openDropdown === 'all' ? null : 'all')}
            className="px-2 py-1 hover:bg-white/10 rounded transition-colors shrink-0 text-white flex items-center gap-2"
            title="Tất cả phân hệ"
          >
            <LayoutGrid className="w-4 h-4 text-white" />
            <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase whitespace-nowrap text-white">
              TÀI SẢN &amp; MUA SẮM
            </span>
          </button>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Top Group Navigation Tabs */}
          <nav className="flex items-stretch h-full gap-1 overflow-visible">
            {MENU_GROUPS.map((grp) => {
              const isOpen = openDropdown === grp.key;
              const isGroupActive = activeGroup === grp.key;

              return (
                <div key={grp.key} className="relative flex items-stretch">
                  <button
                    onClick={() => handleGroupClick(grp)}
                    className={`px-3 flex items-center gap-1 font-semibold text-xs tracking-tight transition-all whitespace-nowrap h-full ${
                      isGroupActive || isOpen
                        ? 'bg-white text-[#1C6AA9] font-bold shadow-xs'
                        : 'text-white/90 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <span>{grp.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Single Group Dropdown Menu Overlay */}
                  {isOpen && (
                    <div className="absolute left-0 top-full mt-0 w-64 bg-white rounded-b-md shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                        {grp.label}
                      </div>

                      {grp.items.map((item) => {
                        const isItemSelected = activeScreen === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectMenuItem(grp.key, item.id)}
                            className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                              isItemSelected
                                ? 'bg-blue-50 text-[#1C6AA9] font-bold border-l-2 border-[#1C6AA9]'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.code && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ml-2 ${
                                isItemSelected
                                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                                  : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}>
                                {item.code}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Icons Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          {/* Notifications Icon */}
          <button
            onClick={() => onOpenIsoGuide?.()}
            className="relative p-1.5 hover:bg-white/10 rounded text-white/90 hover:text-white transition-colors"
            title="Quy trình TEDI-ISO-QT 02"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Building */}
          <button className="p-1.5 hover:bg-white/10 rounded text-white/90 hover:text-white transition-colors" title="Tổng Công ty Tư vấn Thiết kế GTVT - TEDI">
            <Building2 className="w-4 h-4" />
          </button>

          {/* App Mobile */}
          <button className="p-1.5 hover:bg-white/10 rounded text-white/90 hover:text-white transition-colors" title="Hệ thống Quản lý Tài sản TEDI">
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            onClick={() => onOpenIsoGuide?.()}
            className="p-1.5 hover:bg-white/10 rounded text-white/90 hover:text-white transition-colors"
            title="Hướng dẫn quy trình ISO"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Export HTML App */}
          <button
            onClick={handleDownloadAppHtml}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow-sm transition-all hover:scale-[1.02]"
            title="Xuất trọn bộ ứng dụng dạng 1 file HTML duy nhất (chạy offline không cần cài đặt)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất Ứng dụng .HTML</span>
          </button>

          <div className="h-5 w-px bg-white/20 mx-0.5 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="text-right leading-none hidden md:block">
              <div className="text-[11px] font-bold text-white uppercase tracking-tight">GIANG THG</div>
              <div className="text-[9px] text-blue-100 uppercase tracking-widest mt-0.5">GOOD MORNING</div>
            </div>

            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center overflow-hidden border border-white/30 shrink-0">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mega Menu Overlay (When clicking "TÀI SẢN & MUA SẮM" Grid button) */}
      {openDropdown === 'all' && (
        <div className="absolute left-0 top-full mt-0 w-full bg-white shadow-2xl border-b border-slate-300 p-4 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 font-extrabold text-sm text-[#1C6AA9]">
                <LayoutGrid className="w-4 h-4" />
                <span>TẤT CẢ PHÂN HỆ QUẢN LÝ TÀI SẢN &amp; MUA SẮM</span>
              </div>
              <button
                onClick={() => setOpenDropdown(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {MENU_GROUPS.map((grp) => (
                <div key={grp.key} className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="font-extrabold text-xs text-[#1C6AA9] border-b border-slate-200 pb-1.5 mb-2 uppercase tracking-tight">
                    {grp.label}
                  </div>
                  <div className="space-y-1">
                    {grp.items.map((item) => {
                      const isSelected = activeScreen === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectMenuItem(grp.key, item.id)}
                          className={`w-full text-left px-2 py-1 text-xs rounded transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-700 hover:bg-white hover:text-blue-800 font-medium'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.code && (
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded ml-1 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {item.code}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
