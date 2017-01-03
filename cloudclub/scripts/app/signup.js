/**
 * Signup view model
 */
var app = app || {}; // reuse the existing app or create a new, empty app container

app.Signup = (function () {
    'use strict'; //This JavaScript 1.8.5 (ECMAScript version 5) is a literal expression, 
    //ignored by earlier versions to throw silent errors, fixes mistakes and add optimizations: 
    //strict mode code may run faster and prevents syntax needed for later versions of ECMAScript.

    var singupViewModel = (function () {
        // View model components see HTML ids
        var $signUpForm;
        var $formFields;
        var $signupInfo;
        var $signupBtnWrp;

        // functional components
        var dataSource;
        var validator;
        var avatarImage;
        var registered = false;
        var touchzone;
        var imageObj;
        var lastMove;
        var selected = "styles/images/avator.png";
        var imageId;

        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {
        };

        var defaultAvatar = function () {
            var picture = document.getElementById("avatarImage");
            app.helper.convertToDataURL("styles/images/on2see-icon-120x120.png", function (base64Img) {
                everlive.Files.create({
                    Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                    ContentType: "image/png",
                    base64: base64Img
                }).then(function (promise) {
                    imageId = promise.result.Id;

                    dataSource.Gender = parseInt(dataSource.Gender);
                    var birthDate = new Date(dataSource.BirthDate);

                    if (birthDate.toJSON() === null) {
                        birthDate = new Date();
                    }

                    dataSource.BirthDate = birthDate;

                    dataSource.Picture = imageId;

                    Everlive.$.Users.register(
                        dataSource.Username,
                        dataSource.Password,
                        dataSource)
                        .then(function () {
                            //console.log("Congratulations! You are now registered!", "The Loyalty Club");
                            app.notify.showShortTop(appSettings.messages.registration);
                            app.mobileApp.navigate('#welcome');
                        },
                            function (err) {
                                app.showError(appSettings.messages.tryAgain + err.message);
                            });
                })
            }, "image/jpeg");
        }
        // var registerDevice = function () {
        //     //app.notify.showShortTop("Start registration for event notifications.");
        //     if (!registered) {
        //         registered = true;
        //         console.log("Register for device notifications");
        //         app.everlive.push.register(devicePushSettings, function () {
        //             app.notify.showShortTop(appSettings.messages.registerOK);
        //             //console.log("Success! You can also receive local event notifications.");
        //         }, function (err) {
        //             app.notify.showShortTop(appSettings.messages.tryAgain + err.message);
        //             //console.log("Notification Register Request: " + err.message);
        //         })
        //     }
        //     else {
        //         console.log("Second request in the same test session.");
        //     }
        // }

        // var devicePushSettings = {
        //     iOS: {
        //         badge: 'true',
        //         sound: 'true',
        //         alert: 'true'
        //     },
        //     android: {
        //         projectNumber: appSettings.notification.androidProjectNumber
        //     },
        //     wp8: {
        //         channelName: 'EverlivePushChannel'
        //     },
        //     notificationCallbackIOS: onPushNotificationReceived,
        //     notificationCallbackAndroid: onPushNotificationReceived,
        //     notificationCallbackWP8: onPushNotificationReceived
        // };
        // Executed after Signup view initialization
        // init form validator
        var init = function () {
            //unregister device
            //var el = new Everlive(appSettings.everlive.appId);
            //el.push.unregister(function () {
            //    app.notify.showShortTop("Success! You unregistered event notifications.");
            //    console.log("Success! You will not receive local event notifications.");
            //}, function (err) {
            //    app.notify.showShortTop("UnRegister Device: " + err.message);
            //    console.log("UnRegister Device: " + err.message);
            //});
            // Get a reference to our touch-sensitive element
            touchzone = document.getElementById("touchzone");
            avatarImage = document.getElementById("avatarImage");
            imageObj = new Image();

            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupInfo = $('#signupInfo');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({
                validateOnBlur: false
            }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });

            $signupInfo.on('keydown', app.helper.autoSizeTextarea);
        }

        // Executed after show of the Signup view
        var show = function () {
            //app.showAlert("show");
            $signupInfo.prop('rows', 1);
            dataSource = kendo.observable({
                Username: '',
                Password: '',
                DisplayName: '',
                Email: '',
                Gender: '0',
                About: '',
                Friends: [],
                BirthDate: new Date()
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
            if (!app.helper.checkSimulator()) {
                app.notify.showLongBottom(appSettings.messages.registrationHelp);
            }
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
        };

        var everlive = new Everlive(appSettings.everlive.appId);
        // Called when a photo is successfully retrieved
        //
        var resetImage = function () {
            var image = document.getElementById("zoom_mw");
            image.src = selected;
        }
        var pickImage = function () {
            function success(imageURI) {
                selected = imageURI;
                avatarImage.style.backgroundImage = "url(" + selected + ")";
                app.mobileApp.hideLoading();
            }

            var error = function () {
                app.mobileApp.hideLoading();
                navigator.notification.alert("No selection was detected.");
            };
            var config = {
                destinationType: Camera.DestinationType.FILE_URI,
                quality: 25
            };
            navigator.camera.getPicture(success, error, config);
        };

        var addImage = function () {
            var success = function (data) {
                if (!app.helper.checkSimulator()) {
                    app.notify.showShortTop(appSettings.messages.updating);
                    everlive.Files.create({
                        Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                        ContentType: "image/jpeg",
                        base64: data
                    })
						.then(function (promise) {
						    selected = promise.result.Uri;
						    imageId = promise.result.Id;
						    avatarImage.style.backgroundImage = "url(" + selected + ")";
						    app.mobileApp.hideLoading();
						})
                }

                var error = function () {
                    app.mobileApp.hideLoading();
                    navigator.notification.alert("Unfortunately we could not add the image");
                };
                var config = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    quality: 25
                };
                //app.mobileApp.showLoading();
                navigator.camera.getPicture(success, error, config);
            };
        }

        var loadPhotos = function (promise) {
            dataSource.About = promise.result.Uri;
            //app.showAlert("addImage to " + dataSource.About);
            var files = [];
            if (promise.result.Uri === "") {
                everlive.Files.get().then(function (data) {
                    for (var i = data.result.length - 1; i >= 0; i--) {
                        var image = data.result[i];
                        files.push(image.Uri);
                        $("#images").kendoMobileListView({
                            dataSource: files,
                            template: "<ui><div class='adiv' ><img class='crop' src='#: data #' /></ui>"
                        });
                    }
                })
            } else {
                var largeImage = document.getElementById('largeImage');
                largeImage.style.display = 'block';
                largeImage.src = promise.result.Uri;
            }
            app.mobileApp.hideLoading();
        };

        var cropAvatar = function (X, Y) {
            var source = new Image();
            var d = document.getElementById("zoom_mw");
            source.src = d.src;
            var cropCanvas = document.getElementById("myCanvas");
            var avatar = document.getElementById("myCanvas");
            var context = cropCanvas.getContext("2d");
            cropCanvas.width = source.width;
            cropCanvas.height = source.height;
            if (source.height > source.width) {
                context.drawImage(source, X, Y, source.height / 2, source.height / 2, 0, 0, source.height, source.height);
                avatar.style.height = source.height / 2;
            } else {
                context.drawImage(source, X, Y, source.width / 2, source.width / 2, 0, 0, source.width, source.width);
                avatar.style.width = source.width / 2;
            }
            var size = 200;
            var scale = 10;
            context.font = size + "px impact";
            var lineOfText = "Kenneth Hamer-Hodges";

            while (context.measureText(lineOfText).width / cropCanvas.offsetWidth > 1) {
                size = size - scale;
                context.font = size + "px impact";
                if (size < 30)
                    scale = 2;
            }
            context.textAlign = 'center';
            context.fillStyle = 'yellow';

            context.fillText(lineOfText, cropCanvas.width / 2, cropCanvas.height * 0.6);

            var imgURI = cropCanvas.toDataURL();

            setTimeout(function () {
                var imageA = document.getElementById("avatarImage");
                imageA.src = imgURI;
                if (imageA.style.height > imageA.style.width) {
                    imageA.style.height = "100%";
                    imageA.style.width = "auto";
                } else {
                    imageA.style.height = "auto";
                    imageA.style.width = "100%";
                }
                cropCanvas.style.visibility = 'hidden';
            }, 200);
        }
        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            signup: defaultAvatar,
            addImage: addImage,
            pickImage: addImage,
            resetImage: resetImage,
            submit: function () {
                if (!this.email) {
                    navigator.notification.alert("Email address is required.");
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "http://api.everlive.com/v1/" + appSettings.everlive.appId + "/Users/resetpassword",
                    contentType: "application/json",
                    data: JSON.stringify({ Email: this.email }),
                    success: function () {
                        navigator.notification.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                        window.location.href = "#welcome";
                    },
                    error: function (result) {
                        navigator.notification.alert("Unfortunately, an error occurred resetting your password. " + result.responseText)
                    }
                });
            }
        };
    }()
	);

    return singupViewModel;
}());