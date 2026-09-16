import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatVND, formatDMY, formatNum } from '../data/mockData';

interface PrintA4ModalProps {
  type: string;
  data: any;
  onClose: () => void;
}

export const PrintA4Modal: React.FC<PrintA4ModalProps> = ({ type, data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Control Bar (hidden when printing) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium text-xs tracking-wide"
        >
          <Printer className="w-4 h-4" />
          In / Lưu PDF (A4)
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* A4 Sheet Container */}
      <div className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl rounded-sm text-slate-900 font-sans text-xs leading-relaxed my-8 print:my-0 print:shadow-none print:w-full print:p-0">
        
        {/* Header Quốc hiệu / Đơn vị */}
        <div className="flex justify-between items-start mb-6 border-b border-slate-300 pb-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              TỔNG CÔNG TY TƯ VẤN THIẾT KẾ GIAO THÔNG VẬN TẢI - CTCP
            </div>
            <div className="text-[11px] text-slate-700 font-medium">
              PHÒNG QUẢN LÝ VĂN PHÒNG &amp; THIẾT BỊ
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900 uppercase text-[11px]">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-[10px] text-slate-700 italic">
              Độc lập – Tự do – Hạnh phúc
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BM QT02-1: PHIẾU YÊU CẦU MUA SẮM TSCĐ */}
        {/* ======================================================== */}
        {(type === 'bm_qt02_1' || type === 'requisition') && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mã hiệu: BM QT02-1 (Ban hành 01/06/2017)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Số: {data?.id || 'DXMS/2026/0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-4 text-blue-950">
              PHIẾU YÊU CẦU MUA TÀI SẢN CỐ ĐỊNH
            </h1>

            <div className="text-center text-xs text-slate-500 mb-6 italic">
              (Căn cứ Kế hoạch đầu tư, mua sắm TSCĐ hằng năm được ĐHĐCĐ &amp; TGĐ phê duyệt)
            </div>

            <div className="space-y-2 mb-6 bg-slate-50 p-4 border border-slate-200 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Đơn vị đề xuất:</span>{' '}
                  <strong className="text-slate-800">{data?.pb || 'Phòng Quản lý Chất lượng (QLCL)'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Đơn vị thụ hưởng:</span>{' '}
                  <strong className="text-slate-800">{data?.pbsd || data?.pb || 'Tổ Đo vẽ Khảo sát'}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Ngày lập phiếu:</span>{' '}
                  <strong className="font-mono">{formatDMY(data?.ngay || '2026-08-12')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Kế hoạch năm:</span>{' '}
                  <strong className="font-mono">{data?.nam || '2026'} (Mã KH: {data?.dxPlan || 'KHMS/2026/01'})</strong>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Mục đích sử dụng:</span>{' '}
                <span>{data?.mucDich || 'Phục vụ công tác khảo sát địa hình, thiết kế dự án trọng điểm'}</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                  <th className="border border-slate-300 p-2 text-center w-10">STT</th>
                  <th className="border border-slate-300 p-2 text-left">Tên chủng loại TSCĐ / Yêu cầu kỹ thuật</th>
                  <th className="border border-slate-300 p-2 text-center w-16">ĐVT</th>
                  <th className="border border-slate-300 p-2 text-right w-16">Số lượng</th>
                  <th className="border border-slate-300 p-2 text-right w-28">Đơn giá dự toán</th>
                  <th className="border border-slate-300 p-2 text-right w-32">Thành tiền (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {data?.lines && data.lines.length > 0 ? (
                  data.lines.map((l: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-semibold">
                        {l.ten}
                        {l.mucDich && <div className="text-[10px] text-slate-500 font-normal mt-0.5">{l.mucDich}</div>}
                      </td>
                      <td className="border border-slate-300 p-2 text-center">{l.dvt || 'Cái'}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">{l.sl || 1}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{formatVND(l.gia || 0)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">{formatVND((l.sl || 1) * (l.gia || 0))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-slate-300 p-2 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-2 font-semibold">{data?.ten || 'Máy toàn đạc điện tử Leica TS07'}</td>
                    <td className="border border-slate-300 p-2 text-center">Bộ</td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-bold">1</td>
                    <td className="border border-slate-300 p-2 text-right font-mono">{formatVND(data?.nguyenGia || 180000000)}</td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-bold">{formatVND(data?.nguyenGia || 180000000)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="text-xs text-slate-600 space-y-1 mb-8">
              <div>• <strong>Ý kiến đơn vị quản lý tài sản (QLVP/QLTB):</strong> Thống nhất chủng loại, phù hợp kế hoạch năm 2026.</div>
              <div>• <strong>Ý kiến phòng TCKT:</strong> Đã cân đối nguồn vốn đầu tư mua sắm TSCĐ theo kế hoạch ĐHĐCĐ phê duyệt.</div>
            </div>

            {/* 4 Khối ký theo phân cấp trách nhiệm ISO */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[10px]">Người lập phiếu</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Thủ trưởng đơn vị SD</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Đơn vị Quản lý (QLVP)</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký xác nhận)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Tổng Giám Đốc / GĐ</div>
                <div className="text-[9px] text-slate-400 mb-10">(Phê duyệt)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BM QT02-2: BIÊN BẢN BÀN GIAO NHẬN TÀI SẢN (BẢNG 11 CỘT) */}
        {/* ======================================================== */}
        {(type === 'bm_qt02_2' || type === 'handover') && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mã hiệu: BM QT02-2 (Ban hành 01/06/2017)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Số: BBBG/{data?.id?.replace(/\//g, '.') || 'TS.2026.0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              BIÊN BẢN BÀN GIAO NHẬN TÀI SẢN CỐ ĐỊNH
            </h1>

            <div className="text-center font-mono text-xs text-slate-500 mb-4">
              Ngày {formatDMY(data?.ngayMua || '2026-08-12')} · Địa điểm: Tổng công ty TEDI
            </div>

            <p className="mb-4 text-xs">
              Căn cứ Quyết định giao TSCĐ của Tổng Giám đốc và Hợp đồng/Hóa đơn số <strong className="font-mono">{data?.bill || data?.ct || 'BILL/2026/08/0007'}</strong>, hôm nay các bên tiến hành bàn giao nhận tài sản như sau:
            </p>

            <div className="space-y-1.5 mb-5 bg-slate-50 p-3.5 border border-slate-200 rounded text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Đại diện Bên giao:</span>{' '}
                  <strong className="text-slate-800">{data?.ncu || data?.chuyenTu || data?.pbQuanLy || 'Phòng Quản lý Tài sản (QLVP)'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Đại diện Bên nhận:</span>{' '}
                  <strong className="text-slate-800">{data?.chuyenDen || data?.pbsd || 'CL-KD'} — {data?.nguoiTiepNhan || data?.nguoi || 'Trần Văn Nam'}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-slate-500 font-medium">Căn cứ / Đề xuất:</span>{' '}
                  <strong className="font-mono text-slate-700">{data?.dx || data?.hopDong || data?.lyDoDieuChuyen || 'Theo kế hoạch mua sắm & hợp đồng'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Kết quả nghiệm thu (KCS):</span>{' '}
                  <strong className="text-emerald-800">{data?.nghiemThu || 'Đạt tiêu chuẩn kỹ thuật'}</strong>
                </div>
              </div>
            </div>

            {/* BẢNG 11 CỘT CHUẨN ISO QT02 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-400 mb-6 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center align-middle">
                    <th className="border border-slate-400 p-1 w-6">STT</th>
                    <th className="border border-slate-400 p-1 text-left min-w-[130px]">Tên, ký mã hiệu TSCĐ / CCDC</th>
                    <th className="border border-slate-400 p-1 w-8">ĐVT</th>
                    <th className="border border-slate-400 p-1 w-8">SL</th>
                    <th className="border border-slate-400 p-1 text-right w-20">Đơn giá mua</th>
                    <th className="border border-slate-400 p-1 text-right w-16">Cước VC / Phụ</th>
                    <th className="border border-slate-400 p-1 text-right w-16">CP chạy thử</th>
                    <th className="border border-slate-400 p-1 text-right w-22 bg-blue-50 font-bold">Tổng nguyên giá</th>
                    <th className="border border-slate-400 p-1 text-right w-16">Phân loại</th>
                    <th className="border border-slate-400 p-1 text-right w-20 font-bold">Giá trị còn lại</th>
                    <th className="border border-slate-400 p-1 text-left min-w-[90px]">Số hiệu hồ sơ KT / Serial</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-500 text-[9px] text-center font-mono">
                    <td className="border border-slate-400 p-0.5">1</td>
                    <td className="border border-slate-400 p-0.5">2</td>
                    <td className="border border-slate-400 p-0.5">3</td>
                    <td className="border border-slate-400 p-0.5">4</td>
                    <td className="border border-slate-400 p-0.5">5</td>
                    <td className="border border-slate-400 p-0.5">6</td>
                    <td className="border border-slate-400 p-0.5">7</td>
                    <td className="border border-slate-400 p-0.5 font-bold">8 = (4*5)+6+7</td>
                    <td className="border border-slate-400 p-0.5">9</td>
                    <td className="border border-slate-400 p-0.5 font-bold">10 = 8</td>
                    <td className="border border-slate-400 p-0.5">11</td>
                  </tr>
                </thead>
                <tbody>
                  {data?.lines && Array.isArray(data.lines) && data.lines.length > 0 ? (
                    data.lines.map((l: any, idx: number) => {
                      const sl = Number(l.slNhan ?? l.soLuong ?? l.sl ?? 1);
                      const gia = Number(l.gia ?? l.donGia ?? 0);
                      const phi = Number(l.phi ?? l.cuocVanChuyen ?? 0);
                      const total = sl * gia + phi;
                      const isTscd = gia >= 30000000;
                      return (
                        <tr key={l.id || idx}>
                          <td className="border border-slate-400 p-1.5 text-center font-mono">{idx + 1}</td>
                          <td className="border border-slate-400 p-1.5">
                            <div className="font-bold text-slate-900">{l.ten || l.tsTen || 'Thiết bị'}</div>
                            <div className="font-mono text-slate-500 text-[9px]">Mã: {l.ts || l.tsId || '—'}</div>
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center">{l.dvt || 'Cái'}</td>
                          <td className="border border-slate-400 p-1.5 text-center font-mono font-bold">{sl}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono">{formatNum(gia)}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono">{formatNum(phi)}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono">0</td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono font-bold bg-blue-50/50">{formatNum(total)}</td>
                          <td className="border border-slate-400 p-1.5 text-center text-[9px] font-semibold text-blue-900">
                            {isTscd ? 'TSCĐ (211x)' : 'CCDC (1531)'}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">{formatNum(total)}</td>
                          <td className="border border-slate-400 p-1.5 text-slate-600 font-mono text-[9px]">{l.soSerial || l.soHieuKyThuat || '—'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center font-mono">1</td>
                      <td className="border border-slate-400 p-1.5">
                        <div className="font-bold text-slate-900">{data?.ten || 'Máy photocopy Ricoh MP'}</div>
                        <div className="font-mono text-slate-500 text-[9px]">Mã: {data?.id || 'TS/2026/0001'}</div>
                      </td>
                      <td className="border border-slate-400 p-1.5 text-center">Cái</td>
                      <td className="border border-slate-400 p-1.5 text-center font-mono font-bold">1</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">{formatNum(data?.giaMuaGoc || data?.nguyenGia || 45000000)}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">{formatNum(data?.cuocVanChuyen || 0)}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">{formatNum(data?.chiPhiChayThu || 0)}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono font-bold bg-blue-50/50">{formatNum(data?.nguyenGia || 45000000)}</td>
                      <td className="border border-slate-400 p-1.5 text-center text-[9px] font-semibold text-blue-900">TSCĐ (211x)</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">{formatNum(data?.nguyenGia || 45000000)}</td>
                      <td className="border border-slate-400 p-1.5 text-slate-600">{data?.soHieuKyThuat || 'TLKT-2026-TEDI'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-xs text-slate-700 mb-6 bg-slate-50 p-3 rounded border border-slate-200">
              <div>• <strong>Chế độ kiểm tra &amp; bảo dưỡng:</strong> {data?.cheDoKiemTra || 'Kiểm tra định kỳ 6 tháng/lần'}</div>
              <div>• <strong>Phương pháp khấu hao:</strong> {data?.method || 'Tuyến tính'} ({data?.soKy || 60} tháng) · Định khoản: TK {data?.tkTS || '2112'} / {data?.tkHM || '2141'}</div>
              <div>• <strong>Tình trạng kỹ thuật khi giao nhận:</strong> {data?.tinhTrang || 'Mới 100%, chạy thử nghiệm thu đạt yêu cầu'}</div>
            </div>

            <p className="text-[11px] text-slate-500 mb-10">
              Kể từ ngày ký biên bản, Đơn vị nhận có trách nhiệm quản lý, khai thác đúng mục đích và bảo quản tài sản. Biên bản lập thành 04 bản có giá trị như nhau.
            </p>

            {/* 4 KHỐI KÝ CHUẨN ISO BM QT02-2 */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <div className="font-bold uppercase text-[10px]">Đại diện Bên nhận</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Đại diện Bên giao</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Kế toán trưởng / TCKT</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký xác nhận vào sổ)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Tổng Giám Đốc / GĐ</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký duyệt, đóng dấu)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BM QT02-3: DANH MỤC MÁY MÓC THIẾT BỊ HẰNG NĂM (3 NHÓM) */}
        {/* ======================================================== */}
        {type === 'bm_qt02_3' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mã hiệu: BM QT02-3 (Ban hành 01/06/2017)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Kỳ báo cáo: Năm 2026
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              DANH MỤC MÁY MÓC THIẾT BỊ CHUYÊN DÙNG HẰNG NĂM
            </h1>

            <div className="text-center text-xs text-slate-500 mb-4">
              Đơn vị lập: <strong>Phòng Quản lý chất lượng &amp; Phòng QLVP</strong> · Mục 4.2.2 TEDI-ISO-QT 02
            </div>

            {/* NHÓM 1: THIẾT BỊ VĂN PHÒNG */}
            <div className="mb-4">
              <div className="bg-slate-200 font-bold text-xs px-2.5 py-1 text-slate-800 uppercase tracking-wide">
                I. Nhóm Thiết Bị Văn Phòng
              </div>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-left text-[10px]">
                    <th className="border border-slate-300 p-1.5 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-1.5">Mã &amp; Tên thiết bị</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">ĐVT</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">SL</th>
                    <th className="border border-slate-300 p-1.5">Đơn vị sử dụng</th>
                    <th className="border border-slate-300 p-1.5">Tình trạng hoạt động</th>
                    <th className="border border-slate-300 p-1.5">Chế độ kiểm tra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5 font-semibold">Máy photocopy đa năng Ricoh MP (TS/2026/0001)</td>
                    <td className="border border-slate-300 p-1.5 text-center">Cái</td>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5">CL-KD</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-700 font-medium">Đang hoạt động tốt</td>
                    <td className="border border-slate-300 p-1.5">Bảo dưỡng 6 tháng/lần</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* NHÓM 2: THÍ NGHIỆM HIỆN TRƯỜNG */}
            <div className="mb-4">
              <div className="bg-slate-200 font-bold text-xs px-2.5 py-1 text-slate-800 uppercase tracking-wide">
                II. Nhóm Thí Nghiệm &amp; Khảo Sát Hiện Trường
              </div>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-left text-[10px]">
                    <th className="border border-slate-300 p-1.5 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-1.5">Mã &amp; Tên thiết bị</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">ĐVT</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">SL</th>
                    <th className="border border-slate-300 p-1.5">Đơn vị sử dụng</th>
                    <th className="border border-slate-300 p-1.5">Tình trạng hoạt động</th>
                    <th className="border border-slate-300 p-1.5">Chế độ kiểm tra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5 font-semibold">Máy toàn đạc điện tử Leica TS07 (TS/2024/0007)</td>
                    <td className="border border-slate-300 p-1.5 text-center">Bộ</td>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5">QLCL</td>
                    <td className="border border-slate-300 p-1.5 text-amber-700 font-medium">Hỏng ống kính (chờ TL)</td>
                    <td className="border border-slate-300 p-1.5">Kiểm định 12T, Hiệu chỉnh 24T</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">2</td>
                    <td className="border border-slate-300 p-1.5 font-semibold">Máy toàn đạc điện tử Leica TS07 (bộ 2) (TS/2026/0004)</td>
                    <td className="border border-slate-300 p-1.5 text-center">Bộ</td>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5">QLVP</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-700 font-medium">Mới 100%</td>
                    <td className="border border-slate-300 p-1.5">Kiểm định 12T/lần</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* NHÓM 3: THÍ NGHIỆM TRONG PHÒNG */}
            <div className="mb-6">
              <div className="bg-slate-200 font-bold text-xs px-2.5 py-1 text-slate-800 uppercase tracking-wide">
                III. Nhóm Thí Nghiệm Trong Phòng (LAS-XD)
              </div>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-left text-[10px]">
                    <th className="border border-slate-300 p-1.5 w-8 text-center">STT</th>
                    <th className="border border-slate-300 p-1.5">Mã &amp; Tên thiết bị</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">ĐVT</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">SL</th>
                    <th className="border border-slate-300 p-1.5">Đơn vị sử dụng</th>
                    <th className="border border-slate-300 p-1.5">Tình trạng hoạt động</th>
                    <th className="border border-slate-300 p-1.5">Chế độ kiểm tra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5 font-semibold">Máy nén thí nghiệm ba trục tự động GDS (TS/2025/0018)</td>
                    <td className="border border-slate-300 p-1.5 text-center">Bộ</td>
                    <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-1.5">Phòng TN Cơ học Đất</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-700 font-medium">Đang vận hành tốt</td>
                    <td className="border border-slate-300 p-1.5">Hiệu chuẩn 12T/lần</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[11px]">Đơn vị sử dụng</div>
                <div className="text-[10px] text-slate-400 mb-10">(Lập danh mục &amp; Ký tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[11px]">Đơn vị Quản lý (QLVP/QLTB)</div>
                <div className="text-[10px] text-slate-400 mb-10">(Tổng hợp trình Lãnh đạo)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BM QT02-4: DANH MỤC PHẦN MỀM CHUYÊN DÙNG HẰNG NĂM */}
        {/* ======================================================== */}
        {(type === 'bm_qt02_4' || (type === 'software' && !data?.id)) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mã hiệu: BM QT02-4 (Ban hành 01/06/2017)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Kỳ báo cáo: Năm 2026
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              DANH MỤC PHẦN MỀM CHUYÊN DÙNG HẰNG NĂM
            </h1>

            <div className="text-center text-xs text-slate-500 mb-4 italic">
              (Khảo sát, thiết kế, thí nghiệm, quản lý điều hành và kế toán · Mục 4.2.2 &amp; 4.2.3.a ISO QT02)
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px] text-center">
                  <th className="border border-slate-300 p-2 w-8">STT</th>
                  <th className="border border-slate-300 p-2 text-left">Tên phần mềm chuyên dùng</th>
                  <th className="border border-slate-300 p-2 text-left">Ký hiệu / License Key</th>
                  <th className="border border-slate-300 p-2 text-left">Tính năng chính</th>
                  <th className="border border-slate-300 p-2 text-left">Nhà sản xuất / Đại lý</th>
                  <th className="border border-slate-300 p-2 text-center w-20">Ngày mua / Hạn dùng</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Tình trạng khai thác</th>
                  <th className="border border-slate-300 p-2 text-left">Chế độ kiểm tra KQ tính toán</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">1</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">AutoCAD Civil 3D 2026</td>
                  <td className="border border-slate-300 p-2 font-mono text-[10px]">CIVIL3D-2026-TEDI-8892</td>
                  <td className="border border-slate-300 p-2">Thiết kế hạ tầng giao thông, bình đồ tuyến</td>
                  <td className="border border-slate-300 p-2">Autodesk Inc</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-[10px]">31/12/2026</td>
                  <td className="border border-slate-300 p-2 text-center text-emerald-700 font-bold">Đang khai thác</td>
                  <td className="border border-slate-300 p-2 text-[10px]">Kiểm tra định kỳ 6 tháng (Mục 4.2.3.a)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">2</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">Phần mềm dự toán G8 Enterprise</td>
                  <td className="border border-slate-300 p-2 font-mono text-[10px]">G8-ENT-TEDI-45920-USB</td>
                  <td className="border border-slate-300 p-2">Lập và thẩm tra dự toán công trình</td>
                  <td className="border border-slate-300 p-2">Công ty CP Giá Xây Dựng</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-[10px]">Vĩnh viễn</td>
                  <td className="border border-slate-300 p-2 text-center text-emerald-700 font-bold">Đang khai thác</td>
                  <td className="border border-slate-300 p-2 text-[10px]">Kiểm tra định mức đơn giá hàng năm</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 text-center font-mono">3</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">Phần mềm khảo sát địa hình HHMaps v6</td>
                  <td className="border border-slate-300 p-2 font-mono text-[10px]">HHMAPS-60-HARDKEY-0023</td>
                  <td className="border border-slate-300 p-2">Xử lý số liệu trắc địa, vẽ mặt cắt</td>
                  <td className="border border-slate-300 p-2">Công ty TNHH Hải Hà</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-[10px]">Vĩnh viễn</td>
                  <td className="border border-slate-300 p-2 text-center text-emerald-700 font-bold">Đang khai thác</td>
                  <td className="border border-slate-300 p-2 text-[10px]">Kiểm tra kết quả tính toán định kỳ 12T</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[11px] text-slate-500 mb-8">
              Tuân thủ mục 4.2.3.a: Trường hợp phát hiện phần mềm có sai lệch về kết quả tính toán hoặc không tương thích, Đơn vị sử dụng phải ngừng khai thác và báo ngay cho Đơn vị quản lý để xử lý.
            </p>

            <div className="grid grid-cols-2 gap-8 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[11px]">Đơn vị sử dụng</div>
                <div className="text-[10px] text-slate-400 mb-10">(Ký xác nhận)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[11px]">Tổng Giám Đốc / Giám Đốc</div>
                <div className="text-[10px] text-slate-400 mb-10">(Phê duyệt ban hành)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BM QT02-5: BẢNG TỔNG HỢP DANH MỤC TSCĐ ĐỀ NGHỊ THANH LÝ */}
        {/* ======================================================== */}
        {(type === 'bm_qt02_5' || (type === 'disposal' && !data?.id)) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mã hiệu: BM QT02-5 (Ban hành 01/06/2017)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Ngày: {formatDMY('2026-08-12')}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              BẢNG TỔNG HỢP DANH MỤC TÀI SẢN CỐ ĐỊNH ĐỀ NGHỊ THANH LÝ
            </h1>

            <div className="text-center text-xs text-slate-500 mb-4">
              Căn cứ kết quả kiểm kê và biên bản thẩm định của Hội đồng định giá thanh lý TEDI (Mục 4.2.6 &amp; Phụ lục 5)
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-[10px]">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-center">
                  <th className="border border-slate-300 p-1.5 w-6">STT</th>
                  <th className="border border-slate-300 p-1.5 text-left">Tên tài sản cố định</th>
                  <th className="border border-slate-300 p-1.5 w-8">ĐVT</th>
                  <th className="border border-slate-300 p-1.5 w-8">SL</th>
                  <th className="border border-slate-300 p-1.5 text-left w-16">Đơn vị SD</th>
                  <th className="border border-slate-300 p-1.5 w-14">Năm SD</th>
                  <th className="border border-slate-300 p-1.5 text-right w-20">Nguyên giá</th>
                  <th className="border border-slate-300 p-1.5 text-right w-20">Khấu hao</th>
                  <th className="border border-slate-300 p-1.5 text-right w-20 font-bold">Còn lại</th>
                  <th className="border border-slate-300 p-1.5 text-left">Tình trạng kỹ thuật &amp; Lý do</th>
                  <th className="border border-slate-300 p-1.5 text-left w-24">Phương thức đề xuất</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                  <td className="border border-slate-300 p-1.5 font-bold">Máy toàn đạc điện tử Leica TS07</td>
                  <td className="border border-slate-300 p-1.5 text-center">Bộ</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                  <td className="border border-slate-300 p-1.5">QLCL</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">2024</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono">{formatNum(185000000)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono">{formatNum(92500000)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{formatNum(92500000)}</td>
                  <td className="border border-slate-300 p-1.5">Rơi ngập nước khi khảo sát, hỏng mainboard</td>
                  <td className="border border-slate-300 p-1.5 font-medium">Bán phế liệu / Hủy bỏ</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">2</td>
                  <td className="border border-slate-300 p-1.5 font-bold">Xe ô tô tải Hyundai 1,5 tấn</td>
                  <td className="border border-slate-300 p-1.5 text-center">Chiếc</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">1</td>
                  <td className="border border-slate-300 p-1.5">QLCL</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">2018</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono">{formatNum(520000000)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono">{formatNum(455000000)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{formatNum(65000000)}</td>
                  <td className="border border-slate-300 p-1.5">Không đạt tiêu chuẩn khí thải mới, chi phí sửa lớn</td>
                  <td className="border border-slate-300 p-1.5 font-medium">Chào giá cạnh tranh</td>
                </tr>
              </tbody>
            </table>

            {/* 4 KHỐI KÝ CHUẨN ISO BM QT02-5 */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[10px]">Người lập biểu</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Người kiểm tra</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Thủ trưởng đơn vị SD</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký xác nhận)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Chủ tịch HĐ định giá</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký tên, trình TGĐ)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHỤ LỤC 5: SƠ ĐỒ TRÌNH TỰ THANH LÝ TSCĐ */}
        {/* ======================================================== */}
        {type === 'pl5_thanh_ly' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Phụ lục 5 (TEDI-ISO-QT 02)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Quy chuẩn ISO 9001:2015
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-4 text-blue-950">
              SƠ ĐỒ TRÌNH TỰ THANH LÝ TÀI SẢN CỐ ĐỊNH (6 BƯỚC)
            </h1>

            <div className="space-y-4 my-6">
              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 1: Đề xuất thanh lý TSCĐ</div>
                  <div className="text-xs text-slate-600">Đơn vị sử dụng lập báo cáo hiện trạng thiết bị hư hỏng không khắc phục được hoặc hết hạn sử dụng gửi Đơn vị quản lý.</div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 2: Họp Hội đồng Định giá thanh lý</div>
                  <div className="text-xs text-slate-600">Hội đồng định giá (do TGĐ thành lập) kiểm tra thực tế, xác định giá trị thu hồi và lập bảng tổng hợp <strong>BM QT02-5</strong>.</div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 3: Thẩm quyền Phê duyệt thanh lý</div>
                  <div className="text-xs text-slate-600">Trình HĐQT hoặc Tổng Giám Đốc xem xét ban hành Quyết định thanh lý TSCĐ theo hạn mức phân cấp thẩm quyền.</div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">4</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 4: Tổ chức thực hiện Thanh lý</div>
                  <div className="text-xs text-slate-600">Đơn vị quản lý tổ chức thông báo, bán đấu giá, chào giá cạnh tranh hoặc nhượng bán/hủy bỏ theo đúng phương thức đã phê duyệt.</div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">5</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 5: Lập Biên bản Thanh lý TSCĐ</div>
                  <div className="text-xs text-slate-600">Hội đồng lập Biên bản thanh lý xác nhận số tiền thu hồi, chi phí phát sinh và bàn giao tài sản cho bên mua.</div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/60 p-3.5 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">6</div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Bước 6: Ghi giảm Sổ sách Kế toán</div>
                  <div className="text-xs text-slate-600">Phòng TCKT căn cứ Biên bản thanh lý thực hiện hạch toán ghi giảm nguyên giá (TK 211), khấu hao lũy kế (TK 214) và thu nhập/chi phí (TK 711/811).</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
              Trích lục Sơ đồ quy trình thanh lý TSCĐ đính kèm TEDI-ISO-QT 02 (Ban hành ngày 01/06/2017)
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* QT-05: PHIẾU MƯỢN TRẢ THIẾT BỊ HIỆN TRƯỜNG */}
        {/* ======================================================== */}
        {type === 'qt05_muon_tra' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Quy trình nội bộ TEDI QT-05
              </span>
              <span className="font-mono text-xs text-slate-600">
                Số: {data?.id || 'PM/2026/0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              PHIẾU MƯỢN – TRẢ THIẾT BỊ KHẢO SÁT HIỆN TRƯỜNG
            </h1>

            <div className="space-y-2 mb-6 bg-slate-50 p-4 border border-slate-200 rounded text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Người mượn thiết bị:</span>{' '}
                  <strong className="text-slate-800">{data?.nguoiMuon || 'Trần Văn Nam'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Đơn vị công tác:</span>{' '}
                  <strong className="text-slate-800">Phòng {data?.donVi || 'QLCL'}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Dự án / Công trình:</span>{' '}
                  <strong className="text-slate-800">{data?.duAn || 'Khảo sát địa chất tuyến ĐT.741'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Địa điểm thực hiện:</span>{' '}
                  <span>{data?.diaDiem || 'Bình Dương'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Ngày mượn:</span>{' '}
                  <strong className="font-mono">{formatDMY(data?.ngayMuon || '2026-08-01')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Hạn trả dự kiến:</span>{' '}
                  <strong className="font-mono text-amber-800">{formatDMY(data?.ngayDuKienTra || '2026-08-15')}</strong>
                </div>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                  <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                  <th className="border border-slate-300 p-2 text-left">Mã thiết bị</th>
                  <th className="border border-slate-300 p-2 text-left">Tên thiết bị khảo sát</th>
                  <th className="border border-slate-300 p-2 text-center w-12">ĐVT</th>
                  <th className="border border-slate-300 p-2 text-center w-12">SL</th>
                  <th className="border border-slate-300 p-2 text-left">Tình trạng khi mượn</th>
                </tr>
              </thead>
              <tbody>
                {data?.thietBi && data.thietBi.length > 0 ? (
                  data.thietBi.map((tb: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">{tb.ma}</td>
                      <td className="border border-slate-300 p-2 font-semibold">{tb.ten}</td>
                      <td className="border border-slate-300 p-2 text-center">{tb.dvt}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono font-bold">{tb.sl}</td>
                      <td className="border border-slate-300 p-2 text-slate-700">{data?.tinhTrangKhiMuon || 'Nguyên vẹn, đầy đủ phụ kiện chân máy và sạc'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-slate-300 p-2 text-center font-mono">1</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold">TB/2026/0004</td>
                    <td className="border border-slate-300 p-2 font-semibold">Máy toàn đạc Leica TS07 (Hiện trường)</td>
                    <td className="border border-slate-300 p-2 text-center">Bộ</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold">1</td>
                    <td className="border border-slate-300 p-2 text-slate-700">Nguyên vẹn, kèm chân máy và sạc chính hãng</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="space-y-1 text-xs text-slate-600 mb-8 bg-slate-50 p-3 rounded border border-slate-200">
              <div>• <strong>Cam kết người mượn:</strong> Sử dụng đúng mục đích, tuân thủ quy trình vận hành an toàn ngoài hiện trường, bồi thường nếu làm mất hoặc hư hỏng do lỗi cá nhân.</div>
              <div>• <strong>Xác nhận thủ kho:</strong> Thiết bị đã được kiểm tra tem hiệu chỉnh trước khi xuất kho.</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[10px]">Người mượn thiết bị</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, ghi rõ họ tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Trưởng đơn vị công tác</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký duyệt cử đi)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Thủ kho thiết bị (QLVP)</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký xuất kho)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TRANSFER: BIÊN BẢN ĐIỀU CHUYỂN TÀI SẢN (MỤC 4.2.5) */}
        {/* ======================================================== */}
        {type === 'transfer' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mục 4.2.5 (TEDI-ISO-QT 02)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Số: {data?.id || 'ĐCTS/2026/0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              BIÊN BẢN ĐIỀU CHUYỂN TÀI SẢN CỐ ĐỊNH / CCDC
            </h1>

            <div className="text-center font-mono text-xs text-slate-500 mb-4">
              Ngày lập: {formatDMY(data?.ngay || '2026-08-12')} · Căn cứ: {data?.soQuyetDinh || 'QĐ-102/2026/TEDI'}
            </div>

            <div className="space-y-2 mb-6 bg-slate-50 p-4 border border-slate-200 rounded text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Bên giao:</span>{' '}
                  <strong className="text-slate-800">Phòng {data?.tuPB} — {data?.tuNguoi}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Bên nhận:</span>{' '}
                  <strong className="text-slate-800">Phòng {data?.denPB} — {data?.denNguoi}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Căn cứ điều chuyển:</span>{' '}
                  <span>{data?.canCuLoai || 'Quyết định phân công nhân sự'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Vị trí mới:</span>{' '}
                  <span>{data?.viTriMoi || 'Văn phòng làm việc mới'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Lý do điều chuyển:</span>{' '}
                <span>{data?.lyDo}</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                  <th className="border border-slate-300 p-2 text-left">Mã tài sản</th>
                  <th className="border border-slate-300 p-2 text-left">Tên tài sản</th>
                  <th className="border border-slate-300 p-2 text-left">Đối tượng chi phí mới</th>
                  <th className="border border-slate-300 p-2 text-left">Lý do điều chuyển</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-mono font-bold text-blue-900">{data?.ts}</td>
                  <td className="border border-slate-300 p-2 font-semibold">Tài sản cố định điều chuyển</td>
                  <td className="border border-slate-300 p-2 font-mono text-slate-700">{data?.doiTuongChiPhiMoi || 'Trung tâm chi phí phòng ban mới'}</td>
                  <td className="border border-slate-300 p-2">{data?.lyDo}</td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-12">
              <div>
                <div className="font-bold uppercase text-[10px]">Bên giao</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Bên nhận</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Kế toán tài sản</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký cập nhật)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Tổng Giám Đốc / GĐ</div>
                <div className="text-[9px] text-slate-400 mb-10">(Phê duyệt)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AUDIT: BIÊN BẢN KIỂM KÊ TÀI SẢN (MỤC 4.2.4) */}
        {/* ======================================================== */}
        {type === 'audit' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Mục 4.2.4 (TEDI-ISO-QT 02)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Số: {data?.id || 'TEDI-KK/2026/0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-3 text-blue-950">
              BIÊN BẢN KIỂM KÊ TÀI SẢN CỐ ĐỊNH VÀ CCDC
            </h1>

            <div className="text-center font-mono text-xs text-slate-500 mb-4">
              Thời điểm kiểm kê: 0h00 ngày {formatDMY(data?.ngayChot || '2026-01-01')} · Căn cứ: {data?.soQuyetDinh || 'QĐ-01/2026/TEDI'}
            </div>

            <div className="space-y-1.5 mb-5 bg-slate-50 p-3.5 border border-slate-200 rounded text-xs">
              <div>• <strong>Tên đợt kiểm kê:</strong> {data?.tenDot}</div>
              <div>• <strong>Thành phần Hội đồng:</strong> {data?.hoiDong}</div>
              {data?.kiemToanDocLap && <div>• <strong>Đơn vị kiểm toán độc lập chứng kiến:</strong> {data?.kiemToanDocLap}</div>}
            </div>

            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                  <th className="border border-slate-300 p-2 text-center w-8">STT</th>
                  <th className="border border-slate-300 p-2 text-left">Mã tài sản</th>
                  <th className="border border-slate-300 p-2 text-left">Tên tài sản</th>
                  <th className="border border-slate-300 p-2 text-left">Đơn vị SD</th>
                  <th className="border border-slate-300 p-2 text-right">SL Sổ</th>
                  <th className="border border-slate-300 p-2 text-right">SL Thực</th>
                  <th className="border border-slate-300 p-2 text-right">Chênh lệch</th>
                  <th className="border border-slate-300 p-2 text-left">Tình trạng</th>
                  <th className="border border-slate-300 p-2 text-left">Phương án xử lý</th>
                </tr>
              </thead>
              <tbody>
                {data?.lines?.map((line: any, idx: number) => {
                  const diff = (line.tt || 0) - (line.so || 0);
                  return (
                    <tr key={line.id || idx}>
                      <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-1.5 font-mono font-bold">{line.id}</td>
                      <td className="border border-slate-300 p-1.5 font-semibold">{line.ten}</td>
                      <td className="border border-slate-300 p-1.5">{line.pb}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono">{line.so}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{line.tt}</td>
                      <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                      <td className="border border-slate-300 p-1.5">{line.tinh}</td>
                      <td className="border border-slate-300 p-1.5 font-medium">{line.xl}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="text-[11px] text-slate-500 mb-8">
              Tuân thủ mục 4.2.4: Sau khi kiểm kê thực tế, Hội đồng lập biên bản, Phòng TCKT đối chiếu với sổ sách kế toán để xử lý các khoản thừa thiếu theo quy định.
            </p>

            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-8">
              <div>
                <div className="font-bold uppercase text-[10px]">Đại diện đơn vị SD</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký xác nhận)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Tổ kiểm kê</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Kiểm toán độc lập</div>
                <div className="text-[9px] text-slate-400 mb-10">(Chứng kiến &amp; Ký)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Chủ tịch HĐ kiểm kê</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, đóng dấu)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* XDCB: PHIẾU ĐỀ XUẤT, DỰ TOÁN & QUYẾT TOÁN CÔNG TRÌNH XDCB (QT-08) */}
        {/* ======================================================== */}
        {(type === 'workbudget' || type === 'xdcb' || type === 'bm12') && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                BM-XDCB / QT-08 (TEDI-ISO-QT 02)
              </span>
              <span className="font-mono text-xs text-slate-600">
                Mã phiếu: {data?.id || 'DT/2026/0001'}
              </span>
            </div>

            <h1 className="text-base font-bold text-center uppercase tracking-wide my-2 text-blue-950">
              {data?.trangThai === 'Quyết toán' || data?.trangThai === 'Bảo hành' || data?.trangThai === 'Đã hoàn thành'
                ? 'BẢNG TỔNG HỢP QUYẾT TOÁN CÔNG TRÌNH XDCB / CẢI TẠO'
                : 'BẢNG ĐỀ XUẤT & DỰ TOÁN KHỐI LƯỢNG CÔNG TRÌNH XDCB'}
            </h1>

            <div className="text-center font-mono text-xs text-slate-500 mb-4">
              Ngày lập: {formatDMY(data?.ngay || '2026-08-12')} · Loại: {data?.loaiCV || 'Cải tạo'} ({data?.truongHop || 'Nâng cấp TS cũ'})
            </div>

            {/* Thông tin chung */}
            <div className="space-y-2 mb-5 bg-slate-50 p-3.5 border border-slate-200 rounded text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>• <strong>Tên công trình/Hạng mục:</strong> <span className="font-bold text-slate-900">{data?.tenHangMuc}</span></div>
                <div>• <strong>Trường hợp ghi nhận:</strong> <span className="font-bold text-blue-900">{data?.truongHop || 'Nâng cấp TS cũ'}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>• <strong>Đơn vị đề xuất:</strong> {data?.donViDeXuat || 'Phòng Quản lý Văn phòng'} ({data?.nguoiDeXuat || 'Trần Thu Hà'})</div>
                <div>• <strong>Tài sản cố định liên quan:</strong> <span className="font-mono font-bold">{data?.hangMuc || data?.hangMucTS || '(Hạng mục xây mới)'}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>• <strong>Nhà thầu thi công:</strong> {data?.nhaThau || 'Chưa chọn'}</div>
                <div>• <strong>Hợp đồng thi công:</strong> <span className="font-mono">{data?.hopDong || '—'}</span> (Giá trị: {formatVND(data?.giaTriHD || 0)})</div>
              </div>
              <div>• <strong>Lý do &amp; Mục tiêu:</strong> {data?.lyDo}</div>
              {data?.baoHanh && (
                <div>• <strong>Thời hạn &amp; Nội dung bảo hành:</strong> {data?.baoHanh} (Hết hạn: {formatDMY(data?.ngayHetHanBH || '')}) — {data?.noiDungBH}</div>
              )}
            </div>

            {/* Bảng khối lượng dự toán & quyết toán */}
            <table className="w-full border-collapse border border-slate-300 mb-6 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                  <th className="border border-slate-300 p-1.5 text-center w-8">Mã</th>
                  <th className="border border-slate-300 p-1.5 text-left">Hạng mục công việc / Quy cách vật tư</th>
                  <th className="border border-slate-300 p-1.5 text-center w-12">ĐVT</th>
                  <th className="border border-slate-300 p-1.5 text-right">KL Dự toán</th>
                  <th className="border border-slate-300 p-1.5 text-right">ĐG Dự toán</th>
                  <th className="border border-slate-300 p-1.5 text-right">Thành tiền DT</th>
                  {data?.quyetToan > 0 && (
                    <>
                      <th className="border border-slate-300 p-1.5 text-right">KL Thực tế</th>
                      <th className="border border-slate-300 p-1.5 text-right">ĐG Thực tế</th>
                      <th className="border border-slate-300 p-1.5 text-right">Thành tiền TT</th>
                      <th className="border border-slate-300 p-1.5 text-right">Chênh lệch</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.lines?.map((line: any) => {
                  const isParent = !line.cha;
                  const totalDt = (line.kl || 0) * (line.gia || 0);
                  const totalTt = (line.klThucTe !== undefined && line.giaThucTe !== undefined)
                    ? line.klThucTe * line.giaThucTe
                    : totalDt;
                  const diff = totalTt - totalDt;

                  return (
                    <tr key={line.id} className={isParent ? 'bg-slate-100/80 font-bold' : ''}>
                      <td className="border border-slate-300 p-1 text-center font-mono">{line.id}</td>
                      <td className={`border border-slate-300 p-1.5 ${isParent ? 'font-bold text-slate-900' : 'pl-4 text-slate-700'}`}>
                        {line.ten}
                      </td>
                      <td className="border border-slate-300 p-1 text-center text-slate-500">{line.dvt || '—'}</td>
                      <td className="border border-slate-300 p-1 text-right font-mono">{line.kl || '—'}</td>
                      <td className="border border-slate-300 p-1 text-right font-mono">{line.gia ? formatVND(line.gia) : '—'}</td>
                      <td className="border border-slate-300 p-1 text-right font-mono font-bold">{formatVND(totalDt)}</td>
                      {data?.quyetToan > 0 && (
                        <>
                          <td className="border border-slate-300 p-1 text-right font-mono">{line.klThucTe || '—'}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">{line.giaThucTe ? formatVND(line.giaThucTe) : '—'}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono font-bold text-slate-900">{formatVND(totalTt)}</td>
                          <td className={`border border-slate-300 p-1 text-right font-mono font-bold ${diff > 0 ? 'text-rose-700' : diff < 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {diff === 0 ? '0' : (diff > 0 ? `+${formatVND(diff)}` : `-${formatVND(Math.abs(diff))}`)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50/80 font-bold text-slate-900 text-xs">
                  <td colSpan={5} className="border border-slate-300 p-2 uppercase text-right">Tổng cộng dự toán:</td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-emerald-900 font-extrabold">
                    {formatVND(data?.tongDuToan || (data?.lines ? data.lines.filter((l: any) => !l.cha).reduce((s: number, l: any) => s + (l.kl * l.gia), 0) : 0))}
                  </td>
                  {data?.quyetToan > 0 && (
                    <>
                      <td colSpan={2} className="border border-slate-300 p-2 uppercase text-right">Tổng quyết toán:</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-emerald-900 font-extrabold">
                        {formatVND(data?.quyetToan)}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-extrabold text-blue-900">
                        {formatVND((data?.quyetToan || 0) - (data?.tongDuToan || 0))}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>

            {/* Thông tin FAST hạch toán */}
            <div className="bg-slate-100 p-3 rounded border border-slate-300 text-xs mb-8">
              <div className="font-bold text-slate-900 mb-1">Phương thức hạch toán kế toán phần mềm FAST:</div>
              {data?.truongHop === 'Nâng cấp TS cũ' ? (
                <div>• <strong>Hạch toán:</strong> Ghi tăng nguyên giá TSCĐ <span className="font-mono font-bold">[{data?.hangMuc || data?.fastMaTS}]</span> giá trị <strong>{formatVND(data?.quyetToan || data?.tongDuToan || 0)}</strong>. FAST tự động tính lại mức trích khấu hao hàng tháng cho thời gian sử dụng còn lại.</div>
              ) : (
                <div>• <strong>Hạch toán:</strong> Ghi tăng tạo mới Tài sản cố định XDCB <span className="font-mono font-bold">[{data?.fastMaTS || 'Mã mới do FAST cấp'}]</span> vào TK 2112/2113 với nguyên giá <strong>{formatVND(data?.quyetToan || data?.tongDuToan || 0)}</strong>. FAST lập bảng trích khấu hao từ đầu.</div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-8">
              <div>
                <div className="font-bold uppercase text-[10px]">Người lập dự toán</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký tên)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Trưởng đơn vị đề xuất</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký duyệt)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Đại diện nhà thầu</div>
                <div className="text-[9px] text-slate-400 mb-10">(Ký, đóng dấu)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
              <div>
                <div className="font-bold uppercase text-[10px]">Tổng Giám Đốc / HĐQT</div>
                <div className="text-[9px] text-slate-400 mb-10">(Phê duyệt quyết toán)</div>
                <div className="border-t border-dotted border-slate-300 pt-1 text-slate-500">………………………</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
