<?php
    require_once('../config.php');
    
    if (isset($_POST['stopArray'])) {
        $stopArray = $_POST["stopArray"];
        $stopArray = json_decode($stopArray);
    }
    $sql = "SELECT * FROM `stop_inventory`";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stopid = $row['id'];
            $stopname = $row['stop_name'];
            $desc = $row['stop_desc'];
            $lat = $row['lat'];
            $lon = $row['lon'];
            $benches = $row['benches'];
            $trashcans = $row['trashcans'];
            $shelters = $row['shelters'];
            $shelterType = $row['shelter_type'];
            $bikeracks = $row['bikeracks'];
            $image = $row['image_url'];
            $link = $row['gsv_url'];
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