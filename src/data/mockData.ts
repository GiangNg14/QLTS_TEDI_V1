import {
  SystemConfig, ProcurementPlan, ProcurementRequisition, RequestForQuotation,
  PreContractVendorEval, ExpertCandidate, ContractItem, DeliverableAcceptance,
  GoodsReceipt, SuppliesStockItem, EquipmentLoanRecord, SupplierPostEval, SuppliesIssuance, AssetModel, VendorBill,
  AssetMaster, AssetTransferRecord, AssetAuditLine, AssetAuditSession, AssetDisposalRecord,
  SoftwareLicense, MaintenanceTask, IncidentReport, WorkBudget, OpenIssueItem,
  ActivityLog, HandoverSlip, HandoverSlipLine, HandoverAttachment
} from '../types';

export const INITIAL_CFG: SystemConfig = {
  nguongTSCD: 30000000,
  hanMucX: 20000000,
  hanMucY: 100000000,
  dungSaiNhanDu: 0,
  kyBaoCao: 'Năm'
};

export const DEPARTMENTS = ['QLVP', 'QLCL', 'CL-KD', 'Phòng 4 (chờ xác nhận)', 'Phòng 5 (chờ xác nhận)'];
export const UNITS = ['Cái', 'Bộ', 'Chiếc', 'Hộp', 'Kg', 'Mét', 'Tháng', 'Lần'];
export const REQUEST_TYPES = ['TSCĐ', 'Vật tư – CCDC', 'Dịch vụ – Chuyên gia'] as const;

// 5 Nhóm tài sản kiểm soát chuẩn theo mục 3 TEDI-ISO-QT 02 (ban hành 01/06/2017)
export const ISO_ASSET_CATEGORIES = [
  {
    code: 'XDCB_HANG_MUC',
    ten: 'Hạng mục XDCB',
    moTa: 'Sửa chữa, nâng cấp, cải tạo văn phòng, tường rào, sân bãi',
    canCu: 'Mục 4.2.3.c ISO QT02: Theo dõi bảo hành, lập KH sửa chữa/nâng cấp hằng năm',
    thangKH: 240,
    tkTS: '2112',
    tkHM: '2141',
    tkCP: '6427'
  },
  {
    code: 'MAY_MOC_CHUYEN_DUNG',
    ten: 'Máy móc chuyên dùng',
    moTa: 'Khảo sát, thiết kế, thí nghiệm, đo lường, kiểm tra (gồm 3 nhóm: TB văn phòng, TN hiện trường, TN trong phòng)',
    canCu: 'Mục 4.2.2 & 4.2.3.b ISO QT02: BM QT02-3, kế hoạch kiểm định/hiệu chuẩn/bảo dưỡng/sửa chữa',
    thangKH: 84,
    tkTS: '2111',
    tkHM: '2141',
    tkCP: '6274'
  },
  {
    code: 'PHUONG_TIEN_HA_TANG',
    ten: 'Phương tiện vận tải & HT hạ tầng',
    moTa: 'Ôtô, thang máy, CNTT, điện, nước, thoát nước',
    canCu: 'Mục 3 ISO QT02: Quản lý lý lịch xe, hạ tầng kỹ thuật vận hành',
    thangKH: 96,
    tkTS: '2113',
    tkHM: '2141',
    tkCP: '6424'
  },
  {
    code: 'PHAN_MEM_CHUYEN_DUNG',
    ten: 'Phần mềm chuyên dùng',
    moTa: 'Quản lý điều hành, khảo sát, thiết kế, thí nghiệm, kế toán',
    canCu: 'Mục 4.2.3.a ISO QT02: BM QT02-4, kiểm tra kết quả tính toán định kỳ hoặc khi nghi ngờ',
    thangKH: 36,
    tkTS: '2135',
    tkHM: '2143',
    tkCP: '6424'
  },
  {
    code: 'XDCB_MOI',
    ten: 'Công trình XDCB mới',
    moTa: 'Tòa nhà văn phòng, phòng thí nghiệm, công trình xây dựng mới',
    canCu: 'Mục 3 ISO QT02: Quyết định đầu tư, nghiệm thu bàn giao đưa vào sử dụng',
    thangKH: 360,
    tkTS: '2112',
    tkHM: '2141',
    tkCP: '6424'
  }
];

export const ASSET_GROUPS = [
  { id: 'XDCB', ten: 'Hạng mục XDCB (Sửa chữa, cải tạo)', thang: 240, tk: '2112', hm: '2141', cp: '6427', iso: 'XDCB_HANG_MUC' },
  { id: 'MMTB', ten: 'Máy móc chuyên dùng (Đo lường, TN)', thang: 84, tk: '2111', hm: '2141', cp: '6274', iso: 'MAY_MOC_CHUYEN_DUNG' },
  { id: 'PTVT', ten: 'Phương tiện vận tải & Hạ tầng', thang: 96, tk: '2113', hm: '2141', cp: '6424', iso: 'PHUONG_TIEN_HA_TANG' },
  { id: 'TBQL', ten: 'Thiết bị quản lý văn phòng', thang: 60, tk: '2112', hm: '2141', cp: '6424', iso: 'MAY_MOC_CHUYEN_DUNG' },
  { id: 'PM', ten: 'Phần mềm chuyên dùng (Bản quyền)', thang: 36, tk: '2135', hm: '2143', cp: '6424', iso: 'PHAN_MEM_CHUYEN_DUNG' },
  { id: 'XDCB_MOI', ten: 'Công trình XDCB mới', thang: 360, tk: '2112', hm: '2141', cp: '6424', iso: 'XDCB_MOI' }
];

export const ACCOUNT_LIST: [string, string, string][] = [
  ['1531', 'Công cụ, dụng cụ', 'Hàng tồn kho'],
  ['2111', 'TSCĐ hữu hình — Máy móc, thiết bị', 'Tài sản cố định'],
  ['2112', 'TSCĐ hữu hình — Thiết bị quản lý', 'Tài sản cố định'],
  ['2113', 'TSCĐ hữu hình — Phương tiện vận tải', 'Tài sản cố định'],
  ['2135', 'TSCĐ vô hình — Phần mềm máy tính', 'Tài sản cố định'],
  ['6274', 'Chi phí khấu hao TSCĐ sản xuất', 'Chi phí'],
  ['6414', 'Chi phí khấu hao TSCĐ bán hàng', 'Chi phí'],
  ['6424', 'Chi phí khấu hao TSCĐ quản lý', 'Chi phí'],
  ['6427', 'Chi phí dịch vụ mua ngoài', 'Chi phí'],
  ['6428', 'Chi phí bằng tiền khác', 'Chi phí']
];

export const INITIAL_PLANS: ProcurementPlan[] = [{
  id: 'KHMS/2026/01',
  nam: 2026,
  ten: 'Kế hoạch mua sắm năm 2026',
  trangThai: 'Đang thực hiện',
  nguoiLap: 'Trần Thu Hà (QLVP)',
  ngayLap: '2025-12-18',
  lines: [
    { id: 'L1', pb: 'CL-KD', loai: 'TSCĐ', ten: 'Máy photocopy đa năng', dvt: 'Cái', sl: 2, gia: 42000000, quy: 'Q3', nhom: 'TBQL' },
    { id: 'L2', pb: 'CL-KD', loai: 'Vật tư – CCDC', ten: 'Máy in laser A4', dvt: 'Cái', sl: 4, gia: 8000000, quy: 'Q3', nhom: 'TBQL' },
    { id: 'L3', pb: 'QLCL', loai: 'TSCĐ', ten: 'Máy toàn đạc điện tử', dvt: 'Bộ', sl: 1, gia: 180000000, quy: 'Q2', nhom: 'MMTB' },
    { id: 'L4', pb: 'QLCL', loai: 'Vật tư – CCDC', ten: 'Mực in laser', dvt: 'Hộp', sl: 40, gia: 150000, quy: 'Q1', nhom: 'TBQL' },
    { id: 'L5', pb: 'QLVP', loai: 'Vật tư – CCDC', ten: 'Bàn làm việc', dvt: 'Cái', sl: 10, gia: 2600000, quy: 'Q1', nhom: 'TBQL' },
    { id: 'L6', pb: 'QLVP', loai: 'Dịch vụ – Chuyên gia', ten: 'Thuê phần mềm quản lý (theo năm)', dvt: 'Tháng', sl: 12, gia: 4500000, quy: 'Q1', nhom: 'PM' }
  ]
}];

export const INITIAL_REQUISITIONS: ProcurementRequisition[] = [
  {
    id: 'DXMS/2026/0001',
    ngay: '2026-07-02',
    pb: 'CL-KD',
    pbsd: 'CL-KD',
    loai: 'TSCĐ',
    khLine: 'L1',
    lines: [{ ten: 'Máy photocopy đa năng', sl: 1, dvt: 'Cái', gia: 42000000, ts: 'Tốc độ 45 trang/phút, khay 2 tầng', mucDich: 'Phục vụ in ấn hồ sơ dự thầu' }],
    trangThai: 'Hoàn thành',
    lyDoVuot: '',
    duyet: [
      { cap: 'Trưởng phòng', nguoi: 'Lê Minh Quân', kq: 'Đã duyệt', ngay: '2026-07-03' },
      { cap: 'Sếp tổng', nguoi: 'Nguyễn Đức Thắng', kq: 'Đã duyệt', ngay: '2026-07-05' }
    ],
    chiThi: { nguoi: 'Lê Minh Quân', ngay: '2026-07-06', noiDung: 'Triển khai mua trong tháng 7', kq: 'Nhận', lyDo: '', ngayPh: '2026-07-06' }
  },
  {
    id: 'DXMS/2026/0002',
    ngay: '2026-07-20',
    pb: 'QLCL',
    pbsd: 'QLCL',
    loai: 'Vật tư – CCDC',
    khLine: 'L4',
    lines: [{ ten: 'Mực in laser', sl: 50, dvt: 'Hộp', gia: 165000, ts: 'Chính hãng', mucDich: 'Bù tiêu hao 6 tháng cuối năm' }],
    trangThai: 'Chờ duyệt sơ bộ',
    lyDoVuot: '',
    duyet: [{ cap: 'Trưởng phòng', nguoi: 'Phạm Thị Lan', kq: 'Chờ', ngay: '' }],
    chiThi: null
  },
  {
    id: 'DXMS/2026/0003',
    ngay: '2026-08-04',
    pb: 'QLVP',
    pbsd: 'QLVP',
    loai: 'TSCĐ',
    khLine: null,
    lines: [{ ten: 'Máy chủ lưu trữ hồ sơ', sl: 1, dvt: 'Bộ', gia: 145000000, ts: '2 CPU, 128GB RAM, RAID 10', mucDich: 'Lưu trữ hồ sơ thiết kế tập trung' }],
    trangThai: 'Nháp',
    lyDoVuot: '',
    duyet: [],
    chiThi: null
  }
];

