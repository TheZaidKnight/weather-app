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
  
      // Fetch 5-day forecast (hourly data)
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
  
      hourlyData = forecastData.list;
      updatePagination();
      renderTable(currentPage);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
  function updatePagination() {
    document.getElementById('pagination').innerHTML = `<button onclick="prevPage()">Previous</button> <button onclick="nextPage()">Next</button>`;
  }  
function renderTable(page) {
    const tbody = document.getElementById('forecast-tbody');
    tbody.innerHTML = '';
    const start = (page - 1) * entriesPerPage;
    const end = Math.min(start + entriesPerPage, hourlyData.length);
  
    for (let i = start; i < end; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(hourlyData[i].dt_txt).toLocaleString()}</td>
        <td>${hourlyData[i].main.temp} °C</td>
        <td>${hourlyData[i].weather[0].description}</td>
      `;
      tbody.appendChild(row);
    }
  }
function changePage(delta) {
    currentPage += delta;
    document.getElementById('currentPage').textContent = currentPage;
}
function nextPage() {
    if (currentPage < Math.ceil(hourlyData.length / entriesPerPage)) {
      currentPage++;
      renderTable(currentPage);
    }
  }
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTable(currentPage);
    }
  }
  function toggleMenu() {
    var sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('active');
}