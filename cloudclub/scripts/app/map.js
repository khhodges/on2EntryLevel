/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'
    var infoWindow, markers, place, result, myCity, myState, newPlace, here, request, home, bw, lat1, lng1, allBounds, localBounds, theZoom = 15,
        service, myAddress, Selfie, list = {}, homePosition, update = false, myEvent;
    var HEAD = appSettings.HEAD;

    /**
     * The Google Map CenterControl adds a control to the map that recenters the map on
     * current location.
     */
    function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginTop = '10px';
        controlUI.style.marginRight = '10px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '20px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'List';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {
            //app.Places.locationViewModel.onNavigateHome();
            app.mobileApp.navigate('views/listView.html');
        });
    }
    //Places Model loads the known places
    var placesViewModel = (function () {
        var map, geocoder, locality
        var placeModel = {
            fields: {
                name: {
                    field: 'Place',
                    defaultValue: ''
                },
                url: {
                    field: 'Website',
                    defaultValue: 'www.google.com?search=\' + result.name'
                },
                icon: {
                    field: 'Icon',
                    defaultValue: 'styles/images/avatar.png'
                },
                marker: {
                    field: 'location',
                    defaultValue: []
                },
                text: {
                    field: 'Description',
                    defaultValue: 'Empty'
                },
                html: {
                    field: 'Html',
                    defaultValue: ''
                },
                address: {
                    field: 'Address',
                    defaultValue: ''
                },
                phone: {
                    field: 'Phone',
                    defaultValue: ''
                },
                city: {
                    field: 'City',
                    defaultValue: ''
                }
            }
        };
        var placesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: placeModel
            },
            transport: {
                typeName: 'Places'
            }
        });
        var resolveString = function (name, find, replace) {
            if (!name) {
                //app.notify.showShortTop("Please provide setup link "+name+", "+find+", "+replace)
                return name;
            }
            var length = name.split(find).length - 1;
            var theString;
            theString = name;
            for (var i = 0; i < length; i++) {
                theString = theString.replace(find, replace);
            }
            return theString;
        };
        var LocationViewModel = kendo.data.ObservableObject.extend({
            lastPicture: "styles/images/avatar.png",
            _lastMarker: null,
            _isLoading: false,
            address: "",
            find: null,
            list: null,
            trip: null,
            homeMarker: null,
            isGoogleMapsInitialized: true,
            isGoogleDirectionsInitialized: false,
            markers: [],
            details: [],
            hideSearch: false,
            updateDistance: function (lat2, lng2) {
                var R = 6371; // km
                var lat1 = app.cdr.lat;
                var lng1 = app.cdr.lng;
                var dLat = (lat2 - lat1) * Math.PI / 180;
                var dLon = (lng2 - lng1) * Math.PI / 180;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.asin(Math.sqrt(a));
                var d = R * c / 1.61; // converted to miles
                return d.toFixed(4);
            },
            onNavigateHome: function () {
                //find present location, clear markers and set up members as icons
                var that = this;
                that._isLoading = true;
                //app.Places.locationViewModel.clearMap();
                try {
                    Selfie = {
                        Picture: null,
                        name: "My Private Feed",
                        Value: null,
                        Active: true,
                        Notes: 'Selfie',
                        Text: '',
                        Title: 'My Private Feed',
                        location: homePosition
                    };
                } catch (e) {
                    app.showError(JSON.stringify(e))
                }
                app.Places.visiting = Selfie;
                app.Places.center = Selfie;
                map.panTo(homePosition);
                that._putMarker(homePosition);
                locality = homePosition;
                that._isLoading = false;
                that.toggleLoading();
            },
            onSetupPartners: function () {
                var query = new Everlive.Query();
                var point = new Everlive.GeoPoint(homePosition.lng, homePosition.lat);
                query.where().nearSphere('Location', point, 25, 'miles').ne('Icon', 'styles/images/avatar.png');
                var partners = app.everlive.data('Places');
                app.notify.showLongBottom("Loading nearby CloudClub Partners within 25 miles onto Google Maps. Click any star to research the Partner.,")
                partners.get(query).then(function (data) {
                    app.Places.locationViewModel.list = new app.Places.List;
                    for (var i = 0; i < data.count; i++) {
                        var partner = data.result[i];
                        if (partner.Place.indexOf(app.appName()) > 0) {
                            partner.Location.lat = partner.Location.latitude;
                            partner.Location.lng = partner.Location.longitude;
                            var partnerV = new app.Places.newPartner();
                            partnerV.setPartnerRow(partner);// define as a specific Partner
                            app.Places.visiting = partnerV;
                            app.Places.locationViewModel.list.put(partnerV.vicinity(), partnerV);
                        }
                    }
                },
                 function (error) {
                     app.showError(JSON.stringify(error))
                 });
            },
            getComponent: function (address_components, component) {
                var result = 'Address Field not found';
                for (var i = 0; i < address_components.length; i++) {
                    if (address_components[i].types[0] === component) {
                        result = address_components[i].long_name;
                    }
                    //if (address_components[i].types[0] === "administrative_area_level_1") {
                    //    result = address_components[i].long_name;
                    //}
                }
                return result;
            },
            getAddress: function (latLng, marker) {
                geocoder.geocode({
                    'location': latLng
                }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.error(status);
                        return false;
                    } else {
                        myAddress = '';
                        myCity = '';
                        myState = '';
                        if (results[0]) {
                            myAddress = results[0].formatted_address;
                            app.cdr.address = myAddress;
                            app.notify.showLongBottom(myAddress);
                            myCity = app.Places.locationViewModel.getComponent(results[0].address_components, "locality");
                            app.cdr.myCity = myCity;
                            app.cdr.myState = app.Places.locationViewModel.getComponent(results[0].address_components, "administrative_area_level_1")
                            app.cdr.myCountry = app.Places.locationViewModel.getComponent(results[0].address_components, "country")
                            if (document.getElementById('addressStatus')) {
                                document.getElementById('addressStatus').innerHTML = myAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '</span>';
                            }
                            map.setZoom(app.Places.locationViewModel.getBoundsZoomLevel(allBounds));
                        }
                    }
                });
            },
            getIconUrl: function () {
                var iconText = this.get('Icon');
                if (iconText.indexOf('//') > -1) {
                    return iconText;
                } else {
                    return app.helper.resolvePictureUrl(iconText);
                }
            },
            getBoundsZoomLevel: function (bounds) {
                //app.showAlert(JSON.stringify(bounds))
                var mapDim = {
                    height: $('#map-canvas').height(),
                    width: $('#map-canvas').width()
                };
                var WORLD_DIM = { height: 256, width: 256 };
                var ZOOM_MAX = 14;

                function latRad(lat) {
                    var sin = Math.sin(lat * Math.PI / 180);
                    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
                    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
                }

                function zoom(mapPx, worldPx, fraction) {
                    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
                }

                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();

                var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

                var lngDiff = ne.lng() - sw.lng();
                var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

                var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
                var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

                var newZoom = Math.min(latZoom, lngZoom, ZOOM_MAX);
                //app.showAlert("Zoom " + newZoom);
                //newZoom = Math.max(newZoom, ZOOM_MIN);
                //app.showAlert("Zoom " + newZoom);
                //if(map.zoom < newZoom)
                map.setZoom(newZoom);
                map.setCenter(bounds.getCenter());
                infoWindow.close();
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                //app.showAlert("Zoom "+newZoom);
                return newZoom;
            },
            clearMap: function deleteMarkers() { // Deletes all markers in the array by removing references to them.
                var markers = app.Places.locationViewModel.markers;
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i] && markers[i].icon && markers[i].icon.url !== 'styles/images/pin.png') markers[i].setMap(null);
                }
                //create empty LatLngBounds object
                if (allBounds.isEmpty()) {
                    allBounds = new google.maps.LatLngBounds();
                } else {
                    //var center = allBounds.getCenter();
                    //allBounds = new google.maps.LatLngBounds();
                    //allBounds.extent(center);
                }
                if (!localBounds) {
                    localBounds = new google.maps.LatLngBounds();
                } else {
                    //var center = allBounds.getCenter();
                    localBounds = new google.maps.LatLngBounds();
                    //allBounds.extent(center);
                }
                markers = [];
                app.Places.locationViewModel.markers = new Array;
                app.Places.locationViewModel.details = new Array;
                app.Places.locationViewModel.list = new app.Places.List;
            },
            openListSheet: function (e) {
                if (!app.Places.locationViewModel.checkSimulator()) {
                    var myTrip = app.Places.locationViewModel.trip.array();
                    for (var i = 0; i < myTrip.length ; i++) {
                        if (myTrip[i].name === e.sender.events.currentTarget.innerText) {
                            app.Places.favoriteItem = myTrip[i];
                            break;
                        }
                    }
                    var myList = app.Places.locationViewModel.list.array();
                    for (var i = 0; i < myList.length ; i++) {
                        if (myList[i].name === e.sender.events.currentTarget.innerText) {
                            app.Places.favoriteItem = myList[i];
                            break;
                        }
                    }
                }
                if (!app.Places.locationViewModel.checkSimulator()) {
                    app.Places.locationViewModel.showListSheet({
                        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                        'title': appSettings.messages.whatToDo,
                        'buttonLabels': [
                         appSettings.messages.list5,
                         appSettings.messages.list6,
                         appSettings.messages.list3
                         // appSettings.messages.list5
                        ],
                        'addCancelButtonWithLabel': 'Cancel',
                        'androidEnableCancelButton': true, // default false
                        'winphoneEnableCancelButton': true, // default false
                        //'addDestructiveButtonWithLabel' : 'Delete it'
                    });
                } else {
                    app.Places.logExceptions(app.mobileApp.navigate("#views/listView.html?keep=2"));
                }
            },
            openActionSheet: function () {
                if (!app.Places.locationViewModel.checkSimulator()) {
                    app.Places.locationViewModel.showActionSheet({
                        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                        'title': appSettings.messages.whatToDo,
                        'buttonLabels': [appSettings.messages.mapList1, appSettings.messages.mapList2, appSettings.messages.mapList3, appSettings.messages.mapList4, appSettings.messages.mapList5, appSettings.messages.mapList6, "Back"],
                        'addCancelButtonWithLabel': 'Cancel',
                        'androidEnableCancelButton': true, // default false
                        'winphoneEnableCancelButton': true, // default false
                        //'addDestructiveButtonWithLabel' : 'Delete it'
                    });
                } else {
                    app.mobileApp.navigate("#views/listView.html");//components/favorites/view.html");
                }
            },
            showListSheet: function (options) {
                if (!this.checkSimulator()) {
                    window.plugins.actionsheet.show(
                        options,
                        function (buttonIndex) {
                            // wrapping in a timeout so the dialog doesn't freeze the app
                            //        list1:"Add to the Trip",
                            //        list2:"See Trip",
                            //        list3:"Visit Home Page",
                            //        list4:"",
                            //        list5:"",
                            setTimeout(function () {
                                switch (buttonIndex) {
                                    case 1: //'Add to Map',
                                        var partnerV = new app.Places.newPartner();
                                        partnerV.setTripRow(app.Places.favoriteItem);// define as a specific Partner
                                        app.Places.addToTrip(partnerV);
                                        break;
                                    case 2: // Directions to Trip
                                        app.favorites.directions();
                                        break;
                                    case 3://visit Home Page
                                        if (app.Places.favoriteItem.website !== undefined) app.openLink(app.Places.favoriteItem.website);
                                        //app.mobileApp.navigate("#views/updateView.html");
                                        break;
                                    default:
                                        //app.notify.showShortTop('You will need to upgrade to use this feature.');
                                        break;
                                }
                            }, 0);
                        }
                        );
                }
            },
            showActionSheet: function (options) {//swipe on list
                if (!this.checkSimulator()) {
                    window.plugins.actionsheet.show(
                        options,
                        function (buttonIndex) {
                            // wrapping in a timeout so the dialog doesn't freeze the app
                            setTimeout(function () {
                                switch (buttonIndex) {
                                    case 1:
                                        //'Show List Details',
                                        app.mobileApp.navigate("#views/listView.html");
                                        break;
                                    case 2:
                                        app.Places.updatePartnerLocation();
                                        app.mobileApp.navigate("#views/mapView.html");
                                        break;
                                    case 3:
                                        app.mobileApp.navigate("#views/mapView.html");
                                        var markersList = app.Places.locationViewModel.list.array();
                                        for (var i = 0; i < markersList.length; i++) {
                                            var thePartner = app.Places.locationViewModel.list.get(markersList[i].vicinity);
                                            var Details = thePartner.details();
                                            Details.clearLowMark();
                                        }
                                        break;
                                    case 4:
                                        app.mobileApp.navigate("#views/updateView.html");
                                        break;
                                    case 5:
                                        app.mobileApp.navigate('#components/favorites/view.html');
                                        break;
                                    case 6:// Directions to Trip
                                        app.favorites.directions();
                                        break;
                                    case 7:
                                        app.mobileApp.navigate("#:back");
                                        break;
                                    default:
                                        //app.notify.showShortTop('You will need to upgrade to use this feature.');
                                        break;
                                }
                            }, 0);
                        }
                        );
                }
                //else
                //	if(app.isNullOrEmpty(localStorage.getItem("username"))){
                //		app.notify.showShortTop("Please register first!");
                //		app.mobileApp.navigatedeleteMap("#views/signupView.html");
                //    }
                //else{
                //	app.notify.showShortTop("Please login first!");
                //	app.mobileApp.navigate("#welcome");
                //}
            },
            checkSimulator: function () {
                //app.notify.showShortTop(window.navigator.simulator);
                if (window.navigator.simulator === true || window.cordova === undefined) {
                    app.notify.showLongBottom('This plugin is not available in the simulator.');

                    return true;
                } else {
                    return false;
                }
            },
            onPlaceSearch: function () {
                app.notify.showLongBottom(appSettings.messages.searchAgain);
                app.Places.locationViewModel.clearMap();
                service = new google.maps.places.PlacesService(map);
                if (app.Places.locationViewModel.find && app.Places.locationViewModel.find.indexOf('.') > 0) {
                    app.openLink((app.Places.locationViewModel.find));
                }
                if (app.Places.locationViewModel.find && app.Places.locationViewModel.find.indexOf(',') < 0) {                           //Perform Address Search
                    request = {
                        location: locality,
                        bounds: map.getBounds(),
                        query: app.Places.locationViewModel.find
                    };
                    service.textSearch(request, function (results, status) {
                        if (status !== google.maps.places.PlacesServiceStatus.OK) {
                            console.error(status);
                            return false;
                        } else {
                            for (var i = 0; i < results.length; i++) {
                                place = results[i];
                                var partnerV = new app.Places.newPartner();
                                partnerV.setPlaceRow(place);// define as a general Place
                                app.Places.locationViewModel.list.put(partnerV.vicinity(), partnerV);
                            }
                        }
                    });
                } else {
                    //Search on find text with , in address
                    app.Places.locationViewModel.onSearchAddress();
                }

                function toggleBounce() {
                    if (this.getAnimation() !== null) {
                        this.setAnimation(null);
                    } else {
                        this.setAnimation(google.maps.Animation.BOUNCE);
                    }
                };
            },
            onSearchAddress: function () {
                app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
                app.Places.locationViewModel.set("isGoogleDirectionsInitialized", false);
                app.adMobService.viewModel.prepareInterstitial();
                var that = this;
                var addr = that.get("find");
                geocoder.geocode({
                    'address': addr
                },
                                 function (results, status) {
                                     if (status !== google.maps.GeocoderStatus.OK) {
                                         console.error(status);
                                         app.notify.showLongBottom(appSettings.messages.tryAgain);
                                         return;
                                     }
                                     map.panTo(results[0].geometry.location);
                                     var partnerV = new app.Places.newPartner();
                                     partnerV.setTripRow(results[0]);// define as a specific Partner
                                     app.Places.addToTrip(partnerV);
                                     //bounds
                                     //that._putMarker(results[0].geometry.location);
                                     locality = results[0].geometry.location;

                                    // map.setZoom(app.Places.locationViewModel.getBoundsZoomLevel(allBounds));
                                     map.fitBounds(allBounds);
                                 });
            },
            toggleLoading: function () {
                //app.showAlert("Loading "+this._isLoading)
                if (this._isLoading) {
                    app.mobileApp.pane.loader.show()
                } else {
                    app.mobileApp.pane.loader.hide();
                }
            },
            currentLocation: function (marker, partnerRow) {
                //kjhh to do update my address
                var lat = marker.position.lat().toString();
                var lng = marker.position.lng().toString();
                var url = "styles/images/avatar.png";
                if (app.Users.currentUser.data)
                    url = app.Users.currentUser.data.PictureUrl;
                var options;
                if (!app.isOnline()) {
                    options = appSettings.defaultMedia;
                } else {
                    options = app.Users.currentUser.data.jsonDirectory;
                }
                var infoContent = '<h3>' + appSettings.messages.inspectorTitle + '</h3>';
                for (var i = 0; i < options.length; i++) {
                    if (options[i].selected === true) {
                        var name = options[i].name;
                        if (!appSettings.infoContent[name]) {
                            app.showError("<" + name + "> is missing")
                        } else {
                            infoContent = infoContent + appSettings.infoContent[name].replace("#:lat#", lat).replace("#:lng#", lng);
                        }
                    }
                }
                var theAddress = myAddress;
                if (partnerRow) theAddress = partnerRow.Address;

                infoContent = infoContent + '<br/><div class="user-avatar" style="margin:20px -10px 0px 5px;">'
                              + '<a id="avatarLink" data-role="button" class="butn"> <img id="myAvatar" src='
                              + url + ' alt="On2See"></a></div>'

                              + '<h4>' + appSettings.messages.inspectorHelp + '</h4>' + '<p id="addressStatus">' + theAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '<br/>'
                              + app.helper.formatDate(new Date()) + '</span>' + '<br/><span id="dateTime">' + '</span>' + '</p>'
                return infoContent;
            },
            _putMarker: function (position) {
                //position = { lat: -34.397, lng: 150.644 };
                var that = this;

                if (that._lastMarker !== null && that._lastMarker !== undefined) {
                    that._lastMarker.setMap(null);
                }

                that._lastMarker = new google.maps.Marker({
                    map: map,
                    position: position,
                    draggable: false,
                    zIndex: 100
                });
                homePosition = { lat: that._lastMarker.getPosition().lat(), lng: that._lastMarker.getPosition().lng() }; // update position display for local search
                allBounds.extend(that._lastMarker.position);
                //localBounds.extend(that._lastMarker.position);
                map.setZoom(app.Places.locationViewModel.getBoundsZoomLevel(allBounds));
                Selfie.Address = that.getAddress(position, that._lastMarker);
                Selfie.marker = that._lastMarker;
                //var partnerV = new app.Places.newPartner();
                //that.myMark = partnerV.setHomeRow(Selfie);// define as a general Place
                //app.Places.locationViewModel.list.put(partnerV.vicinity(), partnerV);
                //Center InfoWindow PopUp
                google.maps.event.addListener(that._lastMarker, 'click', function () {
                    infoWindow.setContent(that.currentLocation(that._lastMarker));
                    map.setZoom(17);
                    that._lastMarker.setDraggable(false);
                    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    app.Places.visiting = Selfie;
                    infoWindow.open(map, that._lastMarker);
                    that._lastMarker.setZIndex(100);
                });
                //google.maps.event.clearInstanceListeners(that.myMark);
                //google.maps.event.addListener(that.myMark, 'click', function () {
                //    infoWindow.setContent(that.currentLocation(that.myMark));
                //    map.setZoom(17);
                //    that._lastMarker.setDraggable(false);
                //    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                //    app.Places.visiting = Selfie;
                //    infoWindow.open(map, that.myMark);
                //    that.myMark.setZIndex(100);
                //});
                //google.maps.event.addListener(that.myMark, 'dragend', function () {
                //    newPlace = this.getPosition();
                //    map.setCenter(newPlace); // Set map center to marker position
                //    that.getAddress(newPlace, this);
                //    homePosition = { lat: this.getPosition().lat(), lng: this.getPosition().lng() }; // update position display
                //});

                google.maps.event.addListener(infoWindow, 'closeclick', function () {
                    //map.fitBounds(allBounds);
                    //if (map.zoom > 20) map.setZoom(20);
                    map.setZoom(app.Places.locationViewModel.getBoundsZoomLevel(allBounds));
                    map.setCenter(allBounds.getCenter());
                    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                });
                google.maps.event.addListener(infoWindow, 'domready', function () {
                    var avatarRoute = document.getElementById("avatarLink");
                    if (avatarRoute) {
                        avatarRoute.addEventListener("click", function () {
                            if (app.isOnline()) {
                                app.mobileApp.navigate("views/updateView.html")
                            } else {
                                app.mobileApp.navigate("#welcome")
                            }
                        });
                    }
                    var camera = document.getElementById("camera");
                    if (camera) {
                        camera.addEventListener("click", app.helper.cameraRoute);
                    }
                    var feedRoute = document.getElementById("notifications");
                    if (feedRoute) {
                        feedRoute.addEventListener("click", function () {
                            app.mobileApp.navigate("components/notifications/view.html");
                        });
                    }
                    var favorites = document.getElementById("favorites");
                    if (favorites) {
                        favorites.addEventListener("click", function () {
                            app.mobileApp.navigate("components/favorites/view.html");
                        });
                    }
                    var schedule = document.getElementById("schedule");
                    if (schedule) {
                        schedule.addEventListener("click", function () {
                            app.Places.browse("http://www.sipantic.net/notifications/jsbin.html");
                        });
                    }
                    var offer = document.getElementById("offer");
                    if (offer) {
                        offer.addEventListener("click", function () {
                            app.Places.browse("http://www.sipantic.net/notifications/calendar.html");
                        });
                    }
                    var calendar = document.getElementById("calendar");
                    //app.showAlert("calendar");
                    if (calendar) {
                        //app.showAlert("calendar 2");
                        calendar.addEventListener("click", function () {
                            app.Places.browse("https://calendar.google.com");
                        });
                    }
                    var goHome = document.getElementById("googleMaps");
                    if (goHome) {
                        goHome.addEventListener("click",
                                                function () {
                                                    if (this.attributes.valueOf()["data-lat"]) {
                                                        var lat = this.attributes.valueOf()["data-lat"].value;
                                                        var lng = this.attributes.valueOf()["data-lng"].value
                                                        if ((lat === "#lat#" || lng === "#lng#") ||
                                                            (locality.lat - lat < .0001 && locality.lng - lng < .00001)) {
                                                            app.notify.showLongBottom(appSettings.messages.directions);
                                                            app.Places.browse("https://news.google.com")
                                                        } else {
                                                            if (locality) {
                                                                app.Places.browse("https://maps.google.com?saddr=" + locality.lat + "," + locality.lng + "&daddr=" + lat + "," + lng)
                                                            }
                                                        }
                                                    }
                                                })
                    }

                    var saveAddressLink = document.getElementById("saveAddressLink");
                    if (saveAddressLink) {
                        saveAddressLink.addEventListener("click",
                                                         function () {
                                                             if (app.Users.currentUser.data && (app.Users.currentUser.data.Id === "84bb6cf0-b3e0-11e5-8558-adda7fdf67e8")) {
                                                                 app.mobileApp.navigate("components/partners/add.html?Name=&placeId=" + app.Places.locationViewModel._lastMarker.place_id + "&www=&textField=&lng=" + app.Places.locationViewModel._lastMarker.position.lng().toFixed(6) + "&lat=" + app.Places.locationViewModel._lastMarker.position.lat().toFixed(6) + "&email=newpartner@On2See.com&html=&icon=" + app.Places.locationViewModel.lastPicture + "&address=" + myAddress + "&tel=&city=&zipcode")
                                                             } else {
                                                                 app.mobileApp.navigate("components/aboutView/view.html")
                                                             }
                                                         }
                            )
                    }
                    //var calendarLink = document.getElementById("calendar");
                    //if (calendarLink) {
                    //    calendarLink.addEventListener("click",
                    //                                  function () {
                    //                                      app.mobileApp.navigate("components/aboutView/view.html")
                    //                                  }
                    //        )
                    //}
                    var myGooglePlus = document.getElementById("googleplus");
                    if (myGooglePlus) {
                        myGooglePlus.addEventListener('click', function () {
                            //app.showAlert("myGooglePlus")
                            app.Places.browse("http://plus.google.com")
                        })
                    }
                    var privateFeed = document.getElementById("iSee");
                    if (privateFeed) {
                        privateFeed.addEventListener('click', function () {
                            if (!app.isOnline()) {
                                app.mobileApp.navigate("#welcome");
                            } else {
                                //app.showAlert("privateFeed")
                                app.mobileApp.navigate("#views/activitiesView.html?ActivityText=My Private Feed")
                            }
                        })
                    }
                    //var defaultSites = appSettings.defaultSites;
                    var xx = JSON.stringify(appSettings.infoContent).split('"');
                    for (var j = 1; j < xx.length - 2; j += 4) {
                        var yy = xx[j];
                        console.log(yy);
                        var site = yy;
                        if (xx[j + 2].indexOf('data-url') > 0) {
                            addDEL(document.getElementById(site));
                        }
                    }
                });
                function addDEL(name) {
                    if (name) {
                        name.addEventListener('click', function () {
                            if (this.attributes.valueOf()["data-url"].length > 4) {
                                app.Places.browse(this.attributes.valueOf()["data-url"].value.replace("#:city#", app.cdr.myCity).replace("#:state#", app.cdr.myState).replace("#:CITY#", app.cdr.myCity.replace(' ', '')).replace("#:STATE#", app.cdr.myState.replace(' ', '')))
                            } else {
                                app.Places.browse("http://www." + name.firstElementChild.alt + ".com/search?q=" + app.cdr.myCity)
                            }
                        })
                    } else {
                        return
                    }
                }
                function updatePosition(lat, lng) {
                    document.getElementById('dragStatus').innerHTML = 'New Lat: ' + lat.toFixed(6) + ' New Lng: ' + lng.toFixed(6);
                }

                function updateAddress(myAddress) {
                    document.getElementById('addressStatus').innerHTML = myAddress;
                }
            },
            places: placesDataSource,
        });
        return {
            addToTrip: function (item) {
                //app.showAlert(JSON.stringify(item));
                if (!app.Places.locationViewModel.trip) {
                    app.Places.locationViewModel.trip = new app.Places.List;
                }
                //var partnerV = new app.Places.newPartner();
                //partnerV.setTripRow(item);// define as a specific Partner
                app.Places.locationViewModel.trip.put(item.vicinity(), item);
                //app.favorites.directions();
            },
            listViewOpen: function () {
                app.mobileApp.navigate("views/listView.html")
            },
            updatePartnerLocation: function () {
                app.notify.getLocation(function () {
                    if (app.Places.locationViewModel.list && app.Places.locationViewModel.list.keys.length) {
                        for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
                            try {
                                app.Places.locationViewModel.list.get(app.Places.locationViewModel.list.keys[i]).clearMark();
                            } catch (e) {
                            }
                        }
                    }
                    update = true;
                    app.Places.initLocation();
                    app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, [])
                })
            },
            initLocation: function () {
                //common variables
                //app.notify.showLongBottom(appSettings.messages.mapMessage);
                if (typeof google === "undefined") {
                    app.showAlert("Google not found!");
                    return;
                }
                infoWindow = new google.maps.InfoWindow();
                google.maps.event.addListener(infoWindow, 'domready', function () {
                    //var listButton = document.getElementById("listButton")
                    //listButton.removeEventListener("click",app.Places.listViewOpen);
                    //listButton.style.display = 'none';
                });
                //create empty LatLngBounds object
                allBounds = new google.maps.LatLngBounds();
                app.Places.locationViewModel.list = new app.Places.List;
                var pos, userCords, streetView, tempPlaceHolder = [];

                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    mapTypeControl: false,
                    streetViewControl: false,
                    scroolwheel: false,
                    zoom: 15,
                    center: new google.maps.LatLng(0, -20), // only blue sea
                    panCtrl: false,
                    zoomCtrl: true,
                    zoomCtrlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    },
                    scaleControl: false,
                    fullscreenControl: false
                }

                //Fire up

                app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                geocoder = new google.maps.Geocoder();
                //add App Site
                homePosition = { lat: app.cdr.lat, lng: app.cdr.lng };//new google.maps.LatLng(app.cdr.lng, app.cdr.lat);
                //var position = homePosition;
                //that.toggleLoading();
                if (!app.Places.locationViewModel.markers) {
                    app.Places.locationViewModel.markers = new Array;
                    allBounds = new google.maps.LatLngBounds();
                }
                if (!app.Places.locationViewModel.details) {
                    app.Places.locationViewModel.details = new Array;
                }
                var partnerV = new app.Places.newPartner();
                if (!app.cdr.app) {
                    //app.showAlert("Please try again...");
                    //app.mobileApp.navigate("views/mapView.html");
                }
                else {
                    partnerV.setPartnerRow(app.cdr.app);
                    app.Places.visiting = partnerV;
                    app.Places.locationViewModel.list.put(partnerV.vicinity(), partnerV);
                }
                //app.notify.showLongBottom("Loading CloudClub Partner. Click the star to research this Partner.")
                app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
                streetView = map.getStreetView();
            },
            show: function () {
                if (!map) app.showAlert("No map!!!");
                if (infoWindow) infoWindow.close();
                app.mobileApp.pane.loader.show();
                if (app.Users.currentUser.data && app.Users.currentUser.data.jsonList.partner.rememberMe === true) {
                    localStorage.access_token = localStorage.access_token1
                }
                app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
                app.adMobService.viewModel.removeBanner();
                //app.adMobService.viewModel.prepareInterstitial();
                if (app.isOnline()) {
                    if (document.getElementById("myAvatar")) {
                        document.getElementById("myAvatar").src = app.Users.currentUser.data.PictureUrl;
                    }
                } else {
                    if (document.getElementById("myAvatar")) {
                        document.getElementById("myAvatar").src = "styles/images/avatar.png"
                    }
                }
                if (app.isNullOrEmpty(app.Places.locationViewModel) || !app.Places.locationViewModel.get("isGoogleMapsInitialized")) {
                    app.Places.locationViewModel = new LocationViewModel();
                }
                //resize the map in case the orientation has been changed while showing other tab
                google.maps.event.trigger(map, "resize");

                map.setZoom(app.Places.locationViewModel.getBoundsZoomLevel(allBounds));
            },
            hide: function () {
                //hide loading mask if user changed the tab as it is only relevant to location tab
                app.mobileApp.hideLoading();
            },
            locationViewModel: new LocationViewModel(),
            listShow3: function (result) {
                var thisPartner, Details;
                if (result === 1) {//cancel
                    return
                }
                if (result === 2) {//remove
                    thisPartner = app.Places.visiting;
                    Details = thisPartner.details();
                    //app.showAlert("Delete this item "+ Details.vicinity);
                    Details.clearMapMark();
                }
                if (result === 3) {//highlight
                    if (!app.isOnline()) {
                        app.mobileApp.navigate("#welcome");
                    } else {
                        thisPartner = app.Places.visiting;
                        Details = thisPartner.details();
                        //app.showAlert("Delete this item "+ Details.vicinity);
                        Details.highlightMapMark();
                        app.showOptions(appSettings.messages.saveHighlight, appSettings.whatToDo, function (button) {
                            if (button === 1) {
                            }
                            if (button === 2) {
                                app.Places.addToTrip(app.Places.visiting);
                            }
                            if (button === 3) {
                                var place = app.Places.visiting.details();
                                app.notify.fixPlaceId(place.placeId, JSON.stringify(place))
                            }
                        }, ['CANCEL', 'TRIP', 'FAVORITES'])
                    }
                }
            },
            visitingShow: function (e) {
                app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
                var name = e.view.params.name;
                app.helper.getPartnerFollowers(name, false)
            },
            listShow: function (e) {
                app.notify.showLongBottom(appSettings.messages.listHelp)
                app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
                try {
                    var ds2 = new app.Places.List;
                    var ds3 = new app.Places.List;
                    if (e && e.view.params.keep) {
                        for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
                            var vitem = app.Places.locationViewModel.list.get(app.Places.locationViewModel.list.keys[i]);
                            //var bitem = app.Places.locationViewModel.list.get(app.Places.locationViewModel.list.keys[i])
                            var thisState;
                            thisState = vitem.details().visibility;
                            var item = vitem.details();
                            switch (e.view.params.keep) {
                                case 1:
                                case "1":
                                    //keep selected (Push and do nothing)
                                    if (thisState === "visible") {
                                        ds3.put(vitem.vicinity(), vitem);
                                    } else {
                                        item.clearMapMark(vitem.vicinity());
                                    }
                                    break;
                                case 2:
                                case "2":
                                    //delete selected (Do not push and set null)
                                    if (thisState === "hidden") {
                                        ds3.put(vitem.vicinity(), vitem);
                                    } else {
                                        item.clearMapMark(vitem.vicinity());
                                    }
                                    break;
                                default:
                                    alert("No case found " + e.view.params.keep)
                                    break;
                            }
                            //}
                        }
                        app.Places.locationViewModel.list = ds3;
                        var ps = new app.Places.List;
                        for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
                            var newPartner = app.Places.locationViewModel.list.keys[i];
                            newPartner = app.Places.locationViewModel.list.get(newPartner)
                            if (newPartner)
                                ps.put(newPartner.vicinity(), newPartner);
                        }
                    } else {
                        //reopen list so dynamically rebuild the List from the markers store
                        var ps = new app.Places.List;
                        var psArray = app.Places.locationViewModel.list.array();
                        for (var i = 0; i < psArray.length; i++) {
                            var newPartner = psArray[i];
                            newPartner = psArray[i]
                            if (newPartner) {
                                try {
                                    ps.put(newPartner.vicinity(), newPartner);
                                } catch (e) {
                                    ps.put(newPartner.vicinity, app.Places.locationViewModel.list.get(newPartner.vicinity));
                                }
                            }
                            //ds.add(newPartner.vicinity(), newPartner.details());
                        }

                        // da = ds.array();
                        app.Places.locationViewModel.list = ps;
                    }
                    try {
                        app.Places.displayListView();
                    } catch (ex) {
                        app.showAlert(JSON.stringify(ex));
                    }
                } catch (e) {
                    app.showAlert(JSON.stringify(e));
                }
            },
            displayListView: function () {
                var aList = app.Places.locationViewModel.list.array();
                list = $("#places-listview").kendoMobileListView({
                    dataSource: aList,
                    template: "<div id = '#:name#' class='${isSelectedClass}' ><div class='image-with-text'>"
                              + "<a href='#: website #'>"
                              + "<img src='#: icon #' width='10%'></a><div id='placelist'"
                              + "data-role='touch' data-enable-swipe='true'"
                              + " data-swipe='app.Places.locationViewModel.openListSheet'"
                              + "><strong> #: name #</strong><div id='placedetails' ${visibility} "
                              + "style='width:100%; margin-top:-5px'> #: vicinity # -- about "
                              + " #: distance # mile(s) (as the crow flys). <br/></div></div></div></div>",
                    //<a data-role='button' data-click='app.Places.addToTrip' data-nameAttribute='#:name#' class='btn-continue km-widget km-button'>Shortlist this Place</a><a data-role='button' data-click='app.Places.addToTrip' data-nameAttribute='#:name#' class='btn-continue km-widget km-button'>Delete this Place</a>
                    selectable: "multiple",
                    change: function () {
                        alert("Change event!")
                    }
                })
                    .data("kendoListView");
                //app.showAlert(JSON.stringify(aList));
                $("#places-listview").on("data-swipe", "li", app.Places.locationViewModel.openListSheet)
            },
            onSelected: function (e) {
                if (!e.dataItem) {
                    return;
                }
                try {
                    var isSelected = e.dataItem.get("visibility");
                    var newState = isSelected === "hidden" ? "visible" : "hidden";
                    e.dataItem.set("isSelected", newState);
                    if (newState === "visible") {
                        e.dataItem.set("isSelectedClass", "listview-selected");
                        e.dataItem.set("visibility", "visible")
                        app.Places.locationViewModel.list.attribute(e.dataItem.vicinity, "visible");
                        app.Places.visiting = app.Places.locationViewModel.list.get(e.dataItem.vicinity);
                        app.Places.visiting.e = e;
                        myCity = e.dataItem.city;
                        app.Places.visiting.checkInfoWindow();
                    } else {
                        e.dataItem.set("isSelectedClass", "");
                        e.dataItem.set("visibility", "hidden");
                        app.Places.locationViewModel.list.attribute(e.dataItem.vicinity, "hidden");
                    }
                } catch (e) {
                    JSON.stringify(e)
                }
            },
            memorize: function () {
                app.notify.memorize();
            },
            near: function (callBack) {
                app.notify.getLocation(function (x) {
                    locality = x;
                    callBack(x)
                });
            },
            iabLoadError: function (event) {
                app.notify.showLongBottom(event.type + ' - ' + event.message);
                if (bw) {
                    bw.close();
                }
            },
            iabClose: function (event) {
                //app.notify.showShortTop(event.type);
                //iabRef.removeEventListener('loadstart', iabLoadStart);
                //iabRef.removeEventListener('loadstop', iabLoadStop);
                //iabRef.removeEventListener('loaderror', iabLoadError);
                if (bw !== null) {
                    bw.removeEventListener('exit', app.Places.iabClose);
                }
                app.mobileApp.navigate('views/mapView.html');
            },
            browse: function (url) {
                if (url === null || url === undefined || url.length < 10 || (url.button && url.button.length > 0)) {
                    var base = new URL("/", "https://en.wikipedia.org");
                    if (app.isNullOrEmpty(myCity))
                        myCity = "Boca Raton, Florida";//app.Places.visiting.details().city() +", "+app.Places.visiting.details().state() ;
                    url = new URL("wiki/" + myCity, base);
                }
                app.notify.showLongBottom(appSettings.messages.url);
                bw = window.open(url, "_system", "location=yes");
                bw.addEventListener("loaderror", app.Places.iabLoadError);
                bw.addEventListener("exit", app.Places.iabClose);
            },
            List: function () {
                this.keys = new Array();
                this.data = new Array();
                this.put = function (key, value) {
                    if ((!app.isNullOrEmpty(key) || !app.isNullOrEmpty(value)) && this.data[key] === undefined) {
                        this.keys.push(key);
                        this.data[key] = value;
                        try {
                            myCity = value.getPartner().City;
                        }
                        catch (e) {
                            try{
                                myCity = value.city();
                            }catch (e)
                            {
                                myCity = value.formatted_address;
                            }
                        }
                    }
                };
                this.add = function (key, value) {
                    if (this.data[key] === undefined) {
                        this.keys.push(key);
                        this.data[key] = value;
                    }
                };
                this.delete = function (key) {
                    var state = false;
                    for (var i = 0; i < this.keys.length; i++) {
                        if (key === this.keys[i]) {
                            delete this.keys[i];
                            state = true
                            break;
                        }
                    }
                    return state;
                };
                this.get = function (key) {
                    return this.data[key];
                };
                this.remove = function (key) {
                    this.keys.remove(key);
                    this.data[key] = null;
                };
                this.each = function (fn) {
                    if (typeof fn != 'function') {
                        return;
                    }
                    var len = this.keys.length;
                    for (var i = 0; i < len; i++) {
                        var k = this.keys[i];
                        fn(k, this.data[k], i);
                    }
                };
                this.entrys = function () {
                    var len = this.keys.length;
                    var entrys = new Array(len);
                    for (var i = 0; i < len; i++) {
                        entrys[i] = {
                            key: this.keys[i],
                            value: this.data[i]
                        };
                    }
                    return entrys;
                };
                this.array = function () {
                    var len = this.keys.length;
                    var array = new Array();
                    for (var i = 0; i < len; i++) {
                        var key = this.keys[i];
                        if (key !== undefined) {
                            array.push(this.get(key).details());
                        }
                    }
                    return array;
                };
                this.isEmpty = function () {
                    return this.keys.length == 0;
                };
                this.size = function () {
                    return this.keys.length;
                };
                this.attribute = function (key, action) {
                    switch (action) {
                        case "visible":
                            this.data[key].details().setVisibility("visible");
                            return this.data[key].details().visibility;

                        case "hidden":
                            this.data[key].details().setVisibility("hidden");
                            return this.data[key].details().visibility;

                        case "visibility":
                            return this.data[key].details().visibility;

                        default:
                            return {
                                visible: this.data[key].visibility,
                                isSelectedClass: this.data[key].isSelectedClass
                            };
                    }
                }
            },
            newPartner: function () {
                //every mark on the map is defined as a newPartner object
                var service = new google.maps.places.PlacesService(map);
                var partnerRow = null;
                var dataType = null;
                var isSelected = false;
                var googleDataFetch;
                var priceString = "$$";
                var empty = "";
                var googleData = "";
                var space = "%20";
                var quote = "%27";
                var plus = "+";
                var name = "";
                var UrlString = "components/activities/view.html?ActivityText=";
                var Mark;
                var membersList;
                var iFollow = function () {
                    var id = app.Users.currentUser.Id;
                    return id.isIn(membersList);
                }
                var htmlIw;
                var options = {
                    map: map,
                    position: {
                        lat: 0,
                        lng: 0
                    },
                    zIndex: 10,
                    vicinity: "",
                    icon: {
                        url: "styles/images/greencircle.png", //place.markerUrl,
                        scaledSize: new google.maps.Size(30, 30),
                    }
                };
                var items;
                var addressComponent = function (component) {
                    var items = googleData.address_components;
                    var result = items.filter(
                        function (item) {
                            return (item.types[0] === component)
                        })
                    if (result.length === 1) {
                        result = result[0].long_name
                        return result;
                    } else {
                        return "";
                        ("Place not found!")
                    }
                }
                //var state = function () { items.filter(function (item) { return (item.types[0] === "administrative_area_level_1") }) }
                var displayList = function (parts) {
                    var showIcon = parts.name;
                    var Path = parts.path;
                    var term = name();
                    if (parts.query === "search")
                        if (!app.isNullOrEmpty(app.Places.locationViewModel.find)) {
                            term = app.Places.locationViewModel.find;
                        } else {
                            if (app.Places.visiting.details().city()) {
                                term = app.Places.visiting.details().city();
                            } else {
                                term = app.cdr.myCity;
                            }
                        }
                    var searchTerm = resolveString(resolveString(resolveString(term, "'", "%27"), "&", "%26"), " ", "%20");
                    searchTerm = resolveString(searchTerm, " ", parts.space);
                    if (Path.indexOf("#:name#") > 0) {
                        Path = resolveString(Path, "#:name#", searchTerm)
                    } else {
                        Path = Path + searchTerm;//parts.query;
                    }
                    if (Path.indexOf("#:city#") > 0) {
                        Path = resolveString(Path, "#:city#", addressComponent("locality"))
                    }
                    if (Path.indexOf("#:state#") > 0) {
                        Path = resolveString(Path, "#:state#", addressComponent("administrative_area_level_1"))
                    }
                    var itemHtml = '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\''
                                   + Path + '\');"><img src="styles/images/'
                                   + showIcon + '.png" alt="'
                                   + showIcon + '" height="auto" width="25%" style="padding:5px"></a>';
                    return itemHtml;
                };
                var toCustomHtml = function () {
                    //try {
                        var introHtml;
                        var a = Address()
                        var i = infoString()
                        var id = myId()
                        var n = name()
                        var p = Phone()
                        var w = Website()
                        var pp = picture()
                        var gp = getPartner();
                        if (!p && !w) {
                            introHtml = '<div>'
                            + '<h3 >' + n + '</h3>'
                    		+ '<img src = ' + pp + ' style="padding: 10px 0 0 15px" width="90%" height="auto">'
                    		+ '<p>' + app.formatDate(gp.CreatedAt) + '</p></div>'
                    		+ '<p >' + a + '</p>'
                    		+ '<p>' + gp.Text + '</p>'
                            return introHtml;
                        }
                        var programmedOptions;
                        var customList = htmlOptions.uris;
                        var customOptions = htmlOptions.defaultOptions.display;
                        var standardOptions = htmlOptions.defaultOptions.standard;
                        if (partnerOptions && partnerOptions.defaultOptions && partnerOptions.defaultOptions.display) {
                            customOptions = partnerOptions.defaultOptions.display;
                            programmedOptions = partnerOptions.purl;
                            standardOptions = partnerOptions.defaultOptions.standard;
                        }
                        var workingList = new Array();// build the array for media search
                        if(customOptions){
                            for (var k = 0; k < customOptions.length; k++) {
                                var option = customOptions[k];
                                workingList = workingList.concat(htmlOptions.defaultOptions[option]);
                            }
                        }
                        introHtml = '<div><div class="iw-subTitle"><br/><a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\''
                                        + w + '\');"><u>' + n + '</u></a></div>' // Title Row
                                        + '<div class="image-with-text"><a data-role="button" class="butn" data-rel="external" href="tel:'
                                        + p + '">' + '<img src="styles/images/phone2.png" alt="'
                                        + p + '" height="auto" width="25%" style="padding:-5px"></a><p><small>' //Phone Icon address and info next
                                        + a + ', ' + i + '</small></div><div class="iw-subTitle" style="padding-top:22px">Social Media Links</div><div>' //Address etc
                    //} catch (e) {
                    //    app.showError(e.message)
                    //}
                    if (standardOptions) {
                        for (var l = 0; l < standardOptions.length; l++) {
                            var parts = standardOptions[l];
                            switch (parts) {
                                case "events":
                                case "notifications":
                                    introHtml = introHtml + '<a data-role="button" class="butn" href="#components/notifications/view.html?Id='
                                                + id + '"><img src="styles/images/notifications.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>'
                                    break;
                                case "follow":
                                    introHtml = introHtml + '<a data-role="button" class="butn" href="#views/placesView.html?name='
                                                + resolveString(resolveString(n, "'", "%27"), "&", "%26") + '"><img src="styles/images/follow.png" alt="'
                                                + n + ' website" height="auto" width="25%" style="padding:5px"></a>'
                                    break;
                                case "activities":
                                    if (programmedOptions) {
                                        introHtml = introHtml + '<a data-role="button" class="butn" href="#components/activities/view.html?ActivityText='
                                                    + resolveString(resolveString(n, "'", "%27"), "&", "%26") + '"><img src="styles/images/on2see-icon-120x120.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>'
                                    }
                                    break;
                                case "partner":
                                    introHtml = introHtml + '<a data-role="button" class="butn" href="#views/placesView.html?name='
                                                + resolveString(resolveString(n, "'", "%27"), "&", "%26") + '"><img src="' + picture() + '" alt="'
                                                + n + ' website" height="auto" width="25%" style="padding:5px"></a>'
                                    break;
                                case "camera":
                                    introHtml = introHtml + '<a data-role="button" class="butn" onclick="app.helper.cameraRoute()"><img src="styles/images/camera.png" alt="camera" height="auto" width="25%" style="padding:5px"></a>'
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    if (programmedOptions) {
                        for (var h = 0; h < programmedOptions.length; h++) {
                            var link = programmedOptions[h];
                            if (link.icon) {
                                if (link.icon.substring(0, 4) !== "http")
                                    link.icon = "styles/images/" + link.name + ".png";
                                introHtml = introHtml + '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\''
                                            + link.path + '\');"><img src="' + link.icon + '" alt="' + link.name + '" height="auto" width="25%" style="padding:5px"></a>'
                            }
                        }
                    } else {
                        if (workingList) {
                            for (var m = 0; m < workingList.length; m++) {
                                var htmlItem = customList[workingList[m]];
                                if (htmlItem)
                                    introHtml = introHtml + displayList(htmlItem);
                            }
                        }
                    }
                    app.Places.visiting = app.Places.locationViewModel.list.get(a);
                    return introHtml;
                };
                var setInfoWindow = function () {
                    htmlIw = toCustomHtml();
                    if (htmlIw.indexOf("NaN")>0) {
                        htmlIw = app.Places.locationViewModel.currentLocation(Mark, partnerRow);
                    }
                    //app.showAlert(htmlIw);
                    infoWindow.setContent(htmlIw);
                    map.setZoom(15)
                    infoWindow.open(map, Mark);
                    if (partnerRow.City) {
                        myCity = partnerRow.City;
                        //app.cdr.myCity = myCity;
                    } else {
                        myCity = partnerRow.vicinity;
                    }
                    app.notify.showLongBottom(appSettings.messages.infoWindow)
                    return true;
                };
                this.checkInfoWindow = function () {
                    checkInfoWindow(showReviewAlert);
                    if (placeId() === undefined)
                        app.notify.showLongBottom(name() + " is missing a PlaceID");
                };
                var checkInfoWindow = function (callback) {
                    if (googleDataFetch === true || placeId() === undefined) {
                        callback();
                    } else {
                        var place = {
                            placeId: placeId()
                        };
                        googleDataFetch = true;
                        service.getDetails(place, function (result, status) {
                            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                                console.error(status);
                                return false;
                            }
                            googleData = result;
                            items = googleData.address_components;
                            callback()
                            return true;
                        }
                            )
                    }
                };
                var Website = function () {
                    if (app.isNullOrEmpty(partnerRow.Website) && googleData.website)
                        partnerRow.Website = googleData.website;
                    return partnerRow.Website;
                };
                var Description = function () {
                    if (!partnerRow.Description || partnerRow.Description.length < 10) {
                        partnerRow.Description = "This is a new setup that will be updated shortly. "
                    }
                    return partnerRow.Description;
                }
                var partnerOptions = function () {
                    if (app.isNullOrEmpty(partnerOptions))
                        partnerOptions = htmlOptions;
                    return partnerOptions;
                };
                var initClass = function () {
                    if (partnerRow.icon !== 'styles/images/avatar.png') {
                        Mark = new google.maps.Marker(options);
                        app.Places.locationViewModel.markers.push(Mark);
                        //extend the bounds to include each marker's position
                        allBounds.extend(options.position);
                        if(dataType === "Place")localBounds.extend(options.position);
                        //now fit the map to the newly inclusive bounds
                        map.fitBounds(allBounds);
                        if (dataType === "Place") map.fitBounds(localBounds);
                        //var newZoom = app.Places.locationViewModel.getBoundsZoomLevel(allBounds);
                        google.maps.event.addListener(Mark, 'click', function () {
                            //if (Mark.icon && Mark.icon.url === "styles/images/xstar.png") {
                            //    app.showAlert("Star");
                            //    checkInfoWindow(setInfoWindow);
                            //} else {
                                checkInfoWindow(setInfoWindow);
                            //}
                        })
                    }
                    return Mark;
                };
                var distance = function () {
                    var R = 6371; // km
                    if (partnerRow) {
                        var lat1 = app.cdr.lat;
                        var lng1 = app.cdr.lng;
                        var lat2 = lat();
                        var lng2 = lng();
                        var dLat = (lat2 - lat1) * Math.PI / 180;
                        var dLon = (lng2 - lng1) * Math.PI / 180;
                    }
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    var c = 2 * Math.asin(Math.sqrt(a));
                    var d = R * c / 1.61; // converted to miles
                    if (d === 'NaN') {
                        app.showError('Distance error!')
                        d = 0;
                    }
                    return d.toFixed(0);
                };
                var visible = "hidden";
                var isSelectedClass = function () {
                    if (isSelected || visible === "visible") {
                        return "isSelectedClass";
                    } else {
                        return "";
                    }
                };
                var visibility = function () {
                    return visible;
                };
                var name = function () {
                    if (app.isNullOrEmpty(partnerRow.Place)) {
                        partnerRow.Place = partnerRow.name;
                    }
                    return partnerRow.Place;
                };
                var myId = function () {
                    if (app.isNullOrEmpty(partnerRow.Id) && dataType === "Partner") {
                        app.showError("Partner has no Id!");
                    }
                    return partnerRow.Id;
                };
                var lat = function () {
                    if (!partnerRow.Location && partnerRow.location) {
                        partnerRow.Location = partnerRow.location;
                    }
                    if (partnerRow.Location && partnerRow.Location.lat) return partnerRow.Location.lat;
                    if (!partnerRow.Location || app.isNullOrEmpty(partnerRow.Location)) {
                        partnerRow.Location = {};
                        try {
                            partnerRow.Location.lat = partnerRow.geometry.location.lat();
                            partnerRow.Location.lng = partnerRow.geometry.location.lng();
                        } catch (e) {
                            partnerRow.Location.lat = partnerRow.location.lat;
                            partnerRow.Location.lng = partnerRow.location.lng;
                        }
                    }
                    if (partnerRow.Location.lat) {
                        return partnerRow.Location.lat;
                    } else {
                        return partnerRow.Location.latitude;
                    }
                };
                var lng = function () {
                    if (!partnerRow.Location && partnerRow.location) {
                        partnerRow.Location = partnerRow.location;
                    }
                    if (partnerRow.Location && partnerRow.Location.lng) return partnerRow.Location.lng;
                    if (!partnerRow.Location || app.isNullOrEmpty(partnerRow.Location)) {
                        partnerRow.Location = {};
                        try {
                            partnerRow.Location.lat = partnerRow.geometry.location.lat();
                            partnerRow.Location.lng = partnerRow.geometry.location.lng();
                        }
                        catch (e) {
                            partnerRow.Location.lat = partnerRow.location.lat;
                            partnerRow.Location.lng = partnerRow.location.lng;
                        }
                    }
                    if (partnerRow.Location.lng) {
                        return partnerRow.Location.lng;
                    } else {
                        return partnerRow.Location.longitude;
                    }
                };
                var picture = function () {
                    var iconText = partnerRow.Icon;
                    if (!iconText) iconText = partnerRow.icon;
                    if (iconText.indexOf('//') > -1 || iconText.indexOf('styles/images') > -1) {
                        return iconText;
                    } else {
                        return app.helper.resolvePictureUrl(iconText);
                    }
                };
                var getPartner = function () {
                    return partnerRow;
                };
                var Address = function () {
                    if (app.isNullOrEmpty(partnerRow.Address && googleData !== "")) {
                        partnerRow.Address = googleData.formatted_address;
                    }
                    return partnerRow.Address;
                };
                var State = function () {
                    if (app.isNullOrEmpty(partnerRow.State && googleData !== "")) {
                        partnerRow.State = addressComponent("administrative_area_level_1");
                    }
                    return partnerRow.State;
                };
                var City = function () {
                    if (app.isNullOrEmpty(partnerRow.City && googleData !== "")) {
                        partnerRow.City = addressComponent("locality");
                    }
                    return partnerRow.City;
                };
                var placeId = function () {
                    if (app.isNullOrEmpty(partnerRow.PlaceId)) {
                        if (partnerRow.place_id) partnerRow.PlaceId = partnerRow.place_id;
                        if (partnerRow.placeId) partnerRow.PlaceId = partnerRow.placeId;
                    }
                    return partnerRow.PlaceId;
                };
                var Phone = function () {
                    if (app.isNullOrEmpty(partnerRow.Phone) && googleData.international_phone_number) {
                        partnerRow.Phone = googleData.international_phone_number;
                    }
                    return partnerRow.Phone;
                };
                var Icon = function () {
                    if (app.isNullOrEmpty(partnerRow.Icon)) {
                        partnerRow.Icon = "styles/images/default-image.jpg";
                        return partnerRow.Icon;
                    }
                    var iconText = partnerRow.Icon;
                    if (iconText.indexOf('//') > -1) {
                        return iconText;
                    } else {
                        return app.helper.resolvePictureUrl(iconText);
                    }
                };
                var listString = function () {
                    return ' about ' + distance() + ' miles (As The Crow Flies).';
                }
                var infoString = function () {
                    try {
                        var rl = googleData.reviews.length;
                        var gr = googleData.rating;
                        var pl = googleData.price_level;
                        var tp = googleData.types[0];
                        if (!rl)
                            rl = 0;
                        if (!gr)
                            gr = 0;
                        if (!pl)
                            pl = 0;
                        if (!tp)
                            tp = "food";
                        //app.notify.showShortTop(tp);
                    } catch (e) {
                        return ' about <strong>' + distance() + '</strong> miles (ATCF).';
                    }
                    var openString = " about <strong>" + distance() + "</strong> miles (ATCF), but presently Closed.";
                    if (googleData.opening_hours) {
                        if (googleData.opening_hours.open_now) {
                            openString = googleData.international_phone_number + '<strong> Open Now </strong> about <strong>' + distance() + '</strong> miles (ATCF).';
                        }
                    }
                    var starString = '<br>No reviews or stars. ';
                    try {
                        starString = ' ... <strong>' + rl + '</strong> reviews and <strong>' + gr + '</strong> stars. Price Range: <strong>' + pl + '</strong></small>';
                    } catch (e) {
                        starString = ' ... No reviews and <strong>' + gr + ' </strong> stars and price Range: <strong>' + pl + '</strong></small>';
                    }
                    var s = starString.indexOf("undefined");
                    if (s > -1) {
                        return openString + '.';
                    } else {
                        return openString + ", " + starString;
                    }
                }
                var showReviewAlert = function () {
                    var list = googleData.reviews;
                    var text = "";
                    if (!list) {
                        text = "No Google Map reviews available for " + partnerRow.Place;
                    } else {
                        for (var i = 0; i < list.length; i++) {
                            text = text + '\n' + list[i].author_name + ', (' + (new Date(list[i].time * 1000)).toDateString() + '),\n ' + list[i].rating + ' Stars, ' + list[i].text + '\n';
                        }
                    }
                    if (app.Places.locationViewModel.checkSimulator()) {
                        text = text + '\n' + JSON.stringify(googleData);
                        app.Places.browse("http://jsoneditoronline.org/?json=" + JSON.stringify(googleData));
                    }
                    app.showReviews(text, "Google Reviews for " + partnerRow.Place, function (result) {
                        app.Places.listShow3(result)
                    });
                    myCity = app.Places.locationViewModel.getComponent(googleData.address_components, "locality");
                    return text;
                }
                this.vicinity = function () {
                    if (partnerRow.dataType === 'Current') {
                        partnerRow.vicinity = app.cdr.address
                    }
                    if (app.isNullOrEmpty(partnerRow.Address)) {
                        partnerRow.Address = partnerRow.vicinity;
                    }
                    return partnerRow.Address;
                };
                this.likeClick = function () {
                    if (!app.isOnline()) {
                        app.mobileApp.navigate("#welcome");
                    } else {
                        var Id = app.Users.currentUser.data.Id;
                        var myArray = app.Places.visiting.clubList;
                        if (myArray) {
                            var result = $.grep(myArray, function (e) {
                                return e.id === Id;
                            });
                            if (result.length === 0) {
                                app.notify.memorize(app.Places.visiting.getPartnerRow().Id);
                                app.notify.showLongBottom(appSettings.messages.membership);
                            } else {
                                app.notify.showLongBottom("You are alreay enrolled!")
                            }
                        } else {
                            app.notify.memorize(JSON.stringify(app.Places.visiting.details()));
                        }
                    }
                };
                this.rating = function () {
                    return htmlIw.rating;
                };
                this.reviews = function () {
                    if (googleData !== "" && googleData.reviews) {
                        var list = googleData.reviews;
                        var text = "";
                        for (var i = 0; i < list.length; i++) {
                            text = text + '\n' + list[i].author_name + ', (' + list[i].time + '),\n ' + list[i].rating + ' Stars, ' + list[i].text + '\n';
                        }

                        return text;
                    } else {
                        return false;
                    }
                };
                this.setTripRow = function (place) {
                    partnerRow = place;
                    dataType = "Trip";
                    //if (!options) var options;//kjhh quick fix
                    options.zIndex = 12;
                    options.icon.url = 'styles/images/pin.png';
                    partnerRow.icon = options.icon.url;
                    //options.icon.scaledSize = new google.maps.Size(3 * options.zIndex, 3 * options.zIndex)
                    try
                    {
                        options.position = { lng: partnerRow.location.lng, lat: partnerRow.location.lat };
                    }
                    catch (e)
                    {
                        options.position = { lng: partnerRow.geometry.location.lng(), lat: partnerRow.geometry.location.lat() };
                        place.name = place.formatted_address;
                        place.vicinity = place.formatted_address;
                        place.distance = place.formatted_address;

                    }
                    options.vicinity = partnerRow.vicinity;

                    try {
                        initClass();
                    } catch (e) {
                        app.notify.showLongBottom(appSettings.messages.tryAgain + partnerRow.vicinity + e.message);
                        return;
                    }
                    //app.Places.locationViewModel.list.put(place.formatted_address, place);
                };
                this.setActivityRow = function (place, callback) {
                    partnerRow = place;
                    dataType = "Activity";
                    options.zIndex = 12;
                    options.icon.url = 'styles/images/camera.png';
                    partnerRow.Icon = place.Picture;
                    partnerRow.Place = place.Title;
                    geocoder.geocode({
                        'location': { lat: partnerRow.Location.latitude, lng: partnerRow.Location.longitude }
                    },
                                     function (results, status) {
                                         if (status !== google.maps.GeocoderStatus.OK) {
                                             console.error(status);
                                             return false;
                                         } else {
                                             if (results[0]) {
                                                 partnerRow.vicinity = results[0].formatted_address;
                                                 partnerRow.placeId = results[0].place_id;
                                                 options.position = { lng: partnerRow.Location.longitude, lat: partnerRow.Location.latitude };
                                                 options.vicinity = partnerRow.vicinity;
                                                 partnerRow.icon = partnerRow.Picture;
                                                 try {
                                                     initClass();
                                                 } catch (e) {
                                                     app.notify.showLongBottom(appSettings.messages.tryAgain + partnerRow.vicinity + e.message);
                                                 }
                                                 callback();
                                             }
                                         }
                                     })
                };
                this.setPlaceRow = function (place) {
                    partnerRow = place;
                    dataType = "Place";
                    options.zIndex = 6;
                    if (partnerRow.rating < 3.0) {
                        options.icon.url = 'styles/images/redcircle.png';
                        options.zIndex = 4;
                        partnerRow.icon = options.icon.url;
                    }
                    if (partnerRow.rating > 4.2) {
                        options.icon.url = 'styles/images/orangecircle.png';
                        options.zIndex = 8;
                        partnerRow.icon = options.icon.url;
                    }
                    options.icon.scaledSize = new google.maps.Size(3 * options.zIndex, 3 * options.zIndex)
                    options.position = { lng: partnerRow.geometry.location.lng(), lat: partnerRow.geometry.location.lat() };
                    if (!partnerRow.vicinity && partnerRow.formatted_address) partnerRow.vicinity = partnerRow.formatted_address;
                    options.vicinity = partnerRow.vicinity;
                    partnerRow.Icon = options.icon.url;
                    try {
                        initClass();
                    } catch (e) {
                        app.notify.showLongBottom(appSettings.messages.tryAgain + partnerRow.vicinity + e.message);
                        return;
                    }
                };
                this.setPartnerRow = function (p) {
                    //check p for valid values
                    partnerRow = p;
                    dataType = "Partner";
                    //test for geopoint as a string and convert string to geopoint
                    if (partnerRow.Location.length !== undefined) {
                        if (partnerRow.Location.length > 15) {
                            app.showError('Marker Error' + partner.Location);
                        }
                    }
                    if (p.Place === "Home") {
                        app.Places.locationViewModel.home = partner;
                    }
                    if (!partnerRow.Location.lat) {
                        partnerRow.Location.lat = partnerRow.Location.latitude;
                        partnerRow.Location.lng = partnerRow.Location.longitude;
                    }
                    options = {
                        map: map,
                        position: {
                            lat: partnerRow.Location.lat,
                            lng: partnerRow.Location.lng
                        },
                        zIndex: 10,
                        vicinity: partnerRow.Address,
                        icon: {
                            url: "styles/images/star.png", //place.markerUrl,
                            scaledSize: new google.maps.Size(30, 30),
                        }
                    }
                    //load default html
                    if (partnerRow.Html) {
                        try {
                            partnerOptions = JSON.parse(partnerRow.Html);
                        } catch (e) {
                            partnerRow.partnerOptions = {
                                "product": "On2See partners urls",
                                "version": 1.1,
                                "releaseDate": "2016-09-19T00:00:00.000Z",
                                "approved": true,
                                "partner": {
                                    "stars": "5",
                                    "rating": "$$"
                                },
                                "defaultOptions": {
                                    "standard": ["notifications", "activities", "camera", "website"],
                                    "search": ["google", "twitter", "bing", "googleMaps"],
                                    "food": ["zomato", "yelp"],
                                    "display": ["search", "food"],
                                    "jobs": ["angiesList", "homeAdviser"]
                                },
                                "customOptions": ["iSee", "notifications", "zomato", "yelp", "google", "twitter", "bing", "googleMaps"],
                            }
                        }
                    }
                    initClass();
                }
                this.setHomeRow = function (p) {
                    //check p for valid values
                    partnerRow = p;
                    partnerRow.dataType = "Current";
                    //test for geopoint as a string and convert string to geopoint
                    //if (partnerRow.Location.length !== undefined) {
                    //    if (partnerRow.Location.length > 15) {
                    //        app.showError('Marker Error' + partner.Location);
                    //    }
                    //}
                    //if (p.Place === "Home") {
                    //    app.Places.locationViewModel.home = partner;
                    //}
                    //if (!partnerRow.Location.lat) {
                    //    partnerRow.Location.lat = partnerRow.Location.latitude;
                    //    partnerRow.Location.lng = partnerRow.Location.longitude;
                    //}
                    options = {
                        map: map,
                        position: {
                            lat: app.cdr.lat,
                            lng: app.cdr.lng
                        },
                        zIndex: 10,
                        vicinity: app.cdr.Address,
                        icon: {
                            url: "styles/images/pin.png", //place.markerUrl,
                            scaledSize: new google.maps.Size(30, 30),
                        }
                    }
                    //load default html
                    if (partnerRow.Html) {
                        try {
                            partnerOptions = JSON.parse(partnerRow.Html);
                        } catch (e) {
                            partnerRow.partnerOptions = {
                                "product": "On2See partners urls",
                                "version": 1.1,
                                "releaseDate": "2016-09-19T00:00:00.000Z",
                                "approved": true,
                                "partner": {
                                    "stars": "5",
                                    "rating": "$$"
                                },
                                "defaultOptions": {
                                    "standard": ["notifications", "activities", "camera", "website"],
                                    "search": ["google", "twitter", "bing", "googleMaps"],
                                    "food": ["zomato", "yelp"],
                                    "display": ["search", "food"],
                                    "jobs": ["angiesList", "homeAdviser"]
                                },
                                "customOptions": ["iSee", "notifications", "zomato", "yelp", "google", "twitter", "bing", "googleMaps"],
                            }
                        }
                    }
                    var myMark = initClass();
                    return myMark;
                }
                this.PlaceId = function () {
                    if (app.isNullOrEmpty(partnerRow.PlaceId)) {
                        partnerRow.PlaceId = partnerRow.place_id;
                    }
                    return partnerRow.PlaceId;
                }
                this.getPartnerRow = function () {
                    return partnerRow;
                }
                this.location = function () {
                    if (partnerRow.geometry) {
                        partnerRow.Location = { lng: partnerRow.geometry.location.lng(), lat: partnerRow.geometry.location.lat() };
                    }
                    return partnerRow.Location;
                }
                this.details = function () {
                    return {
                        placeId: this.PlaceId(),
                        location: this.location(),
                        description: Description(),
                        website: Website(),
                        phone: Phone(),
                        icon: Icon(),
                        name: name(),
                        city: City,
                        state: State,
                        isSelectedClass: isSelectedClass(),
                        visibility: visible,
                        setVisibility: function (v) {
                            visible = v;
                        },
                        vicinity: Address(),
                        distance: distance(),
                        listString: listString(),
                        clearLowMark: function () {
                            if (Mark.icon.url === 'styles/images/redcircle.png' || Mark.icon.url === 'styles/images/greencircle.png') {
                                Mark.setMap(null);
                                app.Places.locationViewModel.list.delete(Address());
                            }
                        },
                        clearMapMark: function () {
                            app.showConfirm(appSettings.messages.removeQuestion + name()
                                            + " at " + Address() + listString(), appSettings.messages.removeTitle, function (e) {
                                                if (e === 2)
                                                    return;
                                            });
                            Mark.setMap(null);
                            app.Places.locationViewModel.list.delete(Address());
                            app.Places.displayListView();
                        },
                        highlightMapMark: function () {
                            Mark.setIcon("styles/images/star_red2.png");
                            partnerRow.Icon = "styles/images/star_red2.png";
                        }
                    }
                }
                this.clearMark = function () {
                    Mark.setMap(null);
                    app.Places.locationViewModel.list.delete(partnerRow.Address);
                }
                this.getPartner = function () {
                    return partnerRow;
                }
            }
        };
    }());
    return placesViewModel;
}());