export const INITIAL_GOODS_RECEIPTS: GoodsReceipt[] = [
  {
    id: 'NH/2026/0001',
    dx: 'DXMS/2026/0001',
    ngay: '2026-07-28',
    ncu: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    hopDong: 'HD/2026/014',
    nghiemThu: 'Đạt',
    trangThai: 'Đã bàn giao',
    lines: [{ ten: 'Máy photocopy đa năng', dvt: 'Cái', slDat: 1, slNhan: 1, pb: 'CL-KD', nguoi: 'Trần Văn Nam', gia: 42000000, phi: 3000000, ts: 'TS/2026/0001' }]
  }
];

export const INITIAL_ASSET_MODELS: AssetModel[] = [
  { id: 'AM01', ten: 'Máy móc, thiết bị đo đạc — 7 năm', method: 'Tuyến tính', factor: 2, soKy: 84, kyHan: 'Tháng', prorata: 'Từ ngày mua', tkTS: '2111', tkHM: '2141', tkCP: '6274', journal: 'MISC — Bút toán khác', tkMua: '2111' },
  { id: 'AM02', ten: 'Thiết bị quản lý văn phòng — 5 năm', method: 'Tuyến tính', factor: 2, soKy: 60, kyHan: 'Tháng', prorata: 'Từ ngày mua', tkTS: '2112', tkHM: '2141', tkCP: '6424', journal: 'MISC — Bút toán khác', tkMua: '2112' },
  { id: 'AM03', ten: 'Phương tiện vận tải — 8 năm, giảm dần', method: 'Giảm dần rồi Tuyến tính', factor: 2, soKy: 96, kyHan: 'Tháng', prorata: 'Đầu kỳ tiếp theo', tkTS: '2113', tkHM: '2141', tkCP: '6424', journal: 'DEP — Nhật ký khấu hao', tkMua: '2113' },
  { id: 'AM04', ten: 'Phần mềm mua vĩnh viễn — 3 năm', method: 'Tuyến tính', factor: 2, soKy: 36, kyHan: 'Tháng', prorata: 'Từ ngày mua', tkTS: '2135', tkHM: '2143', tkCP: '6424', journal: 'MISC — Bút toán khác', tkMua: '2135' }
];

export const INITIAL_VENDOR_BILLS: VendorBill[] = [
  {
    id: 'BILL/2026/08/0007',
    ncc: 'Công ty TNHH Thiết bị Đo đạc Minh Long',
    ngay: '2026-08-05',
    ref: 'PO/2026/0023',
    hd: 'HD/2026/010',
    trangThai: 'Nháp',
    assets: [],
    lines: [
      { ten: 'Máy toàn đạc điện tử Leica TS07 (bộ 2)', tk: '2111', sl: 1, gia: 186000000, am: 'AM01' },
      { ten: 'Máy in laser A4 Canon LBP', tk: '2112', sl: 2, gia: 8200000, am: '' },
      { ten: 'Phí vận chuyển, lắp đặt, chạy thử', tk: '6427', sl: 1, gia: 3500000, am: '' }
    ]
  },
  {
    id: 'BILL/2026/07/0031',
    ncc: 'Công ty CP Thiết bị Văn phòng Hà Nội',
    ngay: '2026-07-28',
    ref: 'PO/2026/0019',
    hd: '',
    trangThai: 'Đã vào sổ',
    assets: ['TS/2026/0001'],
    lines: [
      { ten: 'Máy photocopy đa năng Ricoh MP', tk: '2112', sl: 1, gia: 45000000, am: 'AM02' }
    ]
  }
];

export const INITIAL_ASSET_MASTERS: AssetMaster[] = [
  {
    id: 'TS/2026/0001',
    ten: 'Máy photocopy đa năng Ricoh MP',
    nhom: 'TBQL',
    isoGroup: 'MAY_MOC_CHUYEN_DUNG',
    machineryGroup: 'ThietBiVanPhong',
    hinhThai: 'Hữu hình',
    nguyenGia: 45000000,
    giaMuaGoc: 42000000,
    cuocVanChuyen: 1500000,
    chiPhiChayThu: 1500000,
    soHieuKyThuat: 'TLKT-RICOH-MP5055-VN',
    cheDoKiemTra: 'Bảo dưỡng định kỳ 6 tháng/lần',
    salvage: 0,
    ghiDe: null,
    am: 'AM02',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 60,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2112',
    tkHM: '2141',
    tkCP: '6424',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2026-07-28',
    soThang: 60,
    ngayBD: '2026-09-01',
    pbQuanLy: 'QLVP',
    pbsd: 'CL-KD',
    nguoi: 'Trần Văn Nam',
    tinhTrang: 'Mới',
    nguonGoc: 'Mua sắm',
    ct: 'NH/2026/0001',
    bill: 'BILL/2026/07/0031',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2026-08-01', vc: 'Ghi tăng từ phiếu NH/2026/0001, bàn giao CL-KD theo BM QT02-2' }]
  },
  {
    id: 'TS/2024/0007',
    ten: 'Máy toàn đạc điện tử Leica TS07',
    nhom: 'MMTB',
    isoGroup: 'MAY_MOC_CHUYEN_DUNG',
    machineryGroup: 'ThiNghiemHienTruong',
    hinhThai: 'Hữu hình',
    nguyenGia: 182000000,
    giaMuaGoc: 175000000,
    cuocVanChuyen: 3000000,
    chiPhiChayThu: 4000000,
    soHieuKyThuat: 'LEICA-TS07-SN78411-CALIB',
    cheDoKiemTra: 'Kiểm định 12 tháng/lần, Hiệu chỉnh 24 tháng/lần',
    salvage: 0,
    ghiDe: null,
    am: 'AM01',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 84,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2111',
    tkHM: '2141',
    tkCP: '6274',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2024-03-01',
    soThang: 84,
    ngayBD: '2024-03-01',
    pbQuanLy: 'QLVP',
    pbsd: 'QLCL',
    nguoi: 'Phạm Thị Lan',
    tinhTrang: 'Tốt',
    nguonGoc: 'Mua sắm',
    ct: '',
    bill: '',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2024-03-01', vc: 'Ghi tăng, bàn giao QLCL theo BM QT02-2' }]
  },
  {
    id: 'TS/2026/0004',
    ten: 'Máy toàn đạc điện tử Leica TS07 (bộ 2)',
    nhom: 'MMTB',
    isoGroup: 'MAY_MOC_CHUYEN_DUNG',
    machineryGroup: 'ThiNghiemHienTruong',
    hinhThai: 'Hữu hình',
    nguyenGia: 186000000,
    giaMuaGoc: 180000000,
    cuocVanChuyen: 2500000,
    chiPhiChayThu: 3500000,
    soHieuKyThuat: 'LEICA-TS07-SN99012-TEST',
    cheDoKiemTra: 'Kiểm định 12 tháng/lần',
    salvage: 0,
    ghiDe: null,
    am: 'AM01',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 84,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2111',
    tkHM: '2141',
    tkCP: '6274',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2026-08-05',
    soThang: 84,
    ngayBD: '2026-08-05',
    pbQuanLy: 'QLVP',
    pbsd: '',
    nguoi: '',
    tinhTrang: 'Mới',
    nguonGoc: 'Mua sắm',
    ct: 'BILL/2026/08/0007',
    bill: 'BILL/2026/08/0007',
    state: 'Nháp',
    trangThai: 'Đang sử dụng',
    computed: false,
    board: [],
    lichSu: [{ ngay: '2026-08-05', vc: 'Tự tạo từ hóa đơn BILL/2026/08/0007 theo BM QT02-2' }]
  },
  {
    id: 'TS/2025/0018',
    ten: 'Máy nén thí nghiệm ba trục tự động GDS',
    nhom: 'MMTB',
    isoGroup: 'MAY_MOC_CHUYEN_DUNG',
    machineryGroup: 'ThiNghiemTrongPhong',
    hinhThai: 'Hữu hình',
    nguyenGia: 420000000,
    giaMuaGoc: 400000000,
    cuocVanChuyen: 8000000,
    chiPhiChayThu: 12000000,
    soHieuKyThuat: 'GDS-TRIAX-LAB-019',
    cheDoKiemTra: 'Hiệu chỉnh định kỳ 12 tháng/lần',
    salvage: 0,
    ghiDe: null,
    am: 'AM01',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 96,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2111',
    tkHM: '2141',
    tkCP: '6274',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2025-04-10',
    soThang: 96,
    ngayBD: '2025-04-10',
    pbQuanLy: 'QLVP',
    pbsd: 'QLCL',
    nguoi: 'Đỗ Mạnh Cường',
    tinhTrang: 'Tốt',
    nguonGoc: 'Mua sắm',
    ct: 'NH/2025/0045',
    bill: 'BILL/2025/04/0019',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2025-04-10', vc: 'Bàn giao đưa vào Phòng TN Cơ học Đất' }]
  },
  {
    id: 'TS/2023/0002',
    ten: 'Xe ô tô bán tải Ford Ranger 2.0L 4x4',
    nhom: 'PTVT',
    isoGroup: 'PHUONG_TIEN_HA_TANG',
    machineryGroup: undefined,
    hinhThai: 'Hữu hình',
    nguyenGia: 680000000,
    giaMuaGoc: 650000000,
    cuocVanChuyen: 0,
    chiPhiChayThu: 30000000,
    soHieuKyThuat: 'BIEN-SO-29A-88899',
    cheDoKiemTra: 'Đăng kiểm định kỳ & bảo dưỡng 5.000 km',
    salvage: 0,
    ghiDe: null,
    am: 'AM03',
    method: 'Giảm dần rồi Tuyến tính',
    factor: 2,
    soKy: 96,
    kyHan: 'Tháng',
    prorata: 'Đầu kỳ tiếp theo',
    tkTS: '2113',
    tkHM: '2141',
    tkCP: '6424',
    journal: 'DEP — Nhật ký khấu hao',
    ngayMua: '2023-01-15',
    soThang: 96,
    ngayBD: '2023-02-01',
    pbQuanLy: 'QLVP',
    pbsd: 'CL-KD',
    nguoi: 'Nguyễn Văn Hùng',
    tinhTrang: 'Tốt',
    nguonGoc: 'Mua sắm',
    ct: '',
    bill: '',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2023-01-15', vc: 'Ghi tăng xe phục vụ công tác hiện trường' }]
  },
  {
    id: 'TS/2025/0002-PM',
    ten: 'Phần mềm dự toán G8 Enterprise (Bản quyền vĩnh viễn)',
    nhom: 'Phần mềm chuyên dùng',
    isoGroup: 'PHAN_MEM_CHUYEN_DUNG',
    hinhThai: 'Vô hình',
    nguyenGia: 36000000,
    giaMuaGoc: 36000000,
    cuocVanChuyen: 0,
    chiPhiChayThu: 0,
    soHieuKyThuat: 'G8-ENT-TEDI-45920-USB',
    cheDoKiemTra: 'Kiểm tra bản quyền định kỳ 12 tháng/lần',
    salvage: 0,
    ghiDe: 'TSCĐ vô hình',
    phanLoaiGiaTri: 'TSCĐ vô hình',
    softwareId: 'PM/2026/0002',
    am: 'AM04',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 36,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2135',
    tkHM: '2143',
    tkCP: '6424',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2025-06-15',
    soThang: 36,
    ngayBD: '2025-07-01',
    pbQuanLy: 'QLVP',
    pbsd: 'CL-KD',
    nguoi: 'Trần Thị Hà (Kế toán chi phí)',
    tinhTrang: 'Đang khai thác tốt',
    nguonGoc: 'Bản quyền phần mềm mua vĩnh viễn (PM/2026/0002)',
    ct: 'HĐ-G8/2025/TEDI-098',
    bill: 'HĐ-G8/2025/TEDI-098',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2025-06-15', vc: 'Ghi nhận TSCĐ vô hình từ Hợp đồng mua bản quyền G8 Enterprise vĩnh viễn' }]
  },
  {
    id: 'TS/2024/0007-PM',
    ten: 'Phần mềm khảo sát địa hình HHMaps v6 (Bản quyền vĩnh viễn)',
    nhom: 'Phần mềm chuyên dùng',
    isoGroup: 'PHAN_MEM_CHUYEN_DUNG',
    hinhThai: 'Vô hình',
    nguyenGia: 18000000,
    giaMuaGoc: 18000000,
    cuocVanChuyen: 0,
    chiPhiChayThu: 0,
    soHieuKyThuat: 'HHMAPS-60-HARDKEY-0023',
    cheDoKiemTra: 'Kiểm tra bản quyền định kỳ 12 tháng/lần',
    salvage: 0,
    ghiDe: 'TSCĐ vô hình',
    phanLoaiGiaTri: 'TSCĐ vô hình',
    softwareId: 'PM/2025/0007',
    am: 'AM04',
    method: 'Tuyến tính',
    factor: 2,
    soKy: 24,
    kyHan: 'Tháng',
    prorata: 'Từ ngày mua',
    tkTS: '2135',
    tkHM: '2143',
    tkCP: '6424',
    journal: 'MISC — Bút toán khác',
    ngayMua: '2024-08-10',
    soThang: 24,
    ngayBD: '2024-09-01',
    pbQuanLy: 'QLVP',
    pbsd: 'QLCL',
    nguoi: 'Phạm Quốc Hùng (Trưởng nhóm Trắc địa)',
    tinhTrang: 'Đang khai thác tốt',
    nguonGoc: 'Bản quyền phần mềm mua vĩnh viễn (PM/2025/0007)',
    ct: 'HĐ-HH/2024/TEDI-011',
    bill: 'HĐ-HH/2024/TEDI-011',
    state: 'Đang chạy',
    trangThai: 'Đang sử dụng',
    computed: true,
    board: [],
    lichSu: [{ ngay: '2024-08-10', vc: 'Ghi nhận TSCĐ vô hình từ Hợp đồng mua bản quyền HHMaps v6 vĩnh viễn' }]
  }
];

