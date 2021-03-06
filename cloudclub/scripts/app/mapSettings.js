/**
 * Map Partner Application Settings
 */

var htmlOptions = {
    "product": "On2See default urls",
    "version": 1.1,
    "releaseDate": "2016-09-19T00:00:00.000Z",
    "approved": true,
    "defaultOptions": {
        "standard": ["follow", "events", "activities"],
        "search": ["google", "twitter", "bing", "facebook", "roosterlocal"],
        "food": ["zomato", "yelp"],
        "general": ["yellowpages"],
        "display": ["search", "general"],
        "jobs": ["angiesList", "homeAdvisor"]
    },
    "url": {
        "facebook": "https://www.facebook.com/",
        "youtube": "https://www.youtube.com/watch?v=",
        "instagram": "https://www.instagram.com/",
        "googleplus": "https://www.google.com/maps/place/name/latlng",
        "zomato": "https://www.zomato.com/miami/name-city/photostabtop",
        "website": "http://www.google.com/"
    },
    "uris":
	{
	    "roosterlocal": {
	        "name": "roosterlocal",
	        "path": "https://www.roosterlocal.com/",
	        "query": "",
	        "option": "",
	        "space": " "
	    },
	    "angiesList": {
	        "name": "angiesList",
	        "path": "https://www.angieslist.com/research/",
	        "query": "type",
	        "option": "",
	        "space": " "
	    },
	    "linkedIn": {
	        "name": "linkedIn",
	        "path": "https://www.linkedin.com/in/",
	        "query": "name",
	        "option": "",
	        "space": " "
	    },
	    "homeAdvisor": {
	        "name": "homeadvisor",
	        "path": "http://www.homeadvisor.com/",
	        "query": "name",
	        "option": "",
	        "space": " "
	    },
	    "spokeo": {
	        "name": "spokeo",
	        "path": "https://www.spokeo.com/",
	        "query": "name",
	        "option": "",
	        "space": " "
	    },
	    "pintrest": {
	        "name": "pintrest",
	        "path": "https://www.pintrest.com/",
	        "query": "name",
	        "option": "",
	        "space": " "
	    },
	    "facebook": {
	        "name": "facebook",
	        "path": "https://m.facebook.com/search/pages/?q=",
	        "query": "name-",
	        "option": "",
	        "space": " "
	    },
	    "google+": {
	        "name": "google+",
	        "path": "https://https://plus.google.com/",
	        "query": "name-",
	        "option": "",
	        "space": " "
	    },
	    "home": {
	        "name": "default",
	        "path": "Website",
	        "query": "",
	        "option": "",
	        "space": " "
	    },
	    "events": {
	        "name": "events",
	        "path": "Website",
	        "query": "",
	        "option": "",
	        "space": " "
	    },
	    "activity": {
	        "name": "activity",
	        "path": "Website",
	        "query": "",
	        "option": "",
	        "space": " "
	    },
	    "yahoo": {
	        "name": "yahoo",
	        "path": "https://www.yahoo.com/search/top/?q=",
	        "query": "name-",
	        "option": "",
	        "space": " "
	    },
	    "bing": {
	        "name": "bing",
	        "path": "https://www.bing.com/search?q=",
	        "query": "name",
	        "option": "",
	        "space": " "
	    },
	    "yelp": {
	        "name": "yelp",
	        "path": "https://www.yelp.com/biz/",
	        "query": "name-",
	        "option": "City",
	        "space": "-"
	    },
	    "twitter": {
	        "name": "twitter",
	        "path": "https://www.twitter.com/search/?q=",
	        "query": "name-",
	        "option": "",
	        "space": "-"
	    },
	    "yellowpages": {//http://www.yellowpages.com/search?search_terms=Gimler+Plumbing+Inc&geo_location_terms=Pompano+Beach%2C+FL
	        "name": "yellowpages",
	        "path": "http://m.yp.com/search?search_term=#:name#&search_location=#:city#%2C#:state#",
	        "query": "name-",
	        "option": "",
	        "space": "-"
	    },
	    "youtube": {
	        "name": "youtube",
	        "path": "https://www.youtube.com/watch?v=",
	        "query": "name",
	        "space": "-",
	        "option": "city"
	    },
	    "instagram": {
	        "name": "instagram",
	        "path": "https://www.instagram.com/?v=",
	        "query": "name",
	        "space": "-",
	        "option": "city"
	    },
	    "googleMaps": {
	        "name": "googleMap",
	        "path": "https://www.google.com/maps/place/",
	        "query": "name+",
	        "space": "/",
	        "option": "@latlng"
	    },
	    "zomato": {
	        "name": "zomato",
	        "path": "https://www.zomato.com/",
	        "query": "name",
	        "space": "-",
	        "option": "city"
	    },
	    "google": {
	        "name": "google",
	        "path": "https://www.google.com/#q=",
	        "query": "name",
	        "space": " ",
	        "option": ""
	    },
	    "wikipedia": {
	        "name": "wikipedia",
	        "path": "https://en.wikipedia.org/wiki/",
	        "query": "search",
	        "space": " ",
	        "option": ""
	    }
	}
}