// go to www.admob.com, sign up, create your app (one for each platform) and change the keys below

// select the right Ad Id according to platform
var admobid = {};
if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
  admobid = {
    banner: 'ca-app-pub-9517346003011652/8741561327',
    interstitial: 'ca-app-pub-9517346003011652/2247355722'
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
  admobid = {
    banner: 'ca-app-pub-9517346003011652/4450962523',
    interstitial: 'ca-app-pub-9517346003011652/9770622520'
  };
} else { // for windows phone
  admobid = {
    banner: 'ca-app-pub-9517346003011652/2695027726',
    interstitial: 'ca-app-pub-9517346003011652/3724088920'
  };
}

(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    DemoViewModel = kendo.data.ObservableObject.extend({

        showBannerTop: function () {
            if (!this.checkSimulator()) {
	            this.showBanner(AdMob.AD_POSITION.TOP_CENTER, AdMob.AD_SIZE.MEDIUM_RECTANGLE);
            }
        },

        showBannerBottom: function () {
            if (!this.checkSimulator()) {
	            this.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER, AdMob.AD_SIZE.SMART_BANNER);
            }
        },

        showBanner: function (position, size) {
            AdMob.createBanner(
                {
                  adId: admobid.banner,
                  adSize: size,
                  position: position,
                  autoShow: true,
                  overlap: false,
                  offsetTopBar: true,
                  isTesting: true,
                  bgColor: 'black'
            		},
                function() { console.log('show ok')},
                function(msg) { alert('Fail: ' + msg)}
            );
        },

        prepareInterstitial: function () {
            if (this.checkSimulator()) {
                return;
            }
            AdMob.prepareInterstitial(
                {
                  adId: admobid.interstitial,
                  autoShow: false, // if this is true, you don't need to call showInterstitial()
                  isTesting: true
            		},
                //function(msg) {alert("Prepared, you can now show it")}
				AdMob.showInterstitial(),
                function(msg) {alert("prepareInterstitial failed: " + msg)}
            );
        },

        showInterstitial: function () {
            if (this.checkSimulator()) {
                return;
            }
            AdMob.showInterstitial(
              function() {console.log("ok, interstitial showing")},
              function(msg) {alert("showInterstitial failed: " + msg)}
            );
        },

        hideBanner: function () {
            if (!this.checkSimulator()) {
	            AdMob.hideBanner ();
            }
        },

        removeBanner: function () {
            if (!this.checkSimulator()) {
	            AdMob.removeBanner ();
            }
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.AdMob === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }        
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);