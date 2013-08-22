
var centroids = [];

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/22677/256/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ';
var cloudmade = L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution});


var latlng = new L.LatLng(30, 30);
var bounds = new L.LatLngBounds([90, 200], [-80, -200]);

var map = L.map('map', {center: latlng, maxBounds: bounds, zoom: 0, layers: [cloudmade]});

function getCentroids() {
    $.ajax({
        type: 'GET',
        url: 'data/centroids.json',
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,
        success: function(json) {
            centroids = json;
            markersToMap();
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function markersToMap() {
    var markers = L.markerClusterGroup();

    $.each(centroids, function (i, map) {
        var y = map.latitude;
        var x = map.longitude;
        var title = map.name;
        var marker = L.marker(new L.LatLng(y,x), {title: title});
        marker.bindPopup(title);
        markers.addLayer(marker);
    });

    map.addLayer(markers);
}

getCentroids();

