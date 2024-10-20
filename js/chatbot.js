const OPENWEATHER_API_KEY = '4a9c23fab09ba16cc1598973d6854a3b'; // Replace with your OpenWeather API key
const GEMINI_API_KEY = 'AIzaSyDarsvtYb8JHRoESYDWOqh4owEe2XyQsdM'; // Replace with your Gemini API key
const MODEL_NAME = 'gemini-1.5-flash-latest'; // Replace with your model name

// Helper function to get the current date or future dates based on user query
function getDateFromQuery(query) {
    const today = new Date();
    let targetDate = today;

    if (query.includes('tomorrow')) {
        targetDate.setDate(today.getDate() + 1);
    } else if (query.match(/\b(\d{1,2})(st|nd|rd|th)?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i)) {
        const dateMatch = query.match(/\b(\d{1,2})(st|nd|rd|th)?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);
        targetDate = new Date(`${dateMatch[3]} ${dateMatch[1]}, ${today.getFullYear()}`);
    }
    return targetDate.toISOString().split('T')[0];
}

// Fetch 5-day forecast from OpenWeather API
async function fetchForecastData(city) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
        const response = await fetch(forecastApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const forecastData = await response.json();
        return forecastData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Extract weather data for a specific date
function extractWeatherForDate(forecastData, targetDate) {
    const forecastForDay = forecastData.list.filter(forecast => forecast.dt_txt.startsWith(targetDate));
    if (forecastForDay.length === 0) {
        return `No forecast data available for ${targetDate}.`;
    }
    const morningWeather = forecastForDay[0];
    const afternoonWeather = forecastForDay[forecastForDay.length - 1];
    return `Weather on ${targetDate}: Morning: ${morningWeather.main.temp}°C, ${morningWeather.weather[0].description}. Evening: ${afternoonWeather.main.temp}°C, ${afternoonWeather.weather[0].description}.`;
}

// Function to calculate highest, lowest, and average temperatures from forecast data
function calculateTemperatureStats(forecastData) {
    const temperatures = forecastData.list.map(item => item.main.temp);
    const highest = Math.max(...temperatures);
    const lowest = Math.min(...temperatures);
    const average = temperatures.reduce((acc, temp) => acc + temp, 0) / temperatures.length;

    return { highest, lowest, average };
}

// Function to detect unit from query (Celsius or Fahrenheit)
function detectTemperatureUnit(query) {
    if (query.toLowerCase().includes('fahrenheit')) {
        return 'fahrenheit';
    }
    return 'celsius'; // Default is Celsius
}

// Helper function to convert temperature units
function convertTemperature(temp, unit) {
    if (unit === 'fahrenheit') {
        return (temp * 9/5) + 32; // Convert Celsius to Fahrenheit
    }
    return temp; // Default is Celsius
}

// Improved function to extract city and date
function extractCityAndDate(query) {
    const cityMatch = query.match(/\b(?:in|for|at|near|around)\s+([A-Za-z\s]+)/i);
    const city = cityMatch ? cityMatch[1].trim() : null;
    const targetDate = getDateFromQuery(query);
    return { city, targetDate };
}


// Function to display messages in chat
function displayMessage(text, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start', 'items-center', 'space-x-2');

    const messageContent = `
<div class="flex ${sender === 'user' ? 'flex-row-reverse' : ''} items-start space-x-3 ${sender === 'user' ? 'space-x-reverse' : ''} mb-4">
<img class="w-8 h-8 rounded-full" src="${sender === 'user' ? 'user.png' : 'bot.avif'}" alt="${sender}">
<div class="p-3 rounded-lg max-w-xs text-white ${sender === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-700' : 'bg-gradient-to-r from-gray-500 to-gray-700'}">
    ${text}
</div>
</div>
`;

    messageDiv.innerHTML = messageContent;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to disable send button while generating response
function disableSendButton(disable) {
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = disable;
}

// Run the chat with Gemini API and pass the weather data
async function runChat(userInput, forecastData, targetDate) {
    const weatherInfo = extractWeatherForDate(forecastData, targetDate);

    const { highest, lowest, average } = calculateTemperatureStats(forecastData);
    const unit = detectTemperatureUnit(userInput);

    const highestTemp = convertTemperature(highest, unit).toFixed(2);
    const lowestTemp = convertTemperature(lowest, unit).toFixed(2);
    const averageTemp = convertTemperature(average, unit).toFixed(2);

    const responseText = `
        ${weatherInfo}
        Here are the temperature stats for the next 5 days:
        - Highest: ${highestTemp}°${unit === 'fahrenheit' ? 'F' : 'C'}
        - Lowest: ${lowestTemp}°${unit === 'fahrenheit' ? 'F' : 'C'}
        - Average: ${averageTemp}°${unit === 'fahrenheit' ? 'F' : 'C'}
    `;

    // Send the weather data to Gemini API as part of the chat
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `${userInput}\n\nHere is the weather information:\n${responseText}`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch response');
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected response structure: No candidates found');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Use geolocation if no city is provided
async function fetchLocationForecast() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation not supported by this browser.');
        } else {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
                try {
                    const response = await fetch(forecastApiUrl);
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data for your location');
                    }
                    const forecastData = await response.json();
                    resolve(forecastData);
                } catch (error) {
                    reject(error);
                }
            }, (error) => {
                reject(error.message);
            });
        }
    });
}

// Attach event listener to the button
document.getElementById('sendButton').addEventListener('click', async () => {
    const userInputElement = document.getElementById('userInput');
    const userInput = userInputElement.value;

    if (userInput) {
        displayMessage(userInput, 'user');
        disableSendButton(true);

        try {
            const { city, targetDate } = extractCityAndDate(userInput);

            let forecastData;
            if (city) {
                forecastData = await fetchForecastData(city);
            } else {
                forecastData = await fetchLocationForecast(); // Use geolocation if no city provided
            }

            const responseText = await runChat(userInput, forecastData, targetDate);
            displayMessage(responseText, 'bot');
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Sorry, there was an error fetching the weather information.', 'bot');
        }

        userInputElement.value = ''; // Clear input after sending
        disableSendButton(false); // Re-enable button after response
    }
});
