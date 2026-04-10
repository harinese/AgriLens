# 🌿 AgriLens — AI-Powered Farming Companion

AgriLens is a full-stack web application that helps farmers detect crop diseases, get treatment recommendations, plan irrigation schedules, and access comprehensive crop growing guides — all powered by Google Gemini AI.

## ✨ Features

### 📷 Crop Scanner
- Upload or capture crop photos directly from your phone
- AI analyzes images to detect diseases with severity levels
- Get detailed treatment plans with specific pesticide dosages
- Organic alternatives and fertilizer suggestions
- Download reports as PDF or image

### 🌤️ Weather & Irrigation Planner
- Auto-detect location for accurate weather data
- 7-day weather forecast (temperature, precipitation, wind, UV)
- AI-generated daily irrigation schedules
- Pesticide spray window recommendations
- Heat stress alerts and weather warnings

### 📚 Crop Encyclopedia
- Browse 24+ common crops by category
- AI-generated comprehensive crop profiles
- Growing season, soil requirements, common diseases
- Companion planting suggestions and care tips

### 🏠 Dashboard
- Live agriculture news feed
- Today's weather at a glance
- Season detection
- Daily farming tips

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 1.5 Flash (Vision) |
| Weather | Open-Meteo API (free, no key) |
| News | GNews API |
| Geolocation | Browser Navigator API |
| PDF Export | html2canvas + jsPDF |

## 🚀 Setup

### 1. Clone & Install

```bash
cd agrilens
npm install
```

### 2. Configure Environment Variables

Copy the example env file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
# Get from https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Get from https://gnews.io/
VITE_GNEWS_API_KEY=your_gnews_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
agrilens/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CropReport.jsx      # Scan result report card + PDF/image export
│   │   ├── ImageUploader.jsx    # Drag-drop + camera upload
│   │   ├── IrrigationDay.jsx    # Daily irrigation planner card
│   │   ├── Navbar.jsx           # Responsive nav (top + bottom tab bar)
│   │   ├── NewsCard.jsx         # Agriculture news card
│   │   ├── OfflineBanner.jsx    # Offline connectivity banner
│   │   ├── Skeletons.jsx        # Loading skeleton components
│   │   └── WeatherCard.jsx      # Individual weather day card
│   ├── pages/
│   │   ├── HomePage.jsx         # Dashboard with hero, news, stats
│   │   ├── ScannerPage.jsx      # Crop disease scanner
│   │   ├── WeatherPage.jsx      # Weather forecast + irrigation
│   │   └── EncyclopediaPage.jsx # Searchable crop encyclopedia
│   ├── services/
│   │   ├── geminiApi.js         # Gemini API calls (scan, irrigation, profiles)
│   │   ├── newsApi.js           # GNews API with fallback data
│   │   └── weatherApi.js        # Open-Meteo API + geolocation
│   ├── App.jsx                  # Root with routing
│   ├── index.css                # Tailwind + design system
│   └── main.jsx                 # Entry point
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 API Keys

| API | How to Get | Required? |
|-----|-----------|-----------|
| Google Gemini | [AI Studio](https://aistudio.google.com/apikey) | ✅ Yes (core feature) |
| GNews | [gnews.io](https://gnews.io/) | Optional (has fallback) |
| Open-Meteo | No key needed | ✅ Free |

## 📱 Mobile-First Design

AgriLens is designed with farmers in mind:
- Bottom tab navigation on mobile
- Camera capture support for in-field use
- Touch-friendly buttons and cards
- Offline detection with friendly messaging
- Report sharing via native share API

## 📄 License

MIT
