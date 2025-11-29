# Weather-Tracking-Website
WeatherTracker is a browser-based weather dashboard designed for fast, minimal, and reliable access to current conditions and short-term forecasts. It’s built with React and Tailwind CSS, and focuses on clarity, graceful fallback behavior, and consistent internal logic. Whether the user provides an API key or not, the app ensures the interface always responds with meaningful data. The design emphasizes quick access, easy readability, and small details like city tracking and geolocation support.

## Main Features
### City Search & Live Weather:

Search for any city and instantly retrieve its current temperature, humidity, wind speed, and sky conditions. WeatherTracker talks directly to the OpenWeatherMap API and handles errors cleanly.

### 5-Day Forecast:

The forecast view simplifies OpenWeatherMap’s 3-hour interval data into one representative data point per day, selected around midday for the most stable reading.

### Geolocation Support:

With one click, the app can use the browser’s Geolocation API to fetch weather conditions for the user’s current coordinates.

### Tracked Cities:

Cities can be added to a persistent list stored in localStorage. Clicking on a saved city loads its weather immediately, and removal is simple and unobtrusive.

### API Key Flexibility:

1) WeatherTracker supports multiple ways of providing an API key:

2) Environment variable (REACT_APP_OPENWEATHERMAP_KEY)

3) Global browser variable (window.__OPENWEATHERMAP_KEY__)

4) URL query (?apiKey=YOUR_KEY)

### Fallback Sample Weather:

If no API key is detected, the interface still displays useful placeholder weather and forecast data, ensuring the UI always stays functional.

### Lightweight UI:

All interface elements are built with Tailwind CSS, keeping the layout responsive, minimal, and easy to read. Weather cards, tracked-city buttons, and error messages follow a simple, consistent visual structure.

## Technical Highlights
### React:

1) Uses useState, useEffect, and controlled form inputs for clean state handling

2) Organized request logic using a single weatherApi helper

3) Internal functions for parsing API data, including a forecast aggregator

4) Browser localStorage integration for managing tracked cities

5) Geolocation implemented with navigator.geolocation.getCurrentPosition()

### API Logic:
1) Current weather and 5-day forecast fetched through standard OpenWeatherMap endpoints

2) Query helper (fetchWeatherByCity, fetchWeatherByCoords) unifies error handling

3) Forecast reduction picks the data point nearest to 12:00 for consistent daily summaries

### Tailwind CSS:

1) Layout built around flexible containers and utility classes

2) No external UI frameworks required

3) Clean spacing, card-style info panels, and readable typography

## Personal Note
This was my third project using JavaScript and my first time working with React, which made it a natural step into JSX-based development. As with my earlier projects, I gravitate toward minimalistic UI design, and Tailwind CSS made that approach both faster and cleaner. I’m pleased with how this project turned out, and building it has made me more interested in exploring backend frameworks as well as creating more mathematically driven, concept-focused websites.
