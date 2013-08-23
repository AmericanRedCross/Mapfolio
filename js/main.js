
// THIS IS FOR THE IMAGE GALLERY, MAP STUFF START FARTHER DOWN

function toggleSector (sectorClass, element) {
	var status = $(element).children();
	if ($(status).hasClass("glyphicon-ok")){
		$(status).removeClass("glyphicon-ok");
		$(status).addClass("glyphicon-remove");
		$(sectorClass).hide();
	} else {
		$(status).removeClass("glyphicon-remove");
		$(status).addClass("glyphicon-ok");
		$(sectorClass).show();
	}    
}

function toggleExtent (extentFilter) {
	var thumbnails = $(".thumbnailGallery").children();
    if (extentFilter === "ALL"){
        $(thumbnails).show();
    } else {
        $(thumbnails).hide();
        $.each(thumbnails, function(i, thumbnail){
            if($(thumbnail).hasClass(extentFilter)){
                $(thumbnail).show();
            }
        })
    }
    var buttons = $("#extentButtons").children();
    $.each(buttons, function(i, button){
        var buttonElements = $(button).children();
        if($(button).hasClass(extentFilter)){            
            $(buttonElements).removeClass("glyphicon-remove");
            $(buttonElements).addClass("glyphicon-ok");
        } else {
            $(buttonElements).removeClass("glyphicon-ok");
            $(buttonElements).addClass("glyphicon-remove");
        }
    });
    markersToMap(extentFilter);
} 

function callModal (item) {
	var title = $(item).children('.caption').html();
	$(".modal-title").empty();
	$(".modal-title").append(title);
	
	var thumbSrc = $(item).children('img').attr("src");
	var mapSrc = thumbSrc.replace("_thumb", "");
	var mapImg = '<img src="' + mapSrc + '" alt="" class="img-responsive">'
	$(".modal-body").empty();
	$(".modal-body").append(mapImg);

    var description = $(item).children('.detailedDescription').html();
    $(".modal-detailedDescription").empty();
    $(".modal-detailedDescription").append(description);    
	
	var pdfSrc = "pdf" + mapSrc.substring(3).replace(".png", ".pdf");
	$("#downloadPDF").attr("href", pdfSrc);  

	$('#myModal').modal();
}

//disclaimer text
function showDisclaimer() {
    window.alert("The maps on this page do not imply the expression of any opinion on the part of the American Red Cross concerning the legal status of a territory or of its authorities.");
}




// MAP SHIT STARTS HERE

var centroids = [];
var markersBounds = [];
var displayedPoints = [];
var markers = new L.MarkerClusterGroup();


var countryStyle = {
    color: '#fff',
    weight: 1,
    fillColor: '#d7d7d8',
    fillOpacity: 1,
};

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/22677/256/{z}/{x}/{y}.png';
var attribution = '';
var cloudmade = L.tileLayer(cloudmadeUrl, {attribution: attribution});

var latlng = new L.LatLng(30, 30);
var bounds = new L.LatLngBounds([90, 200], [-80, -200]);

var map = L.map('map', {
    center: latlng,      
    zoom: 0,
//  attributionControl: false,
    scrollWheelZoom: false,
    layers: [cloudmade]
});
cloudmade.setOpacity(0); 


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
                style: countryStyle
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
        success: function(data) {
            formatCentroids(data);
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function formatCentroids(data){
    $.each(data, function(index, item) {
        latlng = [item.longitude, item.latitude];
        var mapCoord = {
            "type": "Feature",
            "properties": {
                "name": item.name,
                "extent": item.extent,
                "sector": item.sector,                        
            },
            "geometry": {
                "type": "Point",
                "coordinates": latlng
            }
        }
        centroids.push(mapCoord);
    }); 
    markersToMap('ALL');
}

var Options = {
    radius: 8,
    fillColor: "#ED1B2E",
    color: "#FFF",
    weight: 2.5,
    opacity: 1,
    fillOpacity: 1
};

function markersToMap(extentFilter){
    map.removeLayer(markers);
    markers = new L.MarkerClusterGroup();
    displayedPoints=[];
    $.each(centroids, function (i, centroid){
        var currentExtent = centroid.properties.extent;
        if (extentFilter === currentExtent || extentFilter === "ALL") {
            displayedPoints.push(centroid);
        }
    })    

    marker = L.geoJson(displayedPoints, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, Options);
            },
            // onEachFeature: markerEvents
        });

    markers.addLayer(marker);
    markers.addTo(map);

    markersBounds = markers.getBounds();
    map.fitBounds(markersBounds);
} 

$(window).resize(function(){
    map.fitBounds(markersBounds);
})

function zoomOut() {
    map.fitBounds(markersBounds);
}

getWorld();
