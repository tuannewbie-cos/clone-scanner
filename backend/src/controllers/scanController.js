const reverseImageService = require("../services/reverseImageService");
const riskEngine = require("../services/riskEngine");
const { SAFE_PROFILE, SCAM_PROFILE } = require("../mock/mockData");

/**
 * Phân tích profile mạng xã hội và tính toán rủi ro lừa đảo
 */
exports.analyzeProfile = async (req, res) => {
  try {
    const {
      profileUrl = "",
      avatarUrl = "",
      name = "",
      joinedDate = "",
      platform = "facebook",
      accountAgeMonths
    } = req.body;

    if (!profileUrl && !avatarUrl) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng cung cấp ít nhất profileUrl hoặc avatarUrl để tiến hành phân tích."
      });
    }

    // Nhận diện nền tảng
    let detectedPlatform = platform;
    const lowerUrl = profileUrl.toLowerCase();
    if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) {
      detectedPlatform = "facebook";
    } else if (lowerUrl.includes("instagram.com") || lowerUrl.includes("instagr.am")) {
      detectedPlatform = "instagram";
    }

    // 1. Thực hiện tìm kiếm ảnh ngược (SerpAPI / Google Vision / Smart Mock)
    const imageSearch = await reverseImageService.search({
      avatarUrl,
      profileUrl,
      name,
      joinedDate,
      platform: detectedPlatform
    });

    // 2. Chấm điểm rủi ro qua RiskEngine
    const riskAnalysis = riskEngine.evaluate({
      name,
      profileUrl,
      joinedDate,
      accountAgeMonths,
      imageSearch
    });

    return res.json({
      status: "success",
      data: {
        profile: {
          profileUrl,
          avatarUrl: avatarUrl || (imageSearch.duplicates?.[0]?.link ? avatarUrl : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"),
          name: name || (detectedPlatform === "facebook" ? "Tài khoản Facebook" : "Tài khoản Instagram"),
          joinedDate: joinedDate || "Không công khai",
          platform: detectedPlatform
        },
        imageSearch,
        riskAnalysis
      }
    });
  } catch (error) {
    console.error("[ScanController] Lỗi phân tích profile:", error);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi trong quá trình phân tích hồ sơ. Vui lòng thử lại sau.",
      details: error.message
    });
  }
};

/**
 * Trả về 2 bộ dữ liệu mẫu (Safe và Scam) để Extension test ngay lập tức
 */
exports.getMockSamples = (req, res) => {
  res.json({
    status: "success",
    samples: {
      safe: SAFE_PROFILE,
      scam: SCAM_PROFILE
    }
  });
};
