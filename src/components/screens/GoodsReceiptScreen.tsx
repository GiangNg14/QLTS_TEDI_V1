import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineageStrip } from '../LineageStrip';
import { GoodsReceipt } from '../../types';
import { formatVND, formatNum, formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { CheckCircle2, Printer, ArrowLeft } from 'lucide-react';

interface GoodsReceiptScreenProps {
  selectedId: string | null;
  onNavigate: (screen: string, id?: string) => void;
  onOpenPrint: (type: any, data: any) => void;
}

export const GoodsReceiptScreen: React.FC<GoodsReceiptScreenProps> = ({
  selectedId,
  onNavigate,
  onOpenPrint
}) => {
  const {
    config, goodsReceipts, requisitions, contracts,
    confirmGoodsReceipt, createAssetFromGoodsReceiptLine
  } = useApp();

  const [activeId, setActiveId] = useState<string | null>(selectedId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');

  const currentGr = goodsReceipts.find(g => g.id === (activeId || selectedId)) || null;

  const filteredGoodsReceipts = goodsReceipts.filter(g =>
    g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.ncu || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.dx.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentGr) {
    const isReadOnly = currentGr.trangThai === 'Đã bàn giao';
    const firstTs = currentGr.lines.find(l => l.ts)?.ts || null;

    let overQuantity = false;
    let overHard = false;
    currentGr.lines.forEach(l => {
      if (l.slNhan > l.slDat) {
        overQuantity = true;
        if (l.slNhan > l.slDat * (1 + config.dungSaiNhanDu / 100)) {
          overHard = true;
        }
      }
    });

    const isMissingDept = currentGr.lines.some(l => !l.pb || !l.nguoi);

    const handleConfirm = () => {
      if (!currentGr.nghiemThu) {
        alert('Phải chọn kết quả nghiệm thu trước khi bàn giao.');
        return;
      }
      if (currentGr.nghiemThu === 'Không đạt') {
        alert('Nghiệm thu không đạt — Không được phép bàn giao.');
        return;
      }
      if (isMissingDept) {
        alert('Tất cả các dòng phải gán Phòng ban nhận và Người nhận.');
        return;
      }
      if (overHard) {
        alert(`Nhận vượt quá dung sai ${config.dungSaiNhanDu}%. Yêu cầu phê duyệt.`);
        return;
      }

      confirmGoodsReceipt(currentGr.id);
      alert('Đã xác nhận nhận hàng & bàn giao.');
    };

    return (
      <div className="space-y-4">
        {/* Top Form Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <button
              onClick={() => setActiveId(null)}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Danh sách</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-blue-900 font-mono">{currentGr.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
              currentGr.trangThai === 'Đã bàn giao'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {currentGr.trangThai}
            </span>
          </div>
        </div>

        <LineageStrip
          currentStage="nh"
          dxId={currentGr.dx}
          hdId={currentGr.hopDong}
          nhId={currentGr.id}
          tsId={firstTs}
          onNavigate={onNavigate}
        />

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Số phiếu nhận hàng:</span>
              <span className="font-mono font-bold text-blue-900">{currentGr.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Nhà cung ứng:</span>
              <span className="font-bold text-slate-800">{currentGr.ncu || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Đề xuất liên quan:</span>
              <span className="font-mono text-slate-800">{currentGr.dx}</span>
            </div>
          </div>

          {/* Lines Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-2.5 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
              <span>CHI TIẾT MẶT HÀNG NHẬN, ĐƠN GIÁ THỰC TẾ &amp; PHÂN LOẠI TÀI SẢN CHÍNH THỨC</span>
              <span className="text-[11px] font-normal text-slate-600">BR-MS-03: Đơn giá ≥ 30tr ➔ TSCĐ; &lt; 30tr ➔ CCDC / Vật tư</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-2">Hàng hóa / Dịch vụ</th>
                    <th className="p-2 text-right">SL Đặt</th>
                    <th className="p-2 text-right">SL Nhận</th>
                    <th className="p-2 text-right">Đơn giá thực tế</th>
                    <th className="p-2 text-right">Chi phí phụ</th>
                    <th className="p-2 text-center">Phân loại chính thức</th>
                    <th className="p-2">Phòng nhận</th>
                    <th className="p-2">Người nhận</th>
                    <th className="p-2 text-center">Định tuyến / Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentGr.lines.map((l, i) => {
                    const isOfficialTscd = l.gia >= 30000000;
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-medium text-slate-900">{l.ten}</td>
                        <td className="p-2 text-right font-mono">{formatNum(l.slDat)}</td>
                        <td className="p-2 text-right font-mono font-bold text-blue-900">{formatNum(l.slNhan)}</td>
                        <td className="p-2 text-right font-mono font-bold text-slate-900">{formatVND(l.gia)}</td>
                        <td className="p-2 text-right font-mono">{formatVND(l.phi || 0)}</td>
                        <td className="p-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOfficialTscd
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {isOfficialTscd ? 'Tài sản cố định (TSCĐ)' : 'CCDC / Vật tư kho'}
                          </span>
                        </td>
                        <td className="p-2 font-medium text-slate-800">{l.pb || '—'}</td>
                        <td className="p-2 text-slate-700">{l.nguoi || '—'}</td>
                        <td className="p-2 text-center">
                          {isOfficialTscd ? (
                            l.ts ? (
                              <button
                                onClick={() => onNavigate('mh6', l.ts || undefined)}
                                className="text-[11px] font-mono font-bold text-blue-700 hover:underline"
                              >
                                TS: {l.ts}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const tsId = createAssetFromGoodsReceiptLine(currentGr.id, i);
                                  onNavigate('mh6', tsId);
                                }}
                                className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px] font-semibold hover:bg-blue-100 cursor-pointer"
                              >
                                + Ghi tăng Sổ TSCĐ
                              </button>
                            )
                          ) : (
                            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Tự động nhập Kho
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-3 border border-slate-200 rounded flex flex-wrap items-center justify-between gap-3 text-xs pt-3">
            <div className="flex items-center gap-2">
              {!isReadOnly && (
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Xác nhận Nhận hàng &amp; Bàn giao
                </button>
              )}

              <button
                onClick={() => onOpenPrint('handover', currentGr)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> In Biên bản A4
              </button>
            </div>

            <button
              onClick={() => setActiveId(null)}
              className="px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
            >
              Đóng chi tiết
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Master Odoo List View
  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['KHO', 'Nhận hàng & Bàn giao (MH4)']}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredGoodsReceipts.length}
        onCreateNew={() => alert("Tạo mới phiếu nhận hàng kho.")}
        createLabel="Tạo Phiếu Nhận hàng"
        onExportExcel={() => alert("Đã xuất danh sách Nhận hàng & Bàn giao Excel.")}
      />

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-2.5 w-8 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                </th>
                <th className="p-2.5">Số phiếu</th>
                <th className="p-2.5">Ngày nhận</th>
                <th className="p-2.5">Nhà cung ứng</th>
                <th className="p-2.5">Đề xuất mua sắm</th>
                <th className="p-2.5 text-right">Tổng giá trị</th>
                <th className="p-2.5">Nghiệm thu</th>
                <th className="p-2.5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredGoodsReceipts.map((gr) => {
                const total = gr.lines.reduce((s, l) => s + l.slNhan * (l.gia + (l.phi || 0)), 0);

                return (
                  <tr
                    key={gr.id}
                    onClick={() => setActiveId(gr.id)}
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                  >
                    <td className="p-2.5 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </td>
                    <td className="p-2.5 font-mono font-bold text-blue-900">{gr.id}</td>
                    <td className="p-2.5 font-mono text-slate-600">{formatDMY(gr.ngay)}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{gr.ncu || '—'}</td>
                    <td className="p-2.5 font-mono text-slate-600">{gr.dx}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatVND(total)}</td>
                    <td className="p-2.5">
                      {gr.nghiemThu ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          gr.nghiemThu === 'Đạt'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {gr.nghiemThu}
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                        gr.trangThai === 'Đã bàn giao'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {gr.trangThai}
                      </span>
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
