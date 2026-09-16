import React from 'react';
import { Settings, SlidersHorizontal, ChevronLeft, ChevronRight, FileText, Check } from 'lucide-react';

export interface WorkflowStage {
  id: string;
  label: string;
}

export interface OdooFormSheetProps {
  category?: string;
  title: string;
  subtitle?: string;
  stages?: Array<WorkflowStage | string>;
  currentStageId?: string;
  currentStage?: string;
  onStageSelect?: (stageId: string) => void;
  onStageChange?: (stageId: string) => void;
  onNew?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  onSave?: () => void;
  actionButtons?: React.ReactNode;
  actions?: React.ReactNode;
  
  // Grid metadata fields (Left & Right columns)
  leftFields?: Array<{
    label: string;
    value: React.ReactNode;
  }>;
  rightFields?: Array<{
    label: string;
    value: React.ReactNode;
  }>;

  // Tabs
  tabs?: Array<{
    id: string;
    label: string;
  }>;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;

  // Attachments
  attachments?: Array<{
    name: string;
    type: string;
    verified?: boolean;
    url?: string;
  }>;

  // Children content for tab area or body
  children?: React.ReactNode;
  
  // Pager
  currentIndex?: number;
  totalItems?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export const OdooFormSheet: React.FC<OdooFormSheetProps> = ({
  category = 'TÀI SẢN & BẢO TRÌ',
  title,
  subtitle,
  stages = [
    { id: 'nhap', label: 'Nháp' },
    { id: 'cho_duyet', label: 'Chờ phê duyệt' },
    { id: 'cho_gd', label: 'Chờ GĐ duyệt' },
    { id: 'da_duyet', label: 'Đã duyệt' },
    { id: 'khong_dat', label: 'Không đạt' }
  ],
  currentStageId,
  currentStage,
  onStageSelect,
  onStageChange,
  onNew,
  onEdit,
  onBack,
  onClose,
  onSave,
  actionButtons,
  actions,
  leftFields = [],
  rightFields = [],
  tabs = [],
  activeTabId,
  onTabChange,
  attachments = [],
  children,
  currentIndex = 1,
  totalItems = 1,
  onPrev,
  onNext
}) => {
  const normalizedStages: WorkflowStage[] = (stages || []).map((s) =>
    typeof s === 'string' ? { id: s, label: s } : s
  );
  const activeStage = currentStageId || currentStage || (normalizedStages[0]?.id || '');
  const handleBack = onBack || onClose;
  const extraActions = actionButtons || actions;

  return (
    <div className="space-y-3 font-sans">
      {/* 1. TOP CONTROL PANEL / ACTION BAR (Matching Screenshot) */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 px-4 py-2.5 rounded-md shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Action Buttons & Title */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {onNew && (
            <button
              type="button"
              onClick={onNew}
              className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-semibold px-4 py-1.5 rounded-md text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Mới
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="bg-white border border-[#2B77C0] hover:bg-blue-50 text-[#2B77C0] font-semibold px-3.5 py-1.5 rounded-md text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Chỉnh sửa
            </button>
          )}

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 rounded-md text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Lưu
            </button>
          )}

          {handleBack && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs cursor-pointer"
            >
              ← Quay lại
            </button>
          )}

          {/* Title & Subtitle */}
          <div className="flex flex-col ml-1">
            <span className="text-[11px] text-[#1C6AA9] font-bold tracking-tight">
              {category}
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span className="truncate max-w-md">{title}</span>
              <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors" title="Tùy chỉnh giao diện">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons (e.g., Yêu cầu duyệt) */}
          {extraActions && (
            <div className="flex items-center gap-2 ml-2 border-l border-slate-200 pl-3">
              {extraActions}
            </div>
          )}
        </div>

        {/* Right Sliders & Pagination */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            className="bg-[#2B77C0] hover:bg-[#2063A3] text-white p-1.5 rounded-md flex items-center justify-center transition-colors shadow-2xs"
            title="Bộ lọc nâng cao"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-mono text-slate-700 text-xs pl-1">
            <span className="font-semibold">{currentIndex} / {totalItems}</span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentIndex <= 1}
                className="w-6 h-6 border border-slate-300 bg-white hover:bg-slate-50 rounded flex items-center justify-center text-slate-600 disabled:opacity-40 shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={currentIndex >= totalItems}
                className="w-6 h-6 border border-slate-300 bg-white hover:bg-slate-50 rounded flex items-center justify-center text-slate-600 disabled:opacity-40 shadow-2xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORM PAPER SHEET CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 relative">
        {/* WORKFLOW PIPELINE STATUS BAR (Top-Right inside Sheet) */}
        {normalizedStages && normalizedStages.length > 0 && (
          <div className="flex justify-end mb-4 overflow-x-auto">
            <div className="inline-flex items-center border border-slate-300 rounded-md overflow-hidden text-xs shadow-2xs">
              {normalizedStages.map((stg) => {
                const isActive = stg.id === activeStage;
                const handleSelect = () => {
                  if (onStageSelect) onStageSelect(stg.id);
                  if (onStageChange) onStageChange(stg.id);
                };
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={handleSelect}
                    className={`px-3.5 py-1.5 font-medium transition-colors border-r border-slate-300 last:border-r-0 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1C6AA9] text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {stg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* DOCUMENT MAIN TITLE HEADLINE inside sheet */}
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-mono">{subtitle}</p>
          )}
        </div>

        {/* TWO COLUMN KEY-VALUE METADATA FIELDS */}
        {(leftFields.length > 0 || rightFields.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5 text-xs">
            {/* Left Fields Column */}
            <div className="space-y-2.5">
              {leftFields.map((field, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-slate-600 font-medium">{field.label}:</span>
                  <div className="col-span-8 font-semibold text-slate-900">{field.value}</div>
                </div>
              ))}
            </div>

            {/* Right Fields Column */}
            <div className="space-y-2.5">
              {rightFields.map((field, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-slate-600 font-medium">{field.label}:</span>
                  <div className="col-span-8 font-semibold text-slate-900">{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB NAVIGATION BUTTONS */}
        {tabs && tabs.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {tabs.map((tab) => {
                const isTabActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange && onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-md font-semibold text-xs whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                      isTabActive
                        ? 'bg-[#1C6AA9] text-white shadow-xs'
                        : 'bg-white border border-[#1C6AA9] text-[#1C6AA9] hover:bg-blue-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ATTACHMENT FILE CARDS PREVIEW */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="bg-slate-100 border border-slate-200 rounded-md p-2.5 flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-700" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="truncate max-w-[140px] font-bold">{file.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{file.type}</span>
                </div>
                {file.verified !== false && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB BODY & CHILD CONTENT */}
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
