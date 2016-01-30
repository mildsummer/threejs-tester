import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC CONTACT
 */
class ContactApp extends BasicApp {
  constructor() {
    super();

    return this.initSubmit()
      .initFadeIn();
  }

  /**
   * フェード表示
   */
  initFadeIn() {
    var _this = this;
    $('.fadeIn').each(function () {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function () {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }

  /**
   * 送信処理
   */
  initSubmit() {
    $('.contact__formItem__btn').click(function (event) {
      //バリデーション
      var isCorrect = true;
      $('.contact__formItem--required').each(function () {
        if (!$(this).find('input, textarea').val()) {
          $(this).find('.contact__errorTxt').css('opacity', 1);
          event.preventDefault();
        } else {
          $(this).find('.contact__errorTxt').css('opacity', 0);
        }
      });
    });
    return this;
  }

}

export default ContactApp;