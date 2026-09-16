import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetDisposalRecord } from '../../types';
import { formatVND, formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import { Printer, CheckCircle2, AlertTriangle, Save, Send, Plus, XCircle, FileText, DollarSign } from 'lucide-react';

interface DisposalScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const DisposalScreen: React.FC<DisposalScreenProps> = ({ onNavigate }) => {
  const { disposals, assetMasters, addDisposal, updateDisposal, addLog } = useApp();

  const [activeDisposalId, setActiveDisposalId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('lydo');

  const filteredDisposals = disposals.filter(d =>
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.ts.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.lyDo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDisposalIndex = disposals.findIndex(d => d.id === activeDisposalId);
  const currentDisposal = disposals[currentDisposalIndex] || null;

  const handleCreateNewDisposal = () => {
    const defaultAsset = assetMasters[0];
    const newId = `TL/2026/${String(disposals.length + 1).padStart(4, '0')}`;
    
    let daKH = 0;
    let conLai = 0;
    let nguyenGia = 0;

    if (defaultAsset) {
      nguyenGia = defaultAsset.nguyenGia;
      daKH = defaultAsset.board.filter(r => r.qua).reduce((s, r) => s + r.kh, 0);
      conLai = Math.max(0, nguyenGia - daKH);
    }

    const newRecord: AssetDisposalRecord = {
      id: newId,
      ngay: new Date().toISOString().split('T')[0],
      ts: defaultAsset ? defaultAsset.id : 'TS/2026/0001',
      ten: defaultAsset ? defaultAsset.ten : 'Tài sản đề xuất thanh lý',
      nguyenGia,
      daKH,
      conLai,
      dinhGia: 0,
      chiPhiThanhLy: 0,
      phongBan: defaultAsset ? (defaultAsset.pbsd || 'QLVP') : 'QLVP',
      loaiThanhLy: 'Bán nhượng bán',
      soQuyetDinh: `QĐ-TL/${String(disposals.length + 101).padStart(3, '0')}/2026/TEDI`,
      ngayQuyetDinh: new Date().toISOString().split('T')[0],
      hoiDongDinhGia: 'Hội đồng Định giá TEDI',
      soChungTuGhiGiam: '',
      ngayGhiGiam: '',
      lyDo: 'Tài sản hỏng bóng đèn/linh kiện không thể khôi phục, đề xuất thanh lý ghi giảm',
      trangThai: 'Nháp'
    };

    addDisposal(newRecord);
    setActiveDisposalId(newId);
    setActiveTab('lydo');
    addLog(`Khởi tạo hồ sơ thanh lý mới ${newId}`);
  };

  const handleSelectAsset = (assetId: string) => {
    if (!currentDisposal) return;
    const ts = assetMasters.find(a => a.id === assetId);
    if (!ts) return;

    const daKH = ts.board.filter(r => r.qua).reduce((s, r) => s + r.kh, 0);
    const conLai = Math.max(0, ts.nguyenGia - daKH);

    updateDisposal({
      ...currentDisposal,
      ts: ts.id,
      ten: ts.ten,
      nguyenGia: ts.nguyenGia,
      daKH,
      conLai,
      phongBan: ts.pbsd || 'QLVP'
    });
  };

  const handleStageChange = (newStage: AssetDisposalRecord['trangThai']) => {
    if (!currentDisposal) return;
    const updated = { ...currentDisposal, trangThai: newStage };

    if (newStage === 'Đã hoàn thành' || newStage === 'Đã ghi giảm') {
      updated.ngayGhiGiam = new Date().toISOString().split('T')[0];
      if (!updated.soChungTuGhiGiam) {
        updated.soChungTuGhiGiam = `PKT-GG/2026/${String(disposals.length + 10).padStart(4, '0')}`;
      }
    }

    updateDisposal(updated);
    alert(`Đã cập nhật trạng thái hồ sơ thanh lý ${currentDisposal.id} sang: ${newStage}`);
  };

  const handlePrintDisposal = () => {
    if (!currentDisposal) return;
    setPrintData(currentDisposal);
  };

  // Financial calculations
  const dinhGiaVal = currentDisposal?.dinhGia || 0;
  const conLaiVal = currentDisposal?.conLai || 0;
  const chiPhiVal = currentDisposal?.chiPhiThanhLy || 0;
  const netResult = dinhGiaVal - conLaiVal - chiPhiVal;

  return (
    <div className="space-y-3 relative font-sans">
      {currentDisposal ? (
        /* DETAIL FORM SHEET FOR DISPOSAL RECORD (QT-12) */
        <OdooFormSheet
          category="TÀI SẢN & MUA SẮM / THANH LÝ & GHI GIẢM TÀI SẢN (QT-12)"
          title={`${currentDisposal.id} — ${currentDisposal.ten}`}
          subtitle={`Mã tài sản: [${currentDisposal.ts}] | Nguyên giá: ${formatVND(currentDisposal.nguyenGia)} | Giá trị còn lại: ${formatVND(currentDisposal.conLai)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Chờ phê duyệt', label: 'Chờ phê duyệt' },
            { id: 'Đã phê duyệt', label: 'Đã phê duyệt' },
            { id: 'Đã hoàn thành', label: 'Đã hoàn thành (Ghi giảm)' },
            { id: 'Từ chối', label: 'Từ chối' }
          ]}
          currentStageId={currentDisposal.trangThai === 'Đã ghi giảm' ? 'Đã hoàn thành' : (currentDisposal.trangThai || 'Nháp')}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateNewDisposal}
          onBack={() => setActiveDisposalId(null)}
          currentIndex={currentDisposalIndex + 1}
          totalItems={disposals.length}
          onPrev={() => currentDisposalIndex > 0 && setActiveDisposalId(disposals[currentDisposalIndex - 1].id)}
          onNext={() => currentDisposalIndex < disposals.length - 1 && setActiveDisposalId(disposals[currentDisposalIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentDisposal.trangThai === 'Nháp' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Chờ phê duyệt')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trình duyệt đề nghị thanh lý</span>
                </button>
              )}

              {currentDisposal.trangThai === 'Chờ phê duyệt' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleStageChange('Đã phê duyệt')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Phê duyệt thanh lý</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStageChange('Từ chối')}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Từ chối</span>
                  </button>
                </>
              )}

              {currentDisposal.trangThai === 'Đã phê duyệt' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đã hoàn thành')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hoàn tất thanh lý &amp; Ghi giảm sổ FAST (IF-07)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrintDisposal}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên bản (BM-12 / BM QT12)</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã hồ sơ thanh lý',
              value: <span className="font-mono text-emerald-900 font-bold">{currentDisposal.id}</span>
            },
            {
              label: 'Chọn tài sản thanh lý (*)',
              value: (
                <select
                  value={currentDisposal.ts}
                  onChange={e => handleSelectAsset(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 bg-white"
                >
                  {assetMasters.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.id}] {a.ten} — NG: {formatVND(a.nguyenGia)}
                    </option>
                  ))}
                </select>
              )
            },
            {
              label: 'Hình thức thanh lý',
              value: (
                <select
                  value={currentDisposal.loaiThanhLy || 'Bán nhượng bán'}
                  onChange={e => updateDisposal({ ...currentDisposal, loaiThanhLy: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="Bán nhượng bán">Bán nhượng bán đấu giá / chào giá</option>
                  <option value="Phá hủy / Hủy bỏ">Phá hủy / Hủy bỏ (Hư hỏng hoàn toàn)</option>
                  <option value="Thu hồi phụ tùng">Thu hồi phụ tùng / Vật tư tận dụng</option>
                </select>
              )
            },
            {
              label: 'Số & Ngày QĐ phê duyệt',
              value: (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentDisposal.soQuyetDinh || ''}
                    placeholder="Số QĐ..."
                    onChange={e => updateDisposal({ ...currentDisposal, soQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-2/3 bg-white"
                  />
                  <input
                    type="date"
                    value={currentDisposal.ngayQuyetDinh || currentDisposal.ngay}
                    onChange={e => updateDisposal({ ...currentDisposal, ngayQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-1/3 bg-white"
                  />
                </div>
              )
            },
            {
              label: 'Ngày lập đề nghị',
              value: (
                <input
                  type="date"
                  value={currentDisposal.ngay}
                  onChange={e => updateDisposal({ ...currentDisposal, ngay: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono text-xs bg-white"
                />
              )
            }
          ]}
          rightFields={[
            {
              label: 'Đơn vị quản lý / sử dụng',
              value: (
                <select
                  value={currentDisposal.phongBan || 'QLVP'}
                  onChange={e => updateDisposal({ ...currentDisposal, phongBan: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-slate-900 bg-white text-xs"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>Phòng {d}</option>)}
                </select>
              )
            },
            {
              label: 'Nguyên giá tài sản (Sổ sách)',
              value: <span className="font-mono font-bold text-slate-900">{formatVND(currentDisposal.nguyenGia)}</span>
            },
            {
              label: 'Đã khấu hao / Giá trị còn lại',
              value: (
                <div className="font-mono text-xs">
                  <span>Khấu hao: {formatVND(currentDisposal.daKH)}</span>
                  <span className="mx-2">|</span>
                  <span>Còn lại: <strong className="text-rose-700">{formatVND(currentDisposal.conLai)}</strong></span>
                </div>
              )
            },
            {
              label: 'Giá trị thu hồi định giá (VNĐ)',
              value: (
                <input
                  type="number"
                  min={0}
                  step={500000}
                  value={currentDisposal.dinhGia}
                  onChange={e => updateDisposal({ ...currentDisposal, dinhGia: parseFloat(e.target.value) || 0 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-emerald-800 bg-white text-xs w-full"
                />
              )
            },
            {
              label: 'Chi phí thanh lý phát sinh (VNĐ)',
              value: (
                <input
                  type="number"
                  min={0}
                  step={100000}
                  value={currentDisposal.chiPhiThanhLy || 0}
                  onChange={e => updateDisposal({ ...currentDisposal, chiPhiThanhLy: parseFloat(e.target.value) || 0 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-amber-800 bg-white text-xs w-full"
                />
              )
            }
          ]}
          tabs={[
            { id: 'lydo', label: 'Lý do đề xuất & Kết quả định giá' },
            { id: 'hachtoan', label: 'Hạch toán ghi giảm sổ FAST (IF-07)' },
            { id: 'dinhkem', label: 'Hồ sơ đính kèm & Khối ký duyệt (BM-12)' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `To_Trinh_Thanh_Ly_${currentDisposal.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `Bien_Ban_Dinh_Gia_${currentDisposal.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true }
          ]}
        >
          {/* TAB 1: REASON & EVALUATION */}
          {activeTab === 'lydo' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Nội dung Tờ trình &amp; Lý do đề xuất thanh lý tài sản
                </h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lý do chi tiết (*):</label>
                  <textarea
                    rows={3}
                    value={currentDisposal.lyDo}
                    onChange={e => updateDisposal({ ...currentDisposal, lyDo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 text-xs bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
                    <strong className="text-slate-900 block border-b border-slate-100 pb-1">Hội đồng Định giá &amp; Thanh lý:</strong>
                    <input
                      type="text"
                      value={currentDisposal.hoiDongDinhGia || ''}
                      onChange={e => updateDisposal({ ...currentDisposal, hoiDongDinhGia: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
                    <strong className="text-slate-900 block border-b border-slate-100 pb-1">Tính toán Lãi / Lỗ thanh lý (TK 711 / TK 811):</strong>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div>• Thu từ thanh lý (Định giá): <strong className="text-emerald-800">{formatVND(dinhGiaVal)}</strong></div>
                      <div>• Chi phí thanh lý: <strong className="text-amber-800">-{formatVND(chiPhiVal)}</strong></div>
                      <div>• Giá trị còn lại ghi giảm: <strong className="text-rose-800">-{formatVND(conLaiVal)}</strong></div>
                      <div className="border-t border-slate-200 pt-1 font-bold">
                        • Kết quả ròng: <span className={netResult >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{formatVND(netResult)} ({netResult >= 0 ? 'Lãi thanh lý TK 711' : 'Lỗ thanh lý TK 811'})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateDisposal(currentDisposal);
                    alert(`Đã lưu thông tin hồ sơ thanh lý ${currentDisposal.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu hồ sơ thanh lý</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTING & FAST INTEGRATION */}
          {activeTab === 'hachtoan' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Thông tin Hạch toán Kế toán Ghi giảm Tài sản trên Phần mềm FAST (IF-07)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Số chứng từ ghi giảm FAST:</label>
                    <input
                      type="text"
                      value={currentDisposal.soChungTuGhiGiam || ''}
                      placeholder="PKT-GG/2026/0012"
                      onChange={e => updateDisposal({ ...currentDisposal, soChungTuGhiGiam: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Ngày ghi giảm FAST:</label>
                    <input
                      type="date"
                      value={currentDisposal.ngayGhiGiam || currentDisposal.ngay}
                      onChange={e => updateDisposal({ ...currentDisposal, ngayGhiGiam: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">Bút toán Kế toán tự động định khoản:</div>
                  <div>1. Ghi giảm Nguyên giá: <strong>Nợ TK 214 / Nợ TK 811 / Có TK 211</strong> ({formatVND(currentDisposal.nguyenGia)})</div>
                  <div>2. Thu nhập bán thanh lý: <strong>Nợ TK 111,112,131 / Có TK 711 / Có TK 33311</strong> ({formatVND(dinhGiaVal)})</div>
                  <div>3. Chi phí thanh lý: <strong>Nợ TK 811 / Nợ TK 133 / Có TK 111,112</strong> ({formatVND(chiPhiVal)})</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTACHMENTS & SIGNATURES */}
          {activeTab === 'dinhkem' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Khối ký nhận Biên bản Thanh lý Tài sản TEDI (BM-12 / BM QT12)
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center font-semibold text-slate-800">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Đơn vị quản lý tài sản</span>
                    <span className="text-blue-900 font-bold">{currentDisposal.phongBan || 'QLVP'}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Phòng TCKT</span>
                    <span className="text-blue-900 font-bold">Kế toán trưởng</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Ban Tổng Giám Đốc</span>
                    <span className="text-emerald-800 font-bold">Tổng Giám Đốc TEDI</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OdooFormSheet>
      ) : (
        /* MASTER LIST VIEW FOR DISPOSALS (QT-12) */
        <>
          <OdooControlPanel
            breadcrumb={['TÀI SẢN & MUA SẮM', 'Thanh lý & Ghi giảm tài sản (QT-12)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredDisposals.length}
            onCreateNew={handleCreateNewDisposal}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất danh sách hồ sơ thanh lý tài sản Odoo Excel.")}
          />

          <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-tight">
                    <th className="p-2.5 w-8 text-center border-r border-slate-100">
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-600 mx-auto flex items-center justify-center cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                      </div>
                    </th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã hồ sơ</th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Ngày lập</th>
                    <th className="p-2.5 border-r border-slate-100">Mã &amp; Tên tài sản</th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Đơn vị SD</th>
                    <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Nguyên giá</th>
                    <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Đã KH</th>
                    <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Còn lại</th>
                    <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Thu hồi định giá</th>
                    <th className="p-2.5 border-r border-slate-100">Lý do thanh lý</th>
                    <th className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">Trạng thái</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Biên bản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDisposals.map((d, idx) => {
                    const isEven = idx % 2 === 0;

                    let stText = d.trangThai;
                    let stBg = 'bg-emerald-700 text-white';

                    if (stText === 'Nháp') {
                      stBg = 'bg-slate-500 text-white';
                    } else if (stText === 'Chờ phê duyệt') {
                      stBg = 'bg-blue-600 text-white';
                    } else if (stText === 'Đã phê duyệt') {
                      stBg = 'bg-emerald-600 text-white';
                    } else if (stText === 'Đã hoàn thành' || stText === 'Đã ghi giảm') {
                      stBg = 'bg-slate-800 text-white';
                      stText = 'Đã hoàn thành';
                    } else if (stText === 'Từ chối') {
                      stBg = 'bg-rose-600 text-white';
                    }

                    return (
                      <tr
                        key={d.id}
                        onClick={() => setActiveDisposalId(d.id)}
                        className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-emerald-900 whitespace-nowrap">
                          {d.id}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 font-mono whitespace-nowrap">
                          {formatDMY(d.ngay)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-slate-800">
                          <span className="font-mono text-emerald-800 mr-1">[{d.ts}]</span>
                          <span>{d.ten}</span>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-700 whitespace-nowrap font-medium">
                          {d.phongBan || 'QLVP'}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-right font-mono text-slate-800">
                          {formatVND(d.nguyenGia)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                          {formatVND(d.daKH)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-rose-800">
                          {formatVND(d.conLai)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-emerald-800">
                          {formatVND(d.dinhGia)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 italic max-w-xs truncate">
                          {d.lyDo}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                          <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                            {stText}
                          </span>
                        </td>

                        <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setPrintData(d)}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-slate-500" />
                            <span>In BM-12</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Print Modal */}
      {printData && (
        <PrintA4Modal
          type="disposal"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
