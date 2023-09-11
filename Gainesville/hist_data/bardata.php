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
//query to get data from the table
//$sql = "SELECT count(distinct `vid`) as noVid, sum(`dly` = 'True' or `dly` = 1) as countdly, count(*) as totalcount, round(sum(`dly` = 'True' or `dly` = 1) * 100 / count(*),2) as noDly, SUBSTRING(`tmstmp`, 10, 2) AS hour FROM `data` where SUBSTRING(`tmstmp`, 10, 2) != \"\" group by hour ORDER BY `hour` ASC;";
$sql = "SELECT count(vehicles) as noVid, sum(dlystat > 0) as noDly, hour from (select distinct `vid` as vehicles,  sum(`dly` = 'True' or `dly` = 1) as dlystat, SUBSTRING(`tmstmp`, 10, 2) AS hour FROM `data` where SUBSTRING(`tmstmp`, 10, 2) != 0 AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' group by hour, `vid`) alistable group by hour;";
//execute query
$result = $conn->query($sql);

//loop through the returned data
$data = array();
foreach ($result as $row) {
  $data[] = $row;
}

//free memory associated with result
$result->close();

//now print the data
echo json_encode($data);