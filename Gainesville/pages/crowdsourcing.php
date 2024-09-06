<style>
    #map {
        height: 100%;
    }
    h3 {
      font-weight: 900;
      color: #3bbf40;
      font-size: 13px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
        padding: 2px;
        text-align: left;
    }
    .sv_image {
      height: 150px;
      width: 100%;
    }
    .leaflet-popup-content-wrapper {
        width: 300px !important;
    }
    #maploading {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 97%;
      background-color: rgb(255, 255, 255, 0);
      z-index: 90;
      justify-content: center;
      align-items: center;
      display: hidden;
    }
</style>

<script>
  <?php include 'js/amenities.js'?>
</script>

<div class="bg-green-700/40 shadow-lg h-5/6 flex flex-row">
  <div class="p-4 w-1/3 overflow-auto text-base-content mb-4">
    <div id="reportMarker" class="bg-white/80 text-slate-900/80 text-base rounded-lg font-semibold p-3">
      <div id="defaultInfoText">
        This page allows users to view amenities by bus stop and provide data.</br>
        To view or provide data:
          <ul class="list-disc ml-5 font-normal">
            <li>Click on a stop from the map</li>
            <li>Use the Search feature below</li>
            <li>Use the Current Location feature to view stops within 1/2 mile of your current location</li>
            <li>Use the View Stops by Route feature</li>
          </ul>
          <div class="text-sm font-normal mt-2">*Names marked in <span class="text-red-500">red</span> represent stops that have no associated data.</div>
      </div>
    </div>
    <div class="bg-white/90 text-slate-900/80 text-base rounded-lg font-semibold p-3 mt-5">
      <form id="stopForm">
          <div class="text-lg font-bold mb-2" id="title">Stop Name</div>
          <div class="ml-2 mb-4 grid grid-cols-2 gap-4">
            <div class="flex flex-row">
              <label for="benches">Benches:</label>
              <input type="number" value="0" onKeyDown="return false" name="benches" class="ml-2 input input-bordered w-1/3 input-sm" id="benches" min="0" max="50"><br>
            </div>
            <div class="flex flex-row">
              <label for="trashcans">Trashcans:</label>
              <input type="number" value="0" onKeyDown="return false" name="trashcans" class="input input-bordered w-1/3 ml-2 input-sm" id="cans" min="0" max="50"><br>
            </div>
            <div class="flex flex-row">
              <label for="shelters">Shelters:</label>
              <input type="number" value="0" onKeyDown="return false" name="shelters" class="input input-bordered input-sm w-1/3 ml-2" id="shelters" min="0" max="50"><br>
            </div>
            <div class="flex flex-row">
              <label for="bikeracks">Bikeracks:</label>
              <input type="number" value="0" onKeyDown="return false" name="bikeracks" class="input input-bordered input-sm w-1/3 ml-2" id="racks" min="0" max="50"><br>
            </div>
          </div>
          <div class="flex flex-row ml-2">
            <label for="type">Shelter Type:</label>
            <select id="type" name="type" class="select select-bordered select-sm ml-2 max-w-xs">
              <option value="none" selected>None</option>
              <option value="architectural">Architectural</option>
              <option value="building">Building</option>
              <option value="building overhang">Building Overhang</option>
              <option value="concrete">Concrete</option>
              <option value="metal">Metal</option>
              <option value="wood">Wood</option>
            </select>
          </div>
          <div class="flex flex-row items-center justify-evenly font-bold gap-2 mt-4">
              <button type="button" onclick="resetAmenities()" class="hover:bg-[#448b5c]/80 bg-[#448b5c]/75 text-white font-bold border-0 px-2 p-1 basis-1/2 rounded-lg">Reset</button>
              <button type="submit" onclick="submitForm(event)" class="rounded-lg hover:bg-[#448b5c]/80 bg-[#448b5c]/75 text-white font-bold border-0 px-2 p-1 basis-1/2">Submit</button>
          </div>	
          <div id="feedback" class="hidden mt-2 text-green-700/70 font-semibold flex w-full items-center justify-center">
            <div>Your form has been successfully submitted!
            </div>
          </div>
      </form>
    </div>
    <div class="rounded-lg mt-5 bg-white/80 font-semibold text-base p-4 m-auto">
      <label class="input input-sm flex w-full items-center  text-[#448b5c]/70  gap-2">
        <input type="text" class="grow" maxlength="50" onkeyup="searchMarkers()" onkeydown="searchMarkers()" id="stopSearchInput" placeholder="Search" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
      </label>
      <div class="divider mb-1 mt-1"></div> 
      <button onclick="userLocation()" class="btn btn-sm text-left border-0 p-0 text-base w-full text-white/90 hover:bg-[#448b5c]/80 bg-[#448b5c]/75">Search By Current Location</button>
      <div class="divider mb-1 mt-1"></div> 
      <select id="stopRoute" onchange="findStops(this.value)" class="text-white/90 hover:bg-[#448b5c]/80 bg-[#448b5c]/75 text-base select select-sm w-full">
        <option disabled selected value="none">View Stops by Route</option>
        <option value="clear">Clear</option>
        <?php
          $sql = "SELECT `route_id`, `route_long_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
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
  <div class="w-2/3 relative flex-1 mr-8 mb-8">
    <div id="map" class="w-full ml-4 m-auto rounded-lg mt-4"></div>
    <div id="maploading" class="hidden w-full ml-4 rounded-lg">
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


