# 🛡️ SocialScam Detector - Chrome Extension & Backend API

> **SocialScam Detector** là giải pháp tiện ích mở rộng trên trình duyệt Chrome (Manifest V3) kết hợp Backend Node.js giúp người dùng phòng chống lừa đảo, phát hiện tài khoản mạo danh trên Facebook & Instagram thông qua kỹ thuật **tìm kiếm ngược ảnh đại diện (Reverse Image Search)** và **phân tích lịch sử ngày tạo tài khoản**.

---

## 🚀 Tính năng Nổi bật (Core Features)

1. **3 Luồng kiểm tra linh hoạt:**
   - **Dán link trực tiếp:** Nhập URL trang cá nhân Facebook hoặc Instagram vào Popup và ấn *Kiểm tra*.
   - **Quét nhanh Tab hiện tại:** Bấm nút *"Quét Tab Đang Mở"*, Content Script sẽ tự động bóc tách Avatar HD, Tên hiển thị và Ngày tham gia từ DOM Facebook/Instagram.
   - **Context Menu:** Bôi đen link hoặc click chuột phải vào liên kết $\rightarrow$ Chọn *"Kiểm tra lừa đảo với SocialScam"* để gửi thẳng vào tiện ích.
2. **Hệ thống Đánh giá Rủi ro (Scam Risk Engine 0 - 100%):**
   - **0 - 30% (An toàn - Xanh lá):** Tài khoản hoạt động lâu năm, ảnh đại diện độc nhất không bị trùng lặp.
   - **31 - 69% (Cảnh giác - Vàng):** Tài khoản mới tạo hoặc ẩn ngày tham gia, có yếu tố nghi vấn.
   - **70 - 100% (Nguy cơ Giả mạo Cao - Đỏ):** Tài khoản mới lập + Ảnh đại diện ăn cắp từ Pinterest/Shutterstock/Tài khoản khác $\rightarrow$ Bật cảnh báo lớn: `CẢNH BÁO: Có dấu hiệu giả mạo danh tính cá nhân!`.
3. **Smart Mock Mode:**
   - Tích hợp sẵn dữ liệu mẫu (`USE_MOCK_DATA=true`) kèm nút thử nhanh 1-click cho cả **Nick An toàn** và **Nick Lừa đảo**, giúp kiểm thử giao diện ngay mà chưa cần gắn API Key thật của SerpAPI hay Google Vision.
4. **Kiến trúc Modular mở rộng (Scalable Architecture):**
   - Đã dựng sẵn module `src/features/blacklist/` (Kho dữ liệu Đen) cho Giai đoạn 2: tra cứu SĐT, Số tài khoản ngân hàng và Link phishing lừa đảo do cộng đồng đóng góp.

---

## 📂 Cấu trúc Thư mục Dự án

```text
socialscam-detector/
├── .gitignore
├── README.md
├── backend/                           # Node.js + Express API
│   ├── .env                           # Cấu hình PORT, USE_MOCK_DATA, API Key
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js                   # Express server & Middleware
│       ├── controllers/
│       │   └── scanController.js      # Controller xử lý /api/analyze-profile
│       ├── services/
│       │   ├── reverseImageService.js # SerpAPI / Google Vision / Smart Mock
│       │   └── riskEngine.js          # Thuật toán tính điểm rủi ro (0-100%)
│       └── mock/
│           └── mockData.js            # Dữ liệu mẫu nick Thật vs nick Giả mạo
└── extension/                         # Chrome Extension (Manifest V3)
    ├── package.json
    ├── vite.config.js                 # Multi-entry build (popup, background, content)
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html                     # Giao diện Popup Extension
    ├── manifest.json
    ├── public/
    │   ├── manifest.json
    │   └── icons/                     # Icon 16, 48, 128
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── background/
        │   └── background.js          # Service Worker xử lý Context Menu
        ├── content/
        │   └── content.js             # Content Script bóc tách DOM Facebook/IG
        ├── components/                # UI Components tái sử dụng
        │   ├── Navbar.jsx             # Thanh điều hướng & trạng thái Backend
        │   ├── RiskMeter.jsx          # Đồng hồ đo điểm rủi ro 0-100%
        │   ├── AvatarCard.jsx         # Card hiển thị Avatar & Ngày tham gia
        │   ├── DuplicateLinksList.jsx # Danh sách liên kết ảnh trùng lặp
        │   └── AlertBadge.jsx         # Banner cảnh báo giả mạo đỏ rực
        ├── features/
        │   ├── profile-scanner/       # Module quét trang cá nhân (Core)
        │   └── blacklist/             # Module Kho dữ liệu đen (Giai đoạn 2)
        └── utils/
            └── chromeStorage.js       # Quản lý chrome.storage.local
```

