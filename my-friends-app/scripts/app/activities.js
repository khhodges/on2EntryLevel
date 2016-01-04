/**
 * Activities view model
 */

var app = app || {};

app.Activities = (function () {
	'use strict'
	var $enterEvent, $newEventText, validator;
	
	var init = function () {
		validator = $('#enterEventText').kendoValidator().data('kendoValidator');
		$newEventText = $('#newEventText');	
		$newEventText.on('keydown', app.helper.autoSizeTextarea);
	};
	
	var showTitle = function() {
		var title = document.getElementById("navbarTitle").InnerTEXT;
		title = activities.User().DisplayName;
	}
	
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
					}
			},
			CreatedAtFormatted: function () {
				return app.helper.formatDate(this.get('CreatedAt'));
			},
			PictureUrl: function () {
				return app.helper.resolvePictureUrl(this.get('Picture'));
			},
			User: function () {
				var userId = this.get('UserId');

				var user = $.grep(app.Users.users(), function (e) {
					return e.Id === userId;
				})[0];

				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture),
					urlPictureUrl: app.helper.resolveBackgroundPictureUrl(user.Picture)
				} : {
					DisplayName: 'Anonymous',
					PictureUrl: app.helper.resolveProfilePictureUrl()
				};
			},
			isVisible: function () {
				var currentUserId = app.Users.currentUser.data.Id;
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
				typeName: 'Activities'
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
																 filter:{
				field: "UserId", operator: "neq", value: "undefined"				
			}
															 });

		return {
			activities: activitiesDataSource
		};
	}());

	// Activities view model
	var activitiesViewModel = (function () {
		// Navigate to activityView When some activity is selected
		var activitySelected = function (e) {
			app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
		};

		// Navigate to app home
		var navigateHome = function () {
			app.mobileApp.navigate('#welcome');
		};

		// Logout user
		var logout = function () {
			app.helper.logout()
				.then(navigateHome, function (err) {
					app.showError(err.message);
					navigateHome();
				});
		};
		
		var saveActivity = function () {
			// Validating of the required fields
			if (validator.validate()) {
				$enterEvent.style.display = 'none';				
				// Adding new comment to Comments model
				var activities = app.Activities.activities;
				var activity = activities.add();                
				activity.Comment = $newEventText.val();
				activity.UserId = app.Users.currentUser.get('data').Id;
				activity.ActivityId = app.Activity.activity().Id;                
				activity.sync();
				$newEventText.Val = "";
			}
		};
		
		var addActivity = function () {
			$enterEvent = document.getElementById('enterEvent');
			if ($enterEvent.style.display === 'block') {
				$enterEvent.style.display = 'none';
			} else {
				$enterEvent.style.display = 'block';
			}
		};        

		return {
			init: init,
			activities: activitiesModel.activities,
			activitySelected: activitySelected,
			logout: logout,
			addActivity: addActivity,
			saveActivity: saveActivity,
			show: showTitle
		};
	}());

	return activitiesViewModel;
}());