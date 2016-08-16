/**
 * Application Settings
 */

var appSettings = {

	pageOne: "",
	//Location PopUp Html
	ICON: '<a href="#:Link#"><img src="#:Symbol#" alt="#:Alt#" height="auto" width="12%" style="padding:2px">',
	LINES: '<div class="iw-title"></div>' + '<div class="iw-content"><div class="iw-subTitle">%Name%</div>' + '<div><a data-role="button" class="butn" data-rel="external" href="tel:#:Phone#">' + '<img src="styles/images/phone2.png" alt="phone" height="auto" width="12%"></a><br /> <small>#:Address#, </small><i>#:Message#</i>, #:Phone#, #:Email#, <b>#:Open #</b>, #:Review#, #:Stars#, #:Distance#, #:Cost#<p>',
	START: '<div >LINES',
	ACTIVITIES: '<a href="components/partners/view.html?partner=#:Place#"><img src="styles/images/on2see-icon-120x120.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
	THUMBUP: '<a href="components/activities/view.html?partner=#:Place#"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
	PARTNER: '<a href="components/notifications/view.html?partner=#:Place#");"><img src="styles/images/green-share.png" alt="On2See" height="auto" width="12%" style="padding:2px"></a>',
	MAP: '<a onclick="app.Places.browse(\'https://www.google.com/maps/place/#:PlaceG#\');"><img src="styles/images/googleMap.png" alt="Google" height="auto" width="12%" style="padding:2px"></a>',
	TWITTER: '<a  data-rel="external" onclick="app.Places.browse(\'https://twitter.com/search?q=#:PlaceT#\');"><img src="styles/images/twitter.png" alt="Twitter" height="auto" width="12%" style="padding:2px"></a>',
	YELP: '<a  data-rel="external" onclick="app.Places.browse(\'https://www.yelp.com/biz/#:PlaceY#\');"><img src="styles/images/yelp_64.png" alt="Yelp" height="auto" width="12%" style="padding:2px"></a>',
	FACEBOOK: '<a data-rel="external" onclick="app.Places.browse(\'https://www.facebook.com/#:PlaceF#\');"><img src="styles/images/facebook2.png" alt="Facebook" height="auto" width="12%" style="padding:2px"></a>',
	HOMPAGE: '<a  data-rel="external" onclick="app.Places.browse(\' #:Website# \')"><img src="#: Icon #" alt="Logo" height="auto" width="12%"></a></p>',
	END: '</div>',
	HEAD: '<div><div class="iw-subTitle">%Name%</div>' + '<div><a data-role="button" class="butn" data-rel="external" href="tel:Phone">' + '<img src="styles/images/phone2.png" alt="phone" height="auto" width="25%" style="padding:5px"></a><small>' + 'Address, Open Stars</small></div>' + '<div ><br/><a data-role="button" class="butn" href="components/activities/view.html?ActivityText=%Name%"><img src="styles/images/on2see-icon-120x120.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" href="UrlString"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" href="components/notifications/view.html?ActivityText=%Name%");"><img src="styles/images/green-share.png" alt="On2See" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" onclick="app.Places.browse(\'https://www.google.com/maps/place/Google\');"><img src="styles/images/googleMap.png" alt="Google" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\'https://twitter.com/search?q=Twitter\');"><img src="styles/images/twitter.png" alt="Twitter" height="auto" width="25%" style="padding:5px"></a>' + '<a id="cameraLink" ><img src="styles/images/instagram.png" alt="Camera" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\'https://www.facebook.com/Facebook\');"><img src="styles/images/facebook2.png" alt="Facebook" height="auto" width="25%" style="padding:5px"></a>' + '<a data-role="button" class="butn" data-rel="external" onclick="app.Places.browse(\'WebSite\')"><img src="Icon" alt="Logo" height="auto" width="25%" style="padding:5px"></a>' + '</div>',
	avatar: 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAgVSURBVHjaxFpbTBRX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',
	bavatar: 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUY2RDZCOTlEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUY2RDZCOUFEREVEMTFFNEFCNTVFOTc1NTIzQzc4OUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RjZENkI5N0RERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RjZENkI5OERERUQxMUU0QUI1NUU5NzU1MjNDNzg5QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgEM6tYAAAI0UExURU1NTU1NTU1N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',
	empty1x1png: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',


	items: [{
			"id": 1,
			"name": "Banks ",
			"list": ["bank", "atm"]
		},
		{
			"id": 2,
			"name": "Business ",
			"list": ["travel_agency", "roofing_contractor", "plumber", "painter", "locksmith", "lawyer", "laundry", "insurance_agency", "florist", "electrician", "car_wash", "car_repair", "car_dealer", "book_store", "bicycle_store", "beauty_salon", "accounting"]
		},
		{
			"id": 3,
			"name": "Community ",
			"list": ["synagogue", "post_office", "police", "park", "museum", "mosque", "local_government_office", "hindu_temple", "funeral_home", "fire_station", "courthouse", "city_hall", "church", "cemetery", "amusement_park"]
		},
		{
			"id": 4,
			"name": "Education ",
			"list": ["university", "school", "library", "art_gallery", "aquarium"]
		},
		{
			"id": 5,
			"name": "Entertainment ",
			"list": ["zoo", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"]
		},
		{
			"id": 6,
			"name": "Groceries ",
			"list": ["grocery_or_supermarket", "bakery"]
		},
		{
			"id": 7,
			"name": "Health ",
			"list": ["veterinary_care", "spa", "physiotherapist", "hospital", "hair_care", "gym", "doctor", "dentist"]
		},
		{
			"id": 8,
			"name": "Restaurant ",
			"list": ["restaurant", "meal_takeaway", "meal_delivery", "liquor_store", "convenience_store", "cafe", "bar"]
		},
		{
			"id": 9,
			"name": "Store ",
			"list": ["store", "shopping_mall", "shoe_store", "pharmacy", "pet_store", "jewelry_store", "home_goods_store", "hardware_store", "furniture_store", "electronics_store", "department_store", "clothing_store"]
		},
		{
			"id": 10,
			"name": "Travel ",
			"list": ["transit_station", "train_station", "taxi_stand", "subway_station", "storage", "rv_park", "real_estate_agency", "parking", "moving_company", "lodging", "gas_station", "embassy", "car_rental", "campground", "bus_station", "airport"]
		}],

	products2: [{
			"id": 1,
			"name": "Banks ",
			"list": ["bank", "atm"]
		},
		{
			"id": 2,
			"name": "Business ",
			"list": ["laundry", "florist", "electrician", "book_store", "bicycle_store", "beauty_salon", "accounting"]
		},
		{
			"id": 3,
			"name": "Community ",
			"list": ["post_office", "police", "park", "local_government_office", "fire_station", "city_hall"]
		},
		{
			"id": 4,
			"name": "Education ",
			"list": ["museum", "university", "zoo", "school", "library", "art_gallery", "aquarium"]
		},
		{
			"id": 5,
			"name": "Entertainment ",
			"list": ["amusement_park", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"]
		},
		{
			"id": 6,
			"name": "Groceries ",
			"list": ["grocery_or_supermarket", "liquor_store", "convenience_store", "bakery"]
		},
		{
			"id": 7,
			"name": "Health ",
			"list": ["pharmacy", "physiotherapist", "hospital", "doctor", "dentist"]
		},
		{
			"id": 8,
			"name": "Restaurants ",
			"list": ["restaurant", "meal_takeaway", "meal_delivery", "cafe", "bar"]
		},
		{
			"id": 9,
			"name": "Store ",
			"list": ["store", "shopping_mall", "shoe_store", "jewelry_store", "furniture_store", "electronics_store", "department_store", "clothing_store"]
		},
		{
			"id": 10,
			"name": "Travel ",
			"list": ["transit_station", "train_station", "taxi_stand", "subway_station", "campground", "bus_station", "airport", "car_rental"]
		},
		{
			"id": 11,
			"name": "Agencies",
			"list": ["real_estate_agency", "travel_agency", "real_estate_agency", "insurance_agency", "moving_company"]
		},
		{
			"id": 12,
			"name": "Legal",
			"list": ["courthouse", "embassy", "lawyer"]
		},
		{
			"id": 13,
			"name": "Jobs",
			"list": ["home_goods_store", "hardware_store", "locksmith", "roofing_contractor", "plumber", "painter", ]
		},
		{
			"id": 14,
			"name": "Cars",
			"list": ["gas_station", "car_wash", "car_repair", "car_dealer", "rv_park", "parking", ]
		},
		{
			"id": 15,
			"name": "Moving",
			"list": ["moving_company", "storage", "lodging", ]
		},
		{
			"id": 16,
			"name": "Pets",
			"list": ["veterinary_care", "pet_store"]
		},
		{
			"id": 17,
			"name": "Religions",
			"list": ["hindu_temple", "church", "funeral_home", "cemetery", "mosque", "synagogue", ]
		},
		{
			"id": 18,
			"name": "Beauty ",
			"list": ["pharmacy", "spa", "hair_care", "gym"]
		}
    ],
	products: [{
			"id": 1,
			"name": "accounting",
			"search": "accounting"
		},
		{
			"id": 2,
			"name": "airport",
			"search": "airport"
		},
		{
			"id": 3,
			"name": "amusement_park",
			"search": "amusement park"
		},
		{
			"id": 4,
			"name": "aquarium",
			"search": "aquarium"
		},
		{
			"id": 5,
			"name": "art_gallery",
			"search": "art gallery"
		},
		{
			"id": 6,
			"name": "atm",
			"search": "atm"
		},
		{
			"id": 7,
			"name": "bakery",
			"search": "bakery"
		},
		{
			"id": 8,
			"name": "bank",
			"search": "bank"
		},
		{
			"id": 9,
			"name": "bar",
			"search": "bar"
		},
		{
			"id": 10,
			"name": "beauty_salon",
			"search": "beauty salon"
		},
		{
			"id": 11,
			"name": "bicycle_store",
			"search": "bicycle store"
		},
		{
			"id": 12,
			"name": "book_store",
			"search": "book store"
		},
		{
			"id": 13,
			"name": "bowling_alley",
			"search": "bowling alley"
		},
		{
			"id": 14,
			"name": "bus_station",
			"search": "bus station"
		},
		{
			"id": 15,
			"name": "cafe",
			"search": "cafe"
		},
		{
			"id": 16,
			"name": "campground",
			"search": "campground"
		},
		{
			"id": 17,
			"name": "car_dealer",
			"search": "car dealer"
		},
		{
			"id": 18,
			"name": "car_rental",
			"search": "car rental"
		},
		{
			"id": 19,
			"name": "car_repair",
			"search": "car repair"
		},
		{
			"id": 20,
			"name": "car_wash",
			"search": "car wash"
		},
		{
			"id": 21,
			"name": "casino",
			"search": "casino"
		},
		{
			"id": 22,
			"name": "cemetery",
			"search": "cemetery"
		},
		{
			"id": 23,
			"name": "church",
			"search": "church"
		},
		{
			"id": 24,
			"name": "city_hall",
			"search": "city hall"
		},
		{
			"id": 25,
			"name": "clothing_store",
			"search": "clothing store"
		},
		{
			"id": 26,
			"name": "convenience_store",
			"search": "convenience store"
		},
		{
			"id": 27,
			"name": "courthouse",
			"search": "courthouse"
		},
		{
			"id": 28,
			"name": "dentist",
			"search": "dentist"
		},
		{
			"id": 29,
			"name": "department_store",
			"search": "department store"
		},
		{
			"id": 30,
			"name": "doctor",
			"search": "doctor"
		},
		{
			"id": 31,
			"name": "electrician",
			"search": "electrician"
		},
		{
			"id": 32,
			"name": "electronics_store",
			"search": "electronics store"
		},
		{
			"id": 33,
			"name": "embassy",
			"search": "embassy"
		},
		{
			"id": 34,
			"name": "fire_station",
			"search": "fire station"
		},
		{
			"id": 35,
			"name": "florist",
			"search": "florist"
		},
		{
			"id": 36,
			"name": "funeral_home",
			"search": "funeral home"
		},
		{
			"id": 37,
			"name": "furniture_store",
			"search": "furniture store"
		},
		{
			"id": 38,
			"name": "gas_station",
			"search": "gas station"
		},
		{
			"id": 39,
			"name": "grocery_or_supermarket",
			"search": "grocery or supermarket"
		},
		{
			"id": 40,
			"name": "gym",
			"search": "gym"
		},
		{
			"id": 41,
			"name": "hair_care",
			"search": "hair care"
		},
		{
			"id": 42,
			"name": "hardware_store",
			"search": "hardware store"
		},
		{
			"id": 43,
			"name": "hindu_temple",
			"search": "hindu temple"
		},
		{
			"id": 44,
			"name": "home_goods_store",
			"search": "home goods store"
		},
		{
			"id": 45,
			"name": "hospital",
			"search": "hospital"
		},
		{
			"id": 46,
			"name": "insurance_agency",
			"search": "insurance agency"
		},
		{
			"id": 47,
			"name": "jewelry_store",
			"search": "jewelry store"
		},
		{
			"id": 48,
			"name": "laundry",
			"search": "laundry"
		},
		{
			"id": 49,
			"name": "lawyer",
			"search": "lawyer"
		},
		{
			"id": 50,
			"name": "library",
			"search": "library"
		},
		{
			"id": 51,
			"name": "liquor_store",
			"search": "liquor store"
		},
		{
			"id": 52,
			"name": "local_government_office",
			"search": "local government office"
		},
		{
			"id": 53,
			"name": "locksmith",
			"search": "locksmith"
		},
		{
			"id": 54,
			"name": "lodging",
			"search": "lodging"
		},
		{
			"id": 55,
			"name": "meal_delivery",
			"search": "meal delivery"
		},
		{
			"id": 56,
			"name": "meal_takeaway",
			"search": "meal takeaway"
		},
		{
			"id": 57,
			"name": "mosque",
			"search": "mosque"
		},
		{
			"id": 58,
			"name": "movie_rental",
			"search": "movie rental"
		},
		{
			"id": 59,
			"name": "movie_theater",
			"search": "movie theater"
		},
		{
			"id": 60,
			"name": "moving_company",
			"search": "moving company"
		},
		{
			"id": 61,
			"name": "museum",
			"search": "museum"
		},
		{
			"id": 62,
			"name": "night_club",
			"search": "night club"
		},
		{
			"id": 63,
			"name": "painter",
			"search": "painter"
		},
		{
			"id": 64,
			"name": "park",
			"search": "park"
		},
		{
			"id": 65,
			"name": "parking",
			"search": "parking"
		},
		{
			"id": 66,
			"name": "pet_store",
			"search": "pet store"
		},
		{
			"id": 67,
			"name": "pharmacy",
			"search": "pharmacy"
		},
		{
			"id": 68,
			"name": "physiotherapist",
			"search": "physiotherapist"
		},
		{
			"id": 69,
			"name": "plumber",
			"search": "plumber"
		},
		{
			"id": 70,
			"name": "police",
			"search": "police"
		},
		{
			"id": 71,
			"name": "post_office",
			"search": "post office"
		},
		{
			"id": 72,
			"name": "real_estate_agency",
			"search": "real estate agency"
		},
		{
			"id": 73,
			"name": "restaurant",
			"search": "restaurant"
		},
		{
			"id": 74,
			"name": "roofing_contractor",
			"search": "roofing contractor"
		},
		{
			"id": 75,
			"name": "rv_park",
			"search": "rv park"
		},
		{
			"id": 76,
			"name": "school",
			"search": "school"
		},
		{
			"id": 77,
			"name": "shoe_store",
			"search": "shoe store"
		},
		{
			"id": 78,
			"name": "shopping_mall",
			"search": "shopping mall"
		},
		{
			"id": 79,
			"name": "spa",
			"search": "spa"
		},
		{
			"id": 80,
			"name": "stadium",
			"search": "stadium"
		},
		{
			"id": 81,
			"name": "storage",
			"search": "storage"
		},
		{
			"id": 82,
			"name": "store",
			"search": "store"
		},
		{
			"id": 83,
			"name": "subway_station",
			"search": "subway station"
		},
		{
			"id": 84,
			"name": "synagogue",
			"search": "synagogue"
		},
		{
			"id": 85,
			"name": "taxi_stand",
			"search": "taxi stand"
		},
		{
			"id": 86,
			"name": "train_station",
			"search": "train station"
		},
		{
			"id": 87,
			"name": "transit_station",
			"search": "transit station"
		},
		{
			"id": 88,
			"name": "travel_agency",
			"search": "travel agency"
		},
		{
			"id": 89,
			"name": "university",
			"search": "university"
		},
		{
			"id": 90,
			"name": "veterinary_care",
			"search": "veterinary care"
		},
		{
			"id": 91,
			"name": "zoo",
			"search": "zoo"
		}


         ],


	everlive: {
		appId: '3t5oa8il0d0y02eq', // Put your Backend Services API key here
		scheme: 'http'
	},
	views: {
		init: 'index.html',
		noAppId: 'views/noAppIdView.html',
		signUp: 'views/signupView.html',
		users: 'views/usersView.html',
		main: 'views/placesView.html'
	},
	notification: {
		//androidProjectNumber: "389531505311"
		androidProjectNumber: "508581667442"
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

	messages: {
		mistSimulatorAlert: 'The social login doesn\'t work in the In-Browser Client, you need to deploy the app to a device, or run it in the simulator of the Windows Client or Visual Studio.',
		removeActivityConfirm: 'This activity will be deleted. This action can not be undone.'
	}
};