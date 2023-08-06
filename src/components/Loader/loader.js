'use strict';

const loader = document.querySelector('.preloader');
const backgroundImage = document.querySelector('.backgroundImage');

function showLoader() {
  loader.classList.replace('is-hidden', 'preloader');
  backgroundImage.classList.replace('backgroundImage', 'is-hidden');
}

function hideLoader() {
  loader.classList.replace('preloader', 'is-hidden');
  backgroundImage.classList.replace('is-hidden', 'backgroundImage');
}

export { showLoader, hideLoader };
