import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC SEARCH
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
      .initPressList()
      .initConceptList()
      .initFadeIn();
  }

  /**
   * 結果リストの表示
   */
  initResultList() {
    var _this = this;
    $('.searchResult__list').each(function() {
      var $this = $(this);
      _this.bindInviewEventListener(config.inviewOffset, $this, function() {
        $this.children().each(function(index) {
          setTimeout(() => {
            Util.loadItem($(this), false, true, () => {
              $(this).find('.searchResult__img__wrap2').css('backgroundImage', 'url(' + $(this).find('img').attr('src') + ')');
            });
          }, index * config.showingDelayInterval);
        });
      });
    });
    return this;
  }

  /**
   * コンセプト結果リストの表示
   */
  initConceptList() {
    this.bindInviewEventListener(config.inviewOffset, $('.pressEntry__concept__list'), function() {
      $('.pressEntry__concept__item').each(function(index) {
        setTimeout(() => {
          $(this).addClass('is-visible');
        }, index * config.showingDelayInterval);
      });
    });
    return this;
  }

  /**
   * フェードインのセット
   */
  initFadeIn() {
    var _this = this;
    $('.searchResult__ttl, .searchResult__info, .searchResult__moreLink__wrap').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }
}

export default SearchApp;