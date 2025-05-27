
# Caelus Prognostica - AI Weather Forecaster

Caelus Prognostica is an intelligent weather prediction application that leverages AI (via Google's Gemini API) to provide real-time, detailed weather forecasts based on your current geographical location. It features a dynamic, animated interface that changes based on the weather conditions and time of day.

## Features

-   **Real-time Geolocation:** Automatically detects your current location to provide relevant forecasts.
-   **AI-Powered Predictions:** Uses Google's Gemini API for generating weather data.
-   **Detailed Weather Information:**
    -   Temperature (current and "feels like")
    -   Humidity
    -   Wind Speed
    -   Atmospheric Pressure
    -   Visibility
    -   UV Index
    -   Chance of Precipitation
    -   Sunrise and Sunset Times
    -   Air Quality Index (AQI) value and qualitative description
    -   General weather description (e.g., "Sunny", "Cloudy", "Light Rain")
-   **Dynamic UI:**
    -   Animated backgrounds that change based on current weather and time of day (day/night).
    -   Animated weather icons.
    -   Responsive design for various screen sizes, including widescreen PC displays.
-   **User-Friendly Interface:**
    -   Displays city name based on coordinates.
    -   Loading states and clear error messages.
    -   Manual "Refresh Weather" option.
    -   Last updated timestamp for the forecast.
-   **Accessibility:** ARIA attributes used for better screen reader support.
-   **Offline Capability:** While weather fetching requires an internet connection, the UI is built to handle offline scenarios gracefully (though new data won't be available).

## Tech Stack

-   **Frontend:** React 19, TypeScript, Tailwind CSS
-   **AI Integration:** `@google/genai` (Gemini API)
-   **Geolocation:** Browser Geolocation API
-   **Styling:** Tailwind CSS, custom CSS for animations
-   **Module Management:** ES Modules (ESM) via `importmap`

## Setup and Installation

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **API Key Configuration:**
    This application requires a Google Gemini API key.
    -   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   You need to set this API key as an environment variable named `API_KEY`. How you set this depends on your deployment environment or local setup.
        -   For local development, you might use a `.env` file (if your development server supports it, e.g., Vite, Create React App) or set it directly in your terminal session:
            ```bash
            export API_KEY="YOUR_GEMINI_API_KEY"
            ```
        -   **Important:** The application code in `services/geminiService.ts` directly uses `process.env.API_KEY`. Ensure this variable is accessible in the environment where the application runs. **Do not hardcode your API key directly into the source code.**

3.  **Install Dependencies (if using a local development server like Vite or Parcel):**
    If you are integrating this into a project with a package manager:
    ```bash
    npm install
    # or
    yarn install
    ```
    *Note: The current setup uses CDN links via `importmap` in `index.html`, so a local `npm install` for these specific dependencies (`react`, `@google/genai`) might not be strictly necessary if you're only running the `index.html` directly, but it's good practice for development.*

## How to Run

1.  **Ensure API Key is Set:** Make sure the `API_KEY` environment variable is correctly configured.
2.  **Serve `index.html`:**
    You can open the `index.html` file directly in a modern web browser. However, for proper ES module resolution and to avoid potential CORS issues with some APIs (though not typically an issue for geolocation or Gemini client-side if configured correctly), it's better to serve the files through a local web server.
    -   **Using a simple HTTP server (e.g., Python's built-in server):**
        Navigate to the project's root directory in your terminal and run:
        ```bash
        python -m http.server
        ```
        Then open `http://localhost:8000` (or the port shown) in your browser.
    -   **Using VS Code Live Server:**
        If you use VS Code, the "Live Server" extension is a convenient way to serve the `index.html` file.
    -   **Using a development tool like Vite or Parcel:**
        If you've set up the project with Vite or Parcel, you would typically run:
        ```bash
        npm run dev
        # or
        yarn dev
        ```

3.  **Grant Location Permissions:** When the app loads, your browser will ask for permission to access your location. You must allow this for the app to function correctly.

## Project Structure

```
.
├── README.md               # This file
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

## Notes

-   The weather data is AI-generated and should be considered an estimate.
-   Ensure your browser supports the Geolocation API and ES Modules.
-   The application is designed to be responsive and work across different devices.

---

Developed by Alan Cyril Sunny.
Inspired by the need for beautiful and informative weather applications.
```