export const INITIAL_SUPPLIES: SuppliesStockItem[] = [
  { ma: 'VT/2026/0001', ten: 'Mực in laser', dvt: 'Hộp', tonKho: 18, dangMuon: 0, giu: { 'QLCL': 6, 'CL-KD': 4 }, tonToiThieu: 10, donGia: 165000, nhom: 'Vật tư tiêu hao', viTri: 'Kho A - Kệ A1', lo: 'L2026-06', hanSuDung: '2028-06-30' },
  { ma: 'CC/2026/0002', ten: 'Bàn làm việc', dvt: 'Cái', tonKho: 3, dangMuon: 0, giu: { 'QLVP': 7 }, tonToiThieu: 5, donGia: 2600000, nhom: 'CCDC', viTri: 'Kho B - Bãi C' },
  { ma: 'VT/2026/0003', ten: 'Giấy A4 80gsm', dvt: 'Hộp', tonKho: 52, dangMuon: 0, giu: { 'QLVP': 8, 'QLCL': 5 }, tonToiThieu: 20, donGia: 95000, nhom: 'Vật tư tiêu hao', viTri: 'Kho A - Kệ A2' },
  { ma: 'TB/2026/0004', ten: 'Máy toàn đạc Leica TS07 (Hiện trường)', dvt: 'Bộ', tonKho: 2, dangMuon: 1, giu: {}, tonToiThieu: 1, donGia: 180000000, nhom: 'Thiết bị khảo sát', viTri: 'Kho Thiết bị - Tủ TB01', lo: 'SN-78411', hanSuDung: '2031-12-31' },
  { ma: 'TB/2026/0005', ten: 'Máy định vị GPS RTK Foif A90', dvt: 'Bộ', tonKho: 3, dangMuon: 0, giu: {}, tonToiThieu: 1, donGia: 95000000, nhom: 'Thiết bị khảo sát', viTri: 'Kho Thiết bị - Tủ TB02' }
];

export const INITIAL_EQUIPMENT_LOANS: EquipmentLoanRecord[] = [
  {
    id: 'PM/2026/0001',
    ngayMuon: '2026-08-01',
    nguoiMuon: 'Trần Văn Nam',
    donVi: 'QLCL',
    duAn: 'Khảo sát địa chất tuyến ĐT.741',
    diaDiem: 'Tuyến ĐT.741, Bình Dương',
    ngayDuKienTra: '2026-08-15',
    thietBi: [{ ma: 'TB/2026/0004', ten: 'Máy toàn đạc Leica TS07 (Hiện trường)', dvt: 'Bộ', sl: 1, maCoDinh: 'TS/2024/0007' }],
    tinhTrangKhiMuon: 'Nguyên vẹn, kèm chân máy và sạc chính hãng',
    trangThai: 'Đang mượn',
    thuKho: 'Nguyễn Văn Hùng (Thủ kho)'
  },
  {
    id: 'PM/2026/0002',
    ngayMuon: '2026-07-15',
    nguoiMuon: 'Phạm Đình Khoa',
    donVi: 'QLCL',
    duAn: 'Đo vẽ địa hình Cầu Bình Lợi',
    diaDiem: 'TP. Hồ Chí Minh',
    ngayDuKienTra: '2026-07-30',
    ngayTraThucTe: '2026-07-29',
    thietBi: [{ ma: 'TB/2026/0005', ten: 'Máy định vị GPS RTK Foif A90', dvt: 'Bộ', sl: 1 }],
    tinhTrangKhiMuon: 'Nguyên vẹn',
    tinhTrangKhiTra: 'Nguyên vẹn',
    trangThai: 'Đã trả',
    thuKho: 'Nguyễn Văn Hùng (Thủ kho)'
  }
];

export const INITIAL_SUPPLIER_POST_EVALS: SupplierPostEval[] = [
  {
    id: 'ĐG-SAU/2026/001',
    loai: 'Nhà cung ứng / Nhà thầu phụ',
    doiTuong: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    hd: 'HD/2026/014',
    ngayEval: '2026-07-30',
    nguoiEval: 'Lê Minh Quân (Chủ nhiệm dự án)',
    duAn: 'Mua sắm máy photocopy đa năng QLVP',
    diem: 4.5,
    tieuChi: [
      { ten: '1. Hiểu thị trường & Khách hàng', diem: 4.5, trongSo: 0.15 },
      { ten: '2. Uy tín & Kinh nghiệm', diem: 4.5, trongSo: 0.20 },
      { ten: '3. Năng lực nguồn lực & thiết bị', diem: 4.0, trongSo: 0.15 },
      { ten: '4. Chất lượng sản phẩm', diem: 5.0, trongSo: 0.25 },
      { ten: '5. Giá thành sản phẩm', diem: 4.0, trongSo: 0.15 },
      { ten: '6. Tinh thần hợp tác', diem: 5.0, trongSo: 0.10 }
    ],
    nhanXet: 'Giao hàng đúng tiến độ, hỗ trợ chạy thử và hướng dẫn vận hành nhiệt tình.',
    ketLuan: 'Khuyến nghị tiếp tục hợp tác'
  },
  {
    id: 'ĐG-SAU/2026/002',
    loai: 'Chuyên gia',
    doiTuong: 'Nguyễn Văn Hoàng (Chuyên gia Địa kỹ thuật)',
    hd: 'HĐCG/2026/003',
    ngayEval: '2026-08-05',
    nguoiEval: 'Phạm Thị Lan (Phụ trách QLCL)',
    duAn: 'Khảo sát địa chất tuyến ĐT.741',
    diem: 4.8,
    tieuChi: [
      { ten: 'Chất lượng thực hiện', diem: 5.0, trongSo: 0.40 },
      { ten: 'Trách nhiệm thực hiện', diem: 4.5, trongSo: 0.30 },
      { ten: 'Tinh thần hợp tác', diem: 5.0, trongSo: 0.30 }
    ],
    nhanXet: 'Hồ sơ đánh giá địa chất mạch lạc, hỗ trợ bảo vệ kết quả khảo sát với đại diện chủ đầu tư.',
    ketLuan: 'Khuyến nghị tiếp tục hợp tác'
  }
];

