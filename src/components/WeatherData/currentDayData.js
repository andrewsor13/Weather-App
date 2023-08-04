'use strict';
import {
  sunriseSvg,
  sunsetSvg,
  updateClock,
  rain,
  rainNight,
  thunderStorm,
  getNumberEnding,
} from './utilsforCurrentDay';
import {
  snowSvg,
  sunSvg,
  cloudsAndSunSvg,
  cloudySvg,
} from '../../utilsForFiveDays';

const todayData = null;
const currentTemperature = document.querySelector('.current-temperature');
const degreesMin = document.querySelector('.degrees-min');
const degreesMax = document.querySelector('.degrees-max');
const weather = document.querySelector('.weather');
const dateInfo = document.querySelector('.date-info__date');
const currentMonth = document.querySelector('.time__month');
const currendTime = document.querySelector('time__hour');
const sunset = document.getElementById('sunset');
const sunrise = document.getElementById('sunrise');
const sunDetails = document.querySelector('.sun-details');
const sunLine = document.querySelector('.line-sun');
const degreeSymbol = document.querySelector('.degree-symbol');
const cityText = document.getElementById('city');

const weatherInfo = document.querySelector('.weather-info__weather');

const weatherType = document.createElement('div');
weatherType.innerHTML = `${thunderStorm}`;

weatherInfo.prepend(weatherType);

const sunsetSvgElement = document.createElement('div');
sunsetSvgElement.innerHTML = `<svg class="sun-svg" width="20" height="20" class="card__icon" viewBox="0 0 32 32" fill="#FF6B09">${sunsetSvg}</svg>`;

const sunriseSvgElement = document.createElement('div');
sunriseSvgElement.innerHTML = `<svg class="sun-svg" width="20" height="20" viewBox="0 0 32 32" fill="#FF6B09">${sunriseSvg}</svg>`;

sunDetails.prepend(sunriseSvgElement);
sunLine.prepend(sunsetSvgElement);
const baseUrlForTodayWeather =
  'https://api.openweathermap.org/data/2.5/weather?APPID=072ec51636e5141423703ba32d12100f&units=metric&lang=en&q=';
const APIKEY = '072ec51636e5141423703ba32d12100f';

const makeUrlForDetectedCityFromCurrentCoord = (latitude, longitude) => {
  return `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`;
};

const weatherData = {
  city: 'Bucharest',
  country: '',
  currentTemp: '',
  todayMax: '',
  todayMin: '',
  sunRise: '',
  sunSunset: '',
  currentDay: '',
  currentMonth: '',
  currentDayNumber: '',
  icon: '',
};

//Functie care afla data curenta
const formatDate = () => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'Octomber',
    'November',
    'December',
  ];
  const currentDate = new Date();
  weatherData.currentDayNumber = currentDate.getDate();
  const currentDayOfWeek = dayNames[currentDate.getDay()];
  const currentMonth = monthNames[currentDate.getMonth()];

  weatherData.currentDay = currentDayOfWeek;
  weatherData.currentMonth = currentMonth;
};

formatDate();
setInterval(updateClock, 1000);

//Functie care afla locatia
function getCurrentLocationCoord() {
  if ('geolocation' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
      .then(location => {
        const url = makeUrlForDetectedCityFromCurrentCoord(
          location.coords.latitude,
          location.coords.longitude
        );
        return fetch(url);
      })
      .then(response => response.json())
      .then(data => {
        weatherData.city = data[0].name;
      })
      .catch(err => {
        throw err;
      });
  } else {
    return Promise.reject('Geolocația nu este suportată de acest browser.');
  }
}

//Functie care preia datele despre vreme
function getWeatherForToday() {
  return fetch(baseUrlForTodayWeather + weatherData.city)
    .then(res => {
      if (res.status === 404) {
        Notify.failure("The city can't be found or is misspelling!", {
          position: 'center-center',
        });

        throw new Error('City not found');
      }
      return res.json();
    })
    .then(data => {
      weatherData.currentTemp = Math.round(data.main.temp) + '°';
      weatherData.todayMax = Math.round(data.main.temp_max) + '°';
      weatherData.todayMin = Math.round(data.main.temp_min) + '°';
      weatherData.sunRise = decodeTime(data.sys.sunrise);
      weatherData.sunSunset = decodeTime(data.sys.sunset);
      weatherData.icon = data.weather[0].icon;
      weatherData.country = data.sys.country;
    })
    .catch(err => {
      console.error(`Request error: ${err.message}`);
    });
}

