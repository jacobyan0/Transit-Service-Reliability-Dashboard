//Script for Performance Tracking Page

const map2 = L.map('map2', {
    center: [29.65, -82.35],
    zoom: 12,
    //maxBounds: L.latLngBounds(L.latLng(29.5808, -82.4735), L.latLng(29.7268, -82.2144)),
    doubleClickZoom: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    maxZoom: 16,
    minZoom: 11
});
maplibregl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js');

L.maplibreGL({
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map2);


//create bar chart foundation
var time = [];
var amount = [];
var totalBuses = [];
var chartdata = {
  labels: time,
  datasets : [
    {
      label: 'Number of Vehicles that Experienced Any Delay',
      backgroundColor: 'rgba(66, 152, 245, 0.75)',
      borderColor: 'rgba(200, 200, 200, 0.75)',
      hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
      hoverBorderColor: 'rgba(500, 200, 200, 1)',
      data: amount
    },
    {
      label: 'Total Number of Vehicles Running',
      backgroundColor: 'rgba(245, 176, 66, 0.55)',
      type: 'line', 
      data: totalBuses
    }
  ]
};
var ctx = $("#vehicleChart");
var barGraph = new Chart(ctx, {
  type: 'bar',
  data: chartdata,
  options: {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number of Vehicles'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time of Day (hour)'
        }
      }]
    }     
  }
});

//display bar chart data -> update based on date selection and route
function vehicleDelayBarChart(day, route) {
  $.ajax({
    url: "backend/performance/bardata.php",
    method: "GET",
    dataType: 'text',
    data: {date: day, route: route},
    success: function(data) {
      if (data.length <= 2) {
        return;
      }
      document.getElementById("vehicleChart").style.display = "block";
      document.getElementById("vehicleChartLoading").style.display = "none";
      var data = JSON.parse(data);
      time = [];
      amount = [];
      totalBuses = [];
      for(var i in data) {
        time.push(data[i].hour);
        amount.push(data[i].noDly);
        totalBuses.push(data[i].noVid);
      }
      barGraph.data.labels = time;
      barGraph.data.datasets[0].data = amount;
      barGraph.data.datasets[1].data = totalBuses;
      barGraph.update();
    },
    error: function(data) {
      alert(data);
    }
  });
}

//the route that has been selected for display
var currentRoute = null;

//called when user selects a route to display
function dataByRoute(routeValue) {
  if (routeValue == "clear") {
    currentRoute = null;
    document.getElementById("tableTitle").innerHTML = "Most Delayed Routes*"
    document.getElementById("idColumn").innerHTML = "Route ID";
  }
  else {
    currentRoute = routeValue;
    document.getElementById("tableTitle").innerHTML = "Most Delayed Vehicles of Route " + currentRoute + "*";
    document.getElementById("idColumn").innerHTML = "Vehicle ID";
  }
  getDay();
}

//get the current days
function getDays() {
  var startValue = document.getElementById('startdate').value;
  var [year, month, day] = startValue.split('-').map(Number);
  var start = new Date(year, month - 1, day);
  var truestart = `${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getDate().toString().padStart(2, '0')}/${start.getFullYear()}`;
  var endValue = document.getElementById('enddate').value;
  var [year, month, day] = endValue.split('-').map(Number);
  var end = new Date(year, month - 1, day);
  var trueend = `${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}/${end.getFullYear()}`;
  var days = truestart + " 00:00" + "-" + trueend + " 23:59";
  return days;
}

//sets end date to today
function setToday() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');
  document.getElementById('enddate').value = year + '-' + month + '-' + day;
}

//on click of "view all-time data"
function allTime() {
  setToday();
  document.getElementById('startdate').setAttribute('value', '2022-10-18');
  getDay();
}

//on click of "view data for today"
function today() {
  setToday();
  document.getElementById('startdate').setAttribute('value', document.getElementById('enddate').value);
  getDay();
}

