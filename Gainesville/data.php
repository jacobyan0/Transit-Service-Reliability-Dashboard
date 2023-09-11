
<?php
  $date = $today;
  date_default_timezone_set("America/New_York");
?>
<link rel="stylesheet" href="style.css">
<div class="flex flex-row">
  <div>
    <h1 class="mt-2 ml-4 mb-2 text-3xl text-slate-900 font-bold">Gainesville RTS On-time</h1>
    <h1 onclick="switchTabs('routes')" class="cursor-pointer float-left ml-4 rounded-t-lg text-slate-900/70 text-lg font-bold bg-slate-300/30 hover:bg-slate-300/50 pl-2 pr-4 mr-2">Real-Time Info</h1>
    <h1 onclick="switchTabs('data')" class="cursor-pointer rounded-t-lg text-lg text-slate-900/70 font-bold bg-slate-300/70 ml-40 pr-2">Historical Data</h1>
  </div>
</div>
<div class="bg-slate-300/70 text-slate-900/70 ml-4 mr-4 flex rounded-tr-lg pb-8 rounded-b-lg flex-row pb-4">
  <div class="p-4 overflow-auto w-1/2 text-base-content text-slate-900/70">
    <div class="text-sm font-semibold bg-white/40 rounded-lg mb-2 p-3">
      <h1 class="text-lg font-bold mr-2 mb-2">Show data for:</h1>
        <div class="flex flex-row text-lg">
          <input type="text" onchange="getDay()" name="startdate" id="startdate" class="mr-4 bg-slate-300/50 cursor-pointer hover:bg-slate-300/70 rounded-lg p-1 font-semibold max-w-xs"/><ion-icon class="mt-2" name="arrow-forward-outline"></ion-icon>
          <input type="text" onchange="getDay()" name="enddate" id="enddate" class="ml-4 bg-slate-300/50 cursor-pointer hover:bg-slate-300/70 rounded-lg p-1 font-semibold max-w-xs"/>
        </div>
        <h1 class="text-lg font-bold mr-2 mt-2 mb-2">or</h1>
        <div onclick="today()" class="text-lg bg-slate-300/50 hover:bg-slate-300/70 rounded-lg p-1 cursor-pointer bg-slate-200/0 font-semibold text-slate-900/70">See data for today</div>
    </div>
    <div class="grid grid-flow-row auto-rows-1">
      <div class="bg-white/40 rounded-lg mb-2 p-3">
        <table id="routesTable" class="table-fixed space-x-4">
          <h1 class="text-lg font-bold">Most Delayed Routes*</h1>
          <thead class="space-x-4">
            <th>Route</th>
            <th class="pl-4">Total Min. Delayed</th>
            <th class="pl-4">Avg. Minutes of Delay Per Day</th>
          </thead>
          <tbody id="body" class="space-x-4">
          </tbody>
        </table>
        <div class="text-xs">*The length of delay is based on the assumption that data gathered every 15 seconds represents the status of a vehicle for exactly a 15 second period. This makes the length of delays shown above a useful, but not exact, estimate for comparing routes and getting a general idea of their delay times.</div>
      </div>
      <div class="bg-white/40 rounded-lg mb-2 p-3">
        <h1 class="text-lg font-bold">Vehicles Delayed by Hour of Day</h1>
        <!--<div id="rtDelayGraph"></div>-->
        <div id="chart-container">
          <canvas id="vehChart"></canvas>
        </div>
      </div>
      
    </div>
  </div>
  <div class="flex-1 mr-8 ml-2">
    <div id="map2" style="height: 500px;" class="w-full m-auto rounded-lg mt-4"></div>
    <div class="bg-white/40 mt-2 rounded-lg p-3">
      <h1 class="text-lg font-bold">Routes Delayed by Hour of Day</h1>
      <!--<div class="overflow-x-auto" id="vidDelayGraph"></div>-->
      <div id="chart-container">
          <canvas id="rtChart"></canvas>
        </div>
    </div>
  </div> 
