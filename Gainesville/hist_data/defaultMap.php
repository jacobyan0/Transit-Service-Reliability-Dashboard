<?php
    require_once('../backend/config.php');
    $route = $_POST["route"];
   
    $sql = "SELECT * FROM `delay_ratio` HAVING ratio > 0 ORDER BY `delay_ratio`.`ratio` ASC;";
    if ($route > 0) {
        $sql = "SELECT * FROM `delay_ratio` JOIN results ON ROUND(results.stop_lat, 10) = ROUND(delay_ratio.lat, 10) AND ROUND(results.stop_lon, 10) = ROUND(delay_ratio.lon, 10)
            WHERE results.route_id = $route HAVING ratio > 0;";
    }
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $val = $row['ratio'];
            $x = $row['lat'].",".$row['lon'];
            if ($val <= 100 && $val >= 30) {
                $color = "#b10026";
            }
            elseif ($val < 30 && $val >= 25) {
                $color = "#d90202";
            }
            elseif ($val < 25 && $val >= 20) {
                $color = "#ff620d";
            }
            elseif ($val < 20 && $val >= 15) {
                $color = "#fd8d3c";
            }
            elseif ($val < 15 && $val >= 10) {
                $color = "#feb24c";
            }
            elseif ($val < 10 && $val >= 5) {
                $color = "#fed976";
            }
            elseif ($val < 5 && $val >= 1) {
                $color = "#fcf344";
            }
            elseif ($val < 1) {
                $color = "#90f060";
            }
            echo "L.circleMarker([".$x."], {radius:4, weight:10, opacity:0.4, fillOpacity:1, fill:true, title: '".$val."', fillColor:'".$color."', color:'".$color."'}).addTo(delays);";
        }
    }
    else {
        echo "No data for this date range";
    }