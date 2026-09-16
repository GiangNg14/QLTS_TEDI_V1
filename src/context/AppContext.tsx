import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SystemConfig, ProcurementPlan, ProcurementRequisition, RequestForQuotation,
  PreContractVendorEval, ExpertCandidate, ContractItem, DeliverableAcceptance,
  GoodsReceipt, SuppliesStockItem, EquipmentLoanRecord, SupplierPostEval, SuppliesIssuance, AssetModel, VendorBill,
  AssetMaster, AssetDepreciationPeriod, AssetTransferRecord, AssetAuditLine, AssetAuditSession, AssetDisposalRecord,
  SoftwareLicense, MaintenanceTask, IncidentReport, WorkBudget, ActivityLog,
  HandoverSlip, HandoverSlipLine
} from '../types';
import {
  INITIAL_CFG, INITIAL_PLANS, INITIAL_REQUISITIONS, INITIAL_GOODS_RECEIPTS,
  INITIAL_ASSET_MODELS, INITIAL_VENDOR_BILLS, INITIAL_ASSET_MASTERS,
  INITIAL_SUPPLIES, INITIAL_EQUIPMENT_LOANS, INITIAL_SUPPLIER_POST_EVALS, INITIAL_SUPPLIES_ISSUANCE, INITIAL_RFQS, INITIAL_CONTRACTS,
  INITIAL_MAINTENANCE_TASKS, INITIAL_INCIDENT_REPORTS, INITIAL_WORK_BUDGETS,
  INITIAL_EXPERTS, INITIAL_PRE_CONTRACT_EVALS, INITIAL_DELIVERABLES,
  INITIAL_TRANSFERS, INITIAL_HANDOVER_SLIPS, INITIAL_AUDIT_LINES, INITIAL_AUDIT_SESSIONS, INITIAL_DISPOSALS, INITIAL_SOFTWARE,
  OPEN_ISSUES_LIST, INITIAL_LOGS
} from '../data/mockData';

interface AppContextType {
  config: SystemConfig;
  plans: ProcurementPlan[];
  requisitions: ProcurementRequisition[];
  rfqs: RequestForQuotation[];
  contracts: ContractItem[];
  goodsReceipts: GoodsReceipt[];
  supplies: SuppliesStockItem[];
  equipmentLoans: EquipmentLoanRecord[];
  supplierPostEvals: SupplierPostEval[];
  suppliesIssuance: SuppliesIssuance[];
  assetModels: AssetModel[];
  vendorBills: VendorBill[];
  assetMasters: AssetMaster[];
  transfers: AssetTransferRecord[];
  handoverSlips: HandoverSlip[];
  addHandoverSlip: (slip: HandoverSlip) => void;
  updateHandoverSlip: (slip: HandoverSlip) => void;
  deleteHandoverSlip: (id: string) => void;
  auditLines: AssetAuditLine[];
  auditSessions: AssetAuditSession[];
  addAuditSession: (session: AssetAuditSession) => void;
  updateAuditSession: (session: AssetAuditSession) => void;
  disposals: AssetDisposalRecord[];
  software: SoftwareLicense[];
  maintenanceTasks: MaintenanceTask[];
  incidents: IncidentReport[];
  workBudgets: WorkBudget[];
  experts: ExpertCandidate[];
  preContractEvals: PreContractVendorEval[];
  deliverables: DeliverableAcceptance[];
  openIssuesStatus: Record<string, boolean>;
  logs: ActivityLog[];

  // Actions
  addEquipmentLoan: (loan: EquipmentLoanRecord) => void;
  returnEquipmentLoan: (loanId: string, tinhTrang: 'Nguyên vẹn' | 'Hư hỏng' | 'Mất') => void;
  addSupplierPostEval: (evalRec: SupplierPostEval) => void;
  updateConfig: (cfg: Partial<SystemConfig>) => void;
  addRequisition: (req: ProcurementRequisition) => void;
  updateRequisition: (req: ProcurementRequisition) => void;
  submitRequisition: (id: string) => void;
  approveRequisition: (id: string) => void;
  rejectRequisition: (id: string, reason: string) => void;
  assignDirective: (id: string, nguoi: string, ngay: string, noiDung: string) => void;
  respondDirective: (id: string, kq: 'Nhận' | 'Từ chối', lyDo?: string) => void;
  
  createGoodsReceipt: (dxId: string) => string;
  confirmGoodsReceipt: (id: string) => boolean;
  createAssetFromGoodsReceiptLine: (nhId: string, lineIndex: number) => string;

  addAssetModel: (model: AssetModel) => void;
  updateAssetModel: (model: AssetModel) => void;

  postVendorBill: (id: string) => void;
  updateVendorBillLine: (id: string, index: number, field: string, val: any) => void;

  addAssetMaster: (asset: AssetMaster) => void;
  updateAssetMaster: (asset: AssetMaster) => void;
  computeAssetDepreciation: (id: string) => void;
  confirmAssetMaster: (id: string) => void;
  modifyAssetDepreciation: (id: string) => void;
  overrideAssetClassification: (id: string, newType: string | null, reason?: string) => void;

  transferAsset: (tsId: string, denPB: string, denNguoi: string, lyDo: string) => void;
  addTransfer: (tf: AssetTransferRecord) => void;
  updateTransfer: (tf: AssetTransferRecord) => void;
  disposeAsset: (tsId: string, lyDo: string) => void;
  confirmDisposal: (disposalId: string) => void;
  addDisposal: (disp: AssetDisposalRecord) => void;
  updateDisposal: (disp: AssetDisposalRecord) => void;
  addSoftware: (sw: SoftwareLicense) => void;
  updateSoftware: (sw: SoftwareLicense) => void;

  addMaintenanceTask: (task: MaintenanceTask) => void;
  updateMaintenanceTask: (task: MaintenanceTask) => void;
  updateMaintenanceStatus: (id: string, giaiDoan: MaintenanceTask['giaiDoan']) => void;

  addIncident: (inc: IncidentReport) => void;
  updateIncident: (inc: IncidentReport) => void;
  updateIncidentStatus: (id: string, giaiDoan: IncidentReport['giaiDoan']) => void;

  addWorkBudget: (budget: WorkBudget) => void;
  updateWorkBudget: (budget: WorkBudget) => void;
  increaseAssetFromWorkBudget: (budgetId: string, targetAssetId?: string) => void;

  issueSupplies: (pb: string, nguoi: string, lyDo: string, chiPhi: string, itemTen: string, sl: number) => boolean;

