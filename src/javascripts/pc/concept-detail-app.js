import BasicApp from './basic-app.js';

/**
 * PC CONCEPT DETAIL
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
    var $image = $('.concept__mainvis__inr');
    this.bindEventListener('scroll', this.$window, () => {
      var scrollTop = this.$window.scrollTop();
      if(scrollTop < this.$window.height()) {
        $image.css({transform: 'translate3d(0, ' + scrollTop / 3 + 'px, 0)', opacity: 1.2 - scrollTop / 500});
      }
    });
    return this;
  }
}

export default ConceptDetailApp;