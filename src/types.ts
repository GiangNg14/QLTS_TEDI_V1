// TEDI-ISO-QT 02 standard categories and types
export type IsoAssetCategory =
  | 'XDCB_HANG_MUC'     // 1. Hạng mục XDCB (sửa chữa, nâng cấp, cải tạo văn phòng, tường rào, sân bãi)
  | 'MAY_MOC_CHUYEN_DUNG' // 2. Máy móc chuyên dùng (khảo sát, thiết kế, thí nghiệm, đo lường, kiểm tra)
  | 'PHUONG_TIEN_HA_TANG' // 3. Phương tiện vận tải và hệ thống hạ tầng (ôtô, thang máy, CNTT, điện, nước, thoát nước)
  | 'PHAN_MEM_CHUYEN_DUNG' // 4. Phần mềm chuyên dùng (quản lý điều hành, khảo sát, thiết kế, thí nghiệm, kế toán)
  | 'XDCB_MOI';         // 5. Công trình XDCB mới

export type IsoMachinerySubGroup =
  | 'ThietBiVanPhong'        // BM QT02-3: Nhóm thiết bị văn phòng
  | 'ThiNghiemHienTruong'    // BM QT02-3: Nhóm thí nghiệm hiện trường
  | 'ThiNghiemTrongPhong';   // BM QT02-3: Nhóm thí nghiệm trong phòng

export type IsoResponsibilityLevel =
  | 'DHDCD'       // Đại hội đồng Cổ đông
  | 'HDQT'        // Hội đồng Quản trị
  | 'TGD'         // Tổng Giám đốc / Giám đốc
  | 'DON_VI_QL'   // Đơn vị quản lý (QLVP / QLTB)
  | 'PHONG_TCKT'  // Phòng Tài chính Kế toán
  | 'DON_VI_SD';  // Đơn vị sử dụng

export type IsoReportCode =
  | 'BM_QT02_1'   // Phiếu yêu cầu mua TSCĐ
  | 'BM_QT02_2'   // Biên bản bàn giao nhận tài sản (Bảng 11 cột)
  | 'BM_QT02_3'   // Danh mục máy móc thiết bị hằng năm (3 nhóm)
  | 'BM_QT02_4'   // Danh mục phần mềm chuyên dùng hằng năm
  | 'BM_QT02_5'   // Bảng tổng hợp danh mục TSCĐ đề nghị thanh lý
  | 'PL5_THANH_LY'// Sơ đồ trình tự thanh lý 6 bước
  | 'QT_05_MUON_TRA'; // Quy trình mượn trả thiết bị hiện trường

export interface SystemConfig {
  nguongTSCD: number;        // Threshold for Fixed Asset classification (e.g. 30,000,000 VND)
  hanMucX: number;           // Department Manager approval limit (e.g. 20,000,000 VND)
  hanMucY: number;           // General Director approval limit (e.g. 100,000,000 VND) -> above requires Board
  dungSaiNhanDu: number;     // Over-delivery tolerance % (e.g. 0%)
  kyBaoCao: string;          // Report period (Năm, Quý, Tháng)
}

export interface ProcurementPlanLine {
  id: string;
  pb: string;
  loai: 'TSCĐ' | 'Vật tư – CCDC' | 'Dịch vụ – Chuyên gia';
  ten: string;
  dvt: string;
  sl: number;
  gia: number;
  quy: string;
  nhom: string;
}

export interface ProcurementPlan {
  id: string;
  nam: number;
  ten: string;
  trangThai: 'Nháp' | 'Chờ duyệt' | 'Đã duyệt' | 'Đang thực hiện' | 'Đã đóng';
  nguoiLap: string;
  ngayLap: string;
  lines: ProcurementPlanLine[];
}

export interface RequisitionLine {
  ten: string;
  sl: number;
  dvt: string;
  gia: number;
  ts: string;
  mucDich: string;
}

export interface ApprovalStep {
  cap: string;
  nguoi: string;
  kq: 'Chờ' | 'Đã duyệt' | 'Từ chối' | 'Chưa gửi';
  ngay: string;
}

