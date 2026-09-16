import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND, formatNum, formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { BarChart3, Plus, ArrowRight, Download, Filter } from 'lucide-react';

interface PlanScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const PlanScreen: React.FC<PlanScreenProps> = ({ onNavigate }) => {
  const { plans, requisitions } = useApp();
  const plan = plans[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');

  // Compute used amounts
  const getUsed = (lineId: string) => {
    let sl = 0;
    let gt = 0;
    requisitions.forEach(dx => {
      if (dx.khLine !== lineId) return;
      if (['Đã duyệt', 'Đã giao chỉ thị', 'Đang thực hiện', 'Hoàn thành'].includes(dx.trangThai)) {
        dx.lines.forEach(l => {
          sl += l.sl;
          gt += l.sl * l.gia;
        });
      }
    });
    return { sl, gt };
  };

  const filteredLines = plan.lines.filter(l =>
    l.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.pb.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSL = plan.lines.reduce((s, l) => s + l.sl, 0);
  const totalGT = plan.lines.reduce((s, l) => s + l.sl * l.gia, 0);
  const totalTH = plan.lines.reduce((s, l) => s + getUsed(l.id).gt, 0);

  // Group by department
  const byPB: Record<string, { gt: number; th: number; count: number }> = {};
  plan.lines.forEach(l => {
    const d = getUsed(l.id);
    if (!byPB[l.pb]) byPB[l.pb] = { gt: 0, th: 0, count: 0 };
    byPB[l.pb].gt += l.sl * l.gia;
    byPB[l.pb].th += d.gt;
    byPB[l.pb].count += 1;
  });

  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['MUA SẮM', 'Kế hoạch mua sắm năm 2026 (MH18)']}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredLines.length}
        onCreateNew={() => alert("Chức năng thêm dòng kế hoạch mua sắm năm.")}
        createLabel="Tạo dòng kế hoạch"
        onExportExcel={() => alert("Đã xuất tập tin Excel Kế hoạch mua sắm TEDI 2026.")}
        extraActions={
          <button
            onClick={() => onNavigate('mh19')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded border border-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Báo cáo MH19</span>
          </button>
        }
      />

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TỔNG GIÁ TRỊ KẾ HOẠCH</div>
          <div className="text-lg font-mono font-bold text-slate-900 mt-1">{formatVND(totalGT)}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ĐÃ THỰC HIỆN</div>
          <div className="text-lg font-mono font-bold text-blue-900 mt-1">{formatVND(totalTH)}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalTH / totalGT) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SỐ MỤC KẾ HOẠCH</div>
          <div className="text-lg font-mono font-bold text-slate-900 mt-1">{plan.lines.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ĐỀ XUẤT ĐÃ PHÁT SINH</div>
          <div className="text-lg font-mono font-bold text-blue-900 mt-1">
            {requisitions.filter(d => d.khLine).length} Đề xuất
          </div>
        </div>
      </div>

      {/* Odoo List View Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            {plan.ten} — {plan.id}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Người lập: {plan.nguoiLap} ({formatDMY(plan.ngayLap)})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="p-2.5 w-8 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                </th>
                <th className="p-2.5">Phòng ban</th>
                <th className="p-2.5">Hàng hóa / Dịch vụ</th>
                <th className="p-2.5">ĐVT</th>
                <th className="p-2.5 text-right">SL Kế hoạch</th>
                <th className="p-2.5 text-right">Đơn giá ước tính</th>
                <th className="p-2.5 text-right">Thành tiền</th>
                <th className="p-2.5 text-right">SL Thực hiện</th>
                <th className="p-2.5 text-right">Giá trị Thực hiện</th>
                <th className="p-2.5 text-center">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLines.map((l) => {
                const used = getUsed(l.id);
                const khGT = l.sl * l.gia;
                const vSL = used.sl > l.sl;
                const vGT = used.gt > khGT;

                let statusLabel = 'Chưa dùng';
                let statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';

                if (used.sl > 0) {
                  if (vSL || vGT) {
                    statusLabel = 'Vượt kế hoạch';
                    statusBadge = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
                  } else if (used.sl >= l.sl) {
                    statusLabel = 'Đã dùng hết';
                    statusBadge = 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
                  } else {
                    statusLabel = 'Đang dùng';
                    statusBadge = 'bg-sky-50 text-sky-800 border-sky-200';
                  }
                }

                return (
                  <tr
                    key={l.id}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      vSL || vGT ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">{l.pb}</td>
                    <td className="p-2.5 font-medium text-slate-900">{l.ten}</td>
                    <td className="p-2.5 text-slate-500">{l.dvt}</td>
                    <td className="p-2.5 text-right font-mono font-medium">{formatNum(l.sl)}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">{formatVND(l.gia)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatVND(khGT)}</td>
                    <td className="p-2.5 text-right font-mono font-medium">{formatNum(used.sl)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-900">{formatVND(used.gt)}</td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] ${statusBadge}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-300 font-bold text-slate-900">
                <td colSpan={4} className="p-2.5 uppercase text-[11px]">Tổng cộng</td>
                <td className="p-2.5 text-right font-mono">{formatNum(totalSL)}</td>
                <td className="p-2.5"></td>
                <td className="p-2.5 text-right font-mono">{formatVND(totalGT)}</td>
                <td className="p-2.5"></td>
                <td className="p-2.5 text-right font-mono text-blue-900">{formatVND(totalTH)}</td>
                <td className="p-2.5"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>Dữ liệu kế hoạch năm 2026 tự động liên kết đối chiếu với toàn bộ Đề xuất mua sắm MH1.</span>
          <button
            onClick={() => onNavigate('mh1')}
            className="text-blue-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>Tạo đề xuất mới (MH1)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary by Department Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
          Tổng hợp ngân sách theo phòng ban
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-2">Phòng ban</th>
                <th className="p-2 text-right">Số mục</th>
                <th className="p-2 text-right">Kế hoạch</th>
                <th className="p-2 text-right">Đã thực hiện</th>
                <th className="p-2 text-right">Tỷ lệ</th>
                <th className="p-2 min-w-[120px]">Tiến độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(byPB).map(([pb, data]) => {
                const pct = Math.round((data.th / data.gt) * 100) || 0;
                return (
                  <tr key={pb} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">{pb}</td>
                    <td className="p-2 text-right font-mono">{data.count}</td>
                    <td className="p-2 text-right font-mono font-medium">{formatVND(data.gt)}</td>
                    <td className="p-2 text-right font-mono font-bold text-blue-900">{formatVND(data.th)}</td>
                    <td className="p-2 text-right font-mono text-slate-600">{pct}%</td>
                    <td className="p-2">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
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
