import React, { useState } from "react";
import {
  Database,
  Search,
  AlertTriangle,
  PlusCircle,
  Phone,
  CreditCard,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  X
} from "lucide-react";

const INITIAL_BLACKLIST_SAMPLES = [
  {
    id: "BL-001",
    type: "bank",
    target: "19036782910015 (Techcombank)",
    owner: "NGUYEN VAN DUC",
    scamType: "Giả mạo nhân viên ngân hàng báo khóa thẻ",
    reportsCount: 42,
    dateAdded: "02/11/2026"
  },
  {
    id: "BL-002",
    type: "phone",
    target: "0982.148.910",
    owner: "Mạo danh bưu điện / Viettel Post",
    scamType: "Báo có bưu phẩm bị giữ ở hải quan đòi nộp phạt",
    reportsCount: 29,
    dateAdded: "28/10/2026"
  },
  {
    id: "BL-003",
    type: "bank",
    target: "102847192841 (VietinBank)",
    owner: "TRAN THI HOA",
    scamType: "Bẫy tuyển cộng tác viên Shopee làm nhiệm vụ giật đơn",
    reportsCount: 78,
    dateAdded: "05/11/2026"
  },
  {
    id: "BL-004",
    type: "url",
    target: "https://tra-cuu-phat-nguoi-vn-online.site",
    owner: "Web lừa đảo",
    scamType: "Phishing đánh cắp OTP tài khoản VNeID và ngân hàng",
    reportsCount: 115,
    dateAdded: "06/11/2026"
  }
];

export default function BlacklistManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedSuccess, setReportedSuccess] = useState(false);

  // Form báo cáo mới
  const [newTarget, setNewTarget] = useState("");
  const [newType, setNewType] = useState("bank");
  const [newReason, setNewReason] = useState("");

  const filteredItems = INITIAL_BLACKLIST_SAMPLES.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scamType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmittingReport = (e) => {
    e.preventDefault();
    if (!newTarget.trim()) return;

    // Giả lập lưu báo cáo
    setReportedSuccess(true);
    setTimeout(() => {
      setReportedSuccess(false);
      setShowReportModal(false);
      setNewTarget("");
      setNewReason("");
    }, 1500);
  };

  return (
    <div className="p-4 space-y-3.5 animate-fadeIn">
      {/* Banner Giai đoạn 2 */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs">
        <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Kho Dữ Liệu Đen (Blacklist Module - GĐ 2)</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Khung kiến trúc mở rộng để kết nối CSDL số điện thoại, tài khoản ngân hàng và đường link lừa đảo đã được cộng đồng xác minh.
        </p>
      </div>

      {/* Thanh tìm kiếm & Lọc */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu số TK, SĐT lừa đảo..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Bộ lọc loại blacklist */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <div className="flex gap-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "bank", label: "Số TK" },
              { id: "phone", label: "SĐT" },
              { id: "url", label: "Link Web" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  filterType === f.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Danh sách mục trong Blacklist */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Không tìm thấy thông tin trùng khớp trong danh sách đen mẫu.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  {item.type === "bank" ? (
                    <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                  ) : item.type === "phone" ? (
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span className="truncate">{item.target}</span>
                </div>

                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {item.reportsCount} báo cáo
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Chủ TK: <strong className="text-slate-300">{item.owner}</strong></span>
                <span>Ngày thêm: {item.dateAdded}</span>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                ⚠️ <strong className="text-slate-300">Chiêu trò:</strong> {item.scamType}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal Báo cáo lừa đảo mới (Placeholder Flow) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 w-full max-w-sm space-y-3 relative shadow-2xl">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Gửi Báo Cáo Đối Tượng Lừa Đảo</span>
            </h3>

            {reportedSuccess ? (
              <div className="py-6 text-center space-y-2 text-emerald-400">
                <CheckCircle className="w-10 h-10 mx-auto" />
                <p className="text-xs font-bold">Đã tiếp nhận báo cáo của bạn!</p>
                <p className="text-[11px] text-slate-400">Dữ liệu sẽ được đồng bộ vào hệ thống.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmittingReport} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Loại đối tượng:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    <option value="bank">Số tài khoản ngân hàng</option>
                    <option value="phone">Số điện thoại mạo danh</option>
                    <option value="url">Đường link lừa đảo / Phishing</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Thông tin chi tiết:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 1903... hoặc 098..."
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Mô tả hành vi lừa đảo:</label>
                  <textarea
                    rows={2}
                    placeholder="VD: Giả mạo shipper giao hàng yêu cầu chuyển khoản..."
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                  >
                    Gửi Xác Minh
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