export const INITIAL_SUPPLIES_ISSUANCE: SuppliesIssuance[] = [
  {
    id: 'DN/2026/0011',
    ngay: '2026-08-05',
    pb: 'QLCL',
    nguoi: 'Phạm Thị Lan',
    lyDo: 'Sản xuất',
    chiPhi: 'Phòng ban',
    lines: [{ ten: 'Mực in laser', dvt: 'Hộp', slDN: 6, slCap: 6 }],
    trangThai: 'Đã cấp'
  }
];

export const INITIAL_RFQS: RequestForQuotation[] = [{
  id: 'YCBG/2026/003',
  dx: 'DXMS/2026/0003',
  ten: 'Máy chủ lưu trữ hồ sơ',
  trangThai: 'Đã nhận báo giá',
  ncu: [
    { ten: 'Công ty CP Tin học Hòa Bình', gia: 145000000, giao: '20 ngày', bh: '36 tháng', diem: 4.2 },
    { ten: 'Công ty TNHH Sao Việt', gia: 139000000, giao: '30 ngày', bh: '24 tháng', diem: 2.1 },
    { ten: 'Công ty CP Công nghệ Đại Nam', gia: 151000000, giao: '14 ngày', bh: '36 tháng', diem: 4.6 }
  ],
  chon: null,
  lyDo: ''
}];

export const INITIAL_CONTRACTS: ContractItem[] = [
  {
    id: 'HD/2026/014',
    loai: 'Mua bán TSCĐ',
    ncu: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    giaTri: 45000000,
    ngayKy: '2026-07-15',
    hieuLuc: '2026-07-15',
    hetHan: '2026-10-15',
    trangThai: 'Có hiệu lực',
    dx: 'DXMS/2026/0001'
  },
  {
    id: 'HD/2026/009',
    loai: 'Dịch vụ tư vấn',
    ncu: 'Viện Khảo sát Thiết kế Miền Bắc',
    giaTri: 320000000,
    ngayKy: '2026-04-02',
    hieuLuc: '2026-04-02',
    hetHan: '2026-09-02',
    trangThai: 'Có hiệu lực',
    dx: ''
  }
];

export const INITIAL_MAINTENANCE_TASKS: MaintenanceTask[] = [
  { id: 'MR/2026/0001', ts: 'TS/2024/0007', loai: 'Kiểm định', hinhThuc: 'Thuê ngoài', chuKyLoai: 'Chu kỳ cố định', chuKy: 12, nsx: '12 tháng theo sổ tay Leica', lanGanNhat: '2025-06-15', doi: 'Trung tâm Kiểm định Đo lường 1', chiPhi: 4800000, giaiDoan: 'Mới', kq: '' },
  { id: 'MR/2026/0002', ts: 'TS/2026/0001', loai: 'Bảo dưỡng', hinhThuc: 'Thuê ngoài', chuKyLoai: 'Chu kỳ cố định', chuKy: 6, nsx: '6 tháng hoặc 20.000 bản in', lanGanNhat: '2026-03-05', doi: 'Minh Long — theo hợp đồng bảo hành', chiPhi: 0, giaiDoan: 'Đang thực hiện', kq: '' },
  { id: 'MR/2026/0003', ts: 'CC/2026/0003', loai: 'Bảo dưỡng', hinhThuc: 'Tự thực hiện', chuKyLoai: 'Chu kỳ cố định', chuKy: 6, nsx: '', lanGanNhat: '2026-02-20', doi: 'Tổ kỹ thuật QLVP', chiPhi: 0, giaiDoan: 'Mới', kq: '' },
  { id: 'MR/2026/0004', ts: 'TS/2024/0007', loai: 'Hiệu chỉnh', hinhThuc: 'Thuê ngoài', chuKyLoai: 'Khuyến cáo NSX', chuKy: 24, nsx: '24 tháng — khuyến cáo nhà sản xuất', lanGanNhat: '2025-08-30', doi: 'Leica Geosystems VN', chiPhi: 6500000, giaiDoan: 'Đạt', kq: 'Sai số nằm trong dung sai cho phép, đã dán tem hiệu chỉnh.' }
];

export const INITIAL_INCIDENT_REPORTS: IncidentReport[] = [
  { id: 'BH/2026/0001', ngay: '2026-08-08', nguoiBao: 'Trần Văn Nam', ts: 'TS/2026/0001', mucDo: 'Trung bình', moTa: 'Kẹt giấy liên tục ở khay 2, màn hình báo lỗi E-045. Vẫn in được từ khay 1 nhưng chậm.', anh: ['IMG_2431.jpg', 'IMG_2432.jpg'], giaiDoan: 'Đang sửa chữa', nguoiNhan: 'Tổ kỹ thuật QLVP', hinhThuc: 'Thuê ngoài', donVi: 'Minh Long — trong thời hạn bảo hành', chiPhi: 0, ngayXong: '', kq: '' },
  { id: 'BH/2026/0002', ngay: '2026-08-04', nguoiBao: 'Nguyễn Thị Mai', ts: 'CC/2026/0003', mucDo: 'Thấp', moTa: 'Máy in không nhận giấy, con lăn cuốn giấy mòn.', anh: ['IMG_2410.jpg'], giaiDoan: 'Đã sửa xong', nguoiNhan: 'Tổ kỹ thuật QLVP', hinhThuc: 'Nội bộ', donVi: 'Tổ kỹ thuật QLVP', chiPhi: 450000, ngayXong: '2026-08-06', kq: 'Đã thay con lăn, máy in hoạt động bình thường.' },
  { id: 'BH/2026/0003', ngay: '2026-08-11', nguoiBao: 'Phạm Thị Lan', ts: 'TS/2024/0007', mucDo: 'Nghiêm trọng', moTa: 'Máy rơi khi đo tại hiện trường tuyến ĐT.741, bọt thủy vỡ, ống kính bị xước. Không đo được.', anh: ['IMG_2455.jpg'], giaiDoan: 'Mới báo hỏng', nguoiNhan: '', hinhThuc: '', donVi: '', chiPhi: 0, ngayXong: '', kq: '' }
];

