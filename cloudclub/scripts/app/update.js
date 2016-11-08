/**
 * update user avatar and view model
 */
var app = app || {};

app.Update = (function () {
	'use strict';

	var updateViewModel = (function () {
		var dataSource;
		var $updateForm;
		var $formFields;
		var $updateInfo;
		var validator;
		var updateImage;
		var picture;
		var $saveButton;
		var $baseImage;

		// Update user after required fields (NOT username, email and password) in Backend Services
		var update = function () {
			dataSource.Gender = parseInt(dataSource.Gender);
			var birthDate = new Date(dataSource.BirthDate);

			if (birthDate.toJSON() === null) {
				birthDate = new Date();
			}

			dataSource.BirthDate = birthDate;
			//Update Avatar Image??
			updateAvatar();
			Everlive.$.Users.update(dataSource)
				.then(function () {
					analytics.TrackFeature('Update.User');
					app.notify.showShortTop("Update successful");
				},
				function (err) {
					app.showError(err.message);
				});
		};

		var updateAvatar = function () {
			var everlive = new Everlive(appSettings.everlive.appId);

			everlive.Files.updateContent(app.Users.currentUser.data.Picture, {
				Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
				ContentType: "image/jpeg",
				base64: $baseImage
			},

				function (data) {
					var sb = document.getElementById("saveButton");
					sb.style.display = "none";
					app.notify.showShortTop("Update saved, it can take several hours to cache the new image across the Internet!");
				},

				function (error) {
					app.showAlert("No Image changes were needed!");
				}
			)

		}

		// Executed after update view initialization
		// init form validator
		var init = function () {
			var sb = document.getElementById("saveButton");
			sb.style.display = "none";
			// Get a reference to our sensitive element
			try {
				if (!app.Users.isOnline()) {
					app.notify.showShortTop('User.Redirection. You must register and login to access these features.');
					app.mobileApp.navigate('#welcome');
					return;
				}
			} catch (e) {
				app.notify.showShortTop('User.Direction. Please login to access these features.' + e.message);
				app.mobileApp.navigate('#welcome');
				return;
			}

			updateImage = document.getElementById("updateImage");
			picture = document.getElementById("updateImage");
			$updateForm = $('#update');
			$formFields = $updateForm.find('input, textarea, select');
			//$updateInfo = $('#updateInfo');
			var $saveButton = $('#saveButton');
			validator = $updateForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

			$formFields.on('keyup keypress blur change input', function () {
				if (validator.validate()) {
					var sb = document.getElementById("saveButton");
					sb.style.display = "";
				} else {
					sb.style.display = "none";
				}
			});

			//$updateInfo.on('keydown', app.helper.autoSizeTextarea);
		}

		// Executed after show of the update view
		var show = function () {

			var sb = document.getElementById("saveButton");
			sb.style.display = "none";
			try {
				if (!app.Users.isOnline()) {
					app.notify.showShortTop('User.Redirection. You must register and login to access these features.');
					app.mobileApp.navigate('#welcome');
					return;
				}
			} catch (e) {
				app.notify.showShortTop('User.Direction. Please login to access these features.' + e.message);
				app.mobileApp.navigate('#welcome');
				return;
			}
			analytics.TrackFeature('Update.Show');
			//$updateInfo.prop('rows', 1);

			dataSource = kendo.observable({
				Username: app.Users.currentUser.data.Username,
				Password: '',
				DisplayName: app.Users.currentUser.data.DisplayName,
				Email: app.Users.currentUser.data.Email,
				Gender: app.Users.currentUser.data.Gender,
				Level: app.Users.currentUser.data.Level,
				Friends: app.Users.currentUser.data.Friends,
				BirthDate: app.Users.currentUser.data.BirthDate,
				PictureUrl: 'url("' + app.Users.currentUser.data.PictureUrl + '");',
				aPictureUrl: app.Users.currentUser.data.PictureUrl
										  });
			kendo.bind($('#update-form'), dataSource, kendo.mobile.ui);
		};

		// Executed after hide of the update view
		// disable update button
		var hide = function () {
			var sb = document.getElementById("saveButton");
			sb.style.display = "";
		};

		var onSelectChange = function (sel) {
			var selected = sel.options[sel.selectedIndex].value;
			sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
		}

		var crop = function () {
			var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
			var starter = document.getElementById("updateImage");
			var canvas = document.getElementById("updateCanvas");
			if (starter.naturalWidth > starter.naturalHeight) {
				sx = (starter.naturalWidth - starter.naturalHeight) / 2;
				starterWidth = starter.naturalHeight;
				starterHeight = starter.naturalHeight;
				sy = 0;
			} else {
				sy = (- starter.naturalWidth + starter.naturalHeight) / 2;
				starterWidth = starter.naturalWidth;
				starterHeight = starter.naturalWidth;
				sx = 0;
			}
			dx = 0;
			dy = 0;
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			var ctx = canvas.getContext("2d");
			if (!navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)) {
				app.showShortTop("Crop action");
				ctx.drawImage(starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
			} else {
				app.showShortTop("iOS 7 crop");
				drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
			}
			$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
			if($baseImafe.indexOf(appSettings.empty1x1png >0)){
				app.showShortTop("Special Crop action");
				drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
				$baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
			}
		}
		var pickImage = function () {
			function success(imageURI) {
				analytics.TrackFeature('Avatar.Success');
				//TO DO: crop Image to a Square
				var selected = imageURI;
				updateImage.src = selected;
				picture.src = selected;
				var sb = document.getElementById("saveButton");
				sb.style.display = "";
			}
			var error = function () {
				analytics.TrackFeature('Avatar.Error');
				app.showError("No selection was detected.");
			}
			var config = {
				//kjhh best result including iphone rotation
				quality: 100,
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.CAMERA,
				encodingType: navigator.camera.EncodingType.JPEG,
				correctOrientation: true
			}
			navigator.camera.getPicture(success, error, config);
		}

		return {
			init: init,
			show: show,
			onSelectChange: onSelectChange,
			update: update,
			showImage: pickImage,
			crop: crop,
            userData: dataSource
		};
	} ()
	);

	return updateViewModel;
} ());