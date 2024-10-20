document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
      fetchWeatherData(city);
    }
  });
  
  const apiKey = '0dd65a55f6cdc9a5cbe36005c5664e11';
  let hourlyData = [];
  let currentPage = 1;
  const entriesPerPage = 10;
  
  async function fetchWeatherData(city) {
    try {
      // Fetch current weather data
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const currentWeatherResponse = await fetch(currentWeatherUrl);
      const currentWeatherData = await currentWeatherResponse.json();
  
      updateCurrentWeather(currentWeatherData);
  
      // Fetch 5-day forecast (hourly data)
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
  
      hourlyData = forecastData.list;
      updatePagination();
  
      // Update charts with the forecast data
      updateCharts(forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
  
  function updateCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
  }
  
  function updatePagination() {
    document.getElementById('pagination').innerHTML = `
      <button onclick="prevPage()">Previous</button>
      <button onclick="nextPage()">Next</button>
    `;
  }

let barChart;
let doughnutChart;
let lineChart;

function updateCharts(forecastData) {
    const temperatures = forecastData.list.map(entry => entry.main.temp);
    const labels = forecastData.list.map(entry => new Date(entry.dt_txt).toLocaleString());

    // Destroy existing charts before creating new ones
    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    // Update Bar Chart
    const barChartCanvas = document.getElementById('barChartCanvas').getContext('2d');
    barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: temperatures,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      }
    });

    // Update Doughnut Chart (weather conditions frequency)
    const weatherConditions = forecastData.list.map(entry => entry.weather[0].main);
    const conditionCount = {};
    weatherConditions.forEach(condition => {
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });

    const doughnutChartCanvas = document.getElementById('doughnutChartCanvas').getContext('2d');
    doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(conditionCount),
        datasets: [{
          data: Object.values(conditionCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      }
    });

    // Update Line Chart (Temperature trends)
    const lineChartCanvas = document.getElementById('lineChartCanvas').getContext('2d');
    lineChart = new Chart(lineChartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: temperatures,
          fill: false,
          borderColor: '#FF6384',
          tension: 0.1
        }]
      }
    });
}

  
  