import { Notify } from 'notiflix';
import { submitForm } from '../WeatherData/currentDayData';

const favoriteCity = document.querySelector('.search-form__favourite');
const searchCity = document.querySelector('#search-input');
const favouritesList = document.querySelector('.favourites-list');
const nextButton = document.querySelector('.favourite-next');
const prevButton = document.querySelector('.favourite-prev');
const favouritesListItem = document.querySelector('.favourites-list__item');
let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

loadFromLocalStorage();

// Adaugare in lista a oraselor favorite
favoriteCity.addEventListener('click', addFavouritesListItems);

function addFavouritesListItems() {
  let searchCityName = searchCity.value;
  // notificare daca este deja in lista + return
  const data = localStorage.getItem('savedCities');
  const parsedData = JSON.parse(data) || [];
  if (parsedData.indexOf(searchCityName) !== -1) {
    Notify.info('This city is already marked as favourite', {
      position: 'center-center',
    });
    return;
  }
  savedCities.push(searchCityName);
  localStorage.setItem('savedCities', JSON.stringify(savedCities));
  loadFromLocalStorage();
}
// functie sageata next
nextButton.addEventListener('click', onClickNextBtn);
function onClickNextBtn(event) {
  favouritesList.scrollLeft += favouritesList.clientWidth * 0.2;
}
//  functie sageata prev
prevButton.addEventListener('click', onClickPrevBtn);
function onClickPrevBtn(event) {
  favouritesList.scrollLeft -= favouritesList.clientWidth * 0.2;
}

favouritesList.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.tagName === 'BUTTON') {
    event.target.parentElement.remove();
    const listItem = event.target.parentElement.querySelector(
      '.favourites-list__item-link'
    ).textContent;
    removeFromLocalStorage(listItem);
  }

  if (event.target.tagName === 'P') {
    searchCity.value = event.target.textContent;
    submitForm();
  }
});

function loadFromLocalStorage() {
  const data = localStorage.getItem('savedCities');
  const parsedData = JSON.parse(data);
  console.log(parsedData);
  if (parsedData) {
    const markup = parsedData
      .map(item => {
        return `<li class="favourites-list__item close"><p class="favourites-list__item-link">${item}</p><button class="favourites-list__item-close" type="button"></button></li>`;
      })
      .join('');
    favouritesList.innerHTML = markup;
    checkButtons();
  }
}

function removeFromLocalStorage(listItem) {
  const data = localStorage.getItem('savedCities');
  const parsedData = JSON.parse(data) || [];
  const index = parsedData.indexOf(listItem);
  parsedData.splice(index, 1);
  localStorage.setItem('savedCities', JSON.stringify(parsedData));
  checkButtons();
}

function checkButtons() {
  const containerWidth = favouritesList.clientWidth;
  const contentWidth = favouritesList.scrollWidth;
  const scrollLeft = favouritesList.scrollLeft;

  const isScrolledRight = scrollLeft < contentWidth - containerWidth;
  const isScrolledLeft = scrollLeft > 0;

  prevButton.style.display = isScrolledLeft ? 'block' : 'none';
  nextButton.style.display = isScrolledRight ? 'block' : 'none';
}

favouritesList.addEventListener('scroll', () => {
  checkButtons();
});

function getFavorites() {
  return document.querySelectorAll('.favourites-list__item-link');
}
