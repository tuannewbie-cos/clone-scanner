import React, { useState, useEffect } from "react";
import {
  Search,
  Scan,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Shield,
  AlertCircle,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import RiskMeter from "../../components/RiskMeter";
import AvatarCard from "../../components/AvatarCard";
import DuplicateLinksList from "../../components/DuplicateLinksList";
import AlertBadge from "../../components/AlertBadge";
import { analyzeProfileApi } from "./services/scannerApi";
import { getPendingScan, clearPendingScan, saveScanHistory, isChromeExtension } from "../../utils/chromeStorage";

export default function ProfileScanner() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Kiểm tra nếu có lệnh scan đang chờ từ Context Menu
  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingScan();
      if (pending && pending.url) {
        setInputUrl(pending.url);
        await clearPendingScan();
        handleExecuteScan({ profileUrl: pending.url });
      }
    }
    checkPending();
  }, []);

  // Hàm quét chính
  const handleExecuteScan = async (params = {}) => {
    const targetUrl = params.profileUrl || inputUrl.trim();
    if (!targetUrl && !params.avatarUrl) {
      setError("Vui lòng nhập link profile Facebook hoặc Instagram để kiểm tra!");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      setLoadingStep("Đang bóc tách thông tin tài khoản...");
      await new Promise((r) => setTimeout(r, 400));

      setLoadingStep("Đang tìm kiếm ngược ảnh đại diện (Reverse Search)...");
      await new Promise((r) => setTimeout(r, 500));

      setLoadingStep("Đang phân tích ngày tạo & tính điểm rủi ro...");

      const response = await analyzeProfileApi({
        profileUrl: targetUrl,
        avatarUrl: params.avatarUrl || "",
        name: params.name || "",
        joinedDate: params.joinedDate || "",
        platform: params.platform || "facebook"
      });

      if (response && response.status === "success") {
        setResult(response.data);
        saveScanHistory(response);
      } else {
        throw new Error(response?.message || "Không thể phân tích dữ liệu profile.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi khi phân tích. Vui lòng thử lại!");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // 1. Quét nhanh tab hiện tại qua Content Script
  const handleScanCurrentTab = () => {
    setError("");

    if (!isChromeExtension() || !chrome.tabs) {
      setError("Tính năng 'Quét Tab' chỉ hoạt động khi mở Extension trên tab Facebook/Instagram của Chrome!");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id) {
        setError("Không tìm thấy tab trình duyệt đang hoạt động.");
        return;
      }

      const url = activeTab.url || "";
      if (!url.includes("facebook.com") && !url.includes("instagram.com")) {
        setError("Tab hiện tại không phải là Facebook hoặc Instagram. Vui lòng chuyển sang trang cá nhân cần quét.");
        return;
      }

      setInputUrl(url);

      // Gửi message tới content script trên tab
      chrome.tabs.sendMessage(activeTab.id, { action: "SCAN_CURRENT_TAB" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          console.warn("Lỗi gọi content script:", chrome.runtime.lastError?.message);
          // Fallback: quét theo URL tab
          handleExecuteScan({ profileUrl: url });
        } else {
          const profileData = response.data;
          handleExecuteScan({
            profileUrl: profileData.profileUrl || url,
            avatarUrl: profileData.avatarUrl,
            name: profileData.name,
            joinedDate: profileData.joinedDate,
            platform: profileData.platform
          });
        }
      });
    });
  };

  // 2. Chạy dữ liệu mẫu an toàn (Mock 1)
  const handleTestSafeSample = () => {
    const safeData = {
      profileUrl: "https://www.facebook.com/nguyen.van.an.2018",
      name: "Nguyễn Văn An",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      joinedDate: "Tháng 4, 2018",
      platform: "facebook"
    };
    setInputUrl(safeData.profileUrl);
    handleExecuteScan(safeData);
  };

  // 3. Chạy dữ liệu mẫu lừa đảo (Mock 2)
  const handleTestScamSample = () => {
    const scamData = {
      profileUrl: "https://www.facebook.com/chuyengia.taichinh.vip.2026",
      name: "Trần Hoàng Nam (Chuyên Gia Đầu Tư 4.0)",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      joinedDate: "Tháng 10, 2026",
      platform: "facebook"
    };
    setInputUrl(scamData.profileUrl);
    handleExecuteScan(scamData);
  };

  // Reset về màn hình nhập liệu
  const handleReset = () => {
    setResult(null);
    setInputUrl("");
    setError("");
  };

  return (
    <div className="p-4 space-y-4">
      {/* KHỐI NHẬP LIỆU (Ẩn khi đang hiển thị kết quả) */}
      {!result && !loading && (
        <div className="space-y-3.5">
          {/* Ô nhập link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Nhập link Profile Facebook / Instagram:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://facebook.com/ten.nguoi.dung..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-9"
              />
              {inputUrl && (
                <button
                  onClick={() => setInputUrl("")}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Nút Kiểm tra và Quét Tab */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExecuteScan()}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow-md shadow-blue-600/20 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Kiểm Tra Ngay</span>
            </button>

            <button
              onClick={handleScanCurrentTab}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-lg text-xs transition-all"
            >
              <Scan className="w-4 h-4 text-indigo-400" />
              <span>Quét Tab Đang Mở</span>
            </button>
          </div>

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Mock Sample Tester (Yêu cầu đề bài) */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Thử nhanh kịch bản kiểm tra (Smart Mock):</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestSafeSample}
                className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                  <span>Nick Thật (An toàn)</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Tạo 2018, ảnh độc nhất</p>
              </button>

              <button
                onClick={handleTestScamSample}
                className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-rose-300 flex items-center justify-between">
                  <span>Nick Lừa Đảo (Mạo danh)</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Tạo 2026, ảnh trùng 8 nơi</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRẠNG THÁI LOADING / SCANNING ANIMATION */}
      {loading && (
        <div className="py-10 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-400 animate-spin" />
            <Shield className="w-8 h-8 text-blue-400 absolute" />
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-xs font-bold text-white tracking-wide">
              ĐANG QUÉT PROFILE & TÌM KIẾM ẢNH...
            </h4>
            <p className="text-[11px] text-blue-400 animate-pulse font-medium">
              {loadingStep}
            </p>
          </div>
        </div>
      )}

      {/* KẾT QUẢ PHÂN TÍCH PROFILE */}
      {result && !loading && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Nút quay lại / Quét tài khoản khác */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Quét tài khoản khác</span>
            </button>
            <span className="text-[10px] text-slate-500">
              Cập nhật lúc: {new Date().toLocaleTimeString("vi-VN")}
            </span>
          </div>

          {/* 1. Đồng hồ Thước đo Rủi ro (Risk Meter 0-100%) */}
          <RiskMeter
            score={result.riskAnalysis?.score}
            level={result.riskAnalysis?.level}
            verdict={result.riskAnalysis?.verdict}
          />

          {/* 2. Cảnh báo Giả mạo & Phân tích yếu tố (Alert Badge) */}
          <AlertBadge riskAnalysis={result.riskAnalysis} />

          {/* 3. Thẻ Thông tin Profile & Ngày tạo */}
          <AvatarCard profile={result.profile} />

          {/* 4. Danh sách Nguồn Ảnh Trùng Lặp (Reverse Image Matches) */}
          <DuplicateLinksList imageSearch={result.imageSearch} />
        </div>
      )}
    </div>
  );
}
