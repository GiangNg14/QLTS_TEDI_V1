import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';

interface BudgetVsActualScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const BudgetVsActualScreen: React.FC<BudgetVsActualScreenProps> = ({ onNavigate }) => {
  const { plans, requisitions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');

  const planLines = plans.flatMap(p => p.lines);

  const filteredLines = planLines.filter(l =>
    l.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.pb.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['BÁO CÁO', 'So sánh Kế hoạch vs Thực tế (MH19)']}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredLines.length}
        onCreateNew={() => alert("Chức năng tạo mới chỉ tiêu báo cáo.")}
        createLabel="Tạo chỉ tiêu"
        onExportExcel={() => alert("Đã xuất báo cáo Kế hoạch vs Thực tế Excel.")}
      />

      {/* Analytics Summary Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Theo dõi tiến độ thực hiện Kế hoạch mua sắm 2026
          </h3>
          <span className="text-xs text-slate-500 font-mono">Năm 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-2.5 w-8 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                </th>
                <th className="p-2.5">Hạng mục kế hoạch</th>
                <th className="p-2.5">Đơn vị</th>
                <th className="p-2.5">Loại</th>
                <th className="p-2.5 text-right">SL KH</th>
                <th className="p-2.5 text-right">Ngân sách KH</th>
                <th className="p-2.5 text-right">Giá trị Đề xuất duyệt</th>
                <th className="p-2.5 text-right">Còn lại</th>
                <th className="p-2.5 text-center">Tỷ lệ thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLines.map((l) => {
                const totalPlan = l.sl * l.gia;

                const matchedReqs = requisitions.filter(r => r.lines.some(rl => rl.ten.toLowerCase().includes(l.ten.toLowerCase())));
                const totalApproved = matchedReqs.reduce((s, r) => s + r.lines.reduce((sl, item) => sl + item.sl * item.gia, 0), 0);
                const remaining = totalPlan - totalApproved;
                const ratio = Math.min(100, Math.round((totalApproved / totalPlan) * 100));

                return (
                  <tr key={l.id} className="hover:bg-blue-50/30 cursor-pointer transition-colors">
                    <td className="p-2.5 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">{l.ten}</td>
                    <td className="p-2.5 text-slate-600 font-medium">{l.pb}</td>
                    <td className="p-2.5 text-slate-600">{l.loai}</td>
                    <td className="p-2.5 text-right font-mono">{l.sl} {l.dvt}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatVND(totalPlan)}</td>
                    <td className="p-2.5 text-right font-mono text-blue-900 font-semibold">{formatVND(totalApproved)}</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">{formatVND(remaining)}</td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${ratio}%` }} />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700">{ratio}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
