import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP EXHIBITION LIST
 */
class ExhibitionListApp extends BasicApp {
  constructor() {
    super();
    return this.bindLoading()
      .bindInview();
  }

  /**
   * リストの追加ロードイベントを設定
   */
  bindLoading() {
    this.page = 1;
    this.$list = $('.exhibitionList__list');
    $('.js-loading').remove();
    this.$loading = $('<div>').height(500).addClass('js-loading');
    $('.exhibition').append(this.$loading);
    this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));//追加ロード
    return this;
  }

  /**
   * リストにインビューイベントを設定
   */
  bindInview() {
    var _this = this;
    $('.exhibitionList__item:not(.is-visible)').each(function () {
      _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
        Util.loadItem($(this), true, false);
      });
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
          this.bindInview();
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