export const INITIAL_WORK_BUDGETS: WorkBudget[] = [
  {
    id: 'DT/2026/0001',
    ngay: '2026-04-10',
    loaiCV: 'Sửa chữa lớn',
    truongHop: 'Nâng cấp TS cũ',
    hangMuc: 'TS/2026/0001',
    hangMucTS: 'TS/2026/0001',
    tenHangMuc: 'Chống thấm toàn bộ mái & Nâng cấp tầng kỹ thuật Nhà văn phòng TEDI',
    lyDo: 'Mái nhà văn phòng 10 tầng ngấm dột, hệ thống thoát nước sân thượng xuống cấp gây thấm trần tầng 10.',
    donViDeXuat: 'Phòng QLVP',
    nguoiDeXuat: 'Trần Thu Hà',
    tongDuToan: 185000000,
    thamQuyenDuyet: 'Tổng Giám đốc (≤ Y)',
    ngayDuyet: '2026-04-15',
    nguoiDuyet: 'Nguyễn Đức Thắng (Tổng Giám đốc)',
    nhaThau: 'Công ty CP Xây dựng & Chống thấm Bách Khoa',
    hopDong: 'HĐ-XDCB/2026/004',
    ngayKyHD: '2026-04-20',
    giaTriHD: 182000000,
    ngayKhoiCong: '2026-04-25',
    ngayDuKienXong: '2026-06-30',
    ngayXong: '2026-06-28',
    tienDoThiCong: 100,
    nhatKyThiCong: [
      { ngay: '2026-04-25', noiDung: 'Bàn giao mặt bằng thi công sân thượng & đục tẩy lớp vữa cũ', nguoiGhi: 'Giám sát QLVP' },
      { ngay: '2026-05-15', noiDung: 'Thi công 3 lớp màng chống thấm khò nóng Sika & thử nước 48h', nguoiGhi: 'Kỹ sư Bách Khoa' },
      { ngay: '2026-06-25', noiDung: 'Láng vữa bảo vệ M100, hoàn thiện thoát nước mái & dọn vệ sinh', nguoiGhi: 'Chỉ huy trưởng' }
    ],
    ngayNghiemThu: '2026-06-30',
    hoiDongNghiemThu: 'Hội đồng Nghiệm thu TEDI (TGĐ Thắng, QLVP Hà, Kế toán Linh)',
    danhGiaNghiemThu: 'Đạt yêu cầu kỹ thuật',
    bienBanNghiemThuSo: 'BBNT-08/2026/TEDI',
    quyetToan: 180000000,
    ngayQuyetToan: '2026-07-05',
    chenhLechQuyetToan: -5000000, // Tiết kiệm 5tr so với dự toán
    fastStatus: 'Đã ghi sổ FAST',
    fastMaTS: 'TS/2026/0001',
    fastLoaiGhiNhan: 'Ghi tăng nguyên giá TS cũ',
    fastNgayGhiSo: '2026-07-06',
    baoHanh: '24 tháng',
    ngayBatDauBH: '2026-07-01',
    ngayHetHanBH: '2028-07-01',
    noiDungBH: 'Bảo hành không thấm dột, nứt tách màng chống thấm toàn bộ mặt mái.',
    yeuCauBaoHanhLichSu: [],
    trangThai: 'Bảo hành',
    lines: [
      { id: 'A', cha: null, ten: 'I. Phá dỡ & Xử lý bề mặt bê tông cũ', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'A1', cha: 'A', ten: 'Đục tẩy lớp gạch và vữa láng cũ dày 5cm', dvt: 'm²', kl: 350, gia: 65000, klThucTe: 350, giaThucTe: 65000 },
      { id: 'A2', cha: 'A', ten: 'Vận chuyển phế thải xây dựng xuống đất & đổ đi', dvt: 'Chuyến', kl: 12, gia: 850000, klThucTe: 12, giaThucTe: 850000 },
      { id: 'B', cha: null, ten: 'II. Thi công hệ thống chống thấm chuyên dụng', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'B1', cha: 'B', ten: 'Quét lót Primer & dán màng khò nóng Sika dày 4mm', dvt: 'm²', kl: 350, gia: 320000, klThucTe: 350, giaThucTe: 310000 },
      { id: 'B2', cha: 'B', ten: 'Láng vữa xi măng M100 dày 3cm tạo dốc thoát nước', dvt: 'm²', kl: 350, gia: 85000, klThucTe: 350, giaThucTe: 85000 },
      { id: 'B3', cha: 'B', ten: 'Thay mới phễu thu nước Inox D110 & phụ kiện co nối', dvt: 'Bộ', kl: 8, gia: 1250000, klThucTe: 8, giaThucTe: 1150000 }
    ]
  },
  {
    id: 'DT/2026/0002',
    ngay: '2026-06-15',
    loaiCV: 'Xây mới',
    truongHop: 'Xây dựng hạng mục mới',
    hangMuc: '',
    hangMucTS: null,
    tenHangMuc: 'Xây dựng Tường rào bảo vệ & Cổng trượt tự động cơ sở 2',
    lyDo: 'Khu đất Cơ sở 2 TEDI chưa có tường bao kiên cố, cần xây dựng mới đảm bảo an ninh bảo vệ tài sản máy móc thiết bị.',
    donViDeXuat: 'Ban Quản lý Cơ sở 2',
    nguoiDeXuat: 'Lê Văn Minh',
    tongDuToan: 245000000,
    thamQuyenDuyet: 'Tổng Giám đốc (≤ Y)',
    ngayDuyet: '2026-06-20',
    nguoiDuyet: 'Nguyễn Đức Thắng (Tổng Giám đốc)',
    nhaThau: 'Công ty TNHH Cơ khí & Xây dựng Trường An',
    hopDong: 'HĐ-XDCB/2026/007',
    ngayKyHD: '2026-06-25',
    giaTriHD: 240000000,
    ngayKhoiCong: '2026-07-01',
    ngayDuKienXong: '2026-09-15',
    ngayXong: '',
    tienDoThiCong: 75,
    nhatKyThiCong: [
      { ngay: '2026-07-05', noiDung: 'Đào móng tường rào 120m và đổ bê tông lót M100', nguoiGhi: 'Kỹ thuật Minh' },
      { ngay: '2026-07-28', noiDung: 'Xây tường gạch đặc VXM M75 cao 2.2m và đắp trụ bê tông', nguoiGhi: 'Tổ trưởng Trường An' },
      { ngay: '2026-08-10', noiDung: 'Lắp đặt ray trượt cổng và dựng khung thép hộp mạ kẽm', nguoiGhi: 'Đội cơ khí' }
    ],
    ngayNghiemThu: '',
    hoiDongNghiemThu: '',
    danhGiaNghiemThu: undefined,
    bienBanNghiemThuSo: '',
    quyetToan: 0,
    ngayQuyetToan: '',
    chenhLechQuyetToan: 0,
    fastStatus: 'Chưa gửi',
    fastMaTS: '',
    fastLoaiGhiNhan: 'Ghi tăng tài sản mới',
    baoHanh: '12 tháng',
    noiDungBH: 'Bảo hành kết cấu tường rào và motor cổng trượt tự động.',
    yeuCauBaoHanhLichSu: [],
    trangThai: 'Đang thi công',
    lines: [
      { id: 'A', cha: null, ten: 'I. Kết cấu móng và thân tường rào (120m)', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'A1', cha: 'A', ten: 'Đào đất móng tường rào và hố móng trụ', dvt: 'm³', kl: 65, gia: 120000, klThucTe: 65, giaThucTe: 120000 },
      { id: 'A2', cha: 'A', ten: 'Bê tông lót móng M100 & bê tông giằng M200', dvt: 'm³', kl: 24, gia: 1450000, klThucTe: 24, giaThucTe: 1450000 },
      { id: 'A3', cha: 'A', ten: 'Xây tường gạch đặc không nung dày 220mm, trát VXM M75', dvt: 'm²', kl: 264, gia: 420000, klThucTe: 264, giaThucTe: 420000 },
      { id: 'B', cha: null, ten: 'II. Hệ thống Cổng sắt & Motor điều khiển tự động', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'B1', cha: 'B', ten: 'Khung cổng sắt hộp mạ kẽm sơn tĩnh điện (Rộng 6m x Cao 2.4m)', dvt: 'Bộ', kl: 1, gia: 38000000, klThucTe: 1, giaThucTe: 38000000 },
      { id: 'B2', cha: 'B', ten: 'Motor trượt tự động tải trọng 1500kg kèm cảm biến & 4 Remote', dvt: 'Bộ', kl: 1, gia: 28000000, klThucTe: 1, giaThucTe: 28000000 }
    ]
  },
  {
    id: 'DT/2026/0003',
    ngay: '2026-08-05',
    loaiCV: 'Cải tạo',
    truongHop: 'Xây dựng hạng mục mới',
    hangMuc: '',
    hangMucTS: null,
    tenHangMuc: 'Cải tạo giếng thang & Lắp đặt Thang máy số 3 Tòa nhà TEDI',
    lyDo: 'Lưu lượng di chuyển cán bộ kỹ sư và khách hàng tăng cao, cần bổ sung thang máy chuyên dụng tốc độ cao 1.75m/s.',
    donViDeXuat: 'Phòng QLVP',
    nguoiDeXuat: 'Trần Thu Hà',
    tongDuToan: 650000000,
    thamQuyenDuyet: 'HĐQT (> Y)',
    ngayDuyet: '',
    nguoiDuyet: '',
    nhaThau: 'Công ty CP Thang máy & Thiết bị Schindler VN',
    hopDong: '',
    ngayXong: '',
    tienDoThiCong: 0,
    nhatKyThiCong: [],
    quyetToan: 0,
    fastStatus: 'Chưa gửi',
    fastLoaiGhiNhan: 'Ghi tăng tài sản mới',
    baoHanh: '24 tháng',
    noiDungBH: 'Bảo hành cơ điện, cáp tải và mạch điều khiển PLC thang máy.',
    yeuCauBaoHanhLichSu: [],
    trangThai: 'Chờ phê duyệt',
    lines: [
      { id: 'A', cha: null, ten: 'I. Gia cố kết cấu hố thang & Phòng máy', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'A1', cha: 'A', ten: 'Gia cố dầm thép chịu lực đáy hố pít và phòng máy đỉnh', dvt: 'Tấn', kl: 3.5, gia: 35000000, klThucTe: 0, giaThucTe: 0 },
      { id: 'B', cha: null, ten: 'II. Thiết bị Thang máy Schindler 1000kg (10 điểm dừng)', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'B1', cha: 'B', ten: 'Trọn bộ thang máy 1000kg 10 stops, cabin inox gương, biến tần VVVF', dvt: 'Bộ', kl: 1, gia: 527500000, klThucTe: 0, giaThucTe: 0 }
    ]
  },
  {
    id: 'DT/2026/0004',
    ngay: '2026-07-20',
    loaiCV: 'Nâng cấp',
    truongHop: 'Nâng cấp TS cũ',
    hangMuc: 'TS/2024/0007',
    hangMucTS: 'TS/2024/0007',
    tenHangMuc: 'Cải tạo & Nâng cấp Hệ thống PCCC Nhà xưởng Thí nghiệm LAS-XD',
    lyDo: 'Nâng cấp hệ thống báo cháy tự động và vách ngăn chống cháy theo tiêu chuẩn QCVN 06:2022/BXD.',
    donViDeXuat: 'Phòng QLCL',
    nguoiDeXuat: 'Phạm Thị Lan',
    tongDuToan: 95000000,
    thamQuyenDuyet: 'Tổng Giám đốc (≤ Y)',
    ngayDuyet: '2026-07-25',
    nguoiDuyet: 'Nguyễn Đức Thắng (Tổng Giám đốc)',
    nhaThau: 'Công ty TNHH Kỹ thuật PCCC Hà Nội',
    hopDong: 'HĐ-PCCC/2026/012',
    ngayKyHD: '2026-08-01',
    giaTriHD: 95000000,
    ngayKhoiCong: '2026-08-05',
    ngayDuKienXong: '2026-08-25',
    ngayXong: '',
    tienDoThiCong: 30,
    nhatKyThiCong: [
      { ngay: '2026-08-05', noiDung: 'Tập kết đầu báo khói Beam quang học & tủ trung tâm 8 kênh', nguoiGhi: 'QLCL Lan' }
    ],
    quyetToan: 0,
    fastStatus: 'Chưa gửi',
    fastLoaiGhiNhan: 'Ghi tăng nguyên giá TS cũ',
    baoHanh: '18 tháng',
    noiDungBH: 'Bảo hành đầu báo beam, đường dây tín hiệu và nghiệm thu PCCC công an.',
    yeuCauBaoHanhLichSu: [],
    trangThai: 'Đang thi công',
    lines: [
      { id: 'A', cha: null, ten: 'I. Thiết bị báo cháy tự động địa chỉ', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'A1', cha: 'A', ten: 'Tủ trung tâm báo cháy địa chỉ 1 Loop', dvt: 'Bộ', kl: 1, gia: 25000000, klThucTe: 0, giaThucTe: 0 },
      { id: 'A2', cha: 'A', ten: 'Đầu báo khói quang địa chỉ kèm đế', dvt: 'Chiếc', kl: 32, gia: 650000, klThucTe: 0, giaThucTe: 0 },
      { id: 'B', cha: null, ten: 'II. Đường ống & Hệ thống chữa cháy khí FM200 phòng máy chủ', dvt: '', kl: 0, gia: 0, klThucTe: 0, giaThucTe: 0 },
      { id: 'B1', cha: 'B', ten: 'Bình khí FM200 dung tích 70L kèm van điện từ kích hoạt', dvt: 'Bình', kl: 1, gia: 49200000, klThucTe: 0, giaThucTe: 0 }
    ]
  }
];

