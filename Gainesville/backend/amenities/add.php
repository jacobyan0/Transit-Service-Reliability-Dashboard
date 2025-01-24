<?php
	require_once('../config.php');
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $id = htmlspecialchars($_POST['stopID']); 
        $benches = htmlspecialchars($_POST['benches']); 
        $trashcans = htmlspecialchars($_POST['trashcans']); 
        $shelters = htmlspecialchars($_POST['shelters']);
        $type = htmlspecialchars($_POST['type']); 
        $bikeracks = htmlspecialchars($_POST['bikeracks']); 
        $sql = "SELECT * FROM `stop_inventory` WHERE id = $id";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                if ($benches != $row['benches'] || $trashcans != $row['trashcans'] || $shelters != $row['shelters'] || strtolower($type) != strtolower($row['shelter_type']) || $bikeracks != $row['bikeracks']) {
                    $sql1 = "INSERT ignore into `amenity_census` (stop_id, benches, trashcans, shelters, shelter_type, bikeracks) VALUES ('$id', '$benches', '$trashcans', '$shelters', '$type', '$bikeracks')";
                    $result1 = $conn->query($sql1);
                }
            }
        }
    }

    header("Location: ../../index.php?page=crowdsourcing");
    exit();