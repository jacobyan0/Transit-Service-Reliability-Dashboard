<?php
require_once('../config.php');
$day = $_POST["date"];
$lat = $_POST["lat"];
$lng = $_POST["lng"];
$val = $_POST["val"];
$start = substr($day, 0, 16);
$end = substr($day, 17, 31);
$startdate=date_create($start);
$start = date_format($startdate,"Ymd H:i");
$enddate=date_create($end);
$end = date_format($enddate,"Ymd H:i");

$sql = "SELECT ontime.routes_by_stop.stop_lat, ontime.routes_by_stop.stop_lon, COUNT(*) AS delays FROM ontime.routes_by_stop JOIN ontime.data ON ontime.routes_by_stop.route_id = ontime.data.rt WHERE ontime.routes_by_stop.stop_lat = $lat AND ontime.routes_by_stop.stop_lon = $lng AND ontime.data.dly in ('True', 1) AND ST_Distance_Sphere(POINT(ontime.routes_by_stop.stop_lon, ontime.routes_by_stop.stop_lat), POINT(ontime.data.lon, ontime.data.lat)) <= 30.48 GROUP BY ontime.routes_by_stop.stop_lat, ontime.routes_by_stop.stop_lon ORDER BY delays ASC;";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $val = $row['delays'];
    }
}

$sql2 = "SELECT routes_by_stop.`stop_name`, routes_by_stop.`stop_id`, routes_by_stop.`stop_desc`, routes_by_stop.`route_id` FROM routes_by_stop WHERE routes_by_stop.`stop_lat` = $lat AND routes_by_stop.`stop_lon` = $lng;";
$result2 = $conn->query($sql2);
$routes = "";
if ($result2->num_rows > 0) {
    while($row2 = $result2->fetch_assoc()) {
        $nearestStop = $row2['stop_name'];
        $stopID = $row2['stop_id'];
        $routes = $routes.$row2['route_id'].", ";
    }
}
$routesList = substr($routes, 0, -2);

$table = "<b>Most Delayed Routes:</b></br><table class='bg-green-600/20 min-w-fit w-5/6 text-center rounded-lg p-1 mx-auto mb-1'><tr><th>Route</th><th>% Delays</th></tr>";
$sql2 = "SELECT `rt`, COUNT(*) AS delays, (COUNT(*) / $val) * 100 AS percentage FROM ontime.data WHERE `rt` in ($routesList) AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND ontime.data.dly in ('True', 1) AND ST_Distance_Sphere(POINT(ontime.data.lon, ontime.data.lat), POINT($lng, $lat)) <= 30.48 GROUP BY `rt` ORDER BY `percentage` DESC LIMIT 5;";
$result2 = $conn->query($sql2);

if ($result2->num_rows > 0) {
    while($row2 = $result2->fetch_assoc()) {
        $percentage = number_format($row2['percentage'],2);
        if ($percentage == 100) {
            $percentage = number_format($row2['percentage'],0);
        }
        $table = $table."<tr>
            <th>".$row2['rt']."</th>
            <td>".$percentage."%</td>
            </tr>";
    }
}
$table = $table."</table>";

echo "<h3>#".$stopID.": ".$nearestStop."</h3><b>Routes Passing by Stop:</b></br><div class='ml-2'>".$routesList."</div>".$table;