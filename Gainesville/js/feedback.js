//Script for User Feedback page

//define icons -> for viewing bus stops
var blueStop = L.icon({
    iconUrl: "images/blue-yellow.png",
    iconSize: [32, 32]
});

var geoDisplayed = false;
var reportType;
var formType = "general";

//function called when selecting between "leave feedback" and "report an incident"
function selectReport(type) {
    //form is reset everytime a new selection is made
    resetForm();
    clearAll();
    removeAllDisplay();
    document.getElementById("toSubmit").style.display = "flex";
    document.getElementById("reportSelection").value = type;
    document.getElementById("default").style.display = "block";
    document.getElementById("formDropdown").style.display = "block";
    document.getElementById("formSelection").value = formType;
    reportType = type;
    document.getElementById(type).style.display = "block";
    if (formType != "general") {
        document.getElementById(formType).style.display = "block";
    }
    else {
        viewGeo();
    }
}

//helper function -> removes all form displays
function removeAllDisplay() {
    document.getElementById("stop").style.display = "none";
    document.getElementById("route").style.display = "none";
    document.getElementById("incident").style.display = "none";
    document.getElementById("general").style.display = "none";
    document.getElementById("default").style.display = "none";
}
//function called when selecting between "general" or "stop" or "route" form
function selectForm(type) {
    resetForm();
    clearAll();
    removeAllDisplay();
    document.getElementById("formSelection").value = type;
    formType = type;
    if (formType != "general") {
        document.getElementById(formType).style.display = "block";
    }
    else {
        viewGeo();
    }
    document.getElementById("default").style.display = "block";
    document.getElementById(reportType).style.display = "block";
    document.getElementById("reportSelection").value = reportType;
}

//helper function -> resets feedback form
function resetForm() {
    map.removeLayer(reportLocation);
    document.getElementById("feedbackForm").reset();
}

var geoMarker;
var reportLocation = L.marker([29.652, -82.339], { draggable: true });
//user is able to click on the map to drop a marker only when the form is open
document.addEventListener("DOMContentLoaded", function() {
    map.on('click', function(e) {   
        clearGeo();  
        if (reportLocation) {
            map.removeLayer(reportLocation);
        }  
        if (document.getElementById("formSelection").style.display == "block") {
          reportLocation.setLatLng(e.latlng);
          reportLocation.addTo(map);
          map.setView(e.latlng, 15);
          document.getElementById('location').value = e.latlng.lat + ", " + e.latlng.lng;
        }      
    });
    reportLocation.on('dragend', function(e) {
        document.getElementById('location').value = e.target.getLatLng().lat + ", " + e.target.getLatLng().lng;
    });
});

//helper function -> removes geocoder feature and search value
function clearGeo() {
    const geoInput = document.querySelector('.leaflet-control-geocoder input');
    if (geoInput) {
        geoInput.value = "";
    }
}
var geocoder;
//initializes and displays geocoder
function viewGeo() {
    geocoder = L.Control.geocoder({
        bbox: L.latLngBounds(L.latLng(29.5808, -82.4735), L.latLng(29.7268, -82.2144)),
        collapsed: false,
        position: 'topleft',
        defaultMarkGeocode: false 
    }).on('markgeocode', function (event) {
        const { center, name } = event.geocode;
        map.setView(center, 15);
        //selectForm("general");
        document.getElementById('location').value = name;
        if (reportLocation) {
            map.removeLayer(reportLocation);
        }  
        reportLocation.addTo(map);
        reportLocation.setLatLng(center);
    }).addTo(map);
}

var singleRoute = L.geoJSON().addTo(map);
var selectedRoute;

//called when user selects to view a route
function showRouteLayer(route) {
    selectedRoute = route;
    if (singleRoute) {
      map.removeLayer(singleRoute);
    }
    $.getJSON("data/route.geojson",function(data){
      // add GeoJSON layer to the map once the file is loaded
      singleRoute = L.geoJson(data ,{
        filter: routeFilter, 
        onEachFeature: function(feature, featureLayer) {
          featureLayer.bindPopup("Route " + feature.properties.route_id + ": "+feature.properties.long_name);
          featureLayer.setStyle({color: "#" + feature.properties.color});
        }
      }).addTo(map);
      map.fitBounds(singleRoute.getBounds());
      document.getElementById("location").value = "Route " + route;
    });
}

