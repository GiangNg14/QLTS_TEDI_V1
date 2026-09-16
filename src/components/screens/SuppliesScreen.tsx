import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNum, DEPARTMENTS } from '../../data/mockData';
import { EquipmentLoanRecord } from '../../types';
import { Package, Send, CheckCircle2, Building2, User, Layers, Wrench, RotateCcw, AlertTriangle, Clock, Plus } from 'lucide-react';

interface SuppliesScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const SuppliesScreen: React.FC<SuppliesScreenProps> = ({ onNavigate }) => {
  const { supplies, suppliesIssuance, equipmentLoans, issueSupplies, addEquipmentLoan, returnEquipmentLoan, addLog } = useApp();

  const [activeTab, setActiveTab] = useState<'ton' | 'cap' | 'muon'>('ton');
  const [targetPb, setTargetPb] = useState(DEPARTMENTS[0]);
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('Phục vụ công tác chuyên môn');
  const [costAcc, setCostAcc] = useState('6423 — Chi phí đồ dùng văn phòng');
  const [selectedItem, setSelectedItem] = useState(supplies[0]?.ten || '');
  const [quantity, setQuantity] = useState(1);

  // Equipment loan state
  const [borrower, setBorrower] = useState('');
  const [borrowDept, setBorrowDept] = useState(DEPARTMENTS[2] || 'QLCL');
  const [project, setProject] = useState('Khảo sát địa chất tuyến ĐT.741');
  const [location, setLocation] = useState('Hiện trường tuyến ĐT.741');
  const [returnDate, setReturnDate] = useState('2026-08-25');
  const [selectedEquip, setSelectedEquip] = useState(supplies.find(s => s.nhom === 'Thiết bị khảo sát')?.ten || supplies[0]?.ten || '');
  const [equipQty, setEquipQty] = useState(1);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      alert('Vui lòng nhập tên người tiếp nhận.');
      return;
    }
    const currentItem = supplies.find(s => s.ten === selectedItem);
    if (!currentItem) return;

    if (quantity > currentItem.tonKho) {
      alert(`Số lượng cấp phát (${quantity}) vượt quá tồn kho khả dụng (${currentItem.tonKho}).`);
      return;
    }

    const success = issueSupplies(targetPb, recipient.trim(), reason, costAcc, selectedItem, quantity);
    if (success) {
      alert(`Đã xuất cấp ${quantity} ${currentItem.dvt} ${selectedItem} cho phòng ${targetPb}. Chi phí hạch toán tài khoản: ${costAcc}.`);
      setQuantity(1);
      setRecipient('');
    } else {
      alert('Cấp phát thất bại, vui lòng kiểm tra lại tồn kho.');
    }
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrower.trim()) {
      alert('Vui lòng nhập tên người mượn thiết bị.');
      return;
    }
    const item = supplies.find(s => s.ten === selectedEquip);
    const id = `PM/2026/${String(equipmentLoans.length + 1).padStart(4, '0')}`;
    const newLoan: EquipmentLoanRecord = {
      id,
      ngayMuon: new Date().toISOString().split('T')[0],
      nguoiMuon: borrower.trim(),
      donVi: borrowDept,
      duAn: project,
      diaDiem: location,
      ngayDuKienTra: returnDate,
      thietBi: [{ ma: item?.ma || 'TB-01', ten: selectedEquip, dvt: item?.dvt || 'Bộ', sl: equipQty }],
      tinhTrangKhiMuon: 'Nguyên vẹn, đính kèm biên bản kiểm định hiệu chuẩn',
      trangThai: 'Đang mượn',
      thuKho: 'Nguyễn Văn Hùng (Thủ kho)'
    };
    addEquipmentLoan(newLoan);
    alert(`Đã lập Phiếu mượn thiết bị hiện trường ${id} thành công!`);
    setBorrower('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            KHO / VẬT TƯ &amp; THIẾT BỊ KHẢO SÁT
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản lý Tồn kho, Cấp phát &amp; Mượn trả Thiết bị Hiện trường</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              MH5 (QT-KHO-02 &amp; QT-KHO-03)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Theo dõi tồn kho CCDC / Vật tư tiêu hao, cấp phát phòng ban (CT-11) và mượn trả máy móc thiết bị ra hiện trường (CT-12).
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ton')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'ton' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tồn kho &amp; Tồn khả dụng
          </button>
          <button
            onClick={() => setActiveTab('cap')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'cap' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tạo phiếu cấp vật tư (CT-11)
          </button>
          <button
            onClick={() => setActiveTab('muon')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'muon' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 inline mr-1" />
            Mượn trả thiết bị hiện trường (CT-12)
          </button>
        </div>
      </div>

      {activeTab === 'ton' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Bảng Tồn kho &amp; Phân bổ Giữ chỗ theo Phòng ban</h3>
              <span className="text-xs text-slate-500 font-mono">Đơn vị tính chuẩn VAS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider text-left">
                    <th className="p-3">Tên vật tư / CCDC</th>
                    <th className="p-3">ĐVT</th>
                    <th className="p-3 text-right">Tồn kho trung tâm</th>
                    <th className="p-3">Đã cấp phòng QLVP</th>
                    <th className="p-3">Đã cấp phòng TCHC</th>
                    <th className="p-3">Đã cấp phòng QLCL</th>
                    <th className="p-3">Đã cấp các phòng khác</th>
                    <th className="p-3 text-center">Cấp phát ngay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {supplies.map((item, idx) => {
                    const qlvp = item.giu['Phòng QLVP'] || 0;
                    const tchc = item.giu['Phòng TCHC'] || 0;
                    const qlcl = item.giu['Phòng QLCL'] || 0;
                    const others = Object.entries(item.giu)
                      .filter(([k]) => !['Phòng QLVP', 'Phòng TCHC', 'Phòng QLCL'].includes(k))
                      .reduce((sum, [, v]) => sum + Number(v), 0);

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{item.ten}</td>
                        <td className="p-3 text-slate-500 font-mono">{item.dvt}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-800 text-sm">
                          {formatNum(item.tonKho)}
                        </td>
                        <td className="p-3 font-mono text-slate-700">{formatNum(qlvp)}</td>
                        <td className="p-3 font-mono text-slate-700">{formatNum(tchc)}</td>
                        <td className="p-3 font-mono text-slate-700">{formatNum(qlcl)}</td>
                        <td className="p-3 font-mono text-slate-700">{formatNum(others)}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedItem(item.ten);
                              setActiveTab('cap');
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 rounded text-xs font-semibold text-slate-700 shadow-xs"
                          >
                            Cấp phát
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* History of Issuances */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Lịch sử Cấp phát Vật tư &amp; Hạch toán Chi phí</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider text-left">
                    <th className="p-3">Số phiếu</th>
                    <th className="p-3">Ngày xuất</th>
                    <th className="p-3">Phòng nhận</th>
                    <th className="p-3">Người nhận</th>
                    <th className="p-3">Mặt hàng &amp; SL</th>
                    <th className="p-3">Mục đích xuất</th>
                    <th className="p-3">Tài khoản chi phí</th>
                    <th className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliesIssuance.map((iss, idx) => (
                    <tr key={`${iss.id}-${idx}`} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-800">{iss.id}</td>
                      <td className="p-3 font-mono text-slate-600">{iss.ngay}</td>
                      <td className="p-3 font-semibold text-slate-800">{iss.pb}</td>
                      <td className="p-3 text-slate-700">{iss.nguoi}</td>
                      <td className="p-3 font-medium text-slate-900">
                        {iss.lines.map(l => `${l.ten} (${l.slCap} ${l.dvt})`).join(', ')}
                      </td>
                      <td className="p-3 text-slate-600 italic">{iss.lyDo}</td>
                      <td className="p-3 font-mono text-xs text-slate-700">{iss.chiPhi}</td>
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                          {iss.trangThai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cap' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs max-w-2xl space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Phiếu xuất cấp Vật tư / CCDC</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sau khi xác nhận xuất kho, số lượng sẽ tự động giảm trừ tồn kho và ghi nhận ghi tăng sử dụng tại phòng ban.
            </p>
          </div>

          <form onSubmit={handleIssue} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mặt hàng xuất cấp (*)</label>
                <select
                  className="w-full border border-slate-200 rounded p-2 font-semibold text-slate-800"
                  value={selectedItem}
                  onChange={e => setSelectedItem(e.target.value)}
                >
                  {supplies.map(s => (
                    <option key={s.ten} value={s.ten}>
                      {s.ten} (Còn tồn: {s.tonKho} {s.dvt})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Số lượng cấp xuất (*)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-slate-200 rounded p-2 font-mono font-bold"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phòng ban tiếp nhận (*)</label>
                <select
                  className="w-full border border-slate-200 rounded p-2"
                  value={targetPb}
                  onChange={e => setTargetPb(e.target.value)}
                >
                  {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Người đại diện tiếp nhận (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ tên người nhận..."
                  className="w-full border border-slate-200 rounded p-2"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Mục đích xuất cấp</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded p-2"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Tài khoản ghi nhận chi phí (Kế toán)</label>
              <select
                className="w-full border border-slate-200 rounded p-2 font-mono"
                value={costAcc}
                onChange={e => setCostAcc(e.target.value)}
              >
                <option value="6423 — Chi phí đồ dùng văn phòng">6423 — Chi phí đồ dùng văn phòng</option>
                <option value="6424 — Chi phí khấu hao &amp; phân bổ CCDC">6424 — Chi phí khấu hao &amp; phân bổ CCDC</option>
                <option value="6428 — Chi phí dịch vụ mua ngoài khác">6428 — Chi phí dịch vụ mua ngoài khác</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('ton')}
                className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded font-medium text-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" /> Xác nhận Xuất kho &amp; Cấp phát (CT-11)
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'muon' && (
        <div className="space-y-6">
          {/* New Loan Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs max-w-3xl space-y-4">
            <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-blue-900 uppercase">LẬP PHIẾU MƯỢN THIẾT BỊ / DỤNG CỤ KHẢO SÁT HIỆN TRƯỜNG (CT-12)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mẫu BM QT-KHO-03 — Quản lý mượn trả máy móc thiết bị đi khảo sát công trình</p>
              </div>
              <span className="bg-blue-50 text-blue-900 border border-blue-200 font-mono text-[11px] font-bold px-2.5 py-1 rounded">
                QT-KHO-03
              </span>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cán bộ / Chuyên gia mượn (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ tên cán bộ mượn..."
                    className="w-full border border-slate-300 rounded p-2 font-medium"
                    value={borrower}
                    onChange={e => setBorrower(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn vị công tác (*)</label>
                  <select
                    className="w-full border border-slate-300 rounded p-2 font-medium"
                    value={borrowDept}
                    onChange={e => setBorrowDept(e.target.value)}
                  >
                    {DEPARTMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày dự kiến trả (*)</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dự án / Công trình hiện trường (*)</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-300 rounded p-2"
                    value={project}
                    onChange={e => setProject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm đo vẽ / Khảo sát (*)</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-300 rounded p-2"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Chọn Thiết bị / Dụng cụ (*)</label>
                  <select
                    className="w-full border border-slate-300 rounded p-2 font-bold text-slate-800"
                    value={selectedEquip}
                    onChange={e => setSelectedEquip(e.target.value)}
                  >
                    {supplies.map(s => (
                      <option key={s.ten} value={s.ten}>
                        {s.ten} (Còn tồn kho: {s.tonKho} {s.dvt} | Đang mượn: {s.dangMuon || 0})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số lượng mượn (*)</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                    value={equipQty}
                    onChange={e => setEquipQty(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Lập Phiếu Mượn Thiết Bị (CT-12)
                </button>
              </div>
            </form>
          </div>

          {/* Active Equipment Loans Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
              <span>SỔ THEO DÕI MƯỢN TRẢ THIẾT BỊ KHẢO SÁT HIỆN TRƯỜNG (CT-12)</span>
              <span className="font-mono text-blue-900 font-bold">Tổng cộng: {equipmentLoans.length} phiếu</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Số phiếu</th>
                    <th className="p-2.5">Cán bộ mượn</th>
                    <th className="p-2.5">Đơn vị</th>
                    <th className="p-2.5">Dự án &amp; Địa điểm</th>
                    <th className="p-2.5">Thiết bị mượn</th>
                    <th className="p-2.5 font-mono">Ngày mượn</th>
                    <th className="p-2.5 font-mono">Hạn trả</th>
                    <th className="p-2.5 text-center">Trạng thái</th>
                    <th className="p-2.5 text-center">Xử lý Trả máy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {equipmentLoans.map((loan, idx) => (
                    <tr key={`${loan.id}-${idx}`} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-blue-900">{loan.id}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{loan.nguoiMuon}</td>
                      <td className="p-2.5 text-slate-700">{loan.donVi}</td>
                      <td className="p-2.5 text-slate-700">
                        <div className="font-medium text-slate-900">{loan.duAn}</div>
                        <div className="text-[10px] text-slate-500 italic">{loan.diaDiem}</div>
                      </td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {loan.thietBi.map(t => `${t.ten} (${t.sl} ${t.dvt})`).join(', ')}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">{loan.ngayMuon}</td>
                      <td className="p-2.5 font-mono text-slate-600">{loan.ngayDuKienTra}</td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          loan.trangThai === 'Đang mượn' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          loan.trangThai === 'Đã trả' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {loan.trangThai}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        {loan.trangThai === 'Đang mượn' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => returnEquipmentLoan(loan.id, 'Nguyên vẹn')}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold cursor-pointer"
                              title="Trả nguyên vẹn"
                            >
                              Trả tốt
                            </button>
                            <button
                              onClick={() => returnEquipmentLoan(loan.id, 'Hư hỏng')}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                              title="Báo hư hỏng"
                            >
                              Hỏng
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            {loan.ngayTraThucTe ? `Đã trả ${loan.ngayTraThucTe}` : '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
