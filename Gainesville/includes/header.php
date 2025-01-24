<!DOCTYPE html>
<html lang="en">
    <?php
$hovered = false;
$today = date_create();
?>
<head>
  <meta charset="utf-8">
  <link rel="shortcut icon" type="image/x-icon" href="images/mainbus.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.3/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <script type="text/javascript" src="//unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
  <link href="//unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

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

<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>

<script
src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
</script>
  <title>GatorRide</title>
</head>
<style>
  .truncatetext {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; 
    line-height: 1.8;
    max-height: 3em;
}
</style>
<script>
  var aboutOpen = false;
  document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem('firstVisit')) {
      localStorage.setItem('firstVisit', 'true');
      document.getElementById("aboutPage").style.display = "flex";
  } 
});
  function closeAbout() {
    document.getElementById("aboutPage").style.display = "none";
    aboutOpen = false;
  }
  function openAbout() {
    document.getElementById("aboutPage").style.display = "flex";
    aboutOpen = true;
  }
</script>
<body class="relative h-screen w-screen bg-slate-100/40 pb-0" onload="realtimeLoading(<?php if ($page === 'realtime') echo 'true'; else echo 'false'?>)">
<div class="flex flex-row justify-between mb-1">
    <div class="ml-2 mr-2">
    <a href="index.php?page=realtime">
      <div class="flex flex-row">
        <h1 class="text-5xl text-green-700/80 font-bold">Gator</h1>
        <h1 class="text-5xl text-slate-900/70 font-bold">Ride</h1>
      </div>
      </a>
      <p class="float-right -mt-2 text-slate-900/70 font-bold text-xs">By Ksenia Velichko</p>
    </div>
    <img class="h-10 mt-3 mr-4" src="images/j&g.jpeg" alt="Just&Green Transportation Lab Logo" />
  </div>
  <div class="flex w-screen justify-between flex-row mr-2">
    <div class="flex flex-row gap-4 text-slate-900/80 -mb-1 ml-5 font-bold">
      <a href="index.php?page=realtime"><h1 class="truncatetext underline-offset-4 decoration-2 text-base cursor-pointer rounded-md px-2 <?php if ($page === 'realtime') echo 'text-green-700/80 underline'; else echo 'hover:underline'?>">Real-Time Info</h1></a>
      <a href="index.php?page=performance"><h1 class="truncatetext underline-offset-4 decoration-2 text-base cursor-pointer rounded-md px-2 <?php if ($page === 'performance') echo 'text-green-700/80 underline'; else echo 'hover:underline'?>">Performance Tracking</h1></a>
      
      <details class="dropdown">
        <summary id="amenityLink" class="truncatetext underline-offset-4 decoration-2 text-base cursor-pointer rounded-md px-2 <?php if ($page === 'crowdsourcing' || $page === 'system_data') echo 'text-green-700/80 underline'; else echo 'hover:underline'?>">Bus Stop Amenities</summary>
        <ul class="menu dropdown-content bg-base-100 mt-2 text-[13px] rounded-box z-[1] w-52 p-2 shadow">
          <li class="mb-1 <?php if ($page === 'system_data') echo 'bg-green-600/30 rounded-lg text-green-900/80';?>"><a id="data" href="index.php?page=system_data"><h1>View System Data</h1></a></li>
          <li class="mb-1 <?php if ($page === 'crowdsourcing') echo 'bg-green-600/30 rounded-lg text-green-900/80';?>"><a id="report" href="index.php?page=crowdsourcing"><h1>Crowdsourcing Tool</h1></a></li>
          <li class="<?php if ($page === 'busstopcv') echo 'bg-green-600/30 rounded-lg text-green-900/80';?>"><a id="busstopcv" href="index.php?page=busstopcv"><h1>Bus Stop Census AI Tool</h1></a></li>
        </ul>
      </details>
      
      <a href="index.php?page=user_feedback"><h1 class="truncatetext underline-offset-4 decoration-2 text-base cursor-pointer rounded-md px-2 <?php if ($page === 'user_feedback') echo 'text-green-700/80 underline'; else echo 'hover:underline'?>">User Feedback</h1></a>
      <h1 onclick="openAbout()" class="truncatetext underline-offset-4 decoration-2 text-base cursor-pointer rounded-md px-2 <?php if ($page === 'about') echo 'text-green-700/80 underline'; else echo 'hover:underline'?>">About</h1>
    </div>
    <div id="timeMain" class="whitespace-nowrap pl-2 font-bold text-slate-900/70 mr-2">1/01/2024 10:25:50 AM</div>
  </div>
  <div id="aboutPage" class="hidden flex justify-center">
    <?php include 'pages/about.php'?>
  </div>
  <div id="aboutcvPage" class="hidden flex justify-center">
    <?php include 'pages/aboutcv.php'?>
  </div>
  <div id="confirmPage" class="hidden flex justify-center">
    <?php include 'pages/confirm.php'?>
  </div>



