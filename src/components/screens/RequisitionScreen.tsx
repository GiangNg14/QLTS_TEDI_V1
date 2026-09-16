import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineageStrip } from '../LineageStrip';
import { ProcurementRequisition } from '../../types';
import { formatVND, formatNum, formatDMY, DEPARTMENTS, REQUEST_TYPES } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { Plus, X, UserCheck, Send, FileText, Info, Trash2 } from 'lucide-react';

interface RequisitionScreenProps {
  selectedId: string | null;
  onNavigate: (screen: string, id?: string) => void;
}

export const RequisitionScreen: React.FC<RequisitionScreenProps> = ({ selectedId, onNavigate }) => {
  const {
    config, plans, requisitions, contracts, goodsReceipts, supplies,
    addRequisition, updateRequisition, submitRequisition, approveRequisition,
    rejectRequisition, createGoodsReceipt
  } = useApp();

  const plan = plans[0];
  const [activeReqId, setActiveReqId] = useState<string | null>(selectedId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState('mathang');

  const currentReqIndex = requisitions.findIndex(r => r.id === (activeReqId || selectedId));
  const currentReq = requisitions[currentReqIndex] || null;

  // Helper for budget checking
  const checkBudget = (req: ProcurementRequisition) => {
    const totalReq = req.lines.reduce((s, l) => s + l.sl * l.gia, 0);
    const totalSL = req.lines.reduce((s, l) => s + l.sl, 0);

    const khLine = req.khLine ? plan.lines.find(l => l.id === req.khLine) : null;
    if (!khLine) {
      return { label: 'Ngoài kế hoạch', tone: 'bg-rose-50 text-rose-700 border-rose-200', vuotSL: true, vuotGia: true, khLine: null, conSL: 0, conGT: 0, totalReq };
    }

    let usedSL = 0;
    let usedGT = 0;
    requisitions.forEach(dx => {
      if (dx.khLine !== khLine.id || dx.id === req.id) return;
      if (['Đã duyệt', 'Đã giao chỉ thị', 'Đang thực hiện', 'Hoàn thành'].includes(dx.trangThai)) {
        dx.lines.forEach(l => {
          usedSL += l.sl;
          usedGT += l.sl * l.gia;
        });
      }
    });

    const conSL = khLine.sl - usedSL;
    const conGT = (khLine.sl * khLine.gia) - usedGT;

    const vuotSL = totalSL > conSL;
    const vuotGia = totalReq > conGT;

    let label = 'Trong kế hoạch';
    let tone = 'bg-[#1C6AA9] text-white border-blue-200';

    if (vuotSL && vuotGia) {
      label = 'Vượt cả hai';
      tone = 'bg-rose-600 text-white font-bold';
    } else if (vuotSL) {
      label = 'Vượt số lượng';
      tone = 'bg-amber-600 text-white';
    } else if (vuotGia) {
      label = 'Vượt giá';
      tone = 'bg-amber-600 text-white';
    }

    return { label, tone, vuotSL, vuotGia, khLine, conSL, conGT, totalReq };
  };

  const getApprovalCaps = (total: number) => {
    if (total < config.hanMucX) return ['Trưởng phòng'];
    if (total <= config.hanMucY) return ['Trưởng phòng', 'Sếp tổng'];
    return ['Trưởng phòng', 'Sếp tổng', 'HĐQT'];
  };

  const handleCreateNew = () => {
    const id = `DXMS/2026/${String(requisitions.length + 1).padStart(4, '0')}`;
    const newReq: ProcurementRequisition = {
      id,
      ngay: new Date().toISOString().split('T')[0],
      pb: 'QLVP',
      pbsd: 'QLVP',
      loai: 'TSCĐ',
      khLine: null,
      lines: [{ ten: 'Mặt hàng đề xuất mới', sl: 1, dvt: 'Cái', gia: 10000000, ts: '', mucDich: 'Trang bị văn phòng' }],
      trangThai: 'Nháp',
      lyDoVuot: '',
      duyet: [],
      chiThi: null
    };
    addRequisition(newReq);
    setActiveReqId(id);
  };

  const filteredRequisitions = requisitions.filter(r =>
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.pb.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.loai.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.trangThai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentReq) {
    const check = checkBudget(currentReq);
    const caps = getApprovalCaps(check.totalReq);
    const isReadOnly = currentReq.trangThai !== 'Nháp';
    const hd = contracts.find(h => h.dx === currentReq.id);
    const gr = goodsReceipts.find(g => g.dx === currentReq.id);
    const ts = gr ? (gr.lines.find(l => l.ts)?.ts || null) : null;

    return (
      <div className="space-y-3 font-sans">
        {/* Lineage Traceability Strip */}
        <LineageStrip
          currentStage="dx"
          khLineText={check.khLine ? `${plan.id} · ${check.khLine.ten}` : null}
          dxId={currentReq.id}
          hdId={hd?.id}
          nhId={gr?.id}
          tsId={ts}
          onNavigate={onNavigate}
        />

        {/* ODOO FORM SHEET */}
        <OdooFormSheet
          category="MUA SẮM / ĐỀ XUẤT MUA SẮM"
          title={`${currentReq.id} — ${currentReq.lines[0]?.ten || 'Mặt hàng đề xuất'}`}
          subtitle={`Phòng ban đề xuất: ${currentReq.pb} | Ngày: ${formatDMY(currentReq.ngay)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Chờ duyệt', label: 'Chờ phê duyệt' },
            { id: 'Đã duyệt', label: 'Đã duyệt' },
            { id: 'Từ chối', label: 'Không đạt' }
          ]}
          currentStageId={currentReq.trangThai.includes('Từ chối') ? 'Từ chối' : currentReq.trangThai.includes('Chờ') ? 'Chờ duyệt' : currentReq.trangThai}
          onStageSelect={(stgId) => updateRequisition({ ...currentReq, trangThai: stgId as any })}
          onNew={handleCreateNew}
          onBack={() => setActiveReqId(null)}
          currentIndex={currentReqIndex + 1}
          totalItems={requisitions.length}
          onPrev={() => currentReqIndex > 0 && setActiveReqId(requisitions[currentReqIndex - 1].id)}
          onNext={() => currentReqIndex < requisitions.length - 1 && setActiveReqId(requisitions[currentReqIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentReq.trangThai === 'Nháp' && (
                <button
                  type="button"
                  onClick={() => submitRequisition(currentReq.id)}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-semibold px-3.5 py-1.5 rounded-md text-xs shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yêu cầu duyệt</span>
                </button>
              )}

              {currentReq.trangThai.includes('Chờ') && (
                <>
                  <button
                    type="button"
                    onClick={() => approveRequisition(currentReq.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-1.5 rounded-md text-xs shadow-2xs flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Duyệt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const reason = prompt('Lý do từ chối:');
                      if (reason) rejectRequisition(currentReq.id, reason);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3.5 py-1.5 rounded-md text-xs shadow-2xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Từ chối</span>
                  </button>
                </>
              )}

              {['Đã giao chỉ thị', 'Đang thực hiện', 'Đã duyệt'].includes(currentReq.trangThai) && (
                <button
                  type="button"
                  onClick={() => {
                    const nhId = createGoodsReceipt(currentReq.id);
                    onNavigate('mh4', nhId);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-semibold px-3.5 py-1.5 rounded-md text-xs shadow-2xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo Phiếu Nhận Hàng (MH4)</span>
                </button>
              )}
            </div>
          }
          leftFields={[
            {
              label: 'Mã phiếu đề xuất',
              value: <span className="font-mono text-blue-900 font-bold">{currentReq.id}</span>
            },
            {
              label: 'Ngày đề xuất',
              value: isReadOnly ? (
                <span className="font-mono">{formatDMY(currentReq.ngay)}</span>
              ) : (
                <input
                  type="date"
                  className="border border-slate-300 rounded px-2 py-1 bg-white"
                  value={currentReq.ngay}
                  onChange={e => updateRequisition({ ...currentReq, ngay: e.target.value })}
                />
              )
            },
            {
              label: 'Phòng ban đề xuất',
              value: isReadOnly ? (
                <span className="font-semibold text-slate-800">{currentReq.pb}</span>
              ) : (
                <select
                  className="border border-slate-300 rounded px-2 py-1 bg-white font-semibold text-slate-800"
                  value={currentReq.pb}
                  onChange={e => updateRequisition({ ...currentReq, pb: e.target.value })}
                >
                  {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )
            },
            {
              label: 'Phòng ban sử dụng',
              value: isReadOnly ? (
                <span className="font-semibold text-slate-800">{currentReq.pbsd}</span>
              ) : (
                <select
                  className="border border-slate-300 rounded px-2 py-1 bg-white font-semibold text-slate-800"
                  value={currentReq.pbsd}
                  onChange={e => updateRequisition({ ...currentReq, pbsd: e.target.value })}
                >
                  {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )
            }
          ]}
          rightFields={[
            {
              label: 'Người tạo phiếu',
              value: <span className="text-[#1C6AA9] font-bold">Administrator</span>
            },
            {
              label: 'Loại yêu cầu',
              value: isReadOnly ? (
                <span className="font-semibold text-slate-800">{currentReq.loai}</span>
              ) : (
                <select
                  className="border border-slate-300 rounded px-2 py-1 bg-white font-semibold text-slate-800"
                  value={currentReq.loai}
                  onChange={e => updateRequisition({ ...currentReq, loai: e.target.value as any })}
                >
                  {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )
            },
            {
              label: 'Liên kết Kế hoạch',
              value: isReadOnly ? (
                check.khLine ? (
                  <span className="font-bold text-slate-900">{check.khLine.id} · {check.khLine.ten}</span>
                ) : (
                  <span className="text-amber-800 font-semibold italic bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Ngoài kế hoạch năm (Mua sắm đột xuất / phát sinh)
                  </span>
                )
              ) : (
                <select
                  className="border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-800 text-xs w-full"
                  value={currentReq.khLine || ''}
                  onChange={e => updateRequisition({ ...currentReq, khLine: e.target.value || null })}
                >
                  <option value="">-- Mua sắm đột xuất / Ngoài kế hoạch năm --</option>
                  {plan.lines.map(line => (
                    <option key={line.id} value={line.id}>
                      [{line.id}] {line.ten} ({line.pb}) - SL: {line.sl} {line.dvt}
                    </option>
                  ))}
                </select>
              )
            },
            {
              label: 'Cấp duyệt yêu cầu',
              value: <span className="font-bold text-blue-900">{caps.join(' → ')}</span>
            }
          ]}
          tabs={[
            { id: 'mathang', label: 'Chi tiết mặt hàng đề xuất' },
            { id: 'kehoach', label: 'Kế hoạch & Định mức ngân sách' },
            { id: 'pheduyet', label: 'Lịch sử & Cấp phê duyệt' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `To_Trinh_De_Xuat_${currentReq.id.replace(/\//g, '_')}.docx`, type: 'DOCX', verified: true },
            { name: `Bao_Gia_Tham_Khao.pdf`, type: 'PDF', verified: true }
          ]}
        >
          {activeTab === 'mathang' && (
            <div className="space-y-4 pt-2">
              {/* Check NL-06 / BR-KHO-17: Available Warehouse Stock Check */}
              {(() => {
                const stockAlerts = currentReq.lines.map(l => {
                  const s = supplies.find(item => item.ten.toLowerCase().includes(l.ten.toLowerCase()) || l.ten.toLowerCase().includes(item.ten.toLowerCase()));
                  if (!s) return null;
                  const totalGiu = Object.values(s.giu || {}).reduce((a: number, b: number) => a + b, 0);
                  const available = Math.max(0, Number(s.tonKho) - Number(totalGiu) - Number(s.dangMuon || 0));
                  if (available > 0) {
                    return { itemTen: l.ten, stockTen: s.ten, available, dvt: s.dvt };
                  }
                  return null;
                }).filter(Boolean);

                if (stockAlerts.length === 0) return null;

                return (
                  <div className="bg-amber-50 border border-amber-300 rounded-md p-3 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
                    <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0">Cảnh báo NL-06 / BR-KHO-17</span>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">Mặt hàng trong đề xuất hiện có sẵn tồn khả dụng trong Kho trung tâm:</p>
                      <ul className="list-disc list-inside space-y-0.5 font-mono">
                        {stockAlerts.map((a, idx) => (
                          <li key={idx}>
                            <strong className="text-amber-950">{a?.stockTen}</strong>: Còn <span className="font-bold text-amber-700">{a?.available} {a?.dvt}</span> tồn khả dụng trong Kho.
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-amber-800 pt-1">
                        Khuyến nghị: Thay vì mua sắm mới, đơn vị nên lập <strong>Đề nghị cấp vật tư / CCDC (CT-11)</strong> trực tiếp từ kho để tiết kiệm chi phí.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('mh5')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded text-xs shrink-0 self-center shadow-xs cursor-pointer"
                    >
                      Tạo Đề nghị cấp (CT-11) →
                    </button>
                  </div>
                );
              })()}

              {/* Info banner explaining BR-MS-03 Classification Rule */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900 flex items-start gap-2.5 shadow-2xs">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-blue-900">
                    QUY TRÌNH PHÂN LOẠI TÀI SẢN (BR-MS-03 &amp; TT 45/2013/TT-BTC):
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    Tại bước Đề xuất, đơn giá là <strong>đơn giá ước tính/dự kiến</strong>. Hệ thống chỉ đưa ra phân loại sơ bộ.
                    <strong> Loại tài sản chính thức (TSCĐ hay Vật tư / CCDC) sẽ được tự động chốt khi hàng về</strong> (bước Nhận hàng/Nghiệm thu MH4) dựa trên Đơn giá chính thức trên Hóa đơn/Hợp đồng: Đơn giá ≥ 30,000,000 VNĐ ➔ Ghi nhận Sổ TSCĐ; Đơn giá &lt; 30,000,000 VNĐ ➔ Nhập kho Vật tư/CCDC.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>DANH SÁCH MẶT HÀNG / DỊCH VỤ CẦN MUA SẮM</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">QT-MS-02 · CT-02 (Phiếu đề xuất TSCĐ) / CT-03 (Tờ trình MS)</span>
                  </div>
                  <span className="font-mono text-blue-900 font-bold">Tổng cộng: {formatVND(check.totalReq)}</span>
                </div>

                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Tên hàng hóa / Dịch vụ</th>
                      <th className="p-2.5 w-20 text-center">ĐVT</th>
                      <th className="p-2.5 w-20 text-right">Số lượng</th>
                      <th className="p-2.5 w-28 text-right">Đơn giá dự kiến</th>
                      <th className="p-2.5 w-32 text-right">Thành tiền (VND)</th>
                      <th className="p-2.5 w-36 text-center">Phân loại sơ bộ (Dự kiến)</th>
                      <th className="p-2.5">Mục đích sử dụng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentReq.lines.map((l, i) => {
                      const isTscdEst = l.gia >= 30000000;
                      return (
                        <tr key={i} className="hover:bg-blue-50/30">
                          <td className="p-2.5 font-semibold text-slate-900">{l.ten}</td>
                          <td className="p-2.5 text-center">{l.dvt}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-800">{formatNum(l.sl)}</td>
                          <td className="p-2.5 text-right font-mono">{formatVND(l.gia)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-blue-900">{formatVND(l.sl * l.gia)}</td>
                          <td className="p-2.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isTscdEst
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {isTscdEst ? 'Dự kiến TSCĐ (≥30tr)' : 'Dự kiến CCDC/Vật tư'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{l.mucDich}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kehoach' && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-800">Kiểm tra định mức hạn mức:</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${check.tone}`}>
                    {check.label}
                  </span>
                  <span className="text-slate-600">
                    {check.khLine ? `Dòng kế hoạch: ${check.khLine.id}` : 'Không sử dụng ngân sách kế hoạch năm'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pheduyet' && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                <span className="font-bold text-slate-800">Quy trình cấp phê duyệt:</span>
                <div className="font-mono text-slate-700">
                  {caps.map((cap, i) => (
                    <div key={i} className="py-1">
                      Step {i + 1}: <span className="font-bold text-blue-900">{cap}</span> — {currentReq.trangThai === 'Đã duyệt' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </OdooFormSheet>
      </div>
    );
  }

  // Master Odoo List View
  return (
    <div className="space-y-4 font-sans">
      <OdooControlPanel
        breadcrumb={['MUA SẮM', 'Đề xuất mua sắm (MH1)']}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredRequisitions.length}
        onCreateNew={handleCreateNew}
        createLabel="Mới"
        onExportExcel={() => alert("Đã xuất danh sách Đề xuất Mua sắm TEDI Excel.")}
      />

      <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-tight">
                <th className="p-2.5 w-8 text-center border-r border-slate-100">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 mx-auto flex items-center justify-center cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                  </div>
                </th>
                <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã đề xuất</th>
                <th className="p-2.5 border-r border-slate-100">Ngày</th>
                <th className="p-2.5 border-r border-slate-100">Phòng ban đề xuất</th>
                <th className="p-2.5 border-r border-slate-100">Loại yêu cầu</th>
                <th className="p-2.5 border-r border-slate-100 text-right">Tổng giá trị</th>
                <th className="p-2.5 border-r border-slate-100">Định mức KH</th>
                <th className="p-2.5 border-r border-slate-100">Cấp duyệt</th>
                <th className="p-2.5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequisitions.map((req, idx) => {
                const isEven = idx % 2 === 0;
                const check = checkBudget(req);
                const caps = getApprovalCaps(check.totalReq);

                return (
                  <tr
                    key={req.id}
                    onClick={() => setActiveReqId(req.id)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                      isEven ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-blue-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                      </div>
                    </td>
                    <td className="p-2.5 border-r border-slate-100 font-mono font-bold text-slate-900">{req.id}</td>
                    <td className="p-2.5 border-r border-slate-100 font-mono text-slate-600">{formatDMY(req.ngay)}</td>
                    <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-800">{req.pb}</td>
                    <td className="p-2.5 border-r border-slate-100 text-slate-600">{req.loai}</td>
                    <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900">
                      {formatVND(check.totalReq)}
                    </td>
                    <td className="p-2.5 border-r border-slate-100">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${check.tone}`}>
                        {check.label}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-100 text-slate-600 font-medium">
                      {caps.join(' → ')}
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.trangThai === 'Hoàn thành' || req.trangThai === 'Đã duyệt'
                          ? 'bg-blue-600 text-white'
                          : req.trangThai.includes('Từ chối')
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {req.trangThai}
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
