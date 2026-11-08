/**
 * Tiện ích tương tác với chrome.storage.local
 * Có cơ chế fallback an toàn khi chạy test ở môi trường trình duyệt thông thường (npm run dev)
 */

export const isChromeExtension = () => {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
};

export const getPendingScan = () => {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      const stored = localStorage.getItem("socialscam_pending_scan");
      resolve(stored ? JSON.parse(stored) : null);
      return;
    }

    chrome.storage.local.get(["pendingScanUrl", "pendingTimestamp"], (result) => {
      if (result.pendingScanUrl) {
        resolve({
          url: result.pendingScanUrl,
          timestamp: result.pendingTimestamp
        });
      } else {
        resolve(null);
      }
    });
  });
};

export const clearPendingScan = () => {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      localStorage.removeItem("socialscam_pending_scan");
      resolve();
      return;
    }

    chrome.storage.local.remove(["pendingScanUrl", "pendingTimestamp"], () => {
      if (chrome.action?.setBadgeText) {
        chrome.action.setBadgeText({ text: "" });
      }
      resolve();
    });
  });
};

export const saveScanHistory = (scanResult) => {
  return new Promise((resolve) => {
    const historyItem = {
      id: Date.now(),
      name: scanResult.data?.profile?.name || "Profile",
      url: scanResult.data?.profile?.profileUrl || "",
      score: scanResult.data?.riskAnalysis?.score || 0,
      level: scanResult.data?.riskAnalysis?.level || "safe",
      date: new Date().toLocaleDateString("vi-VN")
    };

    if (!isChromeExtension()) {
      const raw = localStorage.getItem("socialscam_history") || "[]";
      const list = JSON.parse(raw);
      list.unshift(historyItem);
      localStorage.setItem("socialscam_history", JSON.stringify(list.slice(0, 10)));
      resolve();
      return;
    }

    chrome.storage.local.get(["scanHistory"], (result) => {
      const list = result.scanHistory || [];
      list.unshift(historyItem);
      chrome.storage.local.set({ scanHistory: list.slice(0, 10) }, resolve);
    });
  });
};

export const getScanHistory = () => {
  return new Promise((resolve) => {
    if (!isChromeExtension()) {
      const raw = localStorage.getItem("socialscam_history") || "[]";
      resolve(JSON.parse(raw));
      return;
    }

    chrome.storage.local.get(["scanHistory"], (result) => {
      resolve(result.scanHistory || []);
    });
  });
};