export interface DirectiveInstruction {
  nguoi: string;
  ngay: string;
  noiDung: string;
  kq: '' | 'Nhận' | 'Từ chối';
  lyDo: string;
  ngayPh: string;
}

export interface ProcurementRequisition {
  id: string;
  ngay: string;
  pb: string;
  pbsd: string;
  loai: 'TSCĐ' | 'Vật tư – CCDC' | 'Dịch vụ – Chuyên gia';
  khLine: string | null;
  lines: RequisitionLine[];
  trangThai: 'Nháp' | 'Chờ duyệt sơ bộ' | 'Chờ Sếp tổng duyệt' | 'Chờ HĐQT duyệt' | 'Đã duyệt' | 'Đã giao chỉ thị' | 'Đang thực hiện' | 'Hoàn thành' | 'Từ chối' | 'Trưởng phòng từ chối nhận';
  lyDoVuot: string;
  duyet: ApprovalStep[];
  chiThi: DirectiveInstruction | null;
}

export interface QuotationVendor {
  ten: string;
  gia: number;
  giao: string;
  bh: string;
  diem: number;
}

export interface RequestForQuotation {
  id: string;
  dx: string;
  ten: string;
  trangThai: string;
  ncu: QuotationVendor[];
  chon: number | null;
  lyDo: string;
}

export interface PreContractVendorScore {
  ten: string;
  diem: number[];
}

export interface PreContractVendorEval {
  id: string;
  ngay: string;
  goiThau: string;
  dx: string;
  nguoiDG: string;
  nguoiPD: string;
  trangThai: 'Nháp' | 'Chờ duyệt' | 'Đã duyệt';
  canKH: boolean;
  thuCT: string;
  chon: number | null;
  ncu: PreContractVendorScore[];
}

export interface ExpertCandidate {
  id: string;
  ten: string;
  linhVuc: string;
  namKN: number;
  soCT: number;
  hocVi: 'Cử nhân' | 'Thạc sĩ' | 'Tiến sĩ';
  phi: number;
  duAn: string;
  ho: {
    don: boolean;
    lyLich: boolean;
    khoaHoc: boolean;
    chungChi: boolean;
  };
  giaiDoan: 'Chưa đủ hồ sơ' | 'Đủ hồ sơ' | 'Đề xuất lựa chọn' | 'Đã duyệt' | 'Không chọn';
  lyDo: string;
}

export interface ContractItem {
  id: string;
  loai: string;
  ncu: string;
  giaTri: number;
  ngayKy: string;
  hieuLuc: string;
  hetHan: string;
  trangThai: string;
  dx: string;
}

export interface DeliverableFile {
  ten: string;
  v: number;
  ngay: string;
  nguoi: string;
  tt: 'Đang xem xét' | 'Bị trả lại' | 'Được chấp nhận';
}

export interface DeliverableAcceptance {
  id: string;
  hd: string;
  ncu: string;
  ngayNhan: string;
  moTa: string;
  phongKT: string;
  nhanXet: string;
  kcs: '' | 'Đạt' | 'Đạt một phần' | 'Không đạt';
  yeuCau: string;
  ngayBanGiao: string;
  nguoiNhan: string;
  trangThai: 'Nháp' | 'Đang kiểm tra sơ bộ' | 'Chờ kết quả QLCL' | 'Yêu cầu NCU sửa/làm lại' | 'Đã bàn giao';
  files: DeliverableFile[];
}

export interface GoodsReceiptLine {
  ten: string;
  dvt: string;
  slDat: number;
  slNhan: number;
  pb: string;
  nguoi: string;
  gia: number;
  phi: number;
  ts: string | null;
}

export interface GoodsReceipt {
  id: string;
  dx: string;
  ngay: string;
  ncu: string;
  hopDong: string;
  nghiemThu: '' | 'Đạt' | 'Đạt một phần' | 'Không đạt';
  trangThai: 'Nháp' | 'Đã nhận hàng' | 'Đã bàn giao';
  lines: GoodsReceiptLine[];
}