</div>
<script>
  function rtBarData(day){
  $.ajax({
    url: "hist_data/barRtdata.php",
    method: "GET",
    dataType: 'text',
    data: {date: day},
    success: function(data) {
      var data = JSON.parse(data);
      var time = [];
      var amount = [];
      var totalBuses = [];
      for(var i in data) {
        time.push(data[i].hour);
        amount.push(data[i].noDly);
        totalBuses.push(data[i].noRt);
      }

      var chartdata = {
        labels: time,
        datasets : [
          {
            label: 'Number of Routes that Experienced Any Delay',
            backgroundColor: 'rgba(66, 152, 245, 0.75)',
            borderColor: 'rgba(200, 200, 200, 0.75)',
            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
            hoverBorderColor: 'rgba(200, 200, 200, 1)',
            data: amount
          },
          {
            label: 'Total Number of Routes Running',
            backgroundColor: 'rgba(245, 117, 66, 0.45)',
            type: 'line', data: totalBuses
          }
        ]
      };

      var ctx = $("#rtChart");
      var barGraph = new Chart(ctx, {
        type: 'bar',
        data: chartdata,
        options: {
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of Routes'
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
      
    },
    error: function(data) {
      alert(data);
    }
  });
}
  function barData(day) {
  $.ajax({
    url: "hist_data/bardata.php",
    method: "GET",
    dataType: 'text',
    data: {date: day},
    success: function(data) {
      var data = JSON.parse(data);
      var time = [];
      var amount = [];
      var totalBuses = [];
      for(var i in data) {
        time.push(data[i].hour);
        amount.push(data[i].noDly);
        totalBuses.push(data[i].noVid);
      }

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
            type: 'line', data: totalBuses
          }
        ]
      };

      var ctx = $("#vehChart");
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
      
    },
    error: function(data) {
      alert(data);
    }
  });
}
  //import {Legend, Swatches} from "@d3/color-legend"
  var days = "";
  const map2 = L.map('map2', {
    center: [29.652, -82.339],
    zoom: 12,
    maxBounds: L.latLngBounds(L.latLng(29.5808, -82.4735), L.latLng(29.7268, -82.2144)),
    doubleClickZoom: false,
    maxBoundsViscosity: 1,
    bounceAtZoomLimits: false,
    maxZoom: 15,
    minZoom: 12
  });
  setTimeout(function () {
   map2.invalidateSize(true);
  }, 100);
  $(function() {
    $('input[name="startdate"]').daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "minDate": "10/18/2022",
      "autoApply": true,
      "startDate": "10/18/2022",
      "maxDate": "<?php echo date('m/d/Y'); ?>",
      "locale": {
        format: 'MM/DD/YYYY HH:mm'
      }
    });
  });
  $(function() {
    $('input[name="enddate"]').daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "minDate": "10/18/2022",
      "maxDate": "<?php echo date('m/d/Y'); ?>",
      "locale": {
        format: 'MM/DD/YYYY HH:mm'
      }
    });
  });
  function today() {
    var dbParam = "<?php echo date('m/d/Y'); ?>" + " 00:00-" + "<?php echo date('m/d/Y'); ?>" + " 23:59";
    rtBarData(dbParam);
    barData(dbParam);
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function() {
      document.getElementById("body").innerHTML = this.responseText;
      delays.addTo(map2);
      //showPaths();
    }
    
    xhttp.open("GET", "hist_data/today.php?day=" + dbParam);
    xhttp.send();
    showDelays(dbParam);
  }
  var delays = L.layerGroup();
  function getDay() {
    var days = document.getElementById('startdate').value + "-" + document.getElementById('enddate').value;
    rtBarData(days);
    barData(days);
    //alert(start.format('YYYYMMDD') + " to " + end.getFullYear() + end.getMonth() + end.getDate() + " " + end.getHours() + ":" + end.getMinutes());
    var dbParam = days;
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function() {
      document.getElementById("body").innerHTML = this.responseText;
      delays.addTo(map2);
      //showPaths();
    }
    
    xhttp.open("GET", "hist_data/today.php?day=" + dbParam);
    xhttp.send();
    showDelays(dbParam);
    
  }
  function showDelays(day) {
    $.ajax(
      {
        url: "hist_data/delayMap.php",
        type: 'POST',
        dataType: 'text',
        data: {date: day},
        success: function (responseText)
        {
          delays.clearLayers();
          eval(responseText);
          delays.addTo(map2);
        },
                        
        error: function (responseText)
        {
          alert(responseText);
        }
    });
  }
  setTimeout(function () {
   window.dispatchEvent(new Event("resize"));
}, 500);
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 5, 10, 15, 20, 25, 30],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += "<h4 class='font-bold'>No. Delays</h4>";
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map2);
function getColor(d) {
    return d > 30 ? '#b10026' :
           d > 25  ? '#e31a1c' :
           d > 20  ? '#fc4e2a' :
           d > 15  ? '#fd8d3c' :
           d > 10   ? '#feb24c' :
           d > 5   ? '#fed976' :
           d > 0   ? '#ffffb2' :
                      '#FFEDA0';
}
</script>

