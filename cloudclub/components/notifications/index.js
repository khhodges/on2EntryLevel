'use strict';

app.notifications = kendo.observable({
										 onShow: function() {
										 },
										 afterShow: function() {
										 },
										 PictureUrl: function() {
											 //return app.helper.resolvePictureUrl
											 app.showAlert("5b6663d0-5da6-11e6-80f0-bfe4a34a3bdd");
										 }
									 });

// START_CUSTOM_CODE_notifications
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_notifications
(function(parent) {
	var dataProvider = app.data.defender,
		fetchFilteredData = function(paramFilter, searchFilter) {
			var model = parent.get('notificationsModel'),
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
		flattenLocationProperties = function(dataItem) {
			var propName, propValue,
				isLocation = function(value) {
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
				typeName: 'Notifications',
				dataProvider: dataProvider,
				read:{
						headers:{
								"X-Everlive-Expand": {
											"Reference": {
														"TargetTypeName": "Activities",
														"ReturnAs": "EventDetails",
														"Fields": {
																		"Title":1,"Text":1,"Picture":1
																	}
													}
										}
							}
					}
			},
			sort: { field: 'Date', dir: 'desc' },
			//filter: {field:'Date','gt', new Date.getDate()-10},
			change: function(e) {
				var data = this.data();
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					dataItem['PictureUrl'] =
						processImage(dataItem['Picture']);

					flattenLocationProperties(dataItem);
				}
			},
			error: function(e) {
				if (e.xhr) {
					alert(JSON.stringify(e.xhr));
				}
			},
			schema: {
				model: {
						fields: {
								'Reference': {
											field: 'EventDetails.Title',
											defaultValue: 'xxxxx'
										},
								'Place': {
											field: 'EventDetails.Text',
											defaultValue: 'xxxxx'
										},
								'Picture': {
											field: 'EventDetails.Picture',
											defaultValue: 'xxxxx'
										},
								'ActivityId': {
											field: 'EventDetails.Id',
											defaultValue: 'xxxxx'
										},
								'Date': {
											field: 'CreatedAt',
											defaultValue: 'xxxxx'
										},
							}
					}
			},
			serverFiltering: true,
		},
		dataSource = new kendo.data.DataSource(dataSourceOptions),
		notificationsModel = kendo.observable({
												  dataSource: dataSource,
												  itemClick: function(e) {
													  app.mobileApp.navigate('#components/activities/view.html?ActivityText=' + e.dataItem.Reference);
												  },
												  detailsShow: function(e) {
													  var item = e.view.params.uid,
														  dataSource = notificationsModel.get('dataSource'),
														  itemModel = dataSource.getByUid(item);
													  itemModel.PictureUrl = processImage(itemModel.Picture);

													  if (!itemModel.Reference) {
														  itemModel.Reference = String.fromCharCode(160);
													  }

													  notificationsModel.set('currentItem', null);
													  notificationsModel.set('currentItem', itemModel);
												  },
												  currentItem: null
											  });

	if (typeof dataProvider.sbProviderReady === 'function') {
		dataProvider.sbProviderReady(function dl_sbProviderReady() {
			parent.set('notificationsModel', notificationsModel);
		});
	} else {
		parent.set('notificationsModel', notificationsModel);
	}

	parent.set('onShow', function(e) {
		var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
		fetchFilteredData(param);
	});
})(app.notifications);
// START_CUSTOM_CODE_notificationsModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_notificationsModel