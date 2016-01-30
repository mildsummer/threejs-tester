import BasicApp from './basic-app.js';
import SpreadWorkImages from '../components/spread-work-images.js';
import Lightbox from '../components/lightbox.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * SP WORK DETAIL
 */
class WorkDetailApp extends BasicApp {
  constructor() {
    super();
    return this.showMain()
      .initImageList()
      .initLightbox()
      .initExhibitionList()
      .initPressList()
      .initMovie()
      .initSeriesList()
      .initFadeIn();
  }

  /**
   * メインの表示
   */
  showMain() {
    var _this = this;
    $('.detailTtl, .detailTtl__note, .work__mainvis').addClass('is-visible');
    $('.work__imgListBig__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }

  /**
   * 動画の再生
   */
  initMovie() {
    this.bindEventListener('click', $('.work__mainvis__playMovie'), function(event) {
      event.preventDefault();
      $(this).after($(this).parent().find('.js-embedTag').text()).addClass('play');
    });
    return this;
  }

  /**
   * シリーズリストの表示
   */
  initSeriesList() {
    var _this = this;

    //PC→SPにリサイズの場合対応
    try {
      $('.seriesList__list').data('owlCarousel').destroy()
    } catch(e) {
    }

    $('.seriesList__item').each(function() {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function() {
        Util.loadItem($(this), false, false);
      });
    });
    return this;
  }

  /**
   * 画像リスト
   */
  initImageList() {
    //設定
    const MARGIN_WIDTH  = 10;   //余白の幅
    const MARGIN_HEIGHT = 20;   //余白の高さ
    const BASIC_RATIO = 9 / 16; //比率

    this.$container = $('.work__imgList');
    this.$items = this.$container.find('.work__imgList__item');

    //テーブルの生成
    this.spreadWorkImages = new SpreadWorkImages({
      width: this.$container.width(),
      marginWidth: MARGIN_WIDTH,
      marginHeight: MARGIN_HEIGHT,
      basicRatio: BASIC_RATIO,
      isSP: true
    });

    //インビューで配置
    this.bindInviewEventListener(config.inviewOffset, this.$container, this.handleImageListInview.bind(this));
    return this;
  }

  /**
   * タイルを配置
   */
  setImageListTile(tile) {
    tile.$element.css({
      width: tile.width + 'px',
      height: tile.height + 'px',
      top: tile.top + 'px',
      left: tile.left + 'px'
    });
    if(tile.width / tile.height > tile.originalWidth / tile.originalHeight) {
      tile.$element.find('img').width('100%').height('auto');
    } else {
      tile.$element.find('img').width('auto').height('100%');
    }
    this.bindInviewEventListener(config.inviewOffset, tile.$element, function() {
      $(this).addClass('is-visible');
    });
    return this;
  }

  /**
   * 親の高さを合わせる
   */
  setImageListContainerHeight() {
    this.$container.css({
      height: this.spreadWorkImages.getHeight()
    });
    return this;
  }

  /**
   * インビューで配置
   */
  handleImageListInview() {
    //タイルの生成
    var _this = this;
    this.$items.each(function(index) {
      var $image = $(this).find('img');
      var tile = new SpreadWorkImages.Tile($image.width(), $image.height());
      //情報を保持
      tile.index = index;
      tile.$element = $(this);
      _this.spreadWorkImages.addTile(tile);
    });

    //タイルの配置
    this.spreadWorkImages.spreadTiles(this.setImageListTile.bind(this));
    this.setImageListContainerHeight();

    //ウィンドウのリサイズに対応
    var timer;
    this.bindEventListener('resize', $(window), () => {
      clearTimeout(timer);
      timer = setTimeout(this.handleImageListResize.bind(this), config.windowResizeDelay);
    });
    this.handleImageListResize();
    return this;
  }

  /**
   * ウィンドウのリサイズに対応
   */
  handleImageListResize() {
    this.spreadWorkImages.resize({
      width: this.$container.width()
    }, this.setImageListTile.bind(this));
    this.setImageListContainerHeight();
    return this;
  }

  /**
   * ライトボックス
   */
  initLightbox() {
    var _this = this;
    var timer;
    this.lightbox = new Lightbox().handleSPResize();

    //イベント
    this.bindEventListener('resize', $(window), () => {
      clearTimeout(timer);
      timer = setTimeout(this.lightbox.handleSPResize.bind(this.lightbox), config.windowResizeDelay);
    });
    this.bindEventListener('click', $('.work__imgList__item'), function() {
      _this.lightbox.open($('.work__imgList__item').index(this));
      $slide = _this.lightbox.fadeSlider.$shownSlide;
    });
    this.bindEventListener('click', $('.lightbox__close'), this.lightbox.close.bind(this.lightbox));
    this.bindEventListener('click', $('.lightbox__navPrev, .lightbox__navNext'), function() {
      _this.lightbox.nextSlide(!!$(this).attr('class').match('Next'));
      //値のリセット
      $slide = _this.lightbox.fadeSlider.$shownSlide;
      $slide.css('transform', '');
      lastTransform = {x: 0, y: 0, scale: 1.0};
      slideSize = {width: $slide.width(), height: $slide.height()};
      sliderSize = {width: $slider.width(), height: $slider.height()};
    });

    var $slider = $('.lightbox__slider');
    //PC→SP時対応
    $slider.children().css({marginLeft: '', marginTop: ''});
    $slider.css({width: '', height: ''});
    var $slide = this.lightbox.fadeSlider.$shownSlide;

    //パン・ピンチ操作
    var $hammer = $slider.hammer();
    $hammer.data('hammer').get('pinch').set({ enable: true });
    var transform = {x: 0, y: 0, scale: 1.0};
    var slideSize = {width: $slide.width(), height: $slide.height()};
    var sliderSize = {width: $slider.width(), height: $slider.height()};
    var lastTransform = {x: 0, y: 0, scale: 1.0};
    const setTransformValue = function() {
      $slide.css({transform: 'scale(' + transform.scale + ') translate3d(' + transform.x + 'px, ' + transform.y + 'px, 0)'});
    };
    const maxAbs = function(value, max) {
      if(max <= 0) {
        return 0;
      }
      return Math.abs(value) > max ? (!(value < 0) - !(value > 0)) * max : value;
    };

    this.bindEventListener('pan', $hammer, function(event) {
      var maxX = (slideSize.width * transform.scale - sliderSize.width) / 2 / transform.scale;
      var maxY = (slideSize.height * transform.scale - sliderSize.height) / 2 / transform.scale;
      transform.x = maxAbs(lastTransform.x + event.gesture.deltaX / transform.scale, maxX);
      transform.y = maxAbs(lastTransform.y + event.gesture.deltaY / transform.scale, maxY);
      setTransformValue();
    });

    this.bindEventListener('panend', $hammer, function() {
      lastTransform.x = transform.x;
      lastTransform.y = transform.y;
    });

    this.bindEventListener('pinch', $hammer, function(event) {
      transform.scale = lastTransform.scale * event.gesture.scale > 1 ? lastTransform.scale * event.gesture.scale : 1;
      var maxX = (slideSize.width * transform.scale - sliderSize.width) / 2 / transform.scale;
      var maxY = (slideSize.height * transform.scale - sliderSize.height) / 2 / transform.scale;
      transform.x = maxAbs(lastTransform.x + event.gesture.deltaX / transform.scale, maxX);
      transform.y = maxAbs(lastTransform.y + event.gesture.deltaY / transform.scale, maxY);
      setTransformValue();
    });

    this.bindEventListener('pinchend', $hammer, function() {
      lastTransform.scale = transform.scale;
    });

    return this;
  }
}

export default WorkDetailApp;