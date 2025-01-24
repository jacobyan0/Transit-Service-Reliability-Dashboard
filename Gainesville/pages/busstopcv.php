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
    .about {
        position: fixed;
        width: 70%;
        height: 70%;
        max-height: 70vh;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        margin-top: 30px;
        overflow: scroll;
    }
</style>

<script>
  <?php include 'js/amenities.js'?>
</script>

<div class="relative bg-green-700/40 shadow-lg h-5/6 flex flex-row">
  <div class="relative flex-1 mr-8 mb-8">
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