function decodeTime(time) {
  const date = new Date(time * 1000);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const DayContent = `
<h3>${weatherData.currentDayNumber}<sup class="exponent">${getNumberEnding(
  weatherData.currentDayNumber
)}</sup> ${weatherData.currentDay}</h3>
`;

//Functie care afiseaza datele in DOM
function renderWeatherDataForToday() {
  currentTemperature.textContent = weatherData.currentTemp;
  degreesMin.textContent = weatherData.todayMin;
  degreesMax.textContent = weatherData.todayMax;
  dateInfo.innerHTML = DayContent;
  sunrise.innerHTML = weatherData.sunRise;
  sunset.innerHTML = weatherData.sunSunset;
  currentMonth.innerHTML = weatherData.currentMonth;
  cityText.innerHTML = `<b>${weatherData.city}, ${weatherData.country}</b>`;

  if (weatherData.icon === '01d' || weatherData.icon === '01n') {
    weatherType.innerHTML = `<svg width="35" height="35" viewBox="0 0 32 32">${sunSvg}</svg>`;

    weatherInfo.prepend(weatherType);
  } else if (weatherData.icon === '02d') {
    weatherType.innerHTML = `<svg  width="35" height="35" viewBox="0 0 32 32">${cloudsAndSunSvg}</svg>`;

    weatherInfo.prepend(weatherType);
  } else if (weatherData.icon === '03d') {
    weatherType.innerHTML = `<svg  width="35" height="35" viewBox="0 0 32 32">${cloudySvg}</svg>`;
    weatherInfo.prepend(weatherType);
  } else if (weatherData.icon === '13d') {
    weatherType.innerHTML = `<svg width="35" height="35" viewBox="0 0 32 32">${snowSvg}</svg>`;

    weatherInfo.prepend(weatherType);
  } else if (weatherData.icon === '10d') {
    weatherType.innerHTML = `<svg width="35" height="35" viewBox="0 0 32 32">${rain}</svg>`;

    weatherInfo.prepend(weatherType);
  } else if (weatherData.icon === '10n') {
    weatherType.innerHTML = `<svg width="35" height="35" viewBox="0 0 32 32">${rainNight}</svg>`;

    weatherInfo.prepend(weatherType);
  }
}

async function getWeather() {
  await getCurrentLocationCoord();
  const data = await getWeatherForToday();

  renderWeatherDataForToday();
}

async function getWeatherForSearchedCity() {
  const data = await getWeatherForToday();

  renderWeatherDataForToday();
}

getWeather();

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

searchForm.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault();

  if (searchInput.value === '') {
    Notify.info('Enter the city name, please!', {
      position: 'center-center',
    });
    return;
  }

  weatherData.city = searchInput.value;
  getCityBackground(searchInput.value);
  getWeatherForSearchedCity();
  // event.currentTarget.reset();
}

function getCityBackground(cityName) {
 
  const URL = 'https://pixabay.com/api/';
  const KEY = '&key=38046505-5b9e748b87046ce765cd21b85';
  const requestParameters = `?image_type=photo&category=travel&orientation=horizontal&q=${cityName}&page=1&per_page=40`;
  const bg = document.querySelector('.backgroundImage');

  fetch(URL + requestParameters + KEY, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(image => {
      console.log(image);
      if (image.hits && image.hits.length > 0) {
        const randomImg = Math.floor(Math.random() * image.hits.length);
        const img = image.hits[randomImg].largeImageURL;
        bg.style.backgroundImage = `url(${img})`;
      } else {
        const requestParameters = `?image_type=photo&category=buildings&orientation=horizontal&q=&page=1&per_page=40`;
        fetch(URL + requestParameters + KEY, {
          method: 'GET',
        })
          .then(res => res.json())
          .then(image => {
            const randomImg = Math.floor(Math.random() * image.hits.length);
            const img = image.hits[randomImg].largeImageURL;
            bg.style.backgroundImage = `url(${img})`;
          });
      }
    })
    .catch(error => {
      console.error('Error fetching background:', error);
    });
}
