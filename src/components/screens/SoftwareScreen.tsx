import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SoftwareLicense } from '../../types';
import { formatVND, formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  Printer, CheckCircle2, Save, Send, Plus, XCircle, FileText,
  Key, RefreshCw, AlertTriangle, ShieldCheck, Laptop, Calendar, User, Copy, Check,
  ExternalLink, Sparkles, Code
} from 'lucide-react';

interface SoftwareScreenProps {
  onNavigate: (screen: string, id?: string) => void;
  selectedId?: string;
}

export const SoftwareScreen: React.FC<SoftwareScreenProps> = ({ onNavigate, selectedId }) => {
  const { software, addSoftware, updateSoftware, addLog } = useApp();

  const [activeSoftwareId, setActiveSoftwareId] = useState<string | null>(selectedId || null);

  useEffect(() => {
    if (selectedId) {
      setActiveSoftwareId(selectedId);
    }
  }, [selectedId]);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('license');
  const [copiedKey, setCopiedKey] = useState(false);

  // New renewal modal inside form
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [newRenewalHD, setNewRenewalHD] = useState('');
  const [newRenewalPrice, setNewRenewalPrice] = useState<number>(0);
  const [newRenewalExp, setNewRenewalExp] = useState('');

  const filteredSoftware = software.filter(sw =>
    sw.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sw.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sw.ncc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sw.pbsd.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sw.soHopDong && sw.soHopDong.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSoftwareIndex = software.findIndex(s => s.id === activeSoftwareId);
  const currentSoftware = software[currentSoftwareIndex] || null;

  const handleCreateNewSoftware = () => {
    const newId = `PM/2026/${String(software.length + 1).padStart(4, '0')}`;
    const newRecord: SoftwareLicense = {
      id: newId,
      ten: 'Phần mềm chuyên dùng mới',
      ncc: 'Nhà cung cấp / Đại lý bản quyền',
      hinhThuc: 'Thuê theo kỳ',
      chuKy: '1 Năm',
      gia: 15000000,
      hetHan: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      pbsd: 'QLCL',
      chuKyKT: 6,
      ktGanNhat: new Date().toISOString().split('T')[0],
      trangThai: 'Nháp',
      soHopDong: `HĐ-PM/${String(software.length + 100).padStart(3, '0')}/2026/TEDI`,
      ngayCap: new Date().toISOString().split('T')[0],
      soLuongUser: 5,
      nguoiQuanLy: 'IT Lead',
      licenseKey: `LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-TEDI`,
      phanLoaiKeToan: 'Chi phí trong kỳ (TK 642)',
      ghiChu: 'Khai báo phần mềm chuyên dùng theo quy trình YC-13.1 TEDI',
      lichSuGiaHan: []
    };

    addSoftware(newRecord);
    setActiveSoftwareId(newId);
    setActiveTab('license');
    addLog(`Đăng ký hồ sơ phần mềm mới ${newId}`);
  };

  const handleStageChange = (newStage: SoftwareLicense['trangThai']) => {
    if (!currentSoftware) return;
    const updated = { ...currentSoftware, trangThai: newStage };

    if (newStage === 'Đã gia hạn' && newRenewalExp) {
      updated.hetHan = newRenewalExp;
    }

    updateSoftware(updated);
    alert(`Đã chuyển trạng thái bản quyền ${currentSoftware.id} sang: ${newStage}`);
  };

  const handleAddRenewal = () => {
    if (!currentSoftware) return;
    if (!newRenewalHD || !newRenewalExp) {
      alert('Vui lòng nhập Số hợp đồng mới và Hạn bản quyền mới.');
      return;
    }

    const currentHistory = currentSoftware.lichSuGiaHan || [];
    const newHistoryItem = {
      ngay: new Date().toISOString().split('T')[0],
      soHD: newRenewalHD,
      gia: newRenewalPrice || currentSoftware.gia,
      hanMoi: newRenewalExp
    };

    const updated: SoftwareLicense = {
      ...currentSoftware,
      hetHan: newRenewalExp,
      soHopDong: newRenewalHD,
      trangThai: 'Đã gia hạn',
      lichSuGiaHan: [newHistoryItem, ...currentHistory]
    };

    updateSoftware(updated);
    setShowRenewalModal(false);
    setNewRenewalHD('');
    setNewRenewalPrice(0);
    setNewRenewalExp('');
    alert(`Đã thêm lượt gia hạn bản quyền thành công cho ${currentSoftware.id}!`);
  };

  const computePhanLoaiKT = (sw: SoftwareLicense): string => {
    if (sw.hinhThuc === 'Thuê theo kỳ') {
      return 'Chi phí trong kỳ (TK 642)';
    }
    return 'TSCĐ Vô hình (TK 2135)';
  };

  const handleCopyKey = (key?: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-3 relative font-sans">
      {currentSoftware ? (
        <div className="space-y-2">
          {/* BANNER LIÊN KẾT TÀI SẢN CỐ ĐỊNH VÔ HÌNH (Perpetual License -> Intangible Asset) */}
          {currentSoftware.hinhThuc === 'Mua vĩnh viễn' && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-md shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                      Tài sản cố định vô hình — TK 2135 (Phần mềm máy tính)
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Đã liên kết Sổ TSCĐ
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded border border-blue-300 font-bold">
                      Bản quyền vĩnh viễn
                    </span>
                  </div>
                  <p className="text-xs text-blue-900 mt-1">
                    Bản quyền phần mềm mua vĩnh viễn được tự động ghi nhận trên <strong>Sổ theo dõi Tài sản cố định vô hình</strong> (TK 2135, TK hao mòn 2143).
                    {currentSoftware.assetId && (
                      <span className="ml-1.5 font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300 shadow-2xs">
                        Mã tài sản: {currentSoftware.assetId}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mh6', currentSoftware.assetId || `TS/PM/${currentSoftware.id.replace(/[^a-zA-Z0-9]/g, '')}`)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded shadow-2xs transition-colors cursor-pointer"
                title="Mở hồ sơ Tài sản cố định vô hình tương ứng trong Sổ tài sản"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trên Sổ TSCĐ vô hình (MH6)</span>
              </button>
            </div>
          )}

          {/* DETAIL FORM SHEET FOR SOFTWARE LICENSE (MH13 / YC-13.1) */}
          <OdooFormSheet
          category="TÀI SẢN & MUA SẮM / BẢN QUYỀN PHẦN MỀM CHUYÊN DÙNG (MH13 / YC-13.1)"
          title={`${currentSoftware.id} — ${currentSoftware.ten}`}
          subtitle={`Hình thức: ${currentSoftware.hinhThuc} | NCC: ${currentSoftware.ncc} | Giá trị: ${formatVND(currentSoftware.gia)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Chờ cấp phép', label: 'Chờ cấp phép' },
            { id: 'Đang khai thác', label: 'Đang khai thác' },
            { id: 'Sắp hết hạn', label: 'Sắp hết hạn' },
            { id: 'Hết hạn', label: 'Hết hạn' },
            { id: 'Đã gia hạn', label: 'Đã gia hạn' }
          ]}
          currentStageId={currentSoftware.trangThai}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateNewSoftware}
          onBack={() => setActiveSoftwareId(null)}
          currentIndex={currentSoftwareIndex + 1}
          totalItems={software.length}
          onPrev={() => currentSoftwareIndex > 0 && setActiveSoftwareId(software[currentSoftwareIndex - 1].id)}
          onNext={() => currentSoftwareIndex < software.length - 1 && setActiveSoftwareId(software[currentSoftwareIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentSoftware.trangThai === 'Nháp' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Chờ cấp phép')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trình duyệt đăng ký bản quyền</span>
                </button>
              )}

              {currentSoftware.trangThai === 'Chờ cấp phép' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đang khai thác')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Duyệt &amp; Kích hoạt bản quyền</span>
                </button>
              )}

              {(currentSoftware.trangThai === 'Đang khai thác' || currentSoftware.trangThai === 'Sắp hết hạn' || currentSoftware.trangThai === 'Hết hạn') && (
                <button
                  type="button"
                  onClick={() => setShowRenewalModal(true)}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Gia hạn bản quyền</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPrintData(currentSoftware)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In thẻ phần mềm (BM-13)</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã phần mềm bản quyền',
              value: <span className="font-mono text-emerald-900 font-bold">{currentSoftware.id}</span>
            },
            {
              label: 'Tên phần mềm chuyên dùng (*)',
              value: (
                <input
                  type="text"
                  value={currentSoftware.ten}
                  onChange={e => updateSoftware({ ...currentSoftware, ten: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 bg-white"
                />
              )
            },
            {
              label: 'Nhà cung cấp / Đại lý (*)',
              value: (
                <input
                  type="text"
                  value={currentSoftware.ncc}
                  onChange={e => updateSoftware({ ...currentSoftware, ncc: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white"
                />
              )
            },
            {
              label: 'Hình thức sở hữu',
              value: (
                <select
                  value={currentSoftware.hinhThuc}
                  onChange={e => {
                    const hThuc = e.target.value as any;
                    const nextSW = { ...currentSoftware, hinhThuc: hThuc };
                    nextSW.phanLoaiKeToan = computePhanLoaiKT(nextSW);
                    updateSoftware(nextSW);
                  }}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="Thuê theo kỳ">Thuê theo kỳ (Subscription / License theo năm)</option>
                  <option value="Mua vĩnh viễn">Mua vĩnh viễn (Perpetual License)</option>
                </select>
              )
            },
            {
              label: 'Chu kỳ thuê / Gia hạn',
              value: (
                <input
                  type="text"
                  value={currentSoftware.chuKy}
                  placeholder="1 Năm, 6 Tháng..."
                  onChange={e => updateSoftware({ ...currentSoftware, chuKy: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                />
              )
            },
            {
              label: 'Số Hợp đồng / Hóa đơn mua',
              value: (
                <input
                  type="text"
                  value={currentSoftware.soHopDong || ''}
                  placeholder="HĐ-PM/2026/TEDI"
                  onChange={e => updateSoftware({ ...currentSoftware, soHopDong: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono bg-white"
                />
              )
            }
          ]}
          rightFields={[
            {
              label: 'Giá trị bản quyền (VNĐ)',
              value: (
                <input
                  type="number"
                  min={0}
                  step={1000000}
                  value={currentSoftware.gia}
                  onChange={e => {
                    const newPrice = parseFloat(e.target.value) || 0;
                    const nextSW = { ...currentSoftware, gia: newPrice };
                    nextSW.phanLoaiKeToan = computePhanLoaiKT(nextSW);
                    updateSoftware(nextSW);
                  }}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 bg-white text-xs w-full"
                />
              )
            },
            {
              label: 'Phân loại kế toán hạch toán',
              value: (
                <span className="font-semibold text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded inline-block">
                  {currentSoftware.phanLoaiKeToan || computePhanLoaiKT(currentSoftware)}
                </span>
              )
            },
            {
              label: 'Phòng ban sử dụng (*)',
              value: (
                <select
                  value={currentSoftware.pbsd}
                  onChange={e => updateSoftware({ ...currentSoftware, pbsd: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-slate-900 bg-white text-xs"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>Phòng {d}</option>)}
                </select>
              )
            },
            {
              label: 'Số lượng User / Lic (Seats)',
              value: (
                <input
                  type="number"
                  min={1}
                  value={currentSoftware.soLuongUser || 1}
                  onChange={e => updateSoftware({ ...currentSoftware, soLuongUser: parseInt(e.target.value) || 1 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 bg-white text-xs w-28"
                />
              )
            },
            {
              label: 'Ngày kích hoạt & Ngày hết hạn',
              value: (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={currentSoftware.ngayCap || ''}
                    onChange={e => updateSoftware({ ...currentSoftware, ngayCap: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-1/2 bg-white"
                  />
                  <input
                    type="date"
                    value={currentSoftware.hetHan || ''}
                    disabled={currentSoftware.hinhThuc === 'Mua vĩnh viễn'}
                    onChange={e => updateSoftware({ ...currentSoftware, hetHan: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-1/2 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              )
            },
            {
              label: 'Cán bộ quản lý IT',
              value: (
                <input
                  type="text"
                  value={currentSoftware.nguoiQuanLy || ''}
                  placeholder="Họ tên cán bộ IT..."
                  onChange={e => updateSoftware({ ...currentSoftware, nguoiQuanLy: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                />
              )
            }
          ]}
          tabs={[
            { id: 'license', label: 'Cấu hình License & Khóa mã hóa' },
            { id: 'renewal', label: 'Lịch sử gia hạn & Kiểm tra ISO (YC-13.1)' },
            { id: 'dinhkem', label: 'Hồ sơ đính kèm & Quy định TEDI' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `Hop_Dong_Ban_Quyen_${currentSoftware.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `E_License_Certificate_${currentSoftware.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true }
          ]}
        >
          {/* TAB 1: LICENSE CONFIGURATION & KEY */}
          {activeTab === 'license' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Thông tin Khóa mã hóa &amp; Đăng ký License Key</span>
                  <Key className="w-4 h-4 text-amber-600" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chuỗi khóa mã hóa / License Key (*):</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={currentSoftware.licenseKey || ''}
                        onChange={e => updateSoftware({ ...currentSoftware, licenseKey: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs text-rose-900 bg-white font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyKey(currentSoftware.licenseKey)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 p-1.5 rounded flex items-center gap-1 font-medium"
                        title="Sao chép License Key"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ghi chú &amp; Quy định sử dụng:</label>
                    <input
                      type="text"
                      value={currentSoftware.ghiChu || ''}
                      onChange={e => updateSoftware({ ...currentSoftware, ghiChu: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Rules Box according to TEDI ISO YC-13.1 */}
                <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5 text-[11px] text-slate-700">
                  <strong className="text-slate-900 block font-bold border-b border-slate-100 pb-1">
                    Quy định Phân loại Kế toán &amp; Quản lý Bản quyền ISO YC-13.1:
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    <li>
                      <strong>Thuê theo kỳ (Subscription):</strong> Hạch toán trực tiếp vào Chi phí quản lý doanh nghiệp trong kỳ (TK 642) hoặc Chi phí trả trước phân bổ (TK 242).
                    </li>
                    <li>
                      <strong>Mua vĩnh viễn (Perpetual - ≥ 30 triệu VNĐ):</strong> Đủ tiêu chuẩn ghi nhận Tài sản cố định vô hình (TK 213), thực hiện trích khấu hao theo kỳ quy định.
                    </li>
                    <li>
                      <strong>Mua vĩnh viễn (&lt; 30 triệu VNĐ):</strong> Hạch toán Công cụ dụng cụ vô hình (TK 1533) và phân bổ vào chi phí tối đa 36 tháng.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateSoftware(currentSoftware);
                    alert(`Đã lưu thông tin hồ sơ phần mềm ${currentSoftware.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thông tin phần mềm</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RENEWAL HISTORY & ISO INSPECTIONS */}
          {activeTab === 'renewal' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9]">
                    Lịch sử Gia hạn Bản quyền &amp; Kiểm tra định kỳ (Chu kỳ: {currentSoftware.chuKyKT} tháng)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowRenewalModal(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm đợt gia hạn</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Chu kỳ kiểm tra bản quyền (tháng):</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={currentSoftware.chuKyKT}
                      onChange={e => updateSoftware({ ...currentSoftware, chuKyKT: parseInt(e.target.value) || 6 })}
                      className="border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold bg-white w-28"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Ngày kiểm tra gần nhất:</label>
                    <input
                      type="date"
                      value={currentSoftware.ktGanNhat || ''}
                      onChange={e => updateSoftware({ ...currentSoftware, ktGanNhat: e.target.value })}
                      className="border border-slate-300 rounded px-2 py-1 text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-white border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                        <th className="p-2 border-r border-slate-200">Ngày gia hạn</th>
                        <th className="p-2 border-r border-slate-200">Số Hợp đồng gia hạn</th>
                        <th className="p-2 border-r border-slate-200 text-right">Giá trị (VNĐ)</th>
                        <th className="p-2">Hạn bản quyền mới</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(currentSoftware.lichSuGiaHan && currentSoftware.lichSuGiaHan.length > 0) ? (
                        currentSoftware.lichSuGiaHan.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{formatDMY(h.ngay)}</td>
                            <td className="p-2 border-r border-slate-200 font-mono font-bold text-blue-900">{h.soHD}</td>
                            <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-emerald-800">{formatVND(h.gia)}</td>
                            <td className="p-2 font-mono font-bold text-amber-900">{h.hanMoi ? formatDMY(h.hanMoi) : 'Vĩnh viễn'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                            Chưa có dữ liệu gia hạn bản quyền trước đó.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTACHMENTS & TEDI RULES */}
          {activeTab === 'dinhkem' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Xác nhận Quản lý Bản quyền Phần mềm TEDI (BM-13)
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center font-semibold text-slate-800">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Cán bộ phụ trách IT</span>
                    <span className="text-blue-900 font-bold">{currentSoftware.nguoiQuanLy || 'IT Admin'}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Đơn vị sử dụng</span>
                    <span className="text-blue-900 font-bold">Phòng {currentSoftware.pbsd}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Phòng TCKT</span>
                    <span className="text-emerald-800 font-bold">Kế toán trưởng TEDI</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OdooFormSheet>
        </div>
      ) : (
        /* MASTER LIST VIEW FOR SOFTWARE LICENSES (MH13) */
        <>
          <OdooControlPanel
            breadcrumb={['TÀI SẢN & MUA SẮM', 'Quản lý bản quyền phần mềm chuyên dùng (MH13)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredSoftware.length}
            onCreateNew={handleCreateNewSoftware}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất danh sách bản quyền phần mềm Odoo Excel.")}
          />

          {activeView === 'list' ? (
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
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã PM</th>
                      <th className="p-2.5 border-r border-slate-100">Tên phần mềm chuyên dùng</th>
                      <th className="p-2.5 border-r border-slate-100">Nhà cung cấp / Đại lý</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Hình thức sở hữu</th>
                      <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Giá trị bản quyền</th>
                      <th className="p-2.5 border-r border-slate-100">Phân loại kế toán</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Hạn bản quyền</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Phòng sử dụng</th>
                      <th className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">Trạng thái</th>
                      <th className="p-2.5 text-center whitespace-nowrap">Biên bản</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredSoftware.map((sw, idx) => {
                      const isEven = idx % 2 === 0;

                      let stText = sw.trangThai;
                      let stBg = 'bg-emerald-700 text-white';

                      if (stText === 'Nháp') stBg = 'bg-slate-500 text-white';
                      else if (stText === 'Chờ cấp phép') stBg = 'bg-blue-600 text-white';
                      else if (stText === 'Đang khai thác') stBg = 'bg-emerald-700 text-white';
                      else if (stText === 'Sắp hết hạn') stBg = 'bg-amber-600 text-white';
                      else if (stText === 'Hết hạn') stBg = 'bg-rose-600 text-white';
                      else if (stText === 'Đã gia hạn') stBg = 'bg-sky-700 text-white';
                      else if (stText === 'Đã hủy') stBg = 'bg-slate-700 text-white';

                      const classifyText = sw.phanLoaiKeToan || computePhanLoaiKT(sw);

                      return (
                        <tr
                          key={sw.id}
                          onClick={() => setActiveSoftwareId(sw.id)}
                          className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                            isEven ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                        >
                          <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-50">
                              <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                            </div>
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-emerald-900 whitespace-nowrap font-mono">
                            {sw.id}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-slate-800">
                            {sw.ten}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-600 max-w-xs truncate">
                            {sw.ncc}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-medium text-slate-800 whitespace-nowrap">
                            {sw.hinhThuc} ({sw.chuKy || '1 Năm'})
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {formatVND(sw.gia)}
                          </td>

                          <td className="p-2.5 border-r border-slate-100">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                                {classifyText}
                              </span>
                              {sw.hinhThuc === 'Mua vĩnh viễn' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate('mh6', sw.assetId || `TS/PM/${sw.id.replace(/[^a-zA-Z0-9]/g, '')}`);
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 font-bold bg-white hover:bg-blue-50 border border-blue-300 px-1.5 py-0.5 rounded shadow-2xs transition-colors cursor-pointer"
                                  title="Xem bản ghi Tài sản cố định vô hình tại màn Tài sản"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>Xem Sổ TSCĐ</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-mono text-slate-700 whitespace-nowrap">
                            {sw.hetHan ? formatDMY(sw.hetHan) : 'Vĩnh viễn'}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-800 font-semibold whitespace-nowrap">
                            Phòng {sw.pbsd}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                            <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                              {stText}
                            </span>
                          </td>

                          <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setPrintData(sw)}
                              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              <span>In BM-13</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* KANBAN VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSoftware.map(sw => (
                <div
                  key={sw.id}
                  onClick={() => setActiveSoftwareId(sw.id)}
                  className="bg-white border border-slate-200 rounded-md p-3.5 hover:shadow-md transition-shadow cursor-pointer space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-800 font-bold block">{sw.id}</span>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{sw.ten}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sw.trangThai === 'Đang khai thác' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sw.trangThai}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-sans text-slate-600">
                    <div>• <strong>NCC:</strong> {sw.ncc}</div>
                    <div>• <strong>Sở hữu:</strong> {sw.hinhThuc} ({sw.chuKy || 'Năm'})</div>
                    <div>• <strong>Giá trị:</strong> <strong className="font-mono text-emerald-800">{formatVND(sw.gia)}</strong></div>
                    <div>• <strong>Đơn vị SD:</strong> Phòng {sw.pbsd}</div>
                    <div>• <strong>Hạn dùng:</strong> <span className="font-mono font-bold text-slate-800">{sw.hetHan ? formatDMY(sw.hetHan) : 'Vĩnh viễn'}</span></div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 text-[10px] truncate max-w-[180px]">Key: {sw.licenseKey || 'N/A'}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrintData(sw);
                      }}
                      className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>In BM-13</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Gia hạn bản quyền */}
      {showRenewalModal && currentSoftware && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#1C6AA9]" />
                <span>Gia hạn bản quyền phần mềm {currentSoftware.id}</span>
              </h3>
              <button onClick={() => setShowRenewalModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên phần mềm:</label>
                <input type="text" disabled value={currentSoftware.ten} className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 font-bold text-slate-800" />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số Hợp đồng gia hạn mới (*):</label>
                <input
                  type="text"
                  placeholder="HĐ-GH/2026/TEDI"
                  value={newRenewalHD}
                  onChange={e => setNewRenewalHD(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-mono font-bold text-blue-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giá trị gia hạn kỳ này (VNĐ):</label>
                <input
                  type="number"
                  step={1000000}
                  placeholder={String(currentSoftware.gia)}
                  value={newRenewalPrice || ''}
                  onChange={e => setNewRenewalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-mono font-bold text-emerald-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hạn bản quyền mới (*):</label>
                <input
                  type="date"
                  value={newRenewalExp}
                  onChange={e => setNewRenewalExp(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-mono font-bold text-amber-900 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowRenewalModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddRenewal}
                className="px-3 py-1.5 bg-[#2B77C0] hover:bg-[#2063A3] text-white rounded text-xs font-bold shadow-2xs"
              >
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {printData && (
        <PrintA4Modal
          type="software"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
