import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND, formatDMY } from '../../data/mockData';
import { FileCheck, AlertCircle, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface VendorBillScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const VendorBillScreen: React.FC<VendorBillScreenProps> = ({ onNavigate }) => {
  const { vendorBills, postVendorBill } = useApp();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(vendorBills[0]?.id || null);

  const currentBill = vendorBills.find(b => b.id === selectedBillId) || vendorBills[0];

  const handlePost = () => {
    if (!currentBill) return;
    if (currentBill.trangThai === 'Đã vào sổ') {
      alert('Hóa đơn này đã vào sổ trước đó.');
      return;
    }

    postVendorBill(currentBill.id);
    alert(`Đã vào sổ hóa đơn ${currentBill.id}. Hệ thống đã tự động ghi tăng thẻ tài sản vào Sổ tài sản (MH6).`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            KẾ TOÁN / HÓA ĐƠN &amp; ĐỐI CHIẾU 3 CHIỀU (QT-MS-06)
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hóa đơn Nhà cung cấp, Đối chiếu 3 chiều &amp; Thanh toán (CT-16)</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              MH7 (QT-MS-06)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Đối chiếu tự động giữa Hợp đồng (PO) — Phiếu nhập kho / Biên bản nghiệm thu (CT-07/09) — Hóa đơn FAST trước khi phê duyệt Thanh toán (CT-16).
          </p>
        </div>
      </div>

      {/* Bill Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {vendorBills.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBillId(b.id)}
            className={`px-3 py-1.5 rounded-t-md font-mono font-bold border-t border-x transition-colors ${
              (selectedBillId || vendorBills[0]?.id) === b.id
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-2.5 z-10'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            {b.id} ({b.trangThai})
          </button>
        ))}
      </div>

      {currentBill && (
        <div className="space-y-4">
          {/* 3-Way Matching Box (QT-MS-06 / UC-MS-06-03) */}
          <div className="bg-slate-900 text-white rounded-lg p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  BẢNG ĐỐI CHIẾU 3 CHIỀU TỰ ĐỘNG (3-WAY MATCHING — BR-MS-13)
                </span>
              </div>
              <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                KẾT QUẢ: TRÙNG KHỚP 100%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/80 p-3 rounded border border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-300 text-[11px] uppercase">1. HỢP ĐỒNG / ĐỀ XUẤT (PO/CONTRACT)</div>
                <div className="font-mono text-emerald-400 font-bold">{currentBill.ref}</div>
                <div className="text-slate-400">Giá trị duyệt: <strong className="text-white font-mono">{formatVND(currentBill.tongTien)}</strong></div>
                <div className="text-slate-400">Chủng loại: <strong className="text-white">{currentBill.lines[0]?.ten}</strong></div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded border border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-300 text-[11px] uppercase">2. BIÊN BẢN NGHIỆM THU / NHẬP KHO</div>
                <div className="font-mono text-emerald-400 font-bold">CT-07 / PNK-2026/041</div>
                <div className="text-slate-400">Số lượng nhận: <strong className="text-white font-mono">{currentBill.lines[0]?.sl}</strong></div>
                <div className="text-slate-400">Tình trạng: <strong className="text-emerald-300">Đạt yêu cầu kỹ thuật</strong></div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded border border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-300 text-[11px] uppercase">3. HÓA ĐƠN FAST (VENDOR BILL)</div>
                <div className="font-mono text-emerald-400 font-bold">{currentBill.id}</div>
                <div className="text-slate-400">Tổng thanh toán: <strong className="text-white font-mono">{formatVND(currentBill.tongTien)}</strong></div>
                <div className="text-slate-400">Chênh lệch: <strong className="text-emerald-400 font-mono">0 VND</strong></div>
              </div>
            </div>
          </div>

          {/* Header Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Số hóa đơn / Ref:</span>
              <span className="font-mono font-bold text-slate-900">{currentBill.id} ({currentBill.ref})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Nhà cung cấp:</span>
              <span className="font-semibold text-slate-800">{currentBill.ncc}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Ngày hóa đơn:</span>
              <span className="font-mono text-slate-800">{formatDMY(currentBill.ngay)}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Trạng thái hạch toán:</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full border font-semibold ${
                currentBill.trangThai === 'Đã vào sổ'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {currentBill.trangThai}
              </span>
            </div>
          </div>

          {/* Lines Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Chi tiết bút toán hạch toán mua sắm</h3>
              <span className="text-xs text-slate-500">Đơn vị: VND</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider text-left">
                    <th className="p-3">Diễn giải / Nội dung</th>
                    <th className="p-3 font-mono">TK Hạch toán</th>
                    <th className="p-3 text-right">SL</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-right">Thành tiền</th>
                    <th className="p-3">Tự động ghi tăng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentBill.lines.map((l, idx) => {
                    const total = l.sl * l.gia;
                    const isAssetAcc = l.tk.startsWith('21');

                    return (
                      <tr key={idx} className={isAssetAcc ? 'bg-emerald-50/20' : ''}>
                        <td className="p-3 font-bold text-slate-800">{l.ten}</td>
                        <td className="p-3 font-mono font-semibold text-emerald-900">{l.tk}</td>
                        <td className="p-3 text-right font-mono">{l.sl}</td>
                        <td className="p-3 text-right font-mono text-slate-700">{formatVND(l.gia)}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{formatVND(total)}</td>
                        <td className="p-3">
                          {isAssetAcc ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Sinh Sổ TS (Không khấu hao)</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Không phải TK 211x</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {currentBill.assets.length > 0 && (
              <div className="p-4 bg-emerald-50 border-t border-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong>Tài sản đã tự động khởi tạo trong Sổ TSCĐ: </strong>
                  {currentBill.assets.map(aId => (
                    <button
                      key={aId}
                      onClick={() => onNavigate('mh6', aId)}
                      className="font-mono font-bold text-emerald-800 hover:underline mx-1"
                    >
                      {aId}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Bấm "Vào sổ" để sinh bút toán kế toán và khởi tạo thẻ tài sản tự động.
              </span>

              {currentBill.trangThai !== 'Đã vào sổ' ? (
                <button
                  onClick={handlePost}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-xs"
                >
                  <FileCheck className="w-4 h-4" /> Vào sổ (Post Vendor Bill)
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('mh6', currentBill.assets[0])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded text-xs font-semibold"
                >
                  <span>Xem thẻ tài sản (MH6)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
