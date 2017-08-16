'use strict';

app.favorites = kendo.observable({
                                     onShow: function () {
                                     },
                                     afterShow: function () {
                                     }
                                 });
//app.localization.registerView('favorites');

// START_CUSTOM_CODE_favorites
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_favorites
(function (parent) {
    //var filterExpression = { "PlaceId": {} };
    var dataProvider = app.data.defender,
    /// start global model properties
    /// end global model properties
        fetchFilteredData = function (paramFilter, searchFilter) {
            var model = parent.get('favoritesModel'),
                dataSource,
                favorites,
                filterFavorites,
                filterArray = [],
                newSearchFilter = {},
                newParamFilter = {},
                finalFilter;
 
            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('favoritesModel_delayedFetch', paramFilter || null);
                return;
            }
            if (app.isOnline()) {
                favorites = app.Users.currentUser.data.Favorites;
            } else {
                app.mobileApp.navigate("#welcome");
            }
 
            filterFavorites = { "Id": { "$in": favorites } };
            filterArray.push(filterFavorites);
 
            if (app.isOnline()) {
                if (paramFilter) {
                    model.set('paramFilter', paramFilter);
                    newParamFilter[paramFilter.field] = { "$regex": ".*" + paramFilter.value + ".*", "$options": "i" };
                    filterArray.push(newParamFilter);
                } else {
                    model.set('paramFilter', undefined);
                }    
                if (searchFilter) {
                    // save searchFilter in the model
                    model.set('searchFilter', searchFilter);
                    newSearchFilter[searchFilter.field] = { "$regex": ".*" + searchFilter.value + ".*", "$options": "i" };
                    filterArray.push(newSearchFilter);
                } else {
                    model.set('searchFilter', undefined);
                }
                finalFilter = { "$and": filterArray};
 
                dataSource.options.transport.read.headers = {
                    "X-Everlive-Filter": JSON.stringify(finalFilter)
                };
 
                return dataSource.read();
            } else {
                app.mobileApp.navigate("#welcome");
            }
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
                typeName: 'Jsonlists',
                dataProvider: dataProvider,
                read: {
                        headers: {
                                //"X-Everlive-Filter": ""
                                //beforeSend: function (xhr) {xhr.headers = { 'X-Everlive-Filter': JSON.stringify(filterExpression) }
                            }
                    }
            },
            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    /// start flattenLocation property
                    flattenLocationProperties(dataItem);
                    /// end flattenLocation property
                }
            },
            error: function (e) {
                if (e.xhr) {
                    var errorText = "";
                    try {
                        errorText = JSON.stringify(e.xhr);
                    } catch (jsonErr) {
                        errorText = e.xhr.responseText || e.xhr.statusText || 'An error has occurred!';
                    }
                    alert(errorText);
                }
            },
            schema: {
                model: {
                        fields: {
                                'PlaceId': {
                                            field: 'PlaceId',
                                            defaultValue: ''
                                        },
                                'Jsonfield': {
                                            field: 'Jsonfield',
                                            defaultValue: ''
                                        },
                            }
                    }
            },
            serverFiltering: true,
            serverSorting: true,
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            },
            serverPaging: true,
            pageSize: 100
        },
    /// start data sources
    /// end data sources
        favoritesModel = kendo.observable({
                                              _dataSourceOptions: dataSourceOptions,
                                              searchChange: function (e) {
                                                  if (e && e.target && e.target.searchVal) {
                                                      var searchVal = e.target.value,
                                                          searchFilter;
                                                      searchFilter = {
                                                          field: 'Jsonfield',
                                                          operator: 'contains',
                                                          value: searchVal
                                                      };
                                                  } else {
                                                      searchFilter = undefined;
                                                  }
                                                  favoritesModel.set('searchFilter', { "Id": { "$in": app.Users.currentUser.data.Favorites } });
                                                  try {
                                                      fetchFilteredData(favoritesModel.get('paramFilter'), searchFilter);
                                                  } catch (e) {
                                                  }
                                              },
                                              fixHierarchicalData: function (data) {
                                                  var result = {},
                                                      layout = {};

                                                  $.extend(true, result, data);

                                                  (function removeNulls(obj) {
                                                      var i, name,
                                                          names = Object.getOwnPropertyNames(obj);

                                                      for (i = 0; i < names.length; i++) {
                                                          name = names[i];

                                                          if (obj[name] === null) {
                                                              delete obj[name];
                                                          } else if ($.type(obj[name]) === 'object') {
                                                              removeNulls(obj[name]);
                                                          }
                                                      }
                                                  })(result);

                                                  (function fix(source, layout) {
                                                      var i, j, name, srcObj, ltObj, type,
                                                          names = Object.getOwnPropertyNames(layout);

                                                      if ($.type(source) !== 'object') {
                                                          return;
                                                      }

                                                      for (i = 0; i < names.length; i++) {
                                                          name = names[i];
                                                          srcObj = source[name];
                                                          ltObj = layout[name];
                                                          type = $.type(srcObj);

                                                          if (type === 'undefined' || type === 'null') {
                                                              source[name] = ltObj;
                                                          } else {
                                                              if (srcObj.length > 0) {
                                                                  for (j = 0; j < srcObj.length; j++) {
                                                                      fix(srcObj[j], ltObj[0]);
                                                                  }
                                                              } else {
                                                                  fix(srcObj, ltObj);
                                                              }
                                                          }
                                                      }
                                                  })(result, layout);

                                                  return result;
                                              },
                                              itemClick: function (e) {
                                                  var dataItem = e.dataItem || favoritesModel.originalItem;

                                                  if (!e.dataItem) {
                                                      return;
                                                  }
                                                  var items = JSON.parse(e.dataItem.Jsonfield);
                                                  try {
                                                      //var isSelected = e.dataItem.get("visibility");
                                                      var newState = items.visibility === "hidden" ? "visible" : "hidden";
                                                      e.dataItem.set("isSelected", newState);
                                                      if (newState === "visible") {
                                                          e.dataItem.set("isSelectedClass", "listview-selected");
                                                          e.dataItem.set("visibility", "visible")
                                                          app.Places.locationViewModel.list.attribute(e.dataItem.vicinity, "visible");
                                                          app.Places.visiting = app.Places.locationViewModel.list.get(e.dataItem.vicinity);
                                                          app.Places.visiting.e = e;
                                                          myCity = e.dataItem.city;
                                                          app.Places.visiting.checkInfoWindow();
                                                      } else {
                                                          e.dataItem.set("isSelectedClass", "");
                                                          e.dataItem.set("visibility", "hidden");
                                                          app.Places.locationViewModel.list.attribute(e.dataItem.vicinity, "hidden");
                                                      }
                                                  } catch (e) {
                                                      JSON.stringify(e)
                                                  }
                                                  app.mobileApp.navigate('#components/favorites/details.html?uid=' + dataItem.uid);
                                              },
                                              detailsShow: function (e) {
			    var dataSource = favoritesModel.get('dataSource');
				var itemModel;
			    if (e.view.params.partner) {
			        id = e.view.params.partner;
			        itemModel = dataSource.getById(id);
			    }else{
			        var item = e.view.params.uid;					
			        itemModel = dataSource.getByUid(item);
                }
				//itemModel.PictureUrl = processImage(itemModel.Picture);

				if (!itemModel.Text) {
					itemModel.Text = String.fromCharCode(160);
				}

				activitiesModel.set('currentItem', null);
				activitiesModel.set('currentItem', itemModel);
				app.adMobService.viewModel.showBannerBottom();
				app.showLoading(true);
                                                  //var uid = e.view.params.uid,
                                                  //    dataSource = favoritesModel.get('dataSource'),
                                                  //    //itemModel = dataSource.getByUid(uid);

                                                  //favoritesModel.setCurrentItemByUid(uid);
                                                  /// start detail form show
                                                  /// end detail form show
                                              },
                                              setCurrentItemByUid: function (uid) {
                                                  var item = uid,
                                                      dataSource = favoritesModel.get('dataSource'),
                                                      itemModel = dataSource.getByUid(item);

                                                  if (!itemModel.Jsonfield) {
                                                      itemModel.Jsonfield = String.fromCharCode(160);
                                                  }

                                                  /// start detail form initialization
                                                  /// end detail form initialization

                                                  favoritesModel.set('originalItem', itemModel);
                                                  favoritesModel.set('currentItem',
                                                                     favoritesModel.fixHierarchicalData(itemModel));

                                                  return itemModel;
                                              },
                                              linkBind: function (linkString) {
                                                  var linkChunks = linkString.split('|');
                                                  if (linkChunks[0].length === 0) {
                                                      return this.get('currentItem.' + linkChunks[1]);
                                                  }
                                                  return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
                                              },
                                              /// start masterDetails view model functions
                                              /// end masterDetails view model functions
                                              currentItem: {}
                                          });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('favoritesModel', favoritesModel);
            var param = parent.get('favoritesModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('favoritesModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('favoritesModel', favoritesModel);
    }

    parent.set('onShow', function (e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = favoritesModel.get('_dataSourceOptions'),
            dataSource;
        if (param || isListmenu) {
            backbutton.show();
            backbutton.css('visibility', 'visible');
        } else {
            if (e.view.element.find('header [data-role="navbar"] [data-role="button"]').length) {
                backbutton.hide();
            } else {
                backbutton.css('visibility', 'hidden');
            }
        }
        //var filterId = {
        //                    "Id": { 
        //                        "$in" : app.Users.currentUser.data.Favorites }}

        //Ajax request using jQuery
        //$.ajax({
        //           url: 'https://api.everlive.com/v1/your-app-id/type-name',
        //           type: "GET",
        //           headers: {
        //        "Authorization" : "3t5oa8il0d0y02eq",
        //        "X-Everlive-Filter" : JSON.stringify(filterId)
        //    },
        //           success: function(data) {
        //               alert(JSON.stringify(data));
        //           },
        //           error: function(error) {
        //               alert("Error "+JSON.stringify(error));
        //           }
        //       });
        dataSource = new kendo.data.DataSource(dataSourceOptions);
        favoritesModel.set('dataSource', dataSource);
        fetchFilteredData(param);
    });
})(app.favorites);

