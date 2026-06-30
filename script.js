const errorContainer = document.getElementById("error")

async function getCoords(ciudad) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1`)
        const data = await response.json()

        if (!data.results) {
            errorContainer.style.display = "block"
            errorContainer.textContent = "Ciudad no encontrada"
            return
        }

        const results = data.results[0]

        return {
            city: results.name,
            coords : {
                latitude: results.latitude,
                longitude: results.longitude
            }
        }
    } catch (error) {
        console.error("Error al obtener las coordenadas:", error)
        errorContainer.style.display = "block"
        errorContainer.textContent = "Error al obtener las coordenadas"
    }
}

async function getWeather(coords) {
    const {latitude, longitude} = coords
    try {
        const response = await fetch(` https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        const data = await response.json()
        
        return {
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            code: data.current_weather.weathercode
        }
    } catch (error) {
        console.error("Error al obtener el clima:", error)
        errorContainer.style.display = "block"
        errorContainer.textContent = "Error al obtener las coordenadas"
    }
}

const sendButton = document.getElementById("btnClima")
const cityInput = document.getElementById("ciudad")

const resultsContainer = document.getElementById("results")
const statusContainer = document.getElementById("elemento")

const cityName = document.getElementById("ciudadNombre")
const cityTemperature = document.getElementById("ciudadTemperatura")
const cityWindspeed = document.getElementById("ciudadViento")
const cityWeathercode = document.getElementById("ciudadCodigo")

sendButton.addEventListener("click", async (e) => {
    e.preventDefault()
    resultsContainer.style.display = "none"
    errorContainer.style.display = "none"
    statusContainer.style.display = "block"
    sendButton.disabled = true

    try {
        const coordsData = await getCoords(cityInput.value)
        
        if (coordsData) {
            const weatherData = await getWeather(coordsData.coords)

            cityName.textContent = coordsData.city
            cityTemperature.textContent = weatherData.temperature
            cityWindspeed.textContent = weatherData.windspeed
            cityWeathercode.textContent = weatherData.code

            resultsContainer.style.display = "block"
        }

    } catch (error) {
        console.error("Error:", error)
    } finally {
        statusContainer.style.display = "none"
        sendButton.disabled = false
    }
})