var delays = L.layerGroup();
function getDay() {
  if (getDays() == "<?php echo date('m/d/Y'); ?> 00:00-<?php echo date('m/d/Y'); ?> 23:59") {
    showDelays(getDays(), currentRoute);
  }
  if (getDays() == "10/18/2022 00:00-<?php echo date('m/d/Y'); ?> 23:59") {
    defaultMap(getDays(), currentRoute);
  }
  vehicleDelayBarChart(getDays(), currentRoute);
  document.getElementById("tableloading").style.display = "block";
  document.getElementById("maploading").style.display = "flex";
  for (var i = 0; i < document.getElementsByName("preselection").length; i++) {
    document.getElementsByName("preselection")[i].style.display = 'none'; 
  }
  document.getElementById("vehicleChartLoading").style.display = "block";
  document.getElementById("routesTable").style.display = "none";
  document.getElementById("disclaimer").style.display = "none";
  document.getElementById("vehicleChart").style.display = "none";
  const xhttp = new XMLHttpRequest();
  
  xhttp.onload = function() {
    if (this.responseText == "N/A") {
      for (var i = 0; i < document.getElementsByName("preselection").length; i++) {
        document.getElementsByName("preselection")[i].style.display = 'block'; 
        document.getElementsByName("preselection")[i].innerHTML = "There is no data for this date range";
      }
      document.getElementById("tableloading").style.display = "none";
      document.getElementById("vehicleChartLoading").style.display = "none";
      document.getElementById("maploading").style.display = "none";
    }
    else {
      document.getElementById("tableloading").style.display = "none";
      document.getElementById("routesTable").style.display = "block";
      document.getElementById("body").innerHTML = this.responseText;
      document.getElementById("disclaimer").style.display = "block";
      delays.addTo(map2);
    }
  }
  xhttp.open("GET", "backend/performance/today.php?day=" + getDays() + "&route=" + currentRoute);
  xhttp.send();
}

//display the popup
function popupGeneration(e, day) {
  $.ajax(
    {
      url: "backend/performance/delayPopup.php",
      type: 'POST',
      dataType: 'text',
      data: {date: day, lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng, val: e.target.options.title},
      success: function (responseText)
      {
        var marker = e.target;
        var popupContent = responseText;
        marker.bindPopup(popupContent).openPopup();
      },         
      error: function (responseText)
      {
        console.log(responseText);
      }
  });
}

//delay Map when not all-time
function showDelays(day, route) {
  $.ajax(
    {
      url: "backend/performance/delayMap.php",
      type: 'POST',
      dataType: 'text',
      data: {date: day, route: route},
      success: function (responseText)
      {
        delays.clearLayers();
        eval(responseText);
        delays.addTo(map2);
        delays.eachLayer(function(layer) {
          if (layer instanceof L.CircleMarker) {
            layer.on('click', function(e) {
              popupGeneration(e, day);
            });
          }
        });
        document.getElementById("maploading").style.display = "none";
      },
      error: function (responseText)
      {
        console.log(responseText);
      }
  });
}

//refresh map to avoid bugs in map display
setTimeout(function () {
  map2.invalidateSize(true);
}, 100);
setTimeout(function () {
  window.dispatchEvent(new Event("resize"));
}, 200);

//legend associated with the delay map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map2) {
  var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 1, 5, 10, 15, 20, 25, 30],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += "<h4 class='font-bold'>Percentage Delays</h4>";
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br>' : '+');
    }
    return div;
};
legend.addTo(map2);
function getColor(d) {
    return d > 30 ? '#b10026' :
            d > 25 ? '#d90202' :
            d > 20  ? '#ff620d' :
            d > 15  ? '#fd8d3c' :
            d > 10  ? '#feb24c' :
            d > 5   ? '#fed976' :
            d > 1   ? '#fcf344' :
            d > 0   ? '#90f060' :
                      '#FFEDA0';
}

//on default page load display all time data 
document.addEventListener("DOMContentLoaded", function() {
  allTime();
});

//default map to quickly display all time data -> will need to be updated
function defaultMap(day, route) {
  $.ajax(
    {
      url: "backend/performance/defaultMap.php",
      type: 'POST',
      dataType: 'text',
      data: {route: route},
      success: function (responseText)
      {
        delays.clearLayers();
        eval(responseText);
        delays.addTo(map2);
        delays.eachLayer(function(layer) {
          if (layer instanceof L.CircleMarker) {
            layer.on('click', function(e) {
              popupGeneration(e, day);
            });
          }
        });
        document.getElementById("maploading").style.display = "none";
      },          
      error: function (responseText)
      {
        console.log(responseText);
      }
  });
}

