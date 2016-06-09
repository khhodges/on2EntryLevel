'use strict';

app.home = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
    var dataProvider = app.data.defender,
		addGeopoint,
		fetchFilteredData = function (paramFilter, searchFilter) {
		    var model = parent.get('homeModel'),
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
		        var avatar = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAgVSURBVHjaxFpbTBRX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'
		        var bavatar = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAI0UExURU1NTU1NTU1N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'
		        var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
		        img = 'data:image/png;base64,' + bavatar;
		    } else
		        if (img.slice(0, 4) !== 'http' &&
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
		        typeName: 'Places',
		        dataProvider: dataProvider
		    },
		    change: function (e) {
		        var data = this.data();
		        for (var i = 0; i < data.length; i++) {
		            var dataItem = data[i];

		            dataItem['ImageUrl'] =
						processImage(dataItem['Image']);

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
		                'Place': {
		                    field: 'Place',
		                    defaultValue: ''
		                },
		                'Address': {
		                    field: 'Address',
		                    defaultValue: ''
		                },
		                'Image': {
		                    field: 'Image',
		                    defaultValue: ''
		                },
		                'Id': {
		                    field: 'Id',
		                    defaultValue: ''
		                },
		            }
		        }
		    },
		    serverFiltering: true,
		},
		dataSource = new kendo.data.DataSource(dataSourceOptions),
		homeModel = kendo.observable({
		    dataSource: dataSource,
		    searchChange: function (e) {
		        var searchVal = e.target.value,
					searchFilter;

		        if (searchVal) {
		            searchFilter = {
		                field: 'Place',
		                operator: 'contains',
		                value: searchVal
		            };
		        }
		        fetchFilteredData(homeModel.get('paramFilter'), searchFilter);
		    },
		    itemClick: function (e) {

		        app.mobileApp.navigate('#components/partners/details.html?uid=' + e.dataItem.uid);

		    },
		    addClick: function () {
		        app.mobileApp.navigate('#components/partners/add.html');
		    },
		    //kjhh
		    likeClick: function () {
		        app.notify.memorize(dataSource.Id);
		    },
		    detailsShow: function (e) {
		        var item = e.view.params.uid,
					dataSource = homeModel.get('dataSource'),
					itemModel = dataSource.getByUid(item);
		        itemModel.ImageUrl = processImage(itemModel.Image);

		        if (!itemModel.Place) {
		            itemModel.Place = String.fromCharCode(160);
		        }

		        homeModel.set('currentItem', null);
		        homeModel.set('currentItem', itemModel);
		    },
		    addShow: function (e) {
		        document.getElementById("Place").innerText = e.view.params.Name;
		    },
		    currentItem: null
		});

    parent.set('addItemViewModel', kendo.observable({
        onShow: function (e) {
            addGeopoint = e.view.params.location;
            //var m = JSON.stringify({
            //    place: e.view.params.Name.replace("%26", "&").replace("%26", "&"),
            //    id: e.view.params.placeId,
            //    www: e.view.params.www,
            //    textField: e.view.params.textField,
            //    longitude: e.view.params.longitude,
            //    latitude: e.view.params.latitude,
            //    email: e.view.params.email,
            //    html: e.view.params.html,
            //    icon: e.view.params.icon,
            //    address: e.view.params.address,
            //    tel: e.view.params.tel,

            //});
            //app.showError(m);
            // Reset the form data.
            this.set('addFormData', {
                place: e.view.params.Name.replace("%26", "&").replace("%26", "&"),
                id: e.view.params.placeId,
                www: e.view.params.www,
                textField: e.view.params.textField,
                longitude: e.view.params.longitude,
                latitude: e.view.params.latitude,
                email: e.view.params.email,
                html: e.view.params.html,
                icon: e.view.params.icon,
                address: e.view.params.address,
                tel: e.view.params.tel,

            });
        },
        onSaveClick: function (e) {
            if (!app.isOnline()) {
                app.notify.showShortTop("Please register and login");
                app.mobileApp.navigate('#welcome');
            } else {
                var addFormData = this.get('addFormData'),
					dataSource = homeModel.get('dataSource');
                //set up filter check 
                var filter = new Everlive.Query();
                filter.where().eq('Place', addFormData.place);
                var x = addFormData.place;
                var filter = new Everlive.Query();
                filter.where().eq('Place', x);

                var data = app.everlive.data('Places');
                data.get(filter)
                    .then(function(data){
                        //alert(JSON.stringify(data));
                        if (data.count === 0) {
                            var longitude = parseFloat(addFormData.longitude);
                            var latitude = parseFloat(addFormData.latitude);
                            var Location = {
                                "longitude": longitude,
                                "latitude": latitude
                            }
                            dataSource.add({
                                PlaceId: addFormData.id,
                                Place: addFormData.place,
                                Website: addFormData.www,
                                Location: Location,
                                Email: addFormData.email,
                                Html: addFormData.html,
                                Icon: addFormData.icon,
                                Description: addFormData.textField,
                                Address: addFormData.address,
                                Phone: addFormData.tel,
                                Createdby: app.Users.currentUser.get('data').Id,
                            });

                            dataSource.one('change', function (e) {
                                app.mobileApp.navigate('#:back');
                            });

                            dataSource.sync();
                            app.notify.memorize(dataSource.Id);
                            app.notify.showShortTop("A new location has been added to your Favourites!");
                        }
                        else {
                            app.notify.memorize(data.result.Id);
                            app.notify.showShortTop("This location has been added to your Favourites!");
                        }
                    },
                    function(error){
                        alert(JSON.stringify(error));
                    });
                //else { alert(JSON.stringify(error)); }
                //    });
                //get filtered data

                //then
                //exists so just like
                //{app.notify.memorize(dataSource.Id);
                // app.notify.showShortTop("The new location has been added to your Favourites!");}
                //otherwise save and like {
                //var longitude = parseFloat(addFormData.longitude);
                //var latitude = parseFloat(addFormData.latitude);
                //var Location = {
                //    "longitude": longitude,
                //    "latitude": latitude
                //}
                //dataSource.add({
                //    PlaceId: addFormData.id,
                //    Place: addFormData.place,
                //    Website: addFormData.www,
                //    Location: Location,
                //    Email: addFormData.email,
                //    Html: addFormData.html,
                //    Icon: addFormData.icon,
                //    Description: addFormData.textField,
                //    Address: addFormData.address,
                //    Phone: addFormData.tel,
                //    CreatedBy: app.Users.currentUser.get('data').Id,
                //});

                //dataSource.one('change', function (e) {
                //    app.mobileApp.navigate('#:back');
                //});

                //dataSource.sync();
                //app.notify.memorize(dataSource.Id);
                //app.notify.showShortTop("The new location has been added to your Favourites!");
                ////end }
                }
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('homeModel', homeModel);
        });
    } else {
        parent.set('homeModel', homeModel);
    }

    parent.set('onShow', function (e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
        if ((param === null || param === undefined) && e.view.params.partner) param = {
            "field": "Place",
            "operator": "contains",
            "value": e.view.params.partner
        };
        fetchFilteredData(param);
    });
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel