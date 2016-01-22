var app = (function (win) {
	'use strict';

	// Global error handling
	var showAlert = function(message, title, callback) {
		navigator.notification.alert(message, callback || function () {
		}, title, 'OK');
	};

	var showError = function(message) {
		showAlert(message, 'Error occured');
	};
	
	/*	window.onerror = function (message, file, line) {
	alert("Error: " + message + ", File: " + file + ", Line: " + line);
	}*/

	win.addEventListener('error', function (e) {
		e.preventDefault();

		var message = e.message + "' from " + e.filename + ":" + e.lineno;

		showAlert(message, 'Error occured');

		return true;
	});

	// Global confirm dialog
	var showConfirm = function(message, title, callback) {
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
	var onBackKeyDown = function(e) {
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

	var onDeviceReady = function() {
		// Handle "backbutton" event
		document.addEventListener('backbutton', onBackKeyDown, false);

		/*		document.addEventListener('deviceready', function () {
		feedback.initialize('wewpzbnzheaxgay7');
		});*/

		navigator.splashscreen.hide();

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
	};

	// Handle "deviceready" event
	document.addEventListener('deviceready', onDeviceReady, false);
 
	// Initialize Everlive SDK
	var el = new Everlive({
							  appId: appSettings.everlive.appId,
							  scheme: appSettings.everlive.scheme
						  });

	var emptyGuid = '00000000-0000-0000-0000-000000000000';

	var AppHelper = {
		checkSimulator: function() {
			if (window.navigator.simulator === true) {
				//alert('This plugin is not available in the simulator.');
				return true;
			} else if (window.plugins === undefined || window.plugins.toast === undefined) {
				//alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
				return true;
			} else {
				return false;
			}
		},
		
		ResponsiveImageUrl: function(id) {
			el.Files.getById(id)
				.then(function(data) {
					// get url from data
					var url = data.result.Uri;
					var size = "/resize=w:200,h:200,fill:cover/";
					var base = "https://bs1.cdn.telerik.com/image/v1/";
					//navigator.notification.alert(url);
					// convert to responsive url
					url = base + appSettings.everlive.appId + size + url;
					return url;
				}),
			function(error) {
				navigator.notification.alert(JSON.stringify(error));
			};
		},
		
		// Return absolute user profile picture url
		resolveBackgroundPictureUrl: function (id) {
			if (id && id !== emptyGuid) {
				return 'url(' + el.Files.getDownloadUrl(id) + ')';
			} else {
				return 'styles/images/avatar.png';
			}
		},

		// Return user profile picture url
		resolveProfilePictureUrl: function (id) {
			if (id && id !== emptyGuid) {
				return el.Files.getDownloadUrl(id);
			} else {
				return 'styles/images/avatar.png';
			}
		},

		// Return current activity picture url
		resolvePictureUrl: function (id) {
			if (id && id !== emptyGuid) {
				return el.Files.getDownloadUrl(id);
			} else {
				return '';
			}
		},

		// Date formatter. Return date in d.m.yyyy format
		formatDate: function (dateString) {
			return kendo.toString(new Date(dateString), 'MMM dd, yyyy');
		},
		
		// Date formatter. Return likes count format
		formatLikes: function (likesArray, text) {
			if (likesArray !== undefined) {
				return kendo.toString('Total Viewers: ' + likesArray.length);
			} else {
				return kendo.toString('Total Viewers: 0');
			}
		},

		// Current user logout
		logout: function () {
			return el.Users.logout();
		},
        
		autoSizeTextarea: function () {
			var rows = $(this).val().split('\n');
			$(this).prop('rows', rows.length + 1);
		},
		
		convertToDataURL: function convertToDataURLviaCanvas(url, callback, outputFormat) {
			var img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function() {
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
		fail:function (error) {
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

	return {
		showAlert: showAlert,
		showError: showError,
		showConfirm: showConfirm,
		isKeySet: isKeySet,
		mobileApp: mobileApp,
		helper: AppHelper,
		everlive: el
	};
}(window));