export interface SuppliesStockItem {
  ma?: string;
  ten: string;
  dvt: string;
  tonKho: number;
  dangMuon?: number;
  giu: Record<string, number>;
  tonToiThieu?: number;
  donGia?: number;
  nhom?: 'Vật tư tiêu hao' | 'CCDC' | 'Thiết bị khảo sát';
  viTri?: string;
  lo?: string;
  hanSuDung?: string;
}

export interface EquipmentLoanItem {
  ma: string;
  ten: string;
  dvt: string;
  sl: number;
  maCoDinh?: string;
}

export interface EquipmentLoanRecord {
  id: string;
  ngayMuon: string;
  nguoiMuon: string;
  donVi: string;
  duAn: string;
  diaDiem: string;
  ngayDuKienTra: string;
  ngayTraThucTe?: string;
  thietBi: EquipmentLoanItem[];
  tinhTrangKhiMuon: string;
  tinhTrangKhiTra?: 'Nguyên vẹn' | 'Hư hỏng' | 'Mất';
  trangThai: 'Nháp' | 'Chờ duyệt' | 'Đã duyệt' | 'Đang mượn' | 'Đã trả' | 'Chờ xử lý' | 'Quá hạn';
  thuKho: string;
  lyDoGiaHan?: string;
  bienBanXuLy?: string;
}

export interface SupplierPostEval {
  id: string;
  loai?: 'Nhà cung ứng / Nhà thầu phụ' | 'Chuyên gia';
  doiTuong?: string;
  hd?: string;
  ngayEval?: string;
  nguoiEval?: string;
  duAn?: string;
  diem?: number;
  tieuChi?: { ten: string; diem: number; trongSo: number }[];
  nhanXet?: string;
  ketLuan?: 'Khuyến nghị tiếp tục hợp tác' | 'Hạn chế mời báo giá' | 'Ngừng hợp tác';
  hopDongId?: string;
  ncuTen?: string;
  ngayDanhGia?: string;
  nguoiDanhGia?: string;
  diemChatLuong?: number;
  diemTienDo?: number;
  diemGiaCa?: number;
  diemBaoHanh?: number;
  tongDiem?: number;
  xepLoai?: string;
}

export interface SuppliesIssuanceLine {
  ten: string;
  dvt: string;
  slDN: number;
  slCap: number;
}

export interface SuppliesIssuance {
  id: string;
  ngay: string;
  pb: string;
  nguoi: string;
  lyDo: string;
  chiPhi: string;
  lines: SuppliesIssuanceLine[];
  trangThai: 'Đã cấp' | 'Nháp' | 'Chờ duyệt';
}

export interface AssetModel {
  id: string;
  ten: string;
  method: 'Tuyến tính' | 'Giảm dần' | 'Giảm dần rồi Tuyến tính';
  factor: number;
  soKy: number;
  kyHan: 'Tháng' | 'Quý' | 'Năm';
  prorata: 'Từ ngày mua' | 'Đầu kỳ tiếp theo';
  tkTS: string;
  tkHM: string;
  tkCP: string;
  journal: string;
  tkMua: string;
}

export interface VendorBillLine {
  ten: string;
  tk: string;
  sl: number;
  gia: number;
  am: string;
}

export interface VendorBill {
  id: string;
  ncc: string;
  ngay: string;
  ref: string;
  hd: string;
  trangThai: 'Nháp' | 'Đã vào sổ';
  assets: string[];
  lines: VendorBillLine[];
}

export interface AssetHistoryItem {
  ngay: string;
  vc: string;
}

export interface AssetDepreciationPeriod {
  ky: number;
  ngay: string;
  kh: number;
  luy: number;
  con: number;
  qua?: boolean;
}

