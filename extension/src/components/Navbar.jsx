import React from "react";
import { ShieldCheck, ShieldAlert, Database, Search } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      {/* Top row: Brand & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
              SocialScam <span className="text-blue-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">DETECTOR</span>
            </h1>
            <p className="text-[10px] text-slate-400">Bảo vệ & Nhận diện Giả mạo</p>
          </div>
        </div>

        {/* Backend / Mock Status Indicator */}
        <div className="flex items-center space-x-1.5 text-[11px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.online ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span className="text-slate-300 font-medium">
            {backendStatus.online
              ? backendStatus.mockMode
                ? "Smart Mock"
                : "API Live"
              : "Offline Engine"}
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="grid grid-cols-2 gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab("scanner")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all ${
            activeTab === "scanner"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quét Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("blacklist")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all relative ${
            activeTab === "blacklist"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Kho Blacklist</span>
          <span className="text-[9px] px-1 py-0.2 bg-indigo-500/30 text-indigo-300 rounded font-bold border border-indigo-500/40">
            GĐ 2
          </span>
        </button>
      </div>
    </header>
  );
}
