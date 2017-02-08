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
    var filterExpression = { "PlaceId": {} };
    var dataProvider = app.data.defender,
    /// start global model properties
    /// end global model properties
        fetchFilteredData = function (paramFilter, searchFilter) {
            // get the Favorites array and build complex filter
            var favorites = app.Users.currentUser.data.Favorites;
            var favoritesFilterArray = [];
 
            favorites.forEach(function(item) {
                favoritesFilterArray.push({ field: "Id", operator: "eq", value: item });
            });
 
            var favoritesFilter = {
                logic: 'or',
                filters: favoritesFilterArray
            };
            var model = parent.get('favoritesModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('favoritesModel_delayedFetch', paramFilter || null);
                return;
            }

            if (paramFilter) {
                model.set('paramFilter', paramFilter);
            } else {
                model.set('paramFilter', undefined);
            }
            //var asd = {};
            if (app.isOnline()) {
                if (paramFilter && searchFilter) {
                    dataSource.filter({
                                          logic: 'and',
                                          filters: [paramFilter, searchFilter, favoritesFilter]
                                      });
                } else if (paramFilter) {
                    dataSource.filter({
                                          logic: 'and',
                                          filters: [paramFilter, favoritesFilter]
                                      });
                } else if (searchFilter) {
                    dataSource.filter({
                                          logic: 'and',
                                          filters: [searchFilter, favoritesFilter]
                                      });
                } else {
                    dataSource.filter(favoritesFilter);
                }  
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
                                "X-Everlive-Filter": ""
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
                                                  var searchVal = e.target.value,
                                                      searchFilter;

                                                  if (searchVal) {
                                                      searchFilter = {
                                                          field: 'Jsonfield',
                                                          operator: 'contains',
                                                          value: searchVal
                                                      };
                                                  }
                                                  fetchFilteredData(favoritesModel.get('paramFilter'), searchFilter);
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

                                                  app.mobileApp.navigate('#components/favorites/details.html?uid=' + dataItem.uid);
                                              },
                                              detailsShow: function (e) {
                                                  var uid = e.view.params.uid,
                                                      dataSource = favoritesModel.get('dataSource'),
                                                      itemModel = dataSource.getByUid(uid);

                                                  favoritesModel.setCurrentItemByUid(uid);
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
app.favorites.directions = function() {
    var myLines = document.getElementsByClassName("image-with-text");//document.getElementById("myText");
    var directions = "/" + app.cdr.address;
    for (var i = 0;i < myLines.length;i++) {
        directions = directions + "/" + document.getElementsByClassName("image-with-text")[i].innerText.replace("\n", " ").replace("\n", " ").replace("\n", " ").replace("\n", " ").replace("  ", " ");
    }
    app.openLink("https://www.google.com/maps/dir" + directions);
    //1230+Hillsboro+Mile,+Hillsboro+Beach,+FL+33062,+USA/2315+N+Federal+Hwy,+Pompano+Beach,+FL+33062/1940+NE+49th+St,+Pompano+Beach,+FL+33064");
}
// END_CUSTOM_CODE_favoritesModel