export interface AssetMaster {
  id: string;
  ten: string;
  nhom: string;
  isoGroup?: IsoAssetCategory;
  machineryGroup?: IsoMachinerySubGroup;
  hinhThai: 'Hữu hình' | 'Vô hình';
  nguyenGia: number;
  giaMuaGoc?: number;
  cuocVanChuyen?: number;
  chiPhiChayThu?: number;
  soHieuKyThuat?: string;
  cheDoKiemTra?: string;
  salvage: number;
  ghiDe: string | null;
  phanLoaiGiaTri?: 'TSCĐ hữu hình' | 'CCDC' | 'TSCĐ vô hình' | 'Chi phí' | string;
  softwareId?: string;
  am: string;
  method: 'Tuyến tính' | 'Giảm dần' | 'Giảm dần rồi Tuyến tính';
  factor: number;
  soKy: number;
  kyHan: 'Tháng' | 'Quý' | 'Năm';
  prorata: 'Từ ngày mua' | 'Đầu kỳ tiếp theo';
  tkTS: string;
  tkHM: string;
  tkCP: string;
  journal: string;
  ngayMua: string;
  soThang: number;
  ngayBD: string;
  pbQuanLy: string;
  pbsd: string;
  nguoi: string;
  tinhTrang: string;
  nguonGoc: string;
  ct: string;
  bill: string;
  state: 'Nháp' | 'Đang chạy' | 'Đã đóng';
  trangThai: 'Đang sử dụng' | 'Tạm dừng KH' | 'Đã thanh lý';
  computed: boolean;
  board: AssetDepreciationPeriod[];
  lichSu: AssetHistoryItem[];
}

export interface AssetTransferRecord {
  id: string;
  ngay: string;
  ts: string;
  tuPB: string;
  tuNguoi: string;
  denPB: string;
  denNguoi: string;
  lyDo: string;
  trangThai?: 'Nháp' | 'Chờ phê duyệt' | 'Đã phê duyệt' | 'Đã hoàn thành' | 'Từ chối';
  loaiDieuChuyen?: 'Nội bộ (Cùng pháp nhân)' | 'Khác pháp nhân';
  canCuLoai?: string;
  soQuyetDinh?: string;
  ngayQuyetDinh?: string;
  viTriMoi?: string;
  doiTuongChiPhiMoi?: string;
}

export interface AssetAuditLine {
  id: string;
  ten: string;
  pb: string;
  st: string;
  so: number;
  tt: number;
  tinh: 'Tốt' | 'Cần sửa chữa' | 'Hư hỏng' | 'Mất';
  xl: 'Giữ nguyên' | 'Ghi tăng' | 'Ghi giảm' | 'Chuyển thanh lý' | 'Chuyển sửa chữa';
}

export interface AssetAuditSession {
  id: string;
  tenDot: string;
  loaiDot: 'Định kỳ (01/01)' | 'Đột xuất';
  ngayChot: string;
  phamViPB: string;
  hoiDong: string;
  kiemToanDocLap?: string;
  soQuyetDinh?: string;
  ngayQuyetDinh?: string;
  trangThai: 'Nháp' | 'Đang kiểm kê' | 'Chờ xử lý chênh lệch' | 'Đã hoàn thành' | 'Hủy';
  lines: AssetAuditLine[];
}

export interface AssetDisposalRecord {
  id: string;
  ngay: string;
  ts: string;
  ten: string;
  nguyenGia: number;
  daKH: number;
  conLai: number;
  dinhGia: number;
  trangThai: 'Nháp' | 'Chờ phê duyệt' | 'Đã phê duyệt' | 'Đã hoàn thành' | 'Từ chối' | 'Đã ghi giảm';
  lyDo: string;
  loaiThanhLy?: 'Bán nhượng bán' | 'Phá hủy / Hủy bỏ' | 'Thu hồi phụ tùng';
  soQuyetDinh?: string;
  ngayQuyetDinh?: string;
  hoiDongDinhGia?: string;
  chiPhiThanhLy?: number;
  ngayGhiGiam?: string;
  soChungTuGhiGiam?: string;
  phongBan?: string;
}

export interface SoftwareLicense {
  id: string;
  ten: string;
  ncc: string;
  hinhThuc: 'Thuê theo kỳ' | 'Mua vĩnh viễn';
  chuKy: string;
  gia: number;
  hetHan: string;
  pbsd: string;
  chuKyKT: number;
  ktGanNhat: string;
  trangThai: 'Nháp' | 'Chờ cấp phép' | 'Đang khai thác' | 'Sắp hết hạn' | 'Hết hạn' | 'Đã gia hạn' | 'Đã hủy';
  soHopDong?: string;
  ngayCap?: string;
  soLuongUser?: number;
  nguoiQuanLy?: string;
  licenseKey?: string;
  phanLoaiKeToan?: string;
  assetId?: string;
  ghiChu?: string;
  lichSuGiaHan?: { ngay: string; soHD: string; gia: number; hanMoi: string }[];
}

