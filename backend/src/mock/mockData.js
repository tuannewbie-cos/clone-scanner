/**
 * Mock Data thông minh cho chế độ test offline
 * Cung cấp tài khoản mẫu an toàn và tài khoản giả mạo có ảnh trùng lặp
 */

const SAFE_PROFILE = {
  profileUrl: "https://www.facebook.com/nguyen.van.an.2018",
  platform: "facebook",
  name: "Nguyễn Văn An",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  joinedDate: "Tháng 4, 2018",
  accountAgeMonths: 102,
  imageSearch: {
    engine: "Smart Mock Mode (Safe Profile)",
    totalMatches: 0,
    isStockOrStolen: false,
    duplicates: []
  },
  riskAnalysis: {
    score: 12,
    level: "safe", // safe (0-30), warning (31-69), danger (70-100)
    verdict: "Tài khoản an toàn. Hoạt động lâu năm (trên 8 năm) và không tìm thấy ảnh đại diện bị trùng lặp trên Internet.",
    factors: [
      { code: "AGE_OLD", label: "Tài khoản lâu năm", description: "Đã tạo từ 2018 (hơn 8 năm hoạt động)", impact: "positive" },
      { code: "AVATAR_UNIQUE", label: "Ảnh đại diện độc nhất", description: "Không phát hiện bản sao trên các kho ảnh hoặc mạng xã hội khác", impact: "positive" },
      { code: "CLEAN_RECORD", label: "Lịch sử trong sạch", description: "Không có báo cáo lừa đảo trong hệ thống", impact: "positive" }
    ]
  }
};

const SCAM_PROFILE = {
  profileUrl: "https://www.facebook.com/chuyengia.taichinh.vip.2026",
  platform: "facebook",
  name: "Trần Hoàng Nam (Chuyên Gia Đầu Tư 4.0)",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  joinedDate: "Tháng 10, 2026",
  accountAgeMonths: 1,
  imageSearch: {
    engine: "Smart Mock Mode (Scam/Impersonation Sample)",
    totalMatches: 8,
    isStockOrStolen: true,
    duplicates: [
      {
        title: "Stock Photo - Handsome Young Businessman In Modern Office",
        link: "https://www.shutterstock.com/image-photo/handsome-young-businessman-suit-modern-office-portrait",
        source: "Shutterstock",
        snippet: "Ảnh người mẫu thương mại bản quyền ID: 291048123 - Tác giả: Studio Pro"
      },
      {
        title: "Gợi ý phong cách quý ông lịch lãm | Ghim trên Pinterest",
        link: "https://www.pinterest.com/pin/83724918239014234/",
        source: "Pinterest",
        snippet: "Bức ảnh được chia sẻ và ghim hơn 1.200 lần trên bảng thời trang nam Hàn Quốc"
      },
      {
        title: "Lê Văn Tuấn (Kéo Về Bờ Uy Tín) - Facebook Profile",
        link: "https://www.facebook.com/levantuan.keovebo.vip",
        source: "Facebook",
        snippet: "Một tài khoản Facebook khác cũng sử dụng chính xác ảnh đại diện này từ 2024"
      },
      {
        title: "Alexandre Moreau - Profil Professionnel VKontakte",
        link: "https://vk.com/id984120391",
        source: "VKontakte",
        snippet: "Tài khoản mạng xã hội nước ngoài sử dụng cùng avatar"
      },
      {
        title: "Avatar doanh nhân thành đạt tải miễn phí | Freepik",
        link: "https://www.freepik.com/free-photo/portrait-successful-businessman",
        source: "Freepik",
        snippet: "Kho ảnh miễn phí cho thiết kế đồ họa"
      }
    ]
  },
  riskAnalysis: {
    score: 88,
    level: "danger",
    verdict: "CẢNH BÁO: Có dấu hiệu giả mạo danh tính cá nhân!",
    factors: [
      { code: "AVATAR_STOLEN", label: "Ảnh đại diện trùng lặp nhiều nơi", description: "Ảnh đại diện trùng với ảnh mẫu trên Shutterstock, Pinterest và 2 tài khoản MXH khác", impact: "negative" },
      { code: "NEW_ACCOUNT", label: "Tài khoản vừa mới tạo", description: "Thời gian hoạt động chưa đầy 1 tháng (rất phổ biến ở nick lừa đảo)", impact: "negative" },
      { code: "SUSPICIOUS_KEYWORD", label: "Chứa từ khóa nhạy cảm", description: "Tên chứa cụm từ 'Chuyên Gia Đầu Tư' thường dùng để dụ dỗ tài chính", impact: "negative" }
    ]
  }
};

