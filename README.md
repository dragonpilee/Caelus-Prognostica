# Caelus Prognostica - AI Weather Forecaster

![React](https://img.shields.io/badge/Frontend-React-61dafb)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8)
![Google Gemini API](https://img.shields.io/badge/AI-Gemini%20API-yellow)

> If you find this project helpful, please consider ⭐ [starring the repository](https://github.com/dragonpilee/caelus-prognostica)!

---

**Caelus Prognostica** is an intelligent weather prediction application that leverages AI (via Google's Gemini API) to provide real-time, detailed weather forecasts based on your current geographical location. It features a dynamic, animated interface that changes based on the weather conditions and time of day.

---

![App Screenshot](./Screenshot.png)

---

## ✨ Features

- **Real-time Geolocation:** Automatically detects your current location to provide relevant forecasts.
- **AI-Powered Predictions:** Uses Google's Gemini API (`gemini-2.5`).
- **Detailed Weather Information:**
    - Temperature (current and "feels like")
    - Humidity
    - Wind Speed
    - Atmospheric Pressure
    - Visibility
    - UV Index
    - Chance of Precipitation
    - Sunrise and Sunset Times
    - Air Quality Index (AQI) value and qualitative description
    - General weather description (e.g., "Sunny", "Cloudy", "Light Rain")
- **Dynamic UI:**
    - Animated backgrounds that change based on current weather and time of day (day/night).
    - Animated weather icons.
    - Responsive design for various screen sizes, including widescreen PC displays.
- **User-Friendly Interface:**
    - Displays city name based on coordinates.
    - Loading states and clear error messages.
    - Manual "Refresh Weather" option.
    - Last updated timestamp for the forecast.
- **Accessibility:** ARIA attributes used for better screen reader support.
- **Offline Capability:** While weather fetching requires an internet connection, the UI is built to handle offline scenarios gracefully (though new data won't be available).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI Integration:** `@google/genai` (Gemini API)
- **Geolocation:** Browser Geolocation API
- **Styling:** Tailwind CSS, custom CSS for animations
- **Module Management:** ES Modules (ESM) via `importmap`

---

## 🚀 Setup and Installation

1. **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **API Key Configuration:**
    - The app expects the API key as an environment variable named `API_KEY`.
    - For local development (browser-only), you may temporarily hardcode your API key in `services/geminiService.ts` for testing:
        ```typescript
        // filepath: services/geminiService.ts
        // ...existing code...
        const getApiKey = (): string => {
          // const apiKey = process.env.API_KEY; // Original
          const apiKey = "YOUR_ACTUAL_API_KEY"; // Replace with your key for local testing
          if (!apiKey) {
            throw new Error("API_KEY environment variable not set or hardcoded key is missing.");
          }
          return apiKey;
        };
        // ...existing code...
        ```
    - **Remove your hardcoded API key before sharing or deploying the code.**

3. **Install Dependencies (if using a local development server like Vite or Parcel):**
    ```bash
    npm install
    # or
    yarn install
    ```
    *Note: If running via CDN/importmap in `index.html`, local `npm install` may not be necessary, but is good practice for development.*

---

## How to Run

1. **Ensure API Key is Set:** Make sure the `API_KEY` environment variable is correctly configured.
2. **Serve `index.html`:**
    - Open the `index.html` file directly in a modern web browser, or
    - Serve the files through a local web server (recommended for ES module resolution):
        ```bash
        python -m http.server
        ```
        Then open `http://localhost:8000` in your browser.
    - Or use VS Code Live Server, or a dev tool like Vite/Parcel:
        ```bash
        npm run dev
        # or
        yarn dev
        ```

3. **Grant Location Permissions:** When the app loads, your browser will ask for permission to access your location. You must allow this for the app to function correctly.

---

## 📂 Project Structure

```
.
├── README.md               # This file
├── Screenshot.png          # Main screenshot
├── index.html              # Main HTML entry point
├── index.tsx               # Main React application entry (renders App.tsx)
├── App.tsx                 # Main application component (UI, logic, state)
├── types.ts                # TypeScript type definitions
├── metadata.json           # Application metadata and permissions
├── components/             # UI Components
│   ├── ErrorDisplay.tsx
│   ├── LoadingSpinner.tsx
│   ├── LocationDisplay.tsx
│   ├── WeatherDisplay.tsx
│   └── WeatherIcon.tsx
└── services/               # Business logic and API interactions
    ├── geolocationService.ts # Handles browser geolocation
    └── geminiService.ts      # Handles interaction with Gemini API
```

---

## Notes

- The weather data is AI-generated and should be considered an estimate.
- Ensure your browser supports the Geolocation API and ES Modules.
- The application is designed to be responsive and work across different devices.

---

Developed by Alan Cyril Sunny.  
Inspired by the need for beautiful and informative weather applications.

---