export const INITIAL_EXPERTS: ExpertCandidate[] = [
  { id: 'CG/2026/0001', ten: 'Nguyễn Văn Hoàng', linhVuc: 'Địa kỹ thuật — nền móng', namKN: 18, soCT: 24, hocVi: 'Tiến sĩ', phi: 45000000, duAn: 'Khảo sát địa chất tuyến ĐT.741', ho: { don: true, lyLich: true, khoaHoc: true, chungChi: true }, giaiDoan: 'Đủ hồ sơ', lyDo: '' },
  { id: 'CG/2026/0002', ten: 'Trần Quốc Bảo', linhVuc: 'Kết cấu cầu', namKN: 12, soCT: 15, hocVi: 'Thạc sĩ', phi: 38000000, duAn: 'Khảo sát địa chất tuyến ĐT.741', ho: { don: true, lyLich: true, khoaHoc: false, chungChi: true }, giaiDoan: 'Chưa đủ hồ sơ', lyDo: '' },
  { id: 'CG/2026/0003', ten: 'Lê Thị Hồng Nhung', linhVuc: 'Môi trường — ĐTM', namKN: 9, soCT: 11, hocVi: 'Thạc sĩ', phi: 30000000, duAn: 'Khảo sát địa chất tuyến ĐT.741', ho: { don: true, lyLich: true, khoaHoc: true, chungChi: true }, giaiDoan: 'Đề xuất lựa chọn', lyDo: 'Đủ hồ sơ, mức phí thấp nhất, đã cộng tác 2 dự án ĐTM năm 2025.' },
  { id: 'CG/2026/0004', ten: 'Phạm Đình Khoa', linhVuc: 'Thủy văn — thoát nước', namKN: 22, soCT: 31, hocVi: 'Tiến sĩ', phi: 60000000, duAn: 'Khảo sát địa chất tuyến ĐT.741', ho: { don: true, lyLich: false, khoaHoc: false, chungChi: true }, giaiDoan: 'Chưa đủ hồ sơ', lyDo: '' }
];

export const INITIAL_PRE_CONTRACT_EVALS: PreContractVendorEval[] = [
  {
    id: 'DG/2026/0002', ngay: '2026-08-06', goiThau: 'Máy chủ lưu trữ hồ sơ thiết kế', dx: 'DXMS/2026/0003',
    nguoiDG: 'Trần Thu Hà (QLVP)', nguoiPD: 'Nguyễn Đức Thắng', trangThai: 'Nháp',
    canKH: false, thuCT: '', chon: null,
    ncu: [
      { ten: 'Công ty CP Tin học Hòa Bình', diem: [4, 5, 4, 4, 3, 4] },
      { ten: 'Công ty TNHH Sao Việt', diem: [2, 2, 3, 2, 4, 3] },
      { ten: 'Công ty CP Công nghệ Đại Nam', diem: [4, 4, 5, 5, 3, 4] }
    ]
  }
];

export const INITIAL_DELIVERABLES: DeliverableAcceptance[] = [
  {
    id: 'NT/2026/0001', hd: 'HD/2026/009', ncu: 'Viện Khảo sát Thiết kế Miền Bắc', ngayNhan: '2026-08-03',
    moTa: 'Hồ sơ khảo sát địa chất tuyến ĐT.741: 3 tập báo cáo chính, 1 phụ lục kết quả thí nghiệm mẫu, bản vẽ mặt cắt địa chất.',
    phongKT: 'QLCL', nhanXet: 'Thiếu 2 hố khoan so với nhiệm vụ khảo sát đã duyệt, số liệu SPT tập 2 chưa khớp phụ lục.',
    kcs: '', yeuCau: '', ngayBanGiao: '', nguoiNhan: '', trangThai: 'Chờ kết quả QLCL',
    files: [
      { ten: 'BaoCaoKhaoSat_DT741_tap1-3.pdf', v: 2, ngay: '2026-08-10', nguoi: 'NCU nộp lại', tt: 'Đang xem xét' },
      { ten: 'BaoCaoKhaoSat_DT741_tap1-3.pdf', v: 1, ngay: '2026-08-03', nguoi: 'NCU', tt: 'Bị trả lại' },
      { ten: 'PhuLuc_ThiNghiemMau.xlsx', v: 1, ngay: '2026-08-03', nguoi: 'NCU', tt: 'Được chấp nhận' },
      { ten: 'MatCatDiaChat_DT741.dwg', v: 1, ngay: '2026-08-03', nguoi: 'NCU', tt: 'Đang xem xét' }
    ]
  }
];

export const INITIAL_TRANSFERS: AssetTransferRecord[] = [
  {
    id: 'ĐCTS/2026/0001',
    ngay: '2026-08-02',
    ts: 'CC/2026/0003',
    tuPB: 'QLVP',
    tuNguoi: 'Nguyễn Thị Mai',
    denPB: 'QLCL',
    denNguoi: 'Phạm Thị Lan',
    lyDo: 'Điều chuyển phục vụ tổ khảo sát hiện trường',
    trangThai: 'Đã hoàn thành',
    loaiDieuChuyen: 'Nội bộ (Cùng pháp nhân)',
    canCuLoai: 'Quyết định phân công',
    soQuyetDinh: 'QĐ-102/2026/TEDI',
    ngayQuyetDinh: '2026-08-01',
    viTriMoi: 'Phòng Thí nghiệm QLCL',
    doiTuongChiPhiMoi: 'Dự án Khảo sát Tuyến ĐT.741'
  },
  {
    id: 'ĐCTS/2026/0002',
    ngay: '2026-08-10',
    ts: 'TS/2026/0001',
    tuPB: 'CL-KD',
    tuNguoi: 'Trần Văn Nam',
    denPB: 'QLVP',
    denNguoi: 'Trần Thu Hà',
    lyDo: 'Gom thiết bị in ấn về phòng văn thư',
    trangThai: 'Chờ phê duyệt',
    loaiDieuChuyen: 'Nội bộ (Cùng pháp nhân)',
    canCuLoai: 'Thay đổi nhu cầu',
    soQuyetDinh: 'QĐ-118/2026/TEDI',
    ngayQuyetDinh: '2026-08-09',
    viTriMoi: 'Văn thư - QLVP',
    doiTuongChiPhiMoi: 'Chi phí Quản lý VP (6424)'
  }
];

export const INITIAL_HANDOVER_SLIPS: HandoverSlip[] = [
  {
    id: 'PBG/2026/0001',
    dx: 'DXMS/2026/0001',
    hopDong: 'HD/2026/014',
    ncu: 'Công ty TNHH Thiết bị Văn phòng Minh Long',
    chuyenTu: 'Kho Tổng TEDI B2 - Dãy B1',
    chuyenDen: 'Trung tâm Thí nghiệm và Kiểm định CLCT (CL-KD)',
    nghiemThu: 'Đạt',
    lyDoDieuChuyen: 'Bàn giao thiết bị mua sắm mới theo Hợp đồng HD/2026/014 & Đề xuất DXMS/2026/0001',
    loaiPhieu: 'Nhận hàng & Bàn giao kho',
    nguoiYeuCau: 'Trần Văn Nam',
    nguoiXacNhanDC: 'Trần Thu Hà (Trưởng phòng QLTS)',
    nguoiTiepNhan: 'Trần Văn Nam (Cán bộ phụ trách)',
    ngayTao: '28/07/2026 10:30:00',
    trangThai: 'Đã bàn giao',
    lines: [
      {
        id: 'L-01',
        ten: 'Máy photocopy đa năng Ricoh MP 5055',
        tsTen: 'Máy photocopy đa năng Ricoh MP 5055 [TS/2026/0001]',
        dvt: 'Cái',
        slDat: 1,
        slNhan: 1,
        soLuong: 1,
        slTon: 1,
        gia: 42000000,
        phi: 3000000,
        ts: 'TS/2026/0001',
        tsId: 'TS/2026/0001',
        pb: 'CL-KD',
        viTriMoi: 'Phòng CL-KD - Tầng 4 TEDI Tower',
        nguoi: 'Trần Văn Nam',
        soSerial: 'RICOH-MP-5055-VN992',
        nhom: 'Thiết bị quản lý văn phòng (TBVP)',
        viTriHienTai: 'Kho Tổng TEDI B2',
        phanLoai: 'Tài sản cố định (TSCĐ)',
        ghiChu: 'Kèm đầy đủ dây nguồn, cáp LAN mạng, đĩa Driver và 02 hộp mực dự phòng'
      }
    ],
    attachments: [
      { id: 'att-1', name: 'Bien_Ban_Nghiem_Thu_KCS_MinhLong.pdf', size: '1.4 MB', date: '28/07/2026', type: 'PDF' },
      { id: 'att-2', name: 'Hoa_Don_VAT_Hop_Dong_HD014.pdf', size: '680 KB', date: '28/07/2026', type: 'PDF' }
    ]
  },
  {
    id: 'BGCP/180826/00007',
    dx: 'DXMS/2026/0002',
    hopDong: 'HD/2026/009',
    ncu: 'Công ty CP Thiết bị Đo đạc & Trắc địa Sài Gòn',
    chuyenTu: 'Kho Thiết bị Đo đạc TEDI',
    chuyenDen: 'Phòng Quản lý Chất lượng (QLCL)',
    nghiemThu: 'Đạt',
    lyDoDieuChuyen: 'Bàn giao thiết bị đo đạc khảo sát và máy in cho cán bộ phục vụ dự án mới',
    loaiPhieu: 'Bàn giao mua sắm mới',
    nguoiYeuCau: 'Phạm Thị Lan',
    nguoiXacNhanDC: 'Lê Minh Quân (Phó Giám đốc)',
    nguoiTiepNhan: 'Phạm Thị Lan (Trưởng phòng QLCL)',
    ngayTao: '18/08/2026 14:15:30',
    trangThai: 'Chờ phê duyệt',
    lines: [
      {
        id: 'L-02',
        ten: 'Máy toàn đạc điện tử Leica FlexLine TS07',
        tsTen: 'Máy toàn đạc điện tử Leica FlexLine TS07 [TS/2024/0007]',
        dvt: 'Bộ',
        slDat: 1,
        slNhan: 1,
        soLuong: 1,
        slTon: 1,
        gia: 182000000,
        phi: 4000000,
        ts: 'TS/2024/0007',
        tsId: 'TS/2024/0007',
        pb: 'QLCL',
        viTriMoi: 'Phòng Thí nghiệm Hiện trường LAS-XD',
        nguoi: 'Phạm Thị Lan',
        soSerial: 'LEICA-TS07-SN78411',
        nhom: 'Máy móc, thiết bị đo đạc chuyên dùng (MMTB)',
        viTriHienTai: 'Kho Thiết bị Đo đạc TEDI',
        phanLoai: 'Tài sản cố định (TSCĐ)',
        ghiChu: 'Kèm gương đơn, chân nhôm, 02 pin Li-ion và cáp trút số liệu USB'
      },
      {
        id: 'L-03',
        ten: 'Máy in laser A4 Canon LBP 2900B',
        tsTen: 'Máy in laser A4 Canon LBP 2900B [CC/2026/0003]',
        dvt: 'Chiếc',
        slDat: 2,
        slNhan: 2,
        soLuong: 2,
        slTon: 4,
        gia: 8200000,
        phi: 200000,
        ts: null,
        tsId: 'CC/2026/0003',
        pb: 'QLCL',
        viTriMoi: 'Phòng QLCL - Bàn tiếp nhận hồ sơ',
        nguoi: 'Nguyễn Thị Mai',
        soSerial: 'CANON-LBP-9821',
        nhom: 'Công cụ dụng cụ văn phòng (CCDC)',
        viTriHienTai: 'Kho TBVP TEDI',
        phanLoai: 'CCDC / Vật tư kho',
        ghiChu: 'Mới thay cartridge mực chính hãng Canon 303'
      }
    ],
    attachments: [
      { id: 'att-3', name: 'Giay_Chung_Nhan_Kiem_Dinh_Leica.pdf', size: '1.1 MB', date: '18/08/2026', type: 'PDF' },
      { id: 'att-4', name: 'Bien_Ban_Kiem_Tra_Hien_Trang_BGCP.docx', size: '420 KB', date: '18/08/2026', type: 'DOCX' }
    ]
  },
  {
    id: 'PBG/2026/00003',
    dx: 'DXMS/2026/0003',
    hopDong: 'HD/2026/021',
    ncu: 'Công ty CP Công nghệ & Tin học Đại Nam',
    chuyenTu: 'Kho Tổng TEDI B2',
    chuyenDen: 'Phòng Kế hoạch Kỹ thuật (KHKT)',
    nghiemThu: 'Đạt',
    lyDoDieuChuyen: 'Cấp phát máy trạm tính toán kết cấu SAP2000 & Mô hình hóa BIM',
    loaiPhieu: 'Cấp phát CCDC',
    nguoiYeuCau: 'Lê Hoàng Nam',
    nguoiXacNhanDC: 'Đỗ Mạnh Cường',
    nguoiTiepNhan: 'Vũ Quốc Khánh',
    ngayTao: '17/08/2026 09:30:00',
    trangThai: 'Đã hoàn thành',
    lines: [
      {
        id: 'L-21',
        ten: 'Máy trạm Workstation Dell Precision 3660',
        tsTen: 'Máy trạm Workstation Dell Precision 3660 [TS/2026/0008]',
        dvt: 'Bộ',
        slDat: 2,
        slNhan: 2,
        soLuong: 2,
        slTon: 4,
        gia: 65000000,
        phi: 1500000,
        ts: 'TS/2026/0008',
        tsId: 'TS/2026/0008',
        pb: 'QLVP',
        viTriMoi: 'Phòng KHKT - Bàn thiết kế kết cấu cầu',
        nguoi: 'Vũ Quốc Khánh',
        soSerial: 'DELL-WS-99882',
        nhom: 'Thiết bị CNTT / Máy trạm đồ họa',
        viTriHienTai: 'Kho Tổng TEDI B2',
        phanLoai: 'Tài sản cố định (TSCĐ)',
        ghiChu: 'Cấu hình Intel Core i7-13700, 64GB RAM, SSD 1TB NVMe, Card RTX A4000 16GB'
      }
    ],
    attachments: [
      { id: 'att-5', name: 'Phieu_Xuat_Kho_KHKT_2026.pdf', size: '520 KB', date: '17/08/2026', type: 'PDF' }
    ]
  }
];

