/**
 * 全ページ共通
 */
class AbstractApp {
  constructor() {
    this.$window = $(window);
    this.eventListeners = [];
    return this;
  }

  /**
   * イベントリスナーを登録し、データを保持しておく。必ずこのメソッドを通す。
   * @param {string} eventType
   * @param {jQuery} $triggerElement
   * @param {function} callbackFunction
   * @returns {AbstractApp}
   */
  bindEventListener(eventType, $triggerElement, callbackFunction) {
    $triggerElement.bind(eventType, callbackFunction);
    this.eventListeners.push({
      eventType: eventType,
      $triggerElement: $triggerElement,
      callbackFunction: callbackFunction
    });
    return this;
  }

  /**
   * インビューイベントを登録し、データを保持しておく。
   * @param {number} offsetY
   * @param {jQuery} _$triggerElement
   * @param {function} _callbackFunction
   * @returns {AbstractApp}
   */
  bindInviewEventListener(offsetY, _$triggerElement, _callbackFunction) {
    if(!_$triggerElement.length) {
      return this;
    }
    var $window = this.$window;
    var flag = false;
    var callbackFunction = () => {
      if(!flag && $window.height() + $window.scrollTop() > _$triggerElement.offset().top - offsetY) {
        flag = true;
        this.unbindInviewEventListener(_$triggerElement, _callbackFunction);
        _callbackFunction.bind(_$triggerElement.get(0))();
      }
    };
    $window.on('scroll', callbackFunction);
    callbackFunction();
    this.eventListeners.push({
      eventType: 'scroll',
      $triggerElement: $window,
      callbackFunction: callbackFunction,
      inview: true,
      _$triggerElement: _$triggerElement,
      _callbackFunction: _callbackFunction
    });
    return this;
  }

  /**
   * インビューイベントを解除する
   * @param {jQuery} _$triggerElement
   * @param {function} _callbackFunction
   * @returns {AbstractApp}
   */
  unbindInviewEventListener(_$triggerElement, _callbackFunction) {
    this.eventListeners.forEach((eventListener, index) => {
      if(eventListener.inview &&
        eventListener._callbackFunction === _callbackFunction &&
        eventListener._$triggerElement === _$triggerElement) {
        $(window).unbind('scroll', eventListener.callbackFunction);
        this.eventListeners.splice(index, 1);
        return this;
      }
    });
    return this;
  }

  /**
   * イベントリスナーを解除する
   * @param {string} eventType
   * @param {jQuery} $triggerElement
   * @param {function} callbackFunction
   * @returns {AbstractApp}
   */
  unbindEventListener(eventType, $triggerElement, callbackFunction) {
    this.eventListeners.forEach((eventListener, index) => {
      if(eventListener.eventType === eventType &&
        eventListener.$triggerElement === $triggerElement &&
        eventListener.callbackFunction === callbackFunction) {
        $triggerElement.unbind(eventType, callbackFunction);
        this.eventListeners.splice(index, 1);
        return this;
      }
    });
    return this;
  }

  /**
   * イベントリスナーを全て解除する
   * @returns {AbstractApp}
   */
  unbindAllEventListeners() {
    this.eventListeners.forEach(function(eventListener) {
      eventListener.$triggerElement.unbind(eventListener.eventType, eventListener.callbackFunction);
    });
    this.eventListeners.length = 0;
    return this;
  }

  /**
   * JSによる描画処理が終わったら呼ぶ
   * @returns {AbstractApp}
   */
  complete() {
    this.$window.trigger('complete');
    return this;
  }
}

export default AbstractApp;