import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetMaster, AssetTransferRecord, IncidentReport, MaintenanceTask } from '../../types';
import { formatVND, formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  CheckCircle2, Printer, Edit3, ArrowRight, Save, Menu,
  ArrowRightLeft, Wrench, ShieldCheck, FileText, Plus, UploadCloud,
  Download, Trash2, Eye, Calendar, Clock, AlertTriangle, CheckCircle,
  FileCheck, RefreshCw, FolderPlus, Layers, Search, Filter, X, ExternalLink,
  Code, Sparkles, Laptop
} from 'lucide-react';

interface AssetScreenProps {
  selectedId: string | null;
  onNavigate: (screen: string, id?: string) => void;
}

export interface AssetDocument {
  id: string;
  name: string;
  category: 'Biên bản giao nhận' | 'Hóa đơn / Hợp đồng' | 'Hồ sơ kỹ thuật / Catalog' | 'Giấy kiểm định / CO-CQ' | 'Nhật ký bảo trì' | 'Khác';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'DWG' | 'IMG';
  size: string;
  uploadDate: string;
  uploader: string;
  verified: boolean;
  notes?: string;
}

const ASSET_GROUPS = [
  'Máy móc, thiết bị chuyên dùng',
  'Phương tiện vận tải, hạ tầng',
  'Phần mềm chuyên dùng',
  'Hạng mục xây dựng cơ bản (sửa chữa, cải tạo)'
] as const;

const getEffectiveAssetGroup = (nhom?: string): string => {
  if (!nhom) return 'Máy móc, thiết bị chuyên dùng';
  if (ASSET_GROUPS.includes(nhom as any)) return nhom;
  const lower = nhom.toLowerCase();
  if (lower.includes('phần mềm') || lower.includes('software') || nhom === 'PM') {
    return 'Phần mềm chuyên dùng';
  }
  if (lower.includes('phương tiện') || lower.includes('vận tải') || lower.includes('xe') || nhom === 'PTVT' || lower.includes('hạ tầng')) {
    return 'Phương tiện vận tải, hạ tầng';
  }
  if (lower.includes('xây dựng') || lower.includes('sửa chữa') || lower.includes('cải tạo') || lower.includes('xdcb')) {
    return 'Hạng mục xây dựng cơ bản (sửa chữa, cải tạo)';
  }
  return 'Máy móc, thiết bị chuyên dùng';
};

