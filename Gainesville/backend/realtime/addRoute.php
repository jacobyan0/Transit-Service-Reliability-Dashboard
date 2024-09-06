<?php
    //Displays route buttons on realtime page
    require_once('../config.php');
    $route = $_POST['route'];
    $sql = "SELECT `route_color` FROM `routes` WHERE `route_id` = $route";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $rtcolor = $row['route_color'];
        }
    }
    echo "document.getElementById('currRoutes').innerHTML += '<div id=\"$route\" class=\"cursor-pointer text-white font-semibold bg-[#$rtcolor] pl-2 p-2 rounded-lg\">Route $route <button class=\"float-right btn hover:brightness-90 btn-xs btn-circle bg-[#$rtcolor]\" name=\"route\" value=\"$route\" onClick=\"remove(this.value)\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-3 w-3\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"white\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M6 18L18 6M6 6l12 12\" /></svg></button></div>'";
