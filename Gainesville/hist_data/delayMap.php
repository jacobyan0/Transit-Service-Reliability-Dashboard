
<?php
    require_once('../backend/config.php');
    $day = $_POST["date"];
    $route = $_POST["route"];
    $start = substr($day, 0, 16);
    $end = substr($day, 17, 31);
    $startdate=date_create($start);
    $start = date_format($startdate,"Ymd H:i");
    $enddate=date_create($end);
    $end = date_format($enddate,"Ymd H:i");

    $sql = "SELECT ontime.results.stop_lat, ontime.results.stop_lon, (SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS delay_ratio FROM ontime.results JOIN ontime.data ON ontime.results.route_id = ontime.data.rt WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND ST_Distance_Sphere(POINT(ontime.results.stop_lon, ontime.results.stop_lat), POINT(ontime.data.lon, ontime.data.lat)) <= 30.48 GROUP BY ontime.results.stop_lat, ontime.results.stop_lon HAVING delay_ratio > 0 ORDER BY `delay_ratio` ASC;";
    if ($route > 0) {
        $sql = "SELECT ontime.results.stop_lat, ontime.results.stop_lon, (SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) / SUM(CASE WHEN ontime.data.dly in ('False', 0) THEN 1 ELSE 0 END)) * 100 AS delay_ratio FROM ontime.results JOIN ontime.data ON ontime.results.route_id = ontime.data.rt WHERE `rt` = $route AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND ST_Distance_Sphere(POINT(ontime.results.stop_lon, ontime.results.stop_lat), POINT(ontime.data.lon, ontime.data.lat)) <= 30.48 GROUP BY ontime.results.stop_lat, ontime.results.stop_lon HAVING delay_ratio > 0 ORDER BY `delay_ratio` ASC;";
    }
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $val = $row['delay_ratio'];
            $x = $row['stop_lat'].",".$row['stop_lon'];
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