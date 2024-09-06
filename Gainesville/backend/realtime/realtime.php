<?php
	require_once('../config.php');
    $file = fopen("../../data/realtime.csv", "r") or die("Unable to open file!");
    
    $warning = fgets($file);
    
    $alreadyRead = false;
    if (trim($warning) !== "read") {
        $realtime_content = file_get_contents("../../data/realtime.csv");
        $updated = "read\n" . $realtime_content;
        file_put_contents("../../data/realtime.csv", $updated);
    }
    else {
        $alreadyRead = true;
    }

    if (isset($_POST['busArray'])) {
        $busArray = $_POST["busArray"];
        $busArray = json_decode($busArray);
    }

    while(!feof($file)) {
        $line = fgetcsv($file);
        if ($line[0] == "vid") {
            continue;
        }
        if ($line[0] == "read") {
            continue;
        }
        $vid = $line[0];
        $tmstmp = $line[1];
        $lat = $line[2];
        $lon = $line[3];
        $rt = $line[6];
        $des = $line[7];
        $dly = $line[9];
        
        if ($vid == "") {
            continue;
        }
        if ($dly === "True") {
            $color = '#f02f11';
        }
        else {
            $color = '#3bbf40';
        }
        $sql = "SELECT `route_color` FROM `routes` WHERE `route_id` = $rt";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $rtcolor = $row['route_color'];
            }
        }
        $sql = "SELECT `stop_name`,`stop_desc`,`lat`, `lon`, SQRT( POW(69.1 * (`lat` - $lat), 2) + POW(69.1 * ($lon - `lon`) * COS(`lat` / 57.3), 2)) AS distance FROM stop_inventory HAVING distance < 25 ORDER BY distance LIMIT 1;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $nearestStop = $row['stop_name'];
            }
        }

        $currentBus = null;
        foreach($busArray as &$bus) {
            if ($bus->vid === $vid) {
                $bus->lat = $lat;
                $bus->lon = $lon;
                $bus->dly = $dly;
                $bus->des = $des;
                $bus->dlycolor = $color;
                $bus->nearStop = $nearestStop;
                $currentBus = $bus;
                break;
            }
        }
        if ($currentBus == null) {
            $newBus = new StdClass();
            $newBus->vid = $vid;
            $newBus->rt = $rt;
            $newBus->lat = $lat;
            $newBus->lon = $lon;
            $newBus->dly = $dly;
            $newBus->des = $des;
            $newBus->color = $rtcolor;
            $newBus->dlycolor = $color;
            $newBus->nearStop = $nearestStop;
            array_push($busArray, $newBus);
        }
        if (!$alreadyRead) {
            $sql = "INSERT ignore into `data` (vid, rt, tmstmp, lat, lon, des, dly, nearest_stop) VALUES ('$vid', '$rt', '$tmstmp', '$lat', '$lon', '$des', '$dly', '$nearestStop')";
            $result = $conn->query($sql);
        }
    }
    $conn->close();
    fclose($file);
    echo json_encode($busArray);