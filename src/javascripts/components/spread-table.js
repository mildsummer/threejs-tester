/**
 * 指定のn*nマスの表に過不足なくタイルを敷き詰め、各タイルの座標を決定する
 * 要素を直接書き換えるのではなく、座標などを管理する
 */
class SpreadTable {
  constructor(options) {
    return this.setOptions(options).clear();
  }

  /**
   * オプションを設定
   * @param {object} options
   * @returns {SpreadTable}
   */
  setOptions(options) {
    if (typeof options !== 'object') {
      options = {};
    }

    this.tileWidth    = parseFloat(options.tileWidth, 10) ? parseFloat(options.tileWidth, 10) : 100;      //タイルの幅
    this.tileHeight   = parseFloat(options.tileHeight, 10) ? parseFloat(options.tileHeight, 10) : 100;    //タイルの高さ
    this.rowNumber    = parseInt(options.rowNumber, 10) ? parseInt(options.rowNumber, 10) : 5;            //行数
    this.columnNumber = parseInt(options.columnNumber, 10) ? parseInt(options.columnNumber, 10) : 5;      //列数
    this.marginWidth  = parseFloat(options.marginWidth, 10) ? parseFloat(options.marginWidth, 10) : 20;   //余白の幅
    this.marginHeight = parseFloat(options.marginHeight, 10) ? parseFloat(options.marginHeight, 10) : 20; //余白の高さ

    return this;
  }

  /**
   * テーブルを初期化
   * @returns {SpreadTable}
   */
  clear() {
    //仮想のテーブルを表す２次元配列を生成
    var table = [];
    for (var i = 0, l1 = this.rowNumber; i < l1; i++) {
      table[i] = [];
      for (var j = 0, l2 = this.columnNumber; j < l2; j++) {
        table[i][j] = true;//trueなら空いている
      }
    }
    this.table = table;
    this.spaceNumber = this.rowNumber * this.columnNumber;//空白の数
    this.tiles = [];

    return this;
  }

  /**
   * タイルの追加
   * @param {tile} tile
   * @returns {SpreadTable}
   */
  addTile(tile) {
    tile.setSize(this.tileWidth * tile.rowWidth + (tile.rowWidth - 1) * this.marginWidth, this.tileHeight * tile.columnHeight + (tile.columnHeight - 1) * this.marginHeight);
    tile.index = this.tiles.length;
    this.tiles.push(tile);
    return this;
  }

  /**
   * 敷き詰めアルゴリズムを実行
   * @param {function} callback 各タイル度に呼ばれ、Tileを渡す。配置が成功したタイルはplacedがtrueになる。
   * @param {boolean} isFlex テーブルの行数をタイルに合わせて変化させるかどうか
   * @returns {SpreadTable}
   */
  spreadTiles(callback, isFlex) {
    var table = this.table;
    var _callback = typeof callback === 'function' ? callback : function() {};

    tilesfor: for (var i = 0, l1 = this.tiles.length; i < l1; i++) {
      var tile = this.tiles[i];
      if(tile.placed) continue;
      for (var j = 0, l2 = table.length; j < l2; j++) {//行ごと
        for (var k = 0, l3 = table[j].length; k < l3; k++) {//セルごと
          var placeable = true;

          //配置可能かどうかの捜査
          placeablefor: for (var l = 0, l4 = tile.rowWidth; l < l4; l++) {
            for (var m = 0, l5 = tile.columnHeight; m < l5; m++) {
              if (!(table[j + m] && table[j + m][k + l])) {
                //この位置には置けない
                placeable = false;
                break placeablefor;
              }
            }
          }

          if (placeable) {
            //配置
            for (var l = 0, l4 = tile.rowWidth; l < l4; l++) {
              for (var m = 0, l5 = tile.columnHeight; m < l5; m++) {
                table[j + m][k + l] = false;
                this.spaceNumber--;
              }
            }
            tile.setPosition(k, j, j * this.tileHeight + j * this.marginHeight, k * this.tileWidth + k * this.marginWidth);
            _callback(tile);
            continue tilesfor;
          }
        }
      }
      if(isFlex) {//Flexなら、今の行数では配置できない場合tableを1行拡張し同じタイルについてもう一度捜査する
        var row = [];
        for (var j = 0, l2 = this.columnNumber; j < l2; j++) {
          row[j] = true;
        }
        table.push(row);
        this.rowNumber++;
        this.spaceNumber += this.columnNumber;
        i--;
      } else if (this.spaceNumber > 0) {//Flexでないなら、rowWidthとcolumnHeightを1にしてもう一度捜査する
        tile.rowWidth = tile.columnHeight = 1;
        tile.setSize(this.tileWidth, this.tileHeight);
        tile.hasReduced = true;//フラグをつける
        i--;
      } else {
        _callback(tile);
      }
    }

    //Flexなら、tableの無駄な行を詰める
    rowfor: for (var i = table.length - 1; i >= 0; i--) {//行ごと
      for (var j = 0, l = table[i].length; j < l; j++) {//セルごと
        if(!table[i][j]) {
          continue rowfor;
        }
      }
      table.splice(i, 1);
      this.rowNumber--;
      this.spaceNumber -= this.columnNumber;
    }

    return this;
  }

  /**
   * テーブル全体の幅を返す
   * @returns {number}
   */
  getWidth() {
    return this.tileWidth * this.columnNumber + this.marginWidth * (this.columnNumber - 1);
  }

  /**
   * テーブル全体の高さを返す
   * @returns {number}
   */
  getHeight() {
    return this.tileHeight * this.rowNumber + this.marginHeight * (this.rowNumber - 1);
  }

  /**
   * オプションを渡して、位置を計算し直す
   * @param {object} options
   * @param {function} callback 各タイルを再設置する度に呼ばれ、タイルを渡す
   * @returns {SpreadTable}
   */
  resize(options, callback) {
    var _callback = typeof callback === 'function' ? callback : function() {};

    //サイズの再設定
    for(var key in options) {
      this[key] = options[key];
    }

    this.tiles.forEach(tile => {
      tile.setPosition(tile.x, tile.y, tile.y * this.tileHeight + tile.y * this.marginHeight, tile.x * this.tileWidth + tile.x * this.marginWidth)
      .setSize(this.tileWidth * tile.rowWidth + (tile.rowWidth - 1) * this.marginWidth, this.tileHeight * tile.columnHeight + (tile.columnHeight - 1) * this.marginHeight);
      _callback(tile);
    });

    return this;
  }
}

/**
 * 配置されるタイル
 */
class Tile {
  /**
   * マス数を指定し生成
   * @param rowWidth
   * @param columnHeight
   * @returns {Tile}
   */
  constructor(rowWidth, columnHeight) {
    this.rowWidth = rowWidth;
    this.columnHeight = columnHeight;
    this.placed = false;
    return this;
  }

  /**
   * 位置を設定し、配置フラグをtrueに
   * @param x
   * @param y
   * @param top
   * @param left
   * @returns {Tile}
   */
  setPosition(x, y, top, left) {
    this.x = x;
    this.y = y;
    this.top = top;
    this.left = left;
    this.placed = true;
    return this;
  }

  /**
   * サイズを設定
   * @param width
   * @param height
   * @returns {Tile}
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
}

SpreadTable.Tile = Tile;

export default SpreadTable;