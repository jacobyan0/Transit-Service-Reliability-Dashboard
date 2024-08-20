<?php
    require_once('../backend/config.php');
    
    if (isset($_POST['stopArray'])) {
        $stopArray = $_POST["stopArray"];
        $stopArray = json_decode($stopArray);
    }
    $sql = "SELECT * FROM `stop_inventory`";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stopid = $row['ID'];
            $stopname = $row['STOP_NAME'];
            $desc = $row['DESCRIPTION'];
            $lat = $row['LATITUDE'];
            $lon = $row['LONGITUDE'];
            $benches = $row['BENCHES'];
            $trashcans = $row['TRASHCANS'];
            $shelters = $row['SHELTERS'];
            $shelterType = $row['SHELTER_TYPE'];
            $bikeracks = $row['BIKERACKS'];
            $image = $row['IMAGE_URL'];
            $link = $row['GSV_URL'];
            $stop = new StdClass();
            $stop->id = $stopid;
            $stop->name = $stopname;
            $stop->desc = $desc;
            $stop->lat = $lat;
            $stop->lon = $lon;
            $stop->benches = $benches;
            $stop->cans = $trashcans;
            $stop->shelters = $shelters;
            $stop->type = $shelterType;
            $stop->racks = $bikeracks;
            $stop->image = $image;
            $stop->link = $link;
            array_push($stopArray, $stop);
        }
    }
    $conn->close();
    echo json_encode($stopArray);