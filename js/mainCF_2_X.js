
var centroids = [];

var center = new L.LatLng(30, 30);
var bounds = new L.LatLngBounds([90, 200], [-80, -200]);

var greyStyle = {
    color: '#fff',
    weight: 1,
    fillColor: '#d7d7d8',
    fillOpacity: 1,
};

var map = L.map('map', {
    center: center,
    zoom: 0,
    attributionControl: false,
    maxBounds: bounds,
    scrollWheelZoom: false,
    // dragging: false
});


function getWorld() {
    $.ajax({
        type: 'GET',
        url: 'data/worldcountries.json',
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,
        success: function(json) {
            worldcountries = json;
            countries = new L.layerGroup().addTo(map);
            geojson = L.geoJson(worldcountries,{
                style: greyStyle
            }).addTo(countries);
            getCentroids();
        },
        error: function(e) {
            console.log(e);
        }
    });
}

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
    var markers = L.markerClusterGroup().addTo(map);

    $.each(centroids, function (i, map) {
        var y = map.latitude;
        var x = map.longitude;
        var title = map.name;
        var marker = L.marker(new L.LatLng(y,x), {title: title});
        marker.bindPopup(title);
        markers.addLayer(marker);
    });
    
}

getWorld();

