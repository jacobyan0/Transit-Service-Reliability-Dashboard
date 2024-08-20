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
</style>
<script>
  <?php include 'js/amenityscript.js'?>
</script>
<div class="bg-green-700/40 shadow-lg h-5/6 flex flex-row">
  <div class="p-4 w-1/3 overflow-auto text-base-content mb-4">
    <div class="bg-white/70 p-3 rounded-lg text-base text-slate-900/80 font-semibold">
    <div class="text-2xl md:text-lg font-bold font-sans text-green-700/70">Amenity Data</div>
    <table id="amenityTable" class="table-auto bg-green-600/20 gap-2 text-center rounded-lg p-4">
      <thead>
        <tr>
          <th>Amenity</th>
          <th>No. Stops</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody class="text-base font-normal content-center border-t-2 border-green-700/50">
      </tbody>
    </table>
    Total Number of Stops: 1107
    <div class="text-lg md:text-lg font-bold font-sans text-green-700/70 mt-2">View Stops by Amenities</div>
      <div class="grid grid-cols-3 font-normal" onchange="showAmenities()">
          <div><input type="checkbox" id="benchBox" class="amenities" name="incident-severity[]" value="bench"> Bench(es)<br></div>
          <div><input type="checkbox" id="shelterBox" class="amenities" name="incident-severity[]" value="shelter"> Shelter(s)<br></div>
          <div><input type="checkbox" id="trashBox" class="amenities" name="incident-severity[]" value="trash"> Trashcan(s)<br></div>
          <div><input type="checkbox" id="bikeBox" class="amenities" name="incident-severity[]" value="bike"> Bikerack(s)<br></div>
          <div><input type="checkbox" id="none" class="amenities" name="incident-severity[]" value="none"> None<br></div>
      </div>
      <div id="amenityInfo" class="mt-1 text-green-700/70"></div>
    </div>
  </div>
  <div class="flex-1 mr-8 mb-8">
    <div id="map" class="w-full ml-4 m-auto rounded-lg mt-4"></div>
  </div> 
</div>