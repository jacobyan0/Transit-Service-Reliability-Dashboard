<?php
//setting header to json
require_once('../backend/config.php');
$day = $_GET["date"];
$start = substr($day, 0, 16);
$end = substr($day, 17, 31);
$startdate=date_create($start);
$start = date_format($startdate,"Ymd H:i");
$enddate=date_create($end);
$end = date_format($enddate,"Ymd H:i");

$sql = "SELECT count(route) as noRt, sum(dlystat > 0) as noDly, hour from (select distinct `rt` as route, sum(`dly` = 'True' or `dly` = 1) as dlystat, SUBSTRING(`tmstmp`, 10, 2) AS hour FROM `data` where SUBSTRING(`tmstmp`, 10, 2) != 0 AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' group by hour, `rt`) alistable group by hour;";

$result = $conn->query($sql);

$data = array();
foreach ($result as $row) {
  $data[] = $row;
}

$result->close();

echo json_encode($data);