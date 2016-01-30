import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP SEARCH
 */
class SearchApp extends BasicApp {
  constructor() {
    super();

    /**
     * 遷移時リスト内のみ切り替えるため、js-pjax__innerクラスをリストに付与
     */
    this.bindEventListener('click', $('.js-pjax__inner__link'), function(event) {
      $('.searchResult__wrap').addClass('js-pjax__inner');
      $(this).parent().parent()
        .find('.is-current').removeClass('is-current');
      $(this).parent().addClass('is-current');
      //event.preventDefault();
    });

    return this.initResultList()
      .initFadeIn();
  }

  /**
   * 結果リストの表示
   */
  initResultList() {
    var _this = this;
    $('.searchResult__item').each(function () {
      _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
        Util.loadItem($(this), false, false, () => {
          $(this).parent().find('.searchResult__img__wrap2').css('backgroundImage', 'url(' + $(this).find('img').attr('src') + ')');
        });
      });
    });
    return this;
  }

  /**
   * フェードインのセット
   */
  initFadeIn() {
    var _this = this;
    $('.searchResult__ttl, .searchResult__info, .searchResult__moreLink__wrap, .pressEntry__concept__item, .pressList__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }

}

export default SearchApp;