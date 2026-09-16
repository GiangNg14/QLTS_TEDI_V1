import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDMY } from '../../data/mockData';
import { SupplierPostEval } from '../../types';
import { Star, Check, AlertCircle, Plus, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';

interface SupplierEvalScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

const CRITERIA_PRE = [
  { name: 'Hiểu thị trường và khách hàng', weight: 0.15 },
  { name: 'Uy tín, kinh nghiệm, tính chuyên nghiệp', weight: 0.20 },
  { name: 'Năng lực nguồn lực / tài chính / công nghệ', weight: 0.20 },
  { name: 'Chất lượng sản phẩm dự kiến', weight: 0.20 },
  { name: 'Giá thành sản phẩm', weight: 0.15 },
  { name: 'Tinh thần hợp tác, chấp nhận rủi ro', weight: 0.10 }
];

export const SupplierEvalScreen: React.FC<SupplierEvalScreenProps> = ({ onNavigate }) => {
  const { preContractEvals, supplierPostEvals, addSupplierPostEval, addLog } = useApp();
  const evalItem = preContractEvals[0];
  const [activeTab, setActiveTab] = useState<'pre' | 'post'>('pre');

  // Post-eval form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [ncuName, setNcuName] = useState('Công ty Cổ phần Thiết bị & Công nghệ Đo đạc TEDI');
  const [hdId, setHdId] = useState('HĐ-MS/2026/012');
  const [postProject, setProject] = useState('Khảo sát & Lập hồ sơ kỹ thuật ĐT.741');
  const [chatLuong, setChatLuong] = useState(4.5);
  const [tiendo, setTiendo] = useState(5.0);
  const [giaCa, setGiaCa] = useState(4.0);
  const [baoHanh, setBaoHanh] = useState(4.8);
  const [nx, setNx] = useState('Giao hàng đúng tiến độ, sản phẩm kiểm định đạt chất lượng cao, phản hồi bảo hành kịp thời.');

  const calcWeightedScore = (scores: number[]) => {
    return CRITERIA_PRE.reduce((sum, item, idx) => sum + (scores[idx] || 0) * item.weight, 0);
  };

  const handleScoreChange = (vendorIdx: number, critIdx: number, val: number) => {
    evalItem.ncu[vendorIdx].diem[critIdx] = val;
    addLog(`Cập nhật điểm đánh giá cho ${evalItem.ncu[vendorIdx].ten}`);
  };

  const handleCreatePostEval = (e: React.FormEvent) => {
    e.preventDefault();
    const tongDiem = Math.round(((chatLuong + tiendo + giaCa + baoHanh) / 4) * 20); // Scale to 100
    const xepLoai = tongDiem >= 85 ? 'A - Xuất sắc' : tongDiem >= 70 ? 'B - Tốt' : tongDiem >= 50 ? 'C - Đạt' : 'D - Không đạt';
    const id = `DG-POST/2026/${String(supplierPostEvals.length + 1).padStart(3, '0')}`;

    const newEval: SupplierPostEval = {
      id,
      hopDongId: hdId,
      ncuTen: ncuName,
      duAn: postProject,
      ngayDanhGia: new Date().toISOString().split('T')[0],
      nguoiDanhGia: 'Nguyễn Văn Thanh (Phòng QLCL)',
      diemChatLuong: chatLuong,
      diemTienDo: tiendo,
      diemGiaCa: giaCa,
      diemBaoHanh: baoHanh,
      tongDiem,
      xepLoai,
      nhanXet: nx
    };

    addSupplierPostEval(newEval);
    alert(`Đã lưu Bảng đánh giá NCƯ sau hợp đồng ${id} (Xếp loại: ${xepLoai})`);
    setShowPostForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            MUA SẮM / ĐÁNH GIÁ NHÀ CUNG ỨNG (QT-MS-02)
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Đánh giá &amp; Phân loại Nhà cung ứng (BM QT-MS-02)</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              MH8 / QT-MS-02
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Chấm điểm NCƯ trước ký hợp đồng (CT-08) &amp; Đánh giá kết quả thực hiện sau hợp đồng (CT-08a) làm cơ sở phân loại danh bạ NCƯ ưu tiên TEDI.
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pre')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'pre' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đánh giá Trước HĐ (CT-08)
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'post' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đánh giá Sau HĐ (CT-08a)
          </button>
        </div>
      </div>

      {activeTab === 'pre' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Mã phiếu đánh giá (CT-08):</span>
              <span className="font-mono font-bold text-slate-900">{evalItem.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Dự án / Gói thầu:</span>
              <span className="font-semibold text-slate-800">{evalItem.goiThau}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Cán bộ đánh giá:</span>
              <span className="font-medium text-slate-700">{evalItem.nguoiDG}</span>
            </div>
          </div>

          {/* Evaluation Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Bảng chấm điểm lựa chọn nhà cung ứng (BM QT-MS-02 / CT-08)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Thang điểm 1 - 5 (Trọng số TEDI)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider text-left">
                    <th className="p-3 w-64">Tiêu chí đánh giá</th>
                    <th className="p-3 text-right w-20">Trọng số</th>
                    {evalItem.ncu.map((vendor, vIdx) => (
                      <th key={vIdx} className="p-3 text-center border-l border-slate-200 min-w-[180px]">
                        <span className="font-bold text-slate-900">{vendor.ten}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CRITERIA_PRE.map((crit, cIdx) => (
                    <tr key={cIdx}>
                      <td className="p-3 font-semibold text-slate-800">{crit.name}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{(crit.weight * 100).toFixed(0)}%</td>
                      {evalItem.ncu.map((vendor, vIdx) => {
                        const currentScore = vendor.diem[cIdx] || 0;
                        return (
                          <td key={vIdx} className="p-3 text-center border-l border-slate-200">
                            <div className="inline-flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleScoreChange(vIdx, cIdx, star)}
                                  className={`w-6 h-6 rounded border font-mono text-xs font-bold transition-colors ${
                                    currentScore === star
                                      ? 'bg-blue-900 text-white border-blue-900'
                                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {star}
                                </button>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50/50 border-t-2 border-blue-200 font-bold text-slate-900">
                    <td colSpan={2} className="p-3 uppercase text-[11px] text-blue-900">Điểm tổng hợp (thang 5)</td>
                    {evalItem.ncu.map((vendor, vIdx) => {
                      const total = calcWeightedScore(vendor.diem);
                      return (
                        <td key={vIdx} className="p-3 text-center border-l border-slate-200 font-mono text-sm text-blue-900 font-bold">
                          {total.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Điểm tổng hợp được tự động nhân trọng số theo quy chuẩn TEDI.</span>
              <button
                onClick={() => {
                  addLog(`Phê duyệt kết quả đánh giá NCU cho gói thầu ${evalItem.goiThau}`);
                  alert('Đã lưu kết quả đánh giá nhà cung ứng.');
                  onNavigate('mh2');
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded font-bold shadow-xs cursor-pointer"
              >
                Lưu &amp; Chuyển sang So sánh báo giá (MH2)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Post-Contract Evaluation (CT-08a) Tab */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase">SỔ ĐÁNH GIÁ KẾT QUẢ THỰC HIỆN NCƯ SAU HỢP ĐỒNG (CT-08a)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dùng để xếp loại A/B/C/D và xem xét tái ký hoặc đưa vào danh sách đen (Blacklist)</p>
            </div>
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Đánh giá hợp đồng mới (CT-08a)
            </button>
          </div>

          {showPostForm && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="font-bold text-xs text-blue-900 uppercase">LẬP PHIẾU ĐÁNH GIÁ NCƯ SAU HỢP ĐỒNG (CT-08a)</h4>
              </div>
              <form onSubmit={handleCreatePostEval} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên Nhà cung ứng (*)</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-slate-300 rounded p-2 font-semibold"
                      value={ncuName}
                      onChange={e => setNcuName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Số Hợp đồng liên quan (*)</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-slate-300 rounded p-2 font-mono"
                      value={hdId}
                      onChange={e => setHdId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chất lượng (thang 5)</label>
                    <input
                      type="number" step="0.1" min="1" max="5"
                      className="w-full border border-slate-300 rounded p-2 font-mono"
                      value={chatLuong}
                      onChange={e => setChatLuong(parseFloat(e.target.value) || 5)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tiến độ (thang 5)</label>
                    <input
                      type="number" step="0.1" min="1" max="5"
                      className="w-full border border-slate-300 rounded p-2 font-mono"
                      value={tiendo}
                      onChange={e => setTiendo(parseFloat(e.target.value) || 5)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Giá cả (thang 5)</label>
                    <input
                      type="number" step="0.1" min="1" max="5"
                      className="w-full border border-slate-300 rounded p-2 font-mono"
                      value={giaCa}
                      onChange={e => setGiaCa(parseFloat(e.target.value) || 5)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bảo hành (thang 5)</label>
                    <input
                      type="number" step="0.1" min="1" max="5"
                      className="w-full border border-slate-300 rounded p-2 font-mono"
                      value={baoHanh}
                      onChange={e => setBaoHanh(parseFloat(e.target.value) || 5)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhận xét &amp; Khuyến nghị</label>
                  <textarea
                    rows={2}
                    className="w-full border border-slate-300 rounded p-2"
                    value={nx}
                    onChange={e => setNx(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded font-medium text-slate-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded"
                  >
                    Lưu Bảng Đánh Giá (CT-08a)
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Mã ĐG (CT-08a)</th>
                    <th className="p-2.5">Số Hợp đồng</th>
                    <th className="p-2.5">Nhà cung ứng</th>
                    <th className="p-2.5 text-center">Chất lượng</th>
                    <th className="p-2.5 text-center">Tiến độ</th>
                    <th className="p-2.5 text-center">Giá cả</th>
                    <th className="p-2.5 text-center">Bảo hành</th>
                    <th className="p-2.5 text-center font-bold">Tổng điểm (100)</th>
                    <th className="p-2.5 text-center">Xếp loại</th>
                    <th className="p-2.5">Cán bộ đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {supplierPostEvals.map((e, idx) => (
                    <tr key={`${e.id}-${idx}`} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-blue-900">{e.id}</td>
                      <td className="p-2.5 font-mono text-slate-600">{e.hopDongId}</td>
                      <td className="p-2.5 font-bold text-slate-800">{e.ncuTen}</td>
                      <td className="p-2.5 text-center font-mono font-semibold">{e.diemChatLuong}/5</td>
                      <td className="p-2.5 text-center font-mono font-semibold">{e.diemTienDo}/5</td>
                      <td className="p-2.5 text-center font-mono font-semibold">{e.diemGiaCa}/5</td>
                      <td className="p-2.5 text-center font-mono font-semibold">{e.diemBaoHanh}/5</td>
                      <td className="p-2.5 text-center font-mono font-bold text-blue-900 text-sm">{e.tongDiem}</td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          e.xepLoai.startsWith('A') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          e.xepLoai.startsWith('B') ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          e.xepLoai.startsWith('C') ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {e.xepLoai}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 font-medium">{e.nguoiDanhGia}</td>
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
