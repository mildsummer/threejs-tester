import BasicApp from './basic-app.js';
import SpreadTable from '../components/spread-table.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC WORK LIST
 */
class WorkListApp extends BasicApp {
  constructor(isTop) {
    super();

    this.COLUMN_NUMBER = 3;            //列数
    this.ROW_NUMBER = isTop ? 5 : 10;  //行数
    this.MARGIN_WIDTH = 45;            //余白の幅
    this.MARGIN_HEIGHT = 45;           //余白の高さ
    this.IS_FLEX = !isTop;

    return this.init();
  }

  init() {
    this.$container = $('.workList');
    this.$items = this.$container.find('.workList__item');
    this.$item = this.$items.filter('.workList__item:not(.workList__item--vertically)');//基本サイズのタイル
    this.ratio = this.$item.height() / this.$item.width();//縦横比

    //テーブルの生成
    var tileWidth = this.getTileWidth();
    this.spreadTable = new SpreadTable({
      tileWidth: tileWidth,
      tileHeight: tileWidth * this.ratio,
      columnNumber: this.COLUMN_NUMBER,
      rowNumber: this.ROW_NUMBER,
      marginWidth: this.MARGIN_WIDTH,
      marginHeight: this.MARGIN_HEIGHT
    });

    //タイルの生成
    var _this = this;
    this.$items.each(function() {
      _this.addTile(this);
    });

    //タイルの配置
    this.spreadTable.spreadTiles(this.setTile, this.IS_FLEX);
    this.setContainerHeight();

    //追加ロード
    if(this.IS_FLEX) {
      this.page = 1;
      $('.js-loading').remove();
      this.$loading = $('<div>').height(500).addClass('js-loading');
      this.$container.append(this.$loading);
      this.bindInviewEventListener(config.inviewOffset, this.$loading, this.getThenAppendItems.bind(this));
    }

    //インビューで表示
    this.bindInviewEventListener(config.inviewOffset, this.$container, this.showItems.bind(this));

    return this.handleResize();
  }

  /**
   * タイルを生成
   * thisにはDOM要素
   */
  addTile(element) {
    var $element = $(element);
    var tile = new SpreadTable.Tile(1, $element.hasClass('workList__item--vertically') ? 2 : 1);
    //要素を保持
    tile.$element = $element;
    this.spreadTable.addTile(tile);
    return this;
  }

  /**
   * タイルを配置
   */
  setTile(tile) {
    if (tile.placed) {
      tile.$element.css({
        position: 'absolute',
        width: tile.width + 'px',
        height: tile.height + 'px',
        top: tile.top + 'px',
        left: tile.left + 'px'
      });
      if(tile.hasReduced) {
        tile.$element.removeClass('workList__item--vertically');
      }
    } else {
      tile.$element.remove();
    }
    return this;
  }

  /**
   * 現在のタイル幅を取得する
   */
  getTileWidth() {
    return (this.$container.width() - (this.COLUMN_NUMBER - 1) * this.MARGIN_WIDTH) / this.COLUMN_NUMBER;
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
          var _this = this;
          this.$container.find('ul').append($items.each(function() {
            _this.addTile(this);
          }));
          this.spreadTable.spreadTiles(this.setTile, this.IS_FLEX);
          this.setContainerHeight();
          this.showItems();
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

  /**
   * リストを表示
   */
  showItems() {
    $('.workList__item:not(.is-visible)').each(function (index) {
      setTimeout(() => {
        Util.loadItem($(this), true, true);
      }, index * config.showingDelayInterval);
    });
    return this;
  }

  /**
   * リスト全体の高さを調整
   */
  setContainerHeight() {
    this.$container.css({
      position: 'relative'
    }).find('ul').css({
      height: this.spreadTable.getHeight()
    });
    return this;
  }

  /**
   * ウィンドウのリサイズに対応
   */
  handleResize() {
    var $window = $(window);
    var timer;
    var resize = () => {
      var tileWidth = this.getTileWidth();
      this.spreadTable.resize({
        tileWidth: tileWidth,
        tileHeight: tileWidth * this.ratio
      }, this.setTile);
      this.setContainerHeight();
    };
    this.bindEventListener('resize', $window, function () {
      clearTimeout(timer);
      timer = setTimeout(resize, config.windowResizeDelay);
    });
    resize();
  }
}

export default WorkListApp;