var src     = 'source/';      // 元ファイル
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
    'sprite': src + 'materials/_sprites/*.png',
    'js'    : src + 'javascripts/',
    'lib'   : ['node_modules/three/three.js', 'node_modules/stats.js/build/stats.min.js']
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
    'src/materials/*.*'
  ]

};