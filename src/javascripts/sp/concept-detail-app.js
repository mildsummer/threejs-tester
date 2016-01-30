import BasicApp from './basic-app.js';
import config from '../components/config.js';

/**
 * SP CONCEPT DETAIL
 */
class ConceptDetailApp extends BasicApp {
  constructor() {
    super();
    return this.showMain()
      .initParallax()
      .initMovie()
      .initPressList()
      .initFadeIn();
  }

  /**
   * メインの表示
   */
  showMain() {
    $('.concept__mainvis').addClass('is-visible');
    $('.concept__inr').addClass('is-visible');
    $('.concept__ttl').addClass('is-visible');
    return this;
  }

  /**
   * メイン画像のパララックス
   */
  initParallax() {
    var $window = $(window);
    var $image = $('.concept__mainvis__inr');
    this.bindEventListener('scroll', $window, function() {
      var scrollTop = $window.scrollTop();
      if(scrollTop < $window.height()) {
        $image.css({transform: 'translate3d(0, ' + scrollTop / 3 + 'px, 0)', opacity: 1 - scrollTop / 500});
      }
    });
    return this;
  }
}

export default ConceptDetailApp;