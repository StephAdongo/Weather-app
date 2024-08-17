const searchButton = document.querySelector('.search-button');
const tempButton = document.querySelector('.temperature-type-button');
const locationInput = document.querySelector('.location-input');
const locationResult = document.querySelector('.location-result');
const conditionsResult = document.querySelector('.conditions-result');
const temperatureResult = document.querySelector('.temperature-result');
const gifArea = document.querySelector('.gif-area');
const themeButton = document.querySelector('.color-theme-button');
const root = document.documentElement;
const img = document.createElement('img');
let theme = 'normal';
let toggle = 0;

searchButton.addEventListener('click', () => {
  if (locationInput.value === '') return;
  else fetchWeatherData();
});
tempButton.addEventListener('click', convertTemperature);
themeButton.addEventListener('click', changeTheme);

function changeTheme() {
  if (root.style.getPropertyValue('--primary-color') === '#161B22') {
    theme = 'normal';
    setNormalTheme();
  } else {
    theme = 'dark';
    setDarkTheme();
  }
  return theme;
}

function setNormalTheme() {
  root.style.setProperty('--primary-color', '#0092b2');
  root.style.setProperty('--secondary-color', '#c3f9ff');
  root.style.setProperty('--detail-color', '#1a2529');
  root.style.setProperty('--button-color', '#f69333');
  root.style.setProperty('--text-color', 'white');
  root.style.setProperty('--background-color', '#5ec8ea');
}

function setDarkTheme() {
  root.style.setProperty('--primary-color', '#161B22');
  root.style.setProperty('--secondary-color', '#0D1117');
  root.style.setProperty('--detail-color', '#FF7B72');
  root.style.setProperty('--button-color', '#1a2529');
  root.style.setProperty('--text-color', '#FFA657');
  root.style.setProperty('--background-color', '#443b3e');
}

async function fetchWeatherData() {
  // WEATHER API - https://www.visualcrossing.com/
  removeGif();
  loadingData();
  const location = locationInput.value.trim();
  const endpoint = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=JX7LY9RYQCLWENELFC8FNQFWN`;
  try {
    const response = await fetch(endpoint, { mode: 'cors' });
    if (!response.ok) throw new Error(`City "${location}" not found`);
    const weatherInfo = await response.json();
    const weatherLocation = await weatherInfo.address.toUpperCase();
    const weatherConditions =
      await weatherInfo.currentConditions.conditions.toUpperCase();
    const weatherTemperature = await weatherInfo.currentConditions.temp;
    displayWeatherData(weatherLocation, weatherConditions, weatherTemperature);
    changeFontSize();
    fetchGif(weatherConditions);
  } catch (error) {
    alert(error);
    removeLoadingData();
  }
  locationInput.value = '';
}

function loadingData() {
  const loadingIcon = document.createElement('i');
  loadingIcon.classList.add('fa-solid', 'fa-spinner', 'fa-2xl');
  gifArea.appendChild(loadingIcon);
}

function removeLoadingData() {
  gifArea.firstChild.remove();
}

function displayWeatherData(weatherLocation, weatherConditions, weatherTemperature) {
  locationResult.textContent = weatherLocation;
  conditionsResult.textContent = weatherConditions;
  temperatureResult.textContent = weatherTemperature.toFixed(0) + ' ℉';
  toggle = 0;
}

function changeFontSize() {
  if (locationResult.textContent.length > 14) {
    locationResult.style.fontSize = '1rem';
  }
  if (
    conditionsResult.textContent.length > 14 &&
    conditionsResult.textContent.length < 18
  ) {
    conditionsResult.style.fontSize = '1rem';
  } else if (conditionsResult.textContent.length > 18) {
    conditionsResult.style.fontSize = '0.9rem';
  }
}

function convertTemperature() {
  if (temperatureResult.textContent === ' ') return;

  const celsius = ' ℃';
  const fahrenheit = ' ℉';
  const baseValue = Number(temperatureResult.textContent.slice(0, -2));
  if (toggle === 0) {
    const inCelsius = ((baseValue - 32) * (5 / 9)).toFixed(0);
    temperatureResult.textContent = inCelsius + celsius;
    toggle = 1;
  } else {
    const inFahrenheit = (baseValue * (9 / 5) + 32).toFixed(0);
    temperatureResult.textContent = inFahrenheit + fahrenheit;
    toggle = 0;
  }
}

async function fetchGif(weatherConditions) {
  const searchItem = weatherConditions;
  let id;
  if (searchItem.includes('PARTIALLY CLOUDY')) id = 'KwZoSJlvep6Vy';
  if (searchItem.includes('RAIN')) id = 'l0HlPwMAzh13pcZ20';
  if (searchItem.includes('SUNNY')) id = 'o7R0zQ62m8Nk4';
  if (searchItem.includes('CLEAR')) id = 'kiCXF8mL3j6Oe0vAm9';
  if (searchItem.includes('OVERCAST')) id = 'dBXNPw0XBdF1n82BBf';

  const url =
    'https://api.giphy.com/v1/gifs/' +
    id +
    '?api_key=hdnMHDSnCZzfPRcoMMlVx3Av33ROAJvz&s=';

  await fetch(url, {
    mode: 'cors',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      displayGif(response);
    })
    .catch((error) => { 
      removeLoadingData();
      console.error('An erro occurred:', error)
    });
}

function displayGif(gif) {
  removeLoadingData();
  img.src = gif.data.images.original.url;
  gifArea.appendChild(img);
}

function removeGif() {
  if (gifArea.childNodes.length > 0) {
    gifArea.firstChild.remove();
  }
}