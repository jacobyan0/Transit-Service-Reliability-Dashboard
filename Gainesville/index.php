<?php
	require_once('backend/config.php');
  $today = date_create();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="shortcut icon" type="image/x-icon" href="images/mainbus.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <script src="jquery-3.6.4.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.1.0/dist/full.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="js/leaflet-providers.js"></script>
  <!-- MapLibre GL JS (still required to handle the rendering) -->
  <script type="text/javascript" src="//unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
  <link href="//unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="../assets/vendor/daterangepicker/daterangepicker.css">
  <!-- Mapbox GL Leaflet -->
  <script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.0.19/leaflet-maplibre-gl.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/3.6.2/fetch.min.js" integrity="sha512-1Gn7//DzfuF67BGkg97Oc6jPN6hqxuZXnaTpC9P5uw8C6W4yUNj5hoS/APga4g1nO2X6USBb/rXtGzADdaVDeA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
  <script src="https://d3js.org/d3.v4.js"></script>
  <script src='https://unpkg.com/leaflet.marker.slideto@0.2.0/Leaflet.Marker.SlideTo.js'></script>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
<script
src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
</script>
  <title>On-Time Dashboard</title>

</head>

<body>
  <div class="h-100% overflow-hidden bg-slate-100/40">
      <div id="data-content" style="display:none;">
        <?php include 'data.php';?>
      </div>
      <div id="route-content">
        <div class="flex flex-row">
          <div>
            <h1 class="mt-2 ml-4 mb-2 text-3xl text-slate-900 font-bold">Gainesville RTS On-time</h1>
            <h1 onclick="switchTabs('routes')" class="text-slate-900/70 cursor-pointer float-left ml-4 rounded-t-lg text-lg font-bold bg-slate-300/70 pl-2 pr-4 mr-2">Real-Time Info</h1>
            <h1 onclick="switchTabs('data')" class="text-slate-900/70 cursor-pointer rounded-t-lg text-lg font-bold bg-slate-300/30 ml-40 hover:bg-slate-300/50">Historical Data</h1>
          </div>
          <div class="relative flex flex-row mt-14">
              <div class="rounded-t-lg font-bold -mt-1 absolute sticky bottom-0 text-slate-900/70 bg-slate-300/70 min-w-72 ml-3 text-lg pl-2 pr-2">Realtime Operational Stats</div>
              <div id="busData" class="text-slate-900/70 rounded-lg font-bold pl-2 pr-2 mr-8"></div>
              <div id="time" class="font-bold text-slate-900/70 ml-8">Time</div>
            <!--<input class="float-right mr-12" onchange="showData(this.value)" type="date" id="dataDate" name="dataDate" value="2022-10-18" min="2022-10-18" max="2022-10-31">-->
          </div>
        </div>
        <div class="bg-slate-300/70 ml-4 mr-4 flex rounded-tr-lg pb-8 rounded-b-lg flex-row pb-4">
          <div class="p-4 w-96 text-base-content place-content-center">
            <div class="bg-white rounded-lg font-semibold p-3 mb-2">
              <i class="fa fa-question-circle float-left mr-2" style="font-size:36px;color:#F87272"></i>
              <div class="ml-2">Use the selection below to display routes and view buses currently running.
                <!--</br><ion-icon class="my-div-icon ml-2 mt-2 float-left mr-2" size="large" name="bus"></ion-icon> </br>This bus is delayed</br>
                <ion-icon class="my-div-icon mt-4 ml-2 float-left mr-2" style="color:#3bbf40;" size="large" name="bus"></ion-icon> </br>This bus is not delayed</br>!-->
              </div>
            </div>
            <div id="currData" class="bg-white rounded-lg p-3 mb-2 font-semibold">Current data for buses running right now</div>
            <select id="route" onchange="displayRoute(this.value)" class="bg-indigo-950 text-white select text-base w-full">
              <option disabled selected>Add Route</option>
              <option value="display">Display routes currently running</option>
              <option value="clear">Clear all</option>
              <?php
                $sql = "SELECT `route_id`, `route_long_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
                //$sql = "SELECT `stops`.`stop_lat`, `stops`.`stop_lon`, `stops`.`stop_id`, `stop_times`.`trip_id` FROM `stops` , `stop_times` WHERE `stops`.`stop_id` = `stop_times`.`stop_id` AND `stop_times`.`trip_id` = '1001004'";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                  // Output data of each row
                  while ($row = $result->fetch_assoc()) {
                    //echo "<div class='collapse'>";
                    $routeid = $row['route_id'];
                    echo "<option value='$routeid'>Route $routeid</option>";
                  }
                } else {
                  echo "No routes found";
                }
              ?>
            </select>
            <div id="currRoutes" class="mt-2 grid grid-cols-2 gap-2 bg-white/40 rounded-lg h-96 overflow-auto sm:grid-cols-2 p-1"></div>
          </div>
          <div class="flex-1 mr-8">
            <div id="map" class="w-full ml-4 m-auto rounded-lg mt-4"></div>
          </div> 
        </div>
    </div>
  </div>