export interface MaintenanceTask {
  id: string;
  ts: string;
  loai: 'Kiểm định' | 'Hiệu chỉnh' | 'Bảo dưỡng';
  hinhThuc: 'Tự thực hiện' | 'Thuê ngoài';
  chuKyLoai: 'Chu kỳ cố định' | 'Khuyến cáo NSX';
  chuKy: number;
  nsx: string;
  lanGanNhat: string;
  doi: string;
  chiPhi: number;
  giaiDoan: 'Mới' | 'Đang thực hiện' | 'Hoàn thành' | 'Đạt' | 'Không đạt';
  kq: string;
}

export interface IncidentReport {
  id: string;
  ngay: string;
  nguoiBao: string;
  ts: string;
  mucDo: 'Thấp' | 'Trung bình' | 'Nghiêm trọng';
  moTa: string;
  anh: string[];
  giaiDoan: 'Mới báo hỏng' | 'Đã tiếp nhận' | 'Đang sửa chữa' | 'Đã sửa xong' | 'Không sửa được';
  nguoiNhan: string;
  hinhThuc: string;
  donVi: string;
  chiPhi: number;
  ngayXong: string;
  kq: string;
}

export interface WorkBudgetItem {
  id: string;
  cha: string | null; // null: Dòng cha (Hạng mục lớn), string: id dòng cha
  ten: string;
  dvt: string;
  kl: number; // Khối lượng dự toán
  gia: number; // Đơn giá dự toán
  klThucTe?: number; // Khối lượng thực tế quyết toán
  giaThucTe?: number; // Đơn giá thực tế quyết toán
  ghiChu?: string;
}

export type XdcbLoaiCV = 'Sửa chữa lớn' | 'Nâng cấp' | 'Cải tạo' | 'Xây mới';
export type XdcbTruongHop = 'Nâng cấp TS cũ' | 'Xây dựng hạng mục mới';
export type XdcbStage = 'Chờ phê duyệt' | 'Đã duyệt' | 'Đang thi công' | 'Nghiệm thu' | 'Quyết toán' | 'Bảo hành' | 'Đã hoàn thành' | 'Nháp';

export interface WorkBudget {
  id: string;
  ngay: string;
  loaiCV: XdcbLoaiCV;
  truongHop: XdcbTruongHop;
  hangMuc: string; // Mã TS liên quan (nếu nâng cấp TS cũ) hoặc '' (nếu xây mới)
  hangMucTS?: string | null;
  tenHangMuc: string;
  lyDo: string;
  donViDeXuat?: string;
  nguoiDeXuat?: string;

  // Dự toán & Phê duyệt
  tongDuToan?: number;
  thamQuyenDuyet?: 'Trưởng phòng (≤ X)' | 'Tổng Giám đốc (≤ Y)' | 'HĐQT (> Y)';
  ngayDuyet?: string;
  nguoiDuyet?: string;

  // Nhà thầu & Hợp đồng
  nhaThau: string;
  hopDong: string;
  ngayKyHD?: string;
  giaTriHD?: number;

  // Thi công & Tiến độ
  ngayKhoiCong?: string;
  ngayDuKienXong?: string;
  ngayXong: string;
  tienDoThiCong?: number; // 0 - 100%
  nhatKyThiCong?: { ngay: string; noiDung: string; nguoiGhi: string }[];

  // Nghiệm thu
  ngayNghiemThu?: string;
  hoiDongNghiemThu?: string;
  danhGiaNghiemThu?: 'Đạt yêu cầu kỹ thuật' | 'Đạt một phần (cần khắc phục)' | 'Không đạt';
  bienBanNghiemThuSo?: string;

  // Quyết toán
  quyetToan: number; // Tổng thành tiền thực tế quyết toán
  ngayQuyetToan?: string;
  chenhLechQuyetToan?: number; // quyetToan - tongDuToan

