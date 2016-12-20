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
		var $baseImage;
		var favorites;
		var fui;
		var changed = false;
		var sb;

		// Update user after required fields (NOT username, email and password) in Backend Services
		var update = function () {

			dataSource.Gender = parseInt(dataSource.Gender);
			var birthDate = new Date(dataSource.BirthDate);

			if (birthDate.toJSON() === null) {
				birthDate = new Date();
			}

			dataSource.BirthDate = birthDate;
			app.Users.currentUser.data.jsonList.url = app.Users.currentUser.data.jsonDirectory;
			dataSource.JSON = JSON.stringify(app.Users.currentUser.data.jsonList);
			//hide save to prevent reuse
			sb = document.getElementById("saveButton");
			sb.style.display = "none";
			//Update Avatar Image??
			if (changed) {
				updateAvatar();
			}
			Everlive.$.Users.update(dataSource)
				.then(function () {
					analytics.TrackFeature('Update.User');
					app.notify.showShortTop(appSettings.messages.update);
				},
				function (err) {
					app.showError(err.message);
				});
		};

		var updateAvatar = function () {
			try {
				var everlive = new Everlive(appSettings.everlive.appId);
				//Update existing image id with new content
				everlive.Files.updateContent(app.Users.currentUser.data.Picture, {
					Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
					ContentType: "image/jpeg",
					base64: $baseImage
				},

					function (data) {
						var sb = document.getElementById("saveButton");
						sb.style.display = "none";
						app.notify.showShortTop(appSettings.messages.savedAvatar);
					},

					function (error) {
						app.showAlert(appSettings.messages.tryAgain + ', ' + JSON.stringify(error));
					}
				)
			} catch (e) {

			}

		}

		// Executed after update view initialization
		// init form validator
		var init = function () {
			// Get a reference to our sensitive element
			try {
				if (!app.isOnline()) {
					app.notify.showShortTop(appSettings.messages.signIn);
					app.mobileApp.navigate('#welcome');
					return;
				}
			} catch (e) {
				app.notify.showShortTop(appSettings.messages.signIn);
				app.mobileApp.navigate('#welcome');
				return;
			}

			updateImage = document.getElementById("updateImage");
			picture = document.getElementById("updateImage");
			$updateForm = $('#update');
			$formFields = $updateForm.find('input, textarea, select');
			validator = $updateForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

			$formFields.on('keyup keypress blur change input', function () {
				sb = document.getElementById("saveButton");
				if (validator.validate()) {
					sb.style.display = "";
				} else {
					sb.style.display = "none";
				}
			});

			//$updateInfo.on('keydown', app.helper.autoSizeTextarea);
		}

		// Executed after show of the update view
		var show = function () {
			try {
				if (!app.isOnline()) {
					app.notify.showShortTop(appSettings.messages.signIn);
					app.mobileApp.navigate('#welcome');
					return;
				}
			} catch (e) {
				app.notify.showShortTop(appSettings.messages.signIn);
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
				aPictureUrl: app.Users.currentUser.data.PictureUrl,
				autoBlogState: app.Users.currentUser.data.jsonList.partner.autoBlog,
				rememberMeState: app.Users.currentUser.data.jsonList.partner.rememberMe,
				rememberMeText: appSettings.messages.rememberMe,
				autoBlogText: appSettings.messages.autoBlog,
				click:onSelectChange
										  });
			kendo.bind($('#update-form'), dataSource, kendo.mobile.ui);
		};
		var showMore = function () {
			try {
				favorites = app.Users.currentUser.data.jsonDirectory;
				$("#media-listView").kendoMobileListView({
					dataSource: {
						data: favorites,
						group: { field: "group" }
					},
					change: function (e) {
						console.log(e.dataItem.title);
					},
					template: kendo.template($('#favoriteTemplate').html()),
					style: "inset",
					click: function () {
						var index = this.select().index(),
							dataItem = this.dataSource.view()[index];
						app.showAlert("id: " + dataItem.id + ", text: " + dataItem.text);
					}
				})
					.data("kendoListView");
			} catch (ex) {
				app.showAlert(JSON.stringify(ex));
			}
		};
		var onSelectChange = function (sel) {
			if (sel.button) {
				sb = document.getElementById("saveButton");
				sb.style.display = "";
				var name = sel.button[0].attributes[0].value, state;
				if (name === "autoBlog") {
					state = app.Users.currentUser.data.jsonList.partner.autoBlog;
				} else {
					state = app.Users.currentUser.data.jsonList.partner.rememberMe;
				}
				//app.showAlert(name + ", " + state)
				var element = document.getElementById(name);
				if (state === "ON") {
					app.Users.setItem(name, "selected", "OFF");
					element.innerText = "OFF";
					element.className = "btn-login km-widget km-button km-state-active";
				}
				else {
					app.Users.setItem(name, "selected", "ON");
					element.innerText = "ON";
					element.className = "btn-register km-widget km-button km-state-active";
				}
			}
			if (!sel.dataItem) {
				return;
			};
			sb = document.getElementById("saveButton");
			sb.style.display = "";
			//app.notify.showShortTop(appSettings.messages.settingsMessage);
			var selected = sel.dataItem.selected;//options[sel.selectedIndex].value;
			var newState = selected === "OFF" ? "ON" : "OFF";
			sel.dataItem.set("selected", newState);
			app.Users.setItem(sel.dataItem.name, "selected", newState);
			//document.getElementById(sel.dataItem.name).checked = sel.dataItem.selected;
			//sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
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
			//var textMessage;
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
						sb = document.getElementById("saveButton");
						if(sb.style.display === "none"){ textMessage = "You can update any items including or excluding the Avatar";
						sb.style.display = ""}
						app.notify.show(textMessage);*/
		}
		var checkbox = function () {
			app.showAlert(JSON.stringify("OK"));
		}
		var pickImage = function () {
			function success(imageURI) {
				changed = true;
				analytics.TrackFeature('Avatar.Success');
				//TO DO: crop Image to a Square
				var selected = imageURI;
				updateImage.src = selected;
				picture.src = selected;
				sb = document.getElementById("saveButton");
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
			showMore: showMore,
			onSelectChange: onSelectChange,
			update: update,
			showImage: pickImage,
			crop: crop,
			userData: function () {
				return dataSource;
			}
		};
	} ()
	);

	return updateViewModel;
} ());