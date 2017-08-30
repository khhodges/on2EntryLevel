/**
 * Activities view model
 */
'use strict'

var app = app || {};

app.Activities = (function () {
    'use strict'
    var $enterEvent, $activityTitle, $newEventText, validator, selected, $baseImage, filterValue, theName, myId, theText, thePartner;
    var init = function () {
        validator = $('#enterEvent').kendoValidator().data('kendoValidator');
        $enterEvent = $('#enterEvent');
        $newEventText = $('#newEventText');
        $activityTitle = $('#activityTitle');
        $newEventText.on('keydown', app.helper.autoSizeTextarea);
        validator.hideMessages();
        app.Activities.activities._filter.filters[0].filters[0].value = 'My Private Feed';
        //$(document.body).css("visibility", "visible");
    };
    var filterOne = {
        logic: 'or',
        filters: [{
            // My Private Feed [0]
            logic: 'and',
            filters: [
				{
				    field: "Title",
				    operator: "eq",
				    value: "My Private Feed"
				},
				{
				    field: "UserId",
				    operator: "eq",
				    value: myId
				},
            ]
        }, {
            // Partner List
            filters: [
                {
                    field: "Title",
                    operator: "startswith",
                    value: thePartner
                }]
        }, {
            //Selected ActivityText
            filters: [{
                field: "Text",
                operator: "eq",
                value: theText
            }]
        }
        ]
    };
    if (app.isOnline()) {
        //app.showAlert(JSON.stringify(app.Activities.activities._filter))
        myId = app.Users.currentUser.data.Id;
        app.Activities.activities._filter.filters[0].filters[1].value = myId;
        filterOne.filters[0].filters[1].value = myId;
    }
    var show = function (e) {
        if (!app.isOnline()) {
            app.mobileApp.navigate("#welcome");
        }
        app.Places.locationViewModel.set("isGoogleMapsInitialized", false);
        $("#scroller").data("kendoMobileScroller").reset();
        if (e.view.params.ActivityText) {
            /*			app.Activities.activities._filter = filterOne;
				3 cases:
				[2] all from one partner (thePartner), {field: "Title", operator: "startswith",value: e.view.params.ActivityText}
				[1] one selected item (theText), {field: "Text", operator: "eq",value: e.view.params.Text}
				[0] all from one user (online) {field:} {field: "UserId", operator: "eq", myId}
				*/
            try {
                var theName = app.Places.visiting.details().name
            } catch (ex) {
                app.notify.showLongBottom(appSettings.messages.dataLoad);
                app.Activities.activities._filter = { field: "Title", operator: "doesnotcontain", value: "My Private Feed" }
            }
            if (e.view.params.ActivityText) {
                thePartner = e.view.params.ActivityText;
                app.Activities.activities._filter = { field: "Title", operator: "startswith", value: e.view.params.ActivityText }
            } else {
                thePartner = app.Places.visiting.name;
            }
            if (e.view.params.Text && e.view.params.Text !== "undefined") {
                theText = e.view.params.Text;
                app.Activities.activities._filter = { field: "Text", operator: "eq", value: e.view.params.Text };
            }
            if (app.isOnline() && e.view.params.ActivityText === 'My Private Feed') {
                app.Activities.activities._filter = { field: "UserId", operator: "eq", value: app.Users.currentUser.data.Id };
            }
            app.loading(true);
        }
        //app.Activities.activities._filter = app.helper.activityFilter(e.view.params.ActivityText, e.view.params.Text);
        app.loading(true);
        app.Activities.activities.fetch(function () {
            $('#activities-listview').kendoMobileListView({
                dataSource: app.Activities.activities,
                template: kendo.template($('#activityTemplate').html())
            });
            kendo.bind($("#view-all-activities", app.Activities));
        });
        //filterValue = e.view.params.User;
        if (e.view.params.camera === 'ON') {
            //app.showAlert("camera is ON!")
            e.view.params.camera = 'OFF';
            if (theName === undefined) theName = "My Full Feed";
            //app.notify.showShortTop(JSON.stringify(app.Activities.activities._filter))
            document.getElementById('activityTitle').innerText = "Author: " + app.Users.currentUser.data.DisplayName + ', Subject: ' + theName;
            app.Activities.addActivity();
        }
    };
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
                },
                Location: {
                    field: 'Location',
                    defaultValue: []
                },
                Active: {
                    fields: 'Active',
                    defaultValue: 1
                },
                Notes: {
                    fields: 'Notes',
                    defaultValue: null
                },
                Title: {
                    fields: 'Title',
                    defaultValue: null
                },
                Value: {
                    fields: 'Value',
                    defaultValue: 0
                },
                Start: {
                    fields: 'StartDate',
                    defaultValue: new Date()
                },
                End: {
                    fields: 'EndDate',
                    defaultValue: new Date()
                },
                Level: {
                    fields: 'Level',
                    defaultValue: 1
                }
            },
            CreatedAtFormatted: function () {
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            DateFormatted: function (date) {
                return app.helper.formatDate(date);
            },
            LikesCount: function () {
                return app.helper.formatLikes(this.get('Likes'), this.get('Text'));
            },
            PictureUrl: function () {
                return app.helper.resolvePictureUrl(this.get('Picture'));
            },
            ResponsivePictureUrl: function () {
                var id = this.get('Picture');
                var el = new Everlive(appSettings.everlive.appId);
                el.Files.getById(id).then(function (data) {
                    // get url from data
                    var url = data.result.Uri;
                    var size = "/resize=w:200,h:200,fill:cover/";
                    var base = "https://bs1.cdn.telerik.com/image/v1/";
                    //navigator.notification.alert(url);
                    // convert to responsive url
                    url = base + appSettings.everlive.appId + size + url;
                    return url;
                }),
					function (error) {
					    navigator.notification.alert(JSON.stringify(error));
					}
            },
            User: function () {
                var userId = this.get('UserId');
                if (userId === undefined) {
                    app.notify.showLongBottom(appSettings.messages.tryAgain);
                    userId = app.Users.currentUser.data.Id;
                }

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture),
                    urlPictureUrl: app.helper.resolveBackgroundPictureUrl(user.Picture, 'bg')
                } : {
                    DisplayName: app.Users.currentUser.data.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(app.Users.currentUser.data.Picture),
                    urlPictureUrl: app.helper.resolveBackgroundPictureUrl(app.Users.currentUser.data.Picture, 'bg')
                };
            },
            isVisible: function () {
                var currentUserId;
                currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');
                var level = app.Users.currentUser.data.Level;

                if ((level === '4' || level === '3') && (currentUserId === userId || currentUserId === '849f6340-e6eb-11e6-aafa-8305582f9f48')) {
                    document.getElementsByClassName("nav-button nav-button-icon nav-button-delete hide-text")[0].attributes.style = "block";
                    return true;
                }
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
                typeName: 'Activities',
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                    $("#scroller").data("kendoMobileScroller").reset();
                } else {
                    $('#no-activities-span').show();
                }
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            },
            filter: {
                logic: 'or',
                filters: [{
                    // My Private Feed [0]
                    logic: 'and',
                    filters: [
						{
						    field: "Title",
						    operator: "eq",
						    value: "My Private Feed"
						},
						{
						    field: "UserId",
						    operator: "eq",
						    value: myId
						},
                    ]
                }, {
                    // Partner List
                    filters: [
                        {
                            field: "Title",
                            operator: "startswith",
                            value: thePartner
                        }]
                }, {
                    //Selected ActivityText
                    filters: [{
                        field: "Text",
                        operator: "eq",
                        value: theText
                    }]
                }
                ]
            }
        });
        //var myDataSource = app.Activities.activities;
        return {
            activities: activitiesDataSource
        };
    }());
    var afterShow = function () {
        //app.showAlert("After Show starting")
        var myDataSource = app.Activities.activities;
        myDataSource.fetch(function () {
            app.Activities.activities = this.data();
            //console.log(data.items)
            $('#activities-listview').kendoMobileListView({
                dataSource: app.Activities,
                template: kendo.template($('#activityTemplate').html())
            });
        });
    }
    // Activities view model

    var activitiesViewModel = (function () {
        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {
            var itemId = $(e.event.target).parents("li").attr("data-uid");
            app.mobileApp.navigate('views/activityView.html?uid=' + itemId); // e.dataItem.uid);
        };
        // Navigate to app home
        var navigateHome = function () {
            app.mobileApp.navigate('#welcome');
        };
        var crop = function () {
            if (!app.isOnline()) {
                return;
            }
            var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
            var starter = document.getElementById("picture");
            var canvas = document.getElementById("canvas");
            if (starter.naturalWidth > starter.naturalHeight) {
                sx = (starter.naturalWidth - starter.naturalHeight) / 2;
                sx = Math.floor(sx);
                starterWidth = starter.naturalHeight;
                starterHeight = starter.naturalHeight;
                sy = 0;
            } else {
                sy = (-starter.naturalWidth + starter.naturalHeight) / 2;
                sy = Math.floor(sy);
                starterWidth = starter.naturalWidth;
                starterHeight = starter.naturalWidth;
                sx = 0;
            }
            dx = 0;
            dy = 0;
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            var ctx = canvas.getContext("2d");
            app.helper.drawImageIOSFix(ctx, starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
            //ctx.drawImage(starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
            $baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
        }
        var saveActivity = function () {
            // Validating of the required fields
            if (validator.validate()) {
                $enterEvent.style.display = 'none';
                // Adding new comment to Comments model
                var activities = app.Activities.activities;
                var activity = activities.add();
                activity.Text = $newEventText.val();
                $newEventText.Val = "";
                activity.UserId = app.Users.currentUser.get('data').Id;
                document.getElementById('addButton').innerText = "Post";
                activities.sync();
                app.mobileApp.hideLoading();
            }
        };
        var saveImageActivity = function () {
            // Validating of the required fields
            if (selected === undefined || !$baseImage) {
                app.showAlert("First take a photo with your camera and then add a message to match!", "Informational");
            }
            if (validator.validate() && (selected !== undefined)) {
                app.notify.showLongBottom(appSettings.messages.updating);
                // Save image as base64 to everlive
                app.everlive.Files.create({
                    Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                    ContentType: "image/jpeg",
                    base64: $baseImage
                })
					.then(function (promise) {
					    selected = promise.result.Id;

					    // Adding new activity to Activities model
					    var activities = app.Activities.activities;
					    var activity = activities.add();
					    activity.Text = document.getElementById('newEventText').value;

					    activity.UserId = app.Users.currentUser.get('data').Id;
					    activity.Picture = selected;
					    app.Places.locationViewModel.lastPicture = selected;
					    activity.Title = "My Private Feed"; //app.Users.currentUser.get('data').DisplayName;
					    if (typeof app.Places.visiting.details === "function")
					        activity.Title = app.Places.visiting.details().name;
					    navigator.geolocation.getCurrentPosition(
							function (position) {
							    activity.Location = {
							        "longitude": position.coords.longitude,
							        "latitude": position.coords.latitude
							    };
							    activities.sync();
							    //app.blogEmail(activity.Title,selected)
							    $enterEvent.style.display = 'none';
							    validator.hideMessages();
							    document.getElementById('addButton').innerText = "Post";
							    document.getElementById('newEventText').value = "";
							    document.getElementById('picture').src = "styles/images/default-image.jpg";
							    app.mobileApp.hideLoading();
							},
							function (error) {
							    position = new google.maps.LatLng(0, -20);
							    app.notify.showLongBottom(appSettings.messages.mapError);
							    return position;
							}, {
							    timeout: 30000,
							    enableHighAccuracy: true
							}
						);
					})
            }
        };
        var addActivity = function () {
            $enterEvent = document.getElementById('enterEvent');
            if ($enterEvent.style.display === 'block') {
                $enterEvent.style.display = 'none';
                validator.hideMessages();
                document.getElementById('addButton').innerText = "Post";
                document.getElementById('newEventText').value = "";
                document.getElementById('picture').src = "styles/images/default-image.jpg";
            } else {
                $enterEvent.style.display = 'block';
                document.getElementById('addButton').innerText = "Cancel";
            }
        };
        var success = function (imageURI) {
            selected = imageURI;
            var picture = document.getElementById("picture");
            picture.src = selected;
            $enterEvent.style.display = 'block';
        }
        var error = function () {
            validator.hideMessages();
            document.getElementById('addButton').innerText = "Post";
            document.getElementById('newEventText').value = "";
            if (app.imageArray) {
                if (!app.helper.checkSimulator()) {
                    imagePicker.getPictures(
                      function (result) {
                          if (result.length > 0) {
                              var content = '';
                              for (var i = 0; i < result.length; i++) {
                                  content += '<img src="' + result[i] + '" style="max-width:200px"/>';
                              }
                              selected = result[0];
                              document.getElementById("picture").src = result[0];
                          } else {
                              // picker was cancelled
                              $enterEvent.style.display = 'none';
                              app.showAlert(appSettings.messages.tryAgain);
                          }
                      },
                      function () {
                          app.showAlert(appSettings.messages.tryAgain);
                      },
                      {
                          maximumImagesCount: 1,
                          quality: 90,
                          outputType: imagePicker.OutputType.FILE_URI // which is the default btw
                      }
                    );
                }
                //app.mobileApp.navigate('views/imagePicker.html');
            }
            else {
                $enterEvent.style.display = 'none';
                app.notify.showLongBottom(appSettings.messages.tryAgain);
            }
        };
        var takePicture = function () {
            navigator.camera.getPicture(success, error, {
                //kjhh best result including iphone rotation
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
                encodingType: navigator.camera.EncodingType.JPEG,
                correctOrientation: true
            })
        };
        var pickImage = function () {
            if (app.isOnline()) {
                $enterEvent = document.getElementById('enterEvent');
                app.mobileApp.navigate('#view-all-activities');
                if ($enterEvent.style.display === 'block') {
                    $enterEvent.style.display = 'none';
                    validator.hideMessages();
                    document.getElementById('addButton').innerText = "Post";
                    document.getElementById('newEventText').value = "";
                    document.getElementById('picture').src = "styles/images/default-image.jpg";
                } else {
                    $enterEvent.style.display = 'block';
                    document.getElementById('addButton').innerText = "Cancel";
                    takePicture();
                    //$enterEvent.style.display = 'block';
                    //document.getElementById('addButton').innerText = "Cancel";
                    //navigator.camera.getPicture(success, error, {
                    //	//kjhh best result including iphone rotation
                    //	quality: 100,
                    //	destinationType: navigator.camera.DestinationType.FILE_URI,
                    //	sourceType: navigator.camera.PictureSourceType.CAMERA,
                    //	encodingType: navigator.camera.EncodingType.JPEG,
                    //	correctOrientation: true
                    //});
                }
            }
        };
        return {
            init: init,
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            addActivity: pickImage,
            saveActivity: saveImageActivity,
            show: show,
            //afterShow: afterShow,
            crop: crop
        };
    }());
    return activitiesViewModel;
}());