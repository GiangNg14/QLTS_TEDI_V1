import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentReport } from '../../types';
import { formatVND, formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  AlertTriangle, Plus, CheckCircle2, ShieldAlert, Printer, Wrench,
  Send, Save, Clock, Check, XCircle, ArrowRight, User, ShieldCheck, RefreshCw
} from 'lucide-react';

interface MaintenanceRequestScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const MaintenanceRequestScreen: React.FC<MaintenanceRequestScreenProps> = ({ onNavigate }) => {
  const { incidents, assetMasters, addIncident, updateIncident, updateIncidentStatus, addLog } = useApp();

  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('repair_log');

  const stages: IncidentReport['giaiDoan'][] = ['Mới báo hỏng', 'Đã tiếp nhận', 'Đang sửa chữa', 'Đã sửa xong', 'Không sửa được'];

  const filteredIncidents = incidents.filter(inc =>
    inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.ts.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.nguoiBao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.moTa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentIncidentIndex = incidents.findIndex(i => i.id === activeIncidentId);
  const currentIncident = incidents[currentIncidentIndex] || null;

  const handleCreateIncident = () => {
    const incId = `BH/2026/${String(incidents.length + 1).padStart(4, '0')}`;
    const firstAsset = assetMasters[0]?.ten || 'Máy xúc Bánh xốp Komatsu PC200';

    const newInc: IncidentReport = {
      id: incId,
      ngay: new Date().toISOString().split('T')[0],
      nguoiBao: 'Nguyễn Văn Nam (QLCL)',
      ts: firstAsset,
      mucDo: 'Trung bình',
      moTa: 'Thiết bị phát tiếng động lạ, rò rỉ dầu mỡ tại cuộn pít-tông thủy lực khi vận hành',
      anh: [],
      giaiDoan: 'Mới báo hỏng',
      nguoiNhan: 'Tổ kỹ thuật bảo trì TEDI',
      hinhThuc: 'Sửa chữa đột xuất',
      donVi: 'TEDI',
      chiPhi: 4500000,
      ngayXong: '',
      kq: 'Chờ tổ kỹ thuật tháo dỡ kiểm tra nguyên nhân'
    };

    addIncident(newInc);
    setActiveIncidentId(incId);
    setActiveTab('repair_log');
    addLog(`Thêm hồ sơ báo hỏng sự cố mới ${incId}`);
  };

  const handleStageChange = (newStage: IncidentReport['giaiDoan']) => {
    if (!currentIncident) return;
    const updated = { ...currentIncident, giaiDoan: newStage };
    if (newStage === 'Đã sửa xong') {
      updated.ngayXong = new Date().toISOString().split('T')[0];
    }
    updateIncident(updated);
    alert(`Đã chuyển trạng thái sự cố ${currentIncident.id} sang: ${newStage}`);
  };

  return (
    <div className="space-y-3 relative font-sans">
      {currentIncident ? (
        /* DETAIL FORM SHEET FOR INCIDENT / CORRECTIVE MAINTENANCE (MH8) */
        <OdooFormSheet
          category="KỸ THUẬT & SỬA CHỮA / BÁO HỎNG & SỬA CHỮA ĐỘT XUẤT (MH8)"
          title={`${currentIncident.id} — ${currentIncident.ts}`}
          subtitle={`Mức độ: ${currentIncident.mucDo} | Người báo: ${currentIncident.nguoiBao} | Đơn vị sửa: ${currentIncident.nguoiNhan}`}
          stages={[
            { id: 'Mới báo hỏng', label: 'Mới báo hỏng' },
            { id: 'Đã tiếp nhận', label: 'Đã tiếp nhận' },
            { id: 'Đang sửa chữa', label: 'Đang sửa chữa' },
            { id: 'Đã sửa xong', label: 'Đã sửa xong' },
            { id: 'Không sửa được', label: 'Không sửa được' }
          ]}
          currentStageId={currentIncident.giaiDoan}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateIncident}
          onBack={() => setActiveIncidentId(null)}
          currentIndex={currentIncidentIndex + 1}
          totalItems={incidents.length}
          onPrev={() => currentIncidentIndex > 0 && setActiveIncidentId(incidents[currentIncidentIndex - 1].id)}
          onNext={() => currentIncidentIndex < incidents.length - 1 && setActiveIncidentId(incidents[currentIncidentIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentIncident.giaiDoan === 'Mới báo hỏng' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đã tiếp nhận')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Tiếp nhận báo hỏng</span>
                </button>
              )}

              {currentIncident.giaiDoan === 'Đã tiếp nhận' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đang sửa chữa')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Chuyển tiến hành sửa chữa</span>
                </button>
              )}

              {currentIncident.giaiDoan === 'Đang sửa chữa' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đã sửa xong')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xác nhận Đã sửa xong</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPrintData(currentIncident)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên bản sửa chữa (BM-08)</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã sự cố báo hỏng',
              value: <span className="font-mono text-rose-900 font-bold">{currentIncident.id}</span>
            },
            {
              label: 'Thiết bị hư hỏng (*)',
              value: (
                <select
                  value={currentIncident.ts}
                  onChange={e => updateIncident({ ...currentIncident, ts: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 bg-white"
                >
                  {assetMasters.map(a => (
                    <option key={a.id} value={a.ten}>{a.id} - {a.ten} ({a.pbsd || 'QLVP'})</option>
                  ))}
                </select>
              )
            },
            {
              label: 'Người báo hỏng (*)',
              value: (
                <input
                  type="text"
                  value={currentIncident.nguoiBao}
                  onChange={e => updateIncident({ ...currentIncident, nguoiBao: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 bg-white font-medium"
                />
              )
            },
            {
              label: 'Mức độ nghiêm trọng (*)',
              value: (
                <select
                  value={currentIncident.mucDo}
                  onChange={e => updateIncident({ ...currentIncident, mucDo: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold bg-white text-rose-900"
                >
                  <option value="Thấp">Thấp — Hỏng nhẹ, vẫn vận hành tạm được</option>
                  <option value="Trung bình">Trung bình — Ảnh hưởng công việc</option>
                  <option value="Nghiêm trọng">Nghiêm trọng — Dừng toàn bộ thiết bị</option>
                </select>
              )
            },
            {
              label: 'Mô tả chi tiết hiện tượng hư hỏng',
              value: (
                <textarea
                  rows={2}
                  value={currentIncident.moTa}
                  onChange={e => updateIncident({ ...currentIncident, moTa: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-sans"
                />
              )
            }
          ]}
          rightFields={[
            {
              label: 'Ngày báo hỏng',
              value: (
                <input
                  type="date"
                  value={currentIncident.ngay || ''}
                  onChange={e => updateIncident({ ...currentIncident, ngay: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold bg-white w-full"
                />
              )
            },
            {
              label: 'Tổ / Đơn vị nhận sửa chữa',
              value: (
                <input
                  type="text"
                  value={currentIncident.nguoiNhan || ''}
                  onChange={e => updateIncident({ ...currentIncident, nguoiNhan: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 bg-white"
                />
              )
            },
            {
              label: 'Hình thức sửa chữa',
              value: (
                <input
                  type="text"
                  value={currentIncident.hinhThuc || 'Sửa chữa đột xuất'}
                  onChange={e => updateIncident({ ...currentIncident, hinhThuc: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                />
              )
            },
            {
              label: 'Chi phí sửa chữa phát sinh (VNĐ)',
              value: (
                <input
                  type="number"
                  min={0}
                  step={500000}
                  value={currentIncident.chiPhi || 0}
                  onChange={e => updateIncident({ ...currentIncident, chiPhi: parseFloat(e.target.value) || 0 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-emerald-800 bg-white text-xs w-full"
                />
              )
            },
            {
              label: 'Ngày hoàn thành sửa chữa',
              value: (
                <input
                  type="date"
                  value={currentIncident.ngayXong || ''}
                  onChange={e => updateIncident({ ...currentIncident, ngayXong: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold bg-white w-full"
                />
              )
            },
            {
              label: 'Kết quả khắc phục / Khuyến cáo',
              value: (
                <input
                  type="text"
                  value={currentIncident.kq || ''}
                  onChange={e => updateIncident({ ...currentIncident, kq: e.target.value })}
                  placeholder="Ghi nhận tình trạng sau sửa chữa..."
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white font-medium text-emerald-900"
                />
              )
            }
          ]}
          tabs={[
            { id: 'repair_log', label: 'Nhật ký khắc phục & Phụ tùng thay thế' },
            { id: 'root_cause', label: 'Nguyên nhân sự cố & Khuyến cáo an toàn' },
            { id: 'acceptance', label: 'Nghiệm thu kỹ thuật bàn giao' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `Bien_Ban_Sua_Chua_${currentIncident.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `Anh_Hien_Truong_Hu_Hong.jpg`, type: 'JPG', verified: true }
          ]}
        >
          {/* TAB 1: REPAIR LOG & SPARE PARTS */}
          {activeTab === 'repair_log' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Nhật ký xử lý sự cố &amp; Thay thế linh kiện phụ tùng</span>
                  <Wrench className="w-4 h-4 text-slate-500" />
                </h3>

                <div className="space-y-2">
                  <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-blue-900">Bước 1: Khảo sát hiện trường &amp; Chẩn đoán mã lỗi</strong>
                      <span className="font-mono text-[10px] text-slate-500">{formatDMY(currentIncident.ngay)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Tháo rã cụm chi tiết kiểm tra, xác định nguyên nhân hư hỏng và lập danh mục phụ tùng cần sửa chữa/thay thế.</p>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-emerald-900">Bước 2: Thay thế linh kiện &amp; Cân chỉnh kỹ thuật</strong>
                      <span className="font-mono text-[10px] text-slate-500">{currentIncident.ngayXong ? formatDMY(currentIncident.ngayXong) : 'Đang xử lý'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Thay thế phớt chặn dầu, vặn chặt các bulong hãm và tiến hành chạy thử không tải 30 phút.</p>
                  </div>
                </div>
              </div>

              {/* Action Save */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    updateIncident(currentIncident);
                    alert(`Đã lưu thông tin chi tiết sự cố ${currentIncident.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu hồ sơ báo hỏng</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROOT CAUSE */}
          {activeTab === 'root_cause' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 space-y-2">
                <strong className="font-bold text-xs uppercase tracking-wider text-amber-800 block">Đánh giá nguyên nhân sự cố (Root Cause Analysis):</strong>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Thiết bị hoạt động liên tục ở tải trọng cao trong điều kiện công trường khói bụi dẫn đến mài mòn nhanh các chi tiết phớt làm kín, cần tăng chu kỳ bảo dưỡng mỡ định kỳ.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL ACCEPTANCE */}
          {activeTab === 'acceptance' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <h4 className="font-bold text-xs text-slate-800 uppercase">Biên bản nghiệm thu chạy thử thiết bị</h4>
                <p className="text-slate-600 leading-relaxed">
                  Đại diện Tổ Kỹ thuật và Người vận hành trực tiếp xác nhận thiết bị đã được khắc phục hoàn toàn sự cố, các thông số áp suất, nhiệt độ, độ chính xác đều đạt yêu cầu kỹ thuật TEDI.
                </p>
              </div>
            </div>
          )}
        </OdooFormSheet>
      ) : (
        /* MASTER VIEW FOR INCIDENT REPORTS (MH8) */
        <>
          <OdooControlPanel
            breadcrumb={['KỸ THUẬT & SỬA CHỮA', 'Báo hỏng & Sửa chữa đột xuất (MH8)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredIncidents.length}
            onCreateNew={handleCreateIncident}
            createLabel="Báo hỏng mới"
            onExportExcel={() => alert("Đã xuất danh sách sự cố báo hỏng Odoo Excel.")}
          />

          {activeView === 'kanban' ? (
            /* ODOO KANBAN BOARD */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stages.map((st) => {
                const list = filteredIncidents.filter(i => i.giaiDoan === st);

                return (
                  <div key={st} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2.5 min-h-[380px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{st}</span>
                      <span className="font-mono font-bold text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {list.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {list.map(inc => (
                        <div
                          key={inc.id}
                          onClick={() => setActiveIncidentId(inc.id)}
                          className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer space-y-2 text-xs relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-rose-900">{inc.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inc.mucDo === 'Nghiêm trọng'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : inc.mucDo === 'Trung bình'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {inc.mucDo}
                            </span>
                          </div>

                          <strong className="block text-slate-900 font-bold line-clamp-1">{inc.ts}</strong>
                          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{inc.moTa}</p>

                          <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                            <div>• <strong>Người báo:</strong> {inc.nguoiBao}</div>
                            <div>• <strong>Chi phí:</strong> <strong className="font-mono text-emerald-800">{formatVND(inc.chiPhi || 0)}</strong></div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">{formatDMY(inc.ngay)}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrintData(inc);
                              }}
                              className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" />
                              <span>In BM-08</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {list.length === 0 && (
                        <div className="text-center text-slate-400 text-xs py-12 italic">
                          Không có thẻ sự cố
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ODOO LIST VIEW */
            <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-tight">
                      <th className="p-2.5 w-8 text-center border-r border-slate-100">
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-600 mx-auto flex items-center justify-center cursor-pointer">
                          <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                        </div>
                      </th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã sự cố</th>
                      <th className="p-2.5 border-r border-slate-100">Thiết bị hư hỏng</th>
                      <th className="p-2.5 border-r border-slate-100">Mô tả sự cố</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mức độ</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Người báo hỏng</th>
                      <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Chi phí sửa</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Đơn vị sửa</th>
                      <th className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">Giai đoạn</th>
                      <th className="p-2.5 text-center whitespace-nowrap">In BM-08</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredIncidents.map((inc, idx) => {
                      const isEven = idx % 2 === 0;

                      let stText = inc.giaiDoan;
                      let stBg = 'bg-slate-600 text-white';

                      if (stText === 'Mới báo hỏng') stBg = 'bg-rose-600 text-white';
                      else if (stText === 'Đã tiếp nhận') stBg = 'bg-amber-600 text-white';
                      else if (stText === 'Đang sửa chữa') stBg = 'bg-sky-600 text-white';
                      else if (stText === 'Đã sửa xong') stBg = 'bg-emerald-700 text-white';
                      else if (stText === 'Không sửa được') stBg = 'bg-slate-800 text-white';

                      return (
                        <tr
                          key={inc.id}
                          onClick={() => setActiveIncidentId(inc.id)}
                          className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                            isEven ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                        >
                          <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-50">
                              <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                            </div>
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-rose-900 whitespace-nowrap font-mono">
                            {inc.id}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-slate-800">
                            {inc.ts}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-600 max-w-xs truncate">
                            {inc.moTa}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-semibold whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inc.mucDo === 'Nghiêm trọng' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inc.mucDo}
                            </span>
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-800 font-medium whitespace-nowrap">
                            {inc.nguoiBao}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                            {formatVND(inc.chiPhi || 0)}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-700 whitespace-nowrap">
                            {inc.nguoiNhan || 'Tổ kỹ thuật TEDI'}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                            <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                              {stText}
                            </span>
                          </td>

                          <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setPrintData(inc)}
                              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              <span>In BM-08</span>
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
        </>
      )}

      {/* Print Modal */}
      {printData && (
        <PrintA4Modal
          type="incident"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
