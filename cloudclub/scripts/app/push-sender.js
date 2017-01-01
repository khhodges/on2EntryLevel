(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.PushSender = (function () {
        var send = function () {
            var recipients = app.getSelectedUsersFromDataSource();
            var currentUsername = app.currentUserUsername.get('username');
			app.showAlert(currentUsername+" sending notifications to " + recipients.length + " Users.")

            var notificationObject = app.PushFactory.create(currentUsername, recipients);

            app.showAlert("Sending push message...");

            app.everlive.push.send(notificationObject, function (data) {
                var createdAt = app.formatDate(data.result.CreatedAt);
                app.showAlert("Notification created at: " + createdAt);
            }, function (err) {
                app.showAlert("Failed to create push notification: " + err.message, true);
            });
        };

        return {
            send : send
        }
    })();
}(window));