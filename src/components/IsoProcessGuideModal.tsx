import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  Printer,
  ChevronRight,
  Scale,
  FileCheck,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { formatVND } from '../data/mockData';

interface IsoProcessGuideModalProps {
  onClose: () => void;
  onOpenPrintModal?: (type: string, data?: any) => void;
}

export const IsoProcessGuideModal: React.FC<IsoProcessGuideModalProps> = ({
  onClose,
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'categories' | 'workflow' | 'forms'>('overview');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 font-mono text-xs px-2 py-0.5 rounded border border-blue-400/30 font-bold">
                  TEDI-ISO-QT 02
                </span>
                <span className="text-xs text-slate-400">Ban hành: 01/06/2017 · 15 Trang</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Quy trình Mua sắm và Quản lý Tài sản Cố định (Nhóm Công ty TEDI)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-6 border-b border-slate-200 flex gap-2 overflow-x-auto shrink-0 text-xs font-semibold py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎯 Mục đích & Phạm vi
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏛️ Phân cấp trách nhiệm (6 cấp)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏷️ 5 Nhóm tài sản kiểm soát
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔄 Trình tự 6 bước (4.2.1 → 4.2.6)
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'forms'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            📋 Hệ thống 6 Biểu mẫu ISO
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  Mục đích và Phạm vi Áp dụng (TEDI-ISO-QT 02)
                </h3>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Thống nhất trình tự mua sắm, kiểm soát sử dụng, quản lý và thanh lý TSCĐ trong toàn bộ Nhóm công ty TEDI.
                  Quy trình này cũng được áp dụng tham khảo cho công cụ dụng cụ và vật tư tiêu hao trong toàn hệ thống.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-blue-900">
                    Mã hiệu văn bản
                  </div>
                  <div className="font-mono text-base font-bold text-slate-800">TEDI-ISO-QT 02</div>
                  <div className="text-xs text-slate-500 mt-1">Ngày ban hành hiệu lực: 01/06/2017</div>
                  <div className="text-xs text-slate-500">Độ dài tài liệu: 15 Trang quy chuẩn ISO 9001</div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-blue-900">
                    Phạm vi tích hợp phần mềm
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <div>✓ Mua sắm TSCĐ (Kế hoạch năm &amp; Ngoài kế hoạch)</div>
                    <div>✓ Bàn giao &amp; Đăng ký danh mục quản lý</div>
                    <div>✓ Kiểm soát vận hành, kiểm định, hiệu chuẩn, bảo dưỡng</div>
                    <div>✓ Kiểm kê định kỳ (0h ngày 01/01) &amp; Điều chuyển, Thanh lý</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Sơ đồ tổng quan chu trình vòng đời tài sản ISO QT02
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg">
                    <div className="font-bold text-blue-900">1. Kế hoạch &amp; Mua sắm</div>
                    <div className="text-[11px] text-slate-500 mt-1">BM QT02-1, Đấu thầu, HĐ</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                    <div className="font-bold text-emerald-900">2. Bàn giao &amp; Nghiệm thu</div>
                    <div className="text-[11px] text-slate-500 mt-1">BM QT02-2 (11 Cột)</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-lg">
                    <div className="font-bold text-purple-900">3. Đăng ký Danh mục</div>
                    <div className="text-[11px] text-slate-500 mt-1">BM QT02-3 &amp; QT02-4</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                    <div className="font-bold text-amber-900">4. Kiểm soát &amp; Bảo dưỡng</div>
                    <div className="text-[11px] text-slate-500 mt-1">Kiểm định, hiệu chỉnh</div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-200 p-2.5 rounded-lg">
                    <div className="font-bold text-cyan-900">5. Kiểm kê &amp; Điều chuyển</div>
                    <div className="text-[11px] text-slate-500 mt-1">0h 01/01, QĐ điều chuyển</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                    <div className="font-bold text-rose-900">6. Thanh lý TSCĐ</div>
                    <div className="text-[11px] text-slate-500 mt-1">BM QT02-5, Phụ lục 5</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 mb-2">
                Quy trình TEDI-ISO-QT 02 quy định rõ ma trận 6 cấp thẩm quyền và trách nhiệm xuyên suốt chu trình quản lý tài sản:
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">ĐHĐCĐ (Đại hội đồng Cổ đông)</div>
                    <div className="text-xs text-slate-600 mt-0.5">Phê duyệt kế hoạch đầu tư, mua sắm TSCĐ hằng năm của Tổng công ty.</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-800 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">HĐQT (Hội đồng Quản trị)</div>
                    <div className="text-xs text-slate-600 mt-0.5">Xem xét trình ĐHĐCĐ; quyết định mua sắm hoặc thanh lý TSCĐ theo thẩm quyền quy định trong Điều lệ TEDI.</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">TGĐ / GĐ (Tổng Giám Đốc / Giám Đốc Đơn vị)</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Chỉ đạo mua sắm theo kế hoạch đã duyệt; phê duyệt kế hoạch kiểm định/bảo dưỡng/sửa chữa; ra quyết định thành lập Hội đồng kiểm kê và Hội đồng định giá thanh lý TSCĐ.
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-xs shrink-0">4</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Đơn vị quản lý (QLVP / QLTB)</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Lập kế hoạch tổng hợp mua sắm; tổ chức mua sắm; kiểm tra giao nhận; quản lý danh mục và hồ sơ lý lịch tài sản; tổ chức công tác kiểm định/bảo dưỡng/sửa chữa.
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">5</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Phòng TCKT (Tài chính Kế toán)</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Lập kế hoạch nguồn vốn; theo dõi, quản lý giá trị và hạch toán khấu hao/hao mòn TSCĐ theo quy định hiện hành của Nhà nước và Bộ Tài chính.
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shrink-0">6</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Đơn vị sử dụng (Phòng ban / Trung tâm / Dự án)</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Đề xuất nhu cầu mua sắm; tiếp nhận và trực tiếp sử dụng, bảo quản tài sản; lập danh mục TSCĐ hằng năm (BM QT02-3, BM QT02-4); phối hợp kiểm kê và bảo dưỡng định kỳ.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 mb-2">
                Quy trình Mục 3 TEDI-ISO-QT 02 phân định 5 nhóm tài sản kiểm soát bắt buộc:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2 py-0.5 rounded">Nhóm 1</span>
                    <span className="text-xs font-mono text-slate-500">TK 2112 · KH 240T</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Hạng mục XDCB</h4>
                  <p className="text-xs text-slate-600 mb-2">Sửa chữa, nâng cấp, cải tạo văn phòng, tường rào, sân bãi.</p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-500">
                    <strong>Chế độ ISO:</strong> Theo dõi bảo hành nhà thầu, lập kế hoạch bảo trì/sửa chữa hằng năm (Mục 4.2.3.c).
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-900 font-bold text-xs px-2 py-0.5 rounded">Nhóm 2</span>
                    <span className="text-xs font-mono text-slate-500">TK 2111 · KH 84T</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Máy móc chuyên dùng</h4>
                  <p className="text-xs text-slate-600 mb-2">Khảo sát, thiết kế, thí nghiệm, đo lường, kiểm tra.</p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-500">
                    <strong>3 phân nhóm BM QT02-3:</strong>
                    <div>1. Thiết bị văn phòng · 2. Thí nghiệm hiện trường · 3. Thí nghiệm trong phòng</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2 py-0.5 rounded">Nhóm 3</span>
                    <span className="text-xs font-mono text-slate-500">TK 2113 · KH 96T</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Phương tiện vận tải &amp; Hệ thống hạ tầng</h4>
                  <p className="text-xs text-slate-600 mb-2">Ôtô, thang máy, CNTT, điện, nước, thoát nước.</p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-500">
                    <strong>Chế độ ISO:</strong> Quản lý hồ sơ lý lịch phương tiện, định mức nhiên liệu, bảo dưỡng định kỳ.
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-100 text-purple-900 font-bold text-xs px-2 py-0.5 rounded">Nhóm 4</span>
                    <span className="text-xs font-mono text-slate-500">TK 2135 · KH 36T</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Phần mềm chuyên dùng</h4>
                  <p className="text-xs text-slate-600 mb-2">Quản lý điều hành, khảo sát, thiết kế, thí nghiệm, kế toán.</p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-500">
                    <strong>Chế độ ISO (4.2.3.a):</strong> Đăng ký BM QT02-4, kiểm tra kết quả tính toán định kỳ hoặc khi nghi ngờ, ngừng khai thác nếu sai lệch.
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-xs md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-100 text-indigo-900 font-bold text-xs px-2 py-0.5 rounded">Nhóm 5</span>
                    <span className="text-xs font-mono text-slate-500">TK 2112 · KH 360T</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Công trình XDCB mới</h4>
                  <p className="text-xs text-slate-600 mb-2">Trụ sở văn phòng, phòng thí nghiệm, công trình kiến trúc xây dựng mới.</p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-500">
                    <strong>Chế độ ISO:</strong> Phê duyệt dự án đầu tư theo phân cấp ĐHĐCĐ/HĐQT, quyết toán vốn đầu tư hoàn thành.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-5">
              <div className="border-l-2 border-blue-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.1 Trình tự Mua sắm (5 Bước Tuần tự)</h4>
                <div className="text-xs text-slate-600 space-y-1 mt-2">
                  <div><strong>a. Đề xuất nhu cầu:</strong> Đơn vị sử dụng lập Phiếu yêu cầu mua TSCĐ theo <strong>BM QT02-1</strong> trình TGĐ/GĐ duyệt.</div>
                  <div><strong>b. Lựa chọn NCC theo 3 nhóm:</strong> Máy móc (đấu thầu/chào giá/báo giá); Phần mềm (đánh giá tính năng, độ đáp ứng, giá); XDCB (lập dự toán, chọn nhà thầu).</div>
                  <div><strong>c. Soạn thảo Hợp đồng:</strong> ĐV quản lý chuẩn bị hợp đồng mua bán/cung cấp dịch vụ trình TGĐ/GĐ ký.</div>
                  <div><strong>d. Kiểm tra &amp; Nghiệm thu:</strong> Kiểm tra ngoại quan, chạy thử thực tế (phần mềm phải chạy thử kết quả tính toán).</div>
                  <div><strong>e. Bàn giao TSCĐ:</strong> Ban hành Quyết định giao TSCĐ &amp; Lập Biên bản giao nhận <strong>BM QT02-2 (Bảng 11 Cột)</strong> kèm hồ sơ kỹ thuật.</div>
                </div>
              </div>

              <div className="border-l-2 border-emerald-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.2 Quản lý và Sử dụng</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Đơn vị sử dụng lập danh mục TSCĐ hằng năm theo <strong>BM QT02-3</strong> (máy móc thiết bị theo 3 nhóm) và <strong>BM QT02-4</strong> (phần mềm chuyên dùng) gửi ĐV quản lý tổng hợp báo cáo TGĐ/GĐ. Cập nhật kịp thời khi có phát sinh tăng giảm.
                </p>
              </div>

              <div className="border-l-2 border-amber-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.3 Kiểm soát Tài sản</h4>
                <div className="text-xs text-slate-600 space-y-1 mt-1">
                  <div>• <strong>Phần mềm:</strong> Kiểm tra kết quả tính toán định kỳ hoặc khi nghi ngờ, ngừng khai thác nếu sai lệch.</div>
                  <div>• <strong>Máy móc thiết bị:</strong> Lập KH kiểm định/hiệu chỉnh/bảo dưỡng hằng năm trình TGĐ duyệt; thuê ngoài có HĐ xác nhận lý lịch &amp; dán tem; tự kiểm lưu bằng chứng; hỏng đột xuất báo ngay.</div>
                  <div>• <strong>Hạng mục XDCB:</strong> Theo dõi bảo hành, lập kế hoạch sửa chữa/nâng cấp hằng năm.</div>
                </div>
              </div>

              <div className="border-l-2 border-cyan-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.4 Kiểm kê Tài sản (3 Bước)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  ĐV sử dụng tự kiểm tra → Hội đồng kiểm kê (TGĐ thành lập) kiểm đếm thực tế 0h ngày 01/01 hằng năm có kiểm toán độc lập chứng kiến → Phòng TCKT đối chiếu sổ sách xử lý thừa thiếu.
                </p>
              </div>

              <div className="border-l-2 border-indigo-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.5 Điều chuyển Tài sản</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Căn cứ quyết định phân công/điều chuyển nhân sự (nghỉ chế độ, hoãn HĐ), ĐV sử dụng báo cáo đề xuất (giữ lại hoặc chuyển về ĐV quản lý), trình TGĐ/GĐ ban hành Quyết định điều chuyển.
                </p>
              </div>

              <div className="border-l-2 border-rose-600 pl-4 py-1">
                <h4 className="font-bold text-slate-900 text-sm">4.2.6 Thanh lý Tài sản (6 Bước theo Phụ lục 5)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Đề nghị thanh lý → Hội đồng định giá đề xuất phương thức theo <strong>BM QT02-5</strong> → HĐQT/TGĐ duyệt → Thông báo/Bán đấu giá/Chào giá → Biên bản thanh lý → Phòng TCKT ghi giảm sổ.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: FORMS */}
          {activeTab === 'forms' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 mb-2">
                Hệ thống 6 biểu mẫu chuẩn hóa theo TEDI-ISO-QT 02. Nhấp vào nút "Xem &amp; In Biểu mẫu" để kiểm tra mẫu in A4 chuẩn:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BM QT02-1 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded">BM QT02-1</span>
                      <span className="text-[10px] text-slate-500">Mục 4.2.1.a</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Phiếu Yêu Cầu Mua TSCĐ</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Đơn vị đề xuất lập khi có nhu cầu mua sắm thiết bị, phần mềm hoặc cải tạo XDCB, trình Lãnh đạo thẩm định.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('bm_qt02_1');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem &amp; In BM QT02-1
                  </button>
                </div>

                {/* BM QT02-2 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">BM QT02-2</span>
                      <span className="text-[10px] text-slate-500">Mục 4.2.1.e</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Biên Bản Bàn Giao Nhận Tài Sản (Bảng 11 Cột)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Bảng 11 cột chuẩn: Giá mua, cước VC, CP chạy thử, Nguyên giá, Tỷ lệ &amp; HM đã trích, Giá trị còn lại, Ký hiệu tài liệu KT.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('bm_qt02_2');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem &amp; In BM QT02-2 (11 Cột)
                  </button>
                </div>

                {/* BM QT02-3 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded">BM QT02-3</span>
                      <span className="text-[10px] text-slate-500">Mục 4.2.2</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Danh Mục Máy Móc Thiết Bị (3 Phân Nhóm)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Lập hằng năm theo 3 nhóm: Thiết bị văn phòng, Thí nghiệm hiện trường, Thí nghiệm trong phòng kèm chế độ kiểm tra.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('bm_qt02_3');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem &amp; In BM QT02-3
                  </button>
                </div>

                {/* BM QT02-4 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded">BM QT02-4</span>
                      <span className="text-[10px] text-slate-500">Mục 4.2.2 &amp; 4.2.3.a</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Danh Mục Phần Mềm Chuyên Dùng</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Bảng danh mục theo dõi bản quyền phần mềm khảo sát, thiết kế, thí nghiệm, kế toán và kiểm tra định kỳ sai lệch.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('bm_qt02_4');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem &amp; In BM QT02-4
                  </button>
                </div>

                {/* BM QT02-5 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-rose-100 text-rose-900 px-2 py-0.5 rounded">BM QT02-5</span>
                      <span className="text-[10px] text-slate-500">Mục 4.2.6</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Bảng Tổng Hợp TSCĐ Đề Nghị Thanh Lý</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Bảng tổng hợp tình trạng kỹ thuật, nguyên giá, hao mòn lũy kế, giá trị còn lại và phương thức xử lý thanh lý.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('bm_qt02_5');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem &amp; In BM QT02-5
                  </button>
                </div>

                {/* PL5 */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Phụ lục 5</span>
                      <span className="text-[10px] text-slate-500">Sơ đồ luồng</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Sơ Đồ Trình Tự Thanh Lý TSCĐ (6 Bước)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Sơ đồ trực quan 6 bước thanh lý từ Đề xuất → Hội đồng định giá → Phê duyệt → Chào giá/Bán → Biên bản → Ghi sổ TCKT.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPrintModal) onOpenPrintModal('pl5_thanh_ly');
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Xem Sơ Đồ Phụ Lục 5
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500">
            Hệ thống Quản lý Tài sản TEDI v1.2 · Dẫn chiếu quy trình TEDI-ISO-QT 02 (01/06/2017)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
