/**
 * update view model
 */
var app = app || {};

app.update = (function () {
	'use strict';

	var updateViewModel = (function () {
		var dataSource;
		var $updateForm;
		var $formFields;
		var $updateInfo;
		var $updateBtnWrp;
		var validator;
		var avatarImage;
		var $saveButton;

		// Update user after required fields (NOT username, email and password) in Backend Services
		var update = function () {
			dataSource.Gender = parseInt(dataSource.Gender);
			var birthDate = new Date(dataSource.BirthDate);

			if (birthDate.toJSON() === null) {
				birthDate = new Date();
			}

			dataSource.BirthDate = birthDate;

			Everlive.$.Users.update(
				dataSource)
				.then(function () {
					app.showAlert("Update successful");
					app.mobileApp.navigate('#welcome');
				},
					  function (err) {
						  app.showError(err.message);
					  });
		};

		// Executed after update view initialization
		// init form validator
		var init = function () {
			// Get a reference to our sensitive element
			avatarImage = document.getElementById("avatarImage");
			$updateForm = $('#update');
			$formFields = $updateForm.find('input, textarea, select');
			$updateInfo = $('#updateInfo');
			var $saveButton = $('#saveButton');
			validator = $updateForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

			$formFields.on('keyup keypress blur change input', function () {
				if (validator.validate()) {
					$saveButton.removeClass('disabled');
				} else {
					$saveButton.addClass('disabled');
				}
			});

			$updateInfo.on('keydown', app.helper.autoSizeTextarea);
		}

		// Executed after show of the update view
		var show = function () {
			$updateInfo.prop('rows', 1);

			dataSource = kendo.observable({
											  Username: app.Users.currentUser.data.Username,
											  Password: '',
											  DisplayName: app.Users.currentUser.data.DisplayName,
											  Email: app.Users.currentUser.data.Email,
											  Gender: app.Users.currentUser.data.Gender,
											  About: app.Users.currentUser.data.About,
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
			$saveButton.addClass('disabled');
		};

		var onSelectChange = function (sel) {
			var selected = sel.options[sel.selectedIndex].value;
			sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
		}
		
		var pickImage = function () {
			function success(imageURI) {
				selected = imageURI;
				avatarImage.src = selected;				
				$saveButton = $('#saveButton');
				$saveButton.removeClass('disabled');
			}
			var error = function () {
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
			hide: hide,
			onSelectChange: onSelectChange,
			update: update,
			showImage: pickImage
		};
	}()
	);

	return updateViewModel;
}());