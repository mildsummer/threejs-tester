import BasicApp from './basic-app.js';
import config from '../components/config.js';

/**
 * PC COMMON
 */
class CommonApp extends BasicApp {
  constructor() {
    super();
    return this.initPjax()
      .initHeader();
  }

  /**
   * ヘッダー
   */
  initHeader() {
    //スクロールでヘッダーをたたむ
    if(this.$window.width() > config.spWidth) {
      var $header = $('header');
      this.bindEventListener('scroll', this.$window, () => {
        $header.toggleClass('is-fixed', this.$window.scrollTop() > 20);
      });
    }
    return this.initMenu()
      .initSPMenu()
      .initLanguageMenu()
      .initSearchBox();
  }

  /**
   * ヘッダーメニュー
   */
  initMenu() {
    const MENU_CLASS = 'headMenu';
    const TOGGLED_CLASS = 'is-visible';
    var $list = $('.' + MENU_CLASS + '__list');
    var $toggle = $('.' + MENU_CLASS + '__list__toggle');
    const handleClick = function() {
      if(!$list.hasClass(TOGGLED_CLASS)) {
        $list.addClass(TOGGLED_CLASS);
        $toggle.addClass(TOGGLED_CLASS);
        $list.css('transform', 'translate3d(0, 0, 0)').velocity({opacity: 1, translateY: 10}, {duration: 400, easing: 'easeOutCubic'});
      } else {
        $list.velocity({opacity: 0, translateY: 0}, {duration: 400, easing: 'easeOutCubic', complete: function() {
          $list.removeClass(TOGGLED_CLASS);
          $toggle.removeClass(TOGGLED_CLASS);
        }});
      }
    };
    this.bindEventListener('click', $toggle, handleClick);
    this.bindEventListener('click', this.$window, function(event) {
      if($list.hasClass(TOGGLED_CLASS) && !($list.find(event.target).length || $toggle.is($(event.target)))) {//閉じる
        handleClick();
      }
    });
    return this;
  }

  /**
   * ヘッダーSPメニュー
   */
  initSPMenu() {
    const TOGGLED_CLASS = 'is-visible';
    var $menu = $('.headMenu');
    this.bindEventListener('click', $('.headMenu__toggle'), function(event) {//SPヘッダーメニュー
      if($menu.hasClass(TOGGLED_CLASS)) {
        $menu.removeClass(TOGGLED_CLASS);
        $menu.velocity('fadeOut', {duration: 240});
      } else {
        $menu.addClass(TOGGLED_CLASS);
        $menu.velocity('fadeIn', {duration: 240});
      }
      event.preventDefault();
    });
    return this;
  }

  /**
   * ヘッダー言語メニュー
   */
  initLanguageMenu() {
    const TOGGLED_CLASS = 'is-visible';
    var $languageMenu = $('.headLangSelect');
    var $languageList = $('.headLangSelect__list');
    var $toggle = $('.headLangSelect__selected');
    const handleClick = function() {
      if(!$languageMenu.hasClass(TOGGLED_CLASS)) {
        $languageMenu.addClass(TOGGLED_CLASS);
        $languageList.css('transform', 'translate3d(0, 0, 0)').velocity({opacity: 1, translateY: 10}, {duration: 400, easing: 'easeOutCubic'});
      } else {
        $languageList.velocity({opacity: 0, translateY: 0}, {duration: 400, easing: 'easeOutCubic', complete: function() {
          $languageMenu.removeClass(TOGGLED_CLASS);
        }});
      }
    };
    this.bindEventListener('click', $toggle, handleClick);
    this.bindEventListener('click', this.$window, function(event) {
      if($languageMenu.hasClass(TOGGLED_CLASS) && !($languageList.find(event.target).length || $toggle.is($(event.target)))) {//閉じる
        handleClick();
      }
    });
    return this;
  }

  /**
   * ヘッダー検索ボックス
   */
  initSearchBox() {
    const SEARCH_CLASS = 'headSearch';
    const TOGGLED_CLASS = 'is-visible';
    var $form = $('.' + SEARCH_CLASS + '__form');
    var $input = $('.' + SEARCH_CLASS + '__input');
    var $submit = $('.' + SEARCH_CLASS + '__submit');
    this.bindEventListener('click', $('.' + SEARCH_CLASS + '__btn'), function() {
      if(!$form.hasClass(TOGGLED_CLASS)) {//検索ボックスを開く
        $form.velocity('fadeIn', {duration: 400, easing: 'easeOutCubic', complete: function() {
          $form.addClass(TOGGLED_CLASS);
          $input.focus();
        }});
      }
    });
    this.bindEventListener('click', this.$window, function(event) {
      if($form.hasClass(TOGGLED_CLASS) && (!$form.parent().find(event.target).length || ($submit.is(event.target) && !$input.val().length))) {//検索ボックスを閉じる
        $form.velocity('fadeOut', {duration: 400, easing: 'easeOutCubic', complete: function() {
          $form.removeClass(TOGGLED_CLASS);
        }});
        event.preventDefault();
      }
    });
    return this;
  }

  /**
   * pjax
   */
  initPjax() {
    const AREA_SELECTOR = '.mainCont';
    const INNER_AREA_SELECTOR = '.js-pjax__inner';//エキシビジョンリストやプレスリストなど、リスト内のみフェードする場合
    const PJAX_DURATION = 200;
    var selector;
    var hasCompleted = false;
    var $body = $('body');

    //初期化
    $.pjax({
      link: '.js-pjax__link',
      //form: 'form',
      area: AREA_SELECTOR,
      //load: {
      //  script: true,
      //  reload: '.localScript'
      //},
      scrollTop: null,
      wait: PJAX_DURATION
    });

    $(document).on('pjax:fetch', function(event) {//リンククリック後、pjax前
      if($(INNER_AREA_SELECTOR).removeClass(INNER_AREA_SELECTOR).length) {
        selector = INNER_AREA_SELECTOR;
      } else {
        selector = AREA_SELECTOR;
        $body.velocity('scroll', {duration: PJAX_DURATION * 2.5, easing: 'easeOutQuart'});
      }
      $(selector).css({opacity: 0, transition: $(AREA_SELECTOR).css('transition')});
      hasCompleted = false;
    });
    this.$window.on('pjax:load', function() {//ロード後
      $(selector).css('opacity', 0);
      window.teamLabDotNet.refresh();//モジュールを更新
      //completeイベントが50ms以内に発生しなかった場合強制表示
      setTimeout(function() {
        if(!hasCompleted) {
          $(selector).css({opacity: 1, transition: $(AREA_SELECTOR).css('transition')});
        }
      }, 50);
    })
    .on('complete', function() {//モジュールを初期化後
      hasCompleted = true;
      $(selector).css({opacity: 1, transition: $(AREA_SELECTOR).css('transition')});
    });

    return this;
  }
}

export default CommonApp;