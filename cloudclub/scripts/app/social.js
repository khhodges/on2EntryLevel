(function (global) {
	'use strict';

	var app = global.app = global.app || {};
	// this is the complete list of currently supported params you can pass to the plugin (all optional)
	app.myShare = function(options) {
		//var options = {
		//	message: 'share this', // not supported on some apps (Facebook, Instagram)
		//	subject: 'the subject', // fi. for email
		//	files: ['', ''], // an array of filenames either locally or remotely
		//	url: 'https://www.website.com/foo/#bar?a=b',
		//	chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		//}

		var onSuccess = function(result) {
			console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
		}

		var onError = function(msg) {
			console.log("Sharing failed with message: " + msg);
		}

		window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
	}
	
	app.blogEmail = function (message, files) {
		if(files.substring(0,4) ==="http"){
			return;
        }
		app.everlive.Files.getById(files).then(
			function(data) {
				//alert(JSON.stringify(data));
				window.plugins.socialsharing.shareViaEmail(
					message,//'Message', message // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
					'Shared by ' + app.Users.currentUser.data.DisplayName,//'Subject',  			 
					"ken294.on2seeme@blogger.com",//['to@person1.com', 'to@person2.com'], // TO: must be null or an array
					"ken@sipantic.com",//['cc@person1.com'], // CC: must be null or an array			 
					app.Users.currentUser.data.Email,//null, // BCC: must be null or an array			 
					data.result.Uri,//['https://www.google.nl/images/srpr/logo4w.png', 'www/localimage.png'], // FILES: can be null, a string, or an array			
					function(){app.notify.showShortTop("Blog sent sucessfully")}, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
					app.onError) // called when sh*t hits the fan
		}, 
		function(error) {
			app.showAlert("Picture File not found. Please try again.");
		});
	}
     
	app.shareViaInstagram = function(message, url) {
		window.plugins.socialsharing.shareViaInstagram(message, url, this.onSuccess, this.onError)
	}
	
	app.shareImage = function () {
		this.share(null, null, 'http://www.telerik.com/sfimages/default-source/productsimages/mobilecraft/telerik-platform.png', null);
	}

	app.shareMessageAndURL = function () {
		this.share('The message', 'The subject', null, 'http://www.telerik.com');
	}
        
	app.share = function (message, subject, image, link) {
		if (!this.checkSimulator()) {
			window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
		}
	}

	app.tweetSelfie= function () {
		// doesn't need to be a selfie of course, but that seems to be hot these days ;)
		if (!this.checkSimulator()) {
			navigator.camera.getPicture(
				function(base64EncodedImg) {
					// wrap in a timeout so the native view of SocialSharing doesn't collide with the one from the camera plugin
					setTimeout(function() {
						window.plugins.socialsharing.shareViaTwitter('I can\'t seem to do a presentation without tweeting a selfie. Sue me!', 'data:image/jpg;base64,' + base64EncodedImg, null, null, null);
					}, 500);
				},
				function(msg) {
					alert("Error: " + msg);
				}, {
					quality: 50,
					targetWidth: 600,
					targetHeight: 600,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.CAMERA
				}
				);
		}
	},

	app.shareMessageAndURLViaTwitter= function () {
		if (!this.checkSimulator()) {
			window.plugins.socialsharing.shareViaTwitter('The message', null, 'http://www.telerik.com', this.onSuccess, this.onError);
		}
	}

	app.shareImagesViaFacebook = function () {
		if (!this.checkSimulator()) {
			// For the files param you can pass null, a single string or an array.
			// Note that the passed message won't be prefilled for Facebook (tip: use shareViaFacebookWithPasteMessageHint)
			window.plugins.socialsharing.shareViaFacebook('The message, not shown on Android. On iOS only when no Facebook app is installed.', ['www/styles/images/logo.png', 'http://www.telerik.com/sfimages/default-source/productsimages/mobilecraft/telerik-platform.png'], null, this.onSuccess, this.onError);
		}
	}

	app.shareMessageAndImageViaFacebook = function () {
		if (!this.checkSimulator()) {
			// For the files param you can pass null, a single string or an array.
			window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Wow, your clipboard is a mess! Do you copy-paste a lot sir?', 'www/styles/images/logo.png', null, null, this.onSuccess, this.onError);
		}
	}

	app.shareMessageViaWhatsApp = function () {
		if (!this.checkSimulator()) {
			window.plugins.socialsharing.shareViaWhatsApp('The message', null, null, this.onSuccess, this.onError);
		}
	}

	app.shareMessageViaSMS = function () {
		if (!this.checkSimulator()) {
			window.plugins.socialsharing.shareViaSMS(
				'The message', 
				'+31612345678,+31623456789', 
				this.onSuccess, this.onError);
		}
	}
        
	app.shareViaEmail = function () {
		if (!this.checkSimulator()) {
			window.plugins.socialsharing.shareViaEmail(
				'The message',
				'The subject',
				['to@person1.com', 'to@person2.com'], // TO: must be null or an array
				['cc@person1.com'], // CC: must be null or an array
				null, // BCC: must be null or an array
				['https://www.google.nl/images/srpr/logo4w.png'],
				this.onSuccess,
				this.onError
				);
		}
	}

	app.checkSimulator = function() {
		if (window.navigator.simulator === true) {
			alert('This plugin is not available in the simulator.');
			return true;
		} else if (window.plugins === undefined || window.plugins.socialsharing === undefined) {
			alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
			return true;
		} else {
			return false;
		}
	}

	// callbacks
	app.onSuccess = function(msg) {
		app.notify.showShortTop('SocialSharing success!');
	}

	app.onError = function(msg) {
		app.notify.showShortTop('SocialSharing error: ' + msg);
	}
}(window));