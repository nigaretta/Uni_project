document.addEventListener("DOMContentLoaded",function(){
  const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector(".search-btn");
  const locationButton = document.querySelector(".location-btn");
  const currentWeatherDiv = document.querySelector(".current-weather");
  const weatherCardsDiv = document.querySelector(".weather-cards");
  const cityImageContainer = document.querySelector(".city-image-container");
  
  const API_KEY = "";
  const UNSPLASH_API_KEY = "";
  
  // Function to show the city image container
  
  
  function showCityImageContainer() {
    cityImageContainer.style.display = "block"; // Show the city image container
  }
  
  function setCityImageStyles() {
    cityImageContainer.style.width = "520px";
    cityImageContainer.style.height = "250px";
    cityImageContainer.style.float = "right";
    cityImageContainer.style.marginRight = "90px";
    cityImageContainer.style.marginTop = "-275px";
  }
  
  function showCurrentWeather() {
    currentWeatherDiv.style.display = "block";
  }
  
  function background() {
    currentWeatherDiv.style.backgroundColor = "#251749";
  }
  
  
  const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
      return `<div class="details">
                  <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                  <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                  <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                  <h6>Humidity: ${weatherItem.main.humidity}%</h6>
              </div>
              <div class="icon">
                  <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                  <h6>${weatherItem.weather[0].description}</h6>
              </div>`;
    } else {
      return `<li class="card">
                  <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                  <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                  <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C, ${(weatherItem.main.temp).toFixed(2)}K</h6>
                  <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                  <h6>Humidity: ${weatherItem.main.humidity}%</h6>
              </li>`;
    }
  };
  
  // Function to get the city image from Unsplash
  function getCityImage(cityName) {
    fetch(`https://api.unsplash.com/search/photos?query=${cityName}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.results[0].urls.regular;
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        // Display the image in your app
        cityImageContainer.innerHTML = '';
        cityImageContainer.appendChild(imageElement);
      })
      .catch(error => {
        console.error('Error fetching city image:', error);
      });
  }
  
  const fetchAndDisplayWeatherData = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") {
      alert("Please enter a city name.");
      return;
    }
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (!data.length) {
          alert(`No coordinates found for ${cityName}`);
          return;
        }
        const { lat, lon, name } = data[0];
  
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  
        fetch(WEATHER_API_URL)
          .then(response => response.json())
          .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
              const forecastDate = new Date(forecast.dt_txt).getDate();
              if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
              }
            });
  
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";
  
            fiveDaysForecast.forEach((weatherItem, index) => {
              const html = createWeatherCard(cityName, weatherItem, index);
              if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
              } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
              }
            });
  
            // After displaying the weather information, fetch and display the city image
            getCityImage(cityName);
          })
          .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
          });
      })
      .catch(() => {
        alert("An error occurred while fetching the coordinates!");
      });
    getCityImage(cityName);
    setCityImageStyles();
    showCityImageContainer();
    showCurrentWeather();
    background();
  }
  
  // Event listeners (you can keep your existing event listeners here)
  
  searchButton.addEventListener("click", fetchAndDisplayWeatherData);
  
  cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      fetchAndDisplayWeatherData();
    }
  });
  
  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
  
        const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        fetch(API_URL).then(response => response.json()).then(data => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        }).catch(() => {
          alert("An error occurred while fetching the city name!");
        });
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Geolocation request denied. Please reset location permission to grant access again.");
        } else {
          alert("Geolocation request error. Please reset location permission.");
        }
      });
  }
  
  locationButton.addEventListener("click", getUserCoordinates);
  searchButton.addEventListener("click", getCityCoordinates);
  cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

})




