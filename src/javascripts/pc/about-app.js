import BasicApp from './basic-app.js';
import Util from '../components/util.js';
import config from '../components/config.js';

/**
 * PC ABOUT
 */
class AboutApp extends BasicApp {
  constructor() {
    super();

    //Google Maps APIの読み込み後処理を行う
    if (!window.google) {
      this.loadGoogleAPI();
      var func = () => {
        if (window.google) {
          this.createMap();
        } else {
          window.setTimeout(func, 100);
        }
      };
      func();
    } else {
      this.createMap();
    }

    return this.initFadeIn();
  }

  /**
   * フェード表示
   */
  initFadeIn() {
    var _this = this;
    $('.fadeIn').each(function () {
      _this.bindInviewEventListener(config.inviewOffset, $(this), function () {
        $(this).addClass('is-visible');
      });
    });
    return this;
  }

  /**
   * Google Maps APIの読み込み
   */
  loadGoogleAPI() {
    if (!window.google) {
      $('body').append('<script src="https://maps.googleapis.com/maps/api/js"/>');
    }
    return this;
  }

  /**
   * Google Mapの生成
   */
  createMap() {
    var $map = $('.about__map');
    var position = new window.google.maps.LatLng(35.704306, 139.756543);
    var map = new window.google.maps.Map($map.get(0), {
      zoom: 17,
      center: position,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        mapTypeIds: [window.google.maps.MapTypeId.ROADMAP, 'teamLabDotNet']
      },
      disableDefaultUI: true,
      draggable: false,
      scrollwheel: false
    });
    map.mapTypes.set('teamLabDotNet', new window.google.maps.StyledMapType([
      {
        "stylers": [
          {"saturation": -100},
          {"lightness": 10},
          {"gamma": 1.28}
        ]
      }, {
        "featureType": "road",
        "stylers": [
          {"visibility": "simplified"}
        ]
      }, {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "transit.line",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
          {"visibility": "off"}
        ]
      }, {
        "featureType": "road",
        "stylers": [
          {"gamma": 9.99},
          {"lightness": -17}
        ]
      }
    ]));
    map.setMapTypeId('teamLabDotNet');
    new google.maps.Marker({
      map: map,
      position: position,
      icon: {
        url: '/materials/marker.png',
        size: new google.maps.Size(50, 46),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 41),
        scaledSize: new google.maps.Size(50, 46)
      }
    });
    this.bindEventListener('click', $map, () => {
      window.open('https://www.google.co.jp/maps/place/@35.704306,139.756543,15z/data=!4m2!3m1!1s0x0:0xead9b31f47105083');
    });
    return this;
  }

}

export default AboutApp;