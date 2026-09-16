import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineageStrip } from '../LineageStrip';
import { formatVND } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { Check, ShieldAlert, ArrowRight } from 'lucide-react';

interface QuotationScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const QuotationScreen: React.FC<QuotationScreenProps> = ({ onNavigate }) => {
  const { rfqs, addLog } = useApp();
  const rfq = rfqs[0];
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');

  const minPrice = Math.min(...rfq.ncu.map(n => n.gia));

  const handleSelectVendor = (idx: number) => {
    const selected = rfq.ncu[idx];
    let reason = 'Giá thấp nhất, đáp ứng kỹ thuật.';
    if (selected.gia > minPrice) {
      const inputReason = prompt('Nhà cung ứng này không phải giá thấp nhất. Vui lòng nhập lý do giải trình (bắt buộc):');
      if (!inputReason || !inputReason.trim()) {
        alert('Bắt buộc phải nhập lý do khi chọn nhà cung ứng không phải giá thấp nhất.');
        return;
      }
      reason = inputReason.trim();
    }

    if (selected.diem < 2.5) {
      if (!confirm(`Nhà cung ứng ${selected.ten} có điểm đánh giá lịch sử thấp (${selected.diem}/5). Bạn có chắc chắn chọn?`)) {
        return;
      }
    }

    rfq.chon = idx;
    rfq.lyDo = reason;
    addLog(`Chốt nhà cung ứng ${selected.ten} cho gói chào giá ${rfq.id}`);
    alert(`Đã chốt nhà cung ứng ${selected.ten}`);
    onNavigate('mh17');
  };

  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['MUA SẮM', 'So sánh báo giá (MH2)']}
        activeView={activeView}
        onViewChange={setActiveView}
        onCreateNew={() => alert("Tạo yêu cầu báo giá mới.")}
        createLabel="Tạo Yêu cầu báo giá"
        onExportExcel={() => alert("Đã xuất Ma trận so sánh báo giá Excel.")}
      />

      <LineageStrip
        currentStage="hd"
        dxId={rfq.dx}
        onNavigate={onNavigate}
      />

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block font-medium">Mã YCBG (CT-04a):</span>
          <span className="font-mono font-bold text-blue-900">{rfq.id}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Nội dung mua sắm:</span>
          <span className="font-semibold text-slate-800">{rfq.ten}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Hình thức mua sắm (DM-07):</span>
          <span className="font-semibold text-slate-800">Chào giá cạnh tranh (Tối thiểu 3 báo giá)</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Trình Khách hàng (BR-MS-07):</span>
          <span className="inline-flex items-center gap-1 font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Khách hàng đã chấp thuận
          </span>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-3 w-48">Tiêu chí so sánh</th>
                {rfq.ncu.map((n, idx) => (
                  <th key={idx} className="p-3 text-center border-l border-slate-200 min-w-[200px]">
                    <div className="font-bold text-slate-900 text-xs">{n.ten}</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                      <span>Điểm lịch sử: {n.diem}/5</span>
                      {n.diem < 2.5 && <ShieldAlert className="w-3 h-3 text-amber-600 inline" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Giá chào (VND)</td>
                {rfq.ncu.map((n, idx) => {
                  const isMin = n.gia === minPrice;
                  return (
                    <td
                      key={idx}
                      className={`p-3 text-center font-mono font-bold border-l border-slate-200 ${
                        isMin ? 'bg-blue-50 text-blue-900 text-sm' : 'text-slate-800'
                      }`}
                    >
                      {formatVND(n.gia)}
                      {isMin && <span className="block text-[10px] font-normal text-blue-700">Giá thấp nhất</span>}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Thời gian giao hàng</td>
                {rfq.ncu.map((n, idx) => (
                  <td key={idx} className="p-3 text-center border-l border-slate-200 text-slate-700">
                    {n.giao}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-800">Thời hạn bảo hành</td>
                {rfq.ncu.map((n, idx) => (
                  <td key={idx} className="p-3 text-center border-l border-slate-200 text-slate-700">
                    {n.bh}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Lựa chọn nhà cung ứng</td>
                {rfq.ncu.map((n, idx) => {
                  const isSelected = rfq.chon === idx;
                  return (
                    <td key={idx} className="p-3 text-center border-l border-slate-200">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded font-bold text-xs">
                          <Check className="w-3.5 h-3.5" /> Đã chọn
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelectVendor(idx)}
                          className="px-3 py-1 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-700 rounded font-semibold text-xs text-slate-700 shadow-xs"
                        >
                          Chọn
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {rfq.chon !== null && (
          <div className="p-3 bg-blue-50/60 border-t border-slate-200 text-xs text-slate-800 space-y-1">
            <div>• Nhà cung ứng đã chốt: <strong className="font-bold text-blue-900">{rfq.ncu[rfq.chon].ten}</strong></div>
            <div>• Lý do lựa chọn: <span>{rfq.lyDo}</span></div>
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Sau khi chốt nhà cung ứng, chuyển sang bước soạn thảo Hợp đồng (MH17).</span>
          <button
            onClick={() => onNavigate('mh17')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <span>Soạn Hợp đồng (MH17)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
