import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaintenanceTask } from '../../types';
import { formatVND, formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import {
  Wrench, Calendar, Plus, CheckCircle2, Clock, AlertTriangle, Printer,
  Save, Play, RotateCcw, ShieldCheck, Check, Layers, Cpu, Activity
} from 'lucide-react';

interface MaintenanceScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onNavigate }) => {
  const { maintenanceTasks, assetMasters, addMaintenanceTask, updateMaintenanceTask, updateMaintenanceStatus, addLog } = useApp();

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('items');

  const filteredTasks = maintenanceTasks.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ts.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.loai.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.doi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTaskIndex = maintenanceTasks.findIndex(t => t.id === activeTaskId);
  const currentTask = maintenanceTasks[currentTaskIndex] || null;

  const handleCreateTask = () => {
    const newId = `BD/2026/${String(maintenanceTasks.length + 1).padStart(4, '0')}`;
    const firstAsset = assetMasters[0]?.ten || 'Máy toàn đạc điện tử Leica TS07';

    const newTask: MaintenanceTask = {
      id: newId,
      ts: firstAsset,
      loai: 'Bảo dưỡng',
      hinhThuc: 'Tự thực hiện',
      chuKyLoai: 'Chu kỳ cố định',
      chuKy: 90,
      nsx: 'Leica Geosystems / TEDI',
      lanGanNhat: new Date().toISOString().split('T')[0],
      doi: 'Tổ kỹ thuật bảo trì TEDI',
      chiPhi: 3500000,
      giaiDoan: 'Mới',
      kq: 'Chờ thực hiện bảo dưỡng định kỳ theo lịch'
    };

    addMaintenanceTask(newTask);
    setActiveTaskId(newId);
    setActiveTab('items');
    addLog(`Lập kế hoạch bảo dưỡng / kiểm định định kỳ mới ${newId}`);
  };

  const handleStageChange = (newStage: MaintenanceTask['giaiDoan']) => {
    if (!currentTask) return;
    const updated = { ...currentTask, giaiDoan: newStage };
    if (newStage === 'Hoàn thành' || newStage === 'Đạt') {
      updated.lanGanNhat = new Date().toISOString().split('T')[0];
    }
    updateMaintenanceTask(updated);
    alert(`Đã cập nhật giai đoạn bảo dưỡng ${currentTask.id} sang: ${newStage}`);
  };

