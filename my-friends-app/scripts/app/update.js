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
			$updateForm = $('#update');
			$formFields = $updateForm.find('input, textarea, select');
			$updateInfo = $('#updateInfo');
			$updateBtnWrp = $('#updateBtnWrp');
			validator = $updateForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

			$formFields.on('keyup keypress blur change input', function () {
				if (validator.validate()) {
					$updateBtnWrp.removeClass('disabled');
				} else {
					$updateBtnWrp.addClass('disabled');
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
			$updateBtnWrp.addClass('disabled');
		};

		var onSelectChange = function (sel) {
			var selected = sel.options[sel.selectedIndex].value;
			sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
		}

		return {
			init: init,
			show: show,
			hide: hide,
			onSelectChange: onSelectChange,
			update: update
		};
	}());

	return updateViewModel;
}());