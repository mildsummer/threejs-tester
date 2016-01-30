/**
 * 作品詳細の画像を並べる
 * 画像は縦長のものと横長のものとあり、順序がある。
 * 行のパターンは以下の種類（数字は優先度を表し、より多くの画像を１行にするものを優先する）
 * 1 縦縦縦縦
 * 2 縦縦縦
 *   縦縦横
 *   横縦縦
 * 3 縦縦
 *   横横
 *   縦横
 *   横縦
 * 4 縦
 *   横
 * 行の決定は、リストの前方から行う
 */
class SpreadWorkImages {
  constructor(options) {
    return this.setOptions(options);
  }

  /**
   * オプションを設定
   * @param {object} options
   * @returns {SpreadWorkImages}
   */
  setOptions(options) {
    if (typeof options !== 'object') {
      options = {};
    }

    this.marginWidth  = parseFloat(options.marginWidth, 10) ? parseFloat(options.marginWidth, 10) : 20;   //余白の幅
    this.marginHeight = parseFloat(options.marginHeight, 10) ? parseFloat(options.marginHeight, 10) : 20; //余白の高さ
    this.width = parseFloat(options.width, 10);   //全体の幅
    this.basicRatio = parseFloat(options.basicRatio, 10) ? parseFloat(options.basicRatio, 10) : 9 / 16; //基本的な画像の比率（横/縦）
    this.isSP = !!options.isSP;

    this.tiles = [];//タイルの２次元配列
    this.table = [];//どのようにテーブルが構成されるかをわかりやすくするための２次元配列

    return this;
  }

  /**
   * タイルの追加
   * 0は縦長、1は横長を表す
   * @param {tile} tile
   * @returns {SpreadWorkImages}
   */
  addTile(tile) {
    var isOblong = tile.ratio > 1;
    var row = this.table[this.table.length - 1];
    if(row) {
      var arrangement = row.join('') + (isOblong * 1);
      if (!this.isSP && (arrangement === '0000' ||
                         arrangement === '000'  ||
                         arrangement === '001'  ||
                         arrangement === '100'  ||
                         arrangement === '11'   ||
                         arrangement === '01'   ||
                         arrangement === '10')  ||
          arrangement === '00') {
        row.push(isOblong * 1);
        this.tiles[this.tiles.length - 1].push(tile);
        return this;
      }
    }
    this.table.push([isOblong * 1]);
    this.tiles.push([tile]);
    return this;
  }

  /**
   * 敷き詰める
   * @param {function} callback 各タイル度に呼ばれ、Tileを渡す。
   * @returns {SpreadWorkImages}
   */
  spreadTiles(callback) {
    var _callback = typeof callback === 'function' ? callback : function() {};
    var top = 0;
    var basicWidth = (this.width - this.marginWidth * 3) / 4;
    var basicHeight = basicWidth / this.basicRatio;

    this.table.forEach((row, index) => {
      var tiles = this.tiles[index];
      var length = tiles.length;
      var arrangement = row.join('');
      if(arrangement === '0000') {
        tiles.forEach((tile, index) => {
          tile.setSize(basicWidth, basicHeight).setPosition(top, index * (basicWidth + this.marginWidth));
          _callback(tile);
        });
        top += basicHeight + this.marginHeight;
      } else if(arrangement === '000') {
        var width = (this.width - this.marginWidth * 2) / 3;
        var height = width / this.basicRatio;
        tiles.forEach((tile, index) => {
          tile.setSize(width, height).setPosition(top, index * (width + this.marginWidth));
          _callback(tile);
        });
        top += height + this.marginHeight;
      } else if(arrangement.length === 3) {
        var left = 0;
        tiles.forEach((tile, index) => {
          tile.setSize(row[index] ? basicWidth * 2 + this.marginWidth : basicWidth, basicHeight).setPosition(top, left);
          left += tile.width + this.marginWidth;
          _callback(tile);
        });
        top += basicHeight + this.marginHeight;
      } else if(arrangement === '01' || arrangement === '10') {
        var left = 0;
        tiles.forEach((tile, index) => {
          tile.setSize(row[index] ? basicWidth * 3 + this.marginWidth * 2 : basicWidth, basicHeight).setPosition(top, left);
          left += tile.width + this.marginWidth;
          _callback(tile);
        });
        top += basicHeight + this.marginHeight;
      } else if(arrangement.length === 2) {
        var width = (this.width - this.marginWidth) / 2;
        var height = row[0] ? width * this.basicRatio : width / this.basicRatio;
        tiles.forEach((tile, index) => {
          tile.setSize(width, height).setPosition(top, index * (width + this.marginWidth));
          _callback(tile);
        });
        top += height + this.marginHeight;
      } else if(arrangement.length === 1) {
        var tile = tiles[0];
        tile.setSize(this.width, row[0] ? this.width * this.basicRatio : this.width / this.basicRatio).setPosition(top, 0);
        _callback(tile);
        top += tile.height + this.marginHeight;
      }
    });

    this.height = top - this.marginHeight;

    return this;
  }

  /**
   * テーブル全体の幅を返す
   * @returns {number}
   */
  getWidth() {
    return this.width;
  }

  /**
   * テーブル全体の高さを返す
   * @returns {number}
   */
  getHeight() {
    return this.height;
  }

  /**
   * オプションを渡して、位置を計算し直す
   * @param {object} options
   * @param {function} callback 各タイルを再設置する度に呼ばれ、タイルを渡す
   * @returns {SpreadWorkImages}
   */
  resize(options, callback) {
    //サイズの再設定
    for(var key in options) {
      this[key] = options[key];
    }
    this.spreadTiles(callback);

    return this;
  }
}

/**
 * 配置されるタイル
 */
class Tile {
  /**
   * 元の大きさを指定し生成
   * @param {number} originalWidth
   * @param {number} originalHeight
   * @returns {Tile}
   */
  constructor(originalWidth, originalHeight) {
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;
    this.ratio = originalWidth / originalHeight;
    return this;
  }

  /**
   * 位置を設定
   * @param top
   * @param left
   * @returns {Tile}
   */
  setPosition(top, left) {
    this.top = top;
    this.left = left;
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

SpreadWorkImages.Tile = Tile;

export default SpreadWorkImages;