// START_CUSTOM_CODE_favoritesModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
app.favorites.directions = function () {
    if (app.Places.locationViewModel.trip) {
        var myLines = app.Places.locationViewModel.trip.array();
        if (myLines.length > 0) {
            var directions = "/" + app.cdr.address;
            for (var i = 0; i < myLines.length; i++) {
                directions = directions + "/" + myLines[i].vicinity;
            }
            app.openLink("https://www.google.com/maps/dir" + directions.replace(' ', '+'));
            //https://www.google.com/maps/dir/1228+Hillsboro+Mile,+Hillsboro+Beach,+FL+33062/10301+Hagen+Ranch+Rd,+Boynton+Beach,+FL+33437/Morikami+Museum+and+Japanese+Gardens,+4000+Morikami+Park+Rd,+Delray+Beach,+FL+33446
        }
    } else {
        app.notify.showLongBottom("First add some Places to your Trip.")
    }
}
    
app.favorites.openListSheet = function (e) {
    if (!app.Places.locationViewModel.checkSimulator()) {
        for (var i = 0;i < app.favorites.favoritesModel.dataSource.data().length;i++) {
            if (app.favorites.favoritesModel.dataSource.data()[i].Jsonfield.indexOf(e.sender.wrapper.context.getElementsByTagName('h3')[0].innerText) > 0) {
                app.Places.favoriteItem = app.favorites.favoritesModel.dataSource.data()[i];
                break;
            }
        }
        app.favorites.showListSheet({
                                        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                                        'title': appSettings.messages.whatToDo,
                                        'buttonLabels': [
                                            appSettings.messages.list3,
                                            appSettings.messages.list5,
                                            appSettings.messages.list6,
                                            appSettings.messages.list7
                                        ],
                                        'addCancelButtonWithLabel': 'Cancel',
                                        'androidEnableCancelButton': true, // default false
                                        'winphoneEnableCancelButton': true, // default false
                                        //'addDestructiveButtonWithLabel' : 'Delete it'                
                                    });
    } else {
        app.mobileApp.navigate("#components/favorites/View.html");
    }
}
//        list1:"Add to the Map",
//        list2:"Delete From Map",
//        list3:"Visit Home Page",
//        list4:"Show Google Reviews",
//        list5:"Add to Trip",
app.favorites.showListSheet = function (options) {
    if (!app.Places.locationViewModel.checkSimulator()) {
        window.plugins.actionsheet.show(
            options,
            function (buttonIndex) {
                // wrapping in a timeout so the dialog doesn't freeze the app
                setTimeout(function () {
                    switch (buttonIndex) {
                        case 1: // Visit home Page
                            app.helper.openExternalInAppBrowser(app.Places.favoriteItem.Jsonlist.website);
                            break;
                        case 2:// Add to Trip
                            var partnerV = new app.Places.newPartner();
                            partnerV.setTripRow(JSON.parse(app.Places.favoriteItem.Jsonfield));// define as a specific Partner
                            app.Places.addToTrip(partnerV);
                        	break;
                        case 3:// Directions to Trip
                            app.favorites.directions();
                        	break;
                       case 4://Delete Favorite
                               app.showConfirm(appSettings.messages.comfirm,appSettings.messages.title,function(e){
                                   //app.showAlert(JSON.stringify(e));
                                   if(e===1){
                                       app.notify.showLongBottom("This item will be removed.");
                                       app.favorites.favoritesModel.dataSource.remove(app.Places.favoriteItem);
                                       app.favorites.favoritesModel.dataSource.sync();
                                   }
                               });
                           	break;
                        default:
                            //app.notify.showShortTop('You will need to upgrade to use this feature.');
                            break;
                    }
                }, 0);
            }
            );
    }
}
// END_CUSTOM_CODE_favoritesModel