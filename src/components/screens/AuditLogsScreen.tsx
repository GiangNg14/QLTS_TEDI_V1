import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Clock, FileText } from 'lucide-react';

interface AuditLogsScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const AuditLogsScreen: React.FC<AuditLogsScreenProps> = ({ onNavigate }) => {
  const { logs } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            HỆ THỐNG / LỊCH SỬ THAO TÁC
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Nhật ký Thao tác System Audit Trail</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              LOGS
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Ghi nhận tự động toàn bộ thời gian, thao tác phê duyệt, tạo chứng từ, ghi tăng/giảm tài sản và cập nhật tham số.
          </p>
        </div>
      </div>

      {/* Logs Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Dòng sự kiện hệ thống</h3>
          <span className="text-xs text-slate-500 font-mono">{logs.length} bản ghi</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs font-mono p-2">
          {logs.map((log, idx) => (
            <div key={idx} className="p-3 hover:bg-slate-50 flex items-start gap-3">
              <span className="text-slate-400 shrink-0 font-semibold">{log.khi}</span>
              <span className="text-slate-800 font-medium">{log.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
