var gulp = require('gulp');

var config  = require('../config');

// sprite
var spritesmith = require('gulp.spritesmith');

// スプライト画像を作成
gulp.task('sprite', function(){
  // スプライトにする愉快な画像達
  console.log(config.src.sprite);
  var spriteData = gulp.src(config.src.sprite + '_sprites/*.png').pipe(spritesmith({
    imgName: 'sprites.png', // スプライトの画像
    cssName: '_sprites.sass', // 生成されるscss
    imgPath: '../materials/sprites.png', // 生成されるscssに記載されるパス
    cssFormat: 'sass', // フォーマット
    padding: 10,
    algorithm: 'binary-tree',
    // cssVarMap: function (sprite) {
    // sprite.name;
      // sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
    // }
  }));
  spriteData.img.pipe(gulp.dest(config.dist.sprite)); // imgNameで指定したスプライト画像の保存先
  spriteData.css.pipe(gulp.dest(config.dist.css + '_partial/')); // cssNameで指定したcssの保存先
});
