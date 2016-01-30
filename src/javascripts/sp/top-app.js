import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP TOP
 */
class TopApp extends BasicApp {
  constructor() {
    super();
    return this.showMain()
      .initWorkList()
      .initExhibitionList()
      .initPressList()
      .initFadeIn();
  }

  /**
   * メインの表示
   */
  showMain() {
    $('.topMainvis__inr').addClass('is-visible');
    $('.topMainvis__info').addClass('is-visible');
    //PC→SPの場合の対応
    $('.topMainvis__img__wrap').css({transform: '', opacity: ''});
    return this;
  }

  /**
   * 作品リストの表示
   */
  initWorkList() {
    var _this = this;
    $('.workList__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
        Util.loadItem($(this), true, false);
      });
    });
    return this;
  }
}

export default TopApp;