---

## 🛠️ Hướng dẫn Cài đặt & Vận hành

### 1. Khởi động Backend API (`/backend`)

1. Mở Terminal và di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Cấu hình file `.env` (Backend đã được bật sẵn chế độ mock thông minh):
   ```ini
   PORT=5001
   USE_MOCK_DATA=true
   SERPAPI_KEY=
   GOOGLE_VISION_API_KEY=
   ```
   *(Nếu bạn có API Key của [SerpAPI](https://serpapi.com/) hoặc Google Cloud Vision, có thể điền vào và đổi `USE_MOCK_DATA=false`)*.

4. Khởi chạy Backend Server:
   ```bash
   npm run dev
   # Hoặc: npm start
   ```
   Server sẽ lắng nghe tại `http://localhost:5001`. Bạn có thể truy cập `http://localhost:5001/api/health` để kiểm tra.

---

### 2. Build và Cài đặt Chrome Extension (`/extension`)

1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục `extension`:
   ```bash
   cd extension
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy lệnh đóng gói (Build) Extension:
   ```bash
   npm run build
   ```
   Lệnh này sẽ biên dịch React + TailwindCSS thành mã tối ưu bên trong thư mục `extension/dist/`.

4. **Nạp Extension vào Google Chrome:**
   - Mở trình duyệt Google Chrome hoặc Cốc Cốc, truy cập đường dẫn:
     ```text
     chrome://extensions/
     ```
   - Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
   - Bấm vào nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
   - Chọn đường dẫn tới thư mục `extension/dist` trong dự án của bạn.
   - Ghim biểu tượng **SocialScam Detector** lên thanh công cụ của Chrome để sử dụng.

---

## 🧪 Cách Thử Nghiệm Nhanh

1. **Thử bằng Nút Mẫu (1 Click):**
   - Bấm vào icon Extension trên Chrome.
   - Ở mục *"Thử nhanh kịch bản kiểm tra (Smart Mock)"*, bấm **Nick Thật (An toàn)** để xem giao diện tài khoản uy tín (điểm 12%, xanh lá).
   - Bấm **Nick Lừa Đảo (Mạo danh)** để xem giao diện cảnh báo tài khoản giả mạo (điểm 88%, banner đỏ cảnh báo lừa đảo kèm 8 nguồn ảnh bị trùng trên Shutterstock/Pinterest).
2. **Thử Quét Tab Trực Tiếp:**
   - Mở một tab Facebook hoặc Instagram cá nhân bất kỳ.
   - Mở Extension và bấm nút **"Quét Tab Đang Mở"**.
3. **Thử Chuột Phải (Context Menu):**
   - Click chuột phải vào một liên kết profile Facebook $\rightarrow$ Chọn **"🔍 Kiểm tra lừa đảo với SocialScam"**.
   - Mở Extension lên, hệ thống sẽ tự động điền URL và tiến hành phân tích.



## 🔒 Bản quyền & Giấy phép
Dự án được phát hành dưới giấy phép **MIT License**. Mọi đóng góp cho cộng đồng an ninh mạng và bảo vệ người dùng trước các hình thức lừa đảo trên không gian mạng đều được hoan nghênh!
