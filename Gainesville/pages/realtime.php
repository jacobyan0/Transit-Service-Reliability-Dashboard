<style>
    #map {
        height: 95%;
    }
</style>
    <div class="bg-green-700/40 shadow-lg h-5/6 flex text-slate-900/80 flex-row overflow-auto pb-8">
      <!-- form to add info -->
      <div class="p-4 w-96 text-base-content pb-2">
        <div id="side-content">
          <div class="bg-white rounded-md font-semibold p-3 mb-4">
            <i class="fa fa-question-circle float-left mr-2" style="font-size:36px;color:#F87272"></i>
            <div class="ml-2">Use the selection below to display routes and view buses currently running.</div>
          </div>
          <div id="currData" class="bg-white rounded-md p-3 mb-4 font-semibold">Current data for buses running right now</div>
          <select id="route" onchange="displayRoute(this.value)" class="bg-green-900/60 text-white select text-base font-semibold w-full">
            <option disabled selected value="none">Add Route</option>
            <option value="display">Display routes currently running</option>
            <option value="clear">Clear all</option>
            <?php
              $sql = "SELECT `route_id`, `route_long_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
              $result = $conn->query($sql);
              if ($result->num_rows > 0) {
                // Output data of each row
                while ($row = $result->fetch_assoc()) {
                  $routeid = $row['route_id'];
                  echo "<option value='$routeid'>Route $routeid</option>";
                }
              } else {
                echo "No routes found";
              }
            ?>
          </select>
          <div class="bg-white/40 h-96 rounded-lg mb-4 overflow-auto mt-4">
            <div id="currRoutes" class="mt-2 mb-2 grid grid-cols-2 gap-3 relative overflow-auto sm:grid-cols-2 p-4">
              <div id="loading" class="ml-36 mt-36 hidden">
                <div role="status">
                    <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 flex-1 mb-8">
        <div class="justify-end w-full flex flex-row gap-2">
            
            <div id="busDataMain" class="flex font-bold text-slate-950/70 text-base flex-row gap-4"></div>
            <div class=" px-2 pt-1 text-2xl text-green-950/70  decoration-2 underline-offset-2 font-extrabold rounded-md">Realtime Operational Status</div>
        </div>
        <div id="map" class="w-full m-auto mt-4 mb-4 rounded-lg"></div>
      </div> 
    </div>
</div>
