import React from 'react';
import { Search, SlidersHorizontal, Plus, ChevronLeft, ChevronRight, Settings, X, ChevronDown } from 'lucide-react';

interface OdooControlPanelProps {
  breadcrumb?: string[];
  breadcrumbs?: string[];
  title?: string;
  activeView?: 'list' | 'kanban';
  viewMode?: 'list' | 'kanban';
  onViewChange?: (view: 'list' | 'kanban') => void;
  onViewModeChange?: (view: 'list' | 'kanban') => void;
  onCreateNew?: () => void;
  createLabel?: string;
  onExportExcel?: () => void;
  onPrint?: () => void;
  searchQuery?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
  filterOptions?: Array<{ label: string; value: string }>;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  extraActions?: React.ReactNode;
}

export const OdooControlPanel: React.FC<OdooControlPanelProps> = ({
  breadcrumb,
  breadcrumbs,
  title,
  activeView,
  viewMode = 'list',
  onViewChange,
  onViewModeChange,
  onCreateNew,
  createLabel = 'Mới',
  onExportExcel,
  onPrint,
  searchQuery,
  searchValue = '',
  searchPlaceholder = 'Tìm kiếm...',
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  extraActions
}) => {
  const startCount = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endCount = Math.min(currentPage * pageSize, totalCount);

  // Current page name from breadcrumb or title
  const crumbs = breadcrumb || breadcrumbs || [];
  const pageTitle = title || (crumbs.length > 0 ? crumbs[crumbs.length - 1] : 'Danh sách tài sản');
  const currentSearch = searchQuery !== undefined ? searchQuery : searchValue;
  const currentView = activeView || viewMode;

  return (
    <div className="bg-[#F8FAFC] border-b border-slate-200 px-3 py-2.5 mb-3 rounded-md shadow-2xs text-xs font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Create Button & Title with Settings Icon */}
        <div className="flex items-center gap-3">
          {onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-semibold px-4 py-1.5 rounded-md text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{createLabel}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <span>{pageTitle}</span>
            <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {extraActions}
        </div>

        {/* Right Side: Search Filter Box, Filter Select, Sliders Button & Pager */}
        <div className="flex items-center gap-2.5 flex-wrap ml-auto">
          {/* Optional Filter Select */}
          {filterOptions && filterOptions.length > 0 && (
            <select
              value={filterValue}
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Search Box with Filter Tag */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2 py-1 min-w-[240px] sm:min-w-[280px] focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            {/* Filter Pill */}
            <div className="flex items-center gap-1 bg-[#2B77C0] text-white px-2 py-0.5 rounded text-[11px] font-medium shrink-0">
              <span>Năm tạo</span>
              <span className="opacity-75">|</span>
              <span>2026</span>
              <button type="button" className="hover:bg-white/20 rounded ml-0.5 p-0.5" title="Xóa bộ lọc">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>

            <input
              type="text"
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 focus:outline-none px-1"
            />

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Sliders Filter Button */}
          <button
            type="button"
            className="bg-[#2B77C0] hover:bg-[#2063A3] text-white p-1.5 rounded-md flex items-center justify-center transition-colors shadow-2xs"
            title="Bộ lọc nâng cao"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* View Switcher if onViewChange / onViewModeChange provided */}
          {(onViewChange || onViewModeChange) && (
            <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  if (onViewChange) onViewChange('list');
                  if (onViewModeChange) onViewModeChange('list');
                }}
                className={`px-2 py-1 text-xs font-bold ${currentView === 'list' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Danh sách
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onViewChange) onViewChange('kanban');
                  if (onViewModeChange) onViewModeChange('kanban');
                }}
                className={`px-2 py-1 text-xs font-bold ${currentView === 'kanban' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Kanban
              </button>
            </div>
          )}

          {/* Pagination Counter */}
          <div className="flex items-center gap-2 font-mono text-slate-700 text-xs pl-1">
            <span>{totalCount === 0 ? '0-0 / 0' : `${startCount}-${endCount} / ${totalCount}`}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-6 h-6 border border-slate-300 bg-white hover:bg-slate-50 rounded flex items-center justify-center text-slate-600 disabled:opacity-40 shadow-2xs"
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-6 h-6 border border-slate-300 bg-white hover:bg-slate-50 rounded flex items-center justify-center text-slate-600 disabled:opacity-40 shadow-2xs"
                disabled={endCount >= totalCount}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
