import { gsap } from 'gsap';
import './components/Quotes/quotes';
import './components/Background/background';
import './components/FavoritesList/favoriteList';

function animateSquares() {
  const cubeFirst = document.querySelector('.cube-first');
  const cubeSecond = document.querySelector('.cube-second');

  gsap.to(cubeFirst, {
    duration: 30,
    x: 1200,
    y: 600,
    rotate: 400,
    repeat: -1,
    yoyo: true,
  });

  gsap.to(cubeSecond, {
    duration: 30,
    x: -1000,
    y: 800,
    rotate: 400,
    repeat: -1,
    yoyo: true,
  });
}

animateSquares();
