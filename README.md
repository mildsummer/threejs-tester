以下、メモ。

## gulpをインストール

```
$ npm install -g gulp
```

## npmパッケージをインストール

```
#プロジェクトのディレクトリに移動して
$ npm install
```

## gulp の監視

```
$ gulp
```

## 納品ファイル生成

cssのminifyや、.mapなどを省いたファイルを生成

```
$ gulp build
```

## ディレクトリ構成

srcを編集。

+ jade -> html
+ js -> babel -> js
+ sass -> css

```
├── .temp/（ビルド後のソース）
│   ├── javascripts/
│   ├── stylesheets / images 等
│   └── index.html
│
├── node_modules/
│   └── パッケージ各種
│
├── build/（納品ファイルがここに生成される）
│
├── src/（ビルド前のソース）
│   ├── _partial/（共通パーツのhtml）
│   ├── images/ 画像（写真など）
│   ├── materials/ 画像（その他）
│   │    └── _sprites/ スプライト用画像
│   ├── javascripts/
│   │    └── main.js
│   ├── stylesheets/
│   │    ├── _partial/ （共通パーツのcss）
│   │    └── style.scss
│   └── index.jade など（htmlは拡張子をjadeにする）
│
├── .git/
├── .gitignore
├── gulpfile.js
├── package.json
└── README.md
```