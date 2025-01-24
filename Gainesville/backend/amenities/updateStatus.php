<?php
require_once('../config.php');
$id = $_POST["id"];
$status = $_POST["status"];

$sql = "UPDATE cv_census SET user_status = '$status' WHERE id = $id";
$result = $conn->query($sql);

