import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND, formatDMY } from '../../data/mockData';
import { OdooControlPanel } from '../OdooControlPanel';
import { FileText, CheckCircle, Clock, BookOpen, FileCheck } from 'lucide-react';

interface ContractScreenProps {
  onNavigate: (screen: string, id?: string) => void;
}

export const ContractScreen: React.FC<ContractScreenProps> = ({ onNavigate }) => {
  const { contracts, deliverables } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState<'danhsach' | 'soqlhd'>('danhsach');

  const filteredContracts = contracts.filter(h =>
    h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.ncu.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.loai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Odoo Standard Control Panel */}
      <OdooControlPanel
        breadcrumb={['MUA SẮM', 'Quản lý Hợp đồng & Sổ QLHĐ (MH17)']}
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredContracts.length}
        onCreateNew={() => alert("Tạo mới hợp đồng mua sắm / dịch vụ.")}
        createLabel="Tạo Hợp đồng (CT-06)"
        onExportExcel={() => alert("Đã xuất Sổ Quản lý Hợp đồng BM QT09-2 Excel.")}
      />

      {/* Mode Switch Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('danhsach')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
            activeTab === 'danhsach' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Danh sách Hợp đồng mua sắm (QT-MS-04)</span>
        </button>
        <button
          onClick={() => setActiveTab('soqlhd')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
            activeTab === 'soqlhd' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sổ Quản lý Hợp đồng (BM QT09-2 / CT-20)</span>
        </button>
      </div>

      {activeTab === 'danhsach' ? (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                  <th className="p-2.5 w-8 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                  </th>
                  <th className="p-2.5">Số HĐ (CT-06)</th>
                  <th className="p-2.5">Loại hợp đồng</th>
                  <th className="p-2.5">Nhà cung ứng / Chuyên gia</th>
                  <th className="p-2.5 text-right">Giá trị hợp đồng</th>
                  <th className="p-2.5">Ngày ký</th>
                  <th className="p-2.5">Hết hạn</th>
                  <th className="p-2.5 text-right">Thời hạn</th>
                  <th className="p-2.5">Hồ sơ lưu trữ (QT09)</th>
                  <th className="p-2.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContracts.map((h) => {
                  const diffDays = Math.round((new Date(h.hetHan).getTime() - new Date('2026-08-12').getTime()) / 86400000);

                  return (
                    <tr key={h.id} className="hover:bg-blue-50/30 cursor-pointer transition-colors">
                      <td className="p-2.5 text-center" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                      </td>
                      <td className="p-2.5 font-mono font-bold text-blue-900">{h.id}</td>
                      <td className="p-2.5 font-medium text-slate-800">{h.loai}</td>
                      <td className="p-2.5 text-slate-800 font-semibold">{h.ncu}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatVND(h.giaTri)}</td>
                      <td className="p-2.5 font-mono text-slate-600">{formatDMY(h.ngayKy)}</td>
                      <td className="p-2.5 font-mono text-slate-600">{formatDMY(h.hetHan)}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">
                        <span className={diffDays < 0 ? 'text-rose-600' : diffDays <= 30 ? 'text-amber-600' : 'text-slate-700'}>
                          {diffDays < 0 ? `Quá ${-diffDays} ngày` : `${diffDays} ngày`}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                          <FileCheck className="w-3 h-3" /> 1 Bộ giấy + Đĩa CD/USB
                        </span>
                      </td>
                      <td className="p-2.5 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold bg-blue-50 text-blue-800 border-blue-200">
                          {h.trangThai}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Sổ Quản lý Hợp đồng BM QT09-2 (CT-20) View */
        <div className="space-y-6">
          <div className="bg-blue-900 text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-sm block">SỔ QUẢN LÝ HỢP ĐỒNG & THANH TOÁN (MẪU BM QT09-2 / CT-20)</span>
              <span className="text-blue-200">Theo Quy trình Quản lý Hợp đồng QT09 — Tổng công ty TEDI</span>
            </div>
            <span className="bg-blue-800 text-blue-100 font-mono text-[11px] px-2.5 py-1 rounded border border-blue-700">
              Cập nhật: 12/08/2026
            </span>
          </div>

          {/* Bảng 1 & 2: Hợp đồng Khách hàng */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase text-blue-900 border-b border-slate-200 pb-2">
              SECTION A: HỢP ĐỒNG & BIÊN BẢN NGHIỆM THU THANH TOÁN VỚI KHÁCH HÀNG (CHỦ ĐẦU TƯ)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr className="border-b border-slate-200">
                    <th className="p-2 border-r border-slate-200">STT</th>
                    <th className="p-2 border-r border-slate-200">Mã / Số HĐ KH</th>
                    <th className="p-2 border-r border-slate-200">Tên dự án / Khách hàng</th>
                    <th className="p-2 border-r border-slate-200 text-right">Giá trị HĐ KH (VND)</th>
                    <th className="p-2 border-r border-slate-200">Ngày ký HĐ</th>
                    <th className="p-2 border-r border-slate-200 text-right">Đã NT Thanh toán</th>
                    <th className="p-2 text-center">Trạng thái HĐ KH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-center font-mono">1</td>
                    <td className="p-2 font-mono font-bold text-blue-900">HĐ-KH/2026/088</td>
                    <td className="p-2 font-semibold text-slate-800">Dự án Khảo sát & Thiết kế tuyến ĐT.741 — Ban QLDA ĐTXD tỉnh Bình Dương</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">2.450.000.000</td>
                    <td className="p-2 font-mono text-slate-600">15/03/2026</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-700">1.200.000.000</td>
                    <td className="p-2 text-center">
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Đang thực hiện</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 3 & 4: Hợp đồng NCƯ / NTP */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase text-blue-900 border-b border-slate-200 pb-2">
              SECTION B: HỢP ĐỒNG & BIÊN BẢN NGHIỆM THU THANH TOÁN VỚI NHÀ CUNG ỨNG / NHÀ THẦU PHỤ / CHUYÊN GIA
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr className="border-b border-slate-200">
                    <th className="p-2 border-r border-slate-200">STT</th>
                    <th className="p-2 border-r border-slate-200">Số HĐ NCƯ (CT-06)</th>
                    <th className="p-2 border-r border-slate-200">Gắn với HĐ KH</th>
                    <th className="p-2 border-r border-slate-200">Tên Nhà cung ứng / Chuyên gia</th>
                    <th className="p-2 border-r border-slate-200 text-right">Giá trị HĐ (VND)</th>
                    <th className="p-2 border-r border-slate-200">Thời hạn HĐ</th>
                    <th className="p-2 border-r border-slate-200 text-right">Đã NT nghiệm thu</th>
                    <th className="p-2 text-center">Biên bản NT (CT-07)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contracts.map((h, i) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-mono">{i + 1}</td>
                      <td className="p-2 font-mono font-bold text-blue-900">{h.id}</td>
                      <td className="p-2 font-mono text-slate-600">HĐ-KH/2026/088</td>
                      <td className="p-2 font-semibold text-slate-800">{h.ncu}</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">{formatVND(h.giaTri)}</td>
                      <td className="p-2 font-mono text-slate-600">{formatDMY(h.hetHan)}</td>
                      <td className="p-2 text-right font-mono font-bold text-blue-800">{formatVND(h.giaTri * 0.8)}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => onNavigate('mh3')}
                          className="text-blue-800 font-bold hover:underline"
                        >
                          Xem BB NT (CT-07) →
                        </button>
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
