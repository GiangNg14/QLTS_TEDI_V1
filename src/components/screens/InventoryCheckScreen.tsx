import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetAuditSession, AssetAuditLine } from '../../types';
import { formatDMY, DEPARTMENTS } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { OdooFormSheet } from '../OdooFormSheet';
import { PrintA4Modal } from '../PrintA4Modal';
import { Printer, CheckCircle2, AlertTriangle, Save, Send, Plus, XCircle } from 'lucide-react';

interface InventoryCheckScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const InventoryCheckScreen: React.FC<InventoryCheckScreenProps> = ({ onNavigate }) => {
  const { auditSessions, assetMasters, addAuditSession, updateAuditSession, addLog } = useApp();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [printData, setPrintData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('chitiet');

  const filteredSessions = auditSessions.filter(s =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tenDot.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phamViPB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.hoiDong.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSessionIndex = auditSessions.findIndex(s => s.id === activeSessionId);
  const currentSession = auditSessions[currentSessionIndex] || null;

  const handleCreateNewSession = () => {
    const newId = `TEDI-KK/2026/${String(auditSessions.length + 1).padStart(4, '0')}`;
    
    // Auto-generate lines from active asset masters
    const initialLines: AssetAuditLine[] = assetMasters.map(a => ({
      id: a.id,
      ten: a.ten,
      pb: a.pbsd || 'QLVP',
      st: a.trangThai || 'Đang sử dụng',
      so: 1,
      tt: 1,
      tinh: 'Tốt',
      xl: 'Giữ nguyên'
    }));

    const newSession: AssetAuditSession = {
      id: newId,
      tenDot: `Đợt kiểm kê tài sản & CCDC đột xuất ${new Date().getFullYear()}`,
      loaiDot: 'Đột xuất',
      ngayChot: new Date().toISOString().split('T')[0],
      phamViPB: 'Tất cả các đơn vị TEDI',
      hoiDong: 'Ông Trưởng ban Kiểm kê (Chủ tịch HĐ), Đại diện Phòng TCKT, Đại diện Đơn vị SD',
      kiemToanDocLap: 'Công ty Kiểm toán Độc lập (Chứng kiến)',
      soQuyetDinh: `QĐ-KK/2026/${String(auditSessions.length + 1).padStart(3, '0')}`,
      ngayQuyetDinh: new Date().toISOString().split('T')[0],
      trangThai: 'Nháp',
      lines: initialLines
    };

    addAuditSession(newSession);
    setActiveSessionId(newId);
    setActiveTab('chitiet');
    addLog(`Khởi tạo đợt/phiếu kiểm kê mới ${newId}`);
  };

  const handleUpdateLine = (lineId: string, field: keyof AssetAuditLine, val: any) => {
    if (!currentSession) return;
    const updatedLines = currentSession.lines.map(l => {
      if (l.id !== lineId) return l;
      return { ...l, [field]: val };
    });
    updateAuditSession({ ...currentSession, lines: updatedLines });
  };

  const handleAddLineToSession = () => {
    if (!currentSession) return;
    const sampleAsset = assetMasters[0];
    const newLineId = `TS-NEW-${Date.now().toString().slice(-4)}`;
    const newLine: AssetAuditLine = {
      id: sampleAsset ? sampleAsset.id : newLineId,
      ten: sampleAsset ? sampleAsset.ten : 'Tài sản mới phát hiện',
      pb: sampleAsset ? sampleAsset.pbsd : 'QLVP',
      st: 'Đang chạy',
      so: 1,
      tt: 1,
      tinh: 'Tốt',
      xl: 'Giữ nguyên'
    };
    updateAuditSession({
      ...currentSession,
      lines: [...currentSession.lines, newLine]
    });
  };

  const handleStageChange = (newStage: AssetAuditSession['trangThai']) => {
    if (!currentSession) return;
    const updated = { ...currentSession, trangThai: newStage };
    updateAuditSession(updated);
    alert(`Đã chuyển phiếu kiểm kê ${currentSession.id} sang trạng thái: ${newStage}`);
  };

  const handlePrintAudit = () => {
    if (!currentSession) return;
    setPrintData({
      id: currentSession.id,
      tenDot: currentSession.tenDot,
      loaiDot: currentSession.loaiDot,
      ngayChot: currentSession.ngayChot,
      phamViPB: currentSession.phamViPB,
      hoiDong: currentSession.hoiDong,
      kiemToanDocLap: currentSession.kiemToanDocLap,
      soQuyetDinh: currentSession.soQuyetDinh,
      ngayQuyetDinh: currentSession.ngayQuyetDinh,
      lines: currentSession.lines
    });
  };

  // Variance statistics for current session
  const varianceLines = currentSession ? currentSession.lines.filter(l => l.tt !== l.so) : [];
  const varianceCount = varianceLines.length;

  return (
    <div className="space-y-3 relative font-sans">
      {currentSession ? (
        /* DETAIL FORM SHEET FOR AUDIT SESSION (QT-10) */
        <OdooFormSheet
          category="TÀI SẢN & MUA SẮM / KIỂM KÊ TÀI SẢN (QT-10)"
          title={`${currentSession.id} — ${currentSession.tenDot}`}
          subtitle={`Phạm vi: ${currentSession.phamViPB} | Chốt số liệu sổ sách: ${formatDMY(currentSession.ngayChot)}`}
          stages={[
            { id: 'Nháp', label: 'Nháp' },
            { id: 'Đang kiểm kê', label: 'Đang kiểm kê' },
            { id: 'Chờ xử lý chênh lệch', label: 'Chờ xử lý chênh lệch' },
            { id: 'Đã hoàn thành', label: 'Đã hoàn thành' },
            { id: 'Hủy', label: 'Hủy đợt' }
          ]}
          currentStageId={currentSession.trangThai || 'Nháp'}
          onStageSelect={(stgId) => handleStageChange(stgId as any)}
          onNew={handleCreateNewSession}
          onBack={() => setActiveSessionId(null)}
          currentIndex={currentSessionIndex + 1}
          totalItems={auditSessions.length}
          onPrev={() => currentSessionIndex > 0 && setActiveSessionId(auditSessions[currentSessionIndex - 1].id)}
          onNext={() => currentSessionIndex < auditSessions.length - 1 && setActiveSessionId(auditSessions[currentSessionIndex + 1].id)}
          actionButtons={
            <div className="flex items-center gap-2">
              {currentSession.trangThai === 'Nháp' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đang kiểm kê')}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Bắt đầu kiểm kê thực tế</span>
                </button>
              )}

              {currentSession.trangThai === 'Đang kiểm kê' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Chờ xử lý chênh lệch')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Chốt đợt &amp; Tính chênh lệch</span>
                </button>
              )}

              {currentSession.trangThai === 'Chờ xử lý chênh lệch' && (
                <button
                  type="button"
                  onClick={() => handleStageChange('Đã hoàn thành')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Phê duyệt kết luận &amp; Gửi FAST (IF-07)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrintAudit}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên bản (BM-11 / BM QT10)</span>
              </button>
            </div>
          }
          leftFields={[
            {
              label: 'Mã phiếu / đợt kiểm kê',
              value: <span className="font-mono text-blue-900 font-bold">{currentSession.id}</span>
            },
            {
              label: 'Tên đợt kiểm kê',
              value: (
                <input
                  type="text"
                  value={currentSession.tenDot}
                  onChange={e => updateAuditSession({ ...currentSession, tenDot: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 bg-white"
                />
              )
            },
            {
              label: 'Loại đợt kiểm kê',
              value: (
                <select
                  value={currentSession.loaiDot}
                  onChange={e => updateAuditSession({ ...currentSession, loaiDot: e.target.value as any })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="Định kỳ (01/01)">Định kỳ (01/01 hằng năm)</option>
                  <option value="Đột xuất">Đột xuất theo yêu cầu quản lý</option>
                </select>
              )
            },
            {
              label: 'Thời điểm chốt số liệu (FAST)',
              value: (
                <input
                  type="date"
                  value={currentSession.ngayChot}
                  onChange={e => updateAuditSession({ ...currentSession, ngayChot: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 font-mono text-xs bg-white"
                />
              )
            },
            {
              label: 'Số & Ngày QĐ thành lập HĐ',
              value: (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentSession.soQuyetDinh || ''}
                    placeholder="Số QĐ..."
                    onChange={e => updateAuditSession({ ...currentSession, soQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-2/3 bg-white"
                  />
                  <input
                    type="date"
                    value={currentSession.ngayQuyetDinh || currentSession.ngayChot}
                    onChange={e => updateAuditSession({ ...currentSession, ngayQuyetDinh: e.target.value })}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-1/3 bg-white"
                  />
                </div>
              )
            }
          ]}
          rightFields={[
            {
              label: 'Phạm vi đơn vị kiểm kê',
              value: (
                <select
                  value={currentSession.phamViPB}
                  onChange={e => updateAuditSession({ ...currentSession, phamViPB: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-blue-900 bg-white text-xs"
                >
                  <option value="Tất cả các đơn vị TEDI">Tất cả các đơn vị TEDI</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>Phòng {d}</option>)}
                </select>
              )
            },
            {
              label: 'Thành phần Hội đồng kiểm kê',
              value: (
                <input
                  type="text"
                  value={currentSession.hoiDong}
                  onChange={e => updateAuditSession({ ...currentSession, hoiDong: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800"
                />
              )
            },
            {
              label: 'Đơn vị kiểm toán chứng kiến',
              value: (
                <input
                  type="text"
                  value={currentSession.kiemToanDocLap || ''}
                  onChange={e => updateAuditSession({ ...currentSession, kiemToanDocLap: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800"
                />
              )
            },
            {
              label: 'Thống kê kiểm kê hiện tại',
              value: (
                <div className="flex items-center gap-3 text-xs">
                  <span>• Tổng số: <strong className="font-mono text-blue-900">{currentSession.lines.length} dòng</strong></span>
                  <span>• Lệch: <strong className={`font-mono ${varianceCount > 0 ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>{varianceCount} dòng</strong></span>
                </div>
              )
            }
          ]}
          tabs={[
            { id: 'chitiet', label: 'Bảng đối chiếu số liệu kiểm kê (Chi tiết)' },
            { id: 'hoidong', label: 'Hội đồng kiểm kê & Căn cứ (QT-10)' },
            { id: 'tonghop', label: 'Tổng hợp xử lý chênh lệch & FAST (IF-07)' },
            { id: 'dinhkem', label: 'Hồ sơ đính kèm & Chữ ký' }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          attachments={[
            { name: `Quyet_Dinh_Thanh_Lap_Hoi_Dong_${currentSession.id.replace(/\//g, '_')}.pdf`, type: 'PDF', verified: true },
            { name: `Bang_Doi_Chieu_Kiem_Ke_${currentSession.id.replace(/\//g, '_')}.xlsx`, type: 'DOCX', verified: true }
          ]}
        >
          {/* TAB 1: AUDIT LINES TABLE */}
          {activeTab === 'chitiet' && (
            <div className="space-y-4 text-xs pt-2">
              {/* Variance Warning Banner inside tab if any */}
              {varianceCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Phát hiện {varianceCount} dòng tài sản có chênh lệch giữa thực tế và sổ sách.</strong> Vui lòng chọn tình trạng hiện vật và đề xuất phương án xử lý trước khi chốt đợt kiểm kê.
                  </div>
                </div>
              )}

              <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-100 p-2.5 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
                  <span>BẢNG ĐỐI CHIẾU SỐ LIỆU SỔ SÁCH VỚI KIỂM KÊ THỰC TẾ</span>
                  {currentSession.trangThai !== 'Đã hoàn thành' && (
                    <button
                      onClick={handleAddLineToSession}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded text-[11px] font-semibold shadow-2xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-700" />
                      <span>Thêm dòng tài sản kiểm kê</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                        <th className="p-2.5 border-r border-slate-100">Mã TS / CCDC</th>
                        <th className="p-2.5 border-r border-slate-100">Tên tài sản</th>
                        <th className="p-2.5 border-r border-slate-100">Phòng sử dụng</th>
                        <th className="p-2.5 border-r border-slate-100">Trạng thái sổ</th>
                        <th className="p-2.5 border-r border-slate-100 text-right">SL Sổ sách</th>
                        <th className="p-2.5 border-r border-slate-100 text-right min-w-[90px]">SL Thực tế</th>
                        <th className="p-2.5 border-r border-slate-100 text-right">Chênh lệch</th>
                        <th className="p-2.5 border-r border-slate-100">Tình trạng hiện vật</th>
                        <th className="p-2.5">Đề xuất phương án xử lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentSession.lines.map((l, idx) => {
                        const diff = l.tt - l.so;
                        const isDiff = diff !== 0;
                        const isEditable = currentSession.trangThai !== 'Đã hoàn thành';

                        return (
                          <tr key={l.id + idx} className={isDiff ? 'bg-amber-50/50 hover:bg-amber-100/40' : 'hover:bg-slate-50/80'}>
                            <td className="p-2.5 font-mono font-bold text-blue-900 border-r border-slate-100 whitespace-nowrap">
                              {l.id}
                            </td>
                            <td className="p-2.5 font-bold text-slate-800 border-r border-slate-100">
                              {l.ten}
                            </td>
                            <td className="p-2.5 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                              {l.pb}
                            </td>
                            <td className="p-2.5 text-slate-600 border-r border-slate-100 whitespace-nowrap">
                              {l.st}
                            </td>
                            <td className="p-2.5 text-right font-mono font-semibold border-r border-slate-100">
                              {l.so}
                            </td>
                            <td className="p-2.5 text-right font-mono border-r border-slate-100">
                              {isEditable ? (
                                <input
                                  type="number"
                                  min={0}
                                  value={l.tt}
                                  onChange={e => handleUpdateLine(l.id, 'tt', parseInt(e.target.value) || 0)}
                                  className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono font-bold bg-white"
                                />
                              ) : (
                                <span className="font-bold">{l.tt}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold border-r border-slate-100">
                              <span className={diff === 0 ? 'text-slate-400' : diff > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            </td>
                            <td className="p-2.5 border-r border-slate-100">
                              {isEditable ? (
                                <select
                                  value={l.tinh}
                                  onChange={e => handleUpdateLine(l.id, 'tinh', e.target.value as any)}
                                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 bg-white text-xs"
                                >
                                  <option value="Tốt">Tốt</option>
                                  <option value="Cần sửa chữa">Cần sửa chữa</option>
                                  <option value="Hư hỏng">Hư hỏng</option>
                                  <option value="Mất">Mất</option>
                                </select>
                              ) : (
                                <span className="font-semibold text-slate-800">{l.tinh}</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {isEditable ? (
                                <select
                                  value={l.xl}
                                  onChange={e => handleUpdateLine(l.id, 'xl', e.target.value as any)}
                                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 font-semibold text-slate-800 bg-white text-xs"
                                >
                                  <option value="Giữ nguyên">Giữ nguyên</option>
                                  <option value="Ghi tăng">Ghi tăng (Thừa thực tế)</option>
                                  <option value="Ghi giảm">Ghi giảm (Thiếu / Mất)</option>
                                  <option value="Chuyển thanh lý">Chuyển thanh lý (Hư hỏng)</option>
                                  <option value="Chuyển sửa chữa">Chuyển sửa chữa</option>
                                </select>
                              ) : (
                                <span className="font-bold text-slate-800">{l.xl}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateAuditSession(currentSession);
                    alert(`Đã lưu dữ liệu kiểm kê cho đợt ${currentSession.id}.`);
                  }}
                  className="bg-[#2B77C0] hover:bg-[#2063A3] text-white font-bold px-5 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu phiếu kiểm kê</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COUNCIL & DECISION */}
          {activeTab === 'hoidong' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Thành phần Hội đồng kiểm kê tài sản (Theo YC-10.1 SRS TEDI)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
                    <strong className="text-slate-900 block border-b border-slate-100 pb-1">Khối Hội đồng kiểm kê TEDI:</strong>
                    <div>• <strong>Chủ tịch Hội đồng:</strong> {currentSession.hoiDong.split(',')[0] || 'Lãnh đạo đơn vị quản lý TSCĐ'}</div>
                    <div>• <strong>Ủy viên / Thư ký:</strong> {currentSession.hoiDong.split(',')[1] || 'Đại diện Phòng TCKT & Đơn vị SD'}</div>
                    <div>• <strong>Quyết định thành lập:</strong> <span className="font-mono text-blue-900 font-bold">{currentSession.soQuyetDinh}</span> ({formatDMY(currentSession.ngayQuyetDinh || currentSession.ngayChot)})</div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
                    <strong className="text-slate-900 block border-b border-slate-100 pb-1">Đơn vị kiểm toán chứng kiến (YC-10.5):</strong>
                    <div>• <strong>Tên tổ chức:</strong> {currentSession.kiemToanDocLap || 'Chưa phân công'}</div>
                    <div>• <strong>Vai trò:</strong> Chứng kiến kiểm đếm thực tế &amp; xác nhận độc lập biên bản kiểm kê</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANCE SUMMARY & FAST INTEGRATION */}
          {activeTab === 'tonghop' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Tổng hợp xử lý chênh lệch &amp; Giao diện kế toán FAST (IF-07)
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <span className="text-emerald-800 text-[10px] block font-bold mb-1">Ghi tăng (Thừa)</span>
                    <span className="font-mono text-lg font-bold text-emerald-900">
                      {currentSession.lines.filter(l => l.xl === 'Ghi tăng').length}
                    </span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded">
                    <span className="text-rose-800 text-[10px] block font-bold mb-1">Ghi giảm (Thiếu)</span>
                    <span className="font-mono text-lg font-bold text-rose-900">
                      {currentSession.lines.filter(l => l.xl === 'Ghi giảm').length}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <span className="text-amber-800 text-[10px] block font-bold mb-1">Chuyển thanh lý</span>
                    <span className="font-mono text-lg font-bold text-amber-900">
                      {currentSession.lines.filter(l => l.xl === 'Chuyển thanh lý').length}
                    </span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-blue-800 text-[10px] block font-bold mb-1">Chuyển sửa chữa</span>
                    <span className="font-mono text-lg font-bold text-blue-900">
                      {currentSession.lines.filter(l => l.xl === 'Chuyển sửa chữa').length}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="font-bold text-slate-900">Trạng thái đồng bộ giao diện FAST (IF-07):</div>
                  <div>• Mã giao diện: <strong>IF-07 (Chênh lệch kiểm kê)</strong></div>
                  <div>• Trạng thái: {currentSession.trangThai === 'Đã hoàn thành' ? <span className="text-emerald-700 font-bold">✓ Đã truyền kết quả sang FAST</span> : <span className="text-amber-700 font-bold">Chờ phê duyệt hoàn tất đợt</span>}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTACHMENTS & SIGNATURES */}
          {activeTab === 'dinhkem' && (
            <div className="space-y-4 text-xs pt-2">
              <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C6AA9] border-b border-slate-200 pb-2">
                  Khối ký nhận biên bản kiểm kê TEDI (BM-11 / BM QT10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-semibold text-slate-800">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Đại diện Đơn vị SD</span>
                    <span className="text-blue-900 font-bold">Đại diện đơn vị</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Tổ kiểm kê</span>
                    <span className="text-blue-900 font-bold">Cán bộ kiểm đếm</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Kiểm toán độc lập</span>
                    <span className="text-slate-700 font-bold">{currentSession.kiemToanDocLap || 'AASC'}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[11px] mb-1">Chủ tịch HĐ kiểm kê</span>
                    <span className="text-emerald-800 font-bold">Chủ tịch Hội đồng</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </OdooFormSheet>
      ) : (
        /* MASTER LIST VIEW FOR AUDIT SESSIONS (QT-10) */
        <>
          <OdooControlPanel
            breadcrumb={['TÀI SẢN & MUA SẮM', 'Kiểm kê tài sản (QT-10)']}
            activeView={activeView}
            onViewChange={setActiveView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredSessions.length}
            onCreateNew={handleCreateNewSession}
            createLabel="Mới"
            onExportExcel={() => alert("Đã xuất danh sách phiếu/đợt kiểm kê tài sản Odoo Excel.")}
          />

          <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-tight">
                    <th className="p-2.5 w-8 text-center border-r border-slate-100">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 mx-auto flex items-center justify-center cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                      </div>
                    </th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Mã đợt / phiếu</th>
                    <th className="p-2.5 border-r border-slate-100">Tên đợt kiểm kê</th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Loại đợt</th>
                    <th className="p-2.5 border-r border-slate-100 whitespace-nowrap">Ngày chốt số</th>
                    <th className="p-2.5 border-r border-slate-100">Phạm vi kiểm kê</th>
                    <th className="p-2.5 border-r border-slate-100 text-center">Thống kê dòng</th>
                    <th className="p-2.5 border-r border-slate-100 text-center">Trạng thái</th>
                    <th className="p-2.5 text-center">Biên bản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSessions.map((s, idx) => {
                    const isEven = idx % 2 === 0;
                    const sessionDiffs = s.lines.filter(l => l.tt !== l.so).length;

                    let stText = s.trangThai || 'Đã hoàn thành';
                    let stBg = 'bg-emerald-600 text-white';

                    if (stText === 'Nháp') {
                      stBg = 'bg-slate-500 text-white';
                    } else if (stText === 'Đang kiểm kê') {
                      stBg = 'bg-blue-600 text-white';
                    } else if (stText === 'Chờ xử lý chênh lệch') {
                      stBg = 'bg-amber-600 text-white';
                    } else if (stText === 'Hủy') {
                      stBg = 'bg-red-600 text-white';
                    }

                    return (
                      <tr
                        key={s.id}
                        onClick={() => setActiveSessionId(s.id)}
                        className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="p-2.5 text-center border-r border-slate-100" onClick={e => e.stopPropagation()}>
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 mx-auto flex items-center justify-center cursor-pointer hover:bg-blue-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-blue-900 whitespace-nowrap">
                          {s.id}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 font-bold text-slate-800">
                          {s.tenDot}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-700 whitespace-nowrap font-medium">
                          {s.loaiDot}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-600 font-mono whitespace-nowrap">
                          {formatDMY(s.ngayChot)}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-slate-700 font-medium">
                          {s.phamViPB}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap font-mono text-[11px]">
                          <span className="text-slate-800 font-semibold">{s.lines.length} dòng</span>
                          {sessionDiffs > 0 && (
                            <span className="ml-1.5 text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              ({sessionDiffs} lệch)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                          <span className={`inline-block ${stBg} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs`}>
                            {stText}
                          </span>
                        </td>

                        <td className="p-2.5 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setPrintData({
                                id: s.id,
                                tenDot: s.tenDot,
                                loaiDot: s.loaiDot,
                                ngayChot: s.ngayChot,
                                phamViPB: s.phamViPB,
                                hoiDong: s.hoiDong,
                                kiemToanDocLap: s.kiemToanDocLap,
                                soQuyetDinh: s.soQuyetDinh,
                                ngayQuyetDinh: s.ngayQuyetDinh,
                                lines: s.lines
                              });
                            }}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold shadow-2xs inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-slate-500" />
                            <span>In BM-11</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Print Modal */}
      {printData && (
        <PrintA4Modal
          type="audit"
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
};
