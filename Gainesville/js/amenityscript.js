//Script for Bus Stop Amenities page

//define icons
var incompleteStop = L.icon({
  iconUrl: "images/red.png",
  iconSize: [32, 32]
});
var blueStop = L.icon({
    iconUrl: "images/blue-yellow.png",
    iconSize: [32, 32]
});

var bus_stops = [];
var displayedMarkers = new Set();
var stop_markers = {};
var markerToReport = null;
var currentRoute = null;
var currentLocation = null;
var haveBenches = 0;
var haveTrashcans = 0;
var haveShelter = 0;
var haveNone = 0;
var haveBikeracks = 0;

//read inventory data
function getInventory() {
$.ajax(
{
    url: "realtime_data/readinventory.php",
    type: 'POST',
    dataType: "json",
    data: {stopArray: JSON.stringify(bus_stops)},
    success: function (result)
    {
        result.forEach((stop) => {
          bus_stops.push(stop);
          if (stop.benches) {
            var stopText = `
              <img class='sv_image' src='${stop.image}' alt='Street view image of bus stop'>
              <a href='${stop.link}' target='_blank'>View Image on Google</a>
              <h3 class='mt-1'>#${stop.id}: ${stop.name}</h3>
              <table>
                <tr>
                  <th>Amenity</th>
                  <th>Amount</th>
                </tr>
                <tr>
                  <td>Shelters</td>
                  <td>${stop.shelters} ${stop.type}</td>
                </tr>
                <tr>
                  <td>Benches</td>
                  <td>${stop.benches}</td>
                </tr>
                <tr>
                  <td>Trashcans</td>
                  <td>${stop.cans}</td>
                </tr>
                <tr>
                  <td>Bikeracks</td>
                  <td>${stop.racks}</td>
                </tr>
              </table>
            `;
            if (stop.shelters != 0) {
              stopText = `
              <img class='sv_image' src='${stop.image}' alt='Street view image of bus stop'>
              <a href='${stop.link}' target='_blank'>View Image on Google</a>
              <h3 class='mt-1'>#${stop.id}: ${stop.name}</h3>
              <table>
                <tr>
                  <th>Amenity</th>
                  <th>Amount</th>
                </tr>
                <tr>
                  <td>Shelters</td>
                  <td>${stop.shelters} [${stop.type}]</td>
                </tr>
                <tr>
                  <td>Benches</td>
                  <td>${stop.benches}</td>
                </tr>
                <tr>
                  <td>Trashcans</td>
                  <td>${stop.cans}</td>
                </tr>
                <tr>
                  <td>Bikeracks</td>
                  <td>${stop.racks}</td>
                </tr>
              </table>
              `;
            }
            stop_markers[stop.id] = L.marker([stop.lat, stop.lon], {icon: blueStop}).bindPopup(stopText);
          }
          else {
            var stopText = "<h3>#" + stop.id + ": " + stop.name+"</h3><table><tr><th>Amenity</th><th>Amount</th></tr><tr><td>Shelters</td><td>N/A</td></tr><tr><td>Benches</td><td>N/A</td></tr><tr><td>Trashcans</td><td>N/A</tr><tr><td>Bikeracks</td><td>N/A</td></tr></table>";
            stop_markers[stop.id] = L.marker([stop.lat, stop.lon], {icon: incompleteStop}).bindPopup(stopText);
          }
          if (stop.benches > 0) {
            haveBenches++;
          }
          if (stop.cans > 0) {
            haveTrashcans++;
          }
          if (stop.shelters > 0) {
            haveShelter++;
          }
          if (stop.racks > 0) {
            haveBikeracks++;
          }
          if (stop.racks == 0 && stop.shelters == 0 && stop.cans == 0 && stop.benches == 0) {
            haveNone++;
          }
          stop_markers[stop.id].addTo(map);
          stop_markers[stop.id].on('click', function() {
              map.setView(stop_markers[stop.id].getLatLng(), 16); 
              document.getElementById("stopForm").style.display = "block";
              document.getElementById("defaultInfoText").style.display = "none";
              markerToReport = stop_markers[stop.id];
              document.getElementById("title").innerHTML = "#" + stop.id + ": " + stop.name;
              document.getElementById("benches").value = stop.benches;
              document.getElementById("cans").value = stop.cans;
              document.getElementById("shelters").value = stop.shelters;
              document.getElementById("racks").value = stop.racks;
              document.getElementById("type").value = stop.type.toLowerCase();
              console.log(stop.type.toLowerCase());
              if (stop.type == "") {
                document.getElementById("type").value = "none";
              }
          });
          displayedMarkers.add(stop_markers[stop.id].getLatLng());
        }
    );
    const tableBody = document.querySelector("#amenityTable tbody");
    const amenityData = [
      { amenity: "Shelter(s)", ratio: haveShelter, percent: ((haveShelter / bus_stops.length)* 100).toFixed(2)  + "%" },
      { amenity: "Bench(es)", ratio: haveBenches, percent: ((haveBenches / bus_stops.length)* 100).toFixed(2) + "%" },
      { amenity: "Bike Racks(s)", ratio: haveBikeracks, percent: ((haveBikeracks / bus_stops.length)* 100).toFixed(2) + "%" },
      { amenity: "Trash Can(s)", ratio: haveTrashcans, percent: ((haveTrashcans / bus_stops.length)* 100).toFixed(2) + "%" },
      { amenity: "None", ratio: haveNone, percent: ((haveNone / bus_stops.length)* 100).toFixed(2) + "%" }
    ];
    amenityData.forEach(item => {
      const row = document.createElement("tr");
      Object.values(item).forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
  },           
  error: function (responseText)
  {
    console.log("Error with bus inventory: " + responseText);
  }
});
}

function clearForm() {
  document.getElementById("stopForm").style.display = "none";
  document.getElementById("defaultInfoText").style.display = "block";
}

function searchMarkers() {
    var searchQuery = document.getElementById("stopSearchInput").value;
    searchQuery = searchQuery.toLowerCase(); 
    var safeText = searchQuery.replace(/[;:"*$%]/g, '');
    bus_stops.forEach((stop)=> {
        var text = stop_markers[stop.id].getPopup().getContent().toLowerCase();
        if (text.includes(safeText)) {
            stop_markers[stop.id].addTo(map);
            displayedMarkers.add(stop_markers[stop.id].getLatLng());
            document.getElementById("stopForm").style.display = "block";
            document.getElementById("defaultInfoText").style.display = "none";
            markerToReport = stop_markers[stop.id];
            document.getElementById("title").innerHTML = "#" + stop.id + ": " + stop.name;
            document.getElementById("benches").value = stop.benches;
            document.getElementById("cans").value = stop.cans;
            document.getElementById("shelters").value = stop.shelters;
            document.getElementById("racks").value = stop.racks;
            document.getElementById("type").value = stop.type.toLowerCase();
            if (stop.type == "") {
              document.getElementById("type").value = "none";
            }
        }
        else {
            stop_markers[stop.id].removeFrom(map);
            displayedMarkers.delete(stop_markers[stop.id].getLatLng());
        }
    })
    if (displayedMarkers.size > 0 && displayedMarkers.size < 20) {
        var coordinateArray = Array.from(displayedMarkers);
        var latLngArray = coordinateArray.map(coordinates => L.latLng(coordinates));
        var bounds = L.latLngBounds(latLngArray);
        map.fitBounds(bounds);
    } 
    else {
        map.setView([29.653, -82.351], 13);
    }
}

function addStops() {
    removeStops();
    bus_stops.forEach((stop) => {
        stop_markers[stop.id].addTo(map);
        displayedMarkers.add(stop_markers[stop.id].getLatLng());
      });
}

function removeStops() {
  bus_stops.forEach((stop) => {
      stop_markers[stop.id].removeFrom(map);
  });
  displayedMarkers = new Set();
}

var pathForStops = L.geoJSON().addTo(map);


function findStops(value) {
  currentRoute = null;
  if (currentLocation) {
    map.removeLayer(currentLocation);
  }
  if (value == "clear") {
    map.setView([29.653, -82.351], 13);
    addStops();
  }
  else {
    currentRoute = value;
    displayRouteStops(value);
  }
  showStopLayer();
}


function showStopLayer() {
  if (pathForStops) {
    map.removeLayer(pathForStops);
  }
  $.getJSON("data/route.geojson",function(data){
    pathForStops = L.geoJson(data ,{
      filter: nearestFilter, 
      onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup("Route " + feature.properties.route_id + ": "+feature.properties.long_name);
        featureLayer.setStyle({color: "#" + feature.properties.color});
      }
    }).addTo(map);
    map.fitBounds(pathForStops.getBounds());
  });
}


function nearestFilter(feature) {
  return currentRoute == feature.properties.route_id;
}


function displayRouteStops(routeID) {
  removeStops();
  $.ajax(
    {
      url: "realtime_data/stops.php",
      type: 'POST',
      dataType: 'text',
      data: {route: routeID},
      success: function (responseText)
      {
        eval(responseText);
      },
                      
      error: function (responseText)
      {
        console.log("Stop display error: " + responseText);
      }
  });
}


function displayNearest(feature) {
    removeStops();
    for (var i = 0; i < feature.geometry.coordinates.length; i++) {
      bus_stops.forEach((stop)=> {
        var markerLatLng = stop_markers[stop.id].getLatLng();
        var featureLatLng = L.latLng(feature.geometry.coordinates[i][1], feature.geometry.coordinates[i][0]);
        var distanceInMeters = markerLatLng.distanceTo(featureLatLng);
        
        var feet = distanceInMeters * 3.28084;
        if (feet <= 400) {
            stop_markers[stop.id].addTo(map);
            displayedMarkers.add(stop_markers[stop.id].getLatLng());
        }
    });
  }
}

//function to 'view stops by amenities' -> users check boxes for amenities
function showAmenities() {
  addStops();
  var amenities = " stops have ";
  if (document.getElementById('benchBox').checked) {
    amenities = amenities + " benches AND ";
    bus_stops.forEach((stop)=> {
      if (stop.benches == 0 || stop.benches == null) {
        stop_markers[stop.id].removeFrom(map);
        displayedMarkers.delete(stop_markers[stop.id].getLatLng());
      }
    })
  }
  if (document.getElementById('shelterBox').checked) {
    amenities = amenities + " shelters AND ";
    bus_stops.forEach((stop)=> {
      if (stop.shelters == 0 || stop.shelters == null) {
        stop_markers[stop.id].removeFrom(map);
        displayedMarkers.delete(stop_markers[stop.id].getLatLng());
      }
    })
  }
  if (document.getElementById('bikeBox').checked) {
    amenities = amenities + " bikeracks AND ";
    bus_stops.forEach((stop)=> {
      if (stop.racks == 0 || stop.racks == null) {
        stop_markers[stop.id].removeFrom(map);
        displayedMarkers.delete(stop_markers[stop.id].getLatLng());
      }
    })
  }
  if (document.getElementById('trashBox').checked) {
    amenities = amenities + " trashcans AND ";
    bus_stops.forEach((stop)=> {
      if (stop.cans == 0 || stop.cans == null) {
        stop_markers[stop.id].removeFrom(map);
        displayedMarkers.delete(stop_markers[stop.id].getLatLng());
      }
    })
  }
  if (document.getElementById('none').checked) {
    amenities = amenities + " none AND ";
    bus_stops.forEach((stop)=> {
      if (stop.cans != 0 || stop.shelters != 0 || stop.racks != 0 || stop.benches != 0) {
        stop_markers[stop.id].removeFrom(map);
        displayedMarkers.delete(stop_markers[stop.id].getLatLng());
      }
    })
  }
  if (amenities != " stops have ") {
    document.getElementById("amenityInfo").innerHTML = displayedMarkers.size +" or " + ((displayedMarkers.size / bus_stops.length)* 100).toFixed(2)  + "% of " + amenities.substring(0, amenities.length - 4);
  }
  else {
    document.getElementById("amenityInfo").innerHTML = "";
  }
}

// Function to check if a marker overlaps with the line segment within a certain distance
function markersThatOverlap(featureGeometry) {
  removeStops();
  const line = turf.lineString(featureGeometry.coordinates);
  bus_stops.forEach((stop)=> {
    var markerLatLng = stop_markers[stop.id].getLatLng();
    const markerPoint = turf.point([markerLatLng.lng, markerLatLng.lat]);
    const dist = turf.pointToLineDistance(markerPoint, line, { units: 'miles' });
    console.log(dist);
    if (dist !== undefined && dist <= 0.025) {
      stop_markers[stop.id].addTo(map);
      displayedMarkers.add(stop_markers[stop.id].getLatLng());
  }
  });
}

//called when user selects to "search by current location"
function userLocation() {
  document.getElementById('maploading').style.display = "flex";
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

//helper function for displaying stops within 1/2 mile of user location
function showPosition(position) {
  currentRoute = null;
  showStopLayer();
  document.getElementById('stopRoute').selectedIndex = 0;
  removeStops();
  var userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
  map.setView(userPosition, 16);
  currentLocation = L.marker(userPosition).addTo(map);
  bus_stops.forEach((stop)=> {
    var markerLatLng = stop_markers[stop.id].getLatLng();
    var meters = userPosition.distanceTo(markerLatLng);
    if (meters <= 805) {
        stop_markers[stop.id].addTo(map);
        displayedMarkers.add(stop_markers[stop.id].getLatLng());
    }
  });
  document.getElementById('maploading').style.display = "none";
}

//helper function to display errors when requesting user location
function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
      case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
      case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
      case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
  }
}