export const AssetScreen: React.FC<AssetScreenProps> = ({ selectedId, onNavigate }) => {
  const {
    assetMasters, config, addAssetMaster, updateAssetMaster, confirmAssetMaster,
    overrideAssetClassification, addLog,
    transfers, addTransfer, updateTransfer,
    incidents, addIncident, updateIncident, updateIncidentStatus,
    maintenanceTasks, addMaintenanceTask, updateMaintenanceTask, updateMaintenanceStatus,
    workBudgets
  } = useApp();

  const [activeAssetId, setActiveAssetId] = useState<string | null>(selectedId || null);

  useEffect(() => {
    if (selectedId) {
      setActiveAssetId(selectedId);
    }
  }, [selectedId]);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printModalData, setPrintModalData] = useState<any | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideType, setOverrideType] = useState<string>('TSCĐ Vô hình');
  const [overrideReason, setOverrideReason] = useState('Đánh giá theo quy định chuyên môn TEDI');
  
  // 4 requested tabs: 'dieu_chuyen', 'sua_chua', 'bao_duong', 'tai_lieu'
  const [activeTab, setActiveTab] = useState<'dieu_chuyen' | 'sua_chua' | 'bao_duong' | 'tai_lieu'>('dieu_chuyen');

  // Modals for sub-actions
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    denPB: 'QLCL',
    denNguoi: 'Phạm Thị Lan',
    lyDo: 'Điều chuyển phục vụ dự án mới',
    soQuyetDinh: 'QĐ-125/2026/TEDI',
    viTriMoi: 'Phòng Thí nghiệm hiện trường',
    doiTuongChiPhiMoi: 'Dự án Cầu Sông Hồng',
    loaiDieuChuyen: 'Nội bộ (Cùng pháp nhân)' as const
  });

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    nguoiBao: 'Cán bộ vận hành',
    mucDo: 'Trung bình' as 'Thấp' | 'Trung bình' | 'Nghiêm trọng',
    moTa: '',
    hinhThuc: 'Thuê ngoài',
    donVi: 'Đơn vị bảo hành / Sửa chữa ủy quyền',
    chiPhi: 0
  });

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    loai: 'Bảo dưỡng' as 'Kiểm định' | 'Hiệu chỉnh' | 'Bảo dưỡng',
    hinhThuc: 'Thuê ngoài' as 'Tự thực hiện' | 'Thuê ngoài',
    chuKyLoai: 'Chu kỳ cố định' as 'Chu kỳ cố định' | 'Khuyến cáo NSX',
    chuKy: 12,
    nsx: 'Khuyến cáo định kỳ từ NSX',
    doi: 'Trung tâm kiểm định & hiệu chuẩn',
    chiPhi: 2500000,
    kq: 'Đạt tiêu chuẩn kỹ thuật'
  });

  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [docUploadForm, setDocUploadForm] = useState({
    name: '',
    category: 'Hồ sơ kỹ thuật / Catalog' as AssetDocument['category'],
    fileType: 'PDF' as AssetDocument['fileType'],
    size: '2.4 MB',
    uploader: 'Ban QLTB TEDI',
    notes: 'Hồ sơ lưu trữ điện tử gốc'
  });

  const [selectedDocPreview, setSelectedDocPreview] = useState<AssetDocument | null>(null);

  // Per-asset documents store in local state
  const [assetDocumentsMap, setAssetDocumentsMap] = useState<Record<string, AssetDocument[]>>({
    'TS/2026/0001': [
      { id: 'DOC-01', name: 'Bien_Ban_Ban_Giao_Nhan_TS_2026_0001.pdf', category: 'Biên bản giao nhận', fileType: 'PDF', size: '1.4 MB', uploadDate: '2026-08-01', uploader: 'Trần Thu Hà', verified: true, notes: 'Biên bản 11 cột BM QT02-2 đã có đủ chữ ký lãnh đạo và bên nhận' },
      { id: 'DOC-02', name: 'Hoa_Don_VAT_Va_Hop_Dong_Mua_Sam.pdf', category: 'Hóa đơn / Hợp đồng', fileType: 'PDF', size: '850 KB', uploadDate: '2026-08-01', uploader: 'Kế toán Linh', verified: true, notes: 'Hóa đơn điện tử số 0048291 kèm hợp đồng HD/2026/014' },
      { id: 'DOC-03', name: 'Catalog_Thong_So_Ky_Thuat_Va_HDSD_Ricoh.pdf', category: 'Hồ sơ kỹ thuật / Catalog', fileType: 'PDF', size: '4.8 MB', uploadDate: '2026-08-02', uploader: 'Kỹ thuật viên Nam', verified: true, notes: 'Sổ tay hướng dẫn vận hành và sơ đồ bảo dưỡng Ricoh MP' },
      { id: 'DOC-04', name: 'Chung_Nhan_Xuat_Xuong_CO_CQ.pdf', category: 'Giấy kiểm định / CO-CQ', fileType: 'PDF', size: '1.2 MB', uploadDate: '2026-08-01', uploader: 'NCU Minh Long', verified: true, notes: 'Chứng nhận chất lượng và xuất xứ linh kiện chính hãng' },
      { id: 'DOC-05', name: 'So_Theo_Doi_Bao_Tri_Dinh_Ky.docx', category: 'Nhật ký bảo trì', fileType: 'DOCX', size: '420 KB', uploadDate: '2026-08-03', uploader: 'Tổ kỹ thuật QLVP', verified: false, notes: 'Nhật ký bảo trì định kỳ 6 tháng/lần' }
    ],
    'TS/2024/0007': [
      { id: 'DOC-11', name: 'Bien_Ban_Ban_Giao_Nhan_Leica_TS07.pdf', category: 'Biên bản giao nhận', fileType: 'PDF', size: '1.6 MB', uploadDate: '2024-05-10', uploader: 'Phạm Thị Lan', verified: true, notes: 'Biên bản giao nhận bàn giao thiết bị đo đạc chuyên dụng' },
      { id: 'DOC-12', name: 'Giay_Kiem_Dinh_Hieu_Chuan_Leica.pdf', category: 'Giấy kiểm định / CO-CQ', fileType: 'PDF', size: '2.1 MB', uploadDate: '2025-08-30', uploader: 'Leica VN', verified: true, notes: 'Tem kiểm định hiệu chuẩn đo lường còn hạn 24 tháng' },
      { id: 'DOC-13', name: 'Huong_Dan_Su_Dung_Toan_Dac_Leica.pdf', category: 'Hồ sơ kỹ thuật / Catalog', fileType: 'PDF', size: '6.5 MB', uploadDate: '2024-05-12', uploader: 'Phòng QLCL', verified: true, notes: 'Tài liệu hướng dẫn sử dụng tiếng Việt và sơ đồ chân máy' },
      { id: 'DOC-14', name: 'Ho_So_Bao_Tri_Va_Su_Co_Hien_Truong.docx', category: 'Nhật ký bảo trì', fileType: 'DOCX', size: '510 KB', uploadDate: '2026-08-11', uploader: 'Phạm Thị Lan', verified: false, notes: 'Biên bản sự cố va đập hiện trường ngày 11/08/2026' }
    ],
    'CC/2026/0003': [
      { id: 'DOC-21', name: 'Bien_Ban_Ban_Giao_Canon_LBP.pdf', category: 'Biên bản giao nhận', fileType: 'PDF', size: '920 KB', uploadDate: '2026-02-15', uploader: 'Nguyễn Thị Mai', verified: true, notes: 'Biên bản cấp phát bàn giao CCDC' },
      { id: 'DOC-22', name: 'Hoa_Don_VAT_Canon_LBP.pdf', category: 'Hóa đơn / Hợp đồng', fileType: 'PDF', size: '640 KB', uploadDate: '2026-02-15', uploader: 'Phòng QLVP', verified: true, notes: 'Hóa đơn bán lẻ kèm phiếu bảo hành chính hãng' },
      { id: 'DOC-23', name: 'Quyet_Dinh_Dieu_Chuyen_QD_102.pdf', category: 'Biên bản giao nhận', fileType: 'PDF', size: '1.1 MB', uploadDate: '2026-08-02', uploader: 'Trần Thu Hà', verified: true, notes: 'Quyết định điều chuyển từ QLVP sang QLCL' }
    ]
  });

  const filteredAssets = assetMasters.filter(a =>
    a.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.nhom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.pbsd.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.nguoi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentAssetIndex = assetMasters.findIndex(a => a.id === activeAssetId);
  const currentAsset = assetMasters[currentAssetIndex] || null;

  // Filter related sub-records
  const assetTransfers = transfers.filter(t => t.ts === currentAsset?.id);
  const assetIncidents = incidents.filter(i => i.ts === currentAsset?.id);
  const assetMaintenance = maintenanceTasks.filter(m => m.ts === currentAsset?.id);
  const relatedWorkBudgets = workBudgets.filter(wb => wb.hangMuc === currentAsset?.id || wb.hangMucTS === currentAsset?.id);
  
  const currentDocs = currentAsset
    ? (assetDocumentsMap[currentAsset.id] || [
        {
          id: `DOC-${currentAsset.id.replace(/[^a-zA-Z0-9]/g, '')}-01`,
          name: `Bien_Ban_Ban_Giao_Nhan_${currentAsset.id.replace(/\//g, '_')}.pdf`,
          category: 'Biên bản giao nhận',
          fileType: 'PDF',
          size: '1.2 MB',
          uploadDate: currentAsset.ngayMua || '2026-08-01',
          uploader: currentAsset.nguoi || 'Ban QLTB TEDI',
          verified: true,
          notes: 'Hồ sơ bàn giao nhận tài sản tiêu chuẩn TEDI'
        },
        {
          id: `DOC-${currentAsset.id.replace(/[^a-zA-Z0-9]/g, '')}-02`,
          name: `Hoa_Don_VAT_Mua_Sam_${currentAsset.id.replace(/\//g, '_')}.pdf`,
          category: 'Hóa đơn / Hợp đồng',
          fileType: 'PDF',
          size: '780 KB',
          uploadDate: currentAsset.ngayMua || '2026-08-01',
          uploader: 'Phòng Tài chính Kế toán',
          verified: true,
          notes: 'Hóa đơn GTGT chứng từ gốc lưu trữ kế toán'
        },
        {
          id: `DOC-${currentAsset.id.replace(/[^a-zA-Z0-9]/g, '')}-03`,
          name: `Catalog_Ky_Thuat_Huong_Dan_${currentAsset.id.replace(/\//g, '_')}.pdf`,
          category: 'Hồ sơ kỹ thuật / Catalog',
          fileType: 'PDF',
          size: '3.5 MB',
          uploadDate: currentAsset.ngayMua || '2026-08-01',
          uploader: 'Tổ kỹ thuật QLVP',
          verified: true,
          notes: 'Tài liệu hướng dẫn kỹ thuật vận hành'
        }
      ])
    : [];

  const handleCreateNewAsset = () => {
    let seq = assetMasters.length + 1;
    let newId = `TS/2026/${String(seq).padStart(4, '0')}`;
    while (assetMasters.some(a => a.id === newId)) {
      seq++;
      newId = `TS/2026/${String(seq).padStart(4, '0')}`;
    }
    const newAsset: AssetMaster = {
      id: newId,
      ten: 'Tài sản khai báo mới',
      nhom: 'Máy móc, thiết bị chuyên dùng',
      hinhThai: 'Hữu hình',
      nguyenGia: 0,
      salvage: 0,
      ghiDe: null,
      am: '',
      method: 'Tuyến tính',
      factor: 0,
      soKy: 0,
      kyHan: 'Tháng',
      prorata: 'Từ ngày mua',
      tkTS: '2112',
      tkHM: '2141',
      tkCP: '6424',
      journal: 'MISC — Bút toán khác',
      ngayMua: new Date().toISOString().split('T')[0],
      soThang: 0,
      ngayBD: new Date().toISOString().split('T')[0],
      pbQuanLy: 'QLVP',
      pbsd: 'QLVP',
      nguoi: 'Cán bộ phụ trách',
      tinhTrang: 'Mới 100%',
      nguonGoc: 'Tạo mới trực tiếp',
      ct: '',
      bill: '',
      state: 'Đang chạy',
      trangThai: 'Đang sử dụng',
      computed: true,
      board: [],
      lichSu: [{ ngay: new Date().toISOString().split('T')[0], vc: `Khai báo tạo mới trực tiếp hồ sơ tài sản` }]
    };
    addAssetMaster(newAsset);
    setActiveAssetId(newId);
    addLog(`Tạo mới hồ sơ tài sản ${newId}`);
  };

  const handleConfirm = () => {
    if (!currentAsset) return;
    if (!currentAsset.pbsd || !currentAsset.nguoi) {
      alert('Vui lòng chọn Đơn vị sử dụng và nhập tên Người sử dụng trực tiếp.');
      return;
    }
    confirmAssetMaster(currentAsset.id);
    alert(`Đã đưa tài sản ${currentAsset.id} vào sử dụng.`);
  };

  const handlePrintHandover = () => {
    if (!currentAsset) return;
    setPrintModalData({
      id: currentAsset.id,
      ten: currentAsset.ten,
      nguyenGia: currentAsset.nguyenGia,
      pbQuanLy: currentAsset.pbQuanLy,
      pbsd: currentAsset.pbsd,
      nguoi: currentAsset.nguoi,
      ngayMua: currentAsset.ngayMua,
      bill: currentAsset.bill || currentAsset.ct,
      tinhTrang: currentAsset.tinhTrang || 'Mới 100%',
      method: currentAsset.method,
      soKy: currentAsset.soKy,
      kyHan: currentAsset.kyHan,
      tkTS: currentAsset.tkTS,
      tkHM: currentAsset.tkHM,
      tkCP: currentAsset.tkCP
    });
  };

  const handleSaveAsset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAsset) return;
    updateAssetMaster(currentAsset);
    addLog(`Cập nhật thông tin tài sản ${currentAsset.id}`);
    alert(`Đã lưu thông tin tài sản ${currentAsset.id}.`);
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;
    overrideAssetClassification(currentAsset.id, overrideType, overrideReason);
    setShowOverrideModal(false);
    alert(`Đã ghi đè phân loại tài sản ${currentAsset.id} thành ${overrideType}.`);
  };

  // Submit new transfer for this asset
  const handleCreateTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;

    let seq = transfers.length + 1;
    const transferId = `ĐCTS/2026/${String(seq).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newTransfer: AssetTransferRecord = {
      id: transferId,
      ngay: today,
      ts: currentAsset.id,
      tuPB: currentAsset.pbsd,
      tuNguoi: currentAsset.nguoi,
      denPB: transferForm.denPB,
      denNguoi: transferForm.denNguoi,
      lyDo: transferForm.lyDo,
      trangThai: 'Đã hoàn thành',
      loaiDieuChuyen: transferForm.loaiDieuChuyen,
      canCuLoai: 'Quyết định phân công',
      soQuyetDinh: transferForm.soQuyetDinh,
      ngayQuyetDinh: today,
      viTriMoi: transferForm.viTriMoi,
      doiTuongChiPhiMoi: transferForm.doiTuongChiPhiMoi
    };

    addTransfer(newTransfer);

    // Update current asset location & custodian
    const updatedAsset: AssetMaster = {
      ...currentAsset,
      pbsd: transferForm.denPB,
      nguoi: transferForm.denNguoi,
      lichSu: [
        { ngay: today, vc: `Điều chuyển từ ${currentAsset.pbsd} (${currentAsset.nguoi}) sang ${transferForm.denPB} (${transferForm.denNguoi}) theo ${transferForm.soQuyetDinh}` },
        ...currentAsset.lichSu
      ]
    };
    updateAssetMaster(updatedAsset);
    addLog(`Lập phiếu điều chuyển ${transferId} cho tài sản ${currentAsset.id}`);
    setShowTransferModal(false);
    alert(`Đã lập thành công phiếu điều chuyển ${transferId} cho tài sản ${currentAsset.id}. Đơn vị sử dụng đã cập nhật sang ${transferForm.denPB}!`);
  };

  // Submit new repair / incident report for this asset
  const handleCreateIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;

    let seq = incidents.length + 1;
    const incId = `BH/2026/${String(seq).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newInc: IncidentReport = {
      id: incId,
      ngay: today,
      nguoiBao: incidentForm.nguoiBao,
      ts: currentAsset.id,
      mucDo: incidentForm.mucDo,
      moTa: incidentForm.moTa || 'Phát hiện sự cố kỹ thuật trong quá trình khai thác',
      anh: [],
      giaiDoan: 'Đang sửa chữa',
      nguoiNhan: 'Tổ kỹ thuật QLVP',
      hinhThuc: incidentForm.hinhThuc,
      donVi: incidentForm.donVi,
      chiPhi: Number(incidentForm.chiPhi) || 0,
      ngayXong: '',
      kq: ''
    };

    addIncident(newInc);
    addLog(`Tạo phiếu báo hỏng & sửa chữa ${incId} cho tài sản ${currentAsset.id}`);
    setShowIncidentModal(false);
    setIncidentForm({
      nguoiBao: 'Cán bộ vận hành',
      mucDo: 'Trung bình',
      moTa: '',
      hinhThuc: 'Thuê ngoài',
      donVi: 'Đơn vị bảo hành / Sửa chữa ủy quyền',
      chiPhi: 0
    });
    alert(`Đã tạo thành công phiếu sửa chữa ${incId} cho tài sản ${currentAsset.id}.`);
  };

  // Submit new maintenance task for this asset
  const handleCreateMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;

    let seq = maintenanceTasks.length + 1;
    const mId = `MR/2026/${String(seq).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newTask: MaintenanceTask = {
      id: mId,
      ts: currentAsset.id,
      loai: maintenanceForm.loai,
      hinhThuc: maintenanceForm.hinhThuc,
      chuKyLoai: maintenanceForm.chuKyLoai,
      chuKy: Number(maintenanceForm.chuKy) || 12,
      nsx: maintenanceForm.nsx,
      lanGanNhat: today,
      doi: maintenanceForm.doi,
      chiPhi: Number(maintenanceForm.chiPhi) || 0,
      giaiDoan: 'Đang thực hiện',
      kq: maintenanceForm.kq
    };

    addMaintenanceTask(newTask);
    addLog(`Lập kế hoạch bảo dưỡng ${mId} cho tài sản ${currentAsset.id}`);
    setShowMaintenanceModal(false);
    alert(`Đã tạo phiếu bảo dưỡng / kiểm định ${mId} cho tài sản ${currentAsset.id}.`);
  };

  // Upload/add new document for this asset
  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset || !docUploadForm.name.trim()) {
      alert('Vui lòng nhập tên tài liệu');
      return;
    }

    const docId = `DOC-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const newDoc: AssetDocument = {
      id: docId,
      name: docUploadForm.name.endsWith(`.${docUploadForm.fileType.toLowerCase()}`)
        ? docUploadForm.name
        : `${docUploadForm.name}.${docUploadForm.fileType.toLowerCase()}`,
      category: docUploadForm.category,
      fileType: docUploadForm.fileType,
      size: docUploadForm.size || '1.5 MB',
      uploadDate: today,
      uploader: docUploadForm.uploader || 'Ban QLTB TEDI',
      verified: true,
      notes: docUploadForm.notes
    };

    const existingDocs = assetDocumentsMap[currentAsset.id] || currentDocs;
    setAssetDocumentsMap({
      ...assetDocumentsMap,
      [currentAsset.id]: [newDoc, ...existingDocs]
    });

    addLog(`Đính kèm tài liệu ${newDoc.name} vào tài sản ${currentAsset.id}`);
    setShowDocUploadModal(false);
    setDocUploadForm({
      name: '',
      category: 'Hồ sơ kỹ thuật / Catalog',
      fileType: 'PDF',
      size: '2.4 MB',
      uploader: 'Ban QLTB TEDI',
      notes: 'Hồ sơ lưu trữ điện tử gốc'
    });
    alert(`Đã đính kèm thành công tài liệu: ${newDoc.name}`);
  };

  // Delete document
  const handleDeleteDocument = (docId: string) => {
    if (!currentAsset) return;
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi hồ sơ tài sản?')) return;
    const existingDocs = assetDocumentsMap[currentAsset.id] || currentDocs;
    const updated = existingDocs.filter(d => d.id !== docId);
    setAssetDocumentsMap({
      ...assetDocumentsMap,
      [currentAsset.id]: updated
    });
    addLog(`Xóa tài liệu ${docId} khỏi tài sản ${currentAsset.id}`);
  };

  return (
    <div className="space-y-3 relative font-sans">
      {currentAsset ? (
        <div className="space-y-2">
          {/* BANNER LIÊN KẾT BẢN QUYỀN PHẦN MỀM MUA VĨNH VIỄN (TSCĐ VÔ HÌNH) */}
          {(currentAsset.softwareId || currentAsset.hinhThai === 'Vô hình' || currentAsset.nhom === 'Phần mềm chuyên dùng' || currentAsset.phanLoaiGiaTri === 'TSCĐ vô hình') && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-md shrink-0 mt-0.5">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                      Tài sản cố định vô hình — Bản quyền phần mềm máy tính (TK 2135 / TK 2143)
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Bản quyền mua vĩnh viễn
                    </span>
                    {currentAsset.softwareId && (
                      <span className="bg-white text-blue-900 border border-blue-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold shadow-2xs">
                        Liên kết MH13: {currentAsset.softwareId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-900 mt-1">
                    Tài sản cố định vô hình hình thành từ <strong>Bản quyền phần mềm mua vĩnh viễn</strong>. Đầy đủ hồ sơ license key, thời hạn trích khấu hao (TK khấu hao 2143).
                    {currentAsset.soHieuKyThuat && (
                      <span className="ml-2 text-slate-700 text-[11px]">
                        • License Key: <code className="font-mono text-blue-900 font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">{currentAsset.soHieuKyThuat}</code>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mh13', currentAsset.softwareId || 'PM/2026/0002')}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded shadow-2xs transition-colors cursor-pointer"
                title="Mở Thẻ quản lý bản quyền phần mềm chuyên dùng (MH13) để tra cứu License Key và lịch sử gia hạn"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem Thẻ bản quyền phần mềm (MH13)</span>
              </button>
            </div>
          )}

          {/* DETAIL FORM SHEET (MATCHING EXACT ODOO SCREENSHOT) */}
          <OdooFormSheet
          category="TÀI SẢN & MUA SẮM / TÀI SẢN"
          title={`${currentAsset.id} — ${currentAsset.ten}`}
          subtitle={`Hồ sơ tài sản gốc TEDI | Ngày ban hành: ${formatDMY(currentAsset.ngayMua)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Đang chạy', label: 'Đang sử dụng' },
            { id: 'Tạm dừng KH', label: 'Tạm dừng KH' },
            { id: 'Đã thanh lý', label: 'Đã thanh lý' }
          ]}
          currentStageId={currentAsset.state === 'Đang chạy' ? 'Đang chạy' : currentAsset.state}
          onStageSelect={(stgId) => updateAssetMaster({ ...currentAsset, state: stgId as any })}
          onNew={handleCreateNewAsset}
          onBack={() => setActiveAssetId(null)}
          currentIndex={currentAssetIndex + 1}
          totalItems={assetMasters.length}
          onPrev={() => currentAssetIndex > 0 && setActiveAssetId(assetMasters[currentAssetIndex - 1].id)}
          onNext={() => currentAssetIndex < assetMasters.length - 1 && setActiveAssetId(assetMasters[currentAssetIndex + 1].id)}
          leftFields={[
            {
              label: 'Mã tài sản',
              value: <span className="font-mono text-blue-900 font-bold">{currentAsset.id}</span>
            },
            {
              label: 'Tên tài sản',
              value: (
                <input
                  type="text"
                  value={currentAsset.ten}
                  onChange={e => updateAssetMaster({ ...currentAsset, ten: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-slate-900 bg-white text-xs"
                />
              )
            },
            {
              label: 'Nhóm tài sản',
              value: (
                <select
                  value={getEffectiveAssetGroup(currentAsset.nhom)}
                  onChange={e => {
                    const val = e.target.value;
                    const nextHinhThai = val === 'Phần mềm chuyên dùng' ? 'Vô hình' : currentAsset.hinhThai;
                    updateAssetMaster({
                      ...currentAsset,
                      nhom: val,
                      hinhThai: nextHinhThai
                    });
                  }}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 bg-white text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Máy móc, thiết bị chuyên dùng">Máy móc, thiết bị chuyên dùng</option>
                  <option value="Phương tiện vận tải, hạ tầng">Phương tiện vận tải, hạ tầng</option>
                  <option value="Phần mềm chuyên dùng">Phần mềm chuyên dùng</option>
                  <option value="Hạng mục xây dựng cơ bản (sửa chữa, cải tạo)">Hạng mục xây dựng cơ bản (sửa chữa, cải tạo)</option>
                </select>
              )
            },
            {
              label: 'Phân loại giá trị',
              value: (
                <select
                  value={
                    currentAsset.phanLoaiGiaTri ||
                    (currentAsset.ghiDe?.includes('Vô hình') || currentAsset.hinhThai === 'Vô hình' || currentAsset.nhom?.toLowerCase().includes('phần mềm')
                      ? 'TSCĐ vô hình'
                      : currentAsset.ghiDe?.includes('Chi phí') || currentAsset.ghiDe?.includes('642')
                      ? 'chi phí'
                      : currentAsset.ghiDe?.includes('CCDC') || currentAsset.ghiDe?.includes('153')
                      ? 'CCDC'
                      : currentAsset.nguyenGia >= config.nguongTSCD
                      ? 'TSCĐ hữu hình'
                      : 'CCDC')
                  }
                  onChange={e => {
                    const val = e.target.value;
                    const nextHinhThai = val === 'TSCĐ vô hình' ? 'Vô hình' : 'Hữu hình';
                    updateAssetMaster({
                      ...currentAsset,
                      phanLoaiGiaTri: val,
                      hinhThai: nextHinhThai,
                      ghiDe: val
                    });
                  }}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 bg-white text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="TSCĐ hữu hình">TSCĐ hữu hình</option>
                  <option value="CCDC">CCDC</option>
                  <option value="TSCĐ vô hình">TSCĐ vô hình</option>
                  <option value="chi phí">chi phí</option>
                </select>
              )
            }
          ]}
          rightFields={[
            {
              label: 'Cán bộ phụ trách',
              value: <span className="text-[#1C6AA9] font-bold cursor-pointer">{currentAsset.nguoi || 'Administrator'}</span>
            },
            {
              label: 'Đơn vị sử dụng',
              value: (
                <select
                  className="w-full border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 bg-white text-xs"
                  value={currentAsset.pbsd}
                  onChange={e => updateAssetMaster({ ...currentAsset, pbsd: e.target.value })}
                >
                  {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )
            },
            {
              label: 'Thời gian ban hành',
              value: <span className="font-mono">{formatDMY(currentAsset.ngayMua)}</span>
            },
            {
              label: 'Nguyên giá ghi tăng',
              value: <span className="font-mono text-blue-900 font-bold">{formatVND(currentAsset.nguyenGia)}</span>
            }
          ]}
          tabs={[
            { id: 'dieu_chuyen', label: 'Lịch sử điều chuyển' },
            { id: 'sua_chua', label: 'Lịch sử sửa chữa' },
            { id: 'bao_duong', label: 'Lịch sử bảo dưỡng' },
            { id: 'tai_lieu', label: 'Tài liệu' }
          ]}
          activeTabId={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as any)}
        >
          {/* ======================================================== */}
          {/* TAB 1: LỊCH SỬ ĐIỀU CHUYỂN                               */}
          {/* ======================================================== */}
          {activeTab === 'dieu_chuyen' && (
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-700 text-xs">
                  Danh sách điều chuyển ({assetTransfers.length})
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Dữ liệu tự động cập nhật từ phân hệ Điều chuyển tài sản
                </span>
              </div>

              {/* Table of Transfers */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Mã phiếu</th>
                      <th className="p-2.5">Ngày thực hiện</th>
                      <th className="p-2.5">Từ đơn vị (Bên giao)</th>
                      <th className="p-2.5">Đến đơn vị (Bên nhận)</th>
                      <th className="p-2.5">Căn cứ / Số Quyết định</th>
                      <th className="p-2.5">Vị trí mới / Dự án</th>
                      <th className="p-2.5">Lý do điều chuyển</th>
                      <th className="p-2.5 text-center">Trạng thái</th>
                      <th className="p-2.5 text-center">In phiếu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assetTransfers.length > 0 ? (
                      assetTransfers.map((tf) => (
                        <tr key={tf.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-2.5 font-bold font-mono text-blue-900">{tf.id}</td>
                          <td className="p-2.5 font-mono text-slate-700">{formatDMY(tf.ngay)}</td>
                          <td className="p-2.5 text-slate-800">
                            <div className="font-semibold">{tf.tuPB}</div>
                            <div className="text-[10px] text-slate-500">Người giao: {tf.tuNguoi}</div>
                          </td>
                          <td className="p-2.5 text-slate-900 bg-blue-50/20">
                            <div className="font-bold text-[#1C6AA9]">{tf.denPB}</div>
                            <div className="text-[10px] text-slate-600">Người nhận: {tf.denNguoi}</div>
                          </td>
                          <td className="p-2.5 font-medium text-slate-700">
                            {tf.soQuyetDinh || 'QĐ-TEDI'}
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {tf.viTriMoi || tf.doiTuongChiPhiMoi || 'Văn phòng / Hiện trường'}
                          </td>
                          <td className="p-2.5 text-slate-600 max-w-xs truncate" title={tf.lyDo}>
                            {tf.lyDo}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-block">
                              {tf.trangThai || 'Đã hoàn thành'}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setPrintModalData({
                                  type: 'bm_qt02_2',
                                  id: currentAsset.id,
                                  ten: currentAsset.ten,
                                  nguyenGia: currentAsset.nguyenGia,
                                  pbQuanLy: currentAsset.pbQuanLy,
                                  pbsd: tf.denPB,
                                  nguoi: tf.denNguoi,
                                  ngayMua: tf.ngay,
                                  bill: tf.soQuyetDinh || 'QĐ-102/2026/TEDI',
                                  tinhTrang: currentAsset.tinhTrang || 'Đang sử dụng tốt',
                                  method: currentAsset.method,
                                  soKy: currentAsset.soKy,
                                  tkTS: currentAsset.tkTS,
                                  tkHM: currentAsset.tkHM
                                });
                              }}
                              className="text-blue-700 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                              title="In biên bản bàn giao điều chuyển"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-6 text-center text-slate-500 bg-slate-50/50">
                          <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <div className="font-semibold text-slate-700">Chưa có lịch sử điều chuyển riêng cho tài sản này</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Tài sản hiện vẫn đang ở đơn vị bàn giao ban đầu ({currentAsset.pbsd})</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LỊCH SỬ SỬA CHỮA                                  */}
          {/* ======================================================== */}
          {activeTab === 'sua_chua' && (
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-700 text-xs">
                  Danh sách báo hỏng &amp; sửa chữa ({assetIncidents.length})
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Dữ liệu tự động cập nhật từ phân hệ Bảo trì &amp; Sửa chữa
                </span>
              </div>

              {/* Table of Incidents / Repairs */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Mã sự cố</th>
                      <th className="p-2.5">Ngày báo</th>
                      <th className="p-2.5">Người báo</th>
                      <th className="p-2.5 text-center">Mức độ</th>
                      <th className="p-2.5">Mô tả hiện tượng sự cố</th>
                      <th className="p-2.5">Đơn vị / Thợ sửa</th>
                      <th className="p-2.5 text-right">Chi phí (VND)</th>
                      <th className="p-2.5 text-center">Trạng thái</th>
                      <th className="p-2.5">Kết quả xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assetIncidents.length > 0 ? (
                      assetIncidents.map((inc) => {
                        let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                        if (inc.mucDo === 'Nghiêm trọng') badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
                        if (inc.mucDo === 'Thấp') badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';

                        let statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
                        if (inc.giaiDoan === 'Đã sửa xong') statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                        if (inc.giaiDoan === 'Mới báo hỏng') statusColor = 'bg-amber-100 text-amber-800 border-amber-300';

                        return (
                          <tr key={inc.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-2.5 font-bold font-mono text-amber-900">{inc.id}</td>
                            <td className="p-2.5 font-mono text-slate-700">{formatDMY(inc.ngay)}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{inc.nguoiBao}</td>
                            <td className="p-2.5 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                                {inc.mucDo}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-800 max-w-sm">
                              <div className="font-medium">{inc.moTa}</div>
                              {inc.anh && inc.anh.length > 0 && (
                                <div className="text-[10px] text-slate-500 mt-0.5">Hình ảnh đính kèm: {inc.anh.join(', ')}</div>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-700">
                              <div>{inc.donVi || 'Tổ kỹ thuật QLVP'}</div>
                              <div className="text-[10px] text-slate-500">{inc.hinhThuc || 'Nội bộ'}</div>
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              {formatVND(inc.chiPhi || 0)}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                {inc.giaiDoan}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-700">
                              {inc.kq || (inc.giaiDoan === 'Đã sửa xong' ? 'Đã khắc phục hoàn toàn' : 'Đang xử lý kỹ thuật...')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-6 text-center text-slate-500 bg-slate-50/50">
                          <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <div className="font-semibold text-slate-700">Chưa ghi nhận sự cố hay đợt sửa chữa nào</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Tài sản vận hành ổn định không phát sinh hư hỏng</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LỊCH SỬ BẢO DƯỠNG                                  */}
          {/* ======================================================== */}
          {activeTab === 'bao_duong' && (
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-700 text-xs">
                  Danh sách bảo dưỡng &amp; kiểm định ({assetMaintenance.length})
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  Dữ liệu tự động cập nhật từ kế hoạch bảo dưỡng định kỳ
                </span>
              </div>

              {/* Table of Maintenance Tasks */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Mã bảo dưỡng</th>
                      <th className="p-2.5">Phân loại</th>
                      <th className="p-2.5">Chu kỳ áp dụng</th>
                      <th className="p-2.5">Ngày thực hiện</th>
                      <th className="p-2.5">Đơn vị thực hiện</th>
                      <th className="p-2.5 text-right">Chi phí (VND)</th>
                      <th className="p-2.5 text-center">Trạng thái</th>
                      <th className="p-2.5">Kết quả &amp; Tem kiểm định</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assetMaintenance.length > 0 ? (
                      assetMaintenance.map((m) => {
                        let typeColor = 'bg-blue-100 text-blue-800 border-blue-300';
                        if (m.loai === 'Kiểm định') typeColor = 'bg-purple-100 text-purple-800 border-purple-300';
                        if (m.loai === 'Hiệu chỉnh') typeColor = 'bg-teal-100 text-teal-800 border-teal-300';

                        let statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
                        if (m.giaiDoan === 'Đạt' || m.giaiDoan === 'Hoàn thành') statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

                        return (
                          <tr key={m.id} className="hover:bg-teal-50/30 transition-colors">
                            <td className="p-2.5 font-bold font-mono text-teal-950">{m.id}</td>
                            <td className="p-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor}`}>
                                {m.loai}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-700">
                              <div className="font-semibold">{m.chuKy} tháng / lần</div>
                              <div className="text-[10px] text-slate-500">{m.nsx || 'Chu kỳ tiêu chuẩn'}</div>
                            </td>
                            <td className="p-2.5 font-mono text-slate-800">{formatDMY(m.lanGanNhat)}</td>
                            <td className="p-2.5 text-slate-800">
                              <div className="font-semibold">{m.doi}</div>
                              <div className="text-[10px] text-slate-500">{m.hinhThuc}</div>
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              {formatVND(m.chiPhi || 0)}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                {m.giaiDoan}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-700">
                              {m.kq || (m.giaiDoan === 'Đạt' ? 'Đã dán tem kiểm định chất lượng, thông số đo đạt chuẩn.' : 'Đang tiến hành bảo dưỡng')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-500 bg-slate-50/50">
                          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <div className="font-semibold text-slate-700">Chưa ghi nhận lịch sử bảo dưỡng / kiểm định định kỳ</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Dữ liệu bảo dưỡng định kỳ sẽ được tổng hợp tự động</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: TÀI LIỆU                                          */}
          {/* ======================================================== */}
          {activeTab === 'tai_lieu' && (
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-700 text-xs">
                  Danh sách tài liệu &amp; hồ sơ ({currentDocs.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(true)}
                  className="bg-[#1C6AA9] hover:bg-[#155384] text-white px-2.5 py-1 rounded font-medium text-xs flex items-center gap-1 shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>+ Tải lên tài liệu</span>
                </button>
              </div>

              {/* Table of Documents */}
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Tên tài liệu / Hồ sơ</th>
                      <th className="p-2.5">Phân loại hồ sơ</th>
                      <th className="p-2.5 text-center">Định dạng</th>
                      <th className="p-2.5 text-center">Dung lượng</th>
                      <th className="p-2.5">Ngày đính kèm</th>
                      <th className="p-2.5">Cán bộ tải lên</th>
                      <th className="p-2.5 text-center">Xác thực</th>
                      <th className="p-2.5 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentDocs.length > 0 ? (
                      currentDocs.map((doc) => {
                        let catBadge = 'bg-slate-100 text-slate-700 border-slate-300';
                        if (doc.category === 'Biên bản giao nhận') catBadge = 'bg-blue-100 text-blue-800 border-blue-300';
                        if (doc.category === 'Hóa đơn / Hợp đồng') catBadge = 'bg-amber-100 text-amber-800 border-amber-300';
                        if (doc.category === 'Giấy kiểm định / CO-CQ') catBadge = 'bg-purple-100 text-purple-800 border-purple-300';
                        if (doc.category === 'Hồ sơ kỹ thuật / Catalog') catBadge = 'bg-indigo-100 text-indigo-800 border-indigo-300';

                        let fileBadge = 'bg-rose-600 text-white';
                        if (doc.fileType === 'DOCX') fileBadge = 'bg-blue-700 text-white';
                        if (doc.fileType === 'XLSX') fileBadge = 'bg-emerald-700 text-white';
                        if (doc.fileType === 'DWG') fileBadge = 'bg-amber-700 text-white';

                        return (
                          <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span>{doc.name}</span>
                              </div>
                              {doc.notes && (
                                <div className="text-[10px] text-slate-500 mt-0.5">{doc.notes}</div>
                              )}
                            </td>
                            <td className="p-2.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catBadge}`}>
                                {doc.category}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${fileBadge}`}>
                                {doc.fileType}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-600">
                              {doc.size}
                            </td>
                            <td className="p-2.5 font-mono text-slate-700">
                              {formatDMY(doc.uploadDate)}
                            </td>
                            <td className="p-2.5 font-medium text-slate-800">
                              {doc.uploader}
                            </td>
                            <td className="p-2.5 text-center">
                              {doc.verified ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Đã duyệt</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[10px] bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3" />
                                  <span>Chờ duyệt</span>
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDocPreview(doc)}
                                  className="text-indigo-700 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                  title="Xem chi tiết tài liệu"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    alert(`Đang tải xuống tài liệu: ${doc.name}`);
                                  }}
                                  className="text-slate-600 hover:text-slate-900 p-1 hover:bg-slate-100 rounded"
                                  title="Tải xuống tệp tin"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded"
                                  title="Xóa tài liệu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-500 bg-slate-50/50">
                          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <div className="font-semibold text-slate-700">Chưa có tài liệu đính kèm nào</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Tải lên hóa đơn, biên bản bàn giao, hoặc catalog xuất xưởng</div>
                          <button
                            type="button"
                            onClick={() => setShowDocUploadModal(true)}
                            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tải lên tài liệu ngay</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Action Save */}
          <div className="flex justify-end pt-3 border-t border-slate-200 mt-4">
            <button
              onClick={handleSaveAsset}
              className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi hồ sơ tài sản</span>
            </button>
          </div>
        </OdooFormSheet>
        </div>
      ) : (
        /* MASTER LIST VIEW (ALL ASSETS - TEDI PORTAL STYLED TABLE) */
        <>
          <OdooControlPanel
            breadcrumb={['TÀI SẢN', 'Danh sách tài sản (MH6)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredAssets.length}
            onCreateNew={handleCreateNewAsset}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất tập tin danh mục tài sản Odoo Excel.")}
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
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã tài sản</th>
                    <th className="p-2.5 border-r border-slate-100">Tên tài sản</th>
                    <th className="p-2.5 border-r border-slate-100">Nhóm / Loại</th>
                    <th className="p-2.5 border-r border-slate-100">Đơn vị quản lý</th>
                    <th className="p-2.5 border-r border-slate-100">Ngày ban hành</th>
                    <th className="p-2.5 border-r border-slate-100">Đơn vị sử dụng</th>
                    <th className="p-2.5 text-center">Trạng thái tài sản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAssets.map((a, idx) => {
                    const isEven = idx % 2 === 0;

                    let statusText = 'Đã phân phát';
                    let statusBg = 'bg-emerald-600 text-white';

                    if (a.state === 'Nháp') {
                      statusText = 'Chờ duyệt';
                      statusBg = 'bg-amber-500 text-white';
                    } else if (a.trangThai === 'Tạm dừng KH') {
                      statusText = 'Chờ phân phát';
                      statusBg = 'bg-teal-600 text-white';
                    } else if (a.trangThai === 'Đã thanh lý') {
                      statusText = 'Đã hủy';
                      statusBg = 'bg-sky-500 text-white';
                    }

                    return (
                      <tr
                        key={`${a.id}-${idx}`}
                        onClick={() => setActiveAssetId(a.id)}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-blue-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-slate-900 whitespace-nowrap">
                          {a.id}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-medium text-slate-800">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold">{a.ten}</span>
                            {(a.hinhThai === 'Vô hình' || a.nhom === 'Phần mềm chuyên dùng' || a.softwareId || a.phanLoaiGiaTri === 'TSCĐ vô hình') && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                                <Code className="w-2.5 h-2.5" />
                                <span>TSCĐ vô hình</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-700">{a.nhom}</span>
                            {a.softwareId && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('mh13', a.softwareId);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 font-bold bg-blue-50/60 px-1.5 py-0.5 rounded border border-blue-200/60 w-fit hover:bg-blue-100/70 transition-colors"
                                title="Xem Thẻ bản quyền phần mềm tại MH13"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>Mã PM: {a.softwareId}</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-800">
                          {a.pbQuanLy || 'Ban CTGT Hà Nội'}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                          {formatDMY(a.ngayMua)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-800">
                          {a.pbsd || 'Trung tâm TVTK KCCT / Phòng Cầu'}
                        </td>

                        <td className="p-2.5 text-center whitespace-nowrap">
                          <span className={`inline-block ${statusBg} px-3 py-1 rounded-full text-[10px] font-bold shadow-2xs`}>
                            {statusText}
                          </span>
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

      {/* Bottom Floating Menu Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => handleCreateNewAsset()}
          className="w-11 h-11 bg-[#E11D48] hover:bg-[#C1123F] text-white rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="Tạo mới nhanh"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Override Modal */}
      {showOverrideModal && currentAsset && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleOverrideSubmit} className="bg-white rounded-lg p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Ghi đè phân loại tài sản ({currentAsset.id})
            </h3>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Loại tài sản mới (*)</label>
              <select
                value={overrideType}
                onChange={e => setOverrideType(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs font-semibold bg-white"
              >
                <option value="TSCĐ Hữu hình (TK 211x)">TSCĐ Hữu hình (TK 211x)</option>
                <option value="TSCĐ Vô hình (TK 213x)">TSCĐ Vô hình (TK 213x)</option>
                <option value="CCDC (TK 1531)">Công cụ dụng cụ (TK 1531)</option>
                <option value="Chi phí (TK 642x)">Chi phí sản xuất kinh doanh (TK 642x)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Lý do ghi đè (*)</label>
              <textarea
                required
                rows={3}
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded"
              >
                Xác nhận ghi đè
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Tạo phiếu điều chuyển (QT-04) */}
      {showTransferModal && currentAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateTransferSubmit} className="bg-white rounded-lg p-5 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Lập phiếu điều chuyển tài sản (QT-04)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-blue-50/80 p-3 rounded border border-blue-200">
              <div className="font-semibold text-blue-950">{currentAsset.id} — {currentAsset.ten}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Đơn vị giao hiện tại: <strong>{currentAsset.pbsd}</strong> ({currentAsset.nguoi})</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn vị tiếp nhận (*):</label>
                <select
                  value={transferForm.denPB}
                  onChange={e => setTransferForm({ ...transferForm, denPB: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cán bộ tiếp nhận (*):</label>
                <input
                  type="text"
                  required
                  value={transferForm.denNguoi}
                  onChange={e => setTransferForm({ ...transferForm, denNguoi: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số Quyết định căn cứ:</label>
                <input
                  type="text"
                  value={transferForm.soQuyetDinh}
                  onChange={e => setTransferForm({ ...transferForm, soQuyetDinh: e.target.value })}
                  placeholder="QĐ-xxx/2026/TEDI"
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vị trí lắp đặt mới / Dự án:</label>
                <input
                  type="text"
                  value={transferForm.viTriMoi}
                  onChange={e => setTransferForm({ ...transferForm, viTriMoi: e.target.value })}
                  placeholder="VD: Phòng Thí nghiệm QLCL"
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lý do điều chuyển (*):</label>
              <textarea
                required
                rows={2}
                value={transferForm.lyDo}
                onChange={e => setTransferForm({ ...transferForm, lyDo: e.target.value })}
                placeholder="Nhập mục đích điều chuyển phục vụ dự án / công tác..."
                className="w-full border border-slate-300 rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded shadow-2xs"
              >
                Xác nhận Điều chuyển
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Báo hỏng / Phiếu sửa chữa (QT-07) */}
      {showIncidentModal && currentAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateIncidentSubmit} className="bg-white rounded-lg p-5 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Lập phiếu báo hỏng &amp; Yêu cầu sửa chữa (QT-07)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-50/80 p-3 rounded border border-amber-200">
              <div className="font-semibold text-amber-950">{currentAsset.id} — {currentAsset.ten}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Đơn vị đang khai thác: <strong>{currentAsset.pbsd}</strong> ({currentAsset.nguoi})</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Người phát hiện / Báo hỏng (*):</label>
                <input
                  type="text"
                  required
                  value={incidentForm.nguoiBao}
                  onChange={e => setIncidentForm({ ...incidentForm, nguoiBao: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mức độ hư hỏng (*):</label>
                <select
                  value={incidentForm.mucDo}
                  onChange={e => setIncidentForm({ ...incidentForm, mucDo: e.target.value as any })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
                >
                  <option value="Thấp">Thấp (Vẫn dùng được tạm thời)</option>
                  <option value="Trung bình">Trung bình (Ảnh hưởng tiến độ)</option>
                  <option value="Nghiêm trọng">Nghiêm trọng (Dừng hoạt động ngay)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hình thức sửa chữa:</label>
                <select
                  value={incidentForm.hinhThuc}
                  onChange={e => setIncidentForm({ ...incidentForm, hinhThuc: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900"
                >
                  <option value="Nội bộ">Tổ kỹ thuật QLVP tự sửa chữa</option>
                  <option value="Thuê ngoài">Thuê ngoài / Nhà cung cấp bảo hành</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi phí sửa chữa dự tính (VND):</label>
                <input
                  type="number"
                  value={incidentForm.chiPhi}
                  onChange={e => setIncidentForm({ ...incidentForm, chiPhi: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-mono text-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mô tả hiện tượng hư hỏng &amp; Nguyên nhân (*):</label>
              <textarea
                required
                rows={3}
                value={incidentForm.moTa}
                onChange={e => setIncidentForm({ ...incidentForm, moTa: e.target.value })}
                placeholder="Mô tả triệu chứng hư hỏng, mã lỗi hiển thị, chi tiết cần thay thế..."
                className="w-full border border-slate-300 rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded shadow-2xs"
              >
                Tiếp nhận &amp; Báo hỏng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Lập phiếu bảo dưỡng / kiểm định (QT-06) */}
      {showMaintenanceModal && currentAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateMaintenanceSubmit} className="bg-white rounded-lg p-5 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Lập phiếu bảo dưỡng định kỳ &amp; Kiểm định (QT-06)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMaintenanceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-teal-50/80 p-3 rounded border border-teal-200">
              <div className="font-semibold text-teal-950">{currentAsset.id} — {currentAsset.ten}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Chế độ hiện tại: <strong>{currentAsset.cheDoKiemTra || 'Kiểm định 12 tháng/lần'}</strong></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loại công việc (*):</label>
                <select
                  value={maintenanceForm.loai}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, loai: e.target.value as any })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
                >
                  <option value="Bảo dưỡng">Bảo dưỡng định kỳ</option>
                  <option value="Kiểm định">Kiểm định an toàn / Đo lường</option>
                  <option value="Hiệu chỉnh">Hiệu chỉnh thông số kỹ thuật</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chu kỳ lặp lại (Tháng):</label>
                <input
                  type="number"
                  value={maintenanceForm.chuKy}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, chuKy: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn vị thực hiện (*):</label>
                <input
                  type="text"
                  required
                  value={maintenanceForm.doi}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, doi: e.target.value })}
                  placeholder="VD: Trung tâm Đo lường 1 / Leica VN"
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi phí dự kiến (VND):</label>
                <input
                  type="number"
                  value={maintenanceForm.chiPhi}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, chiPhi: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-mono font-bold text-teal-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kết quả kiểm tra &amp; Ghi chú kỹ thuật:</label>
              <textarea
                rows={2}
                value={maintenanceForm.kq}
                onChange={e => setMaintenanceForm({ ...maintenanceForm, kq: e.target.value })}
                placeholder="Ghi nhận tình trạng kỹ thuật sau kiểm định, số tem hiệu chuẩn..."
                className="w-full border border-slate-300 rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowMaintenanceModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded shadow-2xs"
              >
                Lập phiếu Bảo dưỡng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Tải lên tài liệu mới */}
      {showDocUploadModal && currentAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddDocumentSubmit} className="bg-white rounded-lg p-5 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Tải lên &amp; Đính kèm Tài liệu mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên tài liệu / Tên tệp tin (*):</label>
              <input
                type="text"
                required
                value={docUploadForm.name}
                onChange={e => setDocUploadForm({ ...docUploadForm, name: e.target.value })}
                placeholder="VD: Chung_Nhan_Kiem_Dinh_2026.pdf"
                className="w-full border border-slate-300 rounded p-2 bg-white font-semibold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phân loại hồ sơ (*):</label>
                <select
                  value={docUploadForm.category}
                  onChange={e => setDocUploadForm({ ...docUploadForm, category: e.target.value as any })}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900"
                >
                  <option value="Biên bản giao nhận">Biên bản giao nhận</option>
                  <option value="Hóa đơn / Hợp đồng">Hóa đơn / Hợp đồng</option>
                  <option value="Hồ sơ kỹ thuật / Catalog">Hồ sơ kỹ thuật / Catalog</option>
                  <option value="Giấy kiểm định / CO-CQ">Giấy kiểm định / CO-CQ</option>
                  <option value="Nhật ký bảo trì">Nhật ký bảo trì</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Định dạng tệp:</label>
                <select
                  value={docUploadForm.fileType}
                  onChange={e => setDocUploadForm({ ...docUploadForm, fileType: e.target.value as any })}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-900 font-mono font-bold"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="DWG">DWG (Bản vẽ)</option>
                  <option value="IMG">IMG (Ảnh chụp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ghi chú tóm tắt nội dung tài liệu:</label>
              <textarea
                rows={2}
                value={docUploadForm.notes}
                onChange={e => setDocUploadForm({ ...docUploadForm, notes: e.target.value })}
                placeholder="Ghi chú thêm về nội dung, xuất xứ hoặc thời hạn hiệu lực..."
                className="w-full border border-slate-300 rounded p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow-2xs"
              >
                Lưu tài liệu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Xem chi tiết tài liệu (Preview) */}
      {selectedDocPreview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Thông tin Tài liệu Đính kèm
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Tên tài liệu:</span>
                <span className="font-bold text-slate-900 text-right">{selectedDocPreview.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Phân loại:</span>
                <span className="font-semibold text-indigo-900">{selectedDocPreview.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Định dạng / Dung lượng:</span>
                <span className="font-mono text-slate-800">{selectedDocPreview.fileType} — {selectedDocPreview.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Ngày đính kèm:</span>
                <span className="font-mono text-slate-800">{formatDMY(selectedDocPreview.uploadDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Người đính kèm:</span>
                <span className="font-semibold text-slate-800">{selectedDocPreview.uploader}</span>
              </div>
              {selectedDocPreview.notes && (
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <span className="text-slate-500 block mb-0.5">Ghi chú:</span>
                  {selectedDocPreview.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Đang tải xuống tệp: ${selectedDocPreview.name}`);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded flex items-center gap-1 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải xuống tệp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {printModalData && (
        <PrintA4Modal
          type={printModalData.type || 'bm_qt02_2'}
          data={printModalData}
          onClose={() => setPrintModalData(null)}
        />
      )}
    </div>
  );
};
