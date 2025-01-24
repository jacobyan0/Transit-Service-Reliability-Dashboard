<?php
require_once('config.php');
$data = json_decode($_POST['data'], true);


$stopID = $data['stopID'];
$benches = 0;
$trashcans = 0;
$shelters = 0;
$signage = 0;
foreach ($data['labelStats']['locationToVerifiedLabels'][""] as $amenity) {
    if ($amenity['verificationState'] == "VERIFIED_CORRECT") {
        if ($amenity['labelType'] == 'signage') {
            $signage++;
        }
        if ($amenity['labelType'] == 'trashcan') {
            $trashcans++;
        }
        if ($amenity['labelType'] == 'seating') {
            $benches++;
        }
        if ($amenity['labelType'] == 'shelter') {
            $shelters++;
        }
    }
}
$sql = "INSERT ignore into `cv_census` (stop_id, benches, trashcans, shelters, signage) VALUES ('$stopID', '$benches', '$trashcans', '$shelters', '$signage')";
$result = $conn->query($sql);