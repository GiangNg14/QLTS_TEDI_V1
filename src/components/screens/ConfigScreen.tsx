import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../data/mockData';
import { Settings, ShieldCheck, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';

interface ConfigScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onNavigate }) => {
  const { config, updateConfig, resetAll, addLog } = useApp();

  const [nguongTS, setNguongTS] = useState(config.nguongTSCD);
  const [hanMucX, setHanMucX] = useState(config.hanMucX);
  const [hanMucY, setHanMucY] = useState(config.hanMucY);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      nguongTSCD: nguongTS,
      hanMucX: hanMucX,
      hanMucY: hanMucY
    });
    alert('Đã lưu tham số cấu hình hệ thống.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            HỆ THỐNG / THAM SỐ CẤU HÌNH &amp; PHẠM VI
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tham số Hệ thống &amp; Bảng so sánh Odoo Community vs Enterprise</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              CFG (tedi_config)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cấu hình các hạn mức phê duyệt mua sắm, ngưỡng phân loại TSCĐ và bảng phân định chức năng giữa bản Community mở rộng tedi_asset và Enterprise.
          </p>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Nạp lại dữ liệu mẫu (Reset)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Parameters Form */}
        <form onSubmit={handleSaveConfig} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
            Tham số Ngưỡng &amp; Hạn mức Phê duyệt
          </h3>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Ngưỡng ghi tăng TSCĐ (VND) (*):
            </label>
            <input
              type="number"
              step={1000000}
              className="w-full border border-slate-200 rounded p-2 font-mono font-bold text-slate-800"
              value={nguongTS}
              onChange={e => setNguongTS(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Mặc định 30,000,000 ₫ theo Thông tư 45/2013/TT-BTC</span>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Hạn mức Trưởng phòng duyệt X (VND) (*):
            </label>
            <input
              type="number"
              step={1000000}
              className="w-full border border-slate-200 rounded p-2 font-mono font-bold text-slate-800"
              value={hanMucX}
              onChange={e => setHanMucX(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Đề xuất &lt; X do Trưởng phòng duyệt trực tiếp</span>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Hạn mức Tổng Giám đốc duyệt Y (VND) (*):
            </label>
            <input
              type="number"
              step={1000000}
              className="w-full border border-slate-200 rounded p-2 font-mono font-bold text-slate-800"
              value={hanMucY}
              onChange={e => setHanMucY(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Đề xuất X ≤ Giá trị ≤ Y cần Sếp tổng duyệt; &gt; Y cần HĐQT</span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-xs"
          >
            Lưu Tham số Hệ thống
          </button>
        </form>

        {/* Scope Matrix Comparison */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Ma trận Phân định Phạm vi Odoo Community vs Enterprise</h3>
            <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              Bản TEDI Custom
            </span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider text-left">
                <th className="p-3">Tính năng / Phân hệ</th>
                <th className="p-3 text-center">Bản Community Standard</th>
                <th className="p-3 text-center">Module tedi_asset (Thiết kế TEDI)</th>
                <th className="p-3 text-center">Bản Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Quản lý Hồ sơ &amp; Bàn giao Tài sản</td>
                <td className="p-3 text-center text-rose-600 font-bold">✕ Không có</td>
                <td className="p-3 text-center text-emerald-700 font-bold bg-emerald-50/50">✓ Đầy đủ (MH6, MH10)</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Đầy đủ</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Tự động tạo TSCĐ từ Vendor Bill</td>
                <td className="p-3 text-center text-rose-600 font-bold">✕ Không có</td>
                <td className="p-3 text-center text-emerald-700 font-bold bg-emerald-50/50">✓ Hỗ trợ theo Asset Model</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Đầy đủ</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Engine Tự động Tính &amp; Đăng Khấu hao</td>
                <td className="p-3 text-center text-rose-600 font-bold">✕ Đã bị gỡ</td>
                <td className="p-3 text-center text-amber-700 font-bold bg-amber-50/30">⚠ Theo dõi ngoài/Journal thủ công</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Đầy đủ (account.asset)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Kiểm kê &amp; Thanh lý Tài sản</td>
                <td className="p-3 text-center text-rose-600 font-bold">✕ Không có</td>
                <td className="p-3 text-center text-emerald-700 font-bold bg-emerald-50/50">✓ Đầy đủ (MH9, MH11)</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Đầy đủ</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Bảo dưỡng &amp; Sửa chữa thiết bị</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Có (maint.equipment)</td>
                <td className="p-3 text-center text-emerald-700 font-bold bg-emerald-50/50">✓ Mở rộng MTBF/MTTR (MH7, MH8)</td>
                <td className="p-3 text-center text-emerald-700 font-bold">✓ Đầy đủ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
