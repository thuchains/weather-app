
const API_KEY = window.OWM_API_KEY;
console.log('API_KEY present?', !!API_KEY)
// const text = await res.text();
// console.log('Status:', res.status, 'Body:', text);

// const data = JSON.parse(text);

const myForm = document.getElementById('form-search');
const myInputLat = document.getElementById('search-lat');
const myInputLon = document.getElementById('search-lon');
const cardContainer = document.getElementById('container-weather-details')
const btn = document.getElementById('search-btn')



myForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const lat = parseFloat(myInputLat.value) 
    const lon = parseFloat(myInputLon.value)

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return showError('Please enter both latitude and longitude');
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return showError('Latitude must be within the range of -90 to 90 and longitude within the range of -180 t0 180')
    }

   
    const weatherDetailsData = await getWeather (lat, lon)
    displayWeather(weatherDetailsData)
    

})

const getWeather = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json();

    const block = data.list?.[0];
    if (!block) throw new Error ('No daily data');

    const kToF = k => (k - 273.15) * 9/5 + 32;

    const weatherData = {
        forecast: (block.weather?.[0]?.description || ''.replace(/\b\w/g, c => c.toUpperCase())),
        high: Math.round(kToF(block.main.temp_max)),
        low: Math.round(kToF(block.main.temp_min)),
        humidity: Math.round(block.main.humidity)
    }

    return weatherData
}


const displayWeather = (weatherData) => {
    cardContainer.innerHTML = ''
    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card'

    weatherCard.innerHTML = `
    <div class='info'>
        <h3>${weatherData.forecast}</h3>
        <p>High: ${weatherData.high}</p>
        <p>Low: ${weatherData.low}</p>
        <p>Humidity: ${weatherData.humidity}</p>
    </div>
    `

    cardContainer.appendChild(weatherCard)
}

function showError(message) {
    cardContainer.innerHTML = `<p>${message}</p>`
}

