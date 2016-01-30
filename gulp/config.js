var src     = 'src/';      // 元ファイル
var dist    = '.temp/';     // コンパイル先
var build = 'build/';  // リリース時

// root path
var root = require( 'path' ).join( __dirname, '../' );

module.exports = {
  // root
  'root' : root,

  // flag処理
  'isBuildFlag' : false,
  'isEjsAllFlag'  : true,


  'src': {
    'root'  : src,
    'html'  : src,
    'css'   : src + 'stylesheets/',
    'img'   : src + 'images/',
    'sprite': src + 'materials/',
    'js'    : src + 'javascripts/',
    'lib'   : [src + 'javascripts/libs/jquery/dist/jquery.min.js',
      src + 'javascripts/libs/jquery.pjax.min.js',
      src + 'javascripts/libs/velocity/velocity.min.js',
      src + 'javascripts/libs/OwlCarousel/owl-carousel/owl.carousel.js',
      src + 'javascripts/libs/hammerjs/hammer.js',
      src + 'javascripts/libs/jquery.hammer.js/jquery.hammer.js']
  },

  'dist': {
    'root'  : dist,
    'html'  : dist,
    'css'   : dist + 'stylesheets/',
    'img'   : dist + 'images/',
    'sprite': dist + 'materials/',
    'js'    : dist + 'javascripts/'
  },

  'build': {
    'root'  : build,
    'html'  : build,
    'css'   : build + 'stylesheets/',
    'img'   : build + 'images/',
    'sprite': build + 'materials/',
    'js'    : build + 'javascripts/'
  },

  // copyするファイル
  'copy': [
    '**/*.ico',
    'src/materials/*.png'
  ],

  // jshintの対象ファイル
   lintfiles:[
      // jsSrc + '/*.js'
  ]
};