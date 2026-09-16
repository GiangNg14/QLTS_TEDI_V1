import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OPEN_ISSUES_LIST } from '../../data/mockData';
import { HelpCircle, CheckSquare, Square, Filter, AlertCircle, ArrowRight } from 'lucide-react';

interface OpenIssuesScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const OpenIssuesScreen: React.FC<OpenIssuesScreenProps> = ({ onNavigate }) => {
  const { openIssuesStatus, toggleOpenIssue } = useApp();
  const [selectedModule, setSelectedModule] = useState<string>('Tất cả');

  const modules = ['Tất cả', ...Array.from(new Set(OPEN_ISSUES_LIST.map(i => i.mh)))];

  const filteredIssues = OPEN_ISSUES_LIST.filter(i => selectedModule === 'Tất cả' || i.mh === selectedModule);

  const resolvedCount = Object.values(openIssuesStatus).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            HỆ THỐNG / ĐIỂM CHỜ CHỐT DỰ ÁN TEDI
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ma trận 17 Điểm chờ chốt (Open Issues Q-01 .. Q-17)</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
              OI (Open Issues)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Các câu hỏi về quy trình nghiệp vụ và phân quyền chờ ban lãnh đạo TEDI chốt chính thức. Bấm vào ô chốt để đánh dấu tiến độ.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded text-xs font-mono font-bold text-slate-800">
          <span>Tiến độ chốt: {resolvedCount} / {OPEN_ISSUES_LIST.length} điểm</span>
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {modules.map(m => (
          <button
            key={m}
            onClick={() => setSelectedModule(m)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              selectedModule === m
                ? 'bg-emerald-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIssues.map((item) => {
          const isDone = !!openIssuesStatus[item.ma];

          return (
            <div
              key={item.ma}
              className={`bg-white border rounded-lg p-4 shadow-xs space-y-3 transition-colors ${
                isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 text-emerald-800 rounded">
                    {item.ma}
                  </span>
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">{item.mh}</span>
                </div>

                <button
                  onClick={() => toggleOpenIssue(item.ma)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isDone ? <CheckSquare className="w-3.5 h-3.5 text-emerald-700" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isDone ? 'Đã chốt' : 'Chờ chốt'}</span>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900 leading-snug">{item.ten}</h3>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{item.mo}</p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded text-[11px] text-slate-700 space-y-1">
                <div><strong className="text-slate-900">Quy trình tác động:</strong> {item.q}</div>
                <div><strong className="text-slate-900">Đề xuất xử lý:</strong> {item.xl}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