</body>
</html>

<script>
  const map = L.map('map', {
    center: [29.652, -82.339],
    zoom: 13,
    maxBounds: L.latLngBounds(L.latLng(29.5808, -82.4735), L.latLng(29.7268, -82.2144)),
    doubleClickZoom: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    maxZoom: 16,
    minZoom: 12
  });
  var legend = L.control({position: 'topright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
      // loop through our density intervals and generate a label with a colored square for each interval
      div.innerHTML += '<div class="text-sm font-semibold"><ion-icon class="my-div-icon ml-2 mt-2 float-left mr-2" size="large" name="bus"></ion-icon><div class="mt-2 ml-1">This bus is delayed</div><ion-icon class="my-div-icon mt-4 ml-2 mb-2 float-left mr-2" style="color:#3bbf40;" size="large" name="bus"></ion-icon> </br>not delayed</div></div>';
      return div;
  };
  legend.addTo(map);
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
  
  <?php
		$conn->close();
	?>
  //delays.addTo(map);
  

  function switchTabs(name) {
    if (name == "data") {
      clear();
      $('#route').get(0).selectedIndex = 0;
      document.getElementById("data-content").style.display = "block";
      document.getElementById("route-content").style.display = "none";
      setTimeout(function () {
        map2.invalidateSize(true);
      }, 100);
      //showPaths();
    }
    else {
      ////delays.clearLayers();
      document.getElementById("route-content").style.display = "block";
      document.getElementById("data-content").style.display = "none";
      setTimeout(function () {
        map.invalidateSize(true);
      }, 100);
    }
  }
  const tripsShown = new Set();
	
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

  
  var pathLayer = L.geoJSON().addTo(map);
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
  var busMark = {};
  var buses = [];
  function pathFilter(feature) {
    return tripsShown.has(feature.properties.route_id);
  }
  function clear() {
    tripsShown.forEach((trip) => {
      remove(trip);
    });
  }
    function displayRoute(value) {
      if (value === "display") {
        display();
      }
      else if (value === "clear") {
        clear();
      }
      else {
        addBus(value);
      }
      showPaths();
    }
    

  function remove(value) {
    buses.forEach((bus) => {
      if (bus.rt === value) {
        busMark[bus.vid].removeFrom(map);
      }
    });
    document.getElementById(value).remove();
    tripsShown.delete(value);
    showPaths();
  }

  function addBus(value) {
    if (!tripsShown.has(value)) {
      tripsShown.add(value);
      //search through all vid and add every vehicle that applies to the route being added
      buses.forEach((bus) => {
        if (bus.rt === value) {
          busMark[bus.vid].addTo(map);
          busMark[bus.vid]._icon.style.boxShadow = '0px 0px 0px 4px #' + bus.color;
          busMark[bus.vid]._icon.style.color = bus.dlycolor;
          //amount++;
        }
      });
      //call php function to show the route popup
      $.ajax(
          {
            url: "realtime_data/addRoute.php",
            type: 'POST',
            dataType: 'text',
            data: {route: value},
            success: function (responseText)
            {
              eval(responseText);
            },
                            
            error: function (responseText)
            {
              //alert(responseText);
            }
        });
      //x = setInterval(changeTime(routeid), 15000);
    }
    //once the value has sufficiently been added, redisplay the paths to show the ones that apply
    
  }
  function display() {
      buses.forEach((bus) => {
        addBus(bus.rt);
      });
    }
// MapLibre GL JS does not handle RTL text by default, so we recommend adding this dependency to fully support RTL rendering. 
maplibregl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js');

L.maplibreGL({
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',  // Style URL; see our documentation for more options
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);
L.maplibreGL({
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',  // Style URL; see our documentation for more options
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map2);

  

  $(document).ready(function() {
   /*$.ajax(
          {
            url: "hist_data/delayGraph.php",
            type: 'POST',
            success: function (responseText)
            {
              eval(responseText);
            },
                            
            error: function (responseText)
            {
              alert(responseText);
            }
        });*/
    getRealtime();
    document.getElementById("time").innerHTML = (new Date()).toLocaleString();
    setInterval(changeTime, 15000);
  });
  function changeTime() {
    document.getElementById("time").innerHTML = (new Date()).toLocaleString();
    getRealtime();
  }

  //updates the position of vehicles
  function getRealtime() {
    $.ajax(
        {
          url: "realtime_data/realtime.php",
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
                busMark[bus.vid].bindPopup("<b>Route "+bus.rt+"</b></br>"+"#"+bus.vid+"</br>Destination: "+bus.des+"</br>Currently Near: "+bus.nearStop);
              }
              else {
                buses.push(bus);
                busMark[bus.vid] = L.marker([bus.lat, bus.lon], {icon: busIcon}).bindPopup("<b>Route "+bus.rt+"</b></br>"+"#"+bus.vid+"</br>Destination: "+bus.des+"</br>Currently Near: "+bus.nearStop);
                //busMark[bus.vid].remove();
              }
            }
            );
            var delayData = "";
            var busDatas = "";
            var delayedRoutes = 0;
            for (var route in rtsDly) {
              delayedRoutes++;
              delayData += route + ", ";
              busDatas += "Route " + route + " has " + rtsDly[route] + " delayed bus(es)</br>";
            }
            delayData = delayData.substring(0,delayData.length-2);
            var perDly = delayed / busNo * 100;
            var perRtDly = delayedRoutes / routes.size * 100;
            document.getElementById("busData").innerHTML = "No. Routes: " + routes.size + "&nbsp;&nbsp;&nbsp; No. Vehicles: " + busNo + "&nbsp;&nbsp;&nbsp; No. Vehicles Delayed: " + perDly.toFixed(2) + "%" + "&nbsp;&nbsp;&nbsp; No. Routes Delayed: " + perRtDly.toFixed(2) + "%";
            document.getElementById("currData").innerHTML = "There are " + routes.size + " routes running currently.</br>" + busDatas;
          },
                          
          error: function (responseText)
          {
            //alert(responseText);
          }
      });
  }

  function change() {
    if (countDownDate == "00:00:00") {
      clearInterval(z);
      document.getElementById("time").innerHTML = "EXPIRED";
    }
    countDownDate = new Date(countDownDate.getTime() + 15000);
    document.getElementById("time").innerHTML = countDownDate.toLocaleString();
      
    // If the count down is over, write some text 
    if (countDownDate.getHours() > 22) {
      clearInterval(z);
      document.getElementById("time").innerHTML = "EXPIRED";
    }
  }

// set the dimensions and margins of the graph
var margin = {top: 10, right: 15, bottom: 30, left: 20},
    width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var svg3 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/delaysByHour.csv", function(data) {

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.time; }))
  .padding(0.2);
svg3.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .ticks(data.map(function(d) { return d.time; }).every(60))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0]);
svg3.append("g")
  .call(d3.axisLeft(y));

// Bars
svg3.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.Country); })
    .attr("y", function(d) { return y(d.Value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Value); })
    .attr("fill", "#69b3a2")

})
// append the svg object to the body of the page
var svg1 = d3.select("#vidDelayGraph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
d3.csv("data/delaysByHour.csv",

// When reading the csv, I must format variables:
function(d){
  return { time : d3.timeParse("%H:%M")(d.time), amount : d.amount }
},

// Now I can use this dataset:
function(data) {

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.time; }))
    .range([ 0, width ]);
  svg1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.amount; })])
    .range([ height, 0 ]);
  svg1.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg1.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.time) })
      .y(function(d) { return y(d.amount) })
      )

})
var svg = d3.select("#rtDelayGraph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/rtsDelayedByHour.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { time : d3.timeParse("%H:%M")(d.time), amount : d.amount }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.time; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.amount; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.amount) })
        )

})

</script>