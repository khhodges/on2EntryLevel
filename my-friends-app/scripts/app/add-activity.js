/**
 * Add Activity view model
 */

var app = app || {};

app.addActivity = (function () {
	'use strict'

	var $commentsContainer,
		listScroller;

	var addActivityViewModel = (function () {
		var activityUid,
			activity,
			selected,
			$newStatus,
			baseImage,
			validator;

		var init = function () {
			$commentsContainer = $('#comments-listview');
			validator = $('#enterStatus').kendoValidator().data('kendoValidator');
			$newStatus = $('#newStatus');
			$newStatus.on('keydown', app.helper.autoSizeTextarea);
		};

		var show = function (e) {
			// Clear field on view show
			$newStatus.val('');
			validator.hideMessages();
			$newStatus.prop('rows', 1);
			$commentsContainer.empty();

			listScroller = e.view.scroller;
			listScroller.reset();

			activityUid = e.view.params.uid;
			var userName = app.Users.currentUser;
			document.getElementById('addPersonName').innerHTML = userName.data.DisplayName;
			var today = app.helper.formatDate(new Date);
			document.getElementById('addActivityDate').innerHTML = today;
			//$('#activityText').text = "Replace example text below with your own comment on your visit and add a picture to highlight your message...";
			//$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';            
			kendo.bind(e.view.element, activity, kendo.mobile.ui);
		};

		var pickImage = function () {
			function success(imageURI) {
				selected = imageURI;
				var picture = document.getElementById("addPicture");
				picture.src = selected;				
				app.helper.convertToDataURL(selected, function (base64Img) {
					baseImage = base64Img;
				}, "image/jpeg")
				app.mobileApp.hideLoading();
			}

			var error = function () {
				app.mobileApp.hideLoading();
				navigator.notification.alert("No selection was detected.");
			};
			var config = {
				quality: 30, 
				destinationType: destinationType.FILE_URI,
				sourceType: source,
				correctOrientation: true
			};
			//navigator.notification.alert("PickImage detected.");
			navigator.camera.getPicture(success, error, config);
		};

		var removeActivity = function () {
			var activities = app.Activities.activities;
			var activity = activities.getByUid(activityUid);

			app.showConfirm(
				appSettings.messages.removeActivityConfirm,
				'Delete Activity',
				function (confirmed) {
					if (confirmed === true || confirmed === 1) {
						activities.remove(activity);
						activities.one('sync', function () {
							app.mobileApp.navigate('#:back');
						});
						activities.sync();
					}
				}
				);
		};

		var saveActivity = function () {
			// Validating of the required fields
			//https://www.google.com/maps/dir//
			var lat = 26.3179912;
			var lon = -80.1340489;
			///@26.317991,-80.134049,16z?hl=en-US
			if (selected === undefined || !baseImage) {
				app.showAlert("First take a photo with your camera and then add a message to match!", "Informational");
			}
			if (validator.validate() && (selected !== undefined)) {
				app.mobileApp.showLoading();
				// Save image as base64 to everlive
				//app.helper.convertToDataURL(selected, function (base64Img) {
				// Base64DataURL
				// save image id to Activity
				app.everlive.Files.create({
											  Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
											  ContentType: "image/jpeg",
											  base64: baseImage
										  })
					.then(function (promise) {
						selected = promise.result.Id;

						// Adding new activity to Activities model
						var activities = app.Activities.activities;
						var activity = activities.add();
						activity.Text = $newStatus.val();
						activity.UserId = app.Users.currentUser.get('data').Id;
						activity.Picture = selected;

						activities.one('sync', function () {
							app.mobileApp.navigate('#:back');
						});
						activities.sync();
						app.mobileApp.hideLoading();
					})
				// },"image/jpeg");
			}
		};

		return {
			init: init,
			show: show,
			remove: removeActivity,
			me: app.Users.currentUser,
			saveNewComment: saveActivity,
			takeAnImage: pickImage,
			activity: function () {
				return activity;
			}
		};
	}());

	return addActivityViewModel;
}());