
var app = app || {};

app.myMaps = (function () {
    'use strict'
    var mapFunctions = (function () {
        var list = function () {
            this.keys = new Array();
            this.data = new Array();
            this.put = function (key, value) {
                if ((!app.isNullOrEmpty(key) || !app.isNullOrEmpty(value)) && this.data[key] === undefined) {
                    this.keys.push(key);
                    this.data[key] = value;
                    try {
                        myCity = value.getPartner().City;
                    }
                    catch (e) {
                        myCity = value.city();
                    }
                }
            };
            this.add = function (key, value) {
                if (this.data[key] === undefined) {
                    this.keys.push(key);
                    this.data[key] = value;
                }
            };
            this.delete = function (key) {
                var state = false;
                for (var i = 0; i < this.keys.length; i++) {
                    if (key === this.keys[i]) {
                        delete this.keys[i];
                        state = true
                        break;
                    }
                }
                return state;
            };
            this.get = function (key) {
                return this.data[key];
            };
            this.remove = function (key) {
                this.keys.remove(key);
                this.data[key] = null;
            };
            this.each = function (fn) {
                if (typeof fn != 'function') {
                    return;
                }
                var len = this.keys.length;
                for (var i = 0; i < len; i++) {
                    var k = this.keys[i];
                    fn(k, this.data[k], i);
                }
            };
            this.entrys = function () {
                var len = this.keys.length;
                var entrys = new Array(len);
                for (var i = 0; i < len; i++) {
                    entrys[i] = {
                        key: this.keys[i],
                        value: this.data[i]
                    };
                }
                return entrys;
            };
            this.array = function () {
                var len = this.keys.length;
                var array = new Array();
                for (var i = 0; i < len; i++) {
                    var key = this.keys[i];
                    if (key !== undefined) {
                        array.push(this.get(key).details());
                    }
                }
                return array;
            };
            this.isEmpty = function () {
                return this.keys.length == 0;
            };
            this.size = function () {
                return this.keys.length;
            };
            this.attribute = function (key, action) {
                switch (action) {
                    case "visible":
                        this.data[key].details().setVisibility("visible");
                        return this.data[key].details().visibility;

                    case "hidden":
                        this.data[key].details().setVisibility("hidden");
                        return this.data[key].details().visibility;

                    case "visibility":
                        return this.data[key].details().visibility;

                    default:
                        return {
                            visible: this.data[key].visibility,
                            isSelectedClass: this.data[key].isSelectedClass
                        };
                }
            }
        };
        var service;
        var placeArray = new list;
        var getDetails =
            function (callback, map, place) {
                service = service || new google.maps.places.PlacesService(map);
                service.getDetails({ placeId: place },
                    function (result, status) {
                        if (status !== google.maps.places.PlacesServiceStatus.OK) {
                            console.error(status);
                            return false;
                        }
                        placeArray.add(place, result);
                        callback(result)
                        return true;
                    }
                )
            };
        return {
            placeArray: placeArray,
            getDetails: getDetails,
        }
    } ());
    return mapFunctions;
} ());