import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP PRESS LIST
 */
class PressListApp extends BasicApp {
  constructor() {
    super();
    return this.initLinks()
      .initPressList();
  }

  /**
   * リンク
   */
  initLinks() {
    //遷移時リスト内のみ切り替えるため、js-pjax__innerクラスをリストに付与
    this.bindEventListener('click', $('.js-pjax__inner__link'), function() {
      $('.press__list').addClass('js-pjax__inner');
    });
    this.bindEventListener('click', $('a.pageNav__link'), function() {
      $('.press').velocity('scroll', {duration: 500, easing: 'easeOutQuart'});
    });
    return this;
  }

  initPressList() {
    var _this = this;
    $('.press__item').each(function(index) {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        Util.loadItem($(this), false, false, _this.setImageSize);
      });
    });
    return this;
  }

  /**
   * 画像の縦横を合わせて正方形にトリミング
   */
  setImageSize() {
    var $image = $(this).find('img');

    //画像の縦横を設定
    if(Util.isOblong($image)) {
      $image.width('auto').height('100%');
    } else {
      $image.height('auto').width('100%');
    }
    return this;
  }
}

export default PressListApp;