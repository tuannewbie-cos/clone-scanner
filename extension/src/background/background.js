/**
 * SocialScam Detector - Background Service Worker (Manifest V3)
 * Xử lý Context Menu khi click chuột phải hoặc bôi đen link Facebook/Instagram
 */

// Đăng ký Context Menu khi cài đặt extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "socialscam-context-scan",
    title: "🔍 Kiểm tra lừa đảo với SocialScam",
    contexts: ["link", "selection", "page"]
  });

  console.log("[SocialScam Background] Service Worker đã khởi chạy & đăng ký Context Menu.");
});

// Xử lý sự kiện click Context Menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "socialscam-context-scan") {
    let targetUrl = info.linkUrl || info.selectionText || info.pageUrl || "";
    targetUrl = targetUrl.trim();

    // Làm sạch text nếu là selection
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://") || targetUrl.includes("facebook.com") || targetUrl.includes("instagram.com")) {
      // Lưu vào storage để khi popup mở lên sẽ tự động điền và quét ngay
      chrome.storage.local.set({
        pendingScanUrl: targetUrl,
        pendingTimestamp: Date.now(),
        source: "context-menu"
      }, () => {
        // Đặt badge thông báo để người dùng chú ý mở extension
        chrome.action.setBadgeText({ text: "SCAN" });
        chrome.action.setBadgeBackgroundColor({ color: "#EF4444" });
        console.log("[SocialScam Background] Đã lưu URL từ Context Menu vào storage:", targetUrl);
      });
    } else {
      console.warn("[SocialScam Background] Chuỗi được chọn không phải là link hợp lệ:", targetUrl);
    }
  }
});

// Lắng nghe message từ popup hoặc content script nếu cần điều phối
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CLEAR_PENDING_SCAN") {
    chrome.storage.local.remove(["pendingScanUrl", "pendingTimestamp"]);
    chrome.action.setBadgeText({ text: "" });
    sendResponse({ success: true });
  }
  return true;
});
