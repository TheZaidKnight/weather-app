# Weather Dashboard with Chatbot Integration

## Project Overview
This project is a **Weather Dashboard** that provides current weather information and a 5-day forecast using the **OpenWeather API**. Additionally, the application includes a chatbot powered by the **Gemini API** for handling both weather-related queries and general conversations. The dashboard features data visualizations with **Chart.js** for an interactive display of weather metrics.

## Features
- **Current Weather Details**: Displays the current weather based on user-selected city.
- **5-Day Weather Forecast**: Provides a 5-day forecast with temperature and weather conditions.
- **Weather Widget**: Automatically updates the background based on the current weather conditions (e.g., cloudy, sunny).
- **Charts**: 
  - Vertical bar chart for 5-day temperature forecast.
  - Doughnut chart for weather condition percentages.
  - Line chart for temperature changes over the next 5 days.
- **Table View**: Shows a paginated table of temperature forecasts for the next 5 days.
- **Chatbot Integration**: 
  - Responds to general queries using the Gemini API.
  - Provides weather-related answers by integrating OpenWeather API data.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tools & Technologies
- **Frontend**: HTML, CSS, JavaScript
- **APIs**:
  - [OpenWeather API](https://openweathermap.org/api): Provides weather data.
  - [Gemini API](https://ai.google.dev/aistudio): Handles chatbot functionalities.
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) for creating interactive charts.
  
## Instructions for Setup

### Prerequisites
- An API key from OpenWeather API. You can get it by signing up at [OpenWeather API](https://openweathermap.org/api).
- An API key from Gemini AI API. Sign up at [Gemini API](https://ai.google.dev/aistudio) to obtain it.

### Steps to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://your-repository-url
   cd weather-dashboard
   ```

2. **OpenWeather API Key Setup**
   - After cloning the repository, go to your code editor and open the `app.js` file.
   - Replace the placeholder in the following line with your actual OpenWeather API key:
     ```javascript
     const OPENWEATHER_API_KEY = 'your_openweather_api_key';
     ```

3. **Gemini API Key Setup**
   - In the same `app.js` file, locate the line for the Gemini API key and replace the placeholder with your actual Gemini API key:
     ```javascript
     const GEMINI_API_KEY = 'your_gemini_api_key';
     ```

4. **Install Dependencies (Optional)**
   - If the project has any dependencies (such as Chart.js), you can install them using a package manager like npm or simply include the required CDN in the HTML file.

5. **Run the App**
   - Simply open the `index.html` file in your browser.
   - The weather dashboard should be functional, and you can use the chatbot to query weather-related information.

### Usage
- Use the **search bar** to input the name of a city and fetch its current weather and 5-day forecast.
- The **charts** and **table** will dynamically update based on the selected city.
- Interact with the **chatbot** by asking weather-related questions such as “What is the weather today in London?”

### License
This project is licensed under the FAST NUCES Academic Policy.