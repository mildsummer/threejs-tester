import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP CONCEPT LIST
 */
class ConceptListApp extends BasicApp {
  constructor() {
    super();

    //PC→SPの場合の崩れ防止
    $('.conceptList__txt').removeClass('is-clamped');
    $('.conceptList__txt__wrap').height('');

    return this.bindInview();
  }

  /**
   * インビューイベントを設定
   */
  bindInview() {
    var _this = this;
    $('.conceptList__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        Util.loadItem($(this), false, false, _this.setImageSize);
      });
    });
    $('.conceptList2__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        $(this).addClass('is-visible');
      });
    });
    $('.conceptList2').addClass('is-visible');
    return this;
  }

  /**
   * 画像の縦横を合わせてトリミング
   */
  setImageSize() {
    var $image = $(this).find('img');

    //画像の縦横を設定
    if(Util.isOblong($image, $image.parent())) {
      $image.width('auto').height('100%');
    } else {
      $image.height('auto').width('100%');
    }
    return this;
  }
}

export default ConceptListApp;