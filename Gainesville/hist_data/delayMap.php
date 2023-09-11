
<?php
    require_once('../backend/config.php');
    $day = $_POST["date"];
    $start = substr($day, 0, 16);
    $end = substr($day, 17, 31);
    $startdate=date_create($start);
    $start = date_format($startdate,"Ymd H:i");
    $enddate=date_create($end);
    $end = date_format($enddate,"Ymd H:i");

    $delays = array();

    $sql = "SELECT * FROM `data` WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND `dly` in ('True', 1);";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            if (array_key_exists($row['lat'].",".$row['lon'],$delays))
            {
                $delays[$row['lat'].",".$row['lon']]++;
            }
            else
            {
                $delays[$row['lat'].",".$row['lon']] = 1;
            }
        }
    }
    else {
        echo "No data for this date range";
    }
    asort($delays);
    foreach($delays as $x => $val) {
        if ($val >= 30) {
            $color = "#b10026";
        }
        elseif ($val < 30 && $val >= 25) {
            $color = "#e31a1c";
        }
        elseif ($val < 25 && $val >= 20) {
            $color = "#fc4e2a";
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
        elseif ($val < 5) {
            $color = "#ffffb2";
        }
        $points = (explode(",", $x));
        $sql = "SELECT `stop_name`,`stop_desc`,`stop_lat`, `stop_lon`, SQRT( POW(69.1 * (`stop_lat` - $points[0]), 2) + POW(69.1 * ($points[1] - `stop_lon`) * COS(`stop_lat` / 57.3), 2)) AS distance FROM stops HAVING distance < 25 ORDER BY distance LIMIT 1;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $nearestStop = $row['stop_name'];
            }
        }
        else {
            $nearestStop = $x;
        }
        echo "L.circleMarker([".$x."], {radius:4, weight:10, opacity:0.4, fillOpacity:1, fill:true, fillColor:'".$color."', color:'".$color."'}).addTo(delays).bindPopup(\"".$val." near ".$nearestStop."\");";
    }
?>