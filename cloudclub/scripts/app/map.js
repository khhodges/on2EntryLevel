/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
	'use strict'
	var infoWindow, markers, place, result, myCity, here, request, position, lat1, lng1, allBounds, theZoom = 12,
		service, allPartners, myAddress, Selfie;
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
	//TO DO: Filter by 70 mile region and refresh when locatio changes


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
					field: 'Location',
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
		var viewModelSearch = kendo.observable({
			selectedProduct: null,
			products: appSettings.products
		});
		//viewModelSearch.selectedProduct = viewModelSearch.products[7];
		//kendo.bind($("#searchList"), app.Places.locationViewModel.viewModelSearch);
		var resolveString = function (name, find, replace) {
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
			isGoogleMapsInitialized: true,
			markers: [],
			details: [],
			hideSearch: false,
			products: viewModelSearch.products,
			selectedProduct: viewModelSearch.selectedProduct,
			locatedAtFormatted: function (partner, marker, text, html, address, name, url, phone, icon) {
				//test for geopoint as a string and convert string to geopoint
				if (marker.length !== undefined) {
					if (marker.length > 15) {
						app.showError('Marker Error' + marker);
					}
				}
				marker.lat = marker.latitude;
				marker.lng = marker.longitude;

				var place = {
						partner: partner,
						details: {
							website: url,
							formatted_phone_number: phone,
							formatted_address: address,
						},
						geometry: {
							location: marker
						},
						icon: icon,
						address: address,
						name: name,
						url: url,
						phone: phone,
						avatar: icon,
						html: html,
						text: text,
						location: marker,
						starString: "",
						distanceString: "",
						addurl: "components/activities/view.html?partner=%Name%"
					}
					//place = app.Places.locationViewModel.updatePlace(place)
				place.distance = app.Places.locationViewModel.updateDistance(place.geometry.location.lat, place.geometry.location.lng)
				place = app.Places.locationViewModel.updateStars(place);
				//Add review count, Stars and Distance
				if (marker) {
					place.addurl = "components/partners/view.html?partner=" + place.name;
					var htmlString = app.Places.locationViewModel.getButtons(place);
					var filter = {};
					var params = [];
					filter.params = params;
					var field = "name";
					var operator = "contains";
					var value = name;
					var param = {
						"field": field,
						"operator": operator,
						"value": value
					};
					filter.params.push(param);
					var js = JSON.stringify(filter);
					htmlString = htmlString.replace('Filter', js).replace('undefined', '');
					var position = new google.maps.LatLng(marker.latitude, marker.longitude);
					place.markerUrl = 'styles/images/on2see-icon-120x120.png';
					place.zIndex = 5;
					if (place.avatar) {
						place.markerUrl = place.avatar;
						place.zIndex = 10;
					}

					try {
						//app.Places.locationViewModel.addMarker(place);
						marker.Mark = new google.maps.Marker({
							map: map,
							position: position,
							zIndex: place.zIndex,
							icon: {
								url: "styles/images/star.png", //place.markerUrl,
								//anchor: new google.maps.Point(20, 38),
								scaledSize: new google.maps.Size(30, 30),
								//title: viewModelSearch.selectedProduct
							}
						});
						//Partners InfoWindow PopUp
						google.maps.event.addListener(marker.Mark, 'click', function () {
							infoWindow.setContent(htmlString);
							infoWindow.open(map, marker.Mark);
							app.Places.visiting = place;
							myCity = place.City;
						});

					} catch (e) {
						app.showError("Error " + JSON.stringify(e));
					}
				}
				return;
			},
			updateDistance: function (lat2, lng2) {
				var R = 6371; // km
				var dLat = (lat2 - lat1) * Math.PI / 180;
				var dLon = (lng2 - lng1) * Math.PI / 180;
				var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
					Math.sin(dLon / 2) * Math.sin(dLon / 2);
				var c = 2 * Math.asin(Math.sqrt(a));
				var d = R * c / 1.61; // converted to miles
				return d.toFixed(4);

			},
			updateStars: function (place) {
				if (app.isNullOrEmpty(place.rating)) {
					place.rating = 1;
				}
				place.sizeRating = place.rating + 1;
				place.isSelected = false;
				place.isSelectedClass = "";
				place.visibility = "hidden";
				if (app.isNullOrEmpty(place.price_level)) {
					place.price_level = 0;
				}
				place.priceString = '$$$$$$$'.substring(0, place.price_level);
				return place;
			},
			onNavigateHome: function () {
				//find present location, clear markers and set up members as icons
				var that = this,
					position = new google.maps.LatLng(-80.08,26.3);
				that._isLoading = true;
				that.toggleLoading();
				if (!app.Places.locationViewModel.markers) {
					app.Places.locationViewModel.markers = new Array;
				}
				if (!app.Places.locationViewModel.details) {
					app.Places.locationViewModel.details = new Array;
				}
				markers = app.Places.locationViewModel.markers;
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				}
				if (!app.isNullOrEmpty(app.cdr)) {
					position = new google.maps.LatLng(app.cdr.latitude, app.cdr.longitude);
				} 
				Selfie = {
					Picture: null,
					name: "My Private Feed",
					Value: null,
					Active: true,
					Notes: 'Selfie',
					Text: '',
					Title: 'Selfie',
					Location: position
				};
				app.Places.visiting = Selfie;
				map.panTo(position);
				that._putMarker(position); //TO DO: hide or show present location marker
				locality = position;
				lat1 = position.lat();
				lng1 = position.lng();
				that._isLoading = false;
				that.toggleLoading();

				var query = new Everlive.Query();
				query.where().nearSphere('Location', new Everlive.GeoPoint(app.cdr.longitude, app.cdr.latitude), 20, 'miles').ne('Icon', 'styles/images/avatar.png');

				var partners = app.everlive.data('Places');
				partners.get(query).then(function (data) {
						allPartners = data.result;
						app.Places.locationViewModel.allPartners = allPartners;
						for (var i = 0; i < data.count; i++) {
							var partner = allPartners[i];
							if (partner.Icon != "styles/images/avatar.png") {
								app.Places.locationViewModel.locatedAtFormatted(partner, partner.Location, partner.Description, partner.Html, partner.Address, partner.Place, partner.Website, partner.Phone, partner.Icon);
								//get details and add to details
							}
							if (partner.Place === "Home") {
								app.Places.locationViewModel.home = partner;
								//map.pan(partner.Location)
							}
						}
					},
					function (error) {
						app.showError(JSON.stringify(error))
					});
			},
			getComponent: function (address_components, component) {
				for (var i = 0; i < address_components.length; i++) {
					if (address_components[i].types[0] === component) {
						myCity = address_components[i].long_name;
						return myCity;
					}
				}
			},
			getAddress: function (latLng, marker) {
				geocoder.geocode({
					'location': latLng
				}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						myAddress = '';
						myCity = '';
						if (results[0]) {
							myAddress = results[0].formatted_address;
							myCity = app.Places.locationViewModel.getComponent(results[0].address_components, "locality");
							if (document.getElementById('addressStatus')) {
								document.getElementById('addressStatus').innerHTML = myAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '</span>';
							}
						}
					} else {
						window.alert('Geocoder failed due to find Address: ' + status);
					}
				});
			},
			getIconUrl: function () {
				var iconText = this.get('Icon');
				if (iconText.contains('//')) {
					return iconText;
				} else {
					return app.helper.resolvePictureUrl(iconText);
				}
			},
			clearMap: function deleteMarkers() { // Deletes all markers in the array by removing references to them.

				markers = app.Places.locationViewModel.markers;
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				}

				markers = [];
				app.Places.locationViewModel.markers = new Array;
				app.Places.locationViewModel.details = new Array;
				//if (document.getElementById("place-list-view") !== null && document.getElementById("place-list-view").innerHTML !== null) {
				//    document.getElementById("place-list-view").innerHTML = "<strong> Cleared</strong>";
				//}
			},
			onPlaceSearch: function () {
				markers = app.Places.locationViewModel.markers;
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				}
				markers = [];
				app.Places.locationViewModel.markers = new Array;
				app.Places.locationViewModel.details = new Array;
				// Create the PlaceService and send the request.
				// Handle the callback with an anonymous function.
				service = new google.maps.places.PlacesService(map);
				here = map.getBounds();
				// Specify location, radius and place types for your Places API search.

				if (app.Places.locationViewModel.find === "Home") {
					map.panTo(location);
					return;
				}

				if (app.Places.locationViewModel.find.trim() === "Back") {
					map.panTo(locality);
					return;
				} else {
					if (app.Places.locationViewModel.find.indexOf(',') < 0) {

						request = {
							location: locality,
							bounds: here,
							keyword: app.Places.locationViewModel.find
						};
						service.nearbySearch(request, function (results, status) {
							if (status == google.maps.places.PlacesServiceStatus.OK) {
								//if length = 0 offer search by country or search by region
								map.panTo(results[0].geometry.location);
								for (var i = 0; i < results.length; i++) {
									place = results[i];
									place.distance = app.Places.locationViewModel.updateDistance(place.geometry.location.lat(), place.geometry.location.lng());
									place = app.Places.locationViewModel.updateStars(place);
									app.Places.locationViewModel.addMarker(place);
									app.Places.locationViewModel.details.push(place);
								}
							} else {
								// Do Place search
								app.notify.showShortTop("Nothing was found in the area shown.");
							}
						});
					} else {
						app.Places.locationViewModel.onSearchAddress();
					}
				}

				function toggleBounce() {
					if (this.getAnimation() !== null) {
						this.setAnimation(null);
					} else {
						this.setAnimation(google.maps.Animation.BOUNCE);
					}
				};
			},
			addMarker: function (place) {
				// If the request succeeds, draw the place location on the map as a marker, and register an event to handle a click on the marker.
				if (!place.sizeRating || place.sizeRating < 1) place.sizeRating = 1;
				if (!place.markerUrl) {
					place.markerUrl = 'styles/images/greencircle.png';
					place.zIndex = 7;
					if (place.sizeRating < 4.5) {
						place.markerUrl = 'styles/images/redcircle.png';
						place.zIndex = 8;
					}
					if (place.sizeRating > 5.2) {
						place.markerUrl = 'styles/images/orangecircle.png';
						place.zIndex = 9;
					}
					if (place.sizeRating === 6.0) {
						place.markerUrl = place.avatar;
						place.zIndex = 10;
					}
				}

				var marker = new google.maps.Marker({
					map: map,
					position: place.geometry.location,
					icon: {
						url: place.markerUrl,
						anchor: new google.maps.Point(3 * place.sizeRating, 5 * place.sizeRating),
						scaledSize: new google.maps.Size(4 * place.sizeRating, 4 * place.sizeRating)
					}
				});
				place.rating = place.rating.toFixed(1);


				app.Places.locationViewModel.markers.push(marker);
				//extend the bounds to include each marker's position
				allBounds.extend(marker.position);
				//now fit the map to the newly inclusive bounds
				map.fitBounds(allBounds);
				//Search InfoWindow Popup
				google.maps.event.addListener(marker, 'click', function () {
					service.getDetails(place, function (result, status) {
						if (status !== google.maps.places.PlacesServiceStatus.OK) {
							console.error(status);
							return;
						}
						place.details = result;
						app.Places.visiting = place;

						place.openString = "Closed, ";
						if (place.opening_hours) {
							if (place.opening_hours.open_now) {
								place.openString = result.formatted_phone_number + '<strong> Open Now</strong>';
							}
						}
						place.starString = '<br>No reviews or stars. ';
						try {
							place.starString = '... <strong>' + result.reviews.length + '</strong> reviews and <strong>' + result.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). Price Range: <strong>' + place.priceString + '</strong></small>';
						} catch (e) {
							place.starString = '... No reviews and <strong>' + result.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). Price Range: <strong>' + place.priceString + '</strong></small>';
						}


						if (!place.name) {
							place.name = "Unknown Name";
						}
						if (place.text) {
							place.text = resolveString(place.text, "&", "and");
						}
						if (place.name) {
							place.name = resolveString(place.name, "&", "and");
						} else {
							place.text = "Not Available"
						};
						place.addurl = encodeURI('components/aboutView/view.html?Name=' + place.name + '&email=newpartner@on2t.com' + '&longitude=' + place.geometry.location.lng() + '&latitude=' + place.geometry.location.lat() + '&html=hhhhh' + '&icon=styles/images/avatar.png' + '&address=' + result.formatted_address.replace('#', '') + '&textField="" &www=' + result.website + '&tel=' + result.formatted_phone_number + '&placeId=' + place.place_id + '&city=' + app.Places.locationViewModel.getComponent(result.address_components, "locality") + '&zipcode=' + app.Places.locationViewModel.getComponent(result.address_components, "postal_code"));
						//    place.infoContent = '<div><span onclick="test(\'' + result.website + '\')\"><strong><u>' + result.name + '</u></a></strong><br>' + 'Phone: ' + result.formatted_phone_number + '<br>' + result.formatted_address.replace('#', '') + place.starString  + place.openString + '</span></div>'
						//       + '<div><table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:33%"><a data-role="button" href='
						//       + url
						place.avatar = "styles/images/avatar.png";
						place.infoContent = app.Places.locationViewModel.getButtons(place);
						//       + ' class="btn-login km-widget km-button">Endorse this Place</a></td></tr></table></div>';
						//}
						infoWindow.setContent(place.infoContent);
						//.Places.locationViewModel.getButtons(result.website, "styles/images/avatar.png", result.formatted_phone_number, place.name, result.formatted_address.replace('#', '')));
						infoWindow.open(map, marker);
					});
				});
			},
			onSearchAddress: function () {
				var that = this;
				var addr = that.get("find");
				geocoder.geocode({
						'address': addr
					},
					function (results, status) {
						if (status !== google.maps.GeocoderStatus.OK) {
							app.notify.showShortTop("Map.Unable to find anything.");
							return;
						}

						map.panTo(results[0].geometry.location);
						//bounds
						that._putMarker(results[0].geometry.location);
						locality = results[0].geometry.location;
					});
			},
			toggleLoading: function () {
				if (this._isLoading) {
					kendo.mobile.application.showLoading();
				} else {
					kendo.mobile.application.hideLoading();
				}
			},
			currentLocation: function (marker) {
				//kjhh to do update my address
				var url = "styles/images/avatar.png";
				if (app.Users.currentUser.data) url = app.Users.currentUser.data.PictureUrl;
				return '<p>' + '<div class="user-avatar" style="margin-left:5px"> <a id="avatarLink" data-role="button" class="butn" style="padding:5px"> <img id="myAvatar" src=' + url + ' alt="On2See" height="auto" width="25%"></a></div>' + '<a id="cameraLink" data-role="button" class="butn" style="padding:5px; margin-left:-15px"> <img src="styles/images/camera.png" alt="On2See" height="auto" width="25%"></a>' + '<a id="myFeedLink" data-role="button" class="butn" style="padding:5px"><img src="styles/images/feed.png" alt="My Private Feed" height="auto" width="25%"/></a>' + '<a id="goHome" data-role="button" class="butn" style="padding:5px"><img src="styles/images/goHome.png" alt="Go Home" height="auto" width="25%"/></a>' + '<a id="saveAddressLink" data-role="button" class="butn" style="padding:5px"><img src="styles/images/contacts.png" alt="Go Home" height="auto" width="25%"/></a>' + '<a id="calendarLink" data-role="button" class="butn" style="padding:5px"><img src="styles/images/calendar.png" alt="Go Home" height="auto" width="25%"/></a>' + '</p>' + '<h3>Drag to locate the Inspector</h3>' + '<p id="addressStatus">' + myAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '<br/>' + app.helper.formatDate(new Date()) + '</span>' + '<br/><span id="dateTime">' + '</span>' + '</p>'
			},
			_putMarker: function (position) {
				var that = this;

				if (that._lastMarker !== null && that._lastMarker !== undefined) {
					that._lastMarker.setMap(null);
				}

				that._lastMarker = new google.maps.Marker({
					map: map,
					position: position,
					draggable: true,
					zIndex: 100
				});
				that.getAddress(position, that._lastMarker);
				//Center InfoWindow PopUp
				google.maps.event.addListener(that._lastMarker, 'click', function () {
					infoWindow.setContent(that.currentLocation(that._lastMarker));
					map.setZoom(17);
					that._lastMarker.setDraggable(true);
					map.setMapTypeId(google.maps.MapTypeId.HYBRID);
					app.Places.visiting = Selfie;
					infoWindow.open(map, that._lastMarker);
					that._lastMarker.setZIndex(100);
				});
				google.maps.event.addListener(that._lastMarker, 'dragend', function () {
					var newPlace = this.getPosition();
					map.setCenter(newPlace); // Set map center to marker position

					that.getAddress(newPlace, this);
					//updatePosition(this.getPosition().lat(), this.getPosition().lng()); // update position display
				});

				google.maps.event.addListener(infoWindow, 'closeclick', function () {
					//app.showAlert("InfoWindo ready 570");
					//that._lastMarker.setDraggable(false);
					map.setZoom(theZoom);
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
					var activityRoute = document.getElementById("cameraLink");
					if (activityRoute) {
						activityRoute.addEventListener("click", app.helper.cameraRoute);
					}
					var feedRoute = document.getElementById("myFeedLink");
					if (feedRoute) {
						feedRoute.addEventListener("click", function () {
							if (app.isOnline()) {
								app.mobileApp.navigate("views/activitiesView.html?ActivityText=My Private Feed&User=" + app.Users.currentUser.data.Id);
							} else {
								app.mobileApp.navigate("components/notifications/view.html");
							}
						});
					}
					var goHome = document.getElementById("goHome");
					if (goHome) {
						goHome.addEventListener("click",
							function () {
								app.notify.getLocation(function (position) {
									map.panTo({
										lat: position.latitude,
										lng: position.longitude
									});
								})
							});
					}
					var saveAddressLink = document.getElementById("saveAddressLink");
					if (saveAddressLink) {
						saveAddressLink.addEventListener("click",
							function () {
								if (app.Users.currentUser.data && (app.Users.currentUser.data.Id === "84bb6cf0-b3e0-11e5-8558-adda7fdf67e8")) {
									app.mobileApp.navigate("components/partners/add.html?Name=&placeId=" + app.Places.locationViewModel._lastMarker.place_id + "&www=&textField=&longitude=" + app.Places.locationViewModel._lastMarker.position.lng().toFixed(6) + "&latitude=" + app.Places.locationViewModel._lastMarker.position.lat().toFixed(6) + "&email=newpartner@on2t.com&html=&icon=" + app.Places.locationViewModel.lastPicture + "&address=" + myAddress + "&tel=&city=&zipcode")
								} else {
									app.mobileApp.navigate("components/aboutView/view.html")
								}
							}
						)
					}
					var calendarLink = document.getElementById("calendarLink");
					if (calendarLink) {
						calendarLink.addEventListener("click",
							function () {
								app.mobileApp.navigate("components/aboutView/view.html")
							}
						)
					}
				});

				function updatePosition(lat, lng) {
					document.getElementById('dragStatus').innerHTML = 'New Lat: ' + lat.toFixed(6) + ' New Lng: ' + lng.toFixed(6);
				}

				function updateAddress(myAddress) {
					document.getElementById('addressStatus').innerHTML = myAddress;
				}
			},
			places: placesDataSource,
			getButtons: function (place) { //url,icon,phone,name,address) {
				var myIcon = place.avatar;
				var htmlString = appSettings.HEAD;
				htmlString = htmlString.replace('WebSite', place.details.website).replace('Icon', place.avatar).replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('%Name%', place.name).replace('%Name%', place.name).replace("Address", place.details.formatted_address);
				htmlString = htmlString.replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('Open', place.openString).replace('Stars', place.starString);
				htmlString = htmlString.replace('UrlString', place.addurl);
				var stringResult, find, replace;
				//Twitter Change//https://twitter.com/search?q=Nick%27s%20Pizza%20Deerfield%20Beach&src=typd&lang=en
				find = '\'';
				replace = '%27';
				stringResult = resolveString(place.name, find, replace);
				find = ' '; // space change
				replace = '%20';
				htmlString = htmlString.replace('Twitter', resolveString(stringResult, find, replace));
				//Rest
				find = '\'';
				replace = ''; //Remove (reused in part)
				stringResult = resolveString(place.name, find, replace);
				//Facebook//https://www.facebook.com/thewhalesribrawbar/?fref=ts
				find = ' '; // space change same remove replace
				replace = '-';
				htmlString = htmlString.replace('Facebook', resolveString(stringResult, find, replace));
				//Google//https://www.google.com/maps/place/Bocas+Best+Pizza+Bar
				replace = '+';
				htmlString = htmlString.replace('Google', resolveString(stringResult, find, replace));
				//Yelp//http://www.yelp.com/biz/bocas-best-pizza-bar-boca-raton
				replace = '-';
				//var city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 2)].trim().replace(' ', '-');
				// TO DO: fix city
				//if (city.split('-')[3] === undefined) city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 3)].trim().replace(' ', '-');
				htmlString = htmlString.replace('Yelp', resolveString(stringResult, find, replace) + myCity);
				//https://www.youtube.com/watch?v=oO4IZaujgrM;
				return htmlString;
			},
		});
		return {
			initLocation: function () {
				//common variables 
				if (typeof google === "undefined") {
					return;
				}

				infoWindow = new google.maps.InfoWindow();
				//create empty LatLngBounds object
				allBounds = new google.maps.LatLngBounds();

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
					zoom: theZoom,
					center: new google.maps.LatLng(0, -20), // only blue sea
					panCtrl: false,
					zoomCtrl: true,
					zoomCtrlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.RIGHT_CENTER
					},
					scaleControl: false
				}

				//Fire up

				app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				//                service = new google.maps.places.PlacesService(map);

				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;
				directionsDisplay.setMap(map);
				var origin_input = document.getElementById('origin-input');
				var destination_input = document.getElementById('destination-input');
				var modes = document.getElementById('mode-selector');

				//map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

				geocoder = new google.maps.Geocoder();
				app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
				streetView = map.getStreetView();
			},
			show: function () {
				if (app.isOnline()) {
					if (document.getElementById("myAvatar")) {
						document.getElementById("myAvatar").src = app.Users.currentUser.data.PictureUrl;
					}
				} else {
					if (document.getElementById("myAvatar")) {
						document.getElementById("myAvatar").src = "styles/images/avatar.png"
					}
				}
				//TO DO: update location and get local partners??
				if (app.isNullOrEmpty(app.Places.locationViewModel) || !app.Places.locationViewModel.get("isGoogleMapsInitialized")) {
					app.Places.locationViewModel = new LocationViewModel();
					//TO DO: Clean up map locations
					app.notify.showShortTop("Map reload!");
				}
				//resize the map in case the orientation has been changed while showing other tab
				google.maps.event.trigger(map, "resize");
			},
			hide: function () {
				//hide loading mask if user changed the tab as it is only relevant to location tab
				kendo.mobile.application.hideLoading();
			},
			locationViewModel: new LocationViewModel(),
			listShow: function () {
				try {
					$("#places-listview").kendoMobileListView({
						dataSource: app.Places.locationViewModel.details,
						template: "<div class='${isSelectedClass}'><strong> #: name #</strong> #: rating # Stars<div ${visibility} style='width:100%; margin-top:10px'> #: vicinity # -- #: distance # m,  #: priceString # <br/><a data-role='button' href='views/mapView.html' class='btn-continue km-widget km-button'>Hide</a></div></div>",
						//sort: { field: rating, dir: desc }
					})
					if (app.Places.locationViewModel.details.length < 1) {
						var base = new URL("/", "https://en.wikipedia.org");
						if (app.Places.visiting.City !== undefined) thisPlace = app.Places.visiting.City;
						var url = new URL("wiki/" + myCity, base);
						if (url === null || url === undefined || url.toString().length < 10) {
							app.notify.showShortTop(url + " the client data is missing preventing service connection!");
						} else {
							app.notify.showShortTop("Url.Map Search " + url);
							var ref = window.open(url, "_blank", "location=yes");
							ref.addEventListener("loaderror", iabLoadError);
							ref.addEventListener("exit", iabClose);
						}
						app.mobileApp.navigate('views/mapView.html');
					}
				} catch (e) {
					app.showError(JSON.stringify(e.message))
				}

			},
			onSelected: function (e) {
				if (!e.dataItem) {
					return;
				}
				var isSelected = e.dataItem.get("isSelected");
				var newState = isSelected ? false : true;
				e.dataItem.set("isSelected", newState);
				if (newState === true) {
					e.dataItem.set("isSelectedClass", "listview-selected");
					e.dataItem.set("visibility", "visible")
				} else {
					e.dataItem.set("isSelectedClass", "");
					e.dataItem.set("visibility", "hidden")
				}
			},
			memorize: function () {
				app.notify.memorize();
			},
			near: function (callBack) {
				app.notify.getLocation(function (x) {
					callBack(x)
				});
			},
			browse: function (url) {
				if (url === null || url === undefined || url.length < 10) {
					app.notify.showShortTop(url + " the client data is missing preventing service connection!");
				} else {
					//var http = new XMLHttpRequest();
					//http.open("HEAD", url, false);
					//http.send();
					//if (http.status != 404) {
					app.notify.showShortTop("Url.Map Search " + url);
					var ref = window.open(url, "_blank", "location=yes");
					ref.addEventListener("loaderror", iabLoadError);
					ref.addEventListener("exit", iabClose);
					//}
					//else {
					//    app.notify.showShortTop("404 mesage, the request is unavailable!");
					//}
				}
			}
		};
	}());
	return placesViewModel;
}());