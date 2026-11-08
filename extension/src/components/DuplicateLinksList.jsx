import React from "react";
import { Copy, ExternalLink, Image, CheckCircle2, AlertOctagon } from "lucide-react";

export default function DuplicateLinksList({ imageSearch = {} }) {
  const { duplicates = [], totalMatches = 0, isStockOrStolen = false, engine = "Reverse Image Search" } = imageSearch;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Image className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-slate-200">
            Kết Quả Tìm Kiếm Ngược Avatar
          </h4>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
            totalMatches > 0
              ? isStockOrStolen
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          }`}
        >
          {totalMatches > 0 ? `${totalMatches} liên kết trùng` : "0 trùng lặp"}
        </span>
      </div>

      {/* Engine note */}
      <p className="text-[10px] text-slate-500 mb-2">
        Công cụ: <span className="text-slate-400">{engine}</span>
      </p>

      {/* Empty State */}
      {duplicates.length === 0 ? (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>
            Ảnh đại diện là độc nhất. Không phát hiện trùng khớp trên các kho ảnh mẫu hoặc mạng xã hội khác.
          </span>
        </div>
      ) : (
        /* List of duplicates */
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {duplicates.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.source || "Web"}
                </span>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-blue-400 flex items-center gap-1 text-[11px]"
                >
                  <span>Xem nguồn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-slate-200 font-medium truncate" title={item.title}>
                {item.title}
              </p>

              {item.snippet && (
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {item.snippet}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
