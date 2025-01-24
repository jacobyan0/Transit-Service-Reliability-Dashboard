//Script for Crowdsourcing and System Data pages

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



function showCVInfo() {
  document.getElementById("aboutcvPage").style.display = "flex";
}

function hideCVInfo() {
  document.getElementById("aboutcvPage").style.display = "none";
}

function viewCV(id) {
  localStorage.setItem('confirmPage', 'true');
}

function showConfirmPage() {
  document.getElementById("confirmPage").style.display = "flex";
}

function hideConfirmPage(success) {
  localStorage.setItem('confirmPage', 'false');
  document.getElementById("confirmPage").style.display = "none";
}

//read inventory data
function getInventory() {
$.ajax(
{
    url: "backend/amenities/readinventory.php",
    type: 'POST',
    dataType: "json",
    data: {stopArray: JSON.stringify(bus_stops)},
    success: function (result)
    {
        result.forEach((stop) => {
          bus_stops.push(stop);
          var currentPage = new URLSearchParams(window.location.search).get('page');
          if (currentPage == "busstopcv") {
            var stopText = `
              <h3 class='mt-1'>#${stop.id}: ${stop.name}</h3>
              <img class='sv_image mb-2' src='${stop.image}' alt='Street view image of bus stop'>
              <a class="font-bold" href="http://localhost:8080/accesslabeler/?id=${stop.id}&GSV=${encodeURIComponent(stop.link)}" onclick="viewCV(${stop.id})">View Bus Stop CV</a>
            `;
            stop_markers[stop.id] = L.marker([stop.lat, stop.lon], {icon: blueStop}).bindPopup(stopText);
          }
          else {
          if (stop.benches) {
            var stopText = `
            <h3 class='mt-1'>#${stop.id}: ${stop.name}</h3>
              <img class='sv_image' src='${stop.image}' alt='Street view image of bus stop'>
              <a href='${stop.link}' target='_blank'>View Image on Google</a>
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
              <h3 class='mt-1'>#${stop.id}: ${stop.name}</h3>
              <img class='sv_image' src='${stop.image}' alt='Street view image of bus stop'>
              <a href='${stop.link}' target='_blank'>View Image on Google</a>
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
            var stopText = `<h3 class='text-red-500'>#${stop.id}: ${stop.name}</h3><img class='sv_image' src='${stop.image}' alt='Street view image of bus stop'><a href='${stop.link}' target='_blank'>View Image on Google</a><table><tr><th>Amenity</th><th>Amount</th></tr><tr><td>Shelters</td><td>N/A</td></tr><tr><td>Benches</td><td>N/A</td></tr><tr><td>Trashcans</td><td>N/A</tr><tr><td>Bikeracks</td><td>N/A</td></tr></table>`;
            stop_markers[stop.id] = L.marker([stop.lat, stop.lon], {icon: incompleteStop}).bindPopup(stopText);
          }
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
              markerToReport = stop_markers[stop.id];
              displayStop(stop);
          });
          displayedMarkers.add(stop_markers[stop.id].getLatLng());
        }
    );
    var currentPage = new URLSearchParams(window.location.search).get('page');
    if (currentPage != "busstopcv") {
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
    }
  },           
  error: function (responseText)
  {
    console.log("Error with bus inventory: " + responseText);
  }
});
}

//on default page load stop #1
document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem('confirmPage') == 'true') {
    setTimeout(function() {
    showConfirmPage();
    }, 200)
  }
  var currentPage = new URLSearchParams(window.location.search).get('page');
  if (currentPage != "busstopcv") {
    markerToReport = stop_markers[1];
    var stopToDisplay = bus_stops.find(stop => stop.id === "1");
    displayStop(stopToDisplay);
  }
  else {
    if (!localStorage.getItem('firstCVVisit')) {
      localStorage.setItem('firstCVVisit', 'true');
      document.getElementById("aboutcvPage").style.display = "flex";
    } else {
      document.getElementById("aboutcvPage").style.display = "none";
    }
  }
});

