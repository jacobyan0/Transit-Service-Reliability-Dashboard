<style>
    #map2 {
        height: 90%;
    }
    h3 {
      font-weight: 900;
      color: #3bbf40;
      font-size: 14px;
    }
    #maploading {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 90%;
      background-color: rgb(255, 255, 255, 0);
      z-index: 90;
      display: flex;
      justify-content: center;
      align-items: center;
      display: none;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
        padding: 2px;
        text-align: center;
    }
    .leaflet-popup-content-wrapper {
        width: 300px !important;
    }
</style>
<div class="bg-green-700/40 shadow-lg p-4 h-5/6 text-slate-900/70 text-base-content overflow-auto flex flex-row">
  <div class="overflow-auto w-1/2">
    <div class="flex flex-col">
      <div class="bg-white/60 rounded-lg mb-4 p-3">
      <h1 id="tableTitle" class="text-lg font-bold">Most Delayed Routes*</h1>
        <div name="preselection">Select a date range to display data.</div>
        <div id="tableloading" class="hidden">
          <div class="flex flex-col items-center justify-center" role="status">
              <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
        </div>
        <table id="routesTable" class="hidden bg-green-600/20 w-100% text-center rounded-lg p-2 mb-1">
          <thead>
            <th id="idColumn" class="w-1/5">Route ID</th>
            <th class="pl-4 w-2/5">Total % of Delays</th>
            <th class="pl-4 w-2/5">Avg. Number of Delays Per Day</th>
          </thead>
          <tbody id="body" class="border-t-2 border-green-700/50">
          </tbody>
        </table>
        <div id="disclaimer" class="hidden text-xs">*The total % of delays is calculated as the percentage of times, in total, that the bus has 
          been delayed over the course of the selected time period.
          Bus status is collected every 15 seconds, which makes the data above only a rough estimate of the exact bus status at any given moment.
          The average number of delays per day does not take into account days that a bus is not running over the course of the selected time period.
        </div>
        </div>
      <div class="bg-white/60 rounded-lg w-100% p-3">
        <h1 class="text-lg font-bold">Vehicles Delayed by Hour of Day</h1>
        <div name="preselection">Select a date range to display data.</div>
        <div id="vehicleChartLoading" class="hidden w-full rounded-lg">
          <div class="flex flex-col items-center justify-center" role="status">
            <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <canvas class="hidden" id="vehicleChart"></canvas>
      </div>
    </div>
  </div>
  <div class="w-1/2 relative ml-4">
    <div class="text-sm font-semibold rounded-lg mb-2">
      <div class="flex flex-row gap-2">
        <div class="flex flex-col gap-2 w-full justify-left">
          <div class="flex flex-row items-center text-base w-full">
            <input type="date" onblur="getDay()" value="2022-10-18" min="2022-10-18" name="startdate" id="startdate" class="grow p-1 mr-2 px-2 bg-white/60 cursor-pointer hover:bg-white/70 rounded-lg max-w-xs"/><ion-icon class="content-center" name="arrow-forward-outline"></ion-icon>
            <input type="date" onblur="getDay()" min="2022-10-18" name="enddate" id="enddate" class="grow p-1 ml-2 px-2 bg-white/60 cursor-pointer hover:bg-white/70 rounded-lg max-w-xs"/>
          </div>
          <div class="flex flex-row">
            <div onclick="today()" class="rounded-lg p-1 px-2 bg-[#448b5c]/45 cursor-pointer hover:bg-white/50 font-semibold">View Data for Today</div>
            <div class="divider divider-horizontal text-slate-900/70"></div>
            <div onclick="allTime()" class="rounded-lg p-1 px-2 bg-[#448b5c]/45 cursor-pointer hover:bg-white/50 font-semibold">View All-Time Data</div>
          </div>
        </div>
        <div class="divider divider-horizontal text-slate-900/70"></div>
        <select id="routeSelection" onchange="dataByRoute(this.value)" class="mt-2 rounded-lg text-base hover:bg-[#448b5c]/60 px-2 bg-[#448b5c]/45 select w-full">
          <option disabled selected value="none">View Data by Route</option>
          <option value="clear">Clear</option>
          <?php
            $sql = "SELECT `route_id`, `route_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
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
      </div>
    </div>
    <div id="map2" class="w-full m-auto rounded-lg"></div>
    <div id="maploading" class="w-full rounded-lg">
      <div class="flex flex-col items-center justify-center" role="status">
          <svg aria-hidden="true" class="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div> 
</div>
<script>
    <?php include 'js/performance.js'?>
</script>

