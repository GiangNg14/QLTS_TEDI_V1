import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkBudget, WorkBudgetItem, XdcbLoaiCV, XdcbTruongHop, XdcbStage } from '../../types';
import { formatVND, formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  Building2, Plus, ArrowUpRight, FileText, CheckCircle2, Clock, Wrench,
  Layers, Download, LayoutGrid, ChevronRight, Calendar, DollarSign,
  Tag, AlertTriangle, Trash2, ExternalLink, ShieldCheck, HardHat, FileSpreadsheet,
  AlertCircle, ArrowRight, Check, Send, Sparkles, Info, RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ConstructionBudgetScreenProps {
  selectedId?: string | null;
  onNavigate: (screen: string, id?: string) => void;
}

const STAGES: XdcbStage[] = [
  'Chờ phê duyệt',
  'Đã duyệt',
  'Đang thi công',
  'Nghiệm thu',
  'Quyết toán',
  'Bảo hành',
  'Đã hoàn thành'
];

export const ConstructionBudgetScreen: React.FC<ConstructionBudgetScreenProps> = ({ selectedId: propSelectedId, onNavigate }) => {
  const { workBudgets, addWorkBudget, updateWorkBudget, increaseAssetFromWorkBudget, assetMasters, addLog } = useApp();

  const [selectedId, setSelectedId] = useState<string | null>(propSelectedId || null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
  const [filterCase, setFilterCase] = useState<string>('Tất cả');
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);

  // Synchronize when propSelectedId changes
  React.useEffect(() => {
    if (propSelectedId !== undefined && propSelectedId !== null) {
      setSelectedId(propSelectedId);
    }
  }, [propSelectedId]);

  const currentBudgetIndex = workBudgets.findIndex(b => b.id === selectedId);
  const selectedBudget = currentBudgetIndex >= 0 ? workBudgets[currentBudgetIndex] : null;

  // Filter logic
  const filteredBudgets = workBudgets.filter(b => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tenHangMuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.nhaThau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.lyDo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Tất cả' || b.trangThai === filterStatus;
    const matchesCase = filterCase === 'Tất cả' || b.truongHop === filterCase;
    return matchesSearch && matchesStatus && matchesCase;
  });

  // Calculate totals for a budget
  const calculateBudgetTotals = (budget: WorkBudget) => {
    const parentLines = budget.lines.filter(l => !l.cha);
    const childLines = budget.lines.filter(l => l.cha);
    
    // Du toan total
    const duToanTotal = parentLines.length > 0 && childLines.length > 0
      ? childLines.reduce((s, l) => s + (l.kl * l.gia), 0)
      : budget.lines.reduce((s, l) => s + (l.kl * l.gia), 0);

    // Quyet toan total
    let quyetToanTotal = 0;
    if (budget.quyetToan && budget.quyetToan > 0) {
      quyetToanTotal = budget.quyetToan;
    } else {
      const sumTt = childLines.length > 0
        ? childLines.reduce((s, l) => s + ((l.klThucTe !== undefined && l.giaThucTe !== undefined) ? (l.klThucTe * l.giaThucTe) : (l.kl * l.gia)), 0)
        : budget.lines.reduce((s, l) => s + ((l.klThucTe !== undefined && l.giaThucTe !== undefined) ? (l.klThucTe * l.giaThucTe) : (l.kl * l.gia)), 0);
      quyetToanTotal = sumTt;
    }

    const diff = quyetToanTotal - duToanTotal;
    return { duToanTotal, quyetToanTotal, diff };
  };

  const getBudgetDisplayTotal = (budget: WorkBudget) => {
    const { duToanTotal, quyetToanTotal } = calculateBudgetTotals(budget);
    return budget.quyetToan && budget.quyetToan > 0 ? quyetToanTotal : (budget.tongDuToan || duToanTotal);
  };

  // Create new budget
  const handleCreateNew = () => {
    const newId = `DT/2026/${String(workBudgets.length + 1).padStart(4, '0')}`;
    const newBudget: WorkBudget = {
      id: newId,
      ngay: '2026-08-18',
      loaiCV: 'Cải tạo',
      truongHop: 'Nâng cấp TS cũ',
      hangMuc: 'TS/2026/0001',
      hangMucTS: 'TS/2026/0001',
      tenHangMuc: 'Cải tạo & Nâng cấp Hệ thống Hạ tầng TEDI',
      lyDo: 'Lập dự toán thi công nâng cấp kết cấu và công năng công trình phục vụ vận hành',
      donViDeXuat: 'Phòng Quản lý Văn phòng',
      nguoiDeXuat: 'Trần Thu Hà',
      tongDuToan: 150000000,
      thamQuyenDuyet: 'Tổng Giám đốc (≤ Y)',
      nhaThau: 'Công ty CP Xây dựng TEDI-Build',
      hopDong: `HĐ-XDCB/2026/${String(workBudgets.length + 1).padStart(3, '0')}`,
      ngayKyHD: '2026-08-20',
      giaTriHD: 150000000,
      ngayKhoiCong: '2026-08-25',
      ngayDuKienXong: '2026-10-15',
      ngayXong: '',
      tienDoThiCong: 0,
      nhatKyThiCong: [],
      quyetToan: 0,
      fastStatus: 'Chưa gửi',
      fastLoaiGhiNhan: 'Ghi tăng nguyên giá TS cũ',
      baoHanh: '12 tháng',
      noiDungBH: 'Bảo hành kết cấu và chống thấm theo hợp đồng',
      yeuCauBaoHanhLichSu: [],
      trangThai: 'Chờ phê duyệt',
      lines: [
        { id: 'A', cha: null, ten: 'I. Gia cố kết cấu & Phần thô', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
        { id: 'A1', cha: 'A', ten: 'Đục tẩy lớp bê tông phong hóa & vệ sinh bề mặt', dvt: 'm²', kl: 150, gia: 85000, klThucTe: 150, giaThucTe: 85000 },
        { id: 'A2', cha: 'A', ten: 'Đổ bê tông gia cố M250 dày 10cm', dvt: 'm³', kl: 15, gia: 1650000, klThucTe: 15, giaThucTe: 1650000 },
        { id: 'B', cha: null, ten: 'II. Hoàn thiện & Chống thấm chuyên dụng', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
        { id: 'B1', cha: 'B', ten: 'Quét 3 lớp màng chống thấm polyurethane đàn hồi', dvt: 'm²', kl: 150, gia: 285000, klThucTe: 150, giaThucTe: 285000 },
        { id: 'B2', cha: 'B', ten: 'Láng vữa bảo vệ M100 tạo dốc thoát nước', dvt: 'm²', kl: 150, gia: 95000, klThucTe: 150, giaThucTe: 95000 }
      ]
    };
    addWorkBudget(newBudget);
    setSelectedId(newId);
  };

  // Save budget changes
  const handleSaveBudget = (updated: WorkBudget) => {
    // Recalculate totals
    const { duToanTotal } = calculateBudgetTotals(updated);
    const finalized = { ...updated, tongDuToan: duToanTotal };
    updateWorkBudget(finalized);
    addLog(`Cập nhật dự toán công trình ${updated.id}`);
  };

  // Update budget status
  const handleStatusChange = (status: XdcbStage) => {
    if (!selectedBudget) return;
    const updated = { ...selectedBudget, trangThai: status };
    if (status === 'Đã duyệt' && !updated.ngayDuyet) {
      updated.ngayDuyet = '2026-08-18';
      updated.nguoiDuyet = 'Nguyễn Đức Thắng (Tổng Giám đốc)';
    }
    if (status === 'Nghiệm thu' && !updated.ngayNghiemThu) {
      updated.ngayNghiemThu = '2026-08-18';
      updated.danhGiaNghiemThu = 'Đạt yêu cầu kỹ thuật';
      updated.bienBanNghiemThuSo = `BBNT-${updated.id.replace('/', '-')}`;
      updated.hoiDongNghiemThu = 'Hội đồng Nghiệm thu TEDI';
    }
    if (status === 'Quyết toán' && (!updated.quyetToan || updated.quyetToan === 0)) {
      const { quyetToanTotal, diff } = calculateBudgetTotals(updated);
      updated.quyetToan = quyetToanTotal;
      updated.ngayQuyetToan = '2026-08-18';
      updated.chenhLechQuyetToan = diff;
    }
    handleSaveBudget(updated);
  };

  // Execute FAST Synchronization (Gửi FAST ghi tăng TS cũ hoặc tạo mới TS)
  const handleSyncToFast = () => {
    if (!selectedBudget) return;
    const isNew = selectedBudget.truongHop === 'Xây dựng hạng mục mới';
    increaseAssetFromWorkBudget(selectedBudget.id, isNew ? undefined : selectedBudget.hangMuc);
    const { quyetToanTotal } = calculateBudgetTotals(selectedBudget);

    if (isNew) {
      alert(`Đã gửi dữ liệu sang FAST thành công!\n- Loại: Ghi tăng tài sản mới (TK 2112/2113)\n- Tên tài sản: ${selectedBudget.tenHangMuc}\n- Nguyên giá: ${formatVND(quyetToanTotal)}\n- FAST đã lập bảng trích khấu hao từ đầu (120 tháng).`);
    } else {
      alert(`Đã gửi dữ liệu sang FAST thành công!\n- Loại: Ghi tăng nguyên giá TSCĐ cũ [${selectedBudget.hangMuc}]\n- Giá trị ghi tăng: +${formatVND(quyetToanTotal)}\n- FAST đã tự động tính lại mức trích khấu hao hàng tháng cho các kỳ còn lại.`);
    }
  };

  // Export CSV
  const handleExportExcel = () => {
    const csvHeader = 'Mã dự toán,Hạng mục công trình,Loại CV,Trường hợp,Tài sản liên quan,Nhà thầu,Số HĐ,Dự toán (VND),Quyết toán (VND),Trạng thái,Đồng bộ FAST\n';
    const csvRows = filteredBudgets.map(b => {
      const { duToanTotal, quyetToanTotal } = calculateBudgetTotals(b);
      return `"${b.id}","${b.tenHangMuc}","${b.loaiCV}","${b.truongHop}","${b.hangMuc || 'Xây mới'}","${b.nhaThau}","${b.hopDong}","${duToanTotal}","${quyetToanTotal}","${b.trangThai}","${b.fastStatus || 'Chưa gửi'}"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Du_toan_XDCB_TEDI_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: XdcbStage) => {
    switch (status) {
      case 'Nháp':
      case 'Chờ phê duyệt':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Đã duyệt':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Đang thi công':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'Nghiệm thu':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Quyết toán':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Bảo hành':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Đã hoàn thành':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {!selectedBudget && (
        <>
          {/* 1. Odoo Control Panel */}
          <OdooControlPanel
            title="Quản lý Hạng mục Xây dựng Cơ bản & Cải tạo (QT-08)"
            breadcrumbs={['TÀI SẢN', 'DỰ TOÁN XDCB & CẢI TẠO (MH12)']}
            searchPlaceholder="Tìm mã DT, hạng mục công trình, nhà thầu..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filterOptions={[
              { label: 'Tất cả trạng thái', value: 'Tất cả' },
              { label: 'Chờ phê duyệt', value: 'Chờ phê duyệt' },
              { label: 'Đã duyệt', value: 'Đã duyệt' },
              { label: 'Đang thi công', value: 'Đang thi công' },
              { label: 'Nghiệm thu', value: 'Nghiệm thu' },
              { label: 'Quyết toán', value: 'Quyết toán' },
              { label: 'Bảo hành', value: 'Bảo hành' },
              { label: 'Đã hoàn thành', value: 'Đã hoàn thành' }
            ]}
            filterValue={filterStatus}
            onFilterChange={setFilterStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCreateNew={handleCreateNew}
            onExportExcel={handleExportExcel}
          />

      {/* 2. Main Views: List or Kanban */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageBudgets = filteredBudgets.filter(b => b.trangThai === stage);
            const stageTotal = stageBudgets.reduce((s, b) => s + getBudgetDisplayTotal(b), 0);

            return (
              <div key={stage} className="bg-slate-100/80 rounded-lg border border-slate-200/80 p-2.5 flex flex-col min-w-[250px] h-full shadow-2xs">
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs uppercase tracking-tight text-slate-700">{stage}</span>
                    <span className="text-[10px] font-mono font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                      {stageBudgets.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">
                    {stageTotal > 0 ? formatVND(stageTotal) : '0 ₫'}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-0.5">
                  {stageBudgets.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-md bg-white/50">
                      Không có công trình
                    </div>
                  ) : (
                    stageBudgets.map(b => {
                      const total = getBudgetDisplayTotal(b);
                      const isNewAsset = b.truongHop === 'Xây dựng hạng mục mới';

                      return (
                        <div
                          key={b.id}
                          onClick={() => {
                            setSelectedId(b.id);
                          }}
                          className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group relative"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="font-mono text-[11px] font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                              {b.id}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getStatusBadge(b.trangThai)}`}>
                              {b.loaiCV}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mb-1.5 group-hover:text-blue-900 transition-colors">
                            {b.tenHangMuc}
                          </h4>

                          {/* Case Badge */}
                          <div className="mb-2">
                            {isNewAsset ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                                <Sparkles className="w-2.5 h-2.5 text-purple-600" /> Xây mới (Tạo TSCĐ mới)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" /> Nâng cấp TS [{b.hangMuc || b.hangMucTS}]
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-500 mb-2">
                            <div className="truncate flex items-center gap-1 text-slate-600">
                              <HardHat className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{b.nhaThau || 'Chưa chỉ định nhà thầu'}</span>
                            </div>
                            <div className="flex items-center justify-between font-mono pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400">
                                {b.quyetToan && b.quyetToan > 0 ? 'Quyết toán:' : 'Dự toán:'}
                              </span>
                              <span className="font-extrabold text-xs text-emerald-800">{formatVND(total)}</span>
                            </div>
                          </div>

                          {/* Progress bar if ongoing */}
                          {b.trangThai === 'Đang thi công' && (
                            <div className="mb-2">
                              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5 font-mono">
                                <span>Tiến độ thi công</span>
                                <span className="font-bold text-blue-700">{b.tienDoThiCong || 0}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${b.tienDoThiCong || 0}%` }}></div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                            <span className="font-mono">BH: {b.baoHanh || '12T'}</span>
                            <span className="text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                              Xem chi tiết <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider text-left">
                  <th className="p-3 text-center w-12">STT</th>
                  <th className="p-3">Mã dự toán</th>
                  <th className="p-3">Hạng mục công trình</th>
                  <th className="p-3">Loại CV &amp; Trường hợp</th>
                  <th className="p-3">Tài sản thụ hưởng</th>
                  <th className="p-3">Nhà thầu thi công</th>
                  <th className="p-3 text-right">Dự toán / Quyết toán</th>
                  <th className="p-3">Hợp đồng</th>
                  <th className="p-3 text-center">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      Không tìm thấy công trình XDCB nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((b, index) => {
                    const total = getBudgetDisplayTotal(b);
                    return (
                      <tr
                        key={b.id}
                        onClick={() => {
                          setSelectedId(b.id);
                        }}
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="p-3 text-center font-mono text-slate-400 text-[11px]">{index + 1}</td>
                        <td className="p-3 font-mono font-bold text-blue-900">{b.id}</td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs">
                          <div className="line-clamp-1">{b.tenHangMuc}</div>
                          {b.lyDo && <div className="text-[10px] text-slate-500 line-clamp-1 font-normal">{b.lyDo}</div>}
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded border text-[10px] font-semibold bg-slate-50 text-slate-700 border-slate-200 inline-block">
                              {b.loaiCV}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              {b.truongHop === 'Xây dựng hạng mục mới' ? (
                                <span className="text-purple-700 font-medium">✨ Xây mới (Tạo TSCĐ)</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">⬆ Nâng cấp TS cũ</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-700">
                          {b.hangMuc || b.hangMucTS ? (
                            <span className="font-bold text-blue-900">{b.hangMuc || b.hangMucTS}</span>
                          ) : (
                            <span className="text-slate-400 italic">(Tạo TSCĐ mới)</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-700 max-w-xs truncate">{b.nhaThau || '—'}</td>
                        <td className="p-3 text-right font-mono font-extrabold text-emerald-800">
                          {formatVND(total)}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{b.hopDong || '—'}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getStatusBadge(b.trangThai)}`}>
                            {b.trangThai}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(b.id);
                            }}
                            className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded text-[11px] font-bold border border-blue-200 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filteredBudgets.length > 0 && (
                <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-xs text-slate-700">
                  <tr>
                    <td colSpan={6} className="p-3 text-right font-bold text-slate-600">
                      Tổng cộng ({filteredBudgets.length} hạng mục công trình):
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-emerald-800 text-sm">
                      {formatVND(filteredBudgets.reduce((s, b) => s + getBudgetDisplayTotal(b), 0))}
                    </td>
                    <td colSpan={3} className="p-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
      </>
    )}

      {/* 4. Odoo Form Sheet Detail View for Selected XDCB Budget */}
      {selectedBudget && (
        <OdooFormSheet
          category="TÀI SẢN / DỰ TOÁN XDCB & CẢI TẠO (QT-08)"
          title={`Hồ sơ XDCB / Cải tạo Công trình: ${selectedBudget.id}`}
          subtitle={`${selectedBudget.tenHangMuc} (${selectedBudget.truongHop})`}
          stages={STAGES}
          currentStageId={selectedBudget.trangThai}
          currentStage={selectedBudget.trangThai}
          onStageSelect={(s) => handleStatusChange(s as XdcbStage)}
          onStageChange={(s) => handleStatusChange(s as XdcbStage)}
          onNew={handleCreateNew}
          onBack={() => setSelectedId(null)}
          onClose={() => setSelectedId(null)}
          onSave={() => handleSaveBudget(selectedBudget)}
          currentIndex={currentBudgetIndex + 1}
          totalItems={workBudgets.length}
          onPrev={() => currentBudgetIndex > 0 && setSelectedId(workBudgets[currentBudgetIndex - 1].id)}
          onNext={() => currentBudgetIndex < workBudgets.length - 1 && setSelectedId(workBudgets[currentBudgetIndex + 1].id)}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sync to FAST button */}
              {(selectedBudget.trangThai === 'Quyết toán' || selectedBudget.trangThai === 'Bảo hành' || selectedBudget.trangThai === 'Đã hoàn thành') && (
                <button
                  onClick={handleSyncToFast}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {selectedBudget.truongHop === 'Xây dựng hạng mục mới'
                    ? `Ghi tăng TSCĐ mới trên FAST (${formatVND(getBudgetDisplayTotal(selectedBudget))})`
                    : `Ghi tăng nguyên giá TSCĐ cũ trên FAST (${formatVND(getBudgetDisplayTotal(selectedBudget))})`}
                </button>
              )}

              {/* Print A4 */}
              <button
                onClick={() => setPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                In A4 (BM-XDCB / QT-08)
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Header Metrics Box */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Mã phiếu &amp; Loại:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedBudget.id}</span>
                <span className="text-[10px] text-slate-500 block">{selectedBudget.loaiCV}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tổng Dự toán / Quyết toán:</span>
                <span className="font-mono font-extrabold text-emerald-800 text-sm">
                  {formatVND(getBudgetDisplayTotal(selectedBudget))}
                </span>
                {selectedBudget.chenhLechQuyetToan !== undefined && selectedBudget.quyetToan > 0 && (
                  <span className={`text-[10px] font-bold block ${selectedBudget.chenhLechQuyetToan <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedBudget.chenhLechQuyetToan <= 0
                      ? `Tiết kiệm ${formatVND(Math.abs(selectedBudget.chenhLechQuyetToan))}`
                      : `Vượt dự toán +${formatVND(selectedBudget.chenhLechQuyetToan)}`}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Trường hợp thụ hưởng:</span>
                <span className="font-bold text-slate-900 block">
                  {selectedBudget.truongHop === 'Xây dựng hạng mục mới' ? '✨ Xây dựng hạng mục mới' : '⬆ Nâng cấp TS cũ'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {selectedBudget.hangMuc ? `Mã TS: ${selectedBudget.hangMuc}` : '(Chưa có trên sổ)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Đồng bộ phần mềm FAST:</span>
                <span className={`font-bold inline-block px-2 py-0.5 rounded text-[10px] mt-0.5 ${
                  selectedBudget.fastStatus === 'Đã ghi sổ FAST'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                }`}>
                  {selectedBudget.fastStatus || 'Chưa gửi'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  BH: {selectedBudget.baoHanh || '12 tháng'}
                </span>
              </div>
            </div>

            {/* Header Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-white p-4 border border-slate-200 rounded-lg">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tên công trình / Hạng mục XDCB (*)</label>
                  <input
                    type="text"
                    value={selectedBudget.tenHangMuc}
                    onChange={(e) => handleSaveBudget({ ...selectedBudget, tenHangMuc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Loại công việc (*)</label>
                    <select
                      value={selectedBudget.loaiCV}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, loaiCV: e.target.value as XdcbLoaiCV })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                    >
                      <option value="Sửa chữa lớn">Sửa chữa lớn</option>
                      <option value="Nâng cấp">Nâng cấp</option>
                      <option value="Cải tạo">Cải tạo</option>
                      <option value="Xây mới">Xây mới</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Trường hợp hạch toán (*)</label>
                    <select
                      value={selectedBudget.truongHop}
                      onChange={(e) => {
                        const val = e.target.value as XdcbTruongHop;
                        const fastLoai = val === 'Xây dựng hạng mục mới' ? 'Ghi tăng tài sản mới' : 'Ghi tăng nguyên giá TS cũ';
                        handleSaveBudget({
                          ...selectedBudget,
                          truongHop: val,
                          hangMuc: val === 'Xây dựng hạng mục mới' ? '' : (selectedBudget.hangMuc || assetMasters[0]?.id || ''),
                          fastLoaiGhiNhan: fastLoai
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-blue-900"
                    >
                      <option value="Nâng cấp TS cũ">Trường hợp 1 — Nâng cấp TS cũ</option>
                      <option value="Xây dựng hạng mục mới">Trường hợp 2 — Xây dựng hạng mục mới</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Tài sản cố định liên quan {selectedBudget.truongHop === 'Nâng cấp TS cũ' ? '(*)' : '(Để trống nếu xây mới)'}
                  </label>
                  {selectedBudget.truongHop === 'Nâng cấp TS cũ' ? (
                    <select
                      value={selectedBudget.hangMuc}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, hangMuc: e.target.value, hangMucTS: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono font-medium"
                    >
                      <option value="">-- Chọn tài sản cố định cần nâng cấp --</option>
                      {assetMasters.map(a => (
                        <option key={a.id} value={a.id}>{a.id} - {a.ten} (Nguyên giá: {formatVND(a.nguyenGia)})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 border border-dashed border-slate-300 bg-slate-50 text-slate-500 rounded font-italic text-xs">
                      ✨ Chưa có trên sổ sách. Sau khi nghiệm thu quyết toán, FAST sẽ tạo mã tài sản mới (TK 2112/2113) và lập bảng khấu hao từ đầu.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Lý do &amp; Phạm vi thực hiện (*)</label>
                  <textarea
                    rows={2}
                    value={selectedBudget.lyDo}
                    onChange={(e) => handleSaveBudget({ ...selectedBudget, lyDo: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Đơn vị đề xuất</label>
                    <input
                      type="text"
                      value={selectedBudget.donViDeXuat || ''}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, donViDeXuat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Người đề xuất</label>
                    <input
                      type="text"
                      value={selectedBudget.nguoiDeXuat || ''}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, nguoiDeXuat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nhà thầu thi công</label>
                    <input
                      type="text"
                      value={selectedBudget.nhaThau}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, nhaThau: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Số Hợp đồng &amp; Giá trị</label>
                    <input
                      type="text"
                      value={selectedBudget.hopDong}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, hopDong: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Thẩm quyền phê duyệt dự toán</label>
                    <select
                      value={selectedBudget.thamQuyenDuyet || 'Tổng Giám đốc (≤ Y)'}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, thamQuyenDuyet: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800"
                    >
                      <option value="Trưởng phòng (≤ X)">Trưởng phòng duyệt (≤ X)</option>
                      <option value="Tổng Giám đốc (≤ Y)">Tổng Giám đốc duyệt (≤ Y)</option>
                      <option value="HĐQT (> Y)">HĐQT phê duyệt (&gt; Y)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Thời hạn bảo hành nhà thầu</label>
                    <input
                      type="text"
                      value={selectedBudget.baoHanh}
                      onChange={(e) => handleSaveBudget({ ...selectedBudget, baoHanh: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                      placeholder="VD: 12 tháng, 24 tháng"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nội dung cam kết bảo hành</label>
                  <input
                    type="text"
                    value={selectedBudget.noiDungBH}
                    onChange={(e) => handleSaveBudget({ ...selectedBudget, noiDungBH: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cam kết không ngấm dột, nứt tách..."
                  />
                </div>
              </div>
            </div>

          </div>
        </OdooFormSheet>
      )}

      {/* 5. Print Modal */}
      {printModalOpen && selectedBudget && (
        <PrintA4Modal
          type="workbudget"
          data={selectedBudget}
          onClose={() => setPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
