import Util from './util.js';
import FadeSlider from './fade-slider.js';

class Lightbox {
  constructor() {
    this.$lightbox = $('.lightbox');
    this.$container = $('.lightbox__slider__wrap');
    this.$wrapper = $('.lightbox__slider');
    this.$index = $('.lightbox__num__body:first');
    this.$images = $('.lightbox__slider__img');
    this.isOpen = false;
    this.isMagnifying = false;//拡大中
    this.zoomToggles = ['is-zoomDown', 'is-zoomUp'];
    this.PADDING = 50;
    this.TRANSITION_END_NAME = 'oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend';

    //スライダーの用意
    this.fadeSlider = new FadeSlider(this.$wrapper, {
      initIndex: 0,
      duration: 500,
      easing: 'ease'
    });

    //画像数を設定
    $('.lightbox__num__body:last').text(this.fadeSlider.length);

    //ドラッグでスクロール
    //var startPoint;
    //var startScroll;
    //var isVerticalScroll;
    //this.bindEventListener('mousedown', $images, function(event) {
    //  if(!$(this).data('hidden') && isMagnifying) {
    //    startPoint = {x: event.clientX, y: event.clientY};
    //    startScroll = {top: $container.scrollTop(), left: $container.scrollLeft()};
    //    isVerticalScroll = $container.css('overflowY') === 'scroll';
    //    event.preventDefault();
    //  }
    //});
    //this.bindEventListener('mousemove', $(window), function(event) {
    //  if(startPoint) {
    //    if(isVerticalScroll) {
    //      $container.scrollTop(startScroll.top - (event.clientY - startPoint.y));
    //    } else {
    //      $container.scrollLeft(startScroll.left - (event.clientX - startPoint.x));
    //    }
    //    event.preventDefault();
    //  }
    //});
    //this.bindEventListener('mouseup mouseout', $(window), function(event) {
    //  startPoint = null;
    //  startScroll = null;
    //});

    return this;
  }

  /**
   * $containerと$wrapperのサイズを調整
   * @param shownWidth
   * @param shownHeight
   * @returns {Lightbox}
   */
  setSize(shownWidth, shownHeight) {
    if(this.isMagnifying) {
      if (Util.isOblong(this.fadeSlider.$shownSlide, this.$container)) {
        this.$container.css({overflowX: 'scroll', overflowY: 'hidden'});
      } else {
        this.$container.css({overflowX: 'hidden', overflowY: 'scroll'});
      }
      this.$wrapper.css({
        width: shownWidth ? shownWidth : this.fadeSlider.$shownSlide.width(),
        height: shownHeight ? shownHeight : this.fadeSlider.$shownSlide.height(),
        transition: this.fadeSlider.transition
      });
    } else {
      this.$container.css({overflowX: 'hidden', overflowY: 'hidden'});
      this.$wrapper.css({
        width: this.$container.width() - this.PADDING * 2,
        height: this.$container.height() - this.PADDING * 2,
        transition: this.fadeSlider.transition
      });
    }
    return this;
  }

  /**
   * ウィンドウのリサイズに対応
   * @returns {Lightbox}
   */
  handleResize() {
    this.$lightbox.show();
    var shownWidth, shownHeight;
    var _this = this;
    this.$images.each(function(index) {
      var $image = $(this);
      var isShownSlide = (index === _this.fadeSlider.index);
      var width, height;
      var marginLeft = 0;
      var marginTop = 0;
      if(Util.isOblong($image, _this.$container)) {
        if(_this.isMagnifying) {
          height = _this.$container.height() - _this.PADDING * 2;
          width = height * Util.getRatio($image);
        } else {
          width = _this.$container.width() - _this.PADDING * 2;
          height = width / Util.getRatio($image);
          marginTop = (_this.$container.height() - height) / 2 - _this.PADDING;
        }
      } else {
        if(_this.isMagnifying) {
          width = _this.$container.width() - _this.PADDING * 2;
          height = width / Util.getRatio($image);
        } else {
          height = _this.$container.height() - _this.PADDING * 2;
          width = height * Util.getRatio($image);
          marginLeft = (_this.$container.width() - width) / 2 - _this.PADDING;
        }
      }
      $image.css({
        width: width,
        height: height,
        marginLeft: marginLeft,
        marginTop: marginTop,
        transition: isShownSlide ? _this.fadeSlider.transition : 'none'
      });
      if(isShownSlide) {
        shownWidth = width;
        shownHeight = height;
      }
    });
    this.setSize(shownWidth, shownHeight);
    this.$lightbox.toggle(this.isOpen);
    return this;
  }

  /**
   * ウィンドウのリサイズに対応（SP）
   * @returns {Lightbox}
   */
  handleSPResize() {
    this.$lightbox.show();
    var _this = this;
    this.$images.each(function(index) {
      var $image = $(this);
      if(Util.isOblong($image, _this.$container)) {
        $image.width('100%').height('auto');
      } else {
        $image.width('auto').height('100%');
      }
    });
    this.$lightbox.toggle(this.isOpen);
    return this;
  }

  /**
   * スライドを指定して開く
   * @param index
   * @returns {Lightbox}
   */
  open(index) {
    $('body').css({overflow: 'hidden'});
    this.isOpen = true;
    this.fadeSlider.index = index;
    this.fadeSlider.render(true);
    //this.setSize();
    this.$index.text(index + 1);
    this.$lightbox.velocity('fadeIn', {duration: 200, complete: function() {
    }});
    return this;
  }

  /**
   * 閉じる
   * @returns {Lightbox}
   */
  close() {
    $('body').css({overflow: 'auto'});
    this.$lightbox.velocity('fadeOut', {duration: 200, complete: () => {
      this.$lightbox.hide();
      this.isOpen = false;
    }});
    return this;
  }

  /**
   * 拡大と縮小
   * @returns {Lightbox}
   */
  toggleZoom() {
    this.isMagnifying = !this.isMagnifying;
    this.$wrapper.toggleClass('is-zoomUp', this.isMagnifying);
    $('.lightbox__zoom').removeClass(this.zoomToggles[this.isMagnifying * 1]).addClass(this.zoomToggles[!this.isMagnifying * 1]);
    this.fadeSlider.$shownSlide.css({transition: this.fadeSlider.transition});
    this.handleResize();
    return this;
  }

  /**
   * スライド切り替え
   * @param {boolean} direction
   * @returns {Lightbox}
   */
  nextSlide(direction) {
    this.fadeSlider.next(direction);
    this.$index.text(this.fadeSlider.index + 1);
    //this.setSize();
    return this;
  }
}

export default Lightbox;