//helper function to filter routes
function routeFilter(feature) {
    return selectedRoute == feature.properties.route_id;
}

var currentRouteForStops;
var displayedMarkers = null;
var bus_stops = [];
var stop_markers = {};
var busStopLayerByRoute = L.geoJSON().addTo(map);
var busStopLayer = L.geoJSON().addTo(map);

//called when user selects to view stops by route
function stopsAlongRoute(value) {
    clearAll();
    showAll();
    setTimeout(function() {
        if (value == "all") {
            bus_stops.forEach((stop) => {
                stop_markers[stop].addTo(map);
            });
        }
        else if (value == "clear") {
            if (bus_stops) {
                bus_stops.forEach((stop) => {
                    stop_markers[stop].removeFrom(map);
                });
            }
        }
        else {
            currentRouteForStops = value;
            displayRouteStops(value);
            $.getJSON("data/route.geojson",function(data){
                // add GeoJSON layer to the map once the file is loaded
                busStopLayerByRoute = L.geoJson(data ,{
                  filter: nearestFilter, 
                  onEachFeature: function(feature, featureLayer) {
                    featureLayer.bindPopup("Route " + feature.properties.route_id + ": "+feature.properties.long_name);
                    featureLayer.setStyle({color: "#" + feature.properties.color});
                  }
                }).addTo(map);
                map.fitBounds(busStopLayerByRoute.getBounds());
            });
        }
    }, 200);
}

//helper function -> displays stops according to passed in route id
function displayRouteStops(routeID) {
    $.ajax(
      {
        url: "backend/stops.php",
        type: 'POST',
        dataType: 'text',
        data: {route: routeID},
        success: function (responseText)
        {
          eval(responseText);
        },            
        error: function (responseText)
        {
          console.log(responseText);
        }
    });
}

//helper function to filter routes
function nearestFilter(feature) {
    return currentRouteForStops == feature.properties.route_id;
}

//helper function to display all stops
function showAll() {
    bus_stops = [];
    stop_markers = {};
    $.getJSON("data/bus_stops.geojson", function(data){
        busStopLayer = new L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: blueStop});
            },
            onEachFeature: function(feature, marker) {
                marker.bindPopup("Stop #" + feature.properties.stop_id + ": " + feature.properties.stop_name);
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                marker.on('click', function (e) {
                    document.getElementById('location').value = "Stop #" + feature.properties.stop_id + ": " + feature.properties.stop_name;
                    if (reportLocation) {
                        map.removeLayer(reportLocation);
                    }
                });
                bus_stops.push(feature.properties.stop_id);
                stop_markers[feature.properties.stop_id] = marker;
            }
        })
    });
}

//called when user uses the "search for stops" feature
function searchMarkers() {
    showAll();
    setTimeout(function() {
        var searchQuery = document.getElementById("stopSearchInput").value;
        searchQuery = searchQuery.toLowerCase(); 
        var safeText = searchQuery.replace(/[;:"*$%]/g, '');
        bus_stops.forEach((stop)=> {
            var text = stop_markers[stop].getPopup().getContent().toLowerCase();
            if (text.includes(safeText)) {
                document.getElementById("location").value = stop_markers[stop].getPopup().getContent();
            }
        })
    }, 100);
}

//helper function -> resets the map, clears all layers, resets options
function clearAll() {
    clearGeo();
    if (geocoder) {
        map.removeControl(geocoder);
    }
    map.setView([29.653, -82.351], 13);
    if (bus_stops) {
        bus_stops.forEach((stop) => {
            stop_markers[stop].removeFrom(map);
        });
    }
    if (busStopLayerByRoute) {
        map.removeLayer(busStopLayerByRoute);
    }
    if (busStopLayer) {
        map.removeLayer(busStopLayer);
    }
    if (singleRoute) {
        map.removeLayer(singleRoute);
    }
    if (reportLocation) {
        map.removeLayer(reportLocation);
    }
    $('#routeselection').get(0).selectedIndex = 0;
    $('#stoprouteselection').get(0).selectedIndex = 0;
}