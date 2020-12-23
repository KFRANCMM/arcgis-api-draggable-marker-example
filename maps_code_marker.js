/**
 * ORIGINAL POST
 * REFERENCE: https://community.esri.com/t5/arcgis-api-for-javascript/drag-and-drop-a-pin-with-arcgis-js-api-4-x/td-p/532364
 */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/support/webMercatorUtils"
], function (
    Map, MapView, Graphic, webMercatorUtils
) {

    /* MAP CONFIG*/
    const map = new Map({
        basemap: "gray"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-103.763,19.24 ],
        zoom: 11
    });


    /* COORDINATES DIV */
	//*** Add div element to show coordates ***//
	var coordsWidget = document.createElement("div");
	coordsWidget.id = "coordsWidget";
	coordsWidget.className = "esri-widget esri-component";
	coordsWidget.style.padding = "7px 15px 5px";
	view.ui.add(coordsWidget, "bottom-right");

	//*** Update lat, lon, zoom and scale ***//
	function showCoordinates(pt) {
	   var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
		   " | Scale 1:" + Math.round(view.scale * 1) / 1 +
		   " | Zoom " + view.zoom;
	   coordsWidget.innerHTML = coords;
	}
	 
	//*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
	view.watch(["stationary"], function() {
	   showCoordinates(view.center);
	});

	//*** Add event to show mouse coordinates on click and move ***//
	view.on(["pointer-down","pointer-move"], function(evt) {
	   showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
	});


    /* SET INITIAL POINT */
    var point = {
        type: "point", // autocasts as new Point()
        longitude: -103.763,
        latitude: 19.24
    };

    var markerSymbol = {
        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
        url: "https://daraobeirne.github.io/kisspng-drawing-pin-world-map-logo-push-vector-5ae029f6ddeaf4.198342921524640246909.png",
        width: "30px",
        height: "30px"
    };


    var graphic = new Graphic({
        geometry: webMercatorUtils.geographicToWebMercator(point),
        symbol: markerSymbol
    });

    view.graphics.add(graphic);

    /* DRAGGABLE MARKER */
    const input_x  = document.getElementById('x_coordinate');
    const input_y  = document.getElementById('y_coordinate');

    let isDragging = false;
    view.when().then(() =>
        view.on('drag', e => {
            // if you've started dragging on the graphic in question
            view.hitTest(e).then(res => {
            
                // set isDragging to true at the start
                if (res.results[0].graphic === graphic && e.action === "start")
                    isDragging = true;
                // set isDragging to false at the end
                else if (e.action === "end")
                    isDragging = false

                // SET VALUE RESULT
                input_x.value = res.results[0].mapPoint.longitude.toFixed(4);
                input_y.value = res.results[0].mapPoint.latitude.toFixed(4);

                console.log(res);
            })

            if (isDragging) {
                // prevent the map being panned mid-drag
                e.stopPropagation();
                // Update the graphic's geometry to the new drag pos
                graphic.geometry = view.toMap(e)
            }
        })
    )
});