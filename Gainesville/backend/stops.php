<?php
	require_once('config.php');
    $route = $_POST['route'];
    $sql = "SELECT * FROM `routes_by_stop` WHERE `route_id` = $route";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stop_id = $row['stop_id'];
            echo "if (stop_markers.hasOwnProperty($stop_id)) {";
            echo "stop_markers[$stop_id].addTo(map);\n";

            echo "if (displayedMarkers) {displayedMarkers.add(stop_markers[$stop_id].getLatLng());}}";
        }
    }
