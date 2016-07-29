function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(50.903033, 11.359863),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
        overviewMapControl: true
    };
    var map = new google.maps.Map(document.getElementById('limousine-map'), mapOptions);
    var directionsService = new google.maps.DirectionsService();
    var directionDisplay = new google.maps.DirectionsRenderer();
    directionDisplay.setMap(map);
    directionDisplay.setPanel(document.getElementById('route-details'));

    var Route = {
        var request = {
            origin: null,
            destination: null,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };
    this.setOrigin = function(m) { request.origin = m.getPosition(); };
    this.setDestination = function(m) { request.destination = m.getPosition(); };
    this.calc = function() {
        if(request.origin && request.destination) {
            directionsService.route(request, function(response, status) {
                if(status == google.maps.DirectionsStatus.OK) {
                    $('#route-details').parent().fadeIn();
                    directionDisplay.setDirections(response);
                }
            });
        } else {
            directionDisplay.setDirections(null);
        }
    }
};

var route = new Route();
var clickedLocation;

var $infoWindowContent = $([
    '<div class="infoWindowContent">',
    '<h3></h3>',
    '<button class="setOrigin">Start</button>',
    '<button class="setDestination" style="float: right;">Target</button>',
    '</div>'
].join(''));
$infoWindowContent.find(".setOrigin").on('click', function() {
    route.setOrigin(clickedLocation);
    route.calc();
});
$infoWindowContent.find(".setDestination").on('click', function() {
    route.setDestination(clickedLocation);
    route.calc();
});

var infoWindow = new google.maps.InfoWindow();
infoWindow.setContent($infoWindowContent.get(0));

//Assuming array markerData to contain the data necessary for bujilding markers ...
$.each(markerData, function(i, m) {
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(m.lat, m.lng),
        title: m.title
    });

    google.maps.event.addListener(marker, 'click', function() {
        clickedLocation = this;
        infoWindow.close();//necessary?
        $infoWindowContent.find("h3").text(this.getTitle());
        infoWindow.open(map, this);
    });
});

}
google.maps.event.addDomListener(window, 'load', initialize);