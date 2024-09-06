<?php
    require_once('../backend/config.php');
    $date = $_REQUEST["date"]; 
    $file = fopen("../data/20221018.csv", "r", FILE_SKIP_EMPTY_LINES) or die("Unable to open file!");
    
   
    while(!feof($file)) {
        $line = fgetcsv($file);
        if ($line[1] == "vid") {
            continue;
        }
        if ($line[0] == "88") {
            break;
        }
        $vid = $line[1];
        $tmstmp = $line[2];
        $lat = $line[3];
        $lon = $line[4];
        $rt = $line[7];
        $des = $line[8];
        $dly = $line[10];
        if ($line[0] == "1") {
            $wholetime = explode(" ", $tmstmp);
            $time = $wholetime[1];
            $seconds = substr($time, -2);
            $seconds = floor($seconds*.1)*10;
            $time = substr($time, 0, 6) . $seconds;
            echo "time = '" . $time . "';";
            echo "countDownDate = new Date(date + ' ' + time);";
            echo "z = setInterval(change, 300);";
            
        }
        if ($dly == "True")
            $color = '#f02f11';
        else
            $color = '#9ced45';
        $sql = "SELECT `route_color` FROM `routes` WHERE `route_id` = $rt";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $rtcolor = $row['route_color'];
            }
        }
        echo "L.circleMarker([$lat,$lon], {radius:8, opacity:0.8, fill:'True', fillOpacity:1, weight:3, fillColor:'#".$rtcolor."', color:'".$color."'}).addTo(map).bindPopup(\"" . $rt ."</br>Destination: $des\");";
        echo "document.getElementById('$rt').innerHTML = 'Destination: $des';";
    }
    $conn->close();
    fclose($file);