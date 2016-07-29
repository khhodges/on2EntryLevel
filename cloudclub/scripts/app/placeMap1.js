/**
 * aPlace model
 */

var app = app || {};

app.aPlace = (function () {
    'use strict'
    var allPartners, map, service, marker, markers = [], infoWindow, _lastMarker, center;    

    var resolveString = function (name, find, replace) {
        var length = name.split(find).length - 1;
        var theString;
        theString = name;
        for (var i = 0; i < length; i++) {
            theString = theString.replace(find, replace);
        }
        return theString;
    };
    var updateStars = function (place) {
        if (app.isNullOrEmpty(place.rating)) {
            place.rating = "??";
        }
        if (app.isNullOrEmpty(place.price_level)) {
            place.price_level = 0;
        }
        place.priceString = '$$$$$$$'.substring(0, place.price_level);
        return place;
    };
    var updateDistance = function (place) {
        var R = 6371; // km
        var lat1 = app.cdr.latitude;
        var lat2 = place.geometry.location.lat();
        var lng1 = app.cdr.longitude;
        var lng2 = place.geometry.location.lng();
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lng2 - lng1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var d = R * c / 1.61; // converted to miles
        place.distance = d.toFixed(2);
        if (!place.formatted_phone_number) place.formatted_phone_number = "";
        return place;
    };
    var clearMarkers = function deleteMarkers(markers) {
        // Deletes all markers in the array by removing references to them.
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        return markers;
    };
    var markIcon = function (place) {
        if (app.isNullOrEmpty(place.rating)) place.rating = 2.5;
        if (!place.markerUrl) {
            place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/greencircle.png'; //'http://maps.gstatic.com/mapfiles/circle.png';
            place.zIndex = 7;
            if (place.rating < 3.5) {
                place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/redcircle.png';
                place.zIndex = 8;
            }
            if (place.rating > 4.2) {
                place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/orangecircle.png';
                place.zIndex = 9;
            }
            if (place.partner.Icon && place.partner.Icon != "") {
                place.markerUrl = place.partner.Icon;
                place.zIndex = 10;
            }
        }
        return place;
    };
    var findPartner = function (place) {
        var match;
        for (var i = 0; i < allPartners.length; i++) {
            if (place.place_id === allPartners[i].PlaceId) {
                match = allPartners[i];
                break;
            };
        }
        return match;
    };
    
    var markCenter = function (position) {
        var that = this;
        if (that._lastMarker !== null && that._lastMarker !== undefined) {
            that._lastMarker.setMap(null);
        }
        that._lastMarker = new google.maps.Marker({
            map: map,
            position: position,
            draggable: false,
            zIndex: -1
        });

        google.maps.event.addListener(that._lastMarker, 'click', function () {
            infoWindow.setContent(that.currentLocation(that._lastMarker));
            map.setZoom(18);
            that._lastMarker.setDraggable(true);
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            infoWindow.open(map, that._lastMarker);
        });
        google.maps.event.addListener(that._lastMarker, 'dragend', function () {
            var newPlace = center.getPosition();
            map.setCenter(newPlace); // Set map center to marker position
            center.getAddress(newPlace);
            updatePosition(center.getPosition().lat(), center.getPosition().lng()); // update position display
        });
        google.maps.event.addListener(infoWindow, 'closeclick', function () {
            center.setDraggable(false);
            map.setZoom(theZoom);
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        });
    };
    var updatePosition = function(lat, lng) {
            try {
                document.getElementById('dragStatus').innerHTML = 'New Lat: ' + lat.toFixed(6) + ' New Lng: ' + lng.toFixed(6);
            } catch (e) {
            }
        }
    var updateAddress = function(myAddress) {
            document.getElementById('addressStatus').innerHTML = myAddress;
        }

    var getAddress = function (latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'location': latLng
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                myAddress = '';
                if (results[0]) {
                    myAddress = results[0].formatted_address;
                    try {
                        document.getElementById('addressStatus').innerHTML = myAddress;
                        document.getElementById('linkStatus').innerHTML = '<a id="linkStatus" data-role="button" class="butn" href="' + 'components/aboutView/view.html?Name=' + '&email=' + '&longitude=' + latLng.lng() + '&latitude=' + latLng.lat() + '&html=' + '&icon=' + '&address=' + myAddress + '&textField=' + '&www=' + '&tel=' + '&placeId=' + results[0].place_id + '"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="15%"></a>';

                    } catch (e) {

                    }
                }
            } else {
                window.alert('Geocoder failed due to find Address: ' + status);
            }
        });
    };
    var htmlBuilder = function (place) {
        var partner = place.partner;
        place = updateDistance(place)
        place = updateStars(place);
        place.openString = "Closed, ";
        if (place.opening_hours) {
            if (place.opening_hours.open_now) {
                place.openString = place.formatted_phone_number + '<strong> Open Now</strong>';
            }
        }
        place.markerUrl = 'styles/images/on2see-icon-120x120.png';
        place.zIndex = 5;
        if (place.avatar) {
            place.markerUrl = place.avatar;
            place.zIndex = 10;
        }
        place.starString = '<br>No reviews or stars. ';
        if (!place.reviews) place.reviews = [];
        place.reviews.push({ "text": "No reviews posted" });

        if (!place.website) place.website = "";
        place.starString = '... <strong>' + place.reviews.length + '</strong> reviews and <strong>' + place.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). <br/>' + place.priceString + '</small>';

        if (!place.name) {
            place.name = partner.Place;
        }
        if (place.text) {
            place.text = resolveString(place.text, "&", "and");
        }
        if (place.name) {
            place.name = resolveString(place.name, "&", "and");
        } else {
            place.text = "Not Available"
        };
        place.addurl = encodeURI('components/aboutView/view.html?Name=' + place.name + '&email=newpartner@on2t.com' + '&longitude=' + place.geometry.location.lng() + '&latitude=' + place.geometry.location.lat() + '&html=hhhhh' + '&icon=styles/images/avatar.png' + '&address=' + place.formatted_address.replace('#', '') + '&textField=' + resolveString(place.reviews[0].text, '\'', '') + '&www=' + place.website + '&tel=' + place.formatted_phone_number + '&placeId=' + place.place_id);

        place.avatar = "styles/images/avatar.png";
        var htmlString = '<div><strong>' + place.name + '</strong><br>' +
                                  'Phone: ' + place.formatted_phone_number + '<br>' +
                                  place.formatted_address + place.starString;
        return htmlString + '</div>';
    }

    return {
        init: function(){
        },
        show: function () {
            service = new google.maps.places.PlacesService(map);
            map = new google.maps.Map(document.getElementById('placeMap'), {
                center: { lat: 0, lng: -20 },
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            // location changed or markes empty
            if (markers.length > 0) {
                return;
            }
            var allBounds = new google.maps.LatLngBounds();
            infoWindow = new google.maps.InfoWindow();
            //markCenter( new google.maps.LatLng(app.cdr.latitude, app.cdr.longitude));
            var center = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(app.cdr.latitude, app.cdr.longitude),
                draggable: true,
                zIndex: -1
            });
            marker = center;
            //Center InfoWindow PopUp
            //Center InfoWindow PopUp
            var currentLocation = '<h3>Center Your Location</h3><p id="addressStatus">' + "myAddress" + '</p><p id="dragStatus"> Lat:' + marker.position.lat() + ' Lng:' + marker.position.lng() + '</p>' + '<a id="linkStatus" data-role="button" class="butn" href="' + 'components/aboutView/view.html?Name=' + '&email=' + '&longitude=' + marker.position.lng() + '&latitude=' + marker.position.lat() + '&html=' + '&icon=' + '&address=' + "myAddress" + '&textField=Add your review' + '&www=' + '&tel=' + '&placeId=' + '"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="15%"></a>';
            google.maps.event.addListener(center, 'click', function () {
                infoWindow.setContent(currentLocation);
                map.setZoom(18);
                center.setDraggable(true);
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                infoWindow.open(map, center);
            });
            google.maps.event.addListener(center, 'dragend', function () {
                var newPlace = this.getPosition();
                map.setCenter(newPlace); // Set map center to marker position
                getAddress(newPlace);
                document.getElementById('dragStatus').innerHTML = 'New Lat: ' + this.getPosition().lat().toFixed(6) + ' New Lng: ' + this.getPosition().lng().toFixed(6); // update position display
            });
            google.maps.event.addListener(infoWindow, 'closeclick', function () {
                center.setDraggable(false);
                map.setZoom(theZoom);
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            });
            var query = new Everlive.Query();
            query.where().nearSphere('Location', new Everlive.GeoPoint(app.cdr.longitude, app.cdr.latitude), 20, 'miles').ne('Icon', 'styles/images/avatar.png');

            var partners = app.everlive.data('Places');
            partners.get(query).then(function (data) {
                allPartners = data.result;
                for (var i = 0; i < data.count; i++) {
                    var partner = allPartners[i];
                    if (partner.Icon != "styles/images/avatar.png" && partner.Icon != "") {
                       //app.showAlert(partner.Place);
                        service.getDetails({
                            placeId: partner.PlaceId
                        },
                            function (place, status) {
                                //place.partner = findPartner(place);
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    place = markIcon(place);
                                    marker = new google.maps.Marker({
                                        map: map,
                                        position: place.geometry.location,
                                        icon: {
                                            url: place.markerUrl,
                                            anchor: new google.maps.Point(3 * place.rating, 5 * place.rating),
                                            scaledSize: new google.maps.Size(5 * place.rating, 5 * place.rating)
                                        }
                                    });
                                    //extend the bounds to include each marker's position
                                    allBounds.extend(marker.position);
                                    //now fit the map to the newly inclusive bounds
                                    map.fitBounds(allBounds);
                                    //Search InfoWindow Popup
                                    markers.push(place);
                                    var htmlString = htmlBuilder(place);
                                    google.maps.event.addListener(marker, 'click', function () {
                                        infoWindow.setContent(htmlString);
                                        infoWindow.open(map, this);
                                    });
                                }else
                                { app.showAlert(status);}
                            }

                        );
                    }
                    else {
                        app.showAlert(partner.Place)
                    }
                }
            },
            function (error) {
                app.showAlert(JSON.stringify(error))
            });
        }
}
}());