  // Gửi FAST
  fastStatus?: 'Chưa gửi' | 'Đã gửi FAST' | 'Đã ghi sổ FAST';
  fastMaTS?: string; // Mã TS được ghi tăng (TS cũ hoặc TS mới tạo)
  fastLoaiGhiNhan?: 'Ghi tăng nguyên giá TS cũ' | 'Ghi tăng tài sản mới';
  fastNgayGhiSo?: string;

  // Bảo hành
  baoHanh: string; // VD: '12 tháng', '24 tháng'
  ngayBatDauBH?: string;
  ngayHetHanBH?: string;
  noiDungBH: string;
  yeuCauBaoHanhLichSu?: { ngay: string; suCo: string; trangThai: string; ketQua: string }[];

  trangThai: XdcbStage;
  lines: WorkBudgetItem[];
}

export interface OpenIssueItem {
  ma: string;
  ten: string;
  mo: string;
  mh: string;
  xl: string;
  q: string;
  links: string[];
}

export interface ActivityLog {
  khi: string;
  t: string;
}

export interface HandoverSlipLine {
  id: string;
  ten: string; // Tên hàng hóa / tài sản / CCDC
  tsTen?: string; // Tương thích ngược
  dvt: string; // Đơn vị tính
  slDat: number; // Số lượng đặt theo đề xuất / HĐ
  slNhan: number; // Số lượng nhận / bàn giao thực tế
  soLuong?: number; // Tương thích ngược (= slNhan)
  slTon?: number; // Số lượng tồn kho
  gia: number; // Đơn giá thực tế
  phi: number; // Chi phí phụ (vận chuyển, lắp đặt)
  ts: string | null; // Mã TSCĐ liên kết (TS/2026/0001)
  tsId?: string; // Tương thích ngược
  pb: string; // Phòng ban nhận
  viTriMoi?: string; // Vị trí mới / phòng ban nhận
  nguoi: string; // Cán bộ nhận bàn giao
  soSerial?: string; // Số serial / số hiệu kỹ thuật
  nhom?: string; // Nhóm tài sản / chủng loại
  viTriHienTai?: string; // Vị trí hiện tại / kho xuất
  ghiChu?: string; // Hiện trạng kỹ thuật / ghi chú
  phanLoai?: 'Tài sản cố định (TSCĐ)' | 'CCDC / Vật tư kho';
}

export interface HandoverAttachment {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
}

export interface HandoverSlip {
  id: string; // Mã phiếu (BGCP/180826/00007, PBG/2026/0001, NH/2026/0001)
  dx: string; // Đề xuất liên quan (DXMS/2026/0001)
  hopDong: string; // Hợp đồng liên quan (HD/2026/014)
  ncu: string; // Nhà cung ứng / Bên giao
  chuyenTu: string; // Từ đơn vị / Kho nguồn
  chuyenDen: string; // Đến đơn vị / Phòng ban nhận
  nghiemThu: '' | 'Đạt' | 'Đạt một phần' | 'Không đạt'; // Kết quả nghiệm thu kỹ thuật (KCS)
  lyDoDieuChuyen: string; // Căn cứ / Lý do bàn giao
  loaiPhieu: 'Nhận hàng & Bàn giao kho' | 'Bàn giao mua sắm mới' | 'Cấp phát CCDC' | 'Điều chuyển nội bộ' | 'Thu hồi';
  nguoiYeuCau: string; // Người yêu cầu / Người giao
  nguoiXacNhanDC: string; // Cán bộ nghiệm thu KCS / Phê duyệt
  nguoiTiepNhan: string; // Cán bộ tiếp nhận / Người nhận
  ngayTao: string; // Ngày tạo / Ngày bàn giao (YYYY-MM-DD hoặc DD/MM/YYYY)
  trangThai: 'Nháp' | 'Chờ phê duyệt' | 'Đã nhận hàng' | 'Đã bàn giao' | 'Đã hoàn thành' | 'Từ chối';
  lines: HandoverSlipLine[];
  attachments: HandoverAttachment[];
}
