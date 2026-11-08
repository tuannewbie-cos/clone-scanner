const axios = require("axios");
const { generateDynamicMock, SAFE_PROFILE, SCAM_PROFILE } = require("../mock/mockData");

/**
 * Phân tích tìm kiếm ảnh ngược (Reverse Image Search)
 * Tích hợp SerpAPI (Google Reverse Image), Google Cloud Vision API hoặc Smart Mock Mode
 */
class ReverseImageService {
  constructor() {
    this.useMock = process.env.USE_MOCK_DATA === "true";
    this.serpApiKey = process.env.SERPAPI_KEY;
    this.googleVisionKey = process.env.GOOGLE_VISION_API_KEY;
  }

  /**
   * Thực thi tìm kiếm ngược ảnh đại diện
   * @param {Object} params
   * @param {string} params.avatarUrl
   * @param {string} params.profileUrl
   * @param {string} params.name
   * @param {string} params.joinedDate
   * @param {string} params.platform
   */
  async search({ avatarUrl, profileUrl, name, joinedDate, platform }) {
    // 1. Chế độ Mock dữ liệu thông minh
    if (this.useMock || (!this.serpApiKey && !this.googleVisionKey)) {
      return this.handleMockSearch({ avatarUrl, profileUrl, name, joinedDate, platform });
    }

    // 2. Chế độ gọi SerpAPI thật
    if (this.serpApiKey && avatarUrl) {
      try {
        return await this.searchViaSerpApi(avatarUrl);
      } catch (err) {
        console.warn("[ReverseImageService] Lỗi khi gọi SerpAPI, fallback về Smart Mock:", err.message);
        return this.handleMockSearch({ avatarUrl, profileUrl, name, joinedDate, platform });
      }
    }

    // 3. Chế độ gọi Google Cloud Vision API thật
    if (this.googleVisionKey && avatarUrl) {
      try {
        return await this.searchViaGoogleVision(avatarUrl);
      } catch (err) {
        console.warn("[ReverseImageService] Lỗi khi gọi Google Vision, fallback về Smart Mock:", err.message);
        return this.handleMockSearch({ avatarUrl, profileUrl, name, joinedDate, platform });
      }
    }

    return this.handleMockSearch({ avatarUrl, profileUrl, name, joinedDate, platform });
  }

  /**
   * Xử lý mock thông minh
   */
  handleMockSearch({ avatarUrl, profileUrl, name, joinedDate, platform }) {
    // Nếu URL trùng trực tiếp với mẫu test SCAM
    if (profileUrl && profileUrl.includes("chuyengia.taichinh.vip")) {
      return {
        engine: SCAM_PROFILE.imageSearch.engine,
        totalMatches: SCAM_PROFILE.imageSearch.totalMatches,
        isStockOrStolen: SCAM_PROFILE.imageSearch.isStockOrStolen,
        duplicates: SCAM_PROFILE.imageSearch.duplicates
      };
    }

    // Nếu URL trùng trực tiếp với mẫu test SAFE
    if (profileUrl && profileUrl.includes("nguyen.van.an.2018")) {
      return {
        engine: SAFE_PROFILE.imageSearch.engine,
        totalMatches: SAFE_PROFILE.imageSearch.totalMatches,
        isStockOrStolen: SAFE_PROFILE.imageSearch.isStockOrStolen,
        duplicates: SAFE_PROFILE.imageSearch.duplicates
      };
    }

    const dynamic = generateDynamicMock({ avatarUrl, profileUrl, name, joinedDate, platform });
    return dynamic.imageSearch;
  }

  /**
   * Gọi SerpAPI Google Reverse Image
   */
  async searchViaSerpApi(imageUrl) {
    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_reverse_image",
        image_url: imageUrl,
        api_key: this.serpApiKey
      },
      timeout: 10000
    });

    const data = res.data;
    const imageResults = data.image_results || [];
    const visualMatches = data.visual_matches || [];
    const allMatches = [...imageResults, ...visualMatches];

    const duplicates = allMatches.slice(0, 10).map((item) => {
      let domain = "Web";
      try {
        const parsed = new URL(item.link);
        domain = parsed.hostname.replace("www.", "");
      } catch (e) {
        // fallback
      }

      return {
        title: item.title || "Trang chứa ảnh tương đồng",
        link: item.link || "#",
        source: item.source || domain,
        snippet: item.snippet || item.snippet_highlighted_words?.join(", ") || "Phát hiện hình ảnh trùng khớp"
      };
    });

    const isStockOrStolen = duplicates.some((d) => {
      const src = d.source.toLowerCase() + " " + d.link.toLowerCase();
      return (
        src.includes("shutterstock") ||
        src.includes("pinterest") ||
        src.includes("freepik") ||
        src.includes("gettyimages") ||
        src.includes("unsplash") ||
        src.includes("istock")
      );
    });

    return {
      engine: "SerpAPI (Google Reverse Image)",
      totalMatches: duplicates.length,
      isStockOrStolen: isStockOrStolen || duplicates.length >= 4,
      duplicates
    };
  }

  /**
   * Gọi Google Cloud Vision API (Web Detection)
   */
  async searchViaGoogleVision(imageUrl) {
    const res = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${this.googleVisionKey}`,
      {
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [{ type: "WEB_DETECTION", maxResults: 15 }]
          }
        ]
      },
      { timeout: 10000 }
    );

    const webDetection = res.data.responses?.[0]?.webDetection || {};
    const pagesWithImages = webDetection.pagesWithMatchingImages || [];
    const fullMatches = webDetection.fullMatchingImages || [];

    const duplicates = pagesWithImages.slice(0, 8).map((p) => {
      let domain = "Web";
      try {
        domain = new URL(p.url).hostname.replace("www.", "");
      } catch (e) {}
      return {
        title: p.pageTitle || "Trang web chứa hình ảnh tương đồng",
        link: p.url,
        source: domain,
        snippet: `Khớp độ tương đồng cao qua Google Vision Web Detection`
      };
    });

    return {
      engine: "Google Cloud Vision API",
      totalMatches: duplicates.length + fullMatches.length,
      isStockOrStolen: duplicates.length >= 3,
      duplicates
    };
  }
}

module.exports = new ReverseImageService();
