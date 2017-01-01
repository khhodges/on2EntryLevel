(function (global) {
	'use strict';

	var app = global.app = global.app || {};

	app.PushRegistrar = (function () {
		var notifyStatus = new kendo.observable();
		var devicePlatform;

		var _onDeviceIsSuccessfullyRegistered = function () {
			app.showAlert("Your device is successfully registered in Backend Services.");
			app.showAlert("You can receive push notifications.");
			updateRegistration(app.PushRegistrar.notifyStatus.pushToken);
		};

		var _onDeviceIsSuccessfullyUnregistered = function () {
			app.showAlert("Your device is successfully UN-registered from Backend Services.");
			app.showAlert("You CANNOT send or receive push notifications.");
			checkNotify();
		};

		var _onPushErrorOccurred = function (message) {
			app.showAlert("Error: " + message, true);
		};

		var _processPushMessage = function (message, date) {
			date = date || new Date().toISOString();
			var dateStr = app.formatDate(date);
			app.showAlert(dateStr + ' : ' + message);
		};

		var onAndroidPushReceived = function (e) {
			var message = e.message;
			var dateCreated = e.payload.customData && e.payload.customData.dateCreated;
			_processPushMessage(message, dateCreated);
		};

		var onWpPushReceived = function (e) {
			if (e.type === "toast" && e.jsonContent) {
				var message = e.jsonContent["wp:Text2"] || e.jsonContent["wp:Text1"];
				// WP does not allow custom payload, hence we do not have the dateCreated
				_processPushMessage(message, null);
			}
		};

		var onIosPushReceived = function (e) {
			_processPushMessage(e.alert, e.dateCreated);
		};

		var pushSettings = {
			android: {
				projectNumber: app.androidProjectNumber
			},
			iOS: {
				badge: "true",
				sound: "true",
				alert: "true"
			},
			wp8: {
				channelName: "EverlivePushChannel"
			},
			notificationCallbackWP8: onWpPushReceived,
			notificationCallbackAndroid: onAndroidPushReceived,
			notificationCallbackIOS: onIosPushReceived
		};

		var enablePushNotifications = function () {
			devicePlatform = device.platform; // get the device platform from the Cordova Device API
			app.showAlert("Initializing push notifications for " + devicePlatform + '...');

			pushSettings.customParameters = {
				"LastLoginDate": new Date()
			};

			app.everlive.push.register(pushSettings)
				.then(

				function (initResult) {
					try{
					app.showAlert("Success "+ JSON.stringify(initResult));
					_onDeviceIsSuccessfullyRegistered();
					//notifyStatus.PushToken=initResult.token;
					}catch(e){
						app.showAlert("Error "+ JSON.stringify(e))
					}
				},
				function (err) {
					app.showAlert("Error "+ JSON.stringify(err))
					_onPushErrorOccurred(err.message);
				});
		};
		//kjhh

		var unregisterNotifications = function(){
			app.everlive.push.unregister()
				.then(
				function (result) {
					app.showAlert("Success "+ JSON.stringify(result));
					_onDeviceIsSuccessfullyUnregistered();
				},
				function (err) {
					app.showAlert("Error "+ JSON.stringify(err))
					_onPushErrorOccurred(err.message);
				});
		};

		var checkNotify = function () {
			app.showAlert("Initializing check of registration for notifications on " + devicePlatform + '...');
			app.everlive.push.getRegistration(
				function (obj) {
					notifyStatus = obj.result;
					//app.registerNotify = kendo.observable(obj.result);
					if (obj.result.Parameters && obj.result.Parameters.LastLoginDate) {
						app.showAlert("Result - Notifications are ON " + JSON.stringify(obj))
						if(!notifyStatus.PushToken) notifyStatus.PushToken ="False_Push_Token"
					} else {
						app.showAlert("Notifications are wrong, update underway" + JSON.stringify(obj));
					}
					app.showAlert("Check end - Status check: " + JSON.stringify(notifyStatus))
					updateRegistration;
					app.showAlert("Update end - Status is: " + JSON.stringify(notifyStatus))
				},
				function (obj) {
					notifyStatus = null;
					app.showAlert("Error result " + obj.message);
				}
			)
		};
		var registrationError = function (str) {
			//app.registerNotify = obj.result;
			app.showAlert(str + " Registration Error, Notifications are OFF " + obj.message);
			//app.registerNotify.statusReport = obj.result.HardwareModel + ", Last Login : " + obj.result.Parameters.LastLoginDate;
		};
		var updateRegistration = function () {
			app.showAlert("Initializing update registration of notifications for " + devicePlatform + '...');
			if(!app.PushRegistrar.notifyStatus){
				app.PushRegistrar.notifyStatus=notifyStatus;
				app.showAlert("Initializing Fake Push Token for " + devicePlatform + '...');
			}
			app.everlive.push.updateRegistration(
				{ Parameters: { "PushToken":app.PushRegistrar.notifyStatus, "LastLoginDate": new Date().toDateString(), "Location": app.cdr } },
				function (obj) {
					//app.registerNotify = kendo.observable(obj.result);
					app.showAlert("Updated Notifications now ON " + JSON.stringify(obj))
					//notifyStatus = obj.result.HardwareModel; //+ ", Last Login : " + obj.result.Parameters.LastLoginDate;
				},
				function (obj) {
					app.showAlert(JSON.stringify(obj));
				}
			)
		};
		return {
			enablePushNotifications: enablePushNotifications,
			notifyStatus: notifyStatus,
			updatePushNotifications: checkNotify,
			unregisterNotifications: unregisterNotifications
		}
	})();
})(window);