  const computeNextDueDate = (task: MaintenanceTask): string => {
    if (!task.lanGanNhat) return 'Chưa xác định';
    const lastDate = new Date(task.lanGanNhat);
    lastDate.setDate(lastDate.getDate() + (task.chuKy || 90));
    return lastDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-3 relative font-sans">
      {currentTask ? (
        /* DETAIL FORM SHEET FOR MAINTENANCE TASK (MH7) */
        <OdooFormSheet
          category="KỸ THUẬT & THIẾT BỊ / KẾ HOẠCH BẢO DƯỠNG & KIỂM ĐỊNH (MH7)"
          title={`${currentTask.id} — ${currentTask.ts}`}
          subtitle={`Loại: ${currentTask.loai} | Hình thức: ${currentTask.hinhThuc} | Chu kỳ: ${currentTask.chuKy} ngày | Đội: ${currentTask.doi}`}
          stages={[
            { id: 'Mới', label: 'Mới tạo' },
            { id: 'Đang thực hiện', label: 'Đang thực hiện' },
            { id: 'Hoàn thành', label: 'Hoàn thành' },
            { id: 'Đạt', label: 'Đạt tiêu chuẩn' },
            { id: 'Không đạt', label: 'Không đạt' }
          ]}
          currentStageId={currentTask.giaiDoan}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateTask}
          onBack={() => setActiveTaskId(null)}
          currentIndex={currentTaskIndex + 1}
          totalItems={maintenanceTasks.length}
          onPrev={() => currentTaskIndex > 0 && setActiveTaskId(maintenanceTasks[currentTaskIndex - 1].id)}
          onNext={() => currentTaskIndex < maintenanceTasks.length - 1 && setActiveTaskId(maintenanceTasks[currentTaskIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentTask.giaiDoan === 'Mới' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đang thực hiện')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Bắt đầu bảo dưỡng</span>
                </button>
              )}

              {currentTask.giaiDoan === 'Đang thực hiện' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đạt')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Nghiệm thu Đạt tiêu chuẩn</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPrintData(currentTask)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In phiếu công tác (BM-07)</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã công tác bảo dưỡng',
              value: <span className="font-mono text-emerald-900 font-bold">{currentTask.id}</span>
            },
            {
              label: 'Chọn thiết bị / Tài sản (*)',
              value: (
                <select
                  value={currentTask.ts}
                  onChange={e => updateMaintenanceTask({ ...currentTask, ts: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 bg-white"
                >
                  {assetMasters.map(a => (
                    <option key={a.id} value={a.ten}>{a.id} - {a.ten} ({a.pbsd || 'QLVP'})</option>
                  ))}
                </select>
              )
            },
            {
              label: 'Loại hình công tác (*)',
              value: (
                <select
                  value={currentTask.loai}
                  onChange={e => updateMaintenanceTask({ ...currentTask, loai: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="Bảo dưỡng">Bảo dưỡng định kỳ</option>
                  <option value="Kiểm định">Kiểm định an toàn ISO</option>
                  <option value="Hiệu chỉnh">Hiệu chỉnh độ chính xác</option>
                </select>
              )
            },
            {
              label: 'Hình thức thực hiện',
              value: (
                <select
                  value={currentTask.hinhThuc}
                  onChange={e => updateMaintenanceTask({ ...currentTask, hinhThuc: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                >
                  <option value="Tự thực hiện">Tự thực hiện (Tổ Kỹ thuật nội bộ)</option>
                  <option value="Thuê ngoài">Thuê ngoài (Đại lý / Trung tâm kiểm định)</option>
                </select>
              )
            },
            {
              label: 'Chu kỳ bảo dưỡng (số ngày)',
              value: (
                <input
                  type="number"
                  min={1}
                  value={currentTask.chuKy}
                  onChange={e => updateMaintenanceTask({ ...currentTask, chuKy: parseInt(e.target.value) || 90 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 bg-white text-xs w-28"
                />
              )
            },
            {
              label: 'Loại chu kỳ',
              value: (
                <select
                  value={currentTask.chuKyLoai}
                  onChange={e => updateMaintenanceTask({ ...currentTask, chuKyLoai: e.target.value as any })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                >
                  <option value="Chu kỳ cố định">Chu kỳ cố định (ISO TEDI)</option>
                  <option value="Khuyến cáo NSX">Theo khuyến cáo Nhà sản xuất</option>
                </select>
              )
            }
          ]}
          rightFields={[
            {
              label: 'Lần thực hiện gần nhất',
              value: (
                <input
                  type="date"
                  value={currentTask.lanGanNhat || ''}
                  onChange={e => updateMaintenanceTask({ ...currentTask, lanGanNhat: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold bg-white w-full"
                />
              )
            },
            {
              label: 'Ngày dự kiến tiếp theo',
              value: (
                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded inline-block">
                  {formatDMY(computeNextDueDate(currentTask))}
                </span>
              )
            },
            {
              label: 'Dự toán chi phí (VNĐ)',
              value: (
                <input
                  type="number"
                  min={0}
                  step={500000}
                  value={currentTask.chiPhi}
                  onChange={e => updateMaintenanceTask({ ...currentTask, chiPhi: parseFloat(e.target.value) || 0 })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900 bg-white text-xs w-full"
                />
              )
            },
            {
              label: 'Đội / Đơn vị thực hiện',
              value: (
                <input
                  type="text"
                  value={currentTask.doi}
                  onChange={e => updateMaintenanceTask({ ...currentTask, doi: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold bg-white"
                />
              )
            },
            {
              label: 'Hãng sản xuất / Thương hiệu',
              value: (
                <input
                  type="text"
                  value={currentTask.nsx}
                  onChange={e => updateMaintenanceTask({ ...currentTask, nsx: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                />
              )
            },
            {
              label: 'Kết quả đánh giá kiểm định',
              value: (
                <input
                  type="text"
                  value={currentTask.kq || ''}
                  onChange={e => updateMaintenanceTask({ ...currentTask, kq: e.target.value })}
                  placeholder="Ghi nhận tem kiểm định / kết quả..."
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white font-medium text-emerald-900"
                />
              )
            }
          ]}
          tabs={[
            { id: 'items', label: 'Hạng mục kiểm tra & Vật tư phụ tùng' },
            { id: 'mtbf', label: 'Chỉ số MTBF / MTTR & Lịch sử kỳ trước' },
            { id: 'files', label: 'Giấy chứng nhận & Hồ sơ ISO' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `Bien_Ban_Kiem_Dinh_${currentTask.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `Tem_Kiem_Dinh_An_Toan_2026.png`, type: 'PNG', verified: true }
          ]}
        >
          {/* TAB 1: CHECKLIST & SPARE PARTS */}
          {activeTab === 'items' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Hạng mục kiểm tra kỹ thuật tiêu chuẩn (ISO QT-BD07)</span>
                  <Wrench className="w-4 h-4 text-slate-500" />
                </h3>

                <div className="space-y-2">
                  <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                    <span className="font-semibold text-slate-800">1. Vệ sinh tổng thể, kiểm tra khớp nối &amp; Nguồn điện vỏ máy</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">ĐẠT (OK)</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                    <span className="font-semibold text-slate-800">2. Tra dầu mỡ bôi trơn bánh răng &amp; Thay lọc mỡ định kỳ</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">ĐẠT (OK)</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                    <span className="font-semibold text-slate-800">3. Đo kiểm sai số góc, khoảng cách &amp; Căn chỉnh quang học</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">ĐANG HIỆU CHỈNH</span>
                  </div>
                </div>
              </div>

              {/* Action Save */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    updateMaintenanceTask(currentTask);
                    alert(`Đã lưu cập nhật thông tin nhiệm vụ bảo dưỡng ${currentTask.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu kế hoạch bảo dưỡng</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MTBF / MTTR KPI & HISTORY */}
          {activeTab === 'mtbf' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">MTBF (Mean Time Between Failures)</span>
                  <div className="text-xl font-mono font-bold">120 Ngày / Lần sự cố</div>
                  <p className="text-[11px] text-emerald-800">Thời gian hoạt động liên tục bình quân không phát sinh sự cố đột xuất.</p>
                </div>

                <div className="p-4 bg-sky-50 border border-sky-200 rounded-md text-sky-900 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">MTTR (Mean Time To Repair)</span>
                  <div className="text-xl font-mono font-bold">4.2 Giờ / Sự cố</div>
                  <p className="text-[11px] text-sky-800">Thời gian trung bình để đội kỹ thuật sửa chữa phục hồi thiết bị.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-800">Lịch sử các đợt bảo dưỡng / kiểm định trước</h4>
                <div className="bg-white border border-slate-200 rounded p-2 text-slate-700">
                  <p>• <strong>Lần gần nhất:</strong> {formatDMY(currentTask.lanGanNhat)} — Kết quả: {currentTask.kq || 'Đạt tem kiểm định TEDI'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ISO FILES */}
          {activeTab === 'files' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                <h4 className="font-bold text-xs text-slate-800 uppercase mb-2">Quy định Kiểm định An toàn &amp; Bảo dưỡng ISO TEDI</h4>
                <p className="text-slate-600 leading-relaxed">
                  Thiết bị đo đạc, phương tiện thi công và máy móc công trình phải tuân thủ nghiêm ngặt lịch bảo dưỡng định kỳ ({currentTask.chuKy} ngày/lần). Mọi kết quả kiểm định đạt tiêu chuẩn sẽ được dán Tem kiểm định TEDI-2026 trước khi đưa ra công trường.
                </p>
              </div>
            </div>
          )}
        </OdooFormSheet>
      ) : (
        /* MASTER LIST VIEW FOR MAINTENANCE TASKS (MH7) */
        <>
          <OdooControlPanel
            breadcrumb={['KỸ THUẬT & THIẾT BỊ', 'Kế hoạch bảo dưỡng & kiểm định định kỳ (MH7)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredTasks.length}
            onCreateNew={handleCreateTask}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất danh sách kế hoạch bảo dưỡng Odoo Excel.")}
          />

          {activeView === 'list' ? (
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
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã nhiệm vụ</th>
                      <th className="p-2.5 border-r border-slate-100">Tên thiết bị / Phương tiện</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Loại công việc</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Hình thức</th>
                      <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Chu kỳ (ngày)</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Lần gần nhất</th>
                      <th className="p-2.5 border-r border-slate-100 text-right whitespace-nowrap">Chi phí dự kiến</th>
                      <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Đội thực hiện</th>
                      <th className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">Giai đoạn</th>
                      <th className="p-2.5 text-center whitespace-nowrap">In BM-07</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTasks.map((t, idx) => {
                      const isEven = idx % 2 === 0;

                      let stText = t.giaiDoan;
                      let stBg = 'bg-emerald-700 text-white';

                      if (stText === 'Mới') stBg = 'bg-slate-500 text-white';
                      else if (stText === 'Đang thực hiện') stBg = 'bg-sky-600 text-white';
                      else if (stText === 'Hoàn thành' || stText === 'Đạt') stBg = 'bg-emerald-700 text-white';
                      else if (stText === 'Không đạt') stBg = 'bg-rose-600 text-white';

                      return (
                        <tr
                          key={t.id}
                          onClick={() => setActiveTaskId(t.id)}
                          className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                            isEven ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                        >
                          <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-50">
                              <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                            </div>
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-emerald-900 whitespace-nowrap font-mono">
                            {t.id}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-bold text-slate-800">
                            {t.ts}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-800 whitespace-nowrap">
                            {t.loai}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                            {t.hinhThuc}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {t.chuKy}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 font-mono text-slate-700 whitespace-nowrap">
                            {formatDMY(t.lanGanNhat)}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                            {formatVND(t.chiPhi)}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-slate-700 font-medium whitespace-nowrap">
                            {t.doi}
                          </td>

                          <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                            <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                              {stText}
                            </span>
                          </td>

                          <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setPrintData(t)}
                              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              <span>In BM-07</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* KANBAN VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => setActiveTaskId(t.id)}
                  className="bg-white border border-slate-200 rounded-md p-3.5 hover:shadow-md transition-shadow cursor-pointer space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-800 font-bold block">{t.id}</span>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{t.ts}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.giaiDoan === 'Đạt' || t.giaiDoan === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {t.giaiDoan}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-sans text-slate-600">
                    <div>• <strong>Loại:</strong> {t.loai} ({t.hinhThuc})</div>
                    <div>• <strong>Chu kỳ:</strong> <span className="font-mono font-bold text-slate-900">{t.chuKy} ngày</span></div>
                    <div>• <strong>Dự toán:</strong> <strong className="font-mono text-emerald-800">{formatVND(t.chiPhi)}</strong></div>
                    <div>• <strong>Đội thực hiện:</strong> {t.doi}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 text-[10px]">Lần cuối: {formatDMY(t.lanGanNhat)}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrintData(t);
                      }}
                      className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>BM-07</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Print Modal */}
      {printData && (
        <PrintA4Modal
          type="maintenance"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
