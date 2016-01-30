import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC CONCEPT LIST
 */
class ConceptListApp extends BasicApp {
  constructor() {
    super();

    this.$items = $('.conceptList__item');
    var _this = this;

    //リストの高さを合わせる
    var timer;
    this.bindEventListener('resize', $(window), () => {
      clearTimeout(timer);
      timer = setTimeout(this.setConceptHeight.bind(this), config.windowResizeDelay);
    });

    //リストの表示
    this.$items.each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        Util.loadItem($(this), false, true, _this.setImageSize);
      });
    });
    this.bindInviewEventListener(config.inviewOffset, $('.conceptList2'), function() {
      $(this).addClass('is-visible').find('.conceptList2__item').each(function(index) {
        window.setTimeout(() => {
          $(this).addClass('is-visible');
        }, 300 + config.showingDelayInterval * index);
      });
    });

    return this.setImageSize()
      .setConceptHeight();
  }

  /**
   * 画像の縦横を合わせて正方形にトリミング
   */
  setImageSize() {
    var $image = $(this).find('img');

    //画像の縦横を設定
    if(Util.isOblong($image)) {
      $image.width('auto').height('100%');
    } else {
      $image.height('auto').width('100%');
    }
    return this;
  }

  /**
   * 高さに応じて説明を畳む
   */
  setConceptHeight() {
    this.$items.each(function() {
      var $item = $(this);
      var $text = $item.find('.conceptList__txt');
      var $textWrap = $item.find('.conceptList__txt__wrap');
      var $imageWrap = $item.find('.conceptList__img__wrap');

      //高さを計算
      var excess = $item.find('.conceptList__item__inr').get(0).clientHeight - $imageWrap.height();
      var preHeight = $textWrap.height();
      var newHeight = preHeight - excess;
      var lineHeight = parseFloat($text.css('lineHeight'));
      newHeight = lineHeight * Math.floor(newHeight / lineHeight);

      if(newHeight < $text.height()) {
        $text.addClass('is-clamped');
      } else {
        $text.removeClass('is-clamped');
      }

      //高さを行に合わせる
      //var lineHeight = window.parseFloat($text.css('lineHeight'));
      //var rowNumber = Math.floor(newHeight / lineHeight);
      //newHeight = lineHeight * rowNumber;

      //スタイルを反映
      if(newHeight > 0) {
        $textWrap.height(newHeight);
        //$item.find('.conceptList__txt').get(0).style.webkitLineClamp = rowNumber;
      }
    });
    return this;
  }
}

export default ConceptListApp;