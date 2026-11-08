import React from "react";
import { AlertOctagon, AlertTriangle, ShieldCheck, Check, X } from "lucide-react";

export default function AlertBadge({ riskAnalysis = {} }) {
  const { score = 0, level = "safe", verdict = "", factors = [] } = riskAnalysis;

  const isDanger = score >= 70 || level === "danger";
  const isWarning = (score >= 31 && score < 70) || level === "warning";

  return (
    <div className="space-y-3">
      {/* Banner Cảnh Báo Lớn nếu score >= 70% */}
      {isDanger && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-900/40 via-red-900/30 to-rose-900/40 border-2 border-rose-500/80 shadow-lg shadow-rose-950/50 animate-pulse">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-black text-rose-200 tracking-wide uppercase">
                CẢNH BÁO: Có dấu hiệu giả mạo danh tính cá nhân!
              </h3>
              <p className="text-[11px] text-rose-300/90 mt-1 leading-snug">
                Phát hiện ảnh đại diện trùng với nguồn trên mạng kết hợp tài khoản mới tạo. Tuyệt đối KHÔNG chuyển tiền, cọc tiền hay cung cấp OTP cho tài khoản này!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner Cảnh giác nếu 31-69% */}
      {isWarning && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                CHÚ Ý: Hồ sơ có một số điểm bất thường
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Nên xác minh qua gọi video hoặc bạn bè chung trước khi thực hiện các giao dịch nhạy cảm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết các yếu tố phân tích (Risk Factors Breakdown) */}
      {factors.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h4 className="text-xs font-bold text-slate-300 mb-2">
            Các Yếu Tố Đánh Giá Rủi Ro:
          </h4>
          <div className="space-y-1.5">
            {factors.map((f, i) => {
              const isBad = f.impact === "negative";
              const isGood = f.impact === "positive";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                    isBad
                      ? "bg-rose-500/10 border border-rose-500/20 text-rose-200"
                      : isGood
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200"
                      : "bg-slate-800/60 border border-slate-700/50 text-slate-300"
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">
                    {isBad ? (
                      <X className="w-3.5 h-3.5 text-rose-400" />
                    ) : isGood ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </span>
                  <div>
                    <span className="font-semibold">{f.label}: </span>
                    <span className="text-[11px] opacity-90">{f.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
