import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND, formatNum } from '../../data/mockData';
import { ExpertCandidate } from '../../types';
import { FileCheck, AlertCircle, CheckCircle2, UserCheck, Layers, Plus } from 'lucide-react';

interface ExpertScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

const DOC_KEYS: Array<{ key: keyof ExpertCandidate['ho']; label: string }> = [
  { key: 'don', label: 'Đơn xin làm việc' },
  { key: 'lyLich', label: 'Sơ yếu lý lịch' },
  { key: 'khoaHoc', label: 'Lý lịch khoa học' },
  { key: 'chungChi', label: 'Chứng chỉ chuyên môn' }
];

export const ExpertScreen: React.FC<ExpertScreenProps> = ({ onNavigate }) => {
  const { experts, addLog } = useApp();
  const [selectedExpert, setSelectedExpert] = useState<ExpertCandidate | null>(null);
  const [activeTab, setActiveTab] = useState<'ds' | 'kb' | 'cmp'>('ds');
  const [cmpIds, setCmpIds] = useState<string[]>([]);

  const getCompletionPct = (e: ExpertCandidate) => {
    const count = DOC_KEYS.filter(d => e.ho[d.key]).length;
    return Math.round((count / DOC_KEYS.length) * 100);
  };

  const handleToggleDoc = (expId: string, docKey: keyof ExpertCandidate['ho']) => {
    const exp = experts.find(x => x.id === expId);
    if (!exp) return;

    exp.ho[docKey] = !exp.ho[docKey];
    const pct = getCompletionPct(exp);
    if (pct < 100 && exp.giaiDoan === 'Đề xuất lựa chọn') {
      exp.giaiDoan = 'Chưa đủ hồ sơ';
    } else if (pct === 100 && exp.giaiDoan === 'Chưa đủ hồ sơ') {
      exp.giaiDoan = 'Đủ hồ sơ';
    }
    addLog(`Cập nhật tệp hồ sơ cho chuyên gia ${exp.ten}`);
    setSelectedExpert({ ...exp });
  };

  const handleProposeCandidate = (exp: ExpertCandidate) => {
    const pct = getCompletionPct(exp);
    if (pct < 100) {
      alert(`Hồ sơ chuyên gia mới đạt ${pct}%. Yêu cầu đủ 100% (4/4 tài liệu) mới được đề xuất lựa chọn.`);
      return;
    }
    const reason = prompt('Nhập lý do đề xuất lựa chọn chuyên gia:', exp.lyDo || '');
    if (!reason || !reason.trim()) {
      alert('Phải nhập lý do đề xuất.');
      return;
    }
    exp.lyDo = reason.trim();
    exp.giaiDoan = 'Đề xuất lựa chọn';
    addLog(`Đề xuất chọn chuyên gia ${exp.ten}`);
    alert(`Đã gửi đề xuất lựa chọn chuyên gia ${exp.ten}`);
    setSelectedExpert({ ...exp });
  };

  if (selectedExpert) {
    const pct = getCompletionPct(selectedExpert);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
              MUA SẮM / HỒ SƠ CHUYÊN GIA / {selectedExpert.id}
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Chuyên gia {selectedExpert.ten}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                selectedExpert.giaiDoan === 'Đã duyệt'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedExpert.giaiDoan === 'Chưa đủ hồ sơ'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}>
                {selectedExpert.giaiDoan}
              </span>
            </h1>
          </div>
          <button
            onClick={() => setSelectedExpert(null)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded text-xs font-semibold shadow-xs"
          >
            ← Về danh sách chuyên gia
          </button>
        </div>

        {/* Details Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div>• Lĩnh vực chuyên môn: <strong className="text-slate-800">{selectedExpert.linhVuc}</strong></div>
            <div>• Số năm kinh nghiệm: <strong className="font-mono text-slate-800">{selectedExpert.namKN} năm</strong></div>
            <div>• Học vị: <strong>{selectedExpert.hocVi}</strong></div>
            <div>• Số công trình đã tham gia: <strong className="font-mono text-slate-800">{selectedExpert.soCT} dự án</strong></div>
          </div>
          <div className="space-y-2">
            <div>• Mức phí đề xuất: <strong className="font-mono text-emerald-800 text-sm">{formatVND(selectedExpert.phi)}</strong></div>
            <div>• Dự án đề xuất: <span className="text-slate-800">{selectedExpert.duAn}</span></div>
            <div>• Lý do lựa chọn: <span className="italic text-slate-600">{selectedExpert.lyDo || '—'}</span></div>
          </div>
        </div>

        {/* 4 Required Documents Checklist Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Checklist Hồ sơ Chuyên gia (4 tài liệu bắt buộc)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Quy tắc chặn: Phải nộp đủ 100% mới được phê duyệt hợp đồng tư vấn.</p>
            </div>
            <div className="text-right">
              <span className={`font-mono font-bold text-sm ${pct === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {pct}% Hoàn thành
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${pct === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
            {DOC_KEYS.map(d => {
              const hasDoc = selectedExpert.ho[d.key];
              return (
                <div key={d.key} className="p-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    {hasDoc ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      hasDoc ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {hasDoc ? 'Đã nộp tệp PDF' : 'Thiếu tệp'}
                    </span>
                    <button
                      onClick={() => handleToggleDoc(selectedExpert.id, d.key)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded font-medium text-[11px]"
                    >
                      {hasDoc ? 'Bỏ tệp' : 'Tải lên'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setSelectedExpert(null)}
              className="text-xs text-slate-600 hover:underline font-medium"
            >
              ← Về danh sách
            </button>

            {selectedExpert.giaiDoan !== 'Đã duyệt' && (
              <button
                onClick={() => handleProposeCandidate(selectedExpert)}
                className={`flex items-center gap-1.5 px-4 py-2 text-white rounded text-xs font-bold shadow-xs ${
                  pct === 100 ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Đề xuất Lựa chọn Chuyên gia
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            MUA SẮM / HỒ SƠ CHUYÊN GIA
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Danh sách &amp; Lựa chọn Chuyên gia</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              MH14
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Bốn loại tài liệu bắt buộc cho mỗi chuyên gia. Phải đủ 100% hồ sơ mới được đề xuất lựa chọn.
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ds')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'ds' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Danh sách
          </button>
          <button
            onClick={() => setActiveTab('cmp')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'cmp' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            So sánh ứng viên ({cmpIds.length})
          </button>
        </div>
      </div>

      {activeTab === 'ds' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider text-left">
                  <th className="p-3">Mã hồ sơ</th>
                  <th className="p-3">Họ tên Chuyên gia</th>
                  <th className="p-3">Lĩnh vực</th>
                  <th className="p-3 text-right">Kinh nghiệm</th>
                  <th className="p-3">Học vị</th>
                  <th className="p-3 text-right">Mức phí</th>
                  <th className="p-3 min-w-[120px]">Tiến độ hồ sơ</th>
                  <th className="p-3">Giai đoạn</th>
                  <th className="p-3 text-center">So sánh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {experts.map((exp) => {
                  const pct = getCompletionPct(exp);
                  const isCmp = cmpIds.includes(exp.id);
                  return (
                    <tr
                      key={exp.id}
                      onClick={() => setSelectedExpert(exp)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-emerald-800">{exp.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{exp.ten}</td>
                      <td className="p-3 text-slate-600">{exp.linhVuc}</td>
                      <td className="p-3 text-right font-mono">{exp.namKN} năm</td>
                      <td className="p-3 font-medium text-slate-700">{exp.hocVi}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatVND(exp.phi)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${pct === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] font-bold text-slate-600">{pct}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] ${
                          exp.giaiDoan === 'Đã duyệt'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                            : exp.giaiDoan === 'Chưa đủ hồ sơ'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {exp.giaiDoan}
                        </span>
                      </td>
                      <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (isCmp) setCmpIds(cmpIds.filter(i => i !== exp.id));
                            else setCmpIds([...cmpIds, exp.id]);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                            isCmp
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isCmp ? 'Đã chọn' : '+ So sánh'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cmp' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Ma trận So sánh Chuyên gia</h3>
          {cmpIds.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Chưa chọn ứng viên nào để so sánh. Hãy quay lại danh sách và bấm "+ So sánh".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-3 text-left w-40">Tiêu chí</th>
                    {cmpIds.map(id => {
                      const exp = experts.find(e => e.id === id);
                      return (
                        <th key={id} className="p-3 text-center border-l border-slate-200 min-w-[180px]">
                          <div className="font-bold text-slate-900 text-sm">{exp?.ten}</div>
                          <div className="text-[10px] font-mono text-slate-400">{exp?.id}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Lĩnh vực chuyên môn</td>
                    {cmpIds.map(id => <td key={id} className="p-3 text-center border-l border-slate-200">{experts.find(e => e.id === id)?.linhVuc}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Số năm kinh nghiệm</td>
                    {cmpIds.map(id => <td key={id} className="p-3 text-center border-l border-slate-200 font-mono font-bold">{experts.find(e => e.id === id)?.namKN} năm</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Học vị</td>
                    {cmpIds.map(id => <td key={id} className="p-3 text-center border-l border-slate-200">{experts.find(e => e.id === id)?.hocVi}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Mức phí đề xuất</td>
                    {cmpIds.map(id => <td key={id} className="p-3 text-center border-l border-slate-200 font-mono font-bold text-emerald-800">{formatVND(experts.find(e => e.id === id)?.phi || 0)}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Tiến độ hồ sơ</td>
                    {cmpIds.map(id => {
                      const exp = experts.find(e => e.id === id);
                      const pct = exp ? getCompletionPct(exp) : 0;
                      return (
                        <td key={id} className="p-3 text-center border-l border-slate-200 font-mono font-bold">
                          {pct}% (4/4 tài liệu)
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
