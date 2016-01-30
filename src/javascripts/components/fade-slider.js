import Util from './util.js';

class FadeSlider {
  constructor($wrapper, options) {
    this.$wrapper = $wrapper;
    this.options = options;
    this.index = options.initIndex;
    this.transition = 'width ' + options.duration + 'ms ' + options.easing + ', height ' + options.duration + 'ms ' + options.easing + ', opacity ' + options.duration + 'ms ' + options.easing + ', margin-left ' + options.duration + 'ms ' + options.easing + ', margin-top ' + options.duration + 'ms ' + options.easing;

    $wrapper.children().each(function(index) {
      var isShown = options.index === index;
      $(this).css({
        position: 'absolute',
        opacity: isShown ? 1 : 0,
        zIndex: isShown ? 1 : 0
      }).attr('data-hidden', !isShown);
    });

    this.length = $wrapper.children().length;

    return this.render(true);
  }

  next(direction) {
    var _direction = typeof direction === 'undefined' ? true : (direction ? true : false);
    this.index = (this.length + (this.index + (_direction * 2 - 1))) % this.length;
    this.render();
    return this;
  }

  render(isFast) {
    var $shownSlide = this.$wrapper.children(':nth-child(' + (this.index + 1) + ')');
    this.$wrapper.children('[data-hidden=false]').css({opacity: 0, transition: isFast ? 'none' : this.transition}).attr('data-hidden', true);
    $shownSlide.css({opacity: 1, transition: isFast ? 'none' : this.transition}).attr('data-hidden', false);
    setTimeout(this.handleAnimationEnd.bind(this), this.options.duration);
    this.$shownSlide = $shownSlide;
    return this;
  }

  handleAnimationEnd() {
    this.$wrapper.children('[data-hidden=true]').css('z-index', 0);
    this.$wrapper.children('[data-hidden=false]').css('z-index', 1);
    return this;
  }
};

export default FadeSlider;