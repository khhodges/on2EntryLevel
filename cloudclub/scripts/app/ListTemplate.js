/**
 * Templates view model
 */

var app = app || {};

app.templateFactory = (function () {

    var STRINGS = {
        START: '<div class="iw-title">',
        TOP: '<div class="iw-content"><div class="iw-subTitle">#:Place#</div>'
            + '<div><a data-role="button" class="butn" data-rel="external" href="tel:#:Phone#">'
            + '<img src="styles/images/phone2.png" alt="phone" height="auto" width="15%"></a><small>'
            + '#:Alert# #:Address# #:Open# #:Stars# #Distance# #:Cost#</small></div>',
        ACTIVITIES: '<a href="components/partners/view.html?partner=#:Place#"><img src="styles/images/on2see-icon-120x120.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
        THUMBUP: '<a href="components/activities/view.html?partner=#:Place#"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
        PARTNER: '<a href="components/notifications/view.html?partner=#:Place#");"><img src="styles/images/green-share.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
        MAP: '<a onclick="app.Places.browse(\'https://www.google.com/maps/place/#:PlaceG#\');"><img src="styles/images/googleMap.png" alt="Google" height="auto" width="12%" style="padding:2px"></a>',
        TWITTER: '<a  data-rel="external" onclick="app.Places.browse(\'https://twitter.com/search?q=#:PlaceT#\');"><img src="styles/images/twitter.png" alt="Twitter" height="auto" width="12%" style="padding:2px"></a>',
        YELP: '<a  data-rel="external" onclick="app.Places.browse(\'https://www.yelp.com/biz/#:PlaceY#\');"><img src="styles/images/yelp_64.png" alt="Yelp" height="auto" width="12%" style="padding:2px"></a>',
        FACEBOOK:'<a data-rel="external" onclick="app.Places.browse(\'https://www.facebook.com/#:PlaceF#\');"><img src="styles/images/facebook2.png" alt="Facebook" height="auto" width="12%" style="padding:2px"></a>',
        HOMPAGE: '<a  data-rel="external" onclick="app.Places.browse(\'#:Website#\')"><img src="#: Icon #" alt="Logo" height="auto" width="12%"></a></p>',
        END:'</div>',
        HEAD: '<div class="iw-title"></div>'
        }
    var templatesModel = (function () {
        var listString = function(){
            var span = (STRINGS.START
                //+ STRINGS.TOP
                + STRINGS.ACTIVITIES
                //+ STRINGS.FACEBOOK
                + STRINGS.HOMPAGE
                //+ STRINGS.MAP
                //+ STRINGS.PARTNER
                //+ STRINGS.THUMBUP
                //+ STRINGS.TWITTER
                //+ STRINGS.YELP
                + STRINGS.END);
            return span;
        }
        return {
            listString: listString
        }

    }());
    return templatesModel;
}());
