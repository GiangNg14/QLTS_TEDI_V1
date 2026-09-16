import React from 'react';

interface SidebarNavProps {
  activeGroup: string;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const SUBNAV_ITEMS: Record<string, Array<{ id: string; label: string; tag?: string }>> = {
  taisan: [
    { id: 'pbg', label: 'PBG · Phiếu bàn giao' },
    { id: 'mh6', label: 'MH6 · Danh sách tài sản' },
    { id: 'mh10', label: 'MH10 · Điều chuyển' },
    { id: 'mh9', label: 'MH9 · Kiểm kê' },
    { id: 'mh11', label: 'MH11 · Thanh lý' },
    { id: 'mh13', label: 'MH13 · Phần mềm' },
    { id: 'mh12', label: 'MH12 · Dự toán XDCB' }
  ],
  kho: [
    { id: 'mh4', label: 'MH4 · Nhận hàng & bàn giao' },
    { id: 'mh5', label: 'MH5 · Cấp vật tư / CCDC' }
  ],
  muasam: [
    { id: 'mh18', label: 'MH18 · Kế hoạch mua sắm năm' },
    { id: 'mh1', label: 'MH1 · Đề xuất mua sắm' },
    { id: 'mh2', label: 'MH2 · So sánh báo giá' },
    { id: 'mh15', label: 'MH15 · Đánh giá NCU trước HĐ' },
    { id: 'mh14', label: 'MH14 · Hồ sơ chuyên gia' },
    { id: 'mh17', label: 'MH17 · Hợp đồng' },
    { id: 'mh16', label: 'MH16 · Nghiệm thu dịch vụ' },
    { id: 'mh3', label: 'MH3 · Đánh giá NCU sau HĐ' }
  ],
  baotri: [
    { id: 'mh7', label: 'MH7 · Kiểm định & Bảo dưỡng' },
    { id: 'mh8', label: 'MH8 · Báo hỏng & Sửa chữa' }
  ]
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeGroup,
  activeScreen,
  setActiveScreen
}) => {
  const items = SUBNAV_ITEMS[activeGroup] || SUBNAV_ITEMS.muasam;

  return (
    <div className="w-full bg-white border-b border-slate-200 px-5 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1 min-w-max">
        {items.map(s => {
          const isActive = activeScreen === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScreen(s.id)}
              className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'border-blue-700 text-blue-900 bg-blue-50/60 font-bold'
                  : 'border-transparent text-slate-600 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <span>{s.label}</span>
              {s.tag && (
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {s.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
