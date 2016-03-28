/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';
        var usersDataSource = (function () {

            var dataModel = {
                id: Everlive.idField,
                isSelected: false,
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
        var currentUserData;



        // Retrieve current user and all users data from Backend Services
        var loadUsers = function () {

            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {

                currentUserData = data.result;
                currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);

                // Get the data about all registered users
                return app.everlive.Users.get();
            })
            .then(function (data) {

                usersData = new kendo.data.ObservableArray(data.result);
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };

        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            currentUser: currentUser,
           // usersData: usersDataSource,
            onUserSelected: onUserSelected,
            handleSendAction: handleSendAction
        };

    }());

    return usersModel;

}());
