'use strict';

app.activities = kendo.observable({
	onShow: function () { },
	afterShow: function () { }
});

// START_CUSTOM_CODE_activities
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_activities
(function (parent) {
	var dataProvider = app.data.defender,
		fetchFilteredData = function (paramFilter, searchFilter) {
			var model = parent.get('activitiesModel'),
				dataSource = model.get('dataSource');

			if (paramFilter) {
				model.set('paramFilter', paramFilter);
			} else {
				model.set('paramFilter', undefined);
			}

			if (paramFilter && searchFilter) {
				dataSource.filter({
					logic: 'and',
					filters: [paramFilter, searchFilter]
				});
			} else if (paramFilter || searchFilter) {
				dataSource.filter(paramFilter || searchFilter);
			} else {
				dataSource.filter({});
			}
		},
		processImage = function (img) {
			if (!img) {
				var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
				img = 'data:image/png;base64,' + empty1x1png;
			} else if (img.slice(0, 4) !== 'http' &&
				img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
				var setup = dataProvider.setup || {};
				img = setup.scheme + ':' + setup.url + setup.appId + '/Files/' + img + '/Download';
			}

			return img;
		},
		flattenLocationProperties = function (dataItem) {
			var propName, propValue,
				isLocation = function (value) {
					return propValue && typeof propValue === 'object' &&
						propValue.longitude && propValue.latitude;
				};

			for (propName in dataItem) {
				if (dataItem.hasOwnProperty(propName)) {
					propValue = dataItem[propName];
					if (isLocation(propValue)) {
						dataItem[propName] =
							kendo.format('Latitude: {0}, Longitude: {1}',
								propValue.latitude, propValue.longitude);
					}
				}
			}
		},
		dataSourceOptions = {
			type: 'everlive',
			transport: {
				typeName: 'Activities',
				dataProvider: dataProvider,
				read: {
					headers: {
						"X-Everlive-Expand": JSON.stringify({
							UserId: true
						})
					}
				}
			},
			sort: {
				field: 'Date',
				dir: 'desc'
			},
			change: function (e) {
				if (e.items && e.items.length > 0) {
					$('#no-activities-span').hide();
				} else {
					$('#no-activities-span').show();
				}

				var data = this.data();
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];

					dataItem['PictureUrl'] =
						processImage(dataItem['Picture']);
					//flattenLocationProperties(dataItem);
				}
			},
			error: function (e) {
				if (e.xhr) {
					alert(JSON.stringify(e.xhr));
				}
			},
			schema: {
				model: {
					fields: {
						'Text': {
							field: 'Text',
							defaultValue: ''
						},
						'Stars': {
							field: 'Stars',
							defaultValue: ''
						},
						'Picture': {
							field: 'Picture',
							defaultValue: ''
						},
						'Date': {
							field: 'CreatedAt',
							defaultValue: ''
						}
					}
				}
			},
			serverFiltering: true,
		},
		dataSource = new kendo.data.DataSource(dataSourceOptions),
		activitiesModel = kendo.observable({
			dataSource: dataSource,
			searchChange: function (e) {
				var searchVal = e.target.value,
					searchFilter;

				if (searchVal) {
					searchFilter = {
						field: 'Text',
						operator: 'contains',
						value: searchVal
					};
				}
				fetchFilteredData(activitiesModel.get('paramFilter'), searchFilter);
			},
			isVisible: function () {
				true;
			},
			itemClick: function (e) {
				if (e.dataItem) {
					app.mobileApp.navigate('#components/activities/details.html?uid=' + e.dataItem.uid);
				} else {
					app.mobileApp.navigate('views/mapView.html');
				}
			},
			addClick: function () {
				//check for online
				if (app.helper.isOnLine()) {
					app.mobileApp.navigate('#components/activities/add.html');
				}
			},
			//kjhh
			onPrompt: function (results) {
				//alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
				if (results === 3) {
					return;
                }
				if (results === 2) {
					app.notify.showLongBottom(appSettings.messages.registerOption);
					app.mobileApp.navigate('views/signupView.html');
				} else {
					app.notify.showLongBottom(appSettings.messages.signIn);
					app.mobileApp.navigate('#welcome');
				}
			},
			likeClick: function () {
				if (app.isOnline()) {
					var data = app.everlive.data('Activities');
					var attributes = {
						"$push": {
							"Users": app.Users.currentUser.data.Id //liked - user - id
						}
					};
					var filter = {
						'Id': activitiesModel.get('currentItem').Id
					};
					data.rawUpdate(attributes, filter, function (data) {
						app.notify.showLongBottom(appSettings.messages.addedToFavorites);
					}, function (err) {
						app.notify.showLongBottom(appSettings.messages.continueError);
					});
				} else {
					navigator.notification.confirm(
						'First Register or Logon.', // message
						activitiesModel.onPrompt, // callback to invoke
						'Authentication Required', // title
						['Login', 'Register', 'Continue'] // buttonLabels
						//'User Name address ...'                 // defaultText
					);
				}
			},
			deleteClick: function () {
				var dataSource = activitiesModel.get('dataSource'),
					that = this;

				if (!navigator.notification) {
					navigator.notification = {
						confirm: function (message, callback) {
							callback(window.confirm(message) ? 1 : 2);
						}
					};
				}

				navigator.notification.confirm(
					"Are you sure you want to delete this item?",
					function (index) {
						//'OK' is index 1
						//'Cancel' - index 2
						if (index === 1) {
							dataSource.remove(that.currentItem);

							dataSource.one('sync', function () {
								app.mobileApp.navigate('#:back');
							});

							dataSource.one('error', function () {
								dataSource.cancelChanges();
							});

							dataSource.sync();
						}
					},
					'', ["OK", "Cancel"]
				);
			},
			detailsShow: function (e) {
			    var dataSource = activitiesModel.get('dataSource');
				var itemModel;
			    if (e.view.params.partner) {
			        id = e.view.params.partner;
			        itemModel = dataSource.getById(id);
			    }else{
			        var item = e.view.params.uid;					
			        itemModel = dataSource.getByUid(item);
                }
				itemModel.PictureUrl = processImage(itemModel.Picture);

				if (!itemModel.Text) {
					itemModel.Text = String.fromCharCode(160);
				}

				activitiesModel.set('currentItem', null);
				activitiesModel.set('currentItem', itemModel);
				app.adMobService.viewModel.showBannerBottom();
				app.showLoading(true);
			},
			currentItem: null
		});

	parent.set('addItemViewModel', kendo.observable({
		onShow: function (e) {
			// Reset the form data.
			this.set('addFormData', {
				url: '',
				number: '',
				switch: '',
				textField2: '',
				textField3: '',
				textField1: '',
			});
		},
		onSaveClick: function (e) {
			var addFormData = this.get('addFormData'),
				dataSource = activitiesModel.get('dataSource');

			dataSource.add({
				Picture: addFormData.url,
				Value: addFormData.number,
				Active: addFormData.switch,
				Notes: addFormData.textField2,
				Text: addFormData.textField3,
				Title: addFormData.textField1,
			});

			dataSource.one('change', function (e) {
				app.mobileApp.navigate('#:back');
			});

			dataSource.sync();
		}
	}));

	if (typeof dataProvider.sbProviderReady === 'function') {
		dataProvider.sbProviderReady(function dl_sbProviderReady() {
			parent.set('activitiesModel', activitiesModel);
		});
	} else {
		parent.set('activitiesModel', activitiesModel);
	}

	parent.set('onShow', function (e) {
		app.notify.showLongBottom(appSettings.messages.activityFilter);
		var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : {
			logic: 'and', filters: [{
				"field": "UserId",
				"operator": "neq",
				"value": undefined
			}, {
					"field": "Title",
					"operator": "neq",
					"value": 'My Private Feed'
				}]
		}
		if (app.isOnline()) {
			if (e.view.params.ActivityText) {
				app.mobileApp.navigate('views/activitiesView.html?ActivityText=' + e.view.params.ActivityText+'&Text='+e.view.params.Text);// + '&User=' + e.view.params.User );
			} else {
				app.mobileApp.navigate('views/activitiesView.html?public=true');
			}
		} else {
			var d = new Date();
			d.setDate(d.getDate() - 120);
			if ((param === null || param === undefined) && e.view.params.ActivityText && !e.view.params.Text ) {
				param = {
					logic: 'and',
					filters: [{
						"field": "CreatedAt",
						"operator": "gt",
						"value": d
					}, {
							"field": "Title",
							"operator": "startswith",
							"value": e.view.params.ActivityText
						}
					]
				}
			}
		}
		if ((param === null || param === undefined) && e.view.params.ActivityText && e.view.params.Text) {
            nameFilter = {
                logic: 'and',
                filters: [{
                            "field": "CreatedAt",
                            "operator": "gt",
                            "value": d
                        }, {
                            "field": "Title",
                            "operator": "startswith",
                            "value": e.view.params.ActivityText
                        },{
                            "field": 'Text',
                            "operator": 'contains',
                            "value": e.view.params.Text
                        }
                ]
            }
			//app.notify.showShortTop("Filtering by " + e.view.params.Text)
			fetchFilteredData(param);
		}
		else {
			if(e.view.params.ActivityText === 'My Activity Text'){
			//app.notify.showShortTop("Filtering by " + e.view.params.ActivityText)
			fetchFilteredData(param);}
			else{var partnerFilter = {
				field: 'Title',
				operator: 'startswith',
				value: e.view.params.ActivityText
			}
			//app.notify.showShortTop("Filtering by " + e.view.params.ActivityText)
			fetchFilteredData(partnerFilter);}
        }
	})
})(app.activities);
// START_CUSTOM_CODE_activitiesModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_activitiesModel