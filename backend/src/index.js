require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scanController = require("./controllers/scanController");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "*", // Cho phép Chrome Extension gọi API
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SocialScam Detector Backend",
    timestamp: new Date().toISOString(),
    mockMode: process.env.USE_MOCK_DATA === "true",
    hasSerpApiKey: Boolean(process.env.SERPAPI_KEY),
    hasGoogleVisionKey: Boolean(process.env.GOOGLE_VISION_API_KEY)
  });
});

// Routes
app.post("/api/analyze-profile", scanController.analyzeProfile);
app.get("/api/mock-samples", scanController.getMockSamples);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint không tồn tại. Vui lòng gọi /api/analyze-profile hoặc /api/health"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[ServerError]", err);
  res.status(500).json({
    status: "error",
    message: "Lỗi nội bộ hệ thống",
    details: err.message
  });
});

// Khởi chạy Server
app.listen(PORT, () => {
  console.log("====================================================");
  console.log(`🛡️  SocialScam Detector Backend đang chạy tại:`);
  console.log(`    Local: http://localhost:${PORT}`);
  console.log(`    Chế độ Mock: ${process.env.USE_MOCK_DATA === "true" ? "BẬT (USE_MOCK_DATA=true)" : "TẮT (Chế độ API thật)"}`);
  console.log(`    Health check: http://localhost:${PORT}/api/health`);
  console.log(`    API phân tích: POST http://localhost:${PORT}/api/analyze-profile`);
  console.log("====================================================");
});
