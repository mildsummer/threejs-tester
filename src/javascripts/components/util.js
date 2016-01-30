class Util {
  constructor() {
    return this;
  }

  /**
   * 要素が完全な正方形か横長ならtrueを返し、縦長ならfalseを返す
   * @param {jQuery} $target 検証対象
   * @param {jQuery} $target2  この引数を入れると、この要素以上横長ならtrueを返す
   * @returns {boolean}
   */
  isOblong($target, $target2) {
    var threshold = 1;
    try {
      threshold = $target2.outerWidth() / $target2.outerHeight();
    }
    catch(e) {
    }
    try {
      return $target.outerWidth() / $target.outerHeight() > threshold;
    }
    catch(e) {
      return false;
    }
  }

  /**
   * 要素の横/縦を返す
   * @param {jQuery} $element
   * @returns {number}
   */
  getRatio($element) {
    try {
      return $element.width() / $element.height();
    }
    catch(e) {
      return 0;
    }
  }

  /**
   * 遅延ロード
   * @param {jQuery} $item
   * @param {boolean} isPC
   * @param {function} callback
   * @returns {*}
   */
  loadItem($item, needsBackground, isPC, callback) {
    var $image = $item.find('[data-' + (isPC ? 'pc' : 'sp') + '-src]');
    if(!$image.length) {
      return $item;
    }

    var $wrapper = $image.parent();
    var image = new Image();
    var src = $image.data((isPC ? 'pc' : 'sp') + '-src');

    function show() {
      if(typeof callback === 'function') callback.bind($item)();//ロード時にコールバック
      if(needsBackground) {
        $wrapper.css({backgroundImage: 'url(' + src + ')'});
      }
      $item.addClass('has-loaded');
    }

    if($image.prop('tagName') === 'IMG') {
      $image.attr('src', src);
    } else {
      $image.css({backgroundImage: 'url(' + src + ')'})
    }
    image.src = src;
    image.width ? show() : $(image).load(show);

    $item.addClass('is-visible');

    return $item;
  }
}

export default new Util();