(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.shareEmail = function (message, files) {
        window.plugins.socialsharing.shareViaEmail(message, 'Shared Message from ' + app.Users.currentUser.data.DisplayName, null, null, app.Users.currentUser.data.Email, files)

        //NOTES:
        //'Message', message // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
          //'Subject',
          //['to@person1.com', 'to@person2.com'], // TO: must be null or an array
          //['cc@person1.com'], // CC: must be null or an array
          //null, // BCC: must be null or an array
          //['https://www.google.nl/images/srpr/logo4w.png', 'www/localimage.png'], // FILES: can be null, a string, or an array
          //onSuccess, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
          //onError // called when sh*t hits the fan
        
    }
}(window));