import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

export default function RiskMeter({ score = 0, level = "safe", verdict = "" }) {
  // Chuẩn hóa màu sắc và cấu hình theo 3 mức độ yêu cầu
  const getLevelConfig = () => {
    if (score >= 70 || level === "danger") {
      return {
        label: "NGUY CƠ GIẢ MẠO CAO",
        subtext: "70% - 100% (Rất nguy hiểm)",
        strokeColor: "#F43F5E", // rose-500
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/30",
        textColor: "text-rose-400",
        ringColor: "text-rose-500",
        badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
      };
    }
    if (score >= 31 || level === "warning") {
      return {
        label: "CẢNH GIÁC / NGHI VẤN",
        subtext: "31% - 69% (Nên kiểm tra thêm)",
        strokeColor: "#F59E0B", // amber-500
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-400",
        ringColor: "text-amber-500",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
      };
    }
    return {
      label: "TÀI KHOẢN AN TOÀN",
      subtext: "0% - 30% (Độ tin cậy cao)",
      strokeColor: "#10B981", // emerald-500
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      ringColor: "text-emerald-500",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    };
  };

  const config = getLevelConfig();

  // Tính toán vòng cung SVG (Circumference)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} transition-all`}>
      <div className="flex items-center justify-between gap-3">
        {/* Vòng tròn điểm số SVG */}
        <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 90 90">
            {/* Background ring */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              className="text-slate-800"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Value ring */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke={config.strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Điểm số ở giữa */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black tracking-tight ${config.textColor}`}>
              {score}%
            </span>
            <span className="text-[9px] font-semibold uppercase text-slate-400">Rủi ro</span>
          </div>
        </div>

        {/* Nội dung kết luận */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${config.badgeBg}`}>
              {config.label}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1 line-clamp-3">
            {verdict}
          </p>

          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
            Thang đo: <span className="font-semibold">{config.subtext}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
