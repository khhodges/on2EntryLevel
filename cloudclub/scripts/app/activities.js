/**
 * Activities view model
 */
'use strict'

var app = app || {};

app.Activities = (function () {
	'use strict'
	var $enterEvent, $activityTitle, $newEventText, validator, selected, $baseImage, filterValue, theName, myId, thePartner;
	var init = function () {
		validator = $('#enterEvent').kendoValidator().data('kendoValidator');
		$enterEvent = $('#enterEvent');
		$newEventText = $('#newEventText');
		$activityTitle = $('#activityTitle');
		$newEventText.on('keydown', app.helper.autoSizeTextarea);
		validator.hideMessages();
		//$(document.body).css("visibility", "visible");
	};
	var filterOne = {
		logic: 'or',
		filters: [{
					logic: 'and', filters: [
						{ field: "Title", operator: "eq", value: "My Private Feed" },
						{ field: "UserId", operator: "eq", value: myId }
					]
				},{
					logic: 'and', filters: [
								{ field: "Title", operator: "startswith", value: thePartner },
								{ field: "Title", operator: "neq", value: undefined},
								//{ field: "Title", operator: "startswith", value: "The Whale's Rib Raw Bar"}
							]
				}
		]
	};
	var show = function (e) {
		//app.showAlert("Show starting "+ app.Places.visiting.name +" b7 " + )
		if (e.view.params.ActivityText) {
			app.Places.visiting.name = e.view.params.ActivityText;
		}
		thePartner = app.Places.visiting.name;
		myId = app.Users.currentUser.data.Id;
		//app.showAlert("Show starting "+ thePartner +" by " + myId);
		app.Activities.activities._filter.filters[0].filters[1].value = myId;
		app.Activities.activities._filter.filters[1].filters[0].value = thePartner;
		app.Activities.activities.fetch(function () {
			//app.Activities.activities = this.data();
			//console.log(data.items)
			$('#activities-listview').kendoMobileListView({
															  dataSource: app.Activities.activities,
															  template: kendo.template($('#activityTemplate').html())
														  });
			kendo.bind($("#view-all-activities", app.Activities));
		});
		theName = "My Private Feed";
		if (app.Places.visiting.name) {
			theName = app.Places.visiting.name
		}
		filterValue = e.view.params.User;
		if (e.view.params.camera === 'ON') {
			//app.showAlert("camera is ON!")
			e.view.params.camera = 'OFF';
			document.getElementById('activityTitle').innerText = app.Users.currentUser.data.DisplayName + ' concerning ' + theName;
			app.Activities.addActivity();
		}
	};
	// Activities model
	var activitiesModel = (function () {
		var activityModel = {
			id: 'Id',
			fields: {
				Text: {
						field: 'Text',
						defaultValue: ''
					},
				CreatedAt: {
						field: 'CreatedAt',
						defaultValue: new Date()
					},
				Picture: {
						fields: 'Picture',
						defaultValue: null
					},
				UserId: {
						field: 'UserId',
						defaultValue: null
					},
				Likes: {
						field: 'Likes',
						defaultValue: []
					},
				Location: {
						field: 'Location',
						defaultValue: []
					},
				Active: {
						fields: 'Active',
						defaultValue: 1
					},
				Notes: {
						fields: 'Notes',
						defaultValue: null
					},
				Title: {
						fields: 'Title',
						defaultValue: null
					},
				Value: {
						fields: 'Value',
						defaultValue: 0
					},
				Start: {
						fields: 'StartDate',
						defaultValue: new Date()
					},
				End: {
						fields: 'EndDate',
						defaultValue: new Date()
					},
			},
			CreatedAtFormatted: function () {
				return app.helper.formatDate(this.get('CreatedAt'));
			},
			DateFormatted: function (date) {
				return app.helper.formatDate(date);
			},
			LikesCount: function () {
				return app.helper.formatLikes(this.get('Likes'), this.get('Text'));
			},
			PictureUrl: function () {
				return app.helper.resolvePictureUrl(this.get('Picture'));
			},
			ResponsivePictureUrl: function () {
				var id = this.get('Picture');
				var el = new Everlive(appSettings.everlive.appId);
				el.Files.getById(id).then(function (data) {
					// get url from data
					var url = data.result.Uri;
					var size = "/resize=w:200,h:200,fill:cover/";
					var base = "https://bs1.cdn.telerik.com/image/v1/";
					//navigator.notification.alert(url);
					// convert to responsive url
					url = base + appSettings.everlive.appId + size + url;
					return url;
				}),
				function (error) {
					navigator.notification.alert(JSON.stringify(error));
				}
			},
			User: function () {
				var userId = this.get('UserId');
				if (userId === undefined) {
					app.notify.showShortTop("userID is null");
					userId = app.Users.currentUser.data.Id;
				}

				var user = $.grep(app.Users.users(), function (e) {
					return e.Id === userId;
				})[0];

				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture),
					urlPictureUrl: app.helper.resolveBackgroundPictureUrl(user.Picture, 'bg')
				} : {
					DisplayName: app.Users.currentUser.data.DisplayName,
					PictureUrl: app.helper.resolveProfilePictureUrl(app.Users.currentUser.data.Picture),
					urlPictureUrl: app.helper.resolveBackgroundPictureUrl(app.Users.currentUser.data.Picture, 'bg')
				};
			},
			isVisible: function () {
				var currentUserId;
				currentUserId = app.Users.currentUser.data.Id;
				var userId = this.get('UserId');

				return currentUserId === userId;
			}
		};
		// Activities data source. The Backend Services dialect of the Kendo UI DataSource component
		// supports filtering, sorting, paging, and CRUD operations.
		var activitiesDataSource = new kendo.data.DataSource({
																 type: 'everlive',
																 schema: {
				model: activityModel
			},
																 transport: {
				// Required by Backend Services
				typeName: 'Activities',
			},
																 change: function (e) {
																	 if (e.items && e.items.length > 0) {
																		 $('#no-activities-span').hide();
																	 } else {
																		 $('#no-activities-span').show();
																	 }
																 },
																 sort: {
				field: 'CreatedAt',
				dir: 'desc'
			},
																 filter: {
				logic: 'or',
				filters: [{
								logic: 'and', filters: [
									{ field: "Title", operator: "eq", value: "My Private Feed" },
									{ field: "UserId", operator: "eq", value: myId },
									{ field: "UserId", operator: "eq", value: ""}//add user setting
								]
							},{
								logic: 'and', filters: [
												{ field: "Title", operator: "startswith", value: thePartner },
												{ field: "Title", operator: "neq", value: undefined},
											]
							}
																		 ]
			}
															 }
			);
		//var myDataSource = app.Activities.activities;
		return {
			activities: activitiesDataSource
		};
	}());
	var afterShow = function () {
		app.showAlert("After Show starting")
		var myDataSource = app.Activities.activities;
		myDataSource.fetch(function () {
			app.Activities.activities = this.data();
			//console.log(data.items)
			$('#activities-listview').kendoMobileListView({
															  dataSource: app.Activities,
															  template: kendo.template($('#activityTemplate').html())
														  });
		});
	}
	// Activities view model

	var activitiesViewModel = (function () {
		// Navigate to activityView When some activity is selected
		var activitySelected = function (e) {
			var itemId = $(e.event.target).parents("li").attr("data-uid");
			app.mobileApp.navigate('views/activityView.html?uid=' + itemId);// e.dataItem.uid);
		};
		// Navigate to app home
		var navigateHome = function () {
			app.mobileApp.navigate('#welcome');
		};
		var crop = function () {
			if (!app.isOnline()) {
				return;
			}
			var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
			var starter = document.getElementById("picture");
			var canvas = document.getElementById("canvas");
			if (starter.naturalWidth > starter.naturalHeight) {
				sx = (starter.naturalWidth - starter.naturalHeight) / 2;
				starterWidth = starter.naturalHeight;
				starterHeight = starter.naturalHeight;
				sy = 0;
			} else {
				sy = (-starter.naturalWidth + starter.naturalHeight) / 2;
				starterWidth = starter.naturalWidth;
				starterHeight = starter.naturalWidth;
				sx = 0;
			}
			dx = 0;
			dy = 0;
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
			$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
		}
		var saveActivity = function () {
			// Validating of the required fields
			if (validator.validate()) {
				$enterEvent.style.display = 'none';
				// Adding new comment to Comments model
				var activities = app.Activities.activities;
				var activity = activities.add();
				activity.Text = $newEventText.val();
				$newEventText.Val = "";
				activity.UserId = app.Users.currentUser.get('data').Id;
				document.getElementById('addButton').innerText = "Post";
				activities.sync();
				app.mobileApp.hideLoading();
			}
		};
		var saveImageActivity = function () {
			// Validating of the required fields
			if (selected === undefined || !$baseImage) {
				app.showAlert("First take a photo with your camera and then add a message to match!", "Informational");
			}
			if (validator.validate() && (selected !== undefined)) {
				app.notify.showShortTop("Activities.Uploading image... please wait");
				app.mobileApp.showLoading();
				// Save image as base64 to everlive
				app.everlive.Files.create({
											  Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
											  ContentType: "image/jpeg",
											  base64: $baseImage
										  })
					.then(function (promise) {
						selected = promise.result.Id;

						// Adding new activity to Activities model
						var activities = app.Activities.activities;
						var activity = activities.add();
						activity.Text = document.getElementById('newEventText').value;

						activity.UserId = app.Users.currentUser.get('data').Id;
						activity.Picture = selected;
						app.Places.locationViewModel.lastPicture = selected;
						activity.Title = "My Private Feed";//app.Users.currentUser.get('data').DisplayName;
						if (app.Places.visiting.name)
							activity.Title = app.Places.visiting.name;
						navigator.geolocation.getCurrentPosition(
							function (position) {
								activity.Location = {
									"longitude": position.coords.longitude,
									"latitude": position.coords.latitude
								};
								activities.sync();
								$enterEvent.style.display = 'none';
								validator.hideMessages();
								document.getElementById('addButton').innerText = "Post";
								document.getElementById('newEventText').value = "";
								document.getElementById('picture').src = "styles/images/default-image.jpg";
								app.mobileApp.hideLoading();
							},
							function (error) {
								position = new google.maps.LatLng(0, -20);
								app.notify.showShortTop("Map.Unable to determine current location. Cannot connect to GPS satellite.");
								return position;
							}, {
								timeout: 30000,
								enableHighAccuracy: true
							}
							);
					})
			}
		};
		var addActivity = function () {
			$enterEvent = document.getElementById('enterEvent');
			if ($enterEvent.style.display === 'block') {
				$enterEvent.style.display = 'none';
				validator.hideMessages();
				document.getElementById('addButton').innerText = "Post";
				document.getElementById('newEventText').value = "";
				document.getElementById('picture').src = "styles/images/default-image.jpg";
			} else {
				$enterEvent.style.display = 'block';
				document.getElementById('addButton').innerText = "Cancel";
			}
		};
		var success = function (imageURI) {
			selected = imageURI;
			var picture = document.getElementById("picture");
			picture.src = selected;
		}
		var error = function () {
			app.notify.showShortTop("No selection was detected.");
			$enterEvent.style.display = 'none';
			validator.hideMessages();
			document.getElementById('addButton').innerText = "Post";
			document.getElementById('newEventText').value = "";
		};
		var takePicture = function () {
			navigator.camera.getPicture(success, error, {
											//kjhh best result including iphone rotation
											quality: 100,
											destinationType: navigator.camera.DestinationType.FILE_URI,
											sourceType: navigator.camera.PictureSourceType.CAMERA,
											encodingType: navigator.camera.EncodingType.JPEG,
											correctOrientation: true
										})
		};
		var pickImage = function () {
			if (app.isOnline()) {
				$enterEvent = document.getElementById('enterEvent');
				app.mobileApp.navigate('#view-all-activities');
				if ($enterEvent.style.display === 'block') {
					$enterEvent.style.display = 'none';
					validator.hideMessages();
					document.getElementById('addButton').innerText = "Post";
					document.getElementById('newEventText').value = "";
					document.getElementById('picture').src = "styles/images/default-image.jpg";
				} else {
					$enterEvent.style.display = 'block';
					document.getElementById('addButton').innerText = "Cancel";
					takePicture();
					//$enterEvent.style.display = 'block';
					//document.getElementById('addButton').innerText = "Cancel";
					//navigator.camera.getPicture(success, error, {
					//	//kjhh best result including iphone rotation
					//	quality: 100,
					//	destinationType: navigator.camera.DestinationType.FILE_URI,
					//	sourceType: navigator.camera.PictureSourceType.CAMERA,
					//	encodingType: navigator.camera.EncodingType.JPEG,
					//	correctOrientation: true
					//});
				}
			}
		};
		return {
			init: init,
			activities: activitiesModel.activities,
			activitySelected: activitySelected,
			addActivity: pickImage,
			saveActivity: saveImageActivity,
			show: show,
			//afterShow: afterShow,
			crop: crop
		};
	}());
	return activitiesViewModel;
}());