var center = new L.LatLng(30, 30);
var bounds = new L.LatLngBounds([90, 200], [-80, -200]);
worldcountries = [];

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
    zoomControl: false,
    maxBounds: bounds
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
            worldcountriesLayer = L.geoJson(worldcountries, {
        		style: greyStyle,        		
    		});
    		worldcountriesLayer.addTo(map);
        },
        error: function(e) {
            console.log(e);
        }
    });
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

function toggleRegion (regionClass, element) {
	var status = $(element).children();
	if ($(status).hasClass("glyphicon-ok")){
		$(status).removeClass("glyphicon-ok");
		$(status).addClass("glyphicon-remove");
		$(regionClass).hide();
	} else {
		$(status).removeClass("glyphicon-remove");
		$(status).addClass("glyphicon-ok");
		$(regionClass).show();
	}
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
	
	var pdfSrc = "pdf" + mapSrc.substring(3).replace(".png", ".pdf");
	$("#downloadPDF").attr("href", pdfSrc);  

	$('#myModal').modal();
}


getWorld();
