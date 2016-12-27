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
		var viewModel;

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
				languageState: app.Users.currentUser.data.jsonList.partner.language,
				languageText: appSettings.messages.language,
				autoBlogText: appSettings.messages.autoBlog,
				onBlogChange: function (e) {
					sb = document.getElementById("saveButton");
					sb.style.display = "";
					app.Users.currentUser.data.jsonList.partner.autoBlog = e.checked;
				},
				onRememberChange: function (e) {
					sb = document.getElementById("saveButton");
					sb.style.display = "";
					app.Users.currentUser.data.jsonList.partner.rememberMe = e.checked;
				}
			})
			kendo.bind($('#update-form'), dataSource, kendo.mobile.ui);
			//favorites = app.Users.currentUser.data.jsonDirectory;
			//app.showAlert(JSON.stringify("favorites"));
			viewModel = kendo.observable({
				onVmChange: function (e) {
					sb = document.getElementById("saveMedia");
					sb.style.display = "";
					//app.showAlert(JSON.stringify(app.Users.currentUser.data.jsonDirectory))
					//var name = e.data.name,
					//	dataItem = e.data;
					//	for(var i=0;i<app.Users.currentUser.data.jsonDirectory.length;i++){
					//		var item = app.Users.currentUser.data.jsonDirectory[i];
					//		if(item.name=name){
								//item.selected=!dataItem.selected;
					//			break;
					//		}
					//	}
					//app.notify.showShortTop("id: " + name + ", selected: " + dataItem.selected);
				},
				ds: new kendo.data.DataSource({
					data: app.Users.currentUser.data.jsonDirectory,
					group:{field:"group"}
				})
			});
			//app.showAlert(JSON.stringify("viewModel"));
			app.Update.viewModel = viewModel;
			if(!app.Update.viewModel || !app.Update.viewModel.ds) app.showError("No viewModel");
		};
		var initMore = function () {
		};
		var showMore = function(){
			try {
				$("#media-listView").kendoMobileListView({
					dataSource: ds,
					template: kendo.template($('#favoriteTemplate').html()),
					style: "inset"
				})
					.data("kendoMobileListView");
			} catch (ex) {
				app.showAlert(JSON.stringify(ex));
			}
		};
		var onSelectChange = function (sel) {
			sb = document.getElementById("saveButton");
			sb.style.display = "";
			app.Users.currentUser.data.jsonList.partner.language = sel.value;
		};
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
			initMore:initMore,
			showMore: showMore,
			//onSelectChange: function(){app.showAlert("onSelectChange")},
			update: update,
			showImage: pickImage,
			crop: crop,
			userData: function () {
				return dataSource;
			},
			viewModel: viewModel
		};
	} ()
	);

	return updateViewModel;
} ());