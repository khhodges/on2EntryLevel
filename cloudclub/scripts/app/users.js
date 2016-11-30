/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';
	var usersDataSource = (function () {

		var dataModel = {
			id: Everlive.idField,
			isSelected: function () {
				return this.get('isSelected')
			},
			isSelectedClass: function () {
				return this.get('isSelected') ? "listview-selected" : ''
			}
		};

		var usersDataSource2 = new kendo.data.DataSource({
			type: 'everlive',
			transport: {
				typeName: 'Users'
			},
			schema: {
				model: dataModel
			}
		});
		return usersDataSource2;
	});

	var onUserSelected = function (e) {
		var isSelected = e.dataItem.get("isSelected");
		var newState = isSelected ? false : true;
		e.dataItem.set("isSelected", newState);
	};

	var handleSendAction = function () {
		app.navigateToView(appSettings.views.main);
		app.PushSender.send();
	};
    var usersModel = (function () {

        var currentUser = kendo.observable({ data: null });
        var usersData;
        var adminData;
        var currentUserData;

        // Retrieve current user and all users data from Backend Services
        var loadUsers = function () {

            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
				.then(function (data) {
					currentUserData = data.result;
					currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
					if(data.result.JSON === undefined){
						currentUserData.jsonList = appSettings.userOptions;;
					}
					else{
						currentUserData.jsonList = JSON.parse(data.result.JSON);
					}
					var jsonDirectory = currentUserData.jsonList.url;
					currentUserData.jsonDirectory = jsonDirectory;
					currentUser.set('data', currentUserData);
					return app.everlive.Users.get();
				})
				.then(function (data) {
					usersData = new kendo.data.ObservableArray(data.result);
					var sb = document.getElementById("saveButton");
					if (sb) {
						sb.style.display = "";
					}
					var item = document.getElementById("autoBlog");
					if (item) {
						if (currentUserData.jsonList.partner.autoBlog === "OFF") {
							item.className = "btn-login km-widget km-button";
							item.innerText = 'OFF';
						}
						else {
							item.className = "btn-register km-widget km-button";
							item.innerText = 'ON';
						}
					}
					var item = document.getElementById("rememberMe");
					if (item) {
						if (item && currentUserData.jsonList.partner.rememberMe === "OFF") {
							item.className = "btn-login km-widget km-button";
							item.innerText = 'Remember is "OFF"'
						}
						else {
							item.className = "btn-register km-widget km-button";
							item.innerText = 'Remember is "ON"';
						}
					}
				})
				.then(function () {
					// Get the data about all registered users
					var query = new Everlive.Query();
					query.where().eq('Role', '316436d0-ed61-11e5-a994-2317f931f3bf');

					return app.everlive.Users.get(query);
				})
				.then(function (data) {

					adminData = new kendo.data.ObservableArray(data.result);
				})
				.then(null,
				function (err) {
					app.showError(err.message);
				})
        };

		return {
			load: loadUsers,
			setItem: function (name, item, value) {
				//app.showAlert(name + ", " + item + ", " + value);
				var items = currentUserData.jsonDirectory;
				var list = currentUserData.jsonList;
				switch (name) {
					case "autoBlog":
						list.partner.autoBlog = value;
						break;
					case "rememberMe":
						//app.showAlert(list.partner.rememberMe +" > " + value);
						list.partner.rememberMe = value;
						if (value = "OFF") {
							localStorage.setItem("access_token", "");
						}
						else{
							localStorage.setItem("access_token", localStorage.getItem("access_token1"));
						}
						//app.showAlert(app.Users.currentUser.data.jsonList.partner.rememberMe  +" > " + value);
						break;
					default:
						var found = false;
						for (var i = 0; i < items.length; i++) {
							if (found) break;
							var x = items[i];
							if (x.name === name) {
								//app.showAlert(name + ", " + item + ", " + value);
								switch (item) {
									case "selected":
										x.selected = value;
										found = true;
										break;
									default:
								}
							}
						}
				}
			},
			users: function () {
				return usersData;
			},
			admin: function () {
				return adminData;
			},
			isOnline: function () {
				if (currentUser === null || currentUser.data === null) {
					return false;
				} else {
					return true;
				}
			},
			clearUsersData: function () {
				currentUser.data = null;
				usersData = null;
			},
			currentUser: currentUser,
			// usersData: usersDataSource,
			onUserSelected: onUserSelected,
			handleSendAction: handleSendAction
		};

    } ());

	return usersModel;

} ());
