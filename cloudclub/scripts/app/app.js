function onPushNotificationReceived(e) {
	alert("On2See a Local Notification, " + e.message);
};

var app = (function (win) {
	'use strict';

	// Global error handling
	var showAlert = function (message, title, callback) {
		navigator.notification.alert(message, callback || function () {
		}, title, 'OK');
	};
	var showReviews = function (message, title, callback) {
		navigator.notification.confirm(message, callback || function () {
		}, title, ['Keep', 'Remove']);
	};

	var showError = function (message) {
		showAlert(message, 'Error occured');
	};

	//	 window.onerror = function (message, file, line) {
	//	     alert("Error: " + message + ", File: " + file + ", Line: " + line);
	//	 }

	var cdr;

	win.addEventListener('error', function (e) {
		e.preventDefault();

		var message = e.message + "' from " + e.filename + ":" + e.lineno;

		showAlert(message, 'Error occured');

		return true;
	});

	// Global confirm dialog
	var showConfirm = function (message, title, callback) {
		navigator.notification.confirm(message, callback || function () {
		}, title, ['OK', 'Cancel']);
	};

	var isNullOrEmpty = function (value) {
		return typeof value === 'undefined' || value === null || value === '';
	};

	var isKeySet = function (key) {
		var regEx = /^\$[A-Z_]+\$$/;
		return !isNullOrEmpty(key) && !regEx.test(key);
	};

	// Handle device back button tap
	var onBackKeyDown = function (e) {
		e.preventDefault();

		navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
			var exit = function () {
				navigator.app.exitApp();
			};

			if (confirmed === true || confirmed === 1) {
				// Stop EQATEC analytics monitor on app exit
				if (analytics.isAnalytics()) {
					analytics.Stop();
				}
				AppHelper.logout().then(exit, exit);
			}
		}, 'Exit', ['OK', 'Cancel']);
	};

	var onDeviceReady = function () {
		// Handle "backbutton" event
		document.addEventListener('backbutton', onBackKeyDown, false);
		app.notify.getLocation(function (crd) {
			app.cdr = crd;
			var zoom = 15;
			app.cdr.distance = (21 - zoom) * 2;
			//localStorage.setItem("cdr", cdr.latitude + ":" + cdr.longitude);
		},
			function (error) {
				//app.notify.showShortTop("You can always select your location using the search box with a two part address including a comma, for example <i>London,England</i>.")
				//default map coordinates
				//app.notify.showShortTop("Map.Unable to determine current location. Cannot connect to GPS satellite.");
				if (localStorage.getItem("cdr")) {
					app.cdr = localStorage.getItem("cdr");
				} else {
					app.cdr = new google.maps.LatLng(40.71, -74.01);
				}
			}, {
				timeout: 20000,
				enableHighAccuracy: true
			});
		if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
			$('.ui-header > *').css('margin-top', function (index, curValue) {
				return parseInt(curValue, 10) + 0 + 'px';
			});
		}
		//var openExternalInAppBrowser = document.getElementById("openExternalInAppBrowser");
		//openExternalInAppBrowser.addEventListener("click", app.helper.openExternalInAppBrowser);

		var activityRoute = document.getElementById("activityRoute");
		if (activityRoute)
			activityRoute.addEventListener("click", app.helper.activityRoute);

		//navigator.splashscreen.hide();
		//StatusBar.overlaysWebView(false); //Turns off web view overlay.

		//app.mobileApp.navigate(appSettings.pageOne);

		if (analytics.isAnalytics()) {
			analytics.Start();
		}

		// Initialize AppFeedback
		if (app.isKeySet(appSettings.feedback.apiKey)) {
			try {
				feedback.initialize(appSettings.feedback.apiKey);
			} catch (err) {
				console.log('Something went wrong:');
				console.log(err);
			}
		} else {
			console.log('Telerik AppFeedback API key is not set. You cannot use feedback service.');
		}

		////register for device notifications
		//el.push.register(devicePushSettings, function () {
		//    app.notify.showShortTop("User.Successful registration in on2t platform. You are ready to receive push notifications.");
		//}, function (err) {
		//    alert("Error: " + err.message);
		//})

		//for notifications
		if (cordova.plugins) {
			// set some global defaults for all local notifications
			cordova.plugins.notification.local.setDefaults({
				ongoing: false, // see http://developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html#setOngoing(boolean)
				autoClear: true
			});

			cordova.plugins.notification.local.on("click", function (notification) {
				navigator.notification.alert(JSON.stringify(notification), null, 'Notification background click', 'Close');
			});

			cordova.plugins.notification.local.on("schedule", function (id, state, json) {
				navigator.notification.alert("Scheduled", null, 'Notification scheduled', 'Close');
			});

			// On iOS this event doesn't fire when the app is coldstarted, use "click" above instead in that case
			cordova.plugins.notification.local.on("trigger", function (notification, state) {
				var message = 'Notification with ID is triggered: ' + notification.id + ' state: ' + state;
				navigator.notification.alert(message, function () { // callback invoked when the alert dialog is dismissed
					// if the app started without clicking the notification, it can be cleared like this:
					cordova.plugins.notification.local.clear(notification.id, function () {
						navigator.notification.alert("Notification cleared from notification center");
					}, 'Notification triggered', 'Close');
				});
			});
		}
	};

	// Handle "deviceready" event
	document.addEventListener('deviceready', onDeviceReady, false);

	// Initialize Everlive SDK
	var el = new Everlive({
		//offlineStorage: true,
		appId: appSettings.everlive.appId,
		scheme: appSettings.everlive.scheme
		//authentaction: {
		//    persist:true
		//}
	});

	var emptyGuid = '00000000-0000-0000-0000-000000000000';

	var AppHelper = {
	    english: function () {
	        app.notify.showShortTop("English selected");
	        appSettings.messages = appSettings.english;
	        document.getElementById("introduction").innerText = "Hello " +  appSettings.messages.welcome;
	    },
	    portuguese: function () {
	        app.notify.showShortTop("Português selecionado - este é um recurso de teste Beta, por favor agitar sobre erros e enviar feedback, graças!");
	        appSettings.messages = appSettings.portuguese;
	        document.getElementById("introduction").innerText = "Hello " +  appSettings.messages.welcome;
	    },
	    spanish: function () {
	        app.notify.showShortTop("Seleccionado español - esta es una característica de la versión beta de prueba, por favor agitar con errores para proporcionar comentarios, gracias!");
	        appSettings.messages = appSettings.spanish;
	        document.getElementById("introduction").innerText = "Hello " +  appSettings.messages.welcome;
	},
		/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
 * 
 */
		detectVerticalSquash: function (img) {
			var iw = img.naturalWidth, ih = img.naturalHeight;
			var canvas = document.createElement('canvas');
			canvas.width = 1;
			canvas.height = ih;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			var data = ctx.getImageData(0, 0, 1, ih).data;
			// search image edge pixel position in case it is squashed vertically.
			var sy = 0;
			var ey = ih;
			var py = ih;
			while (py > sy) {
				var alpha = data[(py - 1) * 4 + 3];
				if (alpha === 0) {
					ey = py;
				} else {
					sy = py;
				}
				py = (ey + sy) >> 1;
			}
			var ratio = (py / ih);
			return (ratio === 0) ? 1 : ratio;
		},

		/**
		 * A replacement for context.drawImage
		 * (args are for source and destination).
		 */
		drawImageIOSFix: function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
			var vertSquashRatio = app.helper.detectVerticalSquash(img);
			// Works only if whole image is displayed:
			// ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
			// The following works correct also when only a part of the image is displayed:
			ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
				sw * vertSquashRatio, sh * vertSquashRatio,
				dx, dy, dw, dh);
		},

		// Logout user
		logout: function () {
			app.helper.doLogout()
				.then(function (lo) {
					app.notify.showShortTop(appSettings.messages.logoff);
					app.Users.currentUser.data = null;
					app.helper.navigateHome();
					var logonB = document.getElementById("logonButton");
					var logoffB = document.getElementById("logoffButton");
					logoffB.style.display = "none";
					logonB.style.display = "";
				},
				function (err) {
					//app.notify.showShortTop(appSettings.messages.signin);
					app.Users.currentUser.data = null;
					app.helper.navigateHome();
					var logonB = document.getElementById("logonButton");
					var logoffB = document.getElementById("logoffButton");
					logoffB.style.display = "none";
					logonB.style.display = "";
				});
		},
		activityRoute: function (e) {
			// app.showAlert(JSON.stringify(e))
			if (app.isOnline()) {
				//app.showAlert(app.Places.locationViewModel.myCamera);
				app.mobileApp.navigate('components/activities/view.html');
				//app.mobileApp.navigate('views/activitiesView.html');
			} else {
				app.notify.dialogAlert();
				app.mobileApp.navigate('components/activities/view.html');
			}
		},
		cameraRoute: function (e) {
			if (app.isNullOrEmpty(app.Places.visiting)) {
				app.notify.showShortTop(appSettings.messages.signIn)
				app.mobileApp.navigate("#welcome");
			} else {
				if (app.Places.visiting.name === undefined)
					app.Places.visiting.name = app.Places.visiting.details().name;
				//app.showAlert(JSON.stringify(app.Places.visiting.name))
				if (app.isOnline()) {
					//app.showAlert(app.Places.locationViewModel.myCamera);
					app.mobileApp.navigate('views/activitiesView.html?camera=ON&ActivityText=' + app.Places.visiting.name);
				} else {
					app.notify.dialogAlert();
					app.mobileApp.navigate('components/activities/view.html');
				}
			}
		},
		//Current user logout
		doLogout: function () {
			var lo = el.Users.logout();
			return lo;
		},
		// Navigate to app home
		navigateHome: function () {
			app.mobileApp.navigate('#welcome');
		},

		openExternalInAppBrowser: function (url) {
			var winB = window.open(url, "_blank");
			app.notify.showShortTop(appSettings.messages.url);
		},

		isAnalytics: function () {
			analytics.isAnalytics();
		},

		getLevel: function () {
			//EntryLevel = 1, EntryLevelNoAds = 2, AdvancedFeatures = 3, Partner = 4
			if (app.isOnline()) {
				var Level = 1;
				if (app.Users.currentUser.data.Level) {
					Level = app.Users.currentUser.data.Level;
					return Level;
				}
			} else {
				if (app.helper.checkSimulator()) {
					return 2;
				} else {
					return 1;
				}
			}
		},
		checkSimulator: function () {
			if (window.navigator.simulator === true) {
				return true;
			} else if (window.plugins === undefined || window.plugins.toast === undefined) {
				//alert('Plugin not found when you are running in AppBuilder Companion app which currently does not support this plugin.');
				return true;
			} else {
				return false;
			}
		},

		// Return url for responsive bandwidth
		ResponsiveImageUrl: function (id) {
			el.Files.getById(id)
				.then(function (data) {
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
				};
		},

		// Return absolute user profile picture url
		resolveBackgroundPictureUrl: function (id, option) {
			if (id && id !== emptyGuid) {
				if (option === 'bg') {
					return 'url("' + el.Files.getDownloadUrl(id) + '")';
				} else {
					return el.Files.getDownloadUrl(id);
				}
			} else {
				return 'styles/images/avatar.png';
			}
		},

		// Return user profile picture url
		resolveProfilePictureUrl: function (id) {
			var result = id;
			if (id && (id !== emptyGuid && id !== "styles/images/avatar.png" && id !== "styles/images/default-image.jpg.png")) {
				return el.Files.getDownloadUrl(id);
			} else {
				return id;
			}
		},

		// Return current activity picture url
		resolvePictureUrl: function (id) {
			if (id && (id !== emptyGuid && id !== "styles/images/avatar.png")) {
				return el.Files.getDownloadUrl(id);
			} else {
				return 'styles/images/default-image.jpg';
			}
		},

		// Date formatter. Return date in d.m.yyyy format
		formatDate: function (dateString) {
			return kendo.toString(new Date(dateString), 'MMM dd, yyyy');
		},

		// Like formatter. Return likes count format
		formatLikes: function (likesArray, text) {
			if (likesArray !== undefined) {
				return kendo.toString('Comments: ' + likesArray.length);
			} else {
				return kendo.toString('Be the first to comment!');
			}
		},

		// Geopoint formatter. Return lat/long  format
		formatGeopoint: function (geopoint) {
			if (geopoint !== undefined && geopoint !== null) {
				return kendo.toString('Lat/Long: ' + geopoint.length);
			} else {
				return kendo.toString('Location unknown!');
			}
		},



		autoSizeTextarea: function () {
			var rows = $(this).val().split('\n');
			$(this).prop('rows', rows.length + 1);
		},

		convertToDataURL: function convertToDataURLviaCanvas(url, callback, outputFormat) {
			var img = new Image();
			//cors
			img.crossOrigin = 'Anonymous';
			img.onload = function () {
				var canvas = document.createElement('CANVAS');
				var ctx = canvas.getContext('2d');
				var dataURL;
				canvas.height = this.height;
				canvas.width = this.width;
				ctx.drawImage(this, 0, 0);
				dataURL = canvas.toDataURL(outputFormat, 0.5);
				var ImgData = dataURL.substring("data:image/jepg;base64,".length);
				callback(ImgData);
				canvas = null;
			};
			img.src = url;
		}
	};

	var NotifyHelper = {

		dialogAlert: function () {
			navigator.notification.confirm(
				'Continue without Authentication (no Post options) or Register to access essental community features when you Logon.', // message
				app.notify.onPrompt, // callback to invoke
				'Authentication Required', // title
				['Login', 'Register', 'Continue']             // buttonLabels
				//'User Name address ...'                 // defaultText
			)
		},
		onPrompt: function (results) {
			//alert("You selected button number " + results + " and entered " + results);
			if (results === 3) {
				app.notify.showShortTop(appSettings.messages.continueAnonomously);
			}
			if (results === 2) {
				app.notify.showShortTop(appSettings.messages.register);
				app.mobileApp.navigate('views/signupView.html');
			}
			if (results === 1) {
				app.notify.showShortTop(appSettings.messages.signIn);
				app.mobileApp.navigate('#welcome');
			}
		},

		addNotify: function (PartnerId, ActivityId) {
			//check if exists
			console.log("Start Notify Message.");
			if (app.Users.currentUser.data) {
				//use everlive
				var data = app.everlive.data('Places');

				var attributes = {
					"$push": {
						"AlertList": ActivityId //notiification id
					}
				};

				var filter = {
					'Id': PartnerId // TO DO! replace this with the current place, if the place does not exist that register the place
				};

				data.rawUpdate(attributes, filter, function (data) {
					app.notify.showShortTop(appSettings.messages.registeredOK);
				}, function (err) {
					app.notify.showShortTop(appSettings.messages.tryAgain);
				});
			} else {
				app.notify.showShortTop(appSettings.messages.tryAgain);
				app.mobileApp.navigate('#welcome');
			}
		},

		memorize: function (PartnerId) {
			console.log("Start Like." + PartnerId);

			if (app.Users.currentUser.data) {
				//use everlive
				var data = app.everlive.data('Places');

				//var likedUserId = '790d1f30-b86c-11e5-86a2-6700f56ce9c3'; //user-id';

				var attributes = {
					"$push": {
						"Members": app.Users.currentUser.data.Id //liked - user - id
					}
				};

				var filter = {
					'Id': PartnerId // TO DO! replace this with the current place, if the place does not exist that register the place
				};

				data.rawUpdate(attributes, filter, function (data) {
					app.notify.showShortTop(appSettings.messages.joinMeaage);
				}, function (err) {
					app.notify.showShortTop(appSettings.messages.tryAgain);
				});
			} else {
				app.notify.showShortTop(appSettings.messages.signIn);
				app.mobileApp.navigate('#welcome');
			}
		},

		broadcast: function () {
			var activity = app.Activity.activity();
			//if (activity.Title === "My Private Feed") {
			//	app.notify.showShortTop("To protect your privacy you cannot broadcast from your Private Data Feed!");
			//	return;
			//}
			app.notify.showShortTop(appSettings.messages.broadcast);
			if (true) { //TO DO: check if notification activity exists to prevent second attempt
				var notify = {
					"Message": activity.Text // upgrade required,
					// "UseLocalTime": true,
					// "Android": {
					//   "data": {
					//         "title": "Local Update",
					//         "message": activity.Text,
					//         "smallIcon": "iconcee24"
					//     }
					// }
				}
				app.everlive.push.notifications.create(
					notify,
					function (data) {
						var createdAt = app.formatDate(data.result.CreatedAt);
						app.notify.showShortTop(appSettings.messages.broadcast + createdAt);
						//update notification assets Activity reference and status
						//everlive = el

						//if does not exist add to log
						var thisPlace = {
							"longitude": -80.07,
							"latitude": 26.3
						};
						var data = el.data('Notifications');
						var place = "Sent from "+ activity.Title;
						data.create({
							'Place': place,
							'Reference': activity.Id,
							'Status': true,
							'Location': thisPlace
						},
							function (data) {
								app.notify.showShortTop(appSettings.messages.saved + data.result.Id );
							},
							function (error) {
								app.notify.showShortTop(appSettings.messages.tryAgain + error.message);
							});
					},
					function (error) {
					    app.showError(JSON.stringify(appSettings.messages.continueError + error.message));
					})
			} else {
			    app.notify.showShortTop(appSettings.messages.continueError);
			}
		},

		showLongBottom: function (m) {
			//app.adMobService.viewModel.prepareInterstitial();
			console.log("Start Toast Message - " + m);
			if (analytics.isAnalytics()) {
				m = m + " . . . . . .";
				analytics.TrackFeature('Toast.' + m.substring(0, 10));
			}
			if (!app.helper.checkSimulator()) {
				window.plugins.toast.showLongBottom(m);
			} else {
				showAlert(m, "Toast Simulation");
			}
		},

		showShortTop: function (m) {
			//app.adMobService.viewModel.prepareInterstitial();
			console.log("Start Toast Message - " + m);
			if (analytics.isAnalytics()) {
				m = m + " . . . . . .";
				analytics.TrackFeature('Toast.' + m.substring(0, 10));
			}
			if (!app.helper.checkSimulator()) {
				window.plugins.toast.showShortTop(m);
			} else {
				showAlert(m, "Toast Simulation");
			}
		},

		showMessageWithoutSound: function () {
			this.notify({
				id: 1,
				title: 'I\'m the title!',
				text: 'Sssssh!',
				sound: null,
				at: this.getNowPlus10Seconds()
			});
		},

		showMessageWithDefaultSound: function () {
			this.notify({
				id: '2', // you don't have to use an int by the way.. '1a' or just 'a' would be fine
				title: 'Sorry for the noise',
				text: 'Unless you have sound turned off',
				at: this.getNowPlus10Seconds()
			});
		},

		showMessageWithData: function () {
			this.notify({
				id: 3,
				text: 'I have data, click me to see it',
				json: JSON.stringify({
					test: 123
				}),
				at: this.getNowPlus10Seconds()
			});
		},

		showMessageWithBadge: function () {
			this.notify({
				id: 4,
				title: 'Your app now has a badge',
				text: 'Clear it by clicking the \'Cancel all\' button',
				badge: 1,
				at: this.getNowPlus10Seconds()
			});
		},

		showMessageWithSoundEveryMinute: function () {
			this.notify({
				id: 5,
				title: 'I will bother you every minute',
				text: '.. until you cancel all notifications',
				every: 'minute',
				autoClear: false,
				at: this.getNowPlus10Seconds()
			});
		},

		cancelAll: function () {
			if (!app.helper.checkSimulator()) {
				cordova.plugins.notification.local.cancelAll(function () {
					alert('ok, all cancelled')
				});
			}
		},

		getScheduledNotificationIDs: function () {
			if (!app.helper.checkSimulator()) {
				cordova.plugins.notification.local.getScheduledIds(function (scheduledIds) {
					navigator.notification.alert(scheduledIds.join(', '), null, 'Scheduled Notification ID\'s', 'Close');
				})
			}
		},

		notify: function (payload) {
			if (!app.helper.checkSimulator()) {
				cordova.plugins.notification.local.schedule(payload, function () {
					console.log('scheduled')
				});
			}
		},

		getLocation: function (callBack) {
			var options = {
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 200000
			};

			function success(pos) {
				var crd = pos.coords;
				var continueButton = document.getElementById("continueButton");
				continueButton.style.display = "";
				var setupBtn = document.getElementById("setupBtn");
				setupBtn.style.display = "";
				callBack(crd);
			};

			function error(err) {
				app.showError('ERROR( Please enable Location and restart the application ' + err.code + '): ' + err.message);
			};

			navigator.geolocation.getCurrentPosition(success, error, options);
		},

		getNowPlus10Seconds: function () {
			return new Date(new Date().getTime() + 10 * 1000);
		},

		checkSimulator: function () {
			if (window.navigator.simulator === true) {
				alert('This plugin is not available in the simulator.');
				return true;
			} else if (cordova.plugins === undefined || cordova.plugins.notification === undefined) {
				alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
				return true;
			} else {
				return false;
			}
		}

	}

	var fileHelper = {

		uploadPhoto: function (imageURI, server) {
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";

			var params = {};
			params.value1 = "test";
			params.value2 = "param";

			options.params = params;

			var ft = new FileTransfer();
			ft.upload(imageURI, encodeURI(server), win, fail, options);
		},

		win: function (r) {
			console.log("Code = " + r.responseCode);
			console.log("Response = " + r.response);
			console.log("Sent = " + r.bytesSent);
		},
		fail: function (error) {
			alert("An error has occurred: Code = " + error.code);
			console.log("upload error source " + error.source);
			console.log("upload error target " + error.target);
		}
	}

	var os = kendo.support.mobileOS,
		statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

	// Initialize KendoUI mobile application
	var mobileApp = new kendo.mobile.Application(document.body, {
		transition: 'slide',
		statusBarStyle: statusBarStyle,
		skin: 'flat'
	});

	var cropImage = function (image) {
		app.notify.showShortTop(appSettings.messages.wait);

		var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
		var starter = document.getElementById(image);
		var canvas = document.getElementById("canvas");
		if (starter.naturalWidth > starter.naturalHeight || starter.naturalWidth === starter.naturalHeight) {
			sx = (starter.naturalWidth - starter.naturalHeight) / 2;
			sx = Math.floor(sx);
			starterWidth = starter.naturalHeight;
			starterHeight = starter.naturalHeight;
			sy = 0;
		} else {
			sy = (-starter.naturalWidth + starter.naturalHeight) / 2;
			sy = Math.floor(sy);
			starterWidth = starter.naturalWidth;
			starterHeight = starter.naturalWidth;
			sx = 0;
		}
		dx = 0;
		dy = 0;
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		var ctx = canvas.getContext("2d");
		app.helper.drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
		$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
		/*			if (!navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)) {
						textMessage ="Crop action";
						ctx.drawImage(starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
					} else {
						textMessage = "iOS 7 crop";
						app.helper.drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
					}
					$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
					if($baseImafe.indexOf(appSettings.empty1x1png >0)){
						textMessage = "Special Crop action";
						app.helper.drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
						$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
					}
					var sb = document.getElementById("saveButton");
					if(sb.style.display === "none"){ textMessage = "You can update any items including or excluding the Avatar";
					sb.style.display = ""}
					app.notify.show(textMessage);*/
	}

	var createImage = function (baseImage) {
		app.notify.showShortTop(appSettings.messages.updating);

		app.everlive.Files.create({
			Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
			ContentType: "image/jpeg",
			base64: baseImage
		})
			.then(function (promise) {
				return promise;
			})
	}

	var takePicture = function () {
		takePicture2(console.log("Callback"));
	}
	var takePicture2 = function (callback) {
		//app.notify.showShortTop("Camera.Using camera ...");

		navigator.camera.getPicture(function (imageURI) {
			callback(imageURI);
		}, function () {
			app.notify.showShortTop(appSettings.messages.tryAgain);
		}, {
				//kjhh best result including iphone rotation
				quality: 100,
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.CAMERA,
				encodingType: navigator.camera.EncodingType.JPEG,
				correctOrientation: true
			});
	}

	var simplify = function (object) {
		var simpleObject = {};
		for (var prop in object) {
			if (!object.hasOwnProperty(prop)) {
				continue;
			}
			if (typeof (object[prop]) === 'object') {
				continue;
			}
			if (typeof (object[prop]) === 'function') {
				continue;
			}
			simpleObject[prop] = object[prop];
		}
		return JSON.stringify(simpleObject); // returns cleaned up JSON
	}

	return {
		data: {},
		showAlert: showAlert,
		showReviews: showReviews,
		cdr: cdr,
		showError: showError,
		showConfirm: showConfirm,
		isKeySet: isKeySet,
		mobileApp: mobileApp,
		helper: AppHelper,
		notify: NotifyHelper,
		everlive: el,
		cropImage: cropImage,
		fileHelp: fileHelper,
		takePicture: takePicture,
		saveImage: createImage,
		simplify: simplify,
		isOnline: function () {
			return app.Users.isOnline();
		},
		welcome: function () {
			var action = document.getElementById("setupBtn");
			if (app.isOnline()) {
			    document.getElementById("introduction").innerText = "Hello " + app.Users.currentUser.data.displayName + appSettings.messages.welcome;
				action.addEventListener("click", function () {
					app.mobileApp.navigate("views/updateView.html")
				});
				//button text Setting
				action.innerText = "Settings";
			}
			if (localStorage.getItem("access_token")) {
				document.getElementById("introduction").innerText = "Hello " + localStorage.getItem("username") + appSettings.messages.welcome;
				action.addEventListener("click", function () {
					app.mobileApp.navigate("#welcome")
				});
				//button text Logon
				document.getElementById("introduction").innerText = "Hello " + localStorage.getItem("username") + appSettings.messages.welcome;
				action.innerText = "Logon";
			} else {
				action.addEventListener("click", function () {
					app.mobileApp.navigate("views/signupView.html")
				});
				//button text register
				action.innerText = "Register";
			}
		}
	};
} (window));