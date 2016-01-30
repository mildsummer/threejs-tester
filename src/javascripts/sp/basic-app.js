import AbstractApp from '../components/abstract-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

class BasicApp extends AbstractApp {
  constructor() {
    super();
    return this;
  }

  /**
   * フェードインのセット
   */
  initFadeIn() {
    var _this = this;
    $('.exhibitionList__ttl, .exhibitionList__more, .pressList__ttl, .pressList__more, .work__description, .detail__related, .detail__sns, .seriesList__ttl, .workList__more, .workListLittle__ttl, .workListLittle__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }

  /**
   * エキシビジョンリストの表示
   */
  initExhibitionList() {
    var _this = this;
    const bindInview = function() {
      $('.exhibitionList__item:visible').each(function() {
        _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
          Util.loadItem($(this), true, false);
        });
      });
    };
    bindInview();
    this.bindEventListener('click', $('.exhibitionList__moreBtn'), function(event) {//リストの追加
      event.preventDefault();
      var $more = $(this);
      $more.velocity({opacity: 0}, {duration: 100, easing: 'easeOutCubic', complete: () => {
        var $items = $('.exhibitionList__item:nth-child(n+4)');
        var $ul = $items.parent();
        var $list = $('.exhibitionList');
        var height = $list.height();
        var additionHeight = $ul.height();//現在の高さを入れておく
        $list.css({maxHeight: height});
        $items.css('display', 'inline-block');
        additionHeight = $ul.height() - additionHeight;
        $list.velocity({
          maxHeight: height + additionHeight - 136//moreボタンの分減らしておく
        }, {duration: 300, easing: 'easeOutCubic', complete: function() {
          $list.css('maxHeight', '');
          bindInview();
          $more.hide();
        }});
      }});
    });
    return this;
  }

  /**
   * プレスリストの表示
   */
  initPressList() {
    var _this = this;
    const bindInview = function() {
      $('.pressList__item:visible').each(function () {
        _this.bindInviewEventListener(config.inviewOffset, $(this), () => {
          $(this).addClass('is-visible');
        });
      });
    };
    bindInview();
    this.bindEventListener('click', $('.pressList__moreBtn'), function(event) {//リストの追加
      event.preventDefault();
      var $more = $(this);
      $more.velocity({opacity: 0}, {duration: 200, easing: 'easeOutCubic', complete: () => {
        var $items = $('.pressList__item:nth-child(n+4)');
        var $ul = $items.parent();
        var $list = $('.pressList');
        var height = $list.height();
        var additionHeight = $ul.height();//現在の$ulの高さを入れておく
        $list.css({maxHeight: height});
        $items.show();
        additionHeight = $ul.height() - additionHeight;
        $list.velocity({
          maxHeight: height + additionHeight - 114//moreボタンの分減らしておく
        }, {duration: 300, easing: 'easeOutCubic', complete: function() {
          $list.css('maxHeight', '');
          bindInview();
          $more.hide();
        }});
      }});
    });
    return this;
  }

  /**
   * 動画の再生
   */
  initMovie() {
    this.bindEventListener('click', $('.workListLittle__img__btn'), function(event) {
      event.preventDefault();
      $(this).after($(this).find('.js-embedTag').text()).addClass('play');
    });
    this.bindEventListener('click', $('.workListLittle__btn--play'), function(event) {
      event.preventDefault();
      var $a = $(this).parent().parent().parent().find('.workListLittle__img__btn');
      $a.after($a.find('.js-embedTag').text()).addClass('play');
    });
    return this;
  }
}

export default BasicApp;