/**
 * Application Settings
 */

var appSettings = {

    avatar: "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAgVSURBVHjaxFpbTBRX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",
    bavatar: "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAI0UExURU1NTU1NTU1N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",
    empty1x1png: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=",


    //items:[
    //{
    //		"id":1,
    //		"name":"Banks ",
    //		"list":["bank", "atm"]
    //	},
    //	{
    //		"id":2,
    //		"name":"Business ",
    //		"list":["travel_agency", "roofing_contractor", "plumber", "painter", "locksmith", "lawyer", "laundry", "insurance_agency", "florist", "electrician", "car_wash", "car_repair", "car_dealer", "book_store", "bicycle_store", "beauty_salon", "accounting"]
    //	},
    //	{
    //		"id":3,
    //		"name":"Community ",
    //		"list":["synagogue", "post_office", "police", "park", "museum", "mosque", "local_government_office", "hindu_temple", "funeral_home", "fire_station", "courthouse", "city_hall", "church", "cemetery", "amusement_park"]
    //	},
    //	{
    //		"id":4,
    //		"name":"Education ",
    //		"list":["university", "school", "library", "art_gallery", "aquarium"]
    //	},
    //	{
    //		"id":5,
    //		"name":"Entertainment ",
    //		"list":["zoo", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"]
    //	},
    //	{
    //		"id":6,
    //		"name":"Groceries ",
    //		"list":["grocery_or_supermarket", "bakery"]
    //	},
    //	{
    //		"id":7,
    //		"name":"Health ",
    //		"list":["veterinary_care", "spa", "physiotherapist", "hospital", "hair_care", "gym", "doctor", "dentist"]
    //	},
    //	{
    //		"id":8,
    //		"name":"Restaurant ",
    //		"list":["restaurant", "meal_takeaway", "meal_delivery", "liquor_store", "convenience_store", "cafe", "bar"]
    //	},
    //	{
    //		"id":9,
    //		"name":"Store ",
    //		"list":["store", "shopping_mall", "shoe_store", "pharmacy", "pet_store", "jewelry_store", "home_goods_store", "hardware_store", "furniture_store", "electronics_store", "department_store", "clothing_store"]
    //	},
    //	{
    //		"id":10,
    //		"name":"Travel ",
    //		"list":["transit_station", "train_station", "taxi_stand", "subway_station", "storage", "rv_park", "real_estate_agency", "parking", "moving_company", "lodging", "gas_station", "embassy", "car_rental", "campground", "bus_station", "airport"]
    //	}],

    //products2:[{
    //		"id":1,
    //		"name":"Banks ",
    //		"list":["bank", "atm"]
    //	},
    //	{
    //		"id":2,
    //		"name":"Business ",
    //		"list":["laundry", "florist", "electrician", "book_store", "bicycle_store", "beauty_salon", "accounting"]
    //	},
    //	{
    //		"id":3,
    //		"name":"Community ",
    //		"list":["post_office", "police", "park", "local_government_office", "fire_station", "city_hall"]
    //	},
    //	{
    //		"id":4,
    //		"name":"Education ",
    //		"list":["museum", "university", "zoo", "school", "library", "art_gallery", "aquarium"]
    //	},
    //	{
    //		"id":5,
    //		"name":"Entertainment ",
    //		"list":["amusement_park", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"]
    //	},
    //	{
    //		"id":6,
    //		"name":"Groceries ",
    //		"list":["grocery_or_supermarket", "liquor_store", "convenience_store", "bakery"]
    //	},
    //	{
    //		"id":7,
    //		"name":"Health ",
    //		"list":["pharmacy", "physiotherapist", "hospital", "doctor", "dentist"]
    //	},
    //	{
    //		"id":8,
    //		"name":"Restaurants ",
    //		"list":["restaurant", "meal_takeaway", "meal_delivery", "cafe", "bar"]
    //	},
    //	{
    //		"id":9,
    //		"name":"Store ",
    //		"list":["store", "shopping_mall", "shoe_store", "jewelry_store", "furniture_store", "electronics_store", "department_store", "clothing_store"]
    //	},
    //	{
    //		"id":10,
    //		"name":"Travel ",
    //		"list":["transit_station", "train_station", "taxi_stand", "subway_station", "campground", "bus_station", "airport", "car_rental"]
    //	},
    //	{
    //		"id":11,
    //		"name":"Agencies",
    //		"list":["real_estate_agency", "travel_agency", "real_estate_agency", "insurance_agency", "moving_company"]
    //	},
    //	{
    //		"id":12,
    //		"name":"Legal",
    //		"list":["courthouse", "embassy", "lawyer"]
    //	},
    //	{
    //		"id":13,
    //		"name":"Jobs",
    //		"list":["home_goods_store", "hardware_store", "locksmith", "roofing_contractor", "plumber", "painter", ]
    //	},
    //	{
    //		"id":14,
    //		"name":"Cars",
    //		"list":["gas_station", "car_wash", "car_repair", "car_dealer", "rv_park", "parking", ]
    //	},
    //	{
    //		"id":15,
    //		"name":"Moving",
    //		"list":["moving_company", "storage", "lodging", ]
    //	},
    //	{
    //		"id":16,
    //		"name":"Pets",
    //		"list":["veterinary_care", "pet_store"]
    //	},
    //	{
    //		"id":17,
    //		"name":"Religions",
    //		"list":["hindu_temple", "church", "funeral_home", "cemetery", "mosque", "synagogue", ]
    //	},
    //	{
    //		"id":18,
    //		"name":"Beauty ",
    //		"list":["pharmacy", "spa", "hair_care", "gym"]
    //	}
    //],
    //products:[{
    //		"id":1,
    //		"name":"accounting",
    //		"search":"accounting"
    //	},
    //	{
    //		"id":2,
    //		"name":"airport",
    //		"search":"airport"
    //	},
    //	{
    //		"id":3,
    //		"name":"amusement_park",
    //		"search":"amusement park"
    //	},
    //	{
    //		"id":4,
    //		"name":"aquarium",
    //		"search":"aquarium"
    //	},
    //	{
    //		"id":5,
    //		"name":"art_gallery",
    //		"search":"art gallery"
    //	},
    //	{
    //		"id":6,
    //		"name":"atm",
    //		"search":"atm"
    //	},
    //	{
    //		"id":7,
    //		"name":"bakery",
    //		"search":"bakery"
    //	},
    //	{
    //		"id":8,
    //		"name":"bank",
    //		"search":"bank"
    //	},
    //	{
    //		"id":9,
    //		"name":"bar",
    //		"search":"bar"
    //	},
    //	{
    //		"id":10,
    //		"name":"beauty_salon",
    //		"search":"beauty salon"
    //	},
    //	{
    //		"id":11,
    //		"name":"bicycle_store",
    //		"search":"bicycle store"
    //	},
    //	{
    //		"id":12,
    //		"name":"book_store",
    //		"search":"book store"
    //	},
    //	{
    //		"id":13,
    //		"name":"bowling_alley",
    //		"search":"bowling alley"
    //	},
    //	{
    //		"id":14,
    //		"name":"bus_station",
    //		"search":"bus station"
    //	},
    //	{
    //		"id":15,
    //		"name":"cafe",
    //		"search":"cafe"
    //	},
    //	{
    //		"id":16,
    //		"name":"campground",
    //		"search":"campground"
    //	},
    //	{
    //		"id":17,
    //		"name":"car_dealer",
    //		"search":"car dealer"
    //	},
    //	{
    //		"id":18,
    //		"name":"car_rental",
    //		"search":"car rental"
    //	},
    //	{
    //		"id":19,
    //		"name":"car_repair",
    //		"search":"car repair"
    //	},
    //	{
    //		"id":20,
    //		"name":"car_wash",
    //		"search":"car wash"
    //	},
    //	{
    //		"id":21,
    //		"name":"casino",
    //		"search":"casino"
    //	},
    //	{
    //		"id":22,
    //		"name":"cemetery",
    //		"search":"cemetery"
    //	},
    //	{
    //		"id":23,
    //		"name":"church",
    //		"search":"church"
    //	},
    //	{
    //		"id":24,
    //		"name":"city_hall",
    //		"search":"city hall"
    //	},
    //	{
    //		"id":25,
    //		"name":"clothing_store",
    //		"search":"clothing store"
    //	},
    //	{
    //		"id":26,
    //		"name":"convenience_store",
    //		"search":"convenience store"
    //	},
    //	{
    //		"id":27,
    //		"name":"courthouse",
    //		"search":"courthouse"
    //	},
    //	{
    //		"id":28,
    //		"name":"dentist",
    //		"search":"dentist"
    //	},
    //	{
    //		"id":29,
    //		"name":"department_store",
    //		"search":"department store"
    //	},
    //	{
    //		"id":30,
    //		"name":"doctor",
    //		"search":"doctor"
    //	},
    //	{
    //		"id":31,
    //		"name":"electrician",
    //		"search":"electrician"
    //	},
    //	{
    //		"id":32,
    //		"name":"electronics_store",
    //		"search":"electronics store"
    //	},
    //	{
    //		"id":33,
    //		"name":"embassy",
    //		"search":"embassy"
    //	},
    //	{
    //		"id":34,
    //		"name":"fire_station",
    //		"search":"fire station"
    //	},
    //	{
    //		"id":35,
    //		"name":"florist",
    //		"search":"florist"
    //	},
    //	{
    //		"id":36,
    //		"name":"funeral_home",
    //		"search":"funeral home"
    //	},
    //	{
    //		"id":37,
    //		"name":"furniture_store",
    //		"search":"furniture store"
    //	},
    //	{
    //		"id":38,
    //		"name":"gas_station",
    //		"search":"gas station"
    //	},
    //	{
    //		"id":39,
    //		"name":"grocery_or_supermarket",
    //		"search":"grocery or supermarket"
    //	},
    //	{
    //		"id":40,
    //		"name":"gym",
    //		"search":"gym"
    //	},
    //	{
    //		"id":41,
    //		"name":"hair_care",
    //		"search":"hair care"
    //	},
    //	{
    //		"id":42,
    //		"name":"hardware_store",
    //		"search":"hardware store"
    //	},
    //	{
    //		"id":43,
    //		"name":"hindu_temple",
    //		"search":"hindu temple"
    //	},
    //	{
    //		"id":44,
    //		"name":"home_goods_store",
    //		"search":"home goods store"
    //	},
    //	{
    //		"id":45,
    //		"name":"hospital",
    //		"search":"hospital"
    //	},
    //	{
    //		"id":46,
    //		"name":"insurance_agency",
    //		"search":"insurance agency"
    //	},
    //	{
    //		"id":47,
    //		"name":"jewelry_store",
    //		"search":"jewelry store"
    //	},
    //	{
    //		"id":48,
    //		"name":"laundry",
    //		"search":"laundry"
    //	},
    //	{
    //		"id":49,
    //		"name":"lawyer",
    //		"search":"lawyer"
    //	},
    //	{
    //		"id":50,
    //		"name":"library",
    //		"search":"library"
    //	},
    //	{
    //		"id":51,
    //		"name":"liquor_store",
    //		"search":"liquor store"
    //	},
    //	{
    //		"id":52,
    //		"name":"local_government_office",
    //		"search":"local government office"
    //	},
    //	{
    //		"id":53,
    //		"name":"locksmith",
    //		"search":"locksmith"
    //	},
    //	{
    //		"id":54,
    //		"name":"lodging",
    //		"search":"lodging"
    //	},
    //	{
    //		"id":55,
    //		"name":"meal_delivery",
    //		"search":"meal delivery"
    //	},
    //	{
    //		"id":56,
    //		"name":"meal_takeaway",
    //		"search":"meal takeaway"
    //	},
    //	{
    //		"id":57,
    //		"name":"mosque",
    //		"search":"mosque"
    //	},
    //	{
    //		"id":58,
    //		"name":"movie_rental",
    //		"search":"movie rental"
    //	},
    //	{
    //		"id":59,
    //		"name":"movie_theater",
    //		"search":"movie theater"
    //	},
    //	{
    //		"id":60,
    //		"name":"moving_company",
    //		"search":"moving company"
    //	},
    //	{
    //		"id":61,
    //		"name":"museum",
    //		"search":"museum"
    //	},
    //	{
    //		"id":62,
    //		"name":"night_club",
    //		"search":"night club"
    //	},
    //	{
    //		"id":63,
    //		"name":"painter",
    //		"search":"painter"
    //	},
    //	{
    //		"id":64,
    //		"name":"park",
    //		"search":"park"
    //	},
    //	{
    //		"id":65,
    //		"name":"parking",
    //		"search":"parking"
    //	},
    //	{
    //		"id":66,
    //		"name":"pet_store",
    //		"search":"pet store"
    //	},
    //	{
    //		"id":67,
    //		"name":"pharmacy",
    //		"search":"pharmacy"
    //	},
    //	{
    //		"id":68,
    //		"name":"physiotherapist",
    //		"search":"physiotherapist"
    //	},
    //	{
    //		"id":69,
    //		"name":"plumber",
    //		"search":"plumber"
    //	},
    //	{
    //		"id":70,
    //		"name":"police",
    //		"search":"police"
    //	},
    //	{
    //		"id":71,
    //		"name":"post_office",
    //		"search":"post office"
    //	},
    //	{
    //		"id":72,
    //		"name":"real_estate_agency",
    //		"search":"real estate agency"
    //	},
    //	{
    //		"id":73,
    //		"name":"restaurant",
    //		"search":"restaurant"
    //	},
    //	{
    //		"id":74,
    //		"name":"roofing_contractor",
    //		"search":"roofing contractor"
    //	},
    //	{
    //		"id":75,
    //		"name":"rv_park",
    //		"search":"rv park"
    //	},
    //	{
    //		"id":76,
    //		"name":"school",
    //		"search":"school"
    //	},
    //	{
    //		"id":77,
    //		"name":"shoe_store",
    //		"search":"shoe store"
    //	},
    //	{
    //		"id":78,
    //		"name":"shopping_mall",
    //		"search":"shopping mall"
    //	},
    //	{
    //		"id":79,
    //		"name":"spa",
    //		"search":"spa"
    //	},
    //	{
    //		"id":80,
    //		"name":"stadium",
    //		"search":"stadium"
    //	},
    //	{
    //		"id":81,
    //		"name":"storage",
    //		"search":"storage"
    //	},
    //	{
    //		"id":82,
    //		"name":"store",
    //		"search":"store"
    //	},
    //	{
    //		"id":83,
    //		"name":"subway_station",
    //		"search":"subway station"
    //	},
    //	{
    //		"id":84,
    //		"name":"synagogue",
    //		"search":"synagogue"
    //	},
    //	{
    //		"id":85,
    //		"name":"taxi_stand",
    //		"search":"taxi stand"
    //	},
    //	{
    //		"id":86,
    //		"name":"train_station",
    //		"search":"train station"
    //	},
    //	{
    //		"id":87,
    //		"name":"transit_station",
    //		"search":"transit station"
    //	},
    //	{
    //		"id":88,
    //		"name":"travel_agency",
    //		"search":"travel agency"
    //	},
    //	{
    //		"id":89,
    //		"name":"university",
    //		"search":"university"
    //	},
    //	{
    //		"id":90,
    //		"name":"veterinary_care",
    //		"search":"veterinary care"
    //	},
    //	{
    //		"id":91,
    //		"name":"zoo",
    //		"search":"zoo"
    //	}


    //     ],

    adMob: {
        appId: "com.cloudclub.on2tplatform",
        adMobId: 'ca-app-pub-4526801130933964~1430116934'
    },
    everlive: {
        appId: '3t5oa8il0d0y02eq', // Put your Backend Services API key here
        scheme: 'https'
    },
    views: {
        init: 'index.html',
        noAppId: 'views/noAppIdView.html',
        signUp: 'views/signupView.html',
        users: 'views/usersView.html',
        main: 'views/placesView.html'
    },
    notification: {
        //androidProjectNumber:"389531505311"
        androidProjectNumber: "508581667442"//508581667442
    },
    eqatec: {
        productKey: '3d777b61e0be40f5b61964bb1b05cbbb', // Put your Tekerik Analytics project key here
        version: '1.0.0.0' // Put your application version here
    },

    feedback: {
        apiKey: '3t5oa8il0d0y02eq' // Put your AppFeedback API key here
    },

    facebook: {
        appId: '1408629486049918', // Put your Facebook App ID here
        redirectUri: 'https://www.facebook.com/connect/login_success.html' // Put your Facebook Redirect URI here
    },

    google: {
        clientId: '508581667442-003egcp4sild1bms13n45e342pgsrki5.apps.googleusercontent.com', // Put your Google Cloud Club Client ID here
        redirectUri: 'http://localhost' // Put your Google Redirect URI here
    },

    liveId: {
        clientId: '000000004C10D1AF', // Put your LiveID Client ID here
        redirectUri: 'https://login.live.com/oauth20_desktop.srf' // Put your LiveID Redirect URI here
    },

    adfs: {
        adfsRealm: '$ADFS_REALM$', // Put your ADFS Realm here
        adfsEndpoint: '$ADFS_ENDPOINT$' // Put your ADFS Endpoint here
    },

    spanish: {
        favoritesMessage:"This Place was added to your List of Favorites",
        activityFilter: "Por favor, espere a que los datos seleccionados para cargar ...",
        addedToFavorites: "Has recordado con éxito este lugar en tu lista de favoritos ...",
        autoBlog: "Blog de Auto:",
        broadcast: "El mensaje de difusión pública se envía a los miembros locales del Club de la nube en el área.",
        continueAnonomously: "Usted continuará sin las características de POST de la comunidad de cámara ...",
        continueError: "Error de conexión, por favor continúe ...",
        dataLoad: "Espere a que se carguen los datos más recientes ...",
        directions: "El destino y el inicio son iguales Arrastre el inspector a una nueva ubicación e inténtelo de nuevo!",
        following: "Has recordado este lugar",
        infoWindow: "Esta ventana de investigación de Social Media está personalizada para este lugar, haga clic en cualquier icono para cavar más profundo!",
        inspectorTitle: "Su inspector privado",
        inspectorHelp: "Haga clic en Avatar para iniciar sesión / salir Arrastre el Inspector o busque con <i> <u> Ciudad, Estado </ i>",
        inspectorWindow: "Esta es la ventana de su inspector de cuentas que proporciona investigaciones personales, investigaciones de áreas personalizadas con un feed de contabilización privado!",
        joinMessage: "¡Se ha unido a este Club de Lealtad!",
        language: "¡Seleccionado español!",
        listHelp: "Haga clic en cualquier elemento para revisar la publicación de Google Maps y las calificaciones de estrellas por fecha, luego mantenga o quite del mapa y de esta lista, construya una lista de opciones!",
        loadComments: "Comprobación de comentarios ...",
        logoff: "Ahora está desconectado.",
        mapMessage: "Espere mientras se cargan los datos de la comunidad local ...",
        mapHelp: "Haga clic en cualquier marcador para investigar las redes sociales de la ubicación seleccionada.",
        mapError: "No se puede determinar la ubicación, habilite el servicio de GPS.",
        membership: "Ahora se agrega a CloudClub de este socio!",
        mistSimulatorAlert: "El inicio de sesión social no funciona en el cliente In-Browser, es necesario implementar la aplicación en un dispositivo o ejecutarlo en el simulador del cliente de Windows o Visual Studio.",
        newFavourite: "La ubicación se guardó como un nuevo favorito!",
        notifyMe: "Notificaciones inteligentes",
        registrationHelp: "Lea las notas y marque 'Estoy de acuerdo', rellene todos los campos. Puede actualizar su Avatar actualizando su configuración en cualquier momento ...",
        registerOption: "Si se registra e inicia sesión todas las características de POST de la comunidad están disponibles ...",
        register: "El registro permite el acceso a la cámara de publicación y otras características de la comunidad y la notificación.",
        registeredOK: "Usted se ha registrado con éxito para las notificaciones locales.",
        registration: "¡Enhorabuena, ya está registrado para usar CloudClub",
        rememberMe: "Recuérdeme:",
        removeActivityConfirm: "Se eliminará esta actividad .. Esta acción no se puede deshacer.",
        removeActivityTitle: "Eliminar actividad POST",
        removeMessage: "Elimine undeway, por favor espere para volver a la lista actualizada ...",
        saved: "Elemento guardado",
        savedAvatar: "Actualización guardada, se necesita tiempo para almacenar en caché la nueva imagen a través de Internet!",
        searchAgain: "Siempre puedes buscar en el área del mapa expuesto un nombre de lugar o para 20 surgestions cualquier término, como comida, pizza, policía, iglesia o escuela!",
        sent: "Mensaje enviado ...",
        settingsMessage: "Puede actualizar cualquier elemento que incluya o excluya el Avatar",
        share: "Compartir opciones ahora cargando ...",
        signIn: "Por favor, inicie sesión ...",
        tryAgain: "Por favor, inténtelo de nuevo ...",
        update: "Actualización correctamente",
        updating: "Subiendo elementos, por favor espere ...",
        url: "Apertura de los medios de comunicación, haga clic en Hecho X para devolver ...",
        wait: "Espere ...",
        welcome: "\nPor favor, disfrute de esta aplicación móvil avanzada con acceso comunitario a medios sociales integrados y personalizados. \nNo es necesario iniciar sesión para buscar en las redes sociales y encontrar puntos de acceso locales o encontrar actividades comunitarias. \nPara POST y funciones avanzadas, Y las notificaciones instantáneas que necesita para unirse y iniciar sesión Ayuda adicional se encuentra en http://www.on2see.com \ n \ n "
    },
    messages: {    },
    portuguese: {
        favoritesMessage:"This Place was added to your List of Favorites",
        autoBlog: "Auto Blog:",
        following: "Você se lembrou deste lugar",
        inspectorTitle: "Seu Inspetor Privado",
        notifyMe: "Notificações Inteligentes",
        rememberMe: "Recorde-me:",
        settingsMessage: "Você pode atualizar quaisquer itens incluindo ou excluindo o Avatar",
        activityFilter: "Aguarde para os dados selecionados para carregar...",
        addedToFavorites: "Você tem sucesfully recordar este lugar na sua lista de favoritos...",
        broadcast: "Público Mensagem de Broadcast é enviado para os membros do Clube da nuvem local na área.",
        continueAnonomously: "Você continuará sem a câmara comunidade Post dispõe de...",
        continueError: "Erro de conexão, continue...",
        dataLoad: "Aguarde para os dados mais recentes para carregar...",
        directions: "o destino e iniciar são os mesmos. Arraste o inspector para alguns nova localização e tente novamente!",
        infoWindow: "Esta janela de pesquisa de mídia social é personalizado para este lugar, clique em qualquer ícone refunda!",
        inspectorHelp: "Arraste para realocar ou pesquisar em todo o mundo para um <i><u>Cidade,Estado</u>.</i>",
        inspectorWindow: "Esta é a janela do Inspetor de sua conta pessoal de investigação, área personalizada investigações com uma casa de destacamento alimentação!",
        joinMessage: "Você ingressou esta fidelidade Club!",
        language: "Português selecionado - este é um recurso de teste Beta, por favor agitar sobre erros e enviar feedback, graças!",
        listHelp: "Clique em qualquer item para rever o mapa do Google destacamento e classificações de estrelas por data, então quer manter ou remover do mapa e esta lista, a construção de uma lista restrita de opções!",
        loadComments: "Verificação para observações ...",
        logoff: "Agora você está desconectado.",
        mapMessage: "Aguarde enquanto a comunidade local está carregado de dados...",
        mapHelp: "Clique em um marcador para a investigação social media para o local selecionado.",
        mapError: "Incapaz de determinar Localização, ative o serviço de GPS.",
        membership: "Você são agora adicionados a este parceiro CloudClub!",
        mistSimulatorAlert: "login social não\'t o trabalho no cliente In-Browser, que você precisa para implantar o aplicativo a um dispositivo ou executá-lo no simulador do cliente Windows ou Visual Studio.",
        newFavourite: "A localização foi salva como um novo favorito!",
        registrationHelp: "Notas de Leitura e verificar 'concordo', preencha todos os campos. Você pode atualizar o seu avatar por atualizar suas configurações a qualquer momento...",
        registerOption: "Se você registrar e login todas as comunidade POST recursos estão disponíveis...",
        register: "Registo permite o acesso à câmara destacamento e outra comunidade e recursos de notificação.",
        registeredOK: "Você tem sucesfully registada para notificações locais.",
        registration: "Parabéns! Agora você está registrado para usar CloudClub",
        removeActivityConfirm: "Esta actividade será suprimido. Esta ação não pode ser desfeita.",
        removeActivityTitle: "Excluir post actividade",
        removeMessage: "Extracção undeway, aguarde para voltar para a lista atualizada...",
        saved: "Item guardado",
        savedAvatar: "Atualizar salvo, ele leva tempo para armazenar em cache a nova imagem através da Internet!",
        searchAgain: "Você pode sempre pesquisar a área do mapa exposta para um nome de local ou para 20 surgestions qualquer prazo, como alimentos, pizza, polícia, igreja ou escola!",
        sent: "Mensagem enviada ...",
        share: "Opções de compartilhamento de carga agora...",
        signIn: "Assine...",
        tryAgain: "Tente novamente...",
        update: "Actualização bem sucedida",
        updating: "Carregar itens, aguarde...",
        url: "Abertura de mídia, clique em 'Done' ou 'X' para retornar...",
        wait: "Aguarde...",
        welcome: "\nPor favor desfrute este aplicativo móvel avançada com a Comunidade o acesso à mídia social integrada e personalizada.\nNenhum login é necessário para pesquisar em toda a mídia social e localizar hotspots so encontrar actividades comunitárias. Para postagem e recursos avançados, clubes de fidelidade e adesão notificações instantâneas de que você precisa para se juntarem e fazer o logon. \nAjuda adicional é encontrada na Http://www.on2see.com \n\n"
    },
    german: {
        favoritesMessage:"This Place was added to your List of Favorites",
        autoBlog: "Auto Blog:",
        following: "You have remembered this place.",
        inspectorTitle: "Your Private Inspector",
        notifyMe: "Smart Notifications",
        rememberMe: "Remember Me:",
        settingsMessage: "You can update any items including or excluding the Avatar.",
        activityFilter: "Bitte warten Sie, bis die ausgewählten Daten zu laden...",
        addedToFavorites: "Sie haben erfolgreich an dieser Stelle in die Liste ihrer Favoriten...",
        broadcast: "öffentliche Nachricht an lokale Cloud Club Mitglieder in der Region.",
        continueAnonomously: "Sie werden fortfahren, ohne die Kamera die Post mit...",
        continueError: "Connection error, bitte...",
        dataLoad: "Bitte warten Sie, bis die neuesten Daten zum Laden...",
        directions: "das Ziel und Start sind die gleichen. Ziehen Sie die Prüfer auf einige neue Lage, und versuchen Sie es erneut!",
        infoWindow: "Das Social Media research Fenster ist speziell für diesen Ort, klicken Sie auf ein Symbol, tiefer!",
        inspectorHelp: "Ziehen Sie die Maus, um sie zu verlegen oder suchen Sie weltweit für ein <i><u>Stadt,State</u>.</i>",
        inspectorWindow: "dieses ist Ihr Konto Inspektorfenster persönliche Forschung, benutzerdefinierte Bereich Untersuchungen mit einer privaten Buchung feed!",
        joinMessage: "Sie haben sich diese Loyalität Club!",
        language: "Deutsch ausgewählt - dies ist eine Beta-Funktion im Test, Bitte schütteln Sie auf Fehler, Feedback zu geben, vielen Dank!",
        listHelp: "Klicken Sie auf ein Element, um Google Map und die Sterne nach Datum, dann entweder behalten oder entfernen Sie die Karte aus, und diese Liste, die eine engere Auswahl von Optionen!",
        loadComments: "Prüfung für Kommentare ...",
        logoff: "Sie sind jetzt abgemeldet.",
        mapMessage: "Bitte warten Sie, während die lokale Die Daten werden geladen...",
        mapHelp: "Klicken Sie auf eine Markierung, die Forschung Social Media für den ausgewählten Standort.",
        mapError: "Nicht in der Lage zu bestimmen, aktivieren Sie den GPS-Dienst.",
        membership: "Sie sind nun zu dieser Partner ist CloudClub!",
        mistSimulatorAlert: "Die soziale Login doesn\'t im in-browser Client, die Sie benötigen, um die Anwendung zu einem Gerät, oder um es in den Simulator der Windows Client oder Visual Studio.",
        newFavourite: "Die Lage war Als neuer Favorit!",
        registrationHelp: "Noten lesen, und aktivieren Sie das Kontrollkästchen 'Ich stimme zu', füllen Sie alle Felder aus. Sie können Aktualisieren Sie Ihren Avatar durch Aktualisieren der Einstellungen jederzeit...",
        registerOption: "wenn Sie sich registrieren und anmelden Alle POST-Funktionen stehen...",
        register: "Registrierung ermöglicht den Zugriff auf die Kamera und andere Gemeinschaft und Benachrichtigungsfunktionen.",
        registeredOK: "Sie haben sich erfolgreich registriert für lokale Benachrichtigungen.",
        registration: "Herzlichen Glückwunsch! Sie sind nun registriert, verwenden Sie CloudClub",
        removeActivityConfirm: "diese Aktivität wird gelöscht. Diese Aktion kann nicht rückgängig gemacht werden kann.",
        removeActivityTitle: "Post löschen",
        removeMessage: "Ausbau statt, bitte warten, um auf die aktualisierte Liste...",
        saved: "gespeichert",
        savedAvatar: "Update gespeichert, es braucht Zeit, um das neue Bild-cache über das Internet!",
        searchAgain: "Sie können jederzeit nach der exponierten Lage für einen Ortsnamen oder für 20 Vorschläge ein, wie Essen, Pizza, Polizei, Kirche oder Schule!",
        sent: "Nachricht",
        share: "Share options Jetzt laden...",
        signIn: "Bitte melden Sie sich an...",
        tryAgain: "Bitte versuchen Sie es erneut...",
        update: "Update erfolgreich",
        updating: "Hochladen, bitte warten Sie...",
        url: "Eröffnung Medien zu senden, klicken Sie auf 'Done' oder 'X', um...",
        wait: "Bitte warten...",
        welcome: "\nBitte genießen Sie diese erweiterte mobile Anwendung mit den Zugriff auf integrierte und maßgeschneiderte social media.\nKeine Anmeldung erforderlich ist, um eine Suche über Social Media und finden Sie lokale Hot Spots os finden Sie Tätigkeiten der Gemeinschaft. Für POST-ing und erweiterte Funktionen, die treue Mitgliedschaft Vereine und sofortige Benachrichtigungen müssen Sie auf und melden Sie sich an. \nWeitere Hilfe finden Sie unter Http://www.on2see.com \n\n"
    },
    french: {
        favoritesMessage:"This Place was added to your List of Favorites",
        autoBlog: "Auto Blog:",
        following: "You have remembered this place.",
        inspectorTitle: "Your Private Inspector",
        notifyMe: "Smart Notifications",
        rememberMe: "Remember Me:",
        settingsMessage: "You can update any items including or excluding the Avatar.",
        activityFilter: "Veuillez attendre que les données sélectionnées à charger...",
        addedToFavorites: "Vous avez réussi à me souvenir de cette place dans votre liste de favoris...",
        broadcast: "Message de diffusion publique est envoyée aux membres du Club de nuages dans la région.",
        continueAnonomously: "Vous allez continuer sans la collectivité après...",
        continueError: "Erreur de connexion, veuillez continuer...",
        dataLoad: "Attendez les dernières données à charger...",
        directions: "La destination et le démarrage sont les mêmes. Faites glisser l'inspecteur pour certains nouvel emplacement et essayez à nouveau !",
        infoWindow: "cette fenêtre de recherche médias sociaux est personnalisé pour cet endroit, cliquez sur une icône pour aller plus loin !",
        inspectorHelp: "Faites glisser pour déplacer ou recherchez dans le monde entier pour une  <i > <u >City State </u >. </i >",
        inspectorWindow: "il s'agit de votre compte fenêtre inspecteur fournissant des recherches personnelles, des enquêtes de régions personnalisées avec un affichage privé !",
        joinMessage: "Vous avez rejoint ce club de fidélité !",
        language: "Français sélectionné - c'est un beta test en fonction, veuillez secouer sur les erreurs afin de fournir de la rétroaction, merci !",
        listHelp: "La souris sur n'importe quel élément d'examiner la carte Google de l'affichage et le nombre d'étoiles par date, alors soit maintenir ou retirer de la carte et cette liste, la construction d'une liste d'options !",
        loadComments: "Contrôle d'observations ...",
        logoff: "Vous êtes maintenant déconnecté.",
        mapMessage: "Veuillez patienter pendant que l'échelle locale Les données communautaires est chargé...",
        mapHelp: "Cliquez sur recherche d'un feutre pour les médias sociaux pour l'emplacement sélectionné.",
        mapError: "Impossible de déterminer l'emplacement, veuillez activer service GPS.",
        membership: "Vous êtes maintenant ajouté à cette CloudClub partenaire !",
        mistSimulatorAlert: "Le social login ne fonctionne pas dans le In-Browser Client, vous avez besoin pour déployer l'application sur un périphérique, ou de l'exécuter dans le simulateur du client Windows ou Visual Studio.",
        newFavourite: "L'emplacement a été enregistré comme un nouveau favori !",
        registrationHelp: "Lire les notes et cochez l'option 'J'accepte', remplir tous les champs. Vous pouvez mettre à jour votre avatar en mettant à jour vos paramètres à tout moment...",
        registerOption: "Si vous inscrire et vous connecter tous les postes de la communauté sont les fonctions disponibles...",
        register: "Enregistrement permet l'accès à l'affichage de l'appareil photo et d'autres fonctions de notification et de la communauté.",
        registeredOK: "Vous avez enregistré avec succès pour les notifications locales.",
        registration: "Félicitations ! Vous êtes maintenant inscrit à CloudClub",
        removeActivityConfirm: "Cette activité sera supprimé. Cette action ne peut pas être annulée.",
        removeActivityTitle: "Supprimer",
        removeMessage: "Activité après dépose en cours, veuillez patienter pour revenir à la liste mise à jour...",
        saved: "point",
        savedAvatar: "Mise à jour enregistré enregistré, il faut du temps pour mettre en cache la nouvelle image sur Internet !",
        searchAgain: "Vous pouvez toujours rechercher la carte exposée pour un nom de lieu ou de 20 suggestions tout terme, comme la nourriture, des pizzas, de la police, l'église ou l'école !",
        sent: "Message envoyé ...",
        share: "stock-options maintenant loading...",
        signIn: "Veuillez ouvrir...",
        tryAgain: "s'il vous plaît essayer à nouveau...",
        update: "Mise à jour réussie",
        updating: "Téléchargement d'articles, veuillez patienter...",
        url: "L'ouverture de media, cliquez sur 'DONE' ou 'X' pour revenir...",
        wait: "Veuillez patienter...",
        welcome: "\nS'il vous plaît profiter de cette application mobile avec l'accès de la communauté aux médias sociaux intégré et personnalisé.Pas de login est nécessaire pour effectuer une recherche sur les médias sociaux et trouver des lieux populaires os trouver des activités communautaires. \nPour poster-ing et des fonctionnalités avancées, la loyauté des membres de clubs et de notifications instantanées vous devez Inscrivez-vous et connectez-vous. \nUne aide supplémentaire est disponible à l http://www.on2see.com \n\n"

    },
    dutch: {
        favoritesMessage:"This Place was added to your List of Favorites",
        autoBlog: "Auto Blog:",
        following: "You have remembered this place.",
        inspectorTitle: "Your Private Inspector",
        notifyMe: "Smart Notifications",
        rememberMe: "Remember Me:",
        settingsMessage: "You can update any items including or excluding the Avatar.",
        activityFilter: "Wacht tot de geselecteerde data te laden ...",
        addedToFavorites: "U heeft met succes herinnerde deze plaats in je lijst met favorieten ...",
        broadcast: "Public Broadcast bericht wordt in het gebied aan de lokale Cloud Club leden gestuurd.",
                continueAnonomously: "U blijft zonder dat de camera gemeenschap POST features ...",
                continueError: "Connection error, ga dan verder ...",
        dataLoad: "Wacht tot de meest recente gegevens te laden ...",
        directions: "De bestemming en start zijn hetzelfde Sleep de inspecteur om een ​​aantal nieuwe locatie en probeer het opnieuw.",
                infoWindow: "Dit onderzoek venster Social Media is aangepast voor deze plaats, klikt u op een pictogram om dieper te graven! ",
                inspectorTitle: "Your Private Inspector",
                inspectorHelp: "Klik Avatar in te loggen / Sleep Inspector of zoek met behulp van <i> <u> City, State </ u> </ i>..",
                inspectorWindow: "Dit is uw account inspecteur raam het verstrekken van persoonlijke onderzoek, aangepast gebied onderzoeken met een besloten post-feed!",
                joinMessage: "Je hebt aangesloten bij deze Loyalty Club!",
        language: "Nederlands geselecteerd!",
                listHelp: "Klik op een item om te beoordelen Google Map detachering en ster ratings op datum, vervolgens te houden of te verwijderen uit de kaart en deze lijst, het bouwen van een shortlist van opties!",
        loadComments: "Controle for Comments ...",
        logoff: "Je bent nu afgemeld. ",
                mapMessage: "Even geduld terwijl de lokale gemeenschap data wordt geladen ...",
                mapHelp: "Klik op een marker om social media onderzoek voor de geselecteerde locatie.",
                mapError: "Kan locatie te bepalen, schakelt u GPS-dienst.",
        membership: "Je bent nu toegevoegd aan CloudClub van deze partner!",
                mistSimulatorAlert: ". De sociale login doet \ 't werk in de In-Browser Client, moet u de app om een ​​apparaat in te zetten, of uit te voeren in de simulator van de Windows Client of Visual Studio",
                newFavourite: "De locatie is opgeslagen als een nieuwe Favoriet!",
                registrationHelp: "Lees notes en check 'Ik ga akkoord', vult u alle velden U kunt uw Avatar te werken door het bijwerken van uw instellingen op elk gewenst moment ....",
                registerOption: "Als je registreren en inloggen alle comunity POST functies beschikbaar zijn ...",
                register: "Registratie geeft toegang tot de camera Posting en andere gemeenschap en kennisgeving functies.",
                registeredOK: "U heeft sucesfully geregistreerd voor lokale meldingen.",
        registration: "Gefeliciteerd U bent nu geregistreerd voor CloudClub gebruiken",
                rememberMe: "Remember Me",
        removeActivityConfirm: "Deze activiteit wordt verwijderd Deze actie kan niet ongedaan gemaakt worden..",
                removeActivityTitle: "Delete POST Activity",
                removeMessage: "Removal undeway, dan kunt u wachten om terug te keren naar de bijgewerkte lijst ...",
        saved: "Item gered",
                savedAvatar: "update gered, het kost tijd om de nieuwe afbeelding cache via het internet",
                searchAgain: "Je kunt altijd het blootgestelde gebied op de kaart zoeken naar een plaatsnaam of 20 surgestions enige termijn, zoals voedsel, pizza, politie, kerk of school!",
        sent: "Bericht verzonden ...",
        settingsMessage: "Je kunt actualiseren items inclusief of exclusief de Avatar",
        share: "Aandelenopties nu laden ...",
                signIn: "Log in ...",
                tryAgain: "Probeer het opnieuw ...",
                update: "Werk succesvol",
                updating: "Het uploaden van items, even geduld ...",
                url: "Het openen van media, klikt u op 'OK' of 'X' om terug te keren ...",
        wait: "Even geduld ...",
        welcome: "\n Controleer genieten van deze geavanceerde mobiele applicatie met de gemeenschap toegang tot geïntegreerde en op maat social media. \n Geen login nodig is om te zoeken in sociale media en vinden de lokale Hot Spots of vind maatschappelijke activiteiten \ Nfor detachering en geavanceerde functies, loyaliteit clubs lidmaatschap.. en directe meldingen die u nodig hebt aan te sluiten en meld u aan. Extra hulp is te vinden op http://www.on2see.com \n \n "
    },
    english: {
        help:"\nNothing in your list....\n\nYou can do any of the following:\n 1. Return to map by clicking BACK and using the search box to find any of the following.\na) Text query search, 'Pizza' or 'Pizza near Nashville'.\nb) Place search usinga comma to include a Street,City,State and or a Country, like 'London, UK'.\nc) A WebSite using a normal format ending in .com or .net etc.",
        comfirm: "Are you sure?",
        title:"Confirm Delete",
        serviceL1:"Free Membership",
        myMedia:"Selecting more than 8 options depends on screen size and service level. More options are available if you upgrade your service level.",
        removeQuestion:"Do you want to remove ",
        removeTitle:"Remove Place",
        saveHighlight:"Highlight set as a Red Star on map!\n\nClick TRIP to add this place to your trip list? or...\n\nClick FAVORITE to add this place in your Favorites list?",
        list1:"Add to the Map",
        list2:"Delete From Map",
        list3:"Visit Home Page",
        list4:"Show Google Reviews",
        list5:"Add to Trip",
        list6:"Show Your Trip Directions",
        list7:"Delete this item?",
        whatToDo:'What do you want to do?',
        mapList1:'Show List of Places',
        mapList2:'Refresh Current Location',
        mapList3:'Keep the Top Places',
        mapList4:'Change your service level',
        mapList5:'Show Saved Favorites',
        mapList6:'Show Your Trip Directions',
        favoritesMessage:"This Place was added to your List of Favorites",
        activityFilter: "Please wait for the selected data to load...",
        addedToFavorites: "You have succesfully remembered this place in your favorites list...",
        autoBlog: "Auto Blog:",
        broadcast: "Public Broadcast Message is sent to local Cloud Club Members in the area.",
        continueAnonomously: "You will continue without the camera community POST features...",
        continueError: "Connection error, please continue...",
        dataLoad: "Please wait for the latest data to load...",
        directions: "The destination and start are the same. Drag the inspector to some new location and try again!",
        following: "You have remembered this place",
        infoWindow: "This Social Media research window is customized for this place, click any icon to dig deeper!",
        inspectorTitle: "Search Options",
        inspectorHelp: "Click Avatar to log in/out. Drag Inspector or search using <i><u>City, State</u>.</i>",
        inspectorWindow: "This is your account inspector window providing personal research, custom area investigations with a private posting feed!",
        joinMessage: "You have joined this Loyalty Club!",
        language: "English selected!",
        listHelp: "Click or swipe any item to review Google Map posting, add to or see trip and check star ratings by date, then click HIGHLIGHT to either keep or remove from the map and this list, building a shortlist of options!",
        loadComments: "Checking for Comments ...",
        logoff: "You are now logged out.",
        mapMessage: "Please wait while the local community data is loaded...",
        mapHelp: "Click any marker to research social media for the selected location.",
        mapError: "Unable to determine location, please enable GPS service.",
        membership: "You are now added to this partner's CloudClub!",
        mistSimulatorAlert: "The social login doesn\'t work in the In-Browser Client, you need to deploy the app to a device, or run it in the simulator of the Windows Client or Visual Studio.",
        newFavourite: "The location was saved as a new Favourite!",
        notifyMe: "Smart Notifications",
        registrationHelp: "Read notes and check 'I agree', fill all fields. You can update your Avatar by updating your settings at any time...",
        registerOption: "If you register and login all the comunity POST features are available...",
        register: "Registration enables access to camera Posting and other community and notification features.",
        registeredOK: "You have sucesfully registered for local notifications. ",
        registration: "Congratulations! You are now registered to use CloudClub",
        rememberMe: "Remember Me:",
        removeActivityConfirm: "This activity will be deleted. This action can not be undone.",
        removeActivityTitle: "Delete POST Activity",
        removeMessage: "Removal undeway, please wait to return to the updated list...",
        saved: "Item saved",
        savedAvatar: "Update saved, it takes time to cache the new image across the Internet!",
        searchAgain: "You can always search the exposed map area for a place name or for 20 suggestions any time, like food, pizza, police, church or school!",
        sent: "Message sent ...",
        settingsMessage: "You can update any items including or excluding the Avatar",
        share: "Share options now loading...",
        signIn: "Please sign in...",
        tryAgain: "Please try again...",
        update: "Thank You! Update successful, you will be contacted for any listed charges.",
        updating: "Uploading items, please wait...",
        url: "Opening media, click 'Done' or 'X' to return...",
        wait: "Please wait...",
        welcome: "\nPlease enjoy this advanced mobile application with community access to integrated and customized social media.\nNo login is needed to search across social media and find local Hot Spots or find community activities. \nFor POSTing and advanced features, loyalty clubs membership and instant notifications you need to Join Up and log on. Additional help is found at http://www.on2see.com \n\n"
    },
    userOptions: {
        "product": "On2See partners urls",
        "version": 1.1,
        "releaseDate": "2016-09-19T00:00:00.000Z",
        "approved": true,
        "partner": {
            "stars": "5",
            "rating": "$$",
            "autoBlog": false,
            "rememberMe": true
        },
        "url": [
            {
                "name": "facebook",
                "icon": "styles/images/default-image.jpg",
                "path": "https://www.facebook.com/muddywatersrestaurant",
                "selected": true
            },
            {
                "name": "yelp",
                "icon": "styles/images/default-image.jpg",
                "path": "https://www.yelp.com/biz/jbyrds-muddy-waters-deerfield-beach",
                "selected": false
            },
            {
                "name": "instagram",
                "icon": "styles/images/default-image.jpg",
                "path": "https://www.instagram.com/explore/locations/1579177/",
                "selected": false
            },
            {
                "name": "googleMaps",
                "icon": "styles/images/default-image.jpg",
                "path": "https://www.google.com/maps/place/JByrd%27s+Muddy+Waters+Restaurant+%26+Raw+Bar/@26.31823,-80.1360707,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x79892be93ef49914!8m2!3d26.31823!4d-80.133882",
                "selected": true
            },
            {
                "name": "twitter",
                "icon": "",
                "Path": "",
                "selected": true
            },
            {
                "name": "bing",
                "icon": "",
                "Path": "",
                "selected": false
            },
            {
                "name": "notifications",
                "icon": "",
                "Path": "",
                "selected": false
            },
            {
                "name": "iSee",
                "icon": "",
                "Path": "",
                "selected": true
            },
            {
                "name": "redbubble",
                "icon": "",
                "Path": "",
                "selected": true
            }
        ],
        "defaultOptions": {
            "standard": [
                "notifications",
                "activities",
                "partner",
                "follow"
            ],
            "search": [
                "google",
                "twitter",
                "bing",
                "googleMaps"
            ],
            "food": [
                "zomato",
                "yelp"
            ],
            "display": [
                "search",
                "food"
            ],
            "professional": [
                "angiesList",
                "homeAdviser",
                "pintrest",
                "linkedIn"
            ]
        },
        "customOptions": [
            "iSee",
            "notifications",
            "zomato",
            "yelp",
            "google",
            "twitter",
            "bing",
            "googleMaps"
        ]
    },
    infoContent: {
        "redbubble": "<a id='redbubble' data-role='button' class='butn' style='padding:5px' data-url='http://www.redbubble.com'><img src='styles/images/rbtext.jpg' alt='RedBubble' height='auto' width='20%'/></a>",
        "events": "<a id='events' data-role='button' class='butn' style='padding:5px' data-url='http://www.sipantic.net/notifications/calendarView.html'><img src='styles/images/events.jpg' alt='Events' height='auto' width='20%'/></a>",
        "iSee": "<a id='iSee' data-role='button' class='butn' style='padding:5px'><img src='styles/images/iSee.png' alt='iSee' height='auto' width='20%'/></a>",
        "follow": "<a id='iSee' data-role='button' class='butn' style='padding:5px'><img src='styles/images/follow.png' alt='follow' height='auto' width='20%'/></a>",
        "camera": "<a id='camera' data-role='button' class='butn' style='padding:5px'> <img src='styles/images/camera.png' alt='cameraLink' height='auto' width='20%'></a>",        
        "favorites": "<a id='favorites' data-role='button' class='butn' style='padding:5px'> <img src='styles/images/favorites.png' alt='favoritesLink' height='auto' width='19%'></a>",        
        "schedule": "<a id='schedule' data-role='button' class='butn' style='padding:5px'> <img src='styles/images/confirm.png' alt='confirm' height='auto' width='20%'></a>",        
        "remind": "<a id='offer' data-role='button' class='butn' style='padding:5px'> <img src='styles/images/offer.png' alt='offer' height='auto' width='20%'></a>",        
        "notifications": "<a id='notifications' data-role='button' class='butn' style='padding:5px'><img src='styles/images/notifications.png' alt='notifications' height='auto' width='20%'/></a>",
        "goHome": "<a id='goHome' data-role='button' data-lat=#lat# data-lng=#lng#class='butn' style='padding:5px'><img src='styles/images/goHome.png' alt='google' height='auto' width='20%'/></a>",
        "facebook": "<a id='facebook' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/facebook.png' alt='facebook' height='auto' width='20%'/></a>",
        "yelp": "<a id='yelp' data-role='button' class='butn' style='padding:5px' data-url='https://m.yelp.com/search?find_loc=#:city#+#:state#'><img src='styles/images/yelp.png' alt='yelp' height='auto' width='20%'/></a>",
        "instagram": "<a id='instagram' data-role='button' class='butn' style='padding:5px' data-url='http://www.instagram.com/#:STATE#/' ><img src='styles/images/instagram.png' alt='instagram' height='auto' width='20%'/></a>",
        "nfl": "<a id='nfl' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/nfl.png' alt='nfl' height='auto' width='20%'/></a>",
        "zomato": "<a id='zomato' data-role='button' class='butn' style='padding:5px data-url='http''><img src='styles/images/zomato.png' alt='zomato' height='auto' width='20%'/></a>",
        "ESPN": "<a id='ESPN' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/ESPN.png' alt='ESPN' height='auto' width='20%'/></a>",
        "bloomberg": "<a id='bloomberg' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/bloomberg.png' alt='bloomberg' height='auto' width='20%'/></a>",
        "angiesList": "<a id='angiesList' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/angiesList.png' alt='angiesList' height='auto' width='20%'/></a>",
        "bing": "<a id='bing' data-role='button' class='butn' style='padding:5px' data-url='http://www.bing.com/search?q=#:city#'><img src='styles/images/bing.png' alt='bing' height='auto' width='20%'/></a>",
        "blogger": "<a id='blogger' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/blogger.png' alt='blogger' height='auto' width='20%'/></a>",
        "groupon": "<a id='groupon' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/groupon.png' alt='groupon' height='auto' width='20%'/></a>",
        "youtube": "<a id='youtube' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/youtube.png' alt='YouTube' height='auto' width='20%'/></a>",
        "flickr": "<a id='flickr' data-role='button' class='butn' style='padding:5px'><img src='styles/images/flickr.png' alt='flickr' height='auto' width='20%'/></a>",
        "settings": "<a id='settings' data-role='button' class='butn' style='padding:5px'><img src='styles/images/settings.png' alt='settings' height='auto' width='20%'/></a>",
        "contacts": "<a id='contacts' data-role='button' class='butn' style='padding:5px'><img src='styles/images/contacts.png' alt='contacts' height='auto' width='20%'/></a>",
        "pintrest": "<a id='pintrest' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/pintrest.png' alt='pintrest' height='auto' width='20%'/></a>",
        "news": "<a id='news' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/news.png' alt='news' height='auto' width='20%'/></a>",
        "mail": "<a id='mail-icon' data-role='button' class='butn' style='padding:5px'><img src='styles/images/mail.png' alt='mail' height='auto' width='20%'/></a>",
        "vine": "<a id='vine' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/vine.png' alt='vine' height='auto' width='20%'/></a>",
        "weather": "<a id='weather' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/weather.png' alt='weather' height='auto' width='20%'/></a>",
        "wikipedia": "<a id='wikipedia' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/wikipedia.png' alt='wikipedia' height='auto' width='20%'/></a>",
        "yahoo": "<a id='yahoo' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/yahoo.png' alt='yahoo' height='auto' width='20%'/></a>",
        "yellowpages": "<a id='yellowpages' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/yellowpages.png' alt='yellowpages' height='auto' width='20%'/></a>",
        "calendar": "<a id='calendar' data-role='button' class='butn' style='padding:5px'><img src='styles/images/calendar.png' alt='calendar' height='auto' width='20%'/></a>",
        "twitter": "<a id='twitter' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/twitter.png' alt='twitter' height='auto' width='20%'/></a>",
        "linkedIn": "<a id='linkedIn' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/linkedIn.png' alt='linkedin' height='auto' width='20%'/></a>",
        "googleplus": "<a id='googleplus' data-role='button' class='butn' data-url='http' style='padding:5px'><img src='styles/images/googleplus.png' alt='googleplus' height='auto' width='20%'/></a>",
        "googleMaps": "<a id='googleMaps' data-role='button' data-lat='#:lat#' data-url='http' data-lng='#:lng#' class='butn' style='padding:5px'><img src='styles/images/googleMaps.png' alt='googleMaps' height='auto' width='20%'/></a>",
        "google": "<a id='google' data-role='button' class='butn' style='padding:5px' data-url='http'><img src='styles/images/google.png' alt='Google' height='auto' width='20%'/></a>"
    },
    "defaultMedia": [
        { "name": "facebook", "selected": true }, { "name": "yelp", "selected": true }, { "name": "bing", "selected": true }, { "name": "iSee", "selected": true }, { "name": "twitter", "selected": true }, { "name": "instagram", "selected": true }, { "name": "notifications", "selected": true }, { "name": "googleMaps", "selected": true }
    ],
    "defaultSites": ["redbubble","google", "youtube", "facebook", "bing", "twitter", "yelp", "instagram", "yellowpages", "linkedIn", "wikipedia", "yahoo", "pintrest", "flickr", "groupon", "angiesList", "ESPN", "nfl", "bloomberg", "zomato"]
};