export const INITIAL_AUDIT_LINES: AssetAuditLine[] = [
  { id: 'TS/2026/0001', ten: 'Máy photocopy đa năng Ricoh MP', pb: 'CL-KD', st: 'Đang chạy', so: 1, tt: 1, tinh: 'Tốt', xl: 'Giữ nguyên' },
  { id: 'TS/2024/0007', ten: 'Máy toàn đạc điện tử Leica TS07', pb: 'QLCL', st: 'Tạm dừng KH', so: 1, tt: 1, tinh: 'Hư hỏng', xl: 'Chuyển thanh lý' },
  { id: 'CC/2026/0003', ten: 'Máy in laser A4 Canon LBP', pb: 'QLVP', st: 'Đang chạy', so: 2, tt: 1, tinh: 'Mất', xl: 'Ghi giảm' },
  { id: 'CC/2025/0011', ten: 'Ghế xoay văn phòng', pb: 'QLVP', st: 'Đang chạy', so: 12, tt: 14, tinh: 'Tốt', xl: 'Ghi tăng' }
];

export const INITIAL_AUDIT_SESSIONS: AssetAuditSession[] = [
  {
    id: 'TEDI-KK/2026/0001',
    tenDot: 'Đợt kiểm kê tài sản cố định & CCDC định kỳ đầu năm 2026',
    loaiDot: 'Định kỳ (01/01)',
    ngayChot: '2026-01-01',
    phamViPB: 'Tất cả các đơn vị TEDI',
    hoiDong: 'Ông Nguyễn Văn A (Chủ tịch HĐ), Bà Trần Thị B (Ủy viên), Ông Lê Văn C (Thư ký)',
    kiemToanDocLap: 'Công ty Kiểm toán Độc lập AASC (Đại diện chứng kiến)',
    soQuyetDinh: 'QĐ-01/2026/TEDI',
    ngayQuyetDinh: '2025-12-25',
    trangThai: 'Đã hoàn thành',
    lines: INITIAL_AUDIT_LINES
  },
  {
    id: 'TEDI-KK/2026/0002',
    tenDot: 'Đợt kiểm kê đột xuất thiết bị khảo sát hiện trường QLCL',
    loaiDot: 'Đột xuất',
    ngayChot: '2026-08-10',
    phamViPB: 'Phòng Quản lý chất lượng (QLCL)',
    hoiDong: 'Ông Phạm Văn Nam (Chủ tịch HĐ), Bà Lê Thị Lan (Ủy viên)',
    kiemToanDocLap: 'N/A (Kiểm kê nội bộ phòng ban)',
    soQuyetDinh: 'QĐ-115/2026/TEDI',
    ngayQuyetDinh: '2026-08-08',
    trangThai: 'Chờ xử lý chênh lệch',
    lines: [
      { id: 'TS/2024/0007', ten: 'Máy toàn đạc điện tử Leica TS07', pb: 'QLCL', st: 'Đang chạy', so: 1, tt: 1, tinh: 'Hư hỏng', xl: 'Chuyển thanh lý' },
      { id: 'CC/2026/0003', ten: 'Máy in laser A4 Canon LBP', pb: 'QLCL', st: 'Đang chạy', so: 1, tt: 1, tinh: 'Tốt', xl: 'Giữ nguyên' }
    ]
  }
];

export const INITIAL_DISPOSALS: AssetDisposalRecord[] = [
  {
    id: 'TL/2026/0001',
    ngay: '2026-08-01',
    ts: 'CC/2025/0004',
    ten: 'Máy chiếu Epson EB-X05',
    nguyenGia: 14500000,
    daKH: 14500000,
    conLai: 0,
    dinhGia: 1200000,
    chiPhiThanhLy: 150000,
    phongBan: 'QLVP',
    loaiThanhLy: 'Bán nhượng bán',
    soQuyetDinh: 'QĐ-TL/102/2026/TEDI',
    ngayQuyetDinh: '2026-07-28',
    hoiDongDinhGia: 'Hội đồng Định giá TEDI (Ông Nguyễn Văn A làm Chủ tịch)',
    soChungTuGhiGiam: 'PKT-GG/2026/0012',
    ngayGhiGiam: '2026-08-01',
    lyDo: 'Thiết bị đã hết thời hạn khấu hao, hỏng bóng đèn chiếu không thể khắc phục',
    trangThai: 'Đã hoàn thành'
  },
  {
    id: 'TL/2026/0002',
    ngay: '2026-08-05',
    ts: 'TS/2023/0002',
    ten: 'Xe ô tô tải Hyundai 1,5 tấn',
    nguyenGia: 520000000,
    daKH: 455000000,
    conLai: 65000000,
    dinhGia: 78000000,
    chiPhiThanhLy: 2000000,
    phongBan: 'QLCL',
    loaiThanhLy: 'Bán nhượng bán',
    soQuyetDinh: 'QĐ-TL/118/2026/TEDI',
    ngayQuyetDinh: '2026-08-03',
    hoiDongDinhGia: 'Hội đồng Định giá TEDI & Trung tâm Đăng kiểm',
    soChungTuGhiGiam: '',
    ngayGhiGiam: '',
    lyDo: 'Không đáp ứng tiêu chuẩn khí thải Euro 5 theo quy định mới, chi phí sửa chữa quá cao',
    trangThai: 'Đã phê duyệt'
  },
  {
    id: 'TL/2026/0003',
    ngay: '2026-08-11',
    ts: 'TS/2024/0007',
    ten: 'Máy toàn đạc điện tử Leica TS07',
    nguyenGia: 185000000,
    daKH: 92500000,
    conLai: 92500000,
    dinhGia: 15000000,
    chiPhiThanhLy: 500000,
    phongBan: 'QLCL',
    loaiThanhLy: 'Phá hủy / Hủy bỏ',
    soQuyetDinh: 'QĐ-TL/125/2026/TEDI',
    ngayQuyetDinh: '2026-08-10',
    hoiDongDinhGia: 'Hội đồng Kiểm kê & Định giá QLCL',
    soChungTuGhiGiam: '',
    ngayGhiGiam: '',
    lyDo: 'Thiết bị rơi ngấm nước trong đợt khảo sát hiện trường, hư hỏng bo mạch chính không thể khôi phục',
    trangThai: 'Chờ phê duyệt'
  }
];

