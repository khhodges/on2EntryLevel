/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
	'use strict'
	var infoWindow, markers, place, result, myCity, myState, newPlace, here, request, home, bw, lat1, lng1, allBounds, theZoom = 15,
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
		//var viewModelSearch = kendo.observable({
		//	selectedProduct: null,
		//	products: appSettings.products
		//});
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
			homeMarker: null,
			isGoogleMapsInitialized: true,
			isGoogleDirectionsInitialized: false,
			markers: [],
			details: [],
			//trips: [],
			hideSearch: false,
			//products: viewModelSearch.products,
			//selectedProduct: viewModelSearch.selectedProduct,
			//locatedAtFormatted: function (partner) {
			//	//test for geopoint as a string and convert string to geopoint
			//	if (partner.Location.length !== undefined) {
			//		if (partner.Location.length > 15) {
			//			app.showError('Marker Error' + partner.Location);
			//		}
			//	}
			//	var Marker = {
			//		lat: partner.Location.lat,
			//		lng: partner.Location.lng
			//	};

			//	var place = {
			//		partner: partner,
			//		details: {
			//			website: partner.Website,
			//			formatted_phone_number: partner.Phone,
			//			formatted_address: partner.Address,
			//		},
			//		geometry: {
			//			location: Marker,
			//		},
			//		icon: partner.Icon,
			//		address: partner.Address,
			//		name: partner.Place,
			//		url: partner.Website,
			//		phone: partner.Phone,
			//		avatar: partner.Icon,
			//		html: partner.Html,
			//		text: partner.Description,
			//		location: Marker,
			//		starString: "4.5",
			//		openString: "Normal hours apply, ",
			//		distanceString: "",
			//		addurl: "components/activities/view.html?partner=%Name%"
			//	}
			//	place.distance = app.Places.locationViewModel.updateDistance(place.geometry.location.lat, place.geometry.location.lng)
			//	place = app.Places.locationViewModel.updateStars(place);
			//	//Add review count, Stars and Distance
			//	if (partner.Location) {
			//		place.addurl = "components/partners/view.html?partner=" + place.name;
			//		var htmlString = app.Places.locationViewModel.getButtons(place);
			//		var position = place.geometry.location;
			//		place.markerUrl = 'styles/images/on2see-icon-120x120.png';
			//		place.openString = '</strong> stars, about <strong>' + place.distance + '</strong> miles from your present location, as the crow flys...';
			//		place.zIndex = 5;
			//		if (place.avatar) {
			//			place.markerUrl = place.avatar;
			//			place.zIndex = 10;
			//		}
			//		try {
			//			//app.Places.locationViewModel.addMarker(place);
			//			partner.Mark = new google.maps.Marker({
			//				map: map,
			//				position: position,
			//				zIndex: place.zIndex,
			//				vicinity: place.address,
			//				pack: place.pack,
			//				icon: {
			//					url: "styles/images/star.png", //place.markerUrl,
			//					scaledSize: new google.maps.Size(30, 30),
			//				}
			//			});
			//			app.Places.locationViewModel.markers.push(partner.Mark);
			//			//extend the bounds to include each marker's position
			//			partner.Mark.position = position;
			//			partner.Mark.pack = app.Places.packPartner(place);
			//			allBounds.extend(position);
			//			//now fit the map to the newly inclusive bounds
			//			map.fitBounds(allBounds);
			//			//app.notify.showShortTop(map.getZoom())
			//			//Partners InfoWindow PopUp
			//			google.maps.event.addListener(partner.Mark, 'click', function () {
			//				infoWindow.setContent(htmlString);
			//				infoWindow.open(map, partner.Mark);
			//				app.Places.visiting = partner;
			//				myCity = place.City;
			//			});
			//		} catch (e) {
			//			app.showError("Error " + JSON.stringify(e));
			//		}

			//	}
			//	return;
			//},
			//updateDistance: function (lat2, lng2) {
			//	var R = 6371; // km
			//	var lat1 = app.cdr.latitude;
			//	var lng1 = app.cdr.longitude;
			//	var dLat = (lat2 - lat1) * Math.PI / 180;
			//	var dLon = (lng2 - lng1) * Math.PI / 180;
			//	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			//		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			//		Math.sin(dLon / 2) * Math.sin(dLon / 2);
			//	var c = 2 * Math.asin(Math.sqrt(a));
			//	var d = R * c / 1.61; // converted to miles
			//	return d.toFixed(4);
			//},
			//updateStars: function (place) {
			//	if (app.isNullOrEmpty(place.rating)) {
			//		place.rating = 1;
			//	}
			//	place.sizeRating = place.rating + 1;
			//	place.isSelected = false;
			//	place.isSelectedClass = "";
			//	place.visibility = "hidden";
			//	if (app.isNullOrEmpty(place.price_level)) {
			//		place.price_level = 0;
			//	}
			//	place.priceString = '$$$$$$$'.substring(0, place.price_level);
			//	return place;
			//},
			onNavigateHome: function () {
				//find present location, clear markers and set up members as icons
				var that = this;
				if (!update) homePosition = { lat: app.cdr.latitude, lng: app.cdr.longitude };//new google.maps.LatLng(app.cdr.longitude, app.cdr.latitude);
				var position = homePosition;
				that._isLoading = true;
				that.toggleLoading();
				if (!app.Places.locationViewModel.markers) {
					app.Places.locationViewModel.markers = new Array;
					//create empty LatLngBounds object
					allBounds = new google.maps.LatLngBounds();
				}
				if (!app.Places.locationViewModel.details) {
					app.Places.locationViewModel.details = new Array;
				}
				app.Places.locationViewModel.clearMap();
				//if (!app.isNullOrEmpty(app.cdr)) {
				//	position = new google.maps.LatLng(app.cdr.latitude, app.cdr.longitude);
				//}
				try {
					Selfie = {
						Picture: null,
						name: "My Private Feed",
						Value: null,
						Active: true,
						Notes: 'Selfie',
						Text: '',
						Title: 'My Private Feed',
						location: position
					};
				} catch (e) { app.Error(JSON.stringify(e)) }
				app.Places.visiting = Selfie;
				map.panTo(position);
				that._putMarker(position);
				locality = position;
				that._isLoading = false;
				that.toggleLoading();
				var query = new Everlive.Query();
				var point = new Everlive.GeoPoint(position.lng, position.lat);
				//query.where().nearSphere('Location', new Everlive.GeoPoint(app.cdr.longitude, app.cdr.latitude), 8, 'miles').ne('Icon', 'styles/images/avatar.png');
				query.where().nearSphere('Location', point, 8, 'miles').ne('Icon', 'styles/images/avatar.png');
				var partners = app.everlive.data('Places');
				partners.get(query).then(function (data) {
					app.Places.locationViewModel.list = new app.Places.List;
					for (var i = 0; i < data.count; i++) {
						var partner = data.result[i];
						var partnerV = new app.Places.newPartner();
						partnerV.setPartnerRow(partner);
						app.Places.visiting = partnerV;
						app.Places.locationViewModel.list.put(partnerV.vicinity(), partnerV);
					}
				},
					function (error) {
						app.showError(JSON.stringify(error))
					});
			},
			getComponent: function (address_components, component) {
				for (var i = 0; i < address_components.length; i++) {
					if (address_components[i].types[0] === "locality") {
						myCity = address_components[i].long_name;
					}
					if (address_components[i].types[0] === "administrative_area_level_1") {
						myState = address_components[i].long_name;
					}
				}
				return myCity;
			},
			getAddress: function (latLng, marker) {
				geocoder.geocode({
					'location': latLng
				}, function (results, status) {
					if (status !== google.maps.GeocoderStatus.OK) {
						console.error(status);
						return false;
					}
					else {
						myAddress = '';
						myCity = '';
						myState = '';
						if (results[0]) {
							myAddress = results[0].formatted_address;
							myCity = app.Places.locationViewModel.getComponent(results[0].address_components, "locality");
							if (document.getElementById('addressStatus')) {
								document.getElementById('addressStatus').innerHTML = myAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '</span>';
							}
						}
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
				//create empty LatLngBounds object
				allBounds = new google.maps.LatLngBounds();
				markers = [];
				app.Places.locationViewModel.markers = new Array;
				app.Places.locationViewModel.details = new Array;
				app.Places.locationViewModel.list = new app.Places.List;
			},
			openListSheet: function () {
				if (!app.Places.locationViewModel.checkSimulator()) {
					app.Places.locationViewModel.showListSheet({
						'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
						'title': 'What do you want to do?',
						'buttonLabels': [
							'Keep Selected Items Only',
							'Delete Selected Items',
							'\'Save\' and additional Features',
							//'Switch Lists',
							//'Get List as Trip Directions',
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
						'title': 'What do you want to do?',
						'buttonLabels': [
							'Show Place List',
							'Show Nearby Partners',
							'Keep the Golden places',
							'Upgrade for more Features',
							//'Switch Lists',
							//'Get List as Trip Directions',
						],
						'addCancelButtonWithLabel': 'Cancel',
						'androidEnableCancelButton': true, // default false
						'winphoneEnableCancelButton': true, // default false
						//'addDestructiveButtonWithLabel' : 'Delete it'                
					});
				} else { app.mobileApp.navigate("views/listView.html"); }
			},
			showListSheet: function (options) {
				if (!this.checkSimulator()) {
					window.plugins.actionsheet.show(
						options,
						function (buttonIndex) {
							// wrapping in a timeout so the dialog doesn't freeze the app
							setTimeout(function () {
								switch (buttonIndex) {
									case 1: //'Keep selected items',
									case 2: //Delete selected items    
										app.mobileApp.navigate("#views/listView.html?keep=" + buttonIndex);
										break;
									case 3:
										app.mobileApp.navigate("#views/updateView.html");
										break;
									//case 8:
									//	break;
									default:
										//app.notify.showShortTop('You will need to upgrade to use this feature.');
										break;
								}
							}, 0);
						}
					);
				}
			},
			showActionSheet: function (options) {
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
									//case 2:
									//	app.Places.updateMapLocation();
									//	break;
									case 2:
										app.Places.updatePartnerLocation();
										break;
									case 3:
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
									//case 8:
									//	break;
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
					app.notify.showShortTop('This plugin is not available in the simulator.');

					return true;
				} else {
					return false;
				}
			},
			onPlaceSearch: function () {
				app.notify.showShortTop(appSettings.messages.searchAgain);
				app.Places.locationViewModel.clearMap();
				// Create the PlaceService and send the request.
				// Handle the callback with an anonymous function.
				service = new google.maps.places.PlacesService(map);
				here = map.getBounds();
				//comand = app.Places.locationViewModel.find;
				//if(comand==='?'){app.Places.locationViewModel.openActionSheet();}
				// Specify location, radius and place types for your Places API search.
				if (app.Places.locationViewModel.find && app.Places.locationViewModel.find.indexOf(',') < 0) {
					//Perform Address Search
					request = {
						location: locality,
						bounds: here,
						keyword: app.Places.locationViewModel.find
					};
					service.nearbySearch(request, function (results, status) {
						if (status !== google.maps.places.PlacesServiceStatus.OK) {
							console.error(status);
							return false;
						}
						else {
							//if length = 0 offer search by country or search by region
							//map.panTo(results[0].geometry.location);
							for (var i = 0; i < results.length; i++) {
								place = results[i];
								var partnerV = new app.Places.newPartner();
								partnerV.setPlaceRow(place);
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
			//addMarker: function (place) {
			//	// If the request succeeds, draw the place location on the map as a marker, and register an event to handle a click on the marker.
			//	if (!place.sizeRating || place.sizeRating < 1)
			//		place.sizeRating = 1;
			//	if (!place.markerUrl) {
			//		place.markerUrl = 'styles/images/greencircle.png';
			//		place.zIndex = 7;
			//		if (place.sizeRating < 4.5) {
			//			place.markerUrl = 'styles/images/redcircle.png';
			//			place.zIndex = 8;
			//		}
			//		if (place.sizeRating > 5.2) {
			//			place.markerUrl = 'styles/images/orangecircle.png';
			//			place.zIndex = 9;
			//		}
			//		if (place.sizeRating === 6.0) {
			//			place.markerUrl = place.avatar;
			//			place.zIndex = 10;
			//		}
			//	}

			//	var marker = new google.maps.Marker({
			//		map: map,
			//		position: place.geometry.location,
			//		place: place,
			//		icon: {
			//			url: place.markerUrl,
			//			anchor: new google.maps.Point(3 * place.sizeRating, 5 * place.sizeRating),
			//			scaledSize: new google.maps.Size(4 * place.sizeRating, 4 * place.sizeRating)
			//		}
			//	});
			//	place.rating = place.rating.toFixed(1);
			//	marker.pack = app.Places.packSearch(place);
			//	app.Places.locationViewModel.markers.push(marker);
			//	//extend the bounds to include each marker's position
			//	allBounds.extend(marker.position);
			//	//now fit the map to the newly inclusive bounds
			//	map.fitBounds(allBounds);
			//	//Search InfoWindow Popup
			//	google.maps.event.addListener(marker, 'click', function () {
			//		service.getDetails(place, function (result, status) {
			//			if (status !== google.maps.places.PlacesServiceStatus.OK) {
			//				console.error(status);
			//				return;
			//			}
			//			place.details = result;
			//			app.Places.visiting = place;

			//			place.openString = "Closed, ";
			//			if (place.opening_hours) {
			//				if (place.opening_hours.open_now) {
			//					place.openString = result.formatted_phone_number + '<strong> Open Now</strong>';
			//				}
			//			}
			//			place.starString = '<br>No reviews or stars. ';
			//			try {
			//				place.starString = '... <strong>' + result.reviews.length + '</strong> reviews and <strong>' + result.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). Price Range: <strong>' + place.priceString + '</strong></small>';
			//			} catch (e) {
			//				place.starString = '... No reviews and <strong>' + result.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). Price Range: <strong>' + place.priceString + '</strong></small>';
			//			}

			//			if (!place.name) {
			//				place.name = "Unknown Name";
			//			}
			//			if (place.text) {
			//				place.text = resolveString(place.text, "&", "and");
			//			}
			//			if (place.name) {
			//				place.name = resolveString(place.name, "&", "and");
			//			} else {
			//				place.text = "Not Available"
			//			}
			//			place.addurl = encodeURI('components/aboutView/view.html?Name=' + place.name + '&email=newpartner@on2t.com' + '&longitude=' + place.geometry.location.lng() + '&latitude=' + place.geometry.location.lat() + '&html=hhhhh' + '&icon=styles/images/avatar.png' + '&address=' + result.formatted_address.replace('#', '') + '&textField="" &www=' + result.website + '&tel=' + result.formatted_phone_number + '&placeId=' + place.place_id + '&city=' + app.Places.locationViewModel.getComponent(result.address_components, "locality") + '&zipcode=' + app.Places.locationViewModel.getComponent(result.address_components, "postal_code"));
			//			//    place.infoContent = '<div><span onclick="test(\'' + result.website + '\')\"><strong><u>' + result.name + '</u></a></strong><br>' + 'Phone: ' + result.formatted_phone_number + '<br>' + result.formatted_address.replace('#', '') + place.starString  + place.openString + '</span></div>'
			//			//       + '<div><table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:33%"><a data-role="button" href='
			//			//       + url
			//			place.avatar = "styles/images/avatar.png";
			//			place.infoContent = app.Places.locationViewModel.getButtons(place);
			//			//       + ' class="btn-login km-widget km-button">Endorse this Place</a></td></tr></table></div>';
			//			//}
			//			infoWindow.setContent(place.infoContent);
			//			//.Places.locationViewModel.getButtons(result.website, "styles/images/avatar.png", result.formatted_phone_number, place.name, result.formatted_address.replace('#', '')));
			//			infoWindow.open(map, marker);
			//		});
			//	});
			//},
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
							app.notify.showShortTop(appSettings.messages.tryAgain);
							return;
						}
						map.panTo(results[0].geometry.location);
						//bounds
						that._putMarker(results[0].geometry.location);
						//locality = results[0].geometry.location;
					});
			},
			toggleLoading: function () {
				//app.showAlert("Loading "+this._isLoading)
				if (this._isLoading) {
					kendo.mobile.application.showLoading();
				} else {
					kendo.mobile.application.hideLoading();
				}
			},
			currentLocation: function (marker) {
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
					if (options[i].selected === 'ON') {
						var name = options[i].name;
						infoContent = infoContent + appSettings.infoContent[name];
					}
				}

				infoContent = infoContent + '<br/><div class="user-avatar" style="margin:20px -10px 0px 5px;">'
                    + '<a id="avatarLink" data-role="button" class="butn"> <img id="myAvatar" src='
					+ url + ' alt="On2See"></a></div>'

					+ '<h4>' + appSettings.messages.inspectorHelp + '</h4>' + '<p id="addressStatus">' + myAddress + '<br/><span id="dragStatus"> Lat:' + marker.position.lat().toFixed(4) + ' Lng:' + marker.position.lng().toFixed(4) + '<br/>'
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
					draggable: true,
					zIndex: 100
				});
				homePosition = { lat: that._lastMarker.getPosition().lat(), lng: that._lastMarker.getPosition().lng() }; // update position display for local search

				//app.Places.locationViewModel.markers.push(that._lastMarker);
				//extend the bounds to include each marker's position
				allBounds.extend(that._lastMarker.position);
				//now fit the map to the newly inclusive bounds
				//map.fitBounds(allBounds);
				//app.notify.showShortTop(map.getZoom());
				map.setZoom(13);
				Selfie.address = that.getAddress(position, that._lastMarker);
				Selfie.marker = that._lastMarker;
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
					newPlace = this.getPosition();
					map.setCenter(newPlace); // Set map center to marker position

					that.getAddress(newPlace, this);
					//homePosition = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng()); // update position display
					homePosition = { lat: this.getPosition().lat(), lng: this.getPosition().lng() }; // update position display
				});

				google.maps.event.addListener(infoWindow, 'closeclick', function () {
					map.fitBounds(allBounds);
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
					var feedRoute = document.getElementById("eventFeed");
					if (feedRoute) {
						feedRoute.addEventListener("click", function () {
							app.mobileApp.navigate("components/notifications/view.html");
						});
					}
					var goHome = document.getElementById("goHome");
					if (goHome) {
						goHome.addEventListener("click",
							function () {
								var lat = this.attributes.valueOf()["data-lat"].value;
								var lng = this.attributes.valueOf()["data-lng"].value
								if((lat === "#lat#"||lng==="#lng")||
								 (locality.lat - lat < .0001 && locality.lng - lng < .00001)) {
									app.notify.showShortTop(appSettings.messages.directions);
									app.Places.browse("https://news.google.com")
								} else {
									if (locality) {
										app.Places.browse("https://maps.google.com?saddr=" + locality.lat + "," + locality.lng + "&daddr=" + lat + "," + lng)
									}
								}
							})
					};
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
					var myGooglePlus = document.getElementById("myGoogle+");
					if (myGooglePlus) {
						myGooglePlus.addEventListener('click', function () {
							// app.showAlert("myGooglePlus")
							app.Places.browse("http://plus.google.com")
						})
					}
					var privateFeed = document.getElementById("privateFeed");
					if (privateFeed) {
						privateFeed.addEventListener('click', function () {
							if (!app.isOnline()) {
								app.mobileApp.navigate("#welcome");
							}
							else {
								//app.showAlert("privateFeed")
								app.mobileApp.navigate("#views/activitiesView.html?ActivityText=My Private Feed")
							}
						})
					}
					var defaultSites = appSettings.defaultSites;
					for (var i = 0; i < defaultSites.length; i++) {
						var site = defaultSites[i];
						addDEL(document.getElementById(site));
					}
				});
				function addDEL(name) {
					if (name) {
						name.addEventListener('click', function () {
							app.Places.browse("http://www." + name.firstElementChild.alt + ".com")
						})
					}
					else { return }
				}
				function updatePosition(lat, lng) {
					document.getElementById('dragStatus').innerHTML = 'New Lat: ' + lat.toFixed(6) + ' New Lng: ' + lng.toFixed(6);
				}

				function updateAddress(myAddress) {
					document.getElementById('addressStatus').innerHTML = myAddress;
				}
			},
			places: placesDataSource,
			//getButtons: function (place) { //url,icon,phone,name,address) {
			//	var htmlString = appSettings.HEAD;
			//	//var myIcon = place.avatar;
			//	//if(myIcon.substring(0,4)!=='http'){
			//	//    htmlString = htmlString.replace('Icon', app.helper.resolvePictureUrl(myIcon));
			//	//}				   
			//	htmlString = htmlString.replace('WebSite', place.details.website).replace('Icon', app.helper.resolvePictureUrl(place.avatar)).replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('%Name%', place.name).replace('%Name%', place.name).replace("Address", place.details.formatted_address);
			//	htmlString = htmlString.replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('Open', place.openString).replace('Stars', place.starString);
			//	htmlString = htmlString.replace('UrlString', place.addurl);
			//	var stringResult, find, replace;
			//	//Twitter Change//https://twitter.com/search?q=Nick%27s%20Pizza%20Deerfield%20Beach&src=typd&lang=en
			//	find = '\'';
			//	replace = '%27';
			//	stringResult = resolveString(place.name, find, replace);
			//	find = ' '; // space change
			//	replace = '%20';
			//	htmlString = htmlString.replace('Twitter', resolveString(stringResult, find, replace));
			//	//Rest
			//	find = '\'';
			//	replace = ''; //Remove (reused in part)
			//	stringResult = resolveString(place.name, find, replace);
			//	//Facebook//https://www.facebook.com/thewhalesribrawbar/?fref=ts
			//	find = ' '; // space change same remove replace
			//	replace = '-';
			//	htmlString = htmlString.replace('Facebook', resolveString(stringResult, find, replace));
			//	//Google//https://www.google.com/maps/place/Bocas+Best+Pizza+Bar
			//	replace = '+';
			//	htmlString = htmlString.replace('Google', resolveString(stringResult, find, replace));
			//	//Yelp//http://www.yelp.com/biz/bocas-best-pizza-bar-boca-raton
			//	replace = '-';
			//	//var city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 2)].trim().replace(' ', '-');
			//	// TO DO: fix city
			//	//if (city.split('-')[3] === undefined) city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 3)].trim().replace(' ', '-');
			//	htmlString = htmlString.replace('Yelp', resolveString(stringResult, find, replace) + myCity);
			//	//https://www.youtube.com/watch?v=oO4IZaujgrM;
			//	return htmlString;
			//},
		});
		return {
			listViewOpen: function () {
				app.mobileApp.navigate("views/listView.html")
			},
			updatePartnerLocation: function () {
				if (app.Places.locationViewModel.list && app.Places.locationViewModel.list.keys.length) {
					for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
						try {
							app.Places.locationViewModel.list.get(app.Places.locationViewModel.list.keys[i]).clearMark();
						} catch (e) {

						}
					}
				}
				update = true;
				app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
			},
			updateMapLocation: function () {
				app.notify.getLocation(function (position) {
					locality = position;
					map.panTo({
						lat: position.latitude,
						lng: position.longitude
					});
					//map.setZoom(theZoom);
					map.fitBounds(allBounds);
					map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
					var iw = infoWindow;
					iw.close();
					app.Places.locationViewModel._putMarker({
						lng: position.longitude,
						lat: position.latitude
					});
				})
			},
			initLocation: function () {
				//common variables 
				app.notify.showLongBottom(appSettings.messages.mapMessage);
				if (typeof google === "undefined") {
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
					scaleControl: false
				}

				//Fire up

				app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				//                service = new google.maps.places.PlacesService(map);

				//var directionsService = new google.maps.DirectionsService;
				//var directionsDisplay = new google.maps.DirectionsRenderer;
				//directionsDisplay.setMap(map);
				//var origin_input = document.getElementById('origin-input');
				//var destination_input = document.getElementById('destination-input');
				//var modes = document.getElementById('mode-selector');

				//map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
				//map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

				geocoder = new google.maps.Geocoder();
				app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
				streetView = map.getStreetView();
			},
			show: function () {
				if (app.Users.currentUser.data && app.Users.currentUser.data.jsonList.partner.rememberMe === "ON") {
					localStorage.access_token = localStorage.access_token1
				}
				app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
				kendo.mobile.application.showLoading();
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
				//TO DO: update location and get local partners??
				if (app.isNullOrEmpty(app.Places.locationViewModel) || !app.Places.locationViewModel.get("isGoogleMapsInitialized")) {
					app.Places.locationViewModel = new LocationViewModel();
					//TO DO: Clean up map locations
					//app.notify.showShortTop("Map was refreshed and reloaded!");
				}
				//resize the map in case the orientation has been changed while showing other tab
				google.maps.event.trigger(map, "resize");
			},
			hide: function () {
				//hide loading mask if user changed the tab as it is only relevant to location tab
				kendo.mobile.application.hideLoading();
			},
			locationViewModel: new LocationViewModel(),
			//packPartner: function (item) {
			//	var result = new Object;
			//	result.name = item.Place;
			//	result.vicinity = item.Address;
			//	result.isSelectedClass = true;
			//	result.rating = 5;
			//	var lat, lng;
			//	if (item.Location) {
			//		lat = item.Location.latitude;
			//		lng = item.Location.longitude;
			//	} else {
			//		lat = item.location.lat;
			//		lng = item.location.lng;
			//	}
			//	result.distance = app.Places.locationViewModel.updateDistance(lat, lng);
			//	result.priceString = '$$';
			//	result.visibility = "hidden";
			//	app.Places.locationViewModel.list.put(result.vicinity, result);
			//	return result;
			//},
			//packSearch: function (item) {
			//	var result = new Object;
			//	result.name = item.name;
			//	result.vicinity = item.vicinity;
			//	result.isSelectedClass = true;
			//	result.rating = item.rating;
			//	result.distance = item.distance;
			//	result.priceString = item.priceString;
			//	result.visibility = "hidden";
			//	app.Places.locationViewModel.list.put(result.vicinity, result);
			//},
			/*			logExceptions: function (func,event1) {
							var orignal = func;
							var decorated = function () {
								try {
									orignal.apply(this, event1);
								} catch (exception) {
									//printStackTrace(exception);
									throw exception;
								}
							}
							return decorated;
						},*/
			/*			
			listShow: function (e) {
							try {
								myEvent = e;
								(app.Places.logExceptions(function (e) {
									app.Places.listShow2(e)
								},e))();
							} catch (exc) {
								JSON.stringify(exc);
							}
						},*/
			listShow3: function (result) {
				if (result === 1) { return };
				if (result === 2) {
					var thisPartner = app.Places.visiting;
					var Details = thisPartner.details();
					//app.showAlert("Delete this item "+ Details.vicinity);
					Details.clearMapMark();
				}

			},
			visitingShow: function (e) {
				app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
				var myId = e.view.params.uid;
				var me = app.Places.visiting;
				//var myDetails = me.datails();
				//app.notify.showShortTop("Visiting show " + app.Places.visiting.details().name)
			},
			listShow: function (e) {
                app.notify.showLongBottom(appSettings.messages.listHelp)
				app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
				try {
					//var e = myEvent;
					var ds2 = new app.Places.List;
					var ds3 = new app.Places.List;
					//var da = app.Places.locationViewModel.list.array();
					//find place markers in active list
					//var markers = app.Places.locationViewModel.markers;
					if (e.view.params.keep) {
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
										//ds2.add(item.vicinity, item);
										ds3.put(vitem.vicinity(), vitem);
									} else {
										item.clearMapMark(vitem.vicinity());
									}
									break;
								case 2:
								case "2":
									//delete selected (Do not push and set null)			                    
									if (thisState === "hidden") {
										//ds2.add(item.vicinity, item);
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
						//app.Places.locationViewModel.list = ds3;
						var ps = new app.Places.List;
						for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
							var newPartner = app.Places.locationViewModel.list.keys[i];
							newPartner = app.Places.locationViewModel.list.get(newPartner)
							if (newPartner) ps.put(newPartner.vicinity(), newPartner);
							//ds.add(newPartner.vicinity(), newPartner.details());
						}
					}
					else {
						//reopen list so dynamically rebuild the List from the markers store
						//var ds = new app.Places.List;
						var ps = new app.Places.List;
						for (var i = 0; i < app.Places.locationViewModel.list.keys.length; i++) {
							var newPartner = app.Places.locationViewModel.list.keys[i];
							newPartner = app.Places.locationViewModel.list.get(newPartner)
							if (newPartner) ps.put(newPartner.vicinity(), newPartner);
							//ds.add(newPartner.vicinity(), newPartner.details());
						};
						// da = ds.array();
						app.Places.locationViewModel.list = ps;
					}
					try {
						var aList = app.Places.locationViewModel.list.array();
						list = $("#places-listview").kendoMobileListView({
							dataSource: aList,
							template: "<div class='${isSelectedClass}'><div id='placelist'"
							+ "data-role='touch' data-enable-swipe='true'"
							//+" data-swipe='app.Places.locationViewModel.openListSheet'"
							+ "><strong> #: name #</strong><div id='placedetails' ${visibility} "
							+ "style='width:100%; margin-top:-5px'> #: vicinity # -- about "
							+ " #: distance # mile(s) (as the crow flys). <br/></div></div></div>",
							//<a data-role='button' data-click='app.Places.addToTrip' data-nameAttribute='#:name#' class='btn-continue km-widget km-button'>Shortlist this Place</a><a data-role='button' data-click='app.Places.addToTrip' data-nameAttribute='#:name#' class='btn-continue km-widget km-button'>Delete this Place</a>
							selectable: "multiple",
							change: function () {
								alert("Change event!")
							}
						})
							.data("kendoListView");
						//app.showAlert(JSON.stringify(aList));
						$("#places-listview").on("data-swipe", "li", app.Places.locationViewModel.openListSheet)
					} catch (ex) {
						app.showAlert(JSON.stringify(ex));
					}
				}
				catch (e) {
					app.showAlert(JSON.stringify(e));
				}
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
				}
				catch (e) {
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
				app.notify.showShortTop(event.type + ' - ' + event.message);
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
				if (url === null || url === undefined || url.length < 10 || url.button) {
					var base = new URL("/", "https://en.wikipedia.org");
					if (app.isNullOrEmpty(myCity)) myCity = "Boca Raton, Florida";//app.Places.visiting.details().city() +", "+app.Places.visiting.details().state() ;
					url = new URL("wiki/" + myCity, base);
				}
				app.notify.showShortTop(appSettings.messages.url);
				bw = window.open(url, "_blank", "location=yes");
				bw.addEventListener("loaderror", app.Places.iabLoadError);
				bw.addEventListener("exit", app.Places.iabClose);
			},
			//directions: function (start, end) {
			//	//app.notify.showShortTop("Showing directions from " + JSON.stringify(start) + " to this place " + JSON.stringify(end))
			//	var directionsDisplay;
			//	var directionsService = new google.maps.DirectionsService();
			//	var directionsDisplay = new google.maps.DirectionsRenderer();
			//	var mapDirections;
			//	function initialize() {
			//		directionsDisplay = new google.maps.DirectionsRenderer();
			//		var mapOptions = {
			//			zoom: 15,
			//			center: start
			//		}
			//		directionsDisplay.setMap(mapDirections);
			//		directionsDisplay.setPanel(document.getElementById('right-panel'));
			//		mapDirections = new google.maps.Map(document.getElementById('map-directions'), mapOptions);
			//		app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
			//		app.Places.locationViewModel.set("isGoogleDirectionsInitialized", true);
			//		//app.notify.showShortTop("Route")
			//		calcRoute();
			//	}
			//	function calcRoute() {
			//		var request = {
			//			origin: start,
			//			destination: end,
			//			travelMode: 'DRIVING'
			//		};
			//		directionsService.route(request, function (result, status) {
			//			if (status == 'OK') {
			//				app.notify.showShortTop("Route OK");
			//				directionsDisplay.setDirections(result);
			//				app.Places.locationViewModel.trips.push(result)
			//			}
			//		});
			//	}
			//	initialize();
			//},
			List: function () {
				this.keys = new Array();
				this.data = new Array();
				this.put = function (key, value) {
					if (!app.isNullOrEmpty(key) || !app.isNullOrEmpty(value)) {
						this.keys.push(key);
						this.data[key] = value;
						myCity = value.getPartner().City;
					}
				};
				this.add = function (key, value) {
					if (this.data[key] == null) {
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
					var array = new Array(len);
					for (var i = 0; i < len; i++) {
						var key = this.keys[i];
						array[i] = this.get(key).details();
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
							break;
						case "hidden":
							this.data[key].details().setVisibility("hidden");
							return this.data[key].details().visibility;
							break;
						case "visibility":
							return this.data[key].details().visibility;
							break;
						default:
							return {
								visible: this.data[key].visibility,
								isSelectedClass: this.data[key].isSelectedClass
							};
					}
					if (action === "get") {

					}

				}
			},
			newPartner: function () {
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
					var result = items.filter
						(function (item) {
							return (item.types[0] === component)
						}
						)
					if (result.length === 1) {
						result = result[0].long_name
						return result;
					} else {
						app.showError("Place not found!")
					}
				}
				//var state = function () { items.filter(function (item) { return (item.types[0] === "administrative_area_level_1") }) }
				var displayList = function (parts) {
					var showIcon = parts.name;
					var Path = parts.path;
					var term = name();
					if (parts.query === "search") term = app.Places.locationViewModel.find;
					var searchTerm = resolveString(resolveString(term, "'", "%27"), "&", "%26");
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
				//return (introHtml + '</div>').replace("styles/images/website.png", Icon());
				//}
				//}
				var toCustomHtml = function () {
					try {
						var a = Address()
						var i = infoString()
                        var id = myId()
						var n = name()
						var p = Phone()
						var w = Website()
						//var p = picture()
						var programmedOptions;
						var customList = htmlOptions.uris;
						var customOptions = htmlOptions.defaultOptions.display;
						var standardOptions = htmlOptions.defaultOptions.standard;
						if (partnerOptions && partnerOptions.defaultOptions && partnerOptions.defaultOptions.display) {
							customOptions = partnerOptions.defaultOptions.display;
							programmedOptions = partnerOptions.url;
							standardOptions = partnerOptions.defaultOptions.standard;
						}
						var workingList = new Array();
						for (var k = 0; k < customOptions.length; k++) {
							var option = customOptions[k];
							workingList = workingList.concat(htmlOptions.defaultOptions[option]);
						}
						var introHtml = '<div><div class="iw-subTitle"><br/><a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\''
							+ w + '\');"><u>'
							+ n + '</u></a></div>' // Title Row
							+ '<div class="image-with-text"><a data-role="button" class="butn" data-rel="external" href="tel:'
							+ p + '">'
							+ '<img src="styles/images/phone2.png" alt="'
							+ p + '" height="auto" width="25%" style="padding:-5px"></a><p><small>' //Phone Icon address and info next
							+ a + ', ' + i + '</small></div><div class="iw-subTitle" style="padding-top:22px">Social Media Links</div><div>' //Address etc

					} catch (e) {
						app.showError(e.message)
					}
					for (var l = 0; l < standardOptions.length; l++) {
						var parts = standardOptions[l];
						switch (parts) {
							case "events":
								introHtml = introHtml + '<a data-role="button" class="butn" href="#components/notifications/view.html?ActivityText='
									+ n + '"><img src="styles/images/events.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>'
								break;
							case "activities":
								if (programmedOptions) {
									introHtml = introHtml + '<a data-role="button" class="butn" href="#components/activities/view.html?ActivityText='
										+ n + '"><img src="styles/images/on2see-icon-120x120.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>'
								}
								break;
							case "partner":
								introHtml = introHtml + '<a data-role="button" class="butn" href="#views/placesView.html?uid='
									+ id + '"><img src="' + app.helper.resolvePictureUrl(picture()) + '" alt="'
									+ n + ' website" height="auto" width="25%" style="padding:5px"></a>'
								break;
							case "camera":
								introHtml = introHtml + '<a data-role="button" class="butn" onclick="app.helper.cameraRoute()"><img src="styles/images/camera.png" alt="camera" height="auto" width="25%" style="padding:5px"></a>'
								break;
							default:
								break;
						}
					}
					if (programmedOptions) {
						for (var h = 0; h < programmedOptions.length; h++) {
							var link = programmedOptions[h];
							if (link.icon === "styles/images/default-image.jpg") link.icon = "styles/images/" + link.name + ".png";
							introHtml = introHtml + '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\''
                                + link.path + '\');"><img src="' + link.icon + '" alt="' + link.name + '" height="auto" width="25%" style="padding:5px"></a>'
						}
					} else {
						for (var m = 0; m < workingList.length; m++) {
							var htmlItem = customList[workingList[m]];
							if (htmlItem) introHtml = introHtml + displayList(htmlItem);
						}
					}
					app.Places.visiting = app.Places.locationViewModel.list.get(a);
					return introHtml;
				};
				var setInfoWindow = function () {
					htmlIw = toCustomHtml();
					infoWindow.setContent(htmlIw);
					infoWindow.open(map, Mark);
					if (partnerRow.City) {
						myCity = partnerRow.City;
					}
                    app.notify.showLongBottom(appSettings.messages.infoWindow)
					return true;
				};
				this.checkInfoWindow = function () {
					checkInfoWindow(showReviewAlert);
					if (placeId() === undefined) app.notify.showShortTop(name() + " is missing a PlaceID");
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
					if (app.isNullOrEmpty(partnerRow.Website) && googleData.website) partnerRow.Website = googleData.website;
					return partnerRow.Website;
				};
				var Description = function () {
					return partnerRow.Description;
				}
				var partnerOptions = function () {
					if (app.isNullOrEmpty(partnerOptions)) partnerOptions = htmlOptions;
					return partnerOptions;
				};
				var initClass = function () {
					if (partnerRow.icon !== 'styles/images/avatar.png') {
						Mark = new google.maps.Marker(options);
						app.Places.locationViewModel.markers.push(Mark);
						//extend the bounds to include each marker's position
						allBounds.extend(options.position);
						//now fit the map to the newly inclusive bounds
						map.fitBounds(allBounds);
						google.maps.event.addListener(Mark, 'click', function () {
							if (Mark.icon.url === "styles/images/xstar.png") {
								app.showAlert("Star");
							} else {
								checkInfoWindow(setInfoWindow);
							}
						})
					}
				};
				var distance = function () {
					var R = 6371; // km
					if (partnerRow) {
						var lat1 = app.cdr.latitude;
						var lng1 = app.cdr.longitude;
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
					if (!partnerRow.Location || app.isNullOrEmpty(partnerRow.Location.latitude)) {
						partnerRow.Location = {};
						partnerRow.Location.latitude = partnerRow.geometry.location.lat();
					}
					return partnerRow.Location.latitude;
				};
				var lng = function () {
					if (!partnerRow.Location || app.isNullOrEmpty(partnerRow.Location.longitude)) {
						partnerRow.Location = {};
						partnerRow.Location.longitude = partnerRow.geometry.location.lng();
					}
					return partnerRow.Location.longitude;
				};
				var picture = function () {
					return partnerRow.Icon;
				}
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
						partnerRow.PlaceId = partnerRow.place_id;
					}
					return partnerRow.PlaceId;
				};
				var Phone = function () {
					if (app.isNullOrEmpty(partnerRow.Phone) && googleData.international_phone_number) {
						partnerRow.Phone = googleData.international_phone_number;
					}
					return partnerRow.Phone;
				}
				var Icon = function () {
					if (app.isNullOrEmpty(partnerRow.Icon)) {
						partnerRow.Icon = "styles/images/default-image.jpg";
						return partnerRow.Icon;
					}
					return app.helper.resolveProfilePictureUrl(partnerRow.Icon);
				}
				var listString = function () {
					return ' about ' + distance() + ' miles (As The Crow Flies).';
				}
				var infoString = function () {
					try {
						var rl = googleData.reviews.length;
						var gr = googleData.rating;
						var pl = googleData.price_level;
						var tp = googleData.types[0];
						if (!rl) rl = 0;
						if (!gr) gr = 0;
						if (!pl) pl = 0;
						if (!tp) tp = "food";
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
					//app.Places.visiting = app.Places.locationViewModel.list.get(googleData.formatted_address);
					app.showReviews(text, "Google Reviews for " + partnerRow.Place, function (result) { app.Places.listShow3(result) });
					myCity = app.Places.locationViewModel.getComponent(googleData.address_components, "locality");
					return text;
				}
				//this.checkPlaceDetails = function (callback) {
				//	if (googleDataFetch === true) {
				//		if (callBack !== null) {
				//			callback();
				//		} else {
				//			return true;
				//		}
				//	}
				//	else {
				//		var place = {
				//			placeId: placeId()
				//		};
				//		googleDataFetch = true;
				//		service.getDetails(place, function (result, status) {
				//			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				//				console.error(status);
				//				return false;
				//			}
				//			googleData = result;
				//			if (app.isNullOrEmpty(callBack)) {
				//				return true;
				//			} else {
				//				callback();
				//			}
				//		}
				//		)
				//	}
				//}
				this.vicinity = function () {
					if (app.isNullOrEmpty(partnerRow.Address)) {
						partnerRow.Address = partnerRow.vicinity;
					}
					return partnerRow.Address;
				};
				this.likeClick = function () {
					app.notify.memorize(myId);
					app.notify.showShortTop(appSettings.messages.membership);
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
				this.setPlaceRow = function (place) {
					partnerRow = place;
					dataType = "Place";
					options.zIndex = 4;
					if (partnerRow.rating < 3.0) {
						options.icon.url = 'styles/images/redcircle.png';
						options.zIndex = 6;
					}
					if (partnerRow.rating > 4.2) {
						options.icon.url = 'styles/images/orangecircle.png';
						options.zIndex = 8;
					}
					options.icon.scaledSize = new google.maps.Size(3 * options.zIndex, 3 * options.zIndex)
					options.position = { lng: partnerRow.geometry.location.lng(), lat: partnerRow.geometry.location.lat() };
					options.vicinity = partnerRow.vicinity;
					try {
						initClass();
					} catch (e) {
						app.notify.showShortTop(appSettings.messages.tryAgain + partnerRow.vicinity + e.message);
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
					options = {
						map: map,
						position: {
							lat: partnerRow.Location.latitude,
							lng: partnerRow.Location.longitude
						},
						zIndex: 10,
						vicinity: partnerRow.Address,
						icon: {
							url: "styles/images/star.png", //place.markerUrl,
							scaledSize: new google.maps.Size(30, 30),
						}
					}
					if (partnerRow.Html) {
						try {
							partnerOptions = JSON.parse(partnerRow.Html);
						}
						catch (e) {
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
									"standard": ["events", "activities", "camera", "website"],
									"search": ["google", "twitter", "bing", "googleMaps"],
									"food": ["zomato", "yelp"],
									"display": ["search", "food"],
									"jobs": ["angiesList", "homeAdviser"]
								},
								"customOptions": ["home", "events", "zomato", "yelp", "google", "twitter", "bing", "googleMaps"],
							}
						}
					}
					initClass();
				}
				this.PlaceId = function () {
					if (app.isNullOrEmpty(partnerRow.PlaceId)) {
						partnerRow.PlaceId = partnerRow.place_id;
					}
					return partnerRow.PlaceId;
				}
				this.location = function () {
					if (app.isNullOrEmpty(partnerRow.Location)) {
						partnerRow.Location = { lng: partnerRow.geometry.location.lng(), lat: partnerRow.geometry.location.lat() };
					}
					return partnerRow.Location;
				}
				this.details = function () {
					return {
						description: Description(),
						website: Website(),
						phone: Phone(),
						icon: Icon(),
						name: name(),
						city: City,
						state: State,
						isSelectedClass: isSelectedClass(),
						visibility: visible,
						setVisibility: function (v) { visible = v; },
						vicinity: Address(),
						distance: distance(),
						listString: listString(),
						clearLowMark: function () {
							if (Mark.icon.url !== 'styles/images/orangecircle.png') {
								Mark.setMap(null);
								app.Places.locationViewModel.list.delete(Address());
							}
						},
						clearMapMark: function () {
							app.showConfirm("Do you want to remove " + name()
								+ " at " + Address() + listString(), "Remove Place", function (e) {
									if (e === 2) return;
								});
							Mark.setMap(null);
							app.Places.visiting.e.dataItem.set("isSelectedClass", "listview-hidden");
							app.Places.visiting.e.dataItem.set("visibility", "hidden");
							app.Places.locationViewModel.list.delete(Address());
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
	} ());
	return placesViewModel;
} ());