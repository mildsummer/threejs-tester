import PcCommonApp from './pc/common-app.js';
import PcTopApp from './pc/top-app.js';
import SpTopApp from './sp/top-app.js';
import PcWorkListApp from './pc/work-list-app.js';
import SpWorkListApp from './sp/work-list-app.js';
import PcExhibitionListApp from './pc/exhibition-list-app.js';
import SpExhibitionListApp from './sp/exhibition-list-app.js';
import PcConceptListApp from './pc/concept-list-app.js';
import SpConceptListApp from './sp/concept-list-app.js';
import PcPressListApp from './pc/press-list-app.js';
import SpPressListApp from './sp/press-list-app.js';
import PcWorkDetailApp from './pc/work-detail-app.js';
import SpWorkDetailApp from './sp/work-detail-app.js';
import PcExhibitionDetailApp from './pc/exhibition-detail-app.js';
import SpExhibitionDetailApp from './sp/exhibition-detail-app.js';
import PcConceptDetailApp from './pc/concept-detail-app.js';
import SpConceptDetailApp from './sp/concept-detail-app.js';
import PcPressDetailApp from './pc/press-detail-app.js';
import SpPressDetailApp from './sp/press-detail-app.js';
import PcSearchApp from './pc/search-app.js';
import SpSearchApp from './sp/search-app.js';
import PcAboutApp from './pc/about-app.js';
import PcContactApp from './pc/contact-app.js';
import config from './components/config.js';

/**
 * 全ページのAppを包括するクラス
 */
class TeamLabDotNet {
  constructor() {
    this.common = new PcCommonApp();

    //SP←→PC対応
    var $window = $(window);
    var timer;
    this.isPc = $window.width() > config.spWidth;
    var handleResize = () => {
      var isPc = $window.width() > config.spWidth;
      if(this.isPc !== isPc) {
        this.isPc = isPc;
        this.refresh();
      }
    };
    $window.resize(function() {
      clearTimeout(timer);
      timer = setTimeout(handleResize, 1000);
    });

    return this.refresh();
  }

  /**
   * Pjaxによりページが切り替わったときに呼ぶ
   * @returns {TeamLabDotNet}
   */
  refresh() {
    /**
     * すでにappがあれば共通部分以外の全てのイベントリスナーを解除する
     */
    if(this.app) {
      this.app.unbindAllEventListeners();
      delete this.app;
    }

    /**
     * セットアップ
     */
    var appName = $('.mainCont').data('script');
    if(appName) {
      this.app = new TeamLabDotNet[(this.isPc ? 'Pc' : 'Sp') + appName + 'App']();
      this.app.complete();//completeイベントが発生
    }
    return this;
  }
}

TeamLabDotNet.PcTopApp = PcTopApp;
TeamLabDotNet.SpTopApp = SpTopApp;
TeamLabDotNet.PcWorkListApp = PcWorkListApp;
TeamLabDotNet.SpWorkListApp = SpWorkListApp;
TeamLabDotNet.PcExhibitionListApp = PcExhibitionListApp;
TeamLabDotNet.SpExhibitionListApp = SpExhibitionListApp;
TeamLabDotNet.PcConceptListApp = PcConceptListApp;
TeamLabDotNet.SpConceptListApp = SpConceptListApp;
TeamLabDotNet.PcPressListApp = PcPressListApp;
TeamLabDotNet.SpPressListApp = SpPressListApp;
TeamLabDotNet.PcWorkDetailApp = PcWorkDetailApp;
TeamLabDotNet.SpWorkDetailApp = SpWorkDetailApp;
TeamLabDotNet.PcExhibitionDetailApp = PcExhibitionDetailApp;
TeamLabDotNet.SpExhibitionDetailApp = SpExhibitionDetailApp;
TeamLabDotNet.PcConceptDetailApp = PcConceptDetailApp;
TeamLabDotNet.SpConceptDetailApp = SpConceptDetailApp;
TeamLabDotNet.PcPressDetailApp = PcPressDetailApp;
TeamLabDotNet.SpPressDetailApp = SpPressDetailApp;
TeamLabDotNet.PcSearchApp = PcSearchApp;
TeamLabDotNet.SpSearchApp = SpSearchApp;
TeamLabDotNet.PcAboutApp = PcAboutApp;
TeamLabDotNet.SpAboutApp = PcAboutApp;
TeamLabDotNet.PcContactApp = PcContactApp;
TeamLabDotNet.SpContactApp = PcContactApp;

$(window).load(function(){
  window.teamLabDotNet = new TeamLabDotNet();
});