export const INITIAL_SOFTWARE: SoftwareLicense[] = [
  {
    id: 'PM/2026/0001',
    ten: 'AutoCAD Civil 3D 2026',
    ncc: 'Autodesk — Đại lý Hòa Bình Software',
    hinhThuc: 'Thuê theo kỳ',
    chuKy: '1 Năm',
    gia: 42000000,
    hetHan: '2026-12-31',
    pbsd: 'QLCL',
    chuKyKT: 6,
    ktGanNhat: '2026-06-30',
    trangThai: 'Đang khai thác',
    soHopDong: 'HĐ-PM/102/2026/TEDI',
    ngayCap: '2026-01-01',
    soLuongUser: 5,
    nguoiQuanLy: 'Nguyễn Văn Minh (IT Lead)',
    licenseKey: 'CIVIL3D-2026-TEDI-8892-NET',
    phanLoaiKeToan: 'Chi phí trong kỳ (TK 642)',
    ghiChu: 'Gói phần mềm hạ tầng giao thông chuyên dụng phục vụ các dự án trọng điểm',
    lichSuGiaHan: [
      { ngay: '2025-12-25', soHD: 'HĐ-PM/102/2026/TEDI', gia: 42000000, hanMoi: '2026-12-31' }
    ]
  },
  {
    id: 'PM/2026/0002',
    ten: 'Phần mềm dự toán G8 Enterprise',
    ncc: 'Công ty CP Giá Xây Dựng',
    hinhThuc: 'Mua vĩnh viễn',
    chuKy: 'Vĩnh viễn',
    gia: 36000000,
    hetHan: '',
    pbsd: 'CL-KD',
    chuKyKT: 12,
    ktGanNhat: '2025-12-20',
    trangThai: 'Đang khai thác',
    soHopDong: 'HĐ-G8/2025/TEDI-098',
    ngayCap: '2025-06-15',
    soLuongUser: 10,
    nguoiQuanLy: 'Trần Thị Hà (Kế toán chi phí)',
    licenseKey: 'G8-ENT-TEDI-45920-USB',
    phanLoaiKeToan: 'TSCĐ Vô hình (TK 213)',
    assetId: 'TS/2025/0002-PM',
    ghiChu: 'Gia hạn gói cập nhật định mức đơn giá mới hàng năm',
    lichSuGiaHan: [
      { ngay: '2025-06-15', soHD: 'HĐ-G8/2025/TEDI-098', gia: 36000000, hanMoi: 'Mua vĩnh viễn' }
    ]
  },
  {
    id: 'PM/2026/0003',
    ten: 'Bộ Microsoft 365 Business Premium (25 Seats)',
    ncc: 'Microsoft Corp — Đại lý FPT Information System',
    hinhThuc: 'Thuê theo kỳ',
    chuKy: '1 Năm',
    gia: 28500000,
    hetHan: '2026-09-30',
    pbsd: 'QLVP',
    chuKyKT: 6,
    ktGanNhat: '2026-03-31',
    trangThai: 'Sắp hết hạn',
    soHopDong: 'HĐ-MS365/2025/FPT-TEDI',
    ngayCap: '2025-10-01',
    soLuongUser: 25,
    nguoiQuanLy: 'Lê Hoàng Nam (Chuyên viên IT)',
    licenseKey: 'MS365-TENANT-TEDI.ONMICROSOFT.COM',
    phanLoaiKeToan: 'Chi phí trong kỳ (TK 642)',
    ghiChu: 'Hạn dùng đến hết Q3/2026, cần chuẩn bị hồ sơ trình gia hạn',
    lichSuGiaHan: [
      { ngay: '2025-09-20', soHD: 'HĐ-MS365/2025/FPT-TEDI', gia: 28500000, hanMoi: '2026-09-30' }
    ]
  },
  {
    id: 'PM/2025/0007',
    ten: 'Phần mềm khảo sát địa hình HHMaps v6',
    ncc: 'Công ty TNHH Phần mềm Hải Hà',
    hinhThuc: 'Mua vĩnh viễn',
    chuKy: 'Vĩnh viễn',
    gia: 18000000,
    hetHan: '',
    pbsd: 'QLCL',
    chuKyKT: 12,
    ktGanNhat: '2025-12-20',
    trangThai: 'Đang khai thác',
    soHopDong: 'HĐ-HH/2024/TEDI-011',
    ngayCap: '2024-08-10',
    soLuongUser: 3,
    nguoiQuanLy: 'Phạm Quốc Hùng (Trưởng nhóm Trắc địa)',
    licenseKey: 'HHMAPS-60-HARDKEY-0023',
    phanLoaiKeToan: 'TSCĐ Vô hình (TK 213)',
    assetId: 'TS/2024/0007-PM',
    ghiChu: 'Bản quyền vĩnh viễn ghi nhận TSCĐ vô hình',
    lichSuGiaHan: []
  }
];

export const OPEN_ISSUES_LIST: OpenIssueItem[] = [
  { ma: 'OI-01', ten: 'Hạn mức phê duyệt X, Y', mo: 'Họp nêu 1tr / 3tr / 4tr nhưng chưa chốt mốc nào ứng với cấp nào.', mh: 'MH1 · MH5 · MH11 · MH12 · MH18', xl: 'Dùng biến X, Y trong widget luồng duyệt; badge chờ xác nhận cạnh cấp phê duyệt.', q: 'X và Y là bao nhiêu, và tính theo giá trị một dòng hay tổng phiếu?', links: ['mh1', 'mh18'] },
  { ma: 'OI-02', ten: 'Cấp duyệt trung gian', mo: 'Ngoài Trưởng phòng → Sếp tổng có thêm Phó TGĐ hoặc HĐQT không.', mh: 'MH1', xl: 'Widget luồng duyệt 3 cấp, cấp 3 vẽ nét đứt kèm nhãn cấp bổ sung.', q: 'Có cấp thứ ba không, ai giữ vai đó?', links: ['mh1'] },
  { ma: 'OI-03', ten: 'Kỳ báo cáo kế hoạch vs thực tế', mo: 'Tháng, quý hay năm.', mh: 'MH19', xl: 'Bộ lọc có cả 3 lựa chọn, chưa đặt mặc định.', q: 'Lãnh đạo muốn nhận báo cáo theo kỳ nào?', links: ['mh19'] },
  { ma: 'OI-04', ten: 'Tiêu chí cảnh báo vượt', mo: 'Vượt số lượng, vượt giá, hay cả hai mới cảnh báo.', mh: 'MH19 · MH1 · MH18', xl: 'Ba cờ độc lập bật – tắt được, không ép một quy tắc.', q: 'Cờ nào là cảnh báo thật, cờ nào chỉ để tham khảo?', links: ['mh19', 'mh1'] },
  { ma: 'OI-05', ten: 'Cơ cấu chi nhánh', mo: 'Bao nhiêu chi nhánh, kho phân cấp thế nào.', mh: 'MH4 · MH5 · MH6 · MH18', xl: 'Field Chi nhánh để trống kèm badge, không vẽ cây kho.', q: 'Có bao nhiêu chi nhánh và mỗi chi nhánh có kho riêng không?', links: ['mh4', 'mh6'] },
  { ma: 'OI-06', ten: 'Danh mục phòng ban', mo: 'Hiện chỉ biết QLVP, QLCL, CL-KD.', mh: 'Toàn hệ thống', xl: 'Dropdown 3 giá trị thật + 2 dòng “Phòng 4/5 (chờ xác nhận)”.', q: 'Tên chính thức của 2 phòng còn lại?', links: ['mh18'] },
  { ma: 'OI-07', ten: 'Theo dõi theo số seri', mo: 'Có quản lý từng thiết bị theo seri không.', mh: 'MH4 · MH5 · MH6', xl: 'Phương án chính không có seri; nếu cần thì vẽ phương án B riêng.', q: 'Có cần truy xuất từng máy theo số seri không?', links: ['mh4', 'mh5'] },
  { ma: 'OI-08', ten: 'Phạm vi các màn hình ISO', mo: 'MH2, MH3, MH9, MH11–MH17 có nằm trong đợt này không.', mh: 'Đợt 2 và đợt 3', xl: 'Ghi nhãn phạm vi cần xác nhận ở đầu mỗi màn hình.', q: 'Đợt này triển khai đến màn hình nào?', links: ['mh12', 'mh14', 'mh15', 'mh16'] },
  { ma: 'OI-09', ten: 'Chu kỳ kiểm định, bảo dưỡng', mo: 'Số tháng cố định hay theo khuyến cáo nhà sản xuất.', mh: 'MH7', xl: 'Radio 2 lựa chọn trong khối nét đứt, cả hai đều dựng sẵn.', q: 'Chọn cách nào, và ai chịu trách nhiệm nhập chu kỳ?', links: ['mh7'] },
  { ma: 'OI-10', ten: 'Quy trình sửa chữa', mo: 'Ai đề nghị, ai duyệt, có theo dõi chi phí không; phân biệt sửa chữa thường xuyên với sửa chữa lớn.', mh: 'MH8 · MH12', xl: 'Khối tiếp nhận – duyệt – chi phí vẽ nét đứt.', q: 'Chi phí sửa chữa vào chi phí trong kỳ hay ghi tăng nguyên giá, mốc nào?', links: ['mh8', 'mh12'] },
  { ma: 'OI-11', ten: 'Phạm vi điều chuyển', mo: 'Giữa phòng ban, giữa chi nhánh, hay cả hai; có cần biên bản riêng.', mh: 'MH10', xl: 'Dropdown đủ 3 lựa chọn; bản in biên bản đã dựng để khách xem trước.', q: 'Điều chuyển giữa chi nhánh có phát sinh không?', links: ['mh10'] },
  { ma: 'OI-12', ten: 'Dung sai nhận dư', mo: 'Nhận vượt số đặt bao nhiêu phần trăm thì chỉ cảnh báo.', mh: 'MH4', xl: 'Tham số hệ thống, mặc định 0%.', q: 'Cho phép nhận dư không, bao nhiêu phần trăm?', links: ['mh4'] },
  { ma: 'OI-16', ten: 'Bộ tài khoản theo nhóm tài sản', mo: 'Bảng tài khoản mặc định chưa được kế toán trưởng xác nhận.', mh: 'MH6 · Tham số hệ thống', xl: 'Bảng tài khoản đặt ở màn tham số, sửa được.', q: 'Kế toán trưởng xác nhận bảng tài khoản này chưa?', links: ['cfg', 'mh6'] }
];

export const INITIAL_LOGS: ActivityLog[] = [
  { khi: '2026-08-12 08:30', t: 'Khởi tạo hệ thống dữ liệu TEDI v1.2' }
];

/* Helper functions */
export function formatVND(n: number): string {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + ' ₫';
}

export function formatNum(n: number): string {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('vi-VN').format(n);
}

export function formatDMY(s: string): string {
  if (!s) return '—';
  return s.split('-').reverse().join('/');
}
