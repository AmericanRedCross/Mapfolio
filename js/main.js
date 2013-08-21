var geojson;
var center = new L.LatLng(30, 30);
var bounds = new L.LatLngBounds([90, 200], [-80, -200]);
var worldcountries = [];
var centroids = [];


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

var centroidOptions = {
    radius: 8,
    fillColor: "#ED1B2E",
    color: "#FFF",
    weight: 2.5,
    opacity: 1,
    fillOpacity: 1
};

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

function getCentroids(){
    $.ajax({
        type: 'GET',
        url: 'data/centroids.json',
        contentType: 'application/json',
        dataType: 'json',
        timeout: 10000,
        success: function(json) {
            centroids = json;
            markers2map();
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function markers2map () {

    L.geoJson(centroids,{
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng,centroidOptions);
        }    
    }).addTo(map);

    // var markers = new L.MarkerClusterGroup();
    // markers.addLayer(L.marker([0, 0]));
    // map.addLayer(markers);

}


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

function toggleRegion (regionClass) {
	var thumbnails = $(".thumbnailGallery").children();
    if (regionClass === "ALL"){
        $(thumbnails).show();
    } else {
        $(thumbnails).hide();
        $.each(thumbnails, function(i, thumbnail){
            if($(thumbnail).hasClass(regionClass)){
                $(thumbnail).show();
            }
        })
    }
    var buttons = $("#extentButtons").children();
    $.each(buttons, function(i, button){
        var buttonElements = $(button).children();
        if($(button).hasClass(regionClass)){            
            $(buttonElements).removeClass("glyphicon-remove");
            $(buttonElements).addClass("glyphicon-ok");
        } else {
            $(buttonElements).removeClass("glyphicon-ok");
            $(buttonElements).addClass("glyphicon-remove");
        }
    });
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

getWorld();
