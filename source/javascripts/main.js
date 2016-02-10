import RamenMuseum from './components/RamenMuseum';

const RAMEN_NUM = 50;

let ramenMuseum = new RamenMuseum('.ramen__wrapper', RAMEN_NUM);
let $ramenNum = $('.ramenNum');

let $slider = $('.slider');
$slider.on('input', function() {
  ramenMuseum.setRamenNum($slider.val());
  $ramenNum.text($slider.val());
});
$ramenNum.text(RAMEN_NUM);
$slider.val(RAMEN_NUM);

$('.ramenTypeButton').click(function() {
  ramenMuseum.toggleRamenType();
  if(ramenMuseum.ramenType === ramenMuseum.RAMEN_TYPE_MESH) {
    $(this).text('>Mesh / Sprite');
  } else {
    $(this).text('Mesh / >Sprite');
  }
});

$(window).resize(ramenMuseum.handleResize.bind(ramenMuseum));