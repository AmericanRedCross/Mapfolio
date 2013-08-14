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