  toggleOpenIssue: (code: string) => void;
  addLog: (text: string) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tedi_asset_app_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CFG);
  const [plans, setPlans] = useState<ProcurementPlan[]>(INITIAL_PLANS);
  const [requisitions, setRequisitions] = useState<ProcurementRequisition[]>(INITIAL_REQUISITIONS);
  const [rfqs, setRfqs] = useState<RequestForQuotation[]>(INITIAL_RFQS);
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>(INITIAL_GOODS_RECEIPTS);
  const [supplies, setSupplies] = useState<SuppliesStockItem[]>(INITIAL_SUPPLIES);
  const [equipmentLoans, setEquipmentLoans] = useState<EquipmentLoanRecord[]>(INITIAL_EQUIPMENT_LOANS);
  const [supplierPostEvals, setSupplierPostEvals] = useState<SupplierPostEval[]>(INITIAL_SUPPLIER_POST_EVALS);
  const [suppliesIssuance, setSuppliesIssuance] = useState<SuppliesIssuance[]>(INITIAL_SUPPLIES_ISSUANCE);
  const [assetModels, setAssetModels] = useState<AssetModel[]>(INITIAL_ASSET_MODELS);
  const [vendorBills, setVendorBills] = useState<VendorBill[]>(INITIAL_VENDOR_BILLS);
  const [assetMasters, setAssetMasters] = useState<AssetMaster[]>(INITIAL_ASSET_MASTERS);
  const [transfers, setTransfers] = useState<AssetTransferRecord[]>(INITIAL_TRANSFERS);
  const [handoverSlips, setHandoverSlips] = useState<HandoverSlip[]>(INITIAL_HANDOVER_SLIPS);
  const [auditLines, setAuditLines] = useState<AssetAuditLine[]>(INITIAL_AUDIT_LINES);
  const [auditSessions, setAuditSessions] = useState<AssetAuditSession[]>(INITIAL_AUDIT_SESSIONS);
  const [disposals, setDisposals] = useState<AssetDisposalRecord[]>(INITIAL_DISPOSALS);
  const [software, setSoftware] = useState<SoftwareLicense[]>(INITIAL_SOFTWARE);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENT_REPORTS);
  const [workBudgets, setWorkBudgets] = useState<WorkBudget[]>(INITIAL_WORK_BUDGETS);
  const [experts, setExperts] = useState<ExpertCandidate[]>(INITIAL_EXPERTS);
  const [preContractEvals, setPreContractEvals] = useState<PreContractVendorEval[]>(INITIAL_PRE_CONTRACT_EVALS);
  const [deliverables, setDeliverables] = useState<DeliverableAcceptance[]>(INITIAL_DELIVERABLES);
  const [openIssuesStatus, setOpenIssuesStatus] = useState<Record<string, boolean>>({});
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Helper for timestamp
  const nowStr = () => new Date().toLocaleString('vi-VN');

  const addLog = (t: string) => {
    setLogs(prev => [{ khi: nowStr(), t }, ...prev]);
  };

  // Compute helper for Odoo Asset Depreciation Board
  const computeBoard = (nguyenGia: number, salvage: number, soKy: number, kyHan: string, method: string, factor: number, ngayMua: string) => {
    const n = Math.max(1, soKy || 1);
    const base = Math.max(0, nguyenGia - (salvage || 0));
    const lin = base / n;
    let rem = base;
    let cum = 0;
    const rows = [];
    const stepMonths = kyHan === 'Năm' ? 12 : kyHan === 'Quý' ? 3 : 1;
    const startDate = ngayMua ? new Date(ngayMua) : new Date();

    for (let i = 1; i <= n; i++) {
      let amt = lin;
      if (method !== 'Tuyến tính') {
        const dec = rem * ((factor || 2) / n);
        amt = method === 'Giảm dần' ? dec : Math.max(dec, rem / (n - i + 1));
      }
      if (i === n || amt > rem) amt = rem;
      rem -= amt;
      cum += amt;

      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i * stepMonths, 0);
      const ngayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      const isPast = d <= new Date('2026-08-12');
      rows.push({ ky: i, ngay: ngayStr, kh: amt, luy: cum, con: nguyenGia - cum, qua: isPast });
    }
    return rows;
  };

  const updateConfig = (newCfg: Partial<SystemConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...newCfg };
      addLog(`Cập nhật tham số hệ thống: Ngưỡng TSCĐ = ${next.nguongTSCD.toLocaleString('vi-VN')} ₫`);
      return next;
    });
  };

  const addRequisition = (req: ProcurementRequisition) => {
    setRequisitions(prev => [req, ...prev]);
    addLog(`Tạo mới đề xuất mua sắm: ${req.id}`);
  };

  const updateRequisition = (req: ProcurementRequisition) => {
    setRequisitions(prev => prev.map(r => r.id === req.id ? req : r));
  };

  const submitRequisition = (id: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id) return r;
      const total = r.lines.reduce((s, l) => s + l.sl * l.gia, 0);
      const caps = total < config.hanMucX ? ['Trưởng phòng'] : total <= config.hanMucY ? ['Trưởng phòng', 'Sếp tổng'] : ['Trưởng phòng', 'Sếp tổng', 'HĐQT'];
      const steps = caps.map((c, i) => ({
        cap: c,
        nguoi: c === 'Trưởng phòng' ? 'Lê Minh Quân' : c === 'Sếp tổng' ? 'Nguyễn Đức Thắng' : 'Hội đồng Quản trị',
        kq: (i === 0 ? 'Chờ' : 'Chưa gửi') as any,
        ngay: ''
      }));
      addLog(`Gửi phê duyệt đề xuất ${id} (${caps.join(' → ')})`);
      return {
        ...r,
        trangThai: 'Chờ duyệt sơ bộ',
        duyet: steps
      };
    }));
  };

  const approveRequisition = (id: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id) return r;
      const total = r.lines.reduce((s, l) => s + l.sl * l.gia, 0);
      const caps = total < config.hanMucX ? ['Trưởng phòng'] : total <= config.hanMucY ? ['Trưởng phòng', 'Sếp tổng'] : ['Trưởng phòng', 'Sếp tổng', 'HĐQT'];
      const nextDuyet = [...r.duyet];
      const pendingIdx = nextDuyet.findIndex(d => d.kq === 'Chờ');
      if (pendingIdx >= 0) {
        nextDuyet[pendingIdx] = { ...nextDuyet[pendingIdx], kq: 'Đã duyệt', ngay: '2026-08-12' };
        if (pendingIdx + 1 < nextDuyet.length) {
          nextDuyet[pendingIdx + 1] = { ...nextDuyet[pendingIdx + 1], kq: 'Chờ' };
          const nextCap = caps[pendingIdx + 1];
          const nextState = nextCap === 'Sếp tổng' ? 'Chờ Sếp tổng duyệt' : 'Chờ HĐQT duyệt';
          addLog(`Đã duyệt cấp ${caps[pendingIdx]} cho ${id}, chuyển tiếp ${nextCap}`);
          return { ...r, duyet: nextDuyet, trangThai: nextState as any };
        } else {
          addLog(`Phê duyệt hoàn tất cho đề xuất ${id}`);
          return { ...r, duyet: nextDuyet, trangThai: 'Đã duyệt' };
        }
      }
      return r;
    }));
  };

  const rejectRequisition = (id: string, reason: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nextDuyet = [...r.duyet];
      const pendingIdx = nextDuyet.findIndex(d => d.kq === 'Chờ');
      if (pendingIdx >= 0) {
        nextDuyet[pendingIdx] = { ...nextDuyet[pendingIdx], kq: 'Từ chối', ngay: '2026-08-12' };
      }
      addLog(`Từ chối đề xuất ${id}: ${reason}`);
      return { ...r, duyet: nextDuyet, trangThai: 'Từ chối', lyDoVuot: reason };
    }));
  };

  const assignDirective = (id: string, nguoi: string, ngay: string, noiDung: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id) return r;
      addLog(`Giao chỉ thị thực hiện ${id} cho ${nguoi}`);
      return {
        ...r,
        trangThai: 'Đã giao chỉ thị',
        chiThi: { nguoi, ngay, noiDung, kq: '', lyDo: '', ngayPh: '' }
      };
    }));
  };

  const respondDirective = (id: string, kq: 'Nhận' | 'Từ chối', lyDo: string = '') => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id || !r.chiThi) return r;
      addLog(`Phản hồi chỉ thị ${id}: ${kq}`);
      return {
        ...r,
        trangThai: kq === 'Nhận' ? 'Đang thực hiện' : 'Trưởng phòng từ chối nhận',
        chiThi: {
          ...r.chiThi,
          kq,
          lyDo,
          ngayPh: '2026-08-12'
        }
      };
    }));
  };

  const createGoodsReceipt = (dxId: string) => {
    const dx = requisitions.find(d => d.id === dxId);
    const hd = contracts.find(h => h.dx === dxId);
    const id = `NH/2026/${String(goodsReceipts.length + 1).padStart(4, '0')}`;
    const newGr: GoodsReceipt = {
      id,
      dx: dxId,
      ngay: '2026-08-12',
      ncu: hd ? hd.ncu : '',
      hopDong: hd ? hd.id : '',
      nghiemThu: '',
      trangThai: 'Nháp',
      lines: dx ? dx.lines.map(l => ({
        ten: l.ten,
        dvt: l.dvt,
        slDat: l.sl,
        slNhan: l.sl,
        pb: dx.pbsd,
        nguoi: '',
        gia: l.gia,
        phi: 0,
        ts: null
      })) : []
    };
    setGoodsReceipts(prev => [newGr, ...prev]);
    if (dx) updateRequisition({ ...dx, trangThai: 'Đang thực hiện' });
    addLog(`Tạo phiếu nhận hàng ${id} cho đề xuất ${dxId}`);
    return id;
  };

  const confirmGoodsReceipt = (id: string) => {
    const gr = goodsReceipts.find(g => g.id === id);
    if (!gr) return false;
    setGoodsReceipts(prev => prev.map(g => g.id === id ? { ...g, trangThai: 'Đã bàn giao' } : g));
    addLog(`Xác nhận bàn giao phiếu nhận hàng ${id}`);
    return true;
  };

  const createAssetFromGoodsReceiptLine = (nhId: string, lineIndex: number) => {
    const gr = goodsReceipts.find(g => g.id === nhId);
    if (!gr) return '';
    const line = gr.lines[lineIndex];
    if (!line) return '';

    const ng = line.gia + (line.phi || 0);
    const isTSCD = ng >= config.nguongTSCD;
    const prefix = isTSCD ? 'TS/2026/' : 'CC/2026/';
    let counter = assetMasters.length + 1;
    let assetId = `${prefix}${String(counter).padStart(4, '0')}`;
    while (assetMasters.some(a => a.id === assetId)) {
      counter++;
      assetId = `${prefix}${String(counter).padStart(4, '0')}`;
    }

    const newAsset: AssetMaster = {
      id: assetId,
      ten: line.ten,
      nhom: 'TBQL',
      hinhThai: 'Hữu hình',
      nguyenGia: ng,
      salvage: 0,
      ghiDe: null,
      am: isTSCD ? 'AM02' : '',
      method: 'Tuyến tính',
      factor: 0,
      soKy: 0,
      kyHan: 'Tháng',
      prorata: 'Từ ngày mua',
      tkTS: isTSCD ? '2112' : '1531',
      tkHM: '2141',
      tkCP: '6424',
      journal: 'MISC — Bút toán khác',
      ngayMua: '2026-08-12',
      soThang: 0,
      ngayBD: '2026-08-12',
      pbQuanLy: 'QLVP',
      pbsd: line.pb || 'QLVP',
      nguoi: line.nguoi || '',
      tinhTrang: 'Mới 100%',
      nguonGoc: 'Mua sắm',
      ct: nhId,
      bill: '',
      state: 'Đang chạy',
      trangThai: 'Đang sử dụng',
      computed: true,
      board: [],
      lichSu: [{ ngay: '2026-08-12', vc: `Ghi tăng từ phiếu nhận hàng ${nhId}, bàn giao ${line.pb || 'QLVP'} (Không tính khấu hao)` }]
    };

    setAssetMasters(prev => [newAsset, ...prev]);

    // Update GoodsReceipt line with created asset ID
    setGoodsReceipts(prev => prev.map(g => {
      if (g.id !== nhId) return g;
      const nextLines = [...g.lines];
      nextLines[lineIndex] = { ...nextLines[lineIndex], ts: assetId };
      return { ...g, lines: nextLines };
    }));

    // Update Requisition status if done
    const dx = requisitions.find(d => d.id === gr.dx);
    if (dx) updateRequisition({ ...dx, trangThai: 'Hoàn thành' });

    addLog(`Tự động ghi tăng tài sản ${assetId} từ phiếu nhận hàng ${nhId} (Không tính khấu hao)`);
    return assetId;
  };

  const addAssetModel = (model: AssetModel) => {
    setAssetModels(prev => [...prev, model]);
    addLog(`Thêm mới Asset Model: ${model.ten}`);
  };

  const updateAssetModel = (model: AssetModel) => {
    setAssetModels(prev => prev.map(m => m.id === model.id ? model : m));
  };

  const postVendorBill = (id: string) => {
    const bill = vendorBills.find(b => b.id === id);
    if (!bill) return;

    const createdAssets: string[] = [];
    const createdAssetIds = new Set<string>();
    bill.lines.forEach((line) => {
      if (line.tk.startsWith('21')) {
        const m = assetModels.find(x => x.id === line.am);
        const ng = line.sl * line.gia;
        let counter = assetMasters.length + createdAssets.length + 1;
        let assetId = `TS/2026/${String(counter).padStart(4, '0')}`;
        while (assetMasters.some(a => a.id === assetId) || createdAssetIds.has(assetId)) {
          counter++;
          assetId = `TS/2026/${String(counter).padStart(4, '0')}`;
        }
        createdAssetIds.add(assetId);
        const newAsset: AssetMaster = {
          id: assetId,
          ten: line.ten,
          nhom: m?.tkTS === '2111' ? 'MMTB' : 'TBQL',
          hinhThai: m?.tkTS === '2135' ? 'Vô hình' : 'Hữu hình',
          nguyenGia: ng,
          salvage: 0,
          ghiDe: null,
          am: line.am || '',
          method: 'Tuyến tính',
          factor: 0,
          soKy: 0,
          kyHan: 'Tháng',
          prorata: 'Từ ngày mua',
          tkTS: line.tk || '2112',
          tkHM: '2141',
          tkCP: '6424',
          journal: m?.journal || 'MISC — Bút toán khác',
          ngayMua: bill.ngay,
          soThang: 0,
          ngayBD: bill.ngay,
          pbQuanLy: 'QLVP',
          pbsd: 'QLVP',
          nguoi: '',
          tinhTrang: 'Mới 100%',
          nguonGoc: 'Mua sắm qua Vendor Bill',
          ct: bill.id,
          bill: bill.id,
          state: 'Đang chạy',
          trangThai: 'Đang sử dụng',
          computed: true,
          board: [],
          lichSu: [{ ngay: bill.ngay, vc: `Tự động tạo từ hóa đơn ${bill.id} (Không tính khấu hao)` }]
        };
        setAssetMasters(prev => [newAsset, ...prev]);
        createdAssets.push(assetId);
      }
    });

    setVendorBills(prev => prev.map(b => b.id === id ? { ...b, trangThai: 'Đã vào sổ', assets: createdAssets } : b));
    addLog(`Post hóa đơn ${id} — sinh ${createdAssets.length} tài sản mới trong sổ tài sản (không tính khấu hao)`);
  };

  const updateVendorBillLine = (id: string, index: number, field: string, val: any) => {
    setVendorBills(prev => prev.map(b => {
      if (b.id !== id) return b;
      const lines = [...b.lines];
      lines[index] = { ...lines[index], [field]: val };
      return { ...b, lines };
    }));
  };

  const addAssetMaster = (asset: AssetMaster) => {
    setAssetMasters(prev => [asset, ...prev]);
    addLog(`Tạo tài sản thủ công: ${asset.id} - ${asset.ten}`);
  };

  const updateAssetMaster = (asset: AssetMaster) => {
    setAssetMasters(prev => prev.map(a => a.id === asset.id ? asset : a));
  };

  const computeAssetDepreciation = (id: string) => {
    setAssetMasters(prev => prev.map(a => {
      if (a.id !== id) return a;
      addLog(`Kích hoạt tài sản ${id} (Không tính khấu hao)`);
      return { ...a, board: [], computed: true };
    }));
  };

  const confirmAssetMaster = (id: string) => {
    setAssetMasters(prev => prev.map(a => {
      if (a.id !== id) return a;
      const nextHist = [{ ngay: '2026-08-12', vc: `Kích hoạt tài sản đưa vào sử dụng (Không tính khấu hao)` }, ...a.lichSu];
      addLog(`Confirm tài sản ${id} → Đang chạy`);
      return {
        ...a,
        state: 'Đang chạy',
        trangThai: 'Đang sử dụng',
        computed: true,
        board: [],
        lichSu: nextHist
      };
    }));
  };

  const modifyAssetDepreciation = (id: string) => {
    setAssetMasters(prev => prev.map(a => {
      if (a.id !== id) return a;
      const nextHist = [{ ngay: '2026-08-12', vc: `Cập nhật hồ sơ tài sản (Không tính khấu hao)` }, ...a.lichSu];
      addLog(`Cập nhật tài sản ${id}`);
      return { ...a, board: [], computed: true, lichSu: nextHist };
    }));
  };

  const overrideAssetClassification = (id: string, newType: string | null, reason: string = '') => {
    setAssetMasters(prev => prev.map(a => {
      if (a.id !== id) return a;
      const hist = [...a.lichSu];
      if (newType) {
        hist.unshift({ ngay: '2026-08-12', vc: `Ghi đè phân loại thành ${newType} — lý do: ${reason}` });
      } else {
        hist.unshift({ ngay: '2026-08-12', vc: `Hủy ghi đè phân loại` });
      }
      addLog(`Ghi đè phân loại ${id}: ${newType || 'Bỏ ghi đè'}`);
      return { ...a, ghiDe: newType, lichSu: hist };
    }));
  };

  const transferAsset = (tsId: string, denPB: string, denNguoi: string, lyDo: string) => {
    const ts = assetMasters.find(a => a.id === tsId);
    if (!ts) return;

    const tfId = `ĐCTS/2026/${String(transfers.length + 1).padStart(4, '0')}`;
    const newTf: AssetTransferRecord = {
      id: tfId,
      ngay: new Date().toISOString().split('T')[0],
      ts: tsId,
      tuPB: ts.pbsd,
      tuNguoi: ts.nguoi || '—',
      denPB,
      denNguoi,
      lyDo,
      trangThai: 'Đã hoàn thành',
      loaiDieuChuyen: 'Nội bộ (Cùng pháp nhân)',
      canCuLoai: 'Quyết định điều chuyển',
      soQuyetDinh: `QĐ-DC/2026/${String(transfers.length + 1).padStart(3, '0')}`,
      ngayQuyetDinh: new Date().toISOString().split('T')[0]
    };

    setTransfers(prev => [newTf, ...prev]);

    setAssetMasters(prev => prev.map(a => {
      if (a.id !== tsId) return a;
      const hist = [{ ngay: new Date().toISOString().split('T')[0], vc: `Điều chuyển ${ts.pbsd} → ${denPB} (phiếu ${tfId})` }, ...a.lichSu];
      return { ...a, pbsd: denPB, nguoi: denNguoi, lichSu: hist };
    }));

    addLog(`Điều chuyển tài sản ${tsId} sang phòng ${denPB}`);
  };

  const addTransfer = (tf: AssetTransferRecord) => {
    setTransfers(prev => [tf, ...prev]);
    addLog(`Tạo mới phiếu điều chuyển ${tf.id}`);
  };

  const updateTransfer = (tf: AssetTransferRecord) => {
    setTransfers(prev => prev.map(t => {
      if (t.id !== tf.id) return t;
      return tf;
    }));

    if (tf.trangThai === 'Đã hoàn thành' && tf.ts && tf.denPB) {
      setAssetMasters(prev => prev.map(a => {
        if (a.id !== tf.ts) return a;
        const hist = [{ ngay: tf.ngay || new Date().toISOString().split('T')[0], vc: `Hoàn tất điều chuyển ${a.pbsd} → ${tf.denPB} (phiếu ${tf.id})` }, ...a.lichSu];
        return { ...a, pbsd: tf.denPB, nguoi: tf.denNguoi || a.nguoi, lichSu: hist };
      }));
    }

    addLog(`Cập nhật phiếu điều chuyển ${tf.id} (${tf.trangThai || ''})`);
  };

  const addHandoverSlip = (slip: HandoverSlip) => {
    setHandoverSlips(prev => [slip, ...prev]);
    addLog(`Khởi tạo phiếu bàn giao ${slip.id} (${slip.chuyenTu} → ${slip.chuyenDen})`);
  };

  const updateHandoverSlip = (slip: HandoverSlip) => {
    setHandoverSlips(prev => prev.map(s => s.id === slip.id ? slip : s));

    // When handover is completed, update asset location and history
    if (slip.trangThai === 'Đã hoàn thành' || slip.trangThai === 'Đã bàn giao') {
      slip.lines.forEach(line => {
        if (line.tsId) {
          setAssetMasters(prev => prev.map(a => {
            if (a.id !== line.tsId) return a;
            const hist = [{
              ngay: slip.ngayTao.split(' ')[0] || new Date().toISOString().split('T')[0],
              vc: `Bàn giao theo phiếu ${slip.id}: ${slip.chuyenTu} → ${slip.chuyenDen} (${line.viTriMoi || ''})`
            }, ...a.lichSu];
            return {
              ...a,
              pbsd: slip.chuyenDen || a.pbsd,
              nguoi: slip.nguoiTiepNhan || a.nguoi,
              lichSu: hist
            };
          }));
        }
      });
    }

    addLog(`Cập nhật phiếu bàn giao ${slip.id} (${slip.trangThai})`);
  };

  const deleteHandoverSlip = (id: string) => {
    setHandoverSlips(prev => prev.filter(s => s.id !== id));
    addLog(`Xóa phiếu bàn giao ${id}`);
  };

  const addAuditSession = (session: AssetAuditSession) => {
    setAuditSessions(prev => [session, ...prev]);
    addLog(`Khởi tạo đợt/phiếu kiểm kê tài sản mới ${session.id}`);
  };

  const updateAuditSession = (session: AssetAuditSession) => {
    setAuditSessions(prev => prev.map(s => {
      if (s.id !== session.id) return s;
      return session;
    }));
    addLog(`Cập nhật đợt/phiếu kiểm kê ${session.id} (${session.trangThai})`);
  };

  const disposeAsset = (tsId: string, lyDo: string) => {
    const ts = assetMasters.find(a => a.id === tsId);
    if (!ts) return;

    const dispId = `TL/2026/${String(disposals.length + 1).padStart(3, '0')}`;
    const daKH = ts.board.filter(r => r.qua).reduce((s, r) => s + r.kh, 0);
    const conLai = Math.max(0, ts.nguyenGia - daKH);

    const newDisp: AssetDisposalRecord = {
      id: dispId,
      ngay: '2026-08-12',
      ts: tsId,
      ten: ts.ten,
      nguyenGia: ts.nguyenGia,
      daKH,
      conLai,
      dinhGia: 0,
      trangThai: 'Nháp',
      lyDo
    };

    setDisposals(prev => [newDisp, ...prev]);
    addLog(`Lập đề nghị thanh lý ${dispId} cho tài sản ${tsId}`);
  };

  const addDisposal = (disp: AssetDisposalRecord) => {
    setDisposals(prev => [disp, ...prev]);
    addLog(`Khởi tạo hồ sơ đề nghị thanh lý tài sản ${disp.id} (${disp.ts})`);
  };

  const updateDisposal = (disp: AssetDisposalRecord) => {
    setDisposals(prev => prev.map(d => {
      if (d.id !== disp.id) return d;
      return disp;
    }));

    if (disp.trangThai === 'Đã hoàn thành' || disp.trangThai === 'Đã ghi giảm') {
      setAssetMasters(prev => prev.map(a => {
        if (a.id !== disp.ts) return a;
        const hist = [{ ngay: disp.ngayGhiGiam || new Date().toISOString().split('T')[0], vc: `Ghi giảm thanh lý theo hồ sơ ${disp.id}` }, ...a.lichSu];
        return { ...a, state: 'Đã đóng', trangThai: 'Đã thanh lý', lichSu: hist };
      }));
    }

    addLog(`Cập nhật hồ sơ thanh lý ${disp.id} (${disp.trangThai})`);
  };

  const confirmDisposal = (disposalId: string) => {
    const disp = disposals.find(d => d.id === disposalId);
    if (!disp) return;
    updateDisposal({ ...disp, trangThai: 'Đã hoàn thành' });
  };

  const addSoftware = (sw: SoftwareLicense) => {
    let targetAssetId = sw.assetId;
    if (sw.hinhThuc === 'Mua vĩnh viễn') {
      sw.phanLoaiKeToan = 'TSCĐ Vô hình (TK 213)';
      if (!targetAssetId) {
        targetAssetId = `TS/PM/${sw.id.replace(/[^a-zA-Z0-9]/g, '')}`;
        sw.assetId = targetAssetId;
      }
      setAssetMasters(prev => {
        const exists = prev.some(a => a.id === targetAssetId || a.softwareId === sw.id);
        if (!exists) {
          const newAsset: AssetMaster = {
            id: targetAssetId!,
            ten: `${sw.ten} (Bản quyền vĩnh viễn)`,
            nhom: 'Phần mềm chuyên dùng',
            isoGroup: 'PHAN_MEM_CHUYEN_DUNG',
            hinhThai: 'Vô hình',
            nguyenGia: sw.gia,
            giaMuaGoc: sw.gia,
            cuocVanChuyen: 0,
            chiPhiChayThu: 0,
            soHieuKyThuat: sw.licenseKey || sw.id,
            cheDoKiemTra: 'Kiểm tra bản quyền định kỳ 12 tháng/lần',
            salvage: 0,
            ghiDe: 'TSCĐ vô hình',
            phanLoaiGiaTri: 'TSCĐ vô hình',
            softwareId: sw.id,
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
            ngayMua: sw.ngayCap || new Date().toISOString().split('T')[0],
            soThang: 36,
            ngayBD: sw.ngayCap || new Date().toISOString().split('T')[0],
            pbQuanLy: 'QLVP',
            pbsd: sw.pbsd || 'CL-KD',
            nguoi: sw.nguoiQuanLy || 'Administrator',
            tinhTrang: 'Đang khai thác tốt',
            nguonGoc: `Bản quyền phần mềm mua vĩnh viễn (${sw.id})`,
            ct: sw.soHopDong || '',
            bill: sw.soHopDong || '',
            state: 'Đang chạy',
            trangThai: 'Đang sử dụng',
            computed: true,
            board: [],
            lichSu: [{ ngay: new Date().toISOString().split('T')[0], vc: `Tự động tạo TSCĐ vô hình từ phần mềm mua vĩnh viễn ${sw.id}` }]
          };
          return [newAsset, ...prev];
        }
        return prev;
      });
    }
    setSoftware(prev => [sw, ...prev]);
    addLog(`Đăng ký phần mềm / bản quyền mới ${sw.id} (${sw.ten})`);
  };

  const updateSoftware = (sw: SoftwareLicense) => {
    if (sw.hinhThuc === 'Mua vĩnh viễn') {
      sw.phanLoaiKeToan = 'TSCĐ Vô hình (TK 213)';
      let targetAssetId = sw.assetId;
      if (!targetAssetId) {
        targetAssetId = `TS/PM/${sw.id.replace(/[^a-zA-Z0-9]/g, '')}`;
        sw.assetId = targetAssetId;
      }
      setAssetMasters(prev => {
        const found = prev.find(a => a.id === targetAssetId || a.softwareId === sw.id);
        if (found) {
          return prev.map(a => (a.id === found.id) ? {
            ...a,
            ten: `${sw.ten} (Bản quyền vĩnh viễn)`,
            nguyenGia: sw.gia,
            giaMuaGoc: sw.gia,
            nhom: 'Phần mềm chuyên dùng',
            hinhThai: 'Vô hình',
            phanLoaiGiaTri: 'TSCĐ vô hình',
            softwareId: sw.id,
            pbsd: sw.pbsd || a.pbsd,
            nguoi: sw.nguoiQuanLy || a.nguoi
          } : a);
        } else {
          const newAsset: AssetMaster = {
            id: targetAssetId!,
            ten: `${sw.ten} (Bản quyền vĩnh viễn)`,
            nhom: 'Phần mềm chuyên dùng',
            isoGroup: 'PHAN_MEM_CHUYEN_DUNG',
            hinhThai: 'Vô hình',
            nguyenGia: sw.gia,
            giaMuaGoc: sw.gia,
            cuocVanChuyen: 0,
            chiPhiChayThu: 0,
            soHieuKyThuat: sw.licenseKey || sw.id,
            cheDoKiemTra: 'Kiểm tra bản quyền định kỳ 12 tháng/lần',
            salvage: 0,
            ghiDe: 'TSCĐ vô hình',
            phanLoaiGiaTri: 'TSCĐ vô hình',
            softwareId: sw.id,
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
            ngayMua: sw.ngayCap || new Date().toISOString().split('T')[0],
            soThang: 36,
            ngayBD: sw.ngayCap || new Date().toISOString().split('T')[0],
            pbQuanLy: 'QLVP',
            pbsd: sw.pbsd || 'CL-KD',
            nguoi: sw.nguoiQuanLy || 'Administrator',
            tinhTrang: 'Đang khai thác tốt',
            nguonGoc: `Bản quyền phần mềm mua vĩnh viễn (${sw.id})`,
            ct: sw.soHopDong || '',
            bill: sw.soHopDong || '',
            state: 'Đang chạy',
            trangThai: 'Đang sử dụng',
            computed: true,
            board: [],
            lichSu: [{ ngay: new Date().toISOString().split('T')[0], vc: `Đồng bộ TSCĐ vô hình từ phần mềm mua vĩnh viễn ${sw.id}` }]
          };
          return [newAsset, ...prev];
        }
      });
    }
    setSoftware(prev => prev.map(s => s.id === sw.id ? sw : s));
    addLog(`Cập nhật bản quyền phần mềm ${sw.id} (${sw.trangThai})`);
  };

  const addMaintenanceTask = (task: MaintenanceTask) => {
    setMaintenanceTasks(prev => [task, ...prev]);
    addLog(`Thêm dòng kế hoạch bảo dưỡng ${task.id} cho ${task.ts}`);
  };

  const updateMaintenanceTask = (task: MaintenanceTask) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === task.id ? task : t));
    addLog(`Cập nhật kế hoạch bảo dưỡng ${task.id} (${task.giaiDoan})`);
  };

  const updateMaintenanceStatus = (id: string, giaiDoan: MaintenanceTask['giaiDoan']) => {
    setMaintenanceTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextTask = { ...t, giaiDoan };
      if (giaiDoan === 'Hoàn thành' || giaiDoan === 'Đạt') {
        nextTask.lanGanNhat = '2026-08-12';
      }
      return nextTask;
    }));
    addLog(`Cập nhật trạng thái bảo dưỡng ${id} → ${giaiDoan}`);
  };

  const addIncident = (inc: IncidentReport) => {
    setIncidents(prev => [inc, ...prev]);
    addLog(`Gửi báo hỏng sự cố ${inc.id} cho thiết bị ${inc.ts}`);
  };

  const updateIncident = (inc: IncidentReport) => {
    setIncidents(prev => prev.map(i => i.id === inc.id ? inc : i));
    addLog(`Cập nhật hồ sơ sự cố ${inc.id} (${inc.giaiDoan})`);
  };

  const updateIncidentStatus = (id: string, giaiDoan: IncidentReport['giaiDoan']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      const nextInc = { ...inc, giaiDoan };
      if (giaiDoan === 'Đã sửa xong') {
        nextInc.ngayXong = '2026-08-12';
      }
      return nextInc;
    }));
    addLog(`Cập nhật sự cố ${id} → ${giaiDoan}`);
  };

  const addWorkBudget = (budget: WorkBudget) => {
    setWorkBudgets(prev => [budget, ...prev]);
    addLog(`Tạo dự toán XDCB / Cải tạo: ${budget.id}`);
  };

  const updateWorkBudget = (budget: WorkBudget) => {
    setWorkBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
  };

  const increaseAssetFromWorkBudget = (budgetId: string, targetAssetId?: string) => {
    const wb = workBudgets.find(b => b.id === budgetId);
    if (!wb) return;

    const parentLines = wb.lines.filter(l => !l.cha);
    const lineSum = parentLines.length > 0
      ? parentLines.reduce((s, l) => s + (l.kl * l.gia), 0)
      : wb.lines.reduce((s, l) => s + (l.kl * l.gia), 0);
    const cost = (wb.quyetToan && wb.quyetToan > 0) ? wb.quyetToan : lineSum;

    const isNewAsset = wb.truongHop === 'Xây dựng hạng mục mới' || (!targetAssetId && !wb.hangMuc);

    if (isNewAsset) {
      // Trường hợp 2: Xây dựng hạng mục mới -> Ghi tăng tài sản mới
      const newAssetId = `TS/2026/${String(assetMasters.length + 1).padStart(4, '0')}`;
      const soKy = 120; // 10 năm mặc định cho công trình XDCB
      const monthlyKh = Math.round(cost / soKy);
      const startDate = new Date();
      let luyKe = 0;
      const newBoard: AssetDepreciationPeriod[] = [];

      for (let i = 1; i <= Math.min(soKy, 24); i++) {
        const pDate = new Date(startDate);
        pDate.setMonth(startDate.getMonth() + (i - 1));
        const khAmount = (i === soKy) ? (cost - luyKe) : monthlyKh;
        luyKe += khAmount;
        newBoard.push({
          ky: i,
          ngay: pDate.toISOString().slice(0, 10),
          kh: khAmount,
          luy: luyKe,
          con: Math.max(0, cost - luyKe),
          qua: i <= 1
        });
      }

      const newAsset: AssetMaster = {
        id: newAssetId,
        ten: wb.tenHangMuc,
        nhom: 'XDCB',
        isoGroup: 'XDCB_MOI',
        hinhThai: 'Hữu hình',
        nguyenGia: cost,
        giaMuaGoc: cost,
        salvage: 0,
        ghiDe: null,
        am: '',
        method: 'Tuyến tính',
        factor: 1,
        soKy: soKy,
        kyHan: 'Tháng',
        prorata: 'Từ ngày mua',
        tkTS: '2112 - Nhà cửa, vật kiến trúc',
        tkHM: '2141 - Hao mòn TSCĐ hữu hình',
        tkCP: '642 - Chi phí quản lý DN',
        journal: 'FAST_XDCB_JRNL',
        ngayMua: wb.ngayXong || '2026-08-12',
        soThang: soKy,
        ngayBD: wb.ngayXong || '2026-08-12',
        pbQuanLy: wb.donViDeXuat || 'QLVP',
        pbsd: wb.donViDeXuat || 'QLVP',
        nguoi: wb.nguoiDeXuat || 'Trưởng ban QLVP',
        tinhTrang: 'Mới 100% (Hoàn thành nghiệm thu XDCB)',
        nguonGoc: `Nghiệm thu quyết toán XDCB [${wb.id}] - HĐ: ${wb.hopDong || 'N/A'}`,
        ct: wb.bienBanNghiemThuSo || `BBNT-${wb.id}`,
        bill: wb.hopDong || 'HĐ-XDCB',
        state: 'Đang chạy',
        trangThai: 'Đang sử dụng',
        computed: true,
        board: newBoard,
        lichSu: [
          {
            ngay: '2026-08-12',
            vc: `Ghi tăng mới từ quyết toán XDCB ${wb.id} (${wb.tenHangMuc}). Nguyên giá khởi tạo: ${cost.toLocaleString('vi-VN')} ₫. Mức KH: ${monthlyKh.toLocaleString('vi-VN')} ₫/tháng.`
          }
        ]
      };

      setAssetMasters(prev => [newAsset, ...prev]);
      
      // Update WorkBudget
      setWorkBudgets(prev => prev.map(b => {
        if (b.id !== budgetId) return b;
        return {
          ...b,
          fastStatus: 'Đã ghi sổ FAST',
          fastMaTS: newAssetId,
          fastLoaiGhiNhan: 'Ghi tăng tài sản mới',
          fastNgayGhiSo: '2026-08-12',
          trangThai: 'Bảo hành'
        };
      }));

      addLog(`XDCB ${budgetId}: Tạo mới TSCĐ [${newAssetId}] - ${wb.tenHangMuc}, nguyên giá ${cost.toLocaleString('vi-VN')} ₫. Đã đồng bộ FAST.`);
    } else {
      // Trường hợp 1: Nâng cấp TS cũ -> Ghi tăng nguyên giá tài sản cũ
      const selectedAsset = targetAssetId
        ? assetMasters.find(a => a.id === targetAssetId)
        : (assetMasters.find(a => a.id === wb.hangMuc) || assetMasters[0]);

      if (selectedAsset) {
        const oldCost = selectedAsset.nguyenGia;
        const newCost = oldCost + cost;
        const soKy = selectedAsset.soKy || 60;
        const oldMonthlyKh = Math.round(oldCost / soKy);
        const newMonthlyKh = Math.round((newCost - (selectedAsset.salvage || 0)) / soKy);

        let luyKe = 0;
        const newBoard: AssetDepreciationPeriod[] = [];
        const startDate = new Date(selectedAsset.ngayBD || selectedAsset.ngayMua || '2026-08-01');

        for (let i = 1; i <= Math.min(soKy, 24); i++) {
          const periodDate = new Date(startDate);
          periodDate.setMonth(startDate.getMonth() + (i - 1));
          const dateStr = periodDate.toISOString().slice(0, 10);
          const khAmount = (i === soKy) ? (newCost - luyKe) : newMonthlyKh;
          luyKe += khAmount;
          const remaining = Math.max(0, newCost - luyKe);
          newBoard.push({
            ky: i,
            ngay: dateStr,
            kh: khAmount,
            luy: luyKe,
            con: remaining,
            qua: i <= 1
          });
        }

        const hist = [
          {
            ngay: '2026-08-12',
            vc: `Ghi tăng nguyên giá +${cost.toLocaleString('vi-VN')} ₫ từ quyết toán cải tạo XDCB ${budgetId}. Mức KH mới: ${newMonthlyKh.toLocaleString('vi-VN')} ₫/tháng (Cũ: ${oldMonthlyKh.toLocaleString('vi-VN')} ₫/tháng)`
          },
          ...selectedAsset.lichSu
        ];

        setAssetMasters(prev => prev.map(a => {
          if (a.id !== selectedAsset.id) return a;
          return {
            ...a,
            nguyenGia: newCost,
            computed: true,
            board: newBoard,
            lichSu: hist
          };
        }));

        // Update WorkBudget
        setWorkBudgets(prev => prev.map(b => {
          if (b.id !== budgetId) return b;
          return {
            ...b,
            fastStatus: 'Đã ghi sổ FAST',
            fastMaTS: selectedAsset.id,
            fastLoaiGhiNhan: 'Ghi tăng nguyên giá TS cũ',
            fastNgayGhiSo: '2026-08-12',
            trangThai: 'Bảo hành'
          };
        }));

        addLog(`XDCB ${budgetId}: Ghi tăng nguyên giá TSCĐ cũ [${selectedAsset.id}] thêm +${cost.toLocaleString('vi-VN')} ₫. FAST tính lại KH: ${newMonthlyKh.toLocaleString('vi-VN')} ₫/tháng.`);
      }
    }
  };

  const issueSupplies = (pb: string, nguoi: string, lyDo: string, chiPhi: string, itemTen: string, sl: number) => {
    const item = supplies.find(s => s.ten === itemTen);
    if (!item || sl <= 0 || sl > item.tonKho) return false;

    setSupplies(prev => prev.map(s => {
      if (s.ten !== itemTen) return s;
      const nextGiu = { ...s.giu, [pb]: (s.giu[pb] || 0) + sl };
      return { ...s, tonKho: s.tonKho - sl, giu: nextGiu };
    }));

    const cpId = `CP/2026/${String(suppliesIssuance.length + 1).padStart(4, '0')}`;
    const newIssuance: SuppliesIssuance = {
      id: cpId,
      ngay: '2026-08-12',
      pb,
      nguoi,
      lyDo,
      chiPhi,
      lines: [{ ten: itemTen, dvt: item.dvt, slDN: sl, slCap: sl }],
      trangThai: 'Đã cấp'
    };

    setSuppliesIssuance(prev => [newIssuance, ...prev]);
    addLog(`Cấp phát ${sl} ${item.dvt} ${itemTen} cho phòng ${pb}`);
    return true;
  };

  const addEquipmentLoan = (loan: EquipmentLoanRecord) => {
    setEquipmentLoans(prev => [loan, ...prev]);
    // Adjust dangMuon in supplies if applicable
    loan.thietBi.forEach(tb => {
      setSupplies(prev => prev.map(s => {
        if (s.ma === tb.ma || s.ten === tb.ten) {
          return { ...s, dangMuon: (s.dangMuon || 0) + tb.sl };
        }
        return s;
      }));
    });
    addLog(`Lập phiếu mượn thiết bị hiện trường ${loan.id} cho ${loan.nguoiMuon} (${loan.donVi})`);
  };

  const returnEquipmentLoan = (loanId: string, tinhTrang: 'Nguyên vẹn' | 'Hư hỏng' | 'Mất') => {
    const today = new Date().toISOString().slice(0, 10);
    setEquipmentLoans(prev => prev.map(l => {
      if (l.id !== loanId) return l;
      return {
        ...l,
        ngayTraThucTe: today,
        tinhTrangKhiTra: tinhTrang,
        trangThai: tinhTrang === 'Nguyên vẹn' ? 'Đã trả' : 'Chờ xử lý'
      };
    }));

    const loan = equipmentLoans.find(l => l.id === loanId);
    if (loan) {
      loan.thietBi.forEach(tb => {
        setSupplies(prev => prev.map(s => {
          if (s.ma === tb.ma || s.ten === tb.ten) {
            const currentMuon = s.dangMuon || 0;
            return {
              ...s,
              dangMuon: Math.max(0, currentMuon - tb.sl)
            };
          }
          return s;
        }));
      });
      addLog(`Ghi nhận trả thiết bị theo phiếu ${loanId} — Tình trạng: ${tinhTrang}`);
    }
  };

  const addSupplierPostEval = (evalRec: SupplierPostEval) => {
    setSupplierPostEvals(prev => [evalRec, ...prev]);
    addLog(`Lập phiếu đánh giá sau hợp đồng ${evalRec.id} cho ${evalRec.doiTuong} — Kết quả: ${evalRec.ketLuan}`);
  };

  const toggleOpenIssue = (code: string) => {
    setOpenIssuesStatus(prev => {
      const next = { ...prev, [code]: !prev[code] };
      addLog(`Chốt điểm mở ${code}: ${next[code] ? 'Đã chốt' : 'Chưa chốt'}`);
      return next;
    });
  };

  const resetAll = () => {
    setConfig(INITIAL_CFG);
    setPlans(INITIAL_PLANS);
    setRequisitions(INITIAL_REQUISITIONS);
    setRfqs(INITIAL_RFQS);
    setContracts(INITIAL_CONTRACTS);
    setGoodsReceipts(INITIAL_GOODS_RECEIPTS);
    setSupplies(INITIAL_SUPPLIES);
    setEquipmentLoans(INITIAL_EQUIPMENT_LOANS);
    setSupplierPostEvals(INITIAL_SUPPLIER_POST_EVALS);
    setSuppliesIssuance(INITIAL_SUPPLIES_ISSUANCE);
    setAssetModels(INITIAL_ASSET_MODELS);
    setVendorBills(INITIAL_VENDOR_BILLS);
    setAssetMasters(INITIAL_ASSET_MASTERS);
    setTransfers(INITIAL_TRANSFERS);
    setHandoverSlips(INITIAL_HANDOVER_SLIPS);
    setAuditLines(INITIAL_AUDIT_LINES);
    setDisposals(INITIAL_DISPOSALS);
    setSoftware(INITIAL_SOFTWARE);
    setMaintenanceTasks(INITIAL_MAINTENANCE_TASKS);
    setIncidents(INITIAL_INCIDENT_REPORTS);
    setWorkBudgets(INITIAL_WORK_BUDGETS);
    setExperts(INITIAL_EXPERTS);
    setPreContractEvals(INITIAL_PRE_CONTRACT_EVALS);
    setDeliverables(INITIAL_DELIVERABLES);
    setOpenIssuesStatus({});
    setLogs(INITIAL_LOGS);
    addLog('Nạp lại dữ liệu mẫu ban đầu');
  };

  return (
    <AppContext.Provider value={{
      config, plans, requisitions, rfqs, contracts, goodsReceipts, supplies, equipmentLoans, supplierPostEvals,
      suppliesIssuance, assetModels, vendorBills, assetMasters, transfers, handoverSlips,
      auditLines, auditSessions, disposals, software, maintenanceTasks, incidents, workBudgets,
      experts, preContractEvals, deliverables, openIssuesStatus, logs,
      addEquipmentLoan, returnEquipmentLoan, addSupplierPostEval,
      updateConfig, addRequisition, updateRequisition, submitRequisition,
      approveRequisition, rejectRequisition, assignDirective, respondDirective,
      createGoodsReceipt, confirmGoodsReceipt, createAssetFromGoodsReceiptLine,
      addAssetModel, updateAssetModel, postVendorBill, updateVendorBillLine,
      addAssetMaster, updateAssetMaster, computeAssetDepreciation, confirmAssetMaster,
      modifyAssetDepreciation, overrideAssetClassification, transferAsset, addTransfer, updateTransfer,
      addHandoverSlip, updateHandoverSlip, deleteHandoverSlip,
      addAuditSession, updateAuditSession, disposeAsset, confirmDisposal, addDisposal, updateDisposal,
      addSoftware, updateSoftware, addMaintenanceTask, updateMaintenanceTask, updateMaintenanceStatus, addIncident,
      updateIncident, updateIncidentStatus, addWorkBudget, updateWorkBudget, increaseAssetFromWorkBudget,
      issueSupplies, toggleOpenIssue, addLog, resetAll
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