/**
 * Tạo mock linh hoạt dựa trên dữ liệu người dùng gửi lên
 */
function generateDynamicMock({ profileUrl = "", avatarUrl = "", name = "", joinedDate = "", platform = "facebook" }) {
  const lowerUrl = profileUrl.toLowerCase();
  const lowerName = name.toLowerCase();

  // Nhận diện dấu hiệu lừa đảo qua keyword nếu người dùng gõ link tùy ý
  const isSuspicious =
    lowerUrl.includes("scam") ||
    lowerUrl.includes("fake") ||
    lowerUrl.includes("clone") ||
    lowerUrl.includes("vip") ||
    lowerUrl.includes("invest") ||
    lowerUrl.includes("keovebo") ||
    lowerName.includes("chuyên gia") ||
    lowerName.includes("đầu tư") ||
    lowerName.includes("cskh") ||
    lowerName.includes("admin");

  if (isSuspicious || lowerUrl.includes("chuyengia")) {
    return {
      ...SCAM_PROFILE,
      profileUrl: profileUrl || SCAM_PROFILE.profileUrl,
      name: name || SCAM_PROFILE.name,
      avatarUrl: avatarUrl || SCAM_PROFILE.avatarUrl,
      joinedDate: joinedDate || "Mới tạo gần đây",
      platform
    };
  }

  // Mặc định trả về dữ liệu an toàn hoặc cảnh giác nhẹ tùy thuộc ngày tham gia
  const currentYear = new Date().getFullYear();
  let accountAgeMonths = 48; // ~4 năm
  let isRecent = false;

  if (joinedDate) {
    const matchYear = joinedDate.match(/20\d\d/);
    if (matchYear) {
      const year = parseInt(matchYear[0], 10);
      accountAgeMonths = Math.max(1, (currentYear - year) * 12);
      if (year >= currentYear - 1) {
        isRecent = true;
      }
    }
  }

  if (isRecent) {
    return {
      profileUrl,
      platform,
      name: name || "Tài khoản người dùng",
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      joinedDate: joinedDate || `Năm ${currentYear}`,
      accountAgeMonths,
      imageSearch: {
        engine: "Smart Mock Mode",
        totalMatches: 2,
        isStockOrStolen: false,
        duplicates: [
          {
            title: "Trang cá nhân Instagram tương đồng",
            link: "https://instagram.com/user_photo_gallery",
            source: "Instagram",
            snippet: "Hình ảnh tương tự được tìm thấy trên một tài khoản chia sẻ ảnh đời sống"
          }
        ]
      },
      riskAnalysis: {
        score: 48,
        level: "warning",
        verdict: "Cảnh giác: Tài khoản khá mới lập (dưới 1 năm), nên xác thực thêm trước khi giao dịch.",
        factors: [
          { code: "RECENT_ACCOUNT", label: "Tài khoản mới hoạt động", description: "Thời gian tạo chưa lâu", impact: "negative" },
          { code: "LOW_DUPLICATION", label: "Trùng ảnh nhẹ", description: "Phát hiện 1-2 liên kết tương đồng nhưng chưa đủ kết luận giả mạo", impact: "neutral" }
        ]
      }
    };
  }

  return {
    ...SAFE_PROFILE,
    profileUrl: profileUrl || SAFE_PROFILE.profileUrl,
    name: name || SAFE_PROFILE.name,
    avatarUrl: avatarUrl || SAFE_PROFILE.avatarUrl,
    joinedDate: joinedDate || SAFE_PROFILE.joinedDate,
    platform
  };
}

module.exports = {
  SAFE_PROFILE,
  SCAM_PROFILE,
  generateDynamicMock
};
