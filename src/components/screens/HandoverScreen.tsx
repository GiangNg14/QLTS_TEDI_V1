import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HandoverSlip, HandoverSlipLine, HandoverAttachment, AssetMaster } from '../../types';
import { formatDMY, formatVND, formatNum, DEPARTMENTS, UNITS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  Plus, Trash2, Printer, Save, CheckCircle2, ArrowRight,
  Paperclip, FileText, Upload, Download, Eye, ArrowLeft,
  Check, X, ShieldCheck, Box, Package, Layers, ExternalLink
} from 'lucide-react';

interface HandoverScreenProps {
  selectedId?: string | null;
  onNavigate: (screen: string, id?: string) => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({ selectedId, onNavigate }) => {
  const {
    handoverSlips,
    assetMasters,
    supplies,
    addHandoverSlip,
    updateHandoverSlip,
    deleteHandoverSlip,
    addLog
  } = useApp();

  const [activeSlipId, setActiveSlipId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chitiet' | 'dinhkem'>('chitiet');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Modals
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddSupplyModal, setShowAddSupplyModal] = useState(false);
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [printData, setPrintData] = useState<any | null>(null);

  // Attachment upload form state
  const [newAttName, setNewAttName] = useState('');
  const [newAttType, setNewAttType] = useState('PDF');

  // Initialize selectedId from props if provided
  useEffect(() => {
    if (!selectedId) return;

    // 1. Direct slip ID match
    const foundDirect = handoverSlips.find(s => s.id === selectedId);
    if (foundDirect) {
      setActiveSlipId(foundDirect.id);
      return;
    }

    // 2. Asset ID match
    const foundByAsset = handoverSlips.find(s =>
      s.lines.some(l => l.ts === selectedId || l.tsId === selectedId || l.id === selectedId)
    );
    if (foundByAsset) {
      setActiveSlipId(foundByAsset.id);
      return;
    }

    // 3. If passed an asset ID but no slip exists yet, create one for this asset
    const asset = assetMasters.find(a => a.id === selectedId);
    if (asset) {
      const now = new Date();
      const dStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
      const newId = `PBG/${dStr}/${String(handoverSlips.length + 1).padStart(5, '0')}`;

      const newLine: HandoverSlipLine = {
        id: `L-${Date.now()}-1`,
        ten: asset.ten,
        tsTen: `${asset.ten} [${asset.id}]`,
        dvt: 'Cái',
        slDat: 1,
        slNhan: 1,
        soLuong: 1,
        slTon: 1,
        gia: asset.giaMuaGoc || asset.nguyenGia || 0,
        phi: (asset.cuocVanChuyen || 0) + (asset.chiPhiChayThu || 0),
        ts: asset.id,
        tsId: asset.id,
        pb: asset.pbsd || 'QLVP',
        viTriMoi: `Phòng ${asset.pbsd || 'QLVP'} - ${asset.nguoi || ''}`,
        nguoi: asset.nguoi || 'Cán bộ nhận',
        soSerial: asset.soHieuKyThuat || `SN-${asset.id.replace('/', '-')}`,
        nhom: asset.nhom || 'Máy móc thiết bị',
        viTriHienTai: `Kho TBVP TEDI (Phòng ${asset.pbQuanLy || 'QLVP'})`,
        phanLoai: asset.nguyenGia >= 30000000 ? 'Tài sản cố định (TSCĐ)' : 'CCDC / Vật tư kho',
        ghiChu: `Bàn giao đưa vào khai thác sử dụng tại Phòng ${asset.pbsd || 'QLVP'}`
      };

      const newSlip: HandoverSlip = {
        id: newId,
        dx: '',
        hopDong: '',
        ncu: 'Tổng công ty TEDI (Ban Quản trị Văn phòng)',
        chuyenTu: `Phòng ${asset.pbQuanLy || 'QLVP'} (Đơn vị quản lý tài sản)`,
        chuyenDen: `Phòng ${asset.pbsd || 'CL-KD'} (Đơn vị thụ hưởng)`,
        nghiemThu: 'Đạt',
        lyDoDieuChuyen: `Bàn giao tài sản ${asset.id} (${asset.ten}) đưa vào khai thác sử dụng`,
        loaiPhieu: 'Bàn giao mua sắm mới',
        nguoiYeuCau: asset.nguoi || 'Administrator',
        nguoiXacNhanDC: 'Trần Thu Hà (Trưởng phòng QLTS)',
        nguoiTiepNhan: asset.nguoi || 'Cán bộ thụ hưởng',
        ngayTao: nowDateTimeStr(),
        trangThai: 'Đã bàn giao',
        lines: [newLine],
        attachments: [
          { id: `att-${Date.now()}`, name: `Bien_Ban_Ban_Giao_${asset.id.replace(/\//g, '_')}.pdf`, size: '850 KB', date: formatDMY(now.toISOString().split('T')[0]), type: 'PDF' }
        ]
      };

      addHandoverSlip(newSlip);
      setActiveSlipId(newId);
      addLog(`Tạo tự động Phiếu bàn giao ${newId} cho tài sản ${asset.id}`);
    }
  }, [selectedId]);

  const currentSlipIndex = handoverSlips.findIndex(s => s.id === activeSlipId);
  const currentSlip = handoverSlips[currentSlipIndex] || null;

  // Filtered slips for list view
  const filteredSlips = handoverSlips.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      s.id.toLowerCase().includes(q) ||
      (s.dx && s.dx.toLowerCase().includes(q)) ||
      (s.hopDong && s.hopDong.toLowerCase().includes(q)) ||
      (s.ncu && s.ncu.toLowerCase().includes(q)) ||
      s.chuyenTu.toLowerCase().includes(q) ||
      s.chuyenDen.toLowerCase().includes(q) ||
      s.lyDoDieuChuyen.toLowerCase().includes(q) ||
      s.nguoiYeuCau.toLowerCase().includes(q) ||
      s.lines.some(l => (l.ten && l.ten.toLowerCase().includes(q)) || (l.ts && l.ts.toLowerCase().includes(q)) || (l.tsTen && l.tsTen.toLowerCase().includes(q)));

    const matchType = filterType === 'all' || s.loaiPhieu === filterType;
    const matchStatus = filterStatus === 'all' || s.trangThai === filterStatus;

    return matchQuery && matchType && matchStatus;
  });

  const nowDateTimeStr = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const handleCreateNewSlip = () => {
    const now = new Date();
    const dStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
    const newId = `PBG/${dStr}/${String(handoverSlips.length + 1).padStart(5, '0')}`;

    const defaultAsset = assetMasters[0];
    const initialLine: HandoverSlipLine = {
      id: `L-${Date.now()}-1`,
      ten: defaultAsset ? defaultAsset.ten : 'Thiết bị đo đạc / TBVP mới',
      tsTen: defaultAsset ? `${defaultAsset.ten} [${defaultAsset.id}]` : 'Thiết bị văn phòng',
      dvt: 'Bộ',
      slDat: 1,
      slNhan: 1,
      soLuong: 1,
      slTon: 1,
      gia: defaultAsset ? (defaultAsset.giaMuaGoc || defaultAsset.nguyenGia || 0) : 45000000,
      phi: 2000000,
      ts: defaultAsset ? defaultAsset.id : null,
      tsId: defaultAsset ? defaultAsset.id : undefined,
      pb: 'QLCL',
      viTriMoi: 'Phòng Quản lý Chất lượng - Tầng 3 TEDI Tower',
      nguoi: 'Phạm Thị Lan',
      soSerial: defaultAsset ? (defaultAsset.soHieuKyThuat || 'SN-2026-001') : 'SN-TEDI-9921',
      nhom: defaultAsset ? defaultAsset.nhom : 'Máy móc chuyên dùng',
      viTriHienTai: 'Kho Tổng TEDI B2',
      phanLoai: 'Tài sản cố định (TSCĐ)',
      ghiChu: 'Bàn giao thiết bị nguyên đai nguyên kiện, kèm đầy đủ phụ kiện gốc'
    };

    const newSlip: HandoverSlip = {
      id: newId,
      dx: 'DXMS/2026/0001',
      hopDong: 'HD/2026/014',
      ncu: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
      chuyenTu: 'Kho Tổng TEDI B2',
      chuyenDen: 'Phòng Quản lý Chất lượng (QLCL)',
      nghiemThu: 'Đạt',
      lyDoDieuChuyen: 'Nhận hàng từ nhà cung ứng và bàn giao trực tiếp cho đơn vị thụ hưởng theo HĐ',
      loaiPhieu: 'Nhận hàng & Bàn giao kho',
      nguoiYeuCau: 'Trần Văn Nam',
      nguoiXacNhanDC: 'Trần Thu Hà (Trưởng phòng QLTS)',
      nguoiTiepNhan: 'Phạm Thị Lan',
      ngayTao: nowDateTimeStr(),
      trangThai: 'Nháp',
      lines: [initialLine],
      attachments: [
        { id: `att-${Date.now()}`, name: `Bien_Ban_Kiem_Tra_KCS_${dStr}.pdf`, size: '850 KB', date: formatDMY(new Date().toISOString().split('T')[0]), type: 'PDF' }
      ]
    };

    addHandoverSlip(newSlip);
    setActiveSlipId(newId);
    setActiveTab('chitiet');
    addLog(`Tạo mới Phiếu bàn giao ${newId}`);
  };

  const handleUpdateCurrentSlipField = (field: keyof HandoverSlip, value: any) => {
    if (!currentSlip) return;
    const updated = { ...currentSlip, [field]: value };
    updateHandoverSlip(updated);
  };

  const handleUpdateLine = (lineId: string, field: keyof HandoverSlipLine, value: any) => {
    if (!currentSlip) return;
    const updatedLines = currentSlip.lines.map(l => {
      if (l.id !== lineId) return l;
      const updatedLine = { ...l, [field]: value };
      
      if (field === 'gia') {
        const numGia = Number(value) || 0;
        updatedLine.phanLoai = numGia >= 30000000 ? 'Tài sản cố định (TSCĐ)' : 'CCDC / Vật tư kho';
      }
      return updatedLine;
    });
    updateHandoverSlip({ ...currentSlip, lines: updatedLines });
  };

  const handleDeleteLine = (lineId: string) => {
    if (!currentSlip) return;
    if (currentSlip.lines.length <= 1) {
      alert('Phiếu bàn giao phải có ít nhất 1 dòng mặt hàng / tài sản!');
      return;
    }
    const updatedLines = currentSlip.lines.filter(l => l.id !== lineId);
    updateHandoverSlip({ ...currentSlip, lines: updatedLines });
  };

  const handleAddLineFromAsset = (assetId: string) => {
    if (!currentSlip) return;
    const asset = assetMasters.find(a => a.id === assetId);
    if (!asset) return;

    const isTscd = asset.nguyenGia >= 30000000;
    const newLine: HandoverSlipLine = {
      id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ten: asset.ten,
      tsTen: `${asset.ten} [${asset.id}]`,
      dvt: 'Bộ',
      slDat: 1,
      slNhan: 1,
      soLuong: 1,
      slTon: 1,
      gia: asset.giaMuaGoc || asset.nguyenGia || 0,
      phi: (asset.cuocVanChuyen || 0) + (asset.chiPhiChayThu || 0),
      ts: asset.id,
      tsId: asset.id,
      pb: asset.pbsd || currentSlip.chuyenDen || 'QLCL',
      viTriMoi: `Phòng ${asset.pbsd || 'QLCL'} - ${asset.nguoi || 'Quản lý'}`,
      nguoi: asset.nguoi || 'Cán bộ nhận',
      soSerial: asset.soHieuKyThuat || `SN-${asset.id.replace('/', '-')}`,
      nhom: asset.nhom || 'Máy móc thiết bị chuyên dùng',
      viTriHienTai: `Kho TBVP (Phòng ${asset.pbQuanLy || 'QLVP'})`,
      phanLoai: isTscd ? 'Tài sản cố định (TSCĐ)' : 'CCDC / Vật tư kho',
      ghiChu: `Bàn giao từ Sổ TSCĐ. Nguyên giá: ${formatVND(asset.nguyenGia)}`
    };

    updateHandoverSlip({
      ...currentSlip,
      lines: [...currentSlip.lines, newLine]
    });
    setShowAddAssetModal(false);
  };

  const handleAddLineFromSupply = (supplyTen: string) => {
    if (!currentSlip) return;
    const item = supplies.find(s => s.ten === supplyTen);
    if (!item) return;

    const newLine: HandoverSlipLine = {
      id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ten: item.ten,
      tsTen: item.ten,
      dvt: item.dvt || 'Cái',
      slDat: 1,
      slNhan: 1,
      soLuong: 1,
      slTon: item.ton,
      gia: 8500000,
      phi: 0,
      ts: null,
      pb: currentSlip.chuyenDen || 'QLVP',
      viTriMoi: currentSlip.chuyenDen ? `${currentSlip.chuyenDen}` : 'Phòng ban sử dụng',
      nguoi: currentSlip.nguoiTiepNhan || 'Cán bộ nhận',
      soSerial: `LÔ-${Date.now().toString().slice(-4)}`,
      nhom: 'Công cụ dụng cụ / Vật tư kho',
      viTriHienTai: 'Kho Tổng Vật tư & CCDC TEDI - Tầng B2',
      phanLoai: 'CCDC / Vật tư kho',
      ghiChu: 'Cấp phát theo định mức kho vật tư'
    };

    updateHandoverSlip({
      ...currentSlip,
      lines: [...currentSlip.lines, newLine]
    });
    setShowAddSupplyModal(false);
  };

  const handleAddBlankLine = () => {
    if (!currentSlip) return;
    const newLine: HandoverSlipLine = {
      id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ten: 'Hàng hóa / Thiết bị mới',
      tsTen: 'Hàng hóa / Thiết bị mới',
      dvt: 'Cái',
      slDat: 1,
      slNhan: 1,
      soLuong: 1,
      slTon: 1,
      gia: 15000000,
      phi: 500000,
      ts: null,
      pb: currentSlip.chuyenDen || 'QLVP',
      viTriMoi: currentSlip.chuyenDen || 'Phòng tiếp nhận',
      nguoi: currentSlip.nguoiTiepNhan || 'Cán bộ nhận',
      soSerial: 'SN-TEDI-2026',
      nhom: 'Thiết bị quản lý văn phòng',
      viTriHienTai: currentSlip.chuyenTu || 'Kho Tổng TEDI B2',
      phanLoai: 'CCDC / Vật tư kho',
      ghiChu: ''
    };
    updateHandoverSlip({
      ...currentSlip,
      lines: [...currentSlip.lines, newLine]
    });
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlip || !newAttName.trim()) return;

    const newAtt: HandoverAttachment = {
      id: `att-${Date.now()}`,
      name: newAttName.endsWith(`.${newAttType.toLowerCase()}`) ? newAttName : `${newAttName}.${newAttType.toLowerCase()}`,
      size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
      date: formatDMY(new Date().toISOString().split('T')[0]),
      type: newAttType
    };

    updateHandoverSlip({
      ...currentSlip,
      attachments: [...currentSlip.attachments, newAtt]
    });

    setNewAttName('');
    setShowAddAttachmentModal(false);
    addLog(`Đính kèm tệp ${newAtt.name} vào phiếu bàn giao ${currentSlip.id}`);
  };

  const handleDeleteAttachment = (attId: string) => {
    if (!currentSlip) return;
    const updated = currentSlip.attachments.filter(a => a.id !== attId);
    updateHandoverSlip({ ...currentSlip, attachments: updated });
  };

  const handleStageChange = (newStage: HandoverSlip['trangThai']) => {
    if (!currentSlip) return;
    updateHandoverSlip({ ...currentSlip, trangThai: newStage });
    addLog(`Cập nhật trạng thái phiếu bàn giao ${currentSlip.id} -> ${newStage}`);
  };

  const handlePrint = () => {
    if (!currentSlip) return;
    setPrintData({
      id: currentSlip.id,
      dx: currentSlip.dx,
      hopDong: currentSlip.hopDong,
      ncu: currentSlip.ncu,
      loai: currentSlip.loaiPhieu,
      ngay: currentSlip.ngayTao,
      ngayMua: currentSlip.ngayTao,
      chuyenTu: currentSlip.chuyenTu,
      chuyenDen: currentSlip.chuyenDen,
      nghiemThu: currentSlip.nghiemThu,
      lyDoDieuChuyen: currentSlip.lyDoDieuChuyen,
      nguoiYeuCau: currentSlip.nguoiYeuCau,
      nguoiXacNhanDC: currentSlip.nguoiXacNhanDC,
      nguoiTiepNhan: currentSlip.nguoiTiepNhan,
      lines: currentSlip.lines
    });
  };

  // Calculations for current slip summary
  const totalAmount = currentSlip ? currentSlip.lines.reduce((sum, l) => sum + (l.slNhan * (l.gia || 0) + (l.phi || 0)), 0) : 0;
  const totalQtyOrdered = currentSlip ? currentSlip.lines.reduce((sum, l) => sum + (l.slDat || 0), 0) : 0;
  const totalQtyReceived = currentSlip ? currentSlip.lines.reduce((sum, l) => sum + (l.slNhan || 0), 0) : 0;
  const totalExtraFees = currentSlip ? currentSlip.lines.reduce((sum, l) => sum + (l.phi || 0), 0) : 0;

  return (
    <div className="space-y-3 relative font-sans">
      {currentSlip ? (
        /* ========================================================================= */
        /* DETAIL VIEW: STANDALONE HANDOVER FORM SHEET                               */
        /* ========================================================================= */
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden animate-in fade-in duration-150">
          {/* Top Control Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                id="btn-back-to-list"
                onClick={() => setActiveSlipId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Danh sách phiếu</span>
              </button>

              <button
                type="button"
                id="btn-create-new-slip"
                onClick={handleCreateNewSlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo mới</span>
              </button>

              <button
                type="button"
                id="btn-save-slip"
                onClick={() => alert(`Đã lưu dữ liệu phiếu bàn giao ${currentSlip.id} thành công!`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-blue-700" />
                <span>Lưu thay đổi</span>
              </button>

              {currentSlip.trangThai !== 'Đã bàn giao' && currentSlip.trangThai !== 'Đã hoàn thành' && (
                <button
                  type="button"
                  id="btn-confirm-handover"
                  onClick={() => handleStageChange('Đã bàn giao')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-bold shadow-2xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Xác nhận Bàn giao</span>
                </button>
              )}

              <button
                type="button"
                id="btn-print-handover-slip"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded text-xs font-semibold shadow-2xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>In Biên bản A4 (BM QT02-2)</span>
              </button>
            </div>

            {/* Stage Pipeline Indicator */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded border border-slate-300">
              {(['Nháp', 'Chờ phê duyệt', 'Đã nhận hàng', 'Đã bàn giao', 'Đã hoàn thành'] as HandoverSlip['trangThai'][]).map((stage) => {
                const isActive = currentSlip.trangThai === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleStageChange(stage)}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Header Sheet */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pb-6 border-b border-slate-200">
              {/* Left Column: Core Receipt & Handover Header Info */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-bold text-slate-700">Mã số phiếu:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.id}
                      onChange={e => handleUpdateCurrentSlipField('id', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-blue-900 text-xs bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Ngày lập &amp; bàn giao:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.ngayTao}
                      onChange={e => handleUpdateCurrentSlipField('ngayTao', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Đề xuất liên quan (DX):</label>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={currentSlip.dx || ''}
                      placeholder="VD: DXMS/2026/0001"
                      onChange={e => handleUpdateCurrentSlipField('dx', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-mono"
                    />
                    {currentSlip.dx && (
                      <button
                        type="button"
                        onClick={() => onNavigate('dx', currentSlip.dx)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                        title="Mở đề xuất mua sắm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Hợp đồng mua sắm (HD):</label>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={currentSlip.hopDong || ''}
                      placeholder="VD: HD/2026/014"
                      onChange={e => handleUpdateCurrentSlipField('hopDong', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-mono"
                    />
                    {currentSlip.hopDong && (
                      <button
                        type="button"
                        onClick={() => onNavigate('hd')}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded border border-purple-200"
                        title="Mở phân hệ Hợp đồng"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Bên giao / Nhà cung cấp:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.ncu || currentSlip.chuyenTu}
                      placeholder="Tên nhà cung cấp hoặc phòng ban bàn giao..."
                      onChange={e => {
                        handleUpdateCurrentSlipField('ncu', e.target.value);
                        handleUpdateCurrentSlipField('chuyenTu', e.target.value);
                      }}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Custody, Acceptance and Reason */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Đơn vị / Phòng ban nhận:</label>
                  <div className="col-span-2">
                    <select
                      value={currentSlip.chuyenDen}
                      onChange={e => handleUpdateCurrentSlipField('chuyenDen', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-900 bg-white"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>
                          {d} — Phòng ban / Trung tâm thụ hưởng
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Nghiệm thu kỹ thuật (KCS):</label>
                  <div className="col-span-2">
                    <select
                      value={currentSlip.nghiemThu || 'Đạt'}
                      onChange={e => handleUpdateCurrentSlipField('nghiemThu', e.target.value)}
                      className={`w-full border rounded px-2.5 py-1 text-xs font-bold ${
                        currentSlip.nghiemThu === 'Đạt'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                          : currentSlip.nghiemThu === 'Đạt một phần'
                          ? 'border-amber-300 bg-amber-50 text-amber-900'
                          : 'border-rose-300 bg-rose-50 text-rose-900'
                      }`}
                    >
                      <option value="Đạt">Đạt tiêu chuẩn kỹ thuật &amp; chạy thử</option>
                      <option value="Đạt một phần">Đạt một phần (cần bổ sung tài liệu)</option>
                      <option value="Không đạt">Không đạt tiêu chuẩn KCS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Loại phiếu bàn giao:</label>
                  <div className="col-span-2">
                    <select
                      value={currentSlip.loaiPhieu}
                      onChange={e => handleUpdateCurrentSlipField('loaiPhieu', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white"
                    >
                      <option value="Nhận hàng & Bàn giao kho">Nhận hàng &amp; Bàn giao kho</option>
                      <option value="Bàn giao mua sắm mới">Bàn giao mua sắm mới</option>
                      <option value="Cấp phát CCDC">Cấp phát CCDC &amp; Vật tư</option>
                      <option value="Điều chuyển nội bộ">Điều chuyển nội bộ</option>
                      <option value="Thu hồi">Thu hồi tài sản</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Người bàn giao / Đề xuất:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.nguoiYeuCau}
                      onChange={e => handleUpdateCurrentSlipField('nguoiYeuCau', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Cán bộ tiếp nhận:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.nguoiTiepNhan}
                      onChange={e => handleUpdateCurrentSlipField('nguoiTiepNhan', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <label className="text-xs font-semibold text-slate-600">Lý do / Căn cứ:</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={currentSlip.lyDoDieuChuyen}
                      placeholder="Căn cứ hợp đồng / quyết định phê duyệt..."
                      onChange={e => handleUpdateCurrentSlipField('lyDoDieuChuyen', e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="mt-6 border-b border-slate-200 flex items-center gap-8">
              <button
                type="button"
                onClick={() => setActiveTab('chitiet')}
                className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                  activeTab === 'chitiet'
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Chi tiết mặt hàng nhận &amp; bàn giao ({currentSlip.lines.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dinhkem')}
                className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                  activeTab === 'dinhkem'
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Hồ sơ đính kèm &amp; Biên bản Scan ({currentSlip.attachments.length})</span>
              </button>
            </div>

            {/* =================================================================== */}
            {/* TAB 1: CHI TIẾT MẶT HÀNG NHẬN & BÀN GIAO                            */}
            {/* =================================================================== */}
            {activeTab === 'chitiet' && (
              <div className="pt-4 space-y-4">
                {/* Table Action Controls */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="btn-add-blank-line"
                      onClick={handleAddBlankLine}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-300 hover:bg-blue-100 text-blue-900 rounded text-xs font-semibold shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-700" />
                      <span>Thêm dòng mặt hàng</span>
                    </button>

                    <button
                      type="button"
                      id="btn-add-from-asset"
                      onClick={() => setShowAddAssetModal(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs"
                    >
                      <Box className="w-3.5 h-3.5 text-slate-600" />
                      <span>Chọn từ Sổ TSCĐ (MH6)</span>
                    </button>

                    <button
                      type="button"
                      id="btn-add-from-supply"
                      onClick={() => setShowAddSupplyModal(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold shadow-2xs"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-600" />
                      <span>Chọn từ Kho CCDC (MH5)</span>
                    </button>
                  </div>
                </div>

                {/* The Simplified Handover Lines Table */}
                <div className="border border-slate-300 rounded-md overflow-x-auto bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5 w-12 text-center">STT</th>
                        <th className="p-2.5 min-w-[240px]">Tên mặt hàng / Tài sản / CCDC</th>
                        <th className="p-2.5 w-24 text-center">ĐVT</th>
                        <th className="p-2.5 w-20 text-right">SL Đặt</th>
                        <th className="p-2.5 w-24 text-right bg-blue-50 text-blue-900">SL Giao</th>
                        <th className="p-2.5 w-32 text-right">Đơn giá (VNĐ)</th>
                        <th className="p-2.5 w-28 text-right">Chi phí phụ</th>
                        <th className="p-2.5 w-36 text-right bg-slate-50 font-bold">Thành tiền</th>
                        <th className="p-2.5 w-14 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentSlip.lines.map((line, idx) => {
                        const sl = line.slNhan || 0;
                        const gia = line.gia || 0;
                        const phi = line.phi || 0;
                        const lineTotal = sl * gia + phi;
                        const hasDiff = line.slDat !== undefined && line.slDat > 0 && line.slNhan !== line.slDat;

                        return (
                          <tr key={line.id} className="hover:bg-blue-50/20 transition-colors">
                            <td className="p-2.5 text-center font-mono text-slate-500">{idx + 1}</td>
                            
                            {/* Item Name */}
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={line.ten || line.tsTen || ''}
                                onChange={e => handleUpdateLine(line.id, 'ten', e.target.value)}
                                className="w-full border border-slate-200 hover:border-slate-400 focus:border-blue-500 rounded px-2.5 py-1 font-semibold text-slate-900 bg-white text-xs"
                                placeholder="Nhập tên tài sản / CCDC..."
                              />
                            </td>

                            {/* DVT */}
                            <td className="p-2.5 text-center">
                              <select
                                value={line.dvt}
                                onChange={e => handleUpdateLine(line.id, 'dvt', e.target.value)}
                                className="w-full border border-slate-200 rounded px-1.5 py-1 text-center text-xs bg-white"
                              >
                                {UNITS.map(u => (
                                  <option key={u} value={u}>{u}</option>
                                ))}
                              </select>
                            </td>

                            {/* SL Đặt */}
                            <td className="p-2.5 text-right">
                              <input
                                type="number"
                                min="0"
                                value={line.slDat}
                                onChange={e => handleUpdateLine(line.id, 'slDat', Number(e.target.value))}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-right font-mono text-xs"
                              />
                            </td>

                            {/* SL Nhận / Bàn giao */}
                            <td className="p-2.5 text-right bg-blue-50/50">
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  value={line.slNhan}
                                  onChange={e => {
                                    const val = Number(e.target.value);
                                    handleUpdateLine(line.id, 'slNhan', val);
                                    handleUpdateLine(line.id, 'soLuong', val);
                                  }}
                                  className={`w-full border rounded px-2 py-1 text-right font-mono font-bold text-xs ${
                                    hasDiff ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-blue-300 text-blue-950 bg-white'
                                  }`}
                                />
                                {hasDiff && (
                                  <span className="text-[9px] text-amber-700 block text-right font-medium">Lệch SL đặt!</span>
                                )}
                              </div>
                            </td>

                            {/* Đơn giá */}
                            <td className="p-2.5 text-right">
                              <input
                                type="number"
                                min="0"
                                step="10000"
                                value={line.gia}
                                onChange={e => handleUpdateLine(line.id, 'gia', Number(e.target.value))}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-right font-mono font-semibold text-xs text-slate-800"
                              />
                            </td>

                            {/* Chi phí phụ */}
                            <td className="p-2.5 text-right">
                              <input
                                type="number"
                                min="0"
                                step="50000"
                                value={line.phi}
                                onChange={e => handleUpdateLine(line.id, 'phi', Number(e.target.value))}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-right font-mono text-xs text-slate-600"
                              />
                            </td>

                            {/* Thành tiền */}
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900 bg-slate-50">
                              {formatVND(lineTotal)}
                            </td>

                            {/* Delete Button */}
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                title="Xóa dòng này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Summary Footer */}
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-slate-500 font-medium">Tổng SL đặt:</span>{' '}
                      <strong className="font-mono text-slate-900 font-bold">{totalQtyOrdered}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Tổng SL bàn giao:</span>{' '}
                      <strong className="font-mono text-blue-900 font-bold">{totalQtyReceived}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Tổng cước VC &amp; phụ phí:</span>{' '}
                      <strong className="font-mono text-slate-700">{formatVND(totalExtraFees)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">TỔNG GIÁ TRỊ BÀN GIAO:</span>
                    <span className="font-mono text-lg font-bold text-blue-950 bg-blue-100/70 px-3 py-1 rounded border border-blue-300">
                      {formatVND(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 2: HỒ SƠ ĐÍNH KÈM & BIÊN BẢN SCAN                              */}
            {/* =================================================================== */}
            {activeTab === 'dinhkem' && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 text-xs">
                    Danh sách tài liệu pháp lý, CO-CQ &amp; Biên bản nghiệm thu ({currentSlip.attachments.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddAttachmentModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải lên tài liệu mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSlip.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="border border-slate-200 hover:border-slate-300 rounded-lg p-3.5 bg-white shadow-2xs flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {att.type}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-xs truncate group-hover:text-blue-900">
                            {att.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {att.size} · Ngày tải: {att.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => alert(`Đang mở xem trước tài liệu: ${att.name}`)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-100"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Đang tải xuống tệp tin: ${att.name}`)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 rounded hover:bg-slate-100"
                          title="Tải về máy"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Xóa tệp đính kèm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* LIST VIEW: TỔNG HỢP DANH SÁCH CÁC PHIẾU BÀN GIAO & NHẬN HÀNG (ODOO STYLE)  */
        /* ========================================================================= */
        <div className="space-y-3">
          <OdooControlPanel
            title="Phiếu Bàn Giao &amp; Nhận Hàng Kho"
            itemCount={filteredSlips.length}
            onCreate={handleCreateNewSlip}
            onPrint={() => window.print()}
            searchPlaceholder="Tìm mã phiếu, nhà cung ứng, đề xuất, hợp đồng, tài sản..."
            onSearch={setSearchQuery}
            filterOptions={[
              { label: 'Tất cả trạng thái', value: 'all' },
              { label: 'Nháp', value: 'Nháp' },
              { label: 'Chờ phê duyệt', value: 'Chờ phê duyệt' },
              { label: 'Đã nhận hàng', value: 'Đã nhận hàng' },
              { label: 'Đã bàn giao', value: 'Đã bàn giao' },
              { label: 'Đã hoàn thành', value: 'Đã hoàn thành' }
            ]}
            onFilter={setFilterStatus}
          />

          {/* Filter Toolbar & Quick Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-slate-600">Loại phiếu:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'Nhận hàng & Bàn giao kho', label: 'Nhận hàng & Bàn giao kho' },
                  { id: 'Bàn giao mua sắm mới', label: 'Bàn giao mua sắm mới' },
                  { id: 'Cấp phát CCDC', label: 'Cấp phát CCDC' },
                  { id: 'Điều chuyển nội bộ', label: 'Điều chuyển nội bộ' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterType(tab.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      filterType === tab.id
                        ? 'bg-blue-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-create-new-slip-toolbar"
                onClick={handleCreateNewSlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lập Phiếu Bàn Giao Mới</span>
              </button>
            </div>
          </div>

          {/* Table List of Handover Slips */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3 w-12 text-center">STT</th>
                    <th className="p-3">Mã phiếu</th>
                    <th className="p-3">Ngày lập</th>
                    <th className="p-3">Loại phiếu</th>
                    <th className="p-3">Bên giao / Nhà cung cấp</th>
                    <th className="p-3">Đơn vị nhận</th>
                    <th className="p-3">Đề xuất / HĐ</th>
                    <th className="p-3 text-center">SL dòng</th>
                    <th className="p-3 text-right">Tổng giá trị (VND)</th>
                    <th className="p-3 text-center">KCS</th>
                    <th className="p-3 text-center">Trạng thái</th>
                    <th className="p-3 text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSlips.length > 0 ? (
                    filteredSlips.map((slip, index) => {
                      const totalVal = slip.lines.reduce((sum, l) => sum + (l.slNhan * (l.gia || 0) + (l.phi || 0)), 0);

                      let statusBadge = 'bg-slate-100 text-slate-700 border-slate-300';
                      if (slip.trangThai === 'Đã bàn giao' || slip.trangThai === 'Đã hoàn thành') {
                        statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                      } else if (slip.trangThai === 'Chờ phê duyệt' || slip.trangThai === 'Đã nhận hàng') {
                        statusBadge = 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
                      } else if (slip.trangThai === 'Nháp') {
                        statusBadge = 'bg-amber-50 text-amber-800 border-amber-300';
                      }

                      return (
                        <tr
                          key={slip.id}
                          onClick={() => {
                            setActiveSlipId(slip.id);
                            setActiveTab('chitiet');
                          }}
                          className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                        >
                          <td className="p-3 text-center font-mono text-slate-500">{index + 1}</td>
                          <td className="p-3 font-mono font-bold text-blue-900">{slip.id}</td>
                          <td className="p-3 font-mono text-slate-600">{slip.ngayTao}</td>
                          <td className="p-3 font-medium text-slate-800">{slip.loaiPhieu}</td>
                          <td className="p-3 font-medium text-slate-900 max-w-xs truncate">
                            {slip.ncu || slip.chuyenTu}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{slip.chuyenDen}</td>
                          <td className="p-3 font-mono text-slate-600 text-[11px]">
                            {slip.dx && <div>{slip.dx}</div>}
                            {slip.hopDong && <div className="text-purple-700 font-semibold">{slip.hopDong}</div>}
                            {!slip.dx && !slip.hopDong && <span className="text-slate-400">—</span>}
                          </td>
                          <td className="p-3 text-center font-mono font-semibold">{slip.lines.length}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            {formatVND(totalVal)}
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {slip.nghiemThu || 'Đạt'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] border ${statusBadge}`}>
                              {slip.trangThai}
                            </span>
                          </td>
                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveSlipId(slip.id);
                                  setActiveTab('chitiet');
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Mở chi tiết phiếu"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Bạn có chắc chắn muốn xóa phiếu bàn giao ${slip.id}?`)) {
                                    deleteHandoverSlip(slip.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Xóa phiếu"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-slate-400">
                        Không tìm thấy phiếu bàn giao nào phù hợp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CHỌN TỪ SỔ TSCĐ (MH6)                                            */}
      {/* ========================================================================= */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-sm">Chọn Tài Sản Cố Định Từ Sổ TSCĐ (MH6)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAssetModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {assetMasters.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => handleAddLineFromAsset(asset.id)}
                  className="border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{asset.ten}</div>
                    <div className="font-mono text-slate-500 text-[11px]">
                      Mã: {asset.id} · Phòng: {asset.pbsd} ({asset.nguoi})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-900">{formatVND(asset.nguyenGia)}</div>
                    <span className="text-[10px] text-slate-500 font-medium">Bấm để thêm dòng</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHỌN TỪ KHO CCDC & VẬT TƯ (MH5)                                  */}
      {/* ========================================================================= */}
      {showAddSupplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Chọn CCDC / Vật Tư Từ Kho (MH5)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSupplyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {supplies.map(supply => (
                <div
                  key={supply.ten}
                  onClick={() => handleAddLineFromSupply(supply.ten)}
                  className="border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{supply.ten}</div>
                    <div className="text-slate-500 text-[11px]">ĐVT: {supply.dvt} · Tồn kho: {supply.ton}</div>
                  </div>
                  <button
                    type="button"
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold shadow-2xs"
                  >
                    + Thêm vào phiếu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TẢI LÊN TÀI LIỆU ĐÍNH KÈM                                        */}
      {/* ========================================================================= */}
      {showAddAttachmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-sm">Đính Kèm Tài Liệu &amp; Biên Bản Scan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAttachmentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAttachment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên tài liệu / Biên bản:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bien_Ban_Nghiem_Thu_KCS_2026.pdf"
                  value={newAttName}
                  onChange={e => setNewAttName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Định dạng file:</label>
                <select
                  value={newAttType}
                  onChange={e => setNewAttType(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 bg-white text-xs"
                >
                  <option value="PDF">PDF (Văn bản scan / Hợp đồng)</option>
                  <option value="DOCX">DOCX (Biên bản soạn thảo)</option>
                  <option value="XLSX">XLSX (Bảng kê chi tiết)</option>
                  <option value="JPG">JPG / PNG (Ảnh chụp thiết bị)</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center text-slate-500 bg-slate-50">
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <span className="font-medium text-[11px]">Kéo thả file scan hoặc bấm để tải lên</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAttachmentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold shadow-2xs"
                >
                  Lưu đính kèm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT A4 MODAL (BM QT02-2 MẪU CHUẨN ISO TỔNG CÔNG TY TEDI) */}
      {printData && (
        <PrintA4Modal
          type="bm_qt02_2"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
