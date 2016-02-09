import RamenMuseum from './components/RamenMuseum';

const RAMEN_NUM = 50;

let ramenMuseum = new RamenMuseum('.ramen__wrapper', RAMEN_NUM);
let ramenNumElem = document.querySelector('.ramenNum');

let slider = document.querySelector('.slider');
slider.addEventListener('input', function () {
  ramenMuseum.setRamenNum(slider.value);
  ramenNumElem.innerText = slider.value;
});
ramenNumElem.innerText = slider.value = RAMEN_NUM;

window.addEventListener('resize', ramenMuseum.handleResize.bind(ramenMuseum));

//# sourceMappingURL=main-compiled.js.map