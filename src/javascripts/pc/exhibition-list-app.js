import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC EXHIBITION LIST
 */
class ExhibitionListApp extends BasicApp {
  constructor() {
    super();

    /**
     * エキシビジョンリストの表示（遅延ロード）
     */
    this.page = 1;
    this.$list = $('.exhibitionList__list');
    this.bindInviewEventListener(config.inviewOffset, this.$list, this.loadItems.bind(this));
    $('.js-loading').remove();
    this.$loading = $('<div>').height(500).addClass('js-loading');
    $('.exhibition').append(this.$loading);
    this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));//追加ロード

    /**
     * 遷移時リスト内のみ切り替えるため、js-pjax__innerクラスをリストに付与
     */
    this.bindEventListener('click', $('.js-pjax__inner__link'), function(event) {
      $('.exhibitionList__list').addClass('js-pjax__inner');
      $(this).parent().parent()
        .find('.is-current').removeClass('is-current');
      $(this).parent().addClass('is-current');
      //event.preventDefault();
    });

    return this;
  }

  /**
   * 順番に遅延ロード
   */
  loadItems() {
    $('.exhibitionList__item:not(.is-visible)').each(function (index) {
      setTimeout(() => {
        Util.loadItem($(this), true, true);
      }, index * config.showingDelayInterval);
    });
    return this;
  }

  /**
   * リスト追加分を取得し、挿入
   */
  getThenAppendItems() {
    this.page++;
    $.ajax({
      type: 'GET',
      url: '/exhibitions' + (window.location.search ? (window.location.search + '&') : '?') + 'page=' + this.page,
      success: (data) => {
        var $items = $($.parseHTML(data)).find('.exhibitionList__item');
        if ($items.length) {
          this.$list.append($items);
          this.loadItems();
          this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));
        } else {
          this.$loading.remove();
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus);
      }
    });
    return this;
  }
}

export default ExhibitionListApp;