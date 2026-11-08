/**
 * SocialScam Detector - Content Script
 * Bóc tách DOM trên tab Facebook/Instagram đang mở để lấy:
 * 1. URL Avatar chất lượng cao
 * 2. Tên hiển thị tài khoản
 * 3. Ngày tham gia / thông tin tài khoản
 */

(function () {
  console.log("[SocialScam Content Script] Đã sẵn sàng trên trang:", window.location.hostname);

  // Lắng nghe lệnh từ Popup React
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCAN_CURRENT_TAB") {
      try {
        const result = extractCurrentProfileInfo();
        sendResponse({ success: true, data: result });
      } catch (err) {
        console.error("[SocialScam Content Script] Lỗi bóc tách DOM:", err);
        sendResponse({ success: false, error: err.message });
      }
    }
    return true; // Giữ kết nối asynchronous
  });

  /**
   * Bóc tách thông tin profile từ DOM hiện tại
   */
  function extractCurrentProfileInfo() {
    const host = window.location.hostname;
    const url = window.location.href;

    if (host.includes("facebook.com")) {
      return extractFacebookProfile(url);
    } else if (host.includes("instagram.com")) {
      return extractInstagramProfile(url);
    } else {
      return {
        platform: "general",
        profileUrl: url,
        name: document.title || "Trang web",
        avatarUrl: getMetaContent("og:image") || "",
        joinedDate: "Không xác định (Không phải FB/IG)"
      };
    }
  }

  /**
   * Trích xuất thông tin trên Facebook
   */
  function extractFacebookProfile(url) {
    // 1. Tên hiển thị
    let name = "";
    const h1Elem = document.querySelector("h1");
    if (h1Elem && h1Elem.textContent.trim()) {
      name = h1Elem.textContent.trim();
    } else {
      const ogTitle = getMetaContent("og:title");
      if (ogTitle) {
        name = ogTitle.split("|")[0].split("-")[0].trim();
      } else {
        name = document.title.split("|")[0].split("-")[0].trim();
      }
    }

    // 2. Avatar URL
    let avatarUrl = "";
    // Facebook thường để avatar trong svg image hoặc thẻ img có aria-label/alt
    const svgImages = document.querySelectorAll('svg image, img[role="img"]');
    for (const img of svgImages) {
      const href = img.getAttribute("xlink:href") || img.getAttribute("href") || img.getAttribute("src");
      if (href && (href.includes("scontent") || href.includes("fbcdn"))) {
        avatarUrl = href;
        break;
      }
    }

    if (!avatarUrl) {
      const avatarCandidate = document.querySelector('img[alt*="avatar" i], img[alt*="ảnh đại diện" i], img[alt*="profile" i]');
      if (avatarCandidate && avatarCandidate.src) {
        avatarUrl = avatarCandidate.src;
      }
    }

    // Fallback: og:image
    if (!avatarUrl) {
      avatarUrl = getMetaContent("og:image") || "";
    }

    // 3. Ngày tham gia (Joined date)
    let joinedDate = "";
    const pageText = document.body.innerText || "";
    
    // Tìm cụm từ "Tham gia vào tháng..." hoặc "Joined..."
    const joinedMatch = pageText.match(/(?:Tham gia vào|Đã tham gia|Joined)\s+([A-Za-z0-9\s,]+(?:20\d\d))/i);
    if (joinedMatch) {
      joinedDate = joinedMatch[0].trim();
    } else {
      // Tìm năm tạo trang/profile nếu có
      const yearMatch = pageText.match(/(?:tháng\s+\d+\s+năm\s+20\d\d|năm\s+20\d\d)/i);
      if (yearMatch) {
        joinedDate = yearMatch[0].trim();
      } else {
        joinedDate = "Không tìm thấy ngày tham gia công khai";
      }
    }

    return {
      platform: "facebook",
      profileUrl: url,
      name: name || "Tài khoản Facebook",
      avatarUrl,
      joinedDate
    };
  }

  /**
   * Trích xuất thông tin trên Instagram
   */
  function extractInstagramProfile(url) {
    let name = "";
    const headerTitle = document.querySelector("header h2") || document.querySelector("header h1");
    if (headerTitle) {
      name = headerTitle.textContent.trim();
    } else {
      name = getMetaContent("og:title") || document.title;
    }

    let avatarUrl = "";
    const headerImg = document.querySelector("header img");
    if (headerImg && headerImg.src) {
      avatarUrl = headerImg.src;
    } else {
      avatarUrl = getMetaContent("og:image") || "";
    }

    return {
      platform: "instagram",
      profileUrl: url,
      name: name || "Tài khoản Instagram",
      avatarUrl,
      joinedDate: "Xem xét theo số bài viết và tương tác"
    };
  }

  function getMetaContent(property) {
    const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    return meta ? meta.getAttribute("content") : "";
  }
})();
