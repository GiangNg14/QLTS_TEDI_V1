import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetTransferRecord } from '../../types';
import { formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import { Printer, CheckCircle2, ArrowRight, Save, Send, XCircle } from 'lucide-react';

interface TransferScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({ onNavigate }) => {
  const { transfers, assetMasters, addTransfer, updateTransfer, addLog } = useApp();

  const [activeTransferId, setActiveTransferId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('taisan');

  const filteredTransfers = transfers.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ts.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tuPB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.denPB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lyDo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTransferIndex = transfers.findIndex(t => t.id === activeTransferId);
  const currentTransfer = transfers[currentTransferIndex] || null;

  const handleCreateNewTransfer = () => {
    const newId = `ĐCTS/2026/${String(transfers.length + 1).padStart(4, '0')}`;
    const defaultAsset = assetMasters[0];
    const newTransfer: AssetTransferRecord = {
      id: newId,
      ngay: new Date().toISOString().split('T')[0],
      ts: defaultAsset?.id || '',
      tuPB: defaultAsset?.pbsd || 'QLVP',
      tuNguoi: defaultAsset?.nguoi || 'Cán bộ phụ trách',
      denPB: DEPARTMENTS[1] || 'QLCL',
      denNguoi: 'Cán bộ nhận bàn giao',
      lyDo: 'Điều chuyển phục vụ dự án công trình mới theo QT-09',
      trangThai: 'Nháp',
      loaiDieuChuyen: 'Nội bộ (Cùng pháp nhân)',
      canCuLoai: 'Quyết định điều chuyển',
      soQuyetDinh: `QĐ-DC/2026/${String(transfers.length + 1).padStart(3, '0')}`,
      ngayQuyetDinh: new Date().toISOString().split('T')[0],
      viTriMoi: 'Phòng làm việc mới',
      doiTuongChiPhiMoi: 'Dự án Khảo sát TEDI'
    };
    addTransfer(newTransfer);
    setActiveTransferId(newId);
    setActiveTab('taisan');
    addLog(`Khởi tạo phiếu điều chuyển mới ${newId}`);
  };

  const handleSelectAssetChange = (assetId: string) => {
    if (!currentTransfer) return;
    const selectedAsset = assetMasters.find(a => a.id === assetId);
    if (!selectedAsset) return;

    updateTransfer({
      ...currentTransfer,
      ts: selectedAsset.id,
      tuPB: selectedAsset.pbsd || 'QLVP',
      tuNguoi: selectedAsset.nguoi || 'Chưa gán'
    });
  };

  const handleStageChange = (newStage: AssetTransferRecord['trangThai']) => {
    if (!currentTransfer) return;
    const updated = { ...currentTransfer, trangThai: newStage };
    updateTransfer(updated);
    alert(`Đã chuyển phiếu ${currentTransfer.id} sang trạng thái: ${newStage}`);
  };

  const handlePrintTransfer = () => {
    if (!currentTransfer) return;
    setPrintData({
      id: currentTransfer.id,
      ngay: currentTransfer.ngay,
      ts: currentTransfer.ts,
      tuPB: currentTransfer.tuPB,
      tuNguoi: currentTransfer.tuNguoi,
      denPB: currentTransfer.denPB,
      denNguoi: currentTransfer.denNguoi,
      lyDo: currentTransfer.lyDo
    });
  };

  const activeAssetInfo = assetMasters.find(a => a.id === currentTransfer?.ts);

  return (
    <div className="space-y-3 relative font-sans">
      {currentTransfer ? (
        /* DETAIL FORM SHEET (MATCHING EXACT ODOO SHEET FOR QT-09) */
        <OdooFormSheet
          category="TÀI SẢN & MUA SẮM / ĐIỀU CHUYỂN TÀI SẢN (QT-09)"
          title={`${currentTransfer.id} — Phiếu điều chuyển tài sản`}
          subtitle={`Căn cứ: ${currentTransfer.canCuLoai || 'Quyết định điều chuyển'} (${currentTransfer.soQuyetDinh || 'N/A'}) | Ngày lập: ${formatDMY(currentTransfer.ngay)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Chờ phê duyệt', label: 'Chờ phê duyệt' },
            { id: 'Đã phê duyệt', label: 'Đã phê duyệt' },
            { id: 'Đã hoàn thành', label: 'Đã hoàn thành' },
            { id: 'Từ chối', label: 'Từ chối' }
          ]}
          currentStageId={currentTransfer.trangThai || 'Nháp'}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateNewTransfer}
          onBack={() => setActiveTransferId(null)}
          currentIndex={currentTransferIndex + 1}
          totalItems={transfers.length}
          onPrev={() => currentTransferIndex > 0 && setActiveTransferId(transfers[currentTransferIndex - 1].id)}
          onNext={() => currentTransferIndex < transfers.length - 1 && setActiveTransferId(transfers[currentTransferIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentTransfer.trangThai === 'Nháp' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Chờ phê duyệt')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trình duyệt (Yêu cầu)</span>
                </button>
              )}

              {currentTransfer.trangThai === 'Chờ phê duyệt' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleStageChange('Đã phê duyệt')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt phiếu điều chuyển</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStageChange('Từ chối')}
                    className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Từ chối</span>
                  </button>
                </>
              )}

              {currentTransfer.trangThai === 'Đã phê duyệt' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đã hoàn thành')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xác nhận bàn giao thực tế &amp; Cập nhật hồ sơ</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrintTransfer}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên bản A4</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã phiếu điều chuyển',
              value: <span className="font-mono text-blue-900 font-bold">{currentTransfer.id}</span>
            },
            {
              label: 'Ngày điều chuyển',
              value: (
                <input
                  type="date"
                  value={currentTransfer.ngay}
                  onChange={e => updateTransfer({ ...currentTransfer, ngay: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-mono"
                />
              )
            },
            {
              label: 'Loại điều chuyển',
              value: (
                <select
                  value={currentTransfer.loaiDieuChuyen || 'Nội bộ (Cùng pháp nhân)'}
                  onChange={e => updateTransfer({ ...currentTransfer, loaiDieuChuyen: e.target.value as any })}
                  className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="Nội bộ (Cùng pháp nhân)">Nội bộ (Cùng pháp nhân)</option>
                  <option value="Khác pháp nhân">Khác pháp nhân (TEDI &amp; Thành viên)</option>
                </select>
              )
            },
            {
              label: 'Loại căn cứ pháp lý',
              value: (
                <select
                  value={currentTransfer.canCuLoai || 'Quyết định điều chuyển'}
                  onChange={e => updateTransfer({ ...currentTransfer, canCuLoai: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 bg-white text-xs text-slate-800"
                >
                  <option value="Quyết định điều chuyển">Quyết định phân công / điều chuyển</option>
                  <option value="Điều chuyển nhân sự">Điều chuyển nhân sự</option>
                  <option value="Thay đổi nhu cầu">Thay đổi nhu cầu sử dụng</option>
                  <option value="Kết quả kiểm kê">Kết quả kiểm kê tài sản</option>
                </select>
              )
            },
            {
              label: 'Số & Ngày quyết định',
              value: (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentTransfer.soQuyetDinh || ''}
                    placeholder="Số QĐ..."
                    onChange={e => updateTransfer({ ...currentTransfer, soQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-mono w-2/3"
                  />
                  <input
                    type="date"
                    value={currentTransfer.ngayQuyetDinh || currentTransfer.ngay}
                    onChange={e => updateTransfer({ ...currentTransfer, ngayQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-mono w-1/3"
                  />
                </div>
              )
            }
          ]}
          rightFields={[
            {
              label: 'Đơn vị xuất giao (Bên giao)',
              value: <span className="font-bold text-slate-800">{currentTransfer.tuPB}</span>
            },
            {
              label: 'Người giao đại diện',
              value: <span className="text-[#1C6AA9] font-bold">{currentTransfer.tuNguoi}</span>
            },
            {
              label: 'Đơn vị tiếp nhận (Bên nhận)',
              value: (
                <select
                  value={currentTransfer.denPB}
                  onChange={e => updateTransfer({ ...currentTransfer, denPB: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-blue-900 bg-white text-xs"
                >
                  {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )
            },
            {
              label: 'Người nhận tiếp nhận',
              value: (
                <input
                  type="text"
                  value={currentTransfer.denNguoi}
                  onChange={e => updateTransfer({ ...currentTransfer, denNguoi: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-[#1C6AA9] bg-white text-xs"
                />
              )
            },
            {
              label: 'Vị trí lưu giữ mới',
              value: (
                <input
                  type="text"
                  value={currentTransfer.viTriMoi || ''}
                  onChange={e => updateTransfer({ ...currentTransfer, viTriMoi: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                />
              )
            }
          ]}
          tabs={[
            { id: 'taisan', label: 'Tài sản điều chuyển & Lý do' },
            { id: 'quytrinh', label: 'Luồng phê duyệt QT-09 (TEDI SRS)' },
            { id: 'dinhkem', label: 'Hồ sơ đính kèm & Chữ ký' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `Quyet_Dinh_Dieu_Chuyen_${currentTransfer.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `Bien_Ban_Ban_Giao_${currentTransfer.id.replace(/\//g, '_')}.docx`, type: 'DOCX', verified: true }
          ]}
        >
          {/* TAB BODY CONTENT */}
          {activeTab === 'taisan' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Thông tin tài sản chọn điều chuyển
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Chọn tài sản (*):</label>
                    <select
                      value={currentTransfer.ts}
                      onChange={e => handleSelectAssetChange(e.target.value)}
                      className="w-full border border-slate-300 rounded p-2 font-bold text-blue-900 bg-white"
                    >
                      {assetMasters.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.id} — {a.ten} (Ở: {a.pbsd || 'Chưa bàn giao'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeAssetInfo && (
                    <div className="p-3 bg-white border border-slate-200 rounded space-y-1 text-slate-700">
                      <div>• Tên tài sản: <strong className="text-slate-900">{activeAssetInfo.ten}</strong></div>
                      <div>• Nguyên giá: <strong className="font-mono text-blue-900">{activeAssetInfo.nguyenGia.toLocaleString('vi-VN')} ₫</strong></div>
                      <div>• Đơn vị quản lý: <strong>{activeAssetInfo.pbQuanLy}</strong></div>
                      <div>• Trạng thái hiện tại: <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">{activeAssetInfo.trangThai}</span></div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lý do điều chuyển chi tiết (*):</label>
                  <textarea
                    rows={3}
                    value={currentTransfer.lyDo}
                    onChange={e => updateTransfer({ ...currentTransfer, lyDo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Action Save */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    updateTransfer(currentTransfer);
                    alert(`Đã lưu phiếu điều chuyển ${currentTransfer.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu phiếu điều chuyển</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quytrinh' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Trình tự thực hiện theo Quy trình QT-09 (TEDI SRS)
                </h3>

                <div className="space-y-3 font-sans">
                  <div className="flex items-start gap-3 p-2.5 bg-white border border-slate-200 rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900 block">Đơn vị sử dụng (Bên giao):</strong>
                      <span className="text-slate-600">Báo cáo &amp; đề xuất phương án sử dụng / điều chuyển tài sản khi có căn cứ nghỉ chế độ, chuyển công tác hoặc thay đổi nhiệm vụ.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-white border border-slate-200 rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900 block">Đơn vị quản lý TSCĐ (QLVP/BQL):</strong>
                      <span className="text-slate-600">Tổng hợp đề xuất, lập tờ trình điều chuyển và phát hành phiếu điều chuyển tài sản chính thức.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-white border border-slate-200 rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">3</span>
                    <div>
                      <strong className="text-slate-900 block">Lãnh đạo TEDI / TGĐ/GĐ:</strong>
                      <span className="text-slate-600">Xem xét và phê duyệt phiếu điều chuyển theo thẩm quyền hạn mức.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-white border border-slate-200 rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">4</span>
                    <div>
                      <strong className="text-slate-900 block">Bàn giao thực tế &amp; Ký biên bản:</strong>
                      <span className="text-slate-600">Bên giao và Bên nhận kiểm tra hiện trạng thiết bị, ký Biên bản bàn giao và lưu vào hồ sơ lý lịch.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-white border border-slate-200 rounded">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0">5</span>
                    <div>
                      <strong className="text-slate-900 block">Cập nhật Odoo &amp; Đồng bộ FAST (IF-05/IF-08):</strong>
                      <span className="text-slate-600">Cập nhật Đơn vị sử dụng (pbsd), Người sử dụng (nguoi) trên Odoo và đẩy thông tin bộ phận chịu chi phí sang FAST.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dinhkem' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Thành phần ký duyệt &amp; Biên bản bàn giao
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-semibold text-slate-800">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Đại diện Bên giao</span>
                    <span className="text-blue-900 font-bold">{currentTransfer.tuNguoi}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Đại diện Bên nhận</span>
                    <span className="text-blue-900 font-bold">{currentTransfer.denNguoi}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Phòng TCKT</span>
                    <span className="text-slate-700 font-bold">Kế toán TSCĐ</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Lãnh đạo phê duyệt</span>
                    <span className="text-emerald-800 font-bold">Tổng Giám đốc / Giám đốc</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OdooFormSheet>
      ) : (
        /* MASTER LIST VIEW (CLEAN ODOO CONTROL PANEL & TABLE, NO EXTRA NOTICE BOXES) */
        <>
          <OdooControlPanel
            breadcrumb={['TÀI SẢN & MUA SẮM', 'Điều chuyển tài sản (QT-09)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredTransfers.length}
            onCreateNew={handleCreateNewTransfer}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất danh sách phiếu điều chuyển tài sản Odoo Excel.")}
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
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã phiếu</th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Ngày lập</th>
                    <th className="p-2.5 border-r border-slate-100">Mã &amp; Tên tài sản</th>
                    <th className="p-2.5 border-r border-slate-100">Đơn vị / Người xuất giao</th>
                    <th className="p-2.5 border-r border-slate-100">Đơn vị / Người tiếp nhận</th>
                    <th className="p-2.5 border-r border-slate-100">Lý do điều chuyển</th>
                    <th className="p-2.5 border-r border-slate-100 text-center">Trạng thái</th>
                    <th className="p-2.5 text-center">Biên bản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTransfers.map((tf, idx) => {
                    const isEven = idx % 2 === 0;
                    const assetObj = assetMasters.find(a => a.id === tf.ts);

                    let stText = tf.trangThai || 'Đã hoàn thành';
                    let stBg = 'bg-emerald-600 text-white';

                    if (stText === 'Nháp') {
                      stBg = 'bg-slate-500 text-white';
                    } else if (stText === 'Chờ phê duyệt') {
                      stBg = 'bg-amber-500 text-white';
                    } else if (stText === 'Đã phê duyệt') {
                      stBg = 'bg-blue-600 text-white';
                    } else if (stText === 'Từ chối') {
                      stBg = 'bg-red-600 text-white';
                    }

                    return (
                      <tr
                        key={tf.id}
                        onClick={() => setActiveTransferId(tf.id)}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-blue-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-blue-900 whitespace-nowrap">
                          {tf.id}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 font-mono whitespace-nowrap">
                          {formatDMY(tf.ngay)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-medium text-slate-800">
                          <span className="font-mono font-bold text-blue-900 mr-1.5">{tf.ts}</span>
                          <span>{assetObj ? assetObj.ten : ''}</span>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-700">
                          <strong className="text-slate-900">{tf.tuPB}</strong> ({tf.tuNguoi})
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-700">
                          <strong className="text-blue-900">{tf.denPB}</strong> ({tf.denNguoi})
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 truncate max-w-xs">
                          {tf.lyDo}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                          <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                            {stText}
                          </span>
                        </td>

                        <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setPrintData({
                                id: tf.id,
                                ngay: tf.ngay,
                                ts: tf.ts,
                                tuPB: tf.tuPB,
                                tuNguoi: tf.tuNguoi,
                                denPB: tf.denPB,
                                denNguoi: tf.denNguoi,
                                lyDo: tf.lyDo
                              });
                            }}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-slate-500" />
                            <span>In A4</span>
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
          type="transfer"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
