# KrishiMitra - Product Overview

## Project Purpose
KrishiMitra (कृषिमित्र - "Farming Friend") is an AI-powered web application designed to empower Indian farmers, particularly in rural Maharashtra, with real-time agricultural intelligence and decision-making tools. The platform bridges the information gap that forces farmers to rely on middlemen and provides data-driven insights for better farming outcomes.

## Value Proposition
- **Real-time Market Intelligence**: Access to live mandi (market) prices from government APIs, eliminating dependency on intermediaries
- **AI-Driven Crop Planning**: Personalized crop recommendations based on soil type, weather patterns, and local conditions
- **Early Disease Detection**: Plant disease identification using AI vision models with actionable treatment recommendations
- **Community-Powered Alerts**: Collaborative disease outbreak mapping and reporting system
- **Localized Weather Insights**: Hyperlocal weather forecasts with farming activity recommendations

## Key Features

### 1. Crop Prices Dashboard
- Live mandi prices from 3000+ markets across India via Agmarknet API
- Price trend analysis with 7-day historical charts
- Nearby market locator using GPS
- AI-generated price insights (sell now vs. wait recommendations)
- Export functionality for record-keeping

### 2. Crop Advisor
- Intelligent crop selection based on:
  - Soil type (Red, Black/Regur, Alluvial, Laterite, Sandy)
  - Soil chemistry (NPK levels, pH)
  - Season (Kharif, Rabi, Zaid)
  - Local weather patterns
- Top 5 crop recommendations with reasoning
- Expected yield estimates per acre
- Best practices for irrigation, fertilizer, and spacing

### 3. Disease Detector
- Image-based plant disease identification
- Supports major crops: Tomato, Potato, Wheat, Rice, Cotton, Maize, Soybean, Sugarcane
- AI-generated treatment reports with:
  - Disease description and spread patterns
  - Immediate action steps
  - Organic and chemical remedies
  - Prevention strategies
- PDF report generation
- Alert authorities feature for outbreak tracking

### 4. Weather & Farm Calendar
- Current weather conditions (temperature, humidity, wind, UV index)
- 7-day forecast with precipitation charts
- AI-generated farming activity calendar
- Weather-based recommendations (e.g., "Avoid spraying pesticide - rain expected")
- Rainfall alerts for heavy precipitation

### 5. Disease Alert Map
- Interactive map showing community-reported disease outbreaks
- Real-time updates from Firestore database
- Filter by disease type, date range, and crop
- Color-coded status: New (red), Under Investigation (orange), Contained (green)
- Admin dashboard for agricultural officers

### 6. Community Forum
- Reddit-style discussion board with categories:
  - Crop Tips
  - Disease Help
  - Market Talk
  - Equipment
  - Government Schemes
- Upvoting system
- Nested comments
- Image attachments
- Real-time updates

### 7. Government Schemes Directory
- Curated list of Central and State agricultural schemes
- Searchable and filterable by:
  - Central vs. State programs
  - Crop type
  - Farmer category (small/marginal/women)
- Bookmark functionality
- Direct application links

### 8. Voice Assistant
- Voice-based queries in Hindi/Marathi
- Hands-free interaction for farmers
- Integration with Groq AI for natural language understanding

### 9. My Farm Profile
- Personal farm data management
- Disease report history
- Bookmarked schemes
- Price alerts (e.g., "Alert when Tomato > ₹2000/quintal")
- Language preference settings

## Target Users

### Primary Users
- **Small and Medium Farmers**: 1-10 acre landholders in Maharashtra, particularly Kopargaon region
- **Age Range**: 25-60 years
- **Tech Literacy**: Basic smartphone/computer usage
- **Primary Needs**: Market prices, crop guidance, disease identification

### Secondary Users
- **Farmer Leaders/Panchayat Members**: Village-level coordinators who need outbreak monitoring
- **Agricultural Officers**: Government officials (Krishi Vibhag) who track and respond to disease reports
- **Agricultural Students**: Learning and research purposes

## Use Cases

### Use Case 1: Market Price Discovery
Farmer Ramesh wants to sell his tomato harvest. He opens KrishiMitra, checks real-time prices in nearby mandis (Kopargaon, Ahmednagar, Nashik), sees a 7-day price trend showing upward movement, and receives AI insight: "Prices increased 12% this week. Good time to sell." He decides to transport to the highest-paying mandi.

### Use Case 2: Crop Selection
Farmer Sunita has 3 acres of black soil in Ahmednagar district. It's May (pre-Kharif season). She inputs her soil type, NPK levels, and location into Crop Advisor. The AI recommends: Soybean, Cotton, Maize, Groundnut, and Pigeon Pea, with detailed reasoning for each. She chooses Soybean based on current market outlook and water availability.

### Use Case 3: Disease Outbreak Response
Farmer Vijay notices yellow spots on his cotton leaves. He uploads a photo to Disease Detector. The AI identifies "Cotton Leaf Curl Disease" with 87% confidence. He receives a detailed treatment plan with organic neem spray recommendations. He clicks "Alert Authorities" - the report is saved with GPS coordinates. Agricultural officer sees the alert on the Disease Map and notices 3 similar reports in the same taluka, triggering a field visit.

### Use Case 4: Weather-Based Planning
Farmer Laxmi checks the Weather page and sees heavy rainfall (45mm) predicted in 2 days. The AI-generated farm calendar advises: "Postpone pesticide spraying. Prepare drainage channels. Good time for transplanting rice seedlings after rain." She adjusts her work schedule accordingly.

### Use Case 5: Community Knowledge Sharing
Farmer Prakash successfully controlled aphid infestation using a homemade garlic spray. He posts his method in the Community Forum under "Crop Tips" category. The post receives 47 upvotes and 12 comments from other farmers sharing their experiences. The knowledge spreads across the community.

## Technology Foundation
- **Frontend**: React 19 + Vite for fast, modern UI
- **UI Framework**: Tailwind CSS + shadcn/ui for polished, accessible components
- **Backend**: Node.js + Express for API proxying and business logic
- **AI Engine**: Groq API (Llama 4 Scout) for all AI features
- **Authentication**: Firebase Auth (Google + Phone OTP)
- **Database**: Firestore for real-time data
- **Storage**: Firebase Storage for images
- **Maps**: Google Maps JavaScript API
- **Deployment**: Vercel (frontend) + Render (backend)

## Multilingual Support
- English (primary)
- Hindi (हिंदी)
- Marathi (मराठी)
- Google Translate integration for additional languages

## Accessibility
- Mobile-first responsive design (works on 375px+ screens)
- Voice input support for low-literacy users
- Simple, icon-driven navigation
- High contrast color scheme for outdoor visibility
- Offline-capable price caching

## Success Metrics
- Daily active farmers using price dashboard
- Number of disease reports submitted and resolved
- Crop recommendations leading to successful harvests
- Community forum engagement (posts, comments, upvotes)
- Reduction in farmer dependency on middlemen for price information
