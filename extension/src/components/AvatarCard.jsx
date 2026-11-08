import React from "react";
import { User, Calendar, ExternalLink, Globe } from "lucide-react";

export default function AvatarCard({ profile = {} }) {
  const {
    name = "Chưa rõ tên",
    avatarUrl = "",
    profileUrl = "",
    joinedDate = "Chưa xác định",
    platform = "facebook"
  } = profile;

  const isFb = platform === "facebook" || profileUrl.includes("facebook.com");
  const isIg = platform === "instagram" || profileUrl.includes("instagram.com");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar preview */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                }}
              />
            ) : (
              <User className="w-7 h-7 text-slate-500" />
            )}
          </div>

          {/* Platform badge icon */}
          <span
            className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white shadow ${
              isFb
                ? "bg-blue-600 border border-blue-400"
                : isIg
                ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 border border-pink-400"
                : "bg-slate-700"
            }`}
          >
            {isFb ? "FB" : isIg ? "IG" : "Web"}
          </span>
        </div>

        {/* Profile metadata */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate" title={name}>
            {name}
          </h3>

          {/* Profile link */}
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 truncate mt-0.5 group"
            >
              <Globe className="w-3 h-3 flex-shrink-0 text-slate-500 group-hover:text-blue-400" />
              <span className="truncate">{profileUrl.replace(/^https?:\/\//, "")}</span>
              <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-70" />
            </a>
          )}

          {/* Joined date info */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60 w-fit">
            <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Tham gia:</span>
            <span className="font-medium text-slate-200">{joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
