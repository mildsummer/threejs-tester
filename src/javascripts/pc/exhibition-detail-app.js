import BasicApp from './basic-app.js';

/**
 * PC EXHIBITION DETAIL
 */
class ExhibitionDetailApp extends BasicApp {
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
    $('.exhibition__mainvis').addClass('is-visible');
    $('.exhibition__inr').addClass('is-visible');
    return this;
  }

  /**
   * メイン画像のパララックス
   */
  initParallax() {
    var $image = $('.exhibition__mainvis__inr');
    this.bindEventListener('scroll', this.$window, () => {
      var scrollTop = this.$window.scrollTop();
      if(scrollTop < this.$window.height()) {
        $image.css({transform: 'translate3d(0, ' + scrollTop / 3 + 'px, 0)', opacity: 1.2 - scrollTop / 500});
      }
    });
    return this;
  }
}

export default ExhibitionDetailApp;