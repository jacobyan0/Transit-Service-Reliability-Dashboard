<?php
	require_once('../backend/config.php');
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $time = htmlspecialchars($_POST['time']); 
        $date = htmlspecialchars($_POST['date']); 
        $location = htmlspecialchars($_POST['location']); 
        $description = htmlspecialchars($_POST['description']);
        $type = htmlspecialchars($_POST['type']); 
        $form = htmlspecialchars($_POST['form']); 
        $reason = htmlspecialchars($_POST['reason']);
        $bus = htmlspecialchars($_POST['bus']); 
        $route = htmlspecialchars($_POST['route']); 
        $severity = htmlspecialchars($_POST['severity']);
        $nature = htmlspecialchars($_POST['nature']);

        if ($bus == null) {
            $bus = NULL;
        }
        if ($route == null) {
            $route = NULL;
        }

        $datetime = $date . ' ' . $time;
        $tmstmp = date('Y-m-d H:i:s', strtotime($datetime));

        $sql = "INSERT ignore into `user_feedback` (tmstmp, location, description, type, form, reason_for_feedback, bus_id, route_id, severity, nature_of_incident) VALUES ('$tmstmp', '$location', '$description', '$type', '$form', '$reason', '$bus', '$route', '$severity', '$nature')";
        $result = $conn->query($sql);
    }

    header("Location: ../index.php?page=reportform");
    exit();