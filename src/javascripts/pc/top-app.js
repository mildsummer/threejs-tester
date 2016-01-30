import WorkListApp from './work-list-app.js';
import config from '../components/config.js';

/**
 * PC TOP
 */
class TopApp extends WorkListApp {
  constructor() {
    super(true);//作品リストを配置
    return this.showMain()
      .initParallax()
      .initExhibitionList()
      .setExhibitionListHeight()
      .initPressList()
      .initFadeIn();
  }

  /**
   * メインの表示
   */
  showMain() {
    $('.topMainvis__inr').addClass('is-visible');
    $('.topMainvis__info').addClass('is-visible');
    return this;
  }

  /**
   * メイン画像のパララックス
   */
  initParallax() {
    var $window = $(window);
    var $image = $('.topMainvis__img__wrap');
    this.bindEventListener('scroll', $window, function() {
      var scrollTop = $window.scrollTop();
      if(scrollTop < $window.height()) {
        $image.css({transform: 'translate3d(0, ' + scrollTop / 3 + 'px, 0)', opacity: 1.5 - scrollTop / 350});
      }
    });
    return this;
  }
}

export default TopApp;