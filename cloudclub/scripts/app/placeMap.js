/**
 * aPlace model
 */

var app = app || {};

app.aPlace = (function () {
    'use strict'
    var initMap = (function () {
        //document.addEventListener("click", show, false);
    });

    return {
        initMap: initMap,
        show: function () {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: app.cdr.latitude, lng: app.cdr.longitude },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);

            var query = new Everlive.Query();
            query.where().nearSphere('Location', new Everlive.GeoPoint(app.cdr.longitude, app.cdr.latitude), 20, 'miles').ne('Icon', 'styles/images/avatar.png');

            var partners = app.everlive.data('Places');
            partners.get(query).then(function (data) {
                var allPartners = data.result;
                for (var i = 0; i < data.count; i++) {
                    var partner = allPartners[i];
                    if (partner && partner.Icon != "styles/images/avatar.png") {
                        //app.showAlert(partner.Place);
                        service.getDetails({
                            placeId: partner.PlaceId
                        },
                            function (place, status) {
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    var marker = new google.maps.Marker({
                                        map: map,
                                        position: place.geometry.location
                                    });
                                    var htmlString = stringBuilder(place);
                                    google.maps.event.addListener(marker, 'click', function () {
                                        infowindow.setContent(htmlString);
                                        infowindow.open(map, this);
                                    });
                                }
                            }
                        );
                    }
                }
            },
            function (error) {
                app.showAlert(JSON.stringify(error))
            });
            var stringBuilder = function (place) {
                var elements = {'<div><strong>',place.name,'</strong><br>','Phone: ',place.formatted_phone_number,'<br> Address: ':place.formatted_address,'<br> Open: ':place.opening_hours.open_now, '<br>':null,'</div>':null}
                return                                            
            }
        }
    }
}());
