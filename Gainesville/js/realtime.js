//General Script -> applies to all pages -> Real-Time Info page

//Define icons
//classes defined in style.css
var busIcon = L.divIcon({
  html: '<ion-icon size="large" name="bus"></ion-icon>',
  className: 'my-div-icon',
  iconSize: [32, 32]
});
var stopIcon = L.divIcon({
  html: '<ion-icon name="location"></ion-icon>',
  className: 'stop-icon',
  iconSize: [15, 15]
});

//Display the map of Gainesville
const map = L.map('map', {
    center: [29.653, -82.351],
    zoom: 13,
    doubleClickZoom: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    maxZoom: 17,
    minZoom: 12
});

//Customize the map
// MapLibre GL JS does not handle RTL text by default, so we recommend adding this dependency to fully support RTL rendering. 
maplibregl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js');

L.maplibreGL({
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',  // Style URL; see our documentation for more options
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

//check the currrent page to display the correct legend on the map and call the correct functions per page
var currentPage = new URLSearchParams(window.location.search).get('page');

if (currentPage == "realtime") {
  var legend = L.control({position: 'topright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<div class="text-sm font-semibold"><ion-icon class="my-div-icon ml-2 mt-2 float-left mr-2" size="large" name="bus"></ion-icon><div class="mt-2 ml-1">This bus is delayed</div><ion-icon class="my-div-icon mt-4 ml-2 mb-2 float-left mr-2" style="color:#3bbf40;" size="large" name="bus"></ion-icon> </br>not delayed</div></div>';
      return div;
  };
  legend.addTo(map);
}
if (currentPage == "crowdsourcing" || currentPage == "system_data") {
    getInventory();
    var legend = L.control({position: 'topright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<div class="text-sm font-weight-800 flex flex-col p-2">' + '<div class="font-semibold text-lg">Legend:</div>' +
        '<div><img src="images/blue-yellow.png" alt="Icon" class="float-left mr-2" style="width: 50px; height: 50px;">' +
        '<div class="mt-2">Bus Stop</div></div><div>' +
        '<img src="images/red.png" alt="Icon" class="mt-2 float-left mr-2" style="width: 50px; height: 50px;"><div class="mt-4">Bus Stop that may be missing some data</div></div>';
      return div;
  };
  legend.addTo(map);
}

if (currentPage == "busstopcv") {
  getInventory();
    var legend = L.control({position: 'topright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div');
      div.innerHTML += '<div class="p-3 -mt-3 mb-2 flex -ml-2" onclick="showCVInfo()"><i class="fa fa-question-circle" style="font-size:36px;color:#F87272"></i></div>';
      return div;
  };
  legend.addTo(map);
}

//define bus
class Bus {
  constructor(vid, rt, lat, lon, dly, des, color, dlycolor, stop) {
    this.vid = vid;
    this.rt = rt;
    this.lat = lat;
    this.lon = lon;
    this.dly = dly;
    this.des = des;
    this.color = color;
    this.dlycolor = dlycolor;
    this.nearStop = stop;
  }
}

//Set holds all of the buses that are displayed on the page at the moment
const tripsShown = new Set();
var pathLayer = L.geoJSON().addTo(map);
var busMark = {};
var buses = [];

//when switching pages, map may glitch. This function should prevent that
function switchTabs() {
    if (map2 != null) {
    setTimeout(function () {
      map2.invalidateSize(true);
    }, 100);
  }
  if (map) {
    setTimeout(function () {
      map.invalidateSize(true);
    }, 100);
  }
}

//display the colored route lines based on the routes selected for display
function showPaths() {
  map.removeLayer(pathLayer);
  $.getJSON("data/route.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
    pathLayer = L.geoJson(data ,{
      filter: pathFilter, 
      onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup("Route " + feature.properties.route_id + ": "+feature.properties.long_name);
        featureLayer.setStyle({color: "#" + feature.properties.color});
      }
    }).addTo(map);
  });
}

//helper function for route line display
function pathFilter(feature) {
  return tripsShown.has(feature.properties.route_id);
}

//helper function for clearing all routes off the map
function clear() {
  tripsShown.forEach((trip) => {
    remove(trip);
  });
}

//function that is called when the user selects a route to display
function displayRoute(value) {
  //display all -> clear all the stuff on the map and display all currently running
  if (value === "display") {
    clear();
    if (document.getElementById("busDataMain").innerHTML == "") {
      document.getElementById("loading").style.display = "block";
    }
    display();
  }
  //clear -> remove all on the map
  else if (value === "clear") {
    clear();
  }
  else {
    addBus(value);
  }
  showPaths();
}
    
//function that removes a specific route from the map
function remove(value) {
  buses.forEach((bus) => {
    if (bus.rt === value) {
      busMark[bus.vid].removeFrom(map);
    }
  });
  document.getElementById(value).remove();
  tripsShown.delete(value);
  $('#route').get(0).selectedIndex = 0;
  showPaths();
}

//function to add a specific route to the map
function addBus(value) {
  if (!tripsShown.has(value)) {
    tripsShown.add(value);
    //search through all vid and add every vehicle that applies to the route being added
    buses.forEach((bus) => {
      if (bus.rt === value) {
        busMark[bus.vid].addTo(map);
        busMark[bus.vid]._icon.style.boxShadow = '0px 0px 0px 4px #' + bus.color;
        busMark[bus.vid]._icon.style.color = bus.dlycolor;
      }
    });
    //call php function to show the route popup
    $.ajax(
        {
          url: "backend/realtime/addRoute.php",
          type: 'POST',
          dataType: 'text',
          data: {route: value},
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
}

//display all currently running buses
function display() {
  realtimeLoading(true);
    buses.forEach((bus) => {
      addBus(bus.rt);
    });
}

//function sets everything up -> start timer, calls function to gather current data
function realtimeLoading(isRealtime) {
  if (isRealtime) {
    getRealtime();
  }
  document.getElementById("timeMain").innerHTML = (new Date()).toLocaleString();
  setInterval(changeTime, 15000);
}

function changeTime() {
  document.getElementById("timeMain").innerHTML = (new Date()).toLocaleString();
  getRealtime();
}

//updates the position of vehicles
function getRealtime() {
  $.ajax(
      {
        url: "backend/realtime/realtime.php",
        type: 'POST',
        dataType: "json",
        data: {busArray: JSON.stringify(buses)},
        success: function (result)
        {
          var rtsDly = {};
          var busNo = 0;
          const routes = new Set();
          var delayed = 0;
          result.forEach((bus) => {
            busNo++;
            routes.add(bus.rt);
            if (bus.dly === "True") {
              delayed++;
              if (bus.rt in rtsDly) {
                rtsDly[bus.rt]++;
              }
              else {
                rtsDly[bus.rt] = 1;
              }
            }
            if (bus.vid in busMark) {
              busMark[bus.vid]._icon.style.color = bus.dlycolor;
              busMark[bus.vid].slideTo([bus.lat, bus.lon], {duration:15000});
              busMark[bus.vid].bindPopup("<b>Route "+bus.rt+"</b></br>"+"#"+bus.vid+"</br><b>Destination:</b> "+bus.des+"</br><b>Currently Near:</b> "+bus.nearStop);
            }
            else {
              buses.push(bus);
              busMark[bus.vid] = L.marker([bus.lat, bus.lon], {icon: busIcon}).bindPopup("<b>Route "+bus.rt+"</b></br>"+"#"+bus.vid+"</br>Destination: "+bus.des+"</br>Currently Near: "+bus.nearStop);
            }
          });
          var delayData = "";
          var busDatas = "";
          var delayedRoutes = 0;
          for (var route in rtsDly) {
            delayedRoutes++;
            delayData += route + ", ";
            if (rtsDly[route] == 1) {
              busDatas += "Route " + route + " has " + rtsDly[route] + " delayed bus</br>";
            }
            else {
              busDatas += "Route " + route + " has " + rtsDly[route] + " delayed bus(es)</br>";
            }
          }
          if (busDatas == "") {
            busDatas = "There are no delayed routes."
          }
          delayData = delayData.substring(0,delayData.length-2);
          var perDly = delayed / busNo * 100;
          var perRtDly = delayedRoutes / routes.size * 100;
          document.getElementById("busDataMain").innerHTML = 
            `<div class="bg-green-700/20 p-2 px-4 items-center rounded-md">Routes: ${routes.size} </div>
            <div class="bg-green-700/20 p-2 px-4 rounded-md">Vehicles: ${busNo} </div>
            <div class="bg-green-700/20 p-2 px-4 rounded-md"> Vehicles Delayed: ${perDly.toFixed(2)} %</div>
            <div class="bg-green-700/20 p-2 px-4 rounded-md">Routes Delayed: ${perRtDly.toFixed(2)} %</div>`;
          document.getElementById("currData").innerHTML = busDatas;
          if (document.getElementById("loading").style.display == "block") {
            document.getElementById("loading").style.display = "none";
            displayRoute("display");
          }
        },         
        error: function (responseText)
        {
          console.log(responseText);
        }
    });
}

