import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { CheckCircle2, Upload } from 'lucide-react';

interface AcceptanceScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const AcceptanceScreen: React.FC<AcceptanceScreenProps> = ({ onNavigate }) => {
  const { deliverables, addLog } = useApp();
  const item = deliverables[0];
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');

  const handleKCSChange = (val: 'Đạt' | 'Đạt một phần' | 'Không đạt') => {
    item.kcs = val;
    addLog(`Cập nhật KCS nghiệm thu ${item.id}: ${val}`);
  };

  const handleFileStatus = (idx: number, status: 'Đang xem xét' | 'Bị trả lại' | 'Được chấp nhận') => {
    item.files[idx].tt = status;
    addLog(`Cập nhật trạng thái tệp ${item.files[idx].ten} thành ${status}`);
  };

  const handleHandover = () => {
    if (item.files.some(f => f.tt === 'Đang xem xét')) {
      alert('Còn tệp đang ở trạng thái Xem xét. Vui lòng phê duyệt hoặc yêu cầu sửa đổi trước.');
      return;
    }
    item.trangThai = 'Đã bàn giao';
    item.ngayBanGiao = '2026-08-12';
    item.nguoiNhan = 'Phạm Thị Lan (QLCL)';
    addLog(`Bàn giao sản phẩm tư vấn ${item.id} cho phòng QLCL`);
    alert('Đã bàn giao sản phẩm cho phòng thực hiện.');
  };

  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['MUA SẮM', 'Nghiệm thu dịch vụ & Tư vấn (MH16)']}
        activeView={activeView}
        onViewChange={setActiveView}
        onCreateNew={() => alert("Tạo mới biên bản nghiệm thu dịch vụ.")}
        createLabel="Tạo Nghiệm thu"
        onExportExcel={() => alert("Đã xuất danh sách Nghiệm thu Dịch vụ Excel.")}
      />

      {/* Main Info Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div>• Mã nghiệm thu: <strong className="font-mono text-blue-900">{item.id}</strong></div>
          <div>• Hợp đồng liên quan: <button onClick={() => onNavigate('mh17')} className="font-mono text-blue-800 font-bold hover:underline">{item.hd}</button></div>
          <div>• Nhà cung ứng: <strong className="text-slate-800">{item.ncu}</strong></div>
          <div>• Ngày nhận bàn giao: <span className="font-mono">{formatDMY(item.ngayNhan)}</span></div>
        </div>
        <div className="space-y-2">
          <div>• Mô tả sản phẩm: <span className="text-slate-700">{item.moTa}</span></div>
          <div>• Phòng kiểm tra chất lượng: <strong className="text-slate-800">{item.phongKT}</strong></div>
          <div>• Nhận xét kiểm tra sơ bộ: <span className="italic text-slate-600">{item.nhanXet}</span></div>
        </div>
      </div>

      {/* Quality Check (KCS) Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Kết quả Kiểm tra Chất lượng (KCS)</h3>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-medium text-slate-600">Đánh giá KCS:</span>
          {(['Đạt', 'Đạt một phần', 'Không đạt'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => handleKCSChange(status)}
              className={`px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
                item.kcs === status
                  ? status === 'Không đạt'
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {item.kcs === 'Không đạt' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Yêu cầu sửa đổi / làm lại gửi NCU:</label>
            <textarea
              rows={2}
              className="w-full border border-slate-300 rounded p-2 text-xs"
              value={item.yeuCau}
              onChange={e => { item.yeuCau = e.target.value; }}
              placeholder="Ghi rõ chi tiết hồ sơ cần bổ sung, chỉnh sửa..."
            />
          </div>
        )}
      </div>

      {/* Deliverable Files Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Danh mục Tệp Sản phẩm (Quản lý phiên bản)</h3>
          <button
            onClick={() => alert('Chức năng nhận tệp nộp lại: Tự động tăng phiên bản v2, v3...')}
            className="flex items-center gap-1 text-xs text-blue-800 hover:underline font-semibold"
          >
            <Upload className="w-3.5 h-3.5" /> Nhận tệp nộp lại
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="p-2.5">Tên tệp hồ sơ</th>
                <th className="p-2.5 text-center">Phiên bản</th>
                <th className="p-2.5">Ngày nộp</th>
                <th className="p-2.5">Người nộp</th>
                <th className="p-2.5">Trạng thái tệp</th>
                <th className="p-2.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {item.files.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono font-medium text-slate-800">{f.ten}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-600">v{f.v}</td>
                  <td className="p-2.5 font-mono text-slate-500">{formatDMY(f.ngay)}</td>
                  <td className="p-2.5 text-slate-700">{f.nguoi}</td>
                  <td className="p-2.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                      f.tt === 'Được chấp nhận'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : f.tt === 'Bị trả lại'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {f.tt}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    {f.tt === 'Đang xem xét' ? (
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleFileStatus(idx, 'Được chấp nhận')}
                          className="px-2 py-0.5 bg-blue-700 text-white rounded text-[10px] font-semibold"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleFileStatus(idx, 'Bị trả lại')}
                          className="px-2 py-0.5 bg-rose-700 text-white rounded text-[10px] font-semibold"
                        >
                          Trả lại
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Bàn giao sản phẩm sau khi đã được thẩm định Đạt.</span>
          <button
            onClick={handleHandover}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Bàn giao cho phòng thực hiện
          </button>
        </div>
      </div>
    </div>
  );
};
