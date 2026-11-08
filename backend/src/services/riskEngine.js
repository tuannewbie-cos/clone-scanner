/**
 * Risk Assessment Engine
 * Tính toán điểm rủi ro lừa đảo (0 - 100%) dựa trên:
 * 1. Số lượng và nguồn ảnh đại diện trùng lặp trên mạng (Reverse Image Search)
 * 2. Thời gian tạo tài khoản (Account Creation / Joined Date)
 * 3. Các từ khóa khả nghi thường xuất hiện trong các kịch bản lừa đảo tài chính / mạo danh
 */
class RiskEngine {
  /**
   * Tính toán điểm số và xếp loại rủi ro
   * @param {Object} data
   * @param {string} data.name - Tên hiển thị của profile
   * @param {string} data.profileUrl - Link trang cá nhân
   * @param {string} data.joinedDate - Thông tin ngày tham gia / bài viết đầu
   * @param {number} [data.accountAgeMonths] - Tuổi tài khoản tính theo tháng (nếu có)
   * @param {Object} data.imageSearch - Kết quả từ ReverseImageService
   */
  evaluate({ name = "", profileUrl = "", joinedDate = "", accountAgeMonths, imageSearch = {} }) {
    let score = 0;
    const factors = [];

    const totalMatches = imageSearch.totalMatches || 0;
    const isStockOrStolen = Boolean(imageSearch.isStockOrStolen);
    const duplicates = imageSearch.duplicates || [];

    // ==========================================
    // 1. Phân tích ảnh đại diện (Tối đa 55 điểm)
    // ==========================================
    if (isStockOrStolen || totalMatches >= 5) {
      score += 48;
      factors.push({
        code: "AVATAR_MULTI_MATCH",
        label: "Ảnh đại diện bị đánh cắp / Ảnh mẫu quảng cáo",
        description: `Tìm thấy ${totalMatches} nguồn trùng lặp trên Pinterest/kho ảnh hoặc tài khoản khác`,
        impact: "negative",
        scoreWeight: +48
      });
    } else if (totalMatches >= 2) {
      score += 25;
      factors.push({
        code: "AVATAR_MODERATE_MATCH",
        label: "Ảnh đại diện có dấu hiệu trùng lặp",
        description: `Tìm thấy ${totalMatches} kết quả tương đồng trên web`,
        impact: "negative",
        scoreWeight: +25
      });
    } else if (totalMatches === 0) {
      score -= 10;
      factors.push({
        code: "AVATAR_UNIQUE",
        label: "Ảnh đại diện độc nhất",
        description: "Không phát hiện bản sao ảnh này trên các trang web khác",
        impact: "positive",
        scoreWeight: -10
      });
    }

    // ==========================================
    // 2. Phân tích Ngày tạo tài khoản (Tối đa 35 điểm)
    // ==========================================
    const currentYear = new Date().getFullYear();
    let ageInMonths = accountAgeMonths;

    if (ageInMonths === undefined || ageInMonths === null) {
      if (joinedDate) {
        const yearMatch = joinedDate.match(/20\d\d/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0], 10);
          ageInMonths = Math.max(1, (currentYear - year) * 12);
        }
      }
    }

    if (ageInMonths !== undefined && ageInMonths !== null) {
      if (ageInMonths <= 2) {
        // Tài khoản mới tạo trong 2 tháng gần đây
        score += 35;
        factors.push({
          code: "ACCOUNT_VERY_NEW",
          label: "Tài khoản vừa tạo gần đây",
          description: `Tài khoản chỉ mới hoạt động khoảng ${ageInMonths} tháng (dấu hiệu phổ biến của nick clone)`,
          impact: "negative",
          scoreWeight: +35
        });
      } else if (ageInMonths <= 8) {
        score += 20;
        factors.push({
          code: "ACCOUNT_NEW",
          label: "Tài khoản tương đối mới",
          description: `Thời gian hoạt động dưới 8 tháng`,
          impact: "negative",
          scoreWeight: +20
        });
      } else if (ageInMonths >= 36) {
        // Trên 3 năm hoạt động
        score -= 15;
        factors.push({
          code: "ACCOUNT_MATURE",
          label: "Tài khoản lâu năm",
          description: `Đã hoạt động trên ${Math.floor(ageInMonths / 12)} năm`,
          impact: "positive",
          scoreWeight: -15
        });
      }
    } else {
      // Ẩn thông tin ngày tham gia
      score += 12;
      factors.push({
        code: "ACCOUNT_DATE_HIDDEN",
        label: "Ẩn ngày tham gia",
        description: "Không thể xác định công khai ngày tạo tài khoản",
        impact: "neutral",
        scoreWeight: +12
      });
    }

    // ==========================================
    // 3. Phân tích từ khóa khả nghi (Tối đa 20 điểm)
    // ==========================================
    const textToCheck = `${name} ${profileUrl}`.toLowerCase();
    const suspiciousKeywords = [
      "chuyên gia",
      "đầu tư",
      "kéo về bờ",
      "tài chính 4.0",
      "cskh",
      "hỗ trợ 24/7",
      "thu hồi vốn",
      "nhận việc online",
      "admin",
      "vip"
    ];

    const detectedKeywords = suspiciousKeywords.filter((kw) => textToCheck.includes(kw));
    if (detectedKeywords.length > 0) {
      score += 18;
      factors.push({
        code: "SUSPICIOUS_KEYWORD",
        label: "Tên / URL chứa từ khóa nhạy cảm",
        description: `Phát hiện cụm từ đáng ngờ: "${detectedKeywords.join('", "')}"`,
        impact: "negative",
        scoreWeight: +18
      });
    }

    // ==========================================
    // 4. Chuẩn hóa thang điểm 0 - 100
    // ==========================================
    let finalScore = Math.min(100, Math.max(5, score));

    // Nếu vừa trùng ảnh ăn cắp vừa là nick mới tạo -> đẩy lên ít nhất 75
    if (isStockOrStolen && (ageInMonths === undefined || ageInMonths <= 6)) {
      finalScore = Math.max(finalScore, 78);
    }

    // Nếu không trùng ảnh và tài khoản > 3 năm -> tối đa 25
    if (totalMatches === 0 && ageInMonths && ageInMonths >= 36) {
      finalScore = Math.min(finalScore, 20);
    }

    // Phân loại mức độ rủi ro theo yêu cầu
    let level = "safe";
    let verdict = "Tài khoản an toàn. Hoạt động bình thường, không phát hiện dấu hiệu giả mạo.";

    if (finalScore >= 70) {
      level = "danger";
      verdict = "CẢNH BÁO: Có dấu hiệu giả mạo danh tính cá nhân!";
    } else if (finalScore >= 31) {
      level = "warning";
      verdict = "Cảnh giác: Tài khoản có một số điểm đáng ngờ, nên kiểm tra kỹ trước khi giao dịch chuyển tiền.";
    }

    return {
      score: finalScore,
      level,
      verdict,
      factors,
      calculatedAt: new Date().toISOString()
    };
  }
}

module.exports = new RiskEngine();
