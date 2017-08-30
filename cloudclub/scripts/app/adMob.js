// go to www.admob.com, sign up, create your app (one for each platform) and change the keys below

// select the right Ad Id according to platform
var admobid = {};
if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
  admobid = {
	  banner: 'ca-app-pub-4526801130933964/8388196939',
    bannerOld: 'ca-app-pub-4526801130933964/6728163731',
    interstitial: 'ca-app-pub-4526801130933964/2599015338'
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
  admobid = {
    banner: 'ca-app-pub-4526801130933964/2583838939',
    interstitial: 'ca-app-pub-4526801130933964/5537305335'
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
                  isTesting: false,
                  bgColor: 'black'
            		},
                function() { },//app.notify.showShortTop('Ad show ok')},
                function(msg) {}// app.notify.showShortTop('Ad fail: ' + msg)}
            );
        },

        prepareInterstitial: function () {
            if (this.checkSimulator()) {
                return;
            }
            AdMob.prepareInterstitial(
                {
                  adId: admobid.interstitial,
                  autoShow: true, // if this is true, you don't need to call showInterstitial()
                  isTesting: false
            		},
                function(msg) {//app.notify.showShortTop("Prepared, you can now show it");
				   app.adMobService.viewModel.showInterstitial();},
                function(msg) {app.showError("prepareInterstitial failed: " + msg)}
            );
        },

        showInterstitial: function () {
            if (this.checkSimulator()) {
                return;
            }
            AdMob.showInterstitial(
              function() {},//app.notify.showShortTop("ok, interstitial showing")},
              function(msg) {}//app.showError("showInterstitial failed: " + msg)}
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
            if (window.navigator.simulator === true || app.helper.getLevel() === 1) {
                //app.notify.showShortTop('Advertisments are not used if you upgrade your subscription for a small one-time charge. Visit your \'Account page\' to find out more.');
                return true;
            } else if (window.AdMob === undefined) {
                //app.notify.showShortTop(appSettings.messages....);
                return true;
            } else {
                return false;
            }
        }
    });

    app.adMobService = {
        viewModel: new DemoViewModel()
    };
})(window);