//helper function -> resets amenity form to default values
function resetAmenities() {
  for (let id in stop_markers) {
    if (stop_markers[id] === markerToReport) {
      var stopToDisplay = bus_stops.find(stop => stop.id === id);
      displayStop(stopToDisplay);
    }
  }
}

//submit amenity form
function submitForm(event) {
  event.preventDefault();
  var stopID = 0;
  for (let id in stop_markers) {
    if (stop_markers[id] === markerToReport) {
      stopID = id;
    }
  }
  var form = document.getElementById('stopForm');
  var formData = new FormData(form);
  formData.append('stopID', stopID);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'backend/amenities/add.php', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          document.getElementById('feedback').style.display = "flex";
      } else {
          console.log('Form submission failed.');
      }
  };
  xhr.send(formData);
}

//helper function -> changes amenity form display to reflect selected stop
function displayStop(stop) {
  document.getElementById('feedback').style.display = "none";
  markerToReport = stop_markers[stop.id]
  if (stop.benches) {
    document.getElementById("title").innerHTML = "#" + stop.id + ": " + stop.name;
  }
  else {
    document.getElementById("title").innerHTML = "<div class='text-red-500/90'> #" + stop.id + ": " + stop.name + "</div>";
  }
  document.getElementById("benches").value = stop.benches;
  document.getElementById("cans").value = stop.cans;
  document.getElementById("shelters").value = stop.shelters;
  document.getElementById("racks").value = stop.racks;
  document.getElementById("type").value = stop.type.toLowerCase();
  if (stop.type == "") {
    document.getElementById("type").value = "none";
  }
}

//function called when user uses search feature
function searchMarkers() {
  $('#stopRoute').get(0).selectedIndex = 0;
  currentRoute = null;
  showStopLayer();
    var searchQuery = document.getElementById("stopSearchInput").value;
    searchQuery = searchQuery.toLowerCase(); 
    var safeText = searchQuery.replace(/[;"*$%]/g, '');
    bus_stops.forEach((stop)=> {
        var text = stop_markers[stop.id].getPopup().getContent().toLowerCase();
        if (text.includes(safeText)) {
            stop_markers[stop.id].addTo(map);
            displayedMarkers.add(stop_markers[stop.id].getLatLng());
            markerToReport = stop_markers[stop.id];
            displayStop(stop);
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

//helper function -> displays all available stops on the map
function addStops() {
    removeStops();
    bus_stops.forEach((stop) => {
        stop_markers[stop.id].addTo(map);
        displayedMarkers.add(stop_markers[stop.id].getLatLng());
      });
}

//helper function -> clears all stops from the map
function removeStops() {
  bus_stops.forEach((stop) => {
      stop_markers[stop.id].removeFrom(map);
  });
  displayedMarkers = new Set();
}

var pathForStops = L.geoJSON().addTo(map);

//function called when user selects to view stops by route
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

//displays selected route feature 
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

//helper function for display of route
function nearestFilter(feature) {
  return currentRoute == feature.properties.route_id;
}

//helper function
function displayRouteStops(routeID) {
  removeStops();
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
        console.log("Stop display error: " + responseText);
      }
  });
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

//called when user selects to "search by current location"
function userLocation() {
  $('#stopRoute').get(0).selectedIndex = 0;
  document.getElementById('maploading').style.display = "flex";
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

//helper function for displaying stops within 1/2 mile of user location
function showPosition(position) {
  //clear any routes and stops being displayed and reset route selection
  currentRoute = null;
  showStopLayer();
  document.getElementById('stopRoute').selectedIndex = 0;
  removeStops();

  //obtain user position
  var userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
  map.setView(userPosition, 16);
  currentLocation = L.marker(userPosition).addTo(map);
  bus_stops.forEach((stop)=> {
    var markerLatLng = stop_markers[stop.id].getLatLng();
    var meters = userPosition.distanceTo(markerLatLng);
    if (meters <= 804.672) {
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