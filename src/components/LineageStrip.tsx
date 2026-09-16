import React from 'react';

interface LineageStripProps {
  currentStage: 'kh' | 'dx' | 'hd' | 'nh' | 'ts';
  khLineText?: string | null;
  dxId?: string | null;
  hdId?: string | null;
  nhId?: string | null;
  tsId?: string | null;
  onNavigate?: (screen: string, id?: string) => void;
}

export const LineageStrip: React.FC<LineageStripProps> = ({
  currentStage,
  khLineText,
  dxId,
  hdId,
  nhId,
  tsId,
  onNavigate
}) => {
  const stages = [
    { key: 'kh', label: 'Kế hoạch', value: khLineText || null, screen: 'mh18', id: null },
    { key: 'dx', label: 'Đề xuất', value: dxId || null, screen: 'mh1', id: dxId },
    { key: 'hd', label: 'Hợp đồng', value: hdId || null, screen: 'mh17', id: hdId },
    { key: 'nh', label: 'Nhận hàng', value: nhId || null, screen: 'mh4', id: nhId },
    { key: 'ts', label: 'Tài sản', value: tsId || null, screen: 'mh6', id: tsId }
  ];

  return (
    <div className="flex items-stretch bg-white border border-slate-200 rounded-lg overflow-hidden mb-4 shadow-sm">
      {stages.map((st, idx) => {
        const isHere = st.key === currentStage;
        const hasVal = Boolean(st.value);

        return (
          <div
            key={st.key}
            className={`flex-1 min-w-0 px-3 py-2 border-r last:border-r-0 border-slate-200 transition-colors ${
              isHere ? 'bg-blue-50/80 border-blue-200' : 'hover:bg-slate-50'
            }`}
          >
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${
              isHere ? 'text-blue-900' : 'text-slate-400'
            }`}>
              {st.label}
            </span>
            {hasVal ? (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(st.screen, st.id || undefined)}
                className="block text-left text-xs font-mono font-medium text-blue-950 truncate w-full hover:underline hover:text-blue-700"
                title={st.value || ''}
              >
                {st.value}
              </button>
            ) : (
              <span className="block text-xs font-mono text-slate-300 truncate">
                chưa có
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
