import BasicApp from './basic-app.js';
import SpreadWorkImages from '../components/spread-work-images.js';
import Lightbox from '../components/lightbox.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC WORK DETAIL
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
      .initFadeIn()
      .initSlider();
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
    var $play = $('.work__mainvis__playMovie, .work__mainvis__playYouku');
    var $inr = $('.work__mainvis__inr');

    //マウスオーバー
    this.bindEventListener('mouseover', $play, function() {
      $inr.addClass('is-hovered');
    });
    this.bindEventListener('mouseout', $play, function() {
      $inr.removeClass('is-hovered');
    });

    this.bindEventListener('click', $play, function(event) {
      event.preventDefault();
      $(this).after($(this).parent().find('.js-embedTag').text()).addClass('play');
    });
    return this;
  }

  /**
   * 画像リスト
   */
  initImageList() {
    //設定
    const MARGIN_WIDTH  = 20;   //余白の幅
    const MARGIN_HEIGHT = 60;   //余白の高さ
    const BASIC_RATIO = 9 / 16; //比率

    this.$container = $('.work__imgList');
    this.$items = this.$container.find('.work__imgList__item');

    //テーブルの生成
    this.spreadWorkImages = new SpreadWorkImages({
      width: this.$container.width(),
      marginWidth: MARGIN_WIDTH,
      marginHeight: MARGIN_HEIGHT,
      basicRatio: BASIC_RATIO
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
    this.lightbox = new Lightbox().handleResize();

    //イベント
    this.bindEventListener('resize', $(window), () => {
      clearTimeout(timer);
      timer = setTimeout(this.lightbox.handleResize.bind(this.lightbox), config.windowResizeDelay);
    });
    this.bindEventListener('click', $('.work__imgList__item'), function() {
      _this.lightbox.open($('.work__imgList__item').index(this));
    });
    this.bindEventListener('click', $('.lightbox__close'), this.lightbox.close.bind(this.lightbox));
    this.bindEventListener('click', $('.lightbox__navPrev, .lightbox__navNext'), function() {
      _this.lightbox.nextSlide(!!$(this).attr('class').match('Next')).setSize();
    });
    this.bindEventListener('click', $('.lightbox__zoom').add(this.lightbox.$images), this.lightbox.toggleZoom.bind(this.lightbox));

    return this;
  }

  /**
   * シリーズのスライダー
   */
  initSlider() {
    var $list = $('.seriesList__list');

    //スライダーの設置
    $list.owlCarousel({
      items: 4,
      responsive: true,
      navigation: true,
      pagination: false,
      navigationText: false,
      addClassActive: true,
      slideSpeed: 600,
      rewindNav: false,
      mouseDrag: false,
      touchDrag: false
    });

    //表示+遅延ロード
    this.bindInviewEventListener(config.inviewOffset, $list, function() {
      $('.seriesList__item').each(function() {
        Util.loadItem($(this), false, true);
      });
    });
    return this;
  }
}

export default WorkDetailApp;