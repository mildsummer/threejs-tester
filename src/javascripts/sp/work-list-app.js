import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP WORK LIST
 */
class WorkListApp extends BasicApp {
  constructor() {
    super();
    return this.bindLoading()
      .bindInviewItems();
  }

  /**
   * リストの追加ロードイベントを設定
   */
  bindLoading() {
    this.page = 1;
    $('.js-loading').remove();
    this.$loading = $('<div>').height(500).addClass('js-loading');
    this.$list = $('.workList__list');
    $('.workList').append(this.$loading);
    this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));//追加ロード
    return this;
  }

  /**
   *  インビューイベントを設定
   */
  bindInviewItems() {
    var _this = this;
    $('.workList__item:not(.is-visible)').each(function () {
      _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
        Util.loadItem($(this), true, false);
      });
    });
    return this;
  }

  /**
   * リストの追加分を取得して、挿入
   */
  getThenAppendItems() {
    this.page++;
    $.ajax({
      type: 'GET',
      url: '/works' + (window.location.search ? (window.location.search + '&') : '?') + 'page=' + this.page,
      success: (data) => {
        var $items = $($.parseHTML(data)).find('.workList__item');
        if($items.length) {
          this.$list.append($items);
          this.bindInviewItems();
          this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));
        } else {
          this.$loading.remove();
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus);
      }
    });
    return this;
  }
}

export default WorkListApp;