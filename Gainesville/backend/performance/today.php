<?php
    require_once('../config.php');
    $day = $_GET['day'];
    $route = $_GET['route'];
    $start = substr($day, 0, 16);
    $end = substr($day, 17, 31);
    $startdate=date_create($start);
    $start = date_format($startdate,"Ymd H:i");
    $enddate=date_create($end);
    $end = date_format($enddate,"Ymd H:i");
   
    $sql = "SELECT `rt`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays, COUNT(*) AS total, ROUND(SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) / COUNT(*) * 100, 3) AS ratio FROM `data` WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' GROUP BY `rt` ORDER BY `ratio` DESC LIMIT 5;";
    if ($route > 0) {
        $sql = "SELECT `vid`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays, COUNT(*) AS total, ROUND(SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) / COUNT(*) * 100, 3) AS ratio FROM `data` WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND `rt` = $route GROUP BY `vid` ORDER BY `ratio` DESC LIMIT 5;";
        $sql1 = "SELECT `rt`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays, COUNT(*) AS total, ROUND(SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) / COUNT(*) * 100, 3) AS ratio FROM `data` WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND `rt` = $route GROUP BY `rt` ORDER BY `ratio` DESC LIMIT 5;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $avgPerDay = "nor";
                $sql2 = "WITH delaysperday AS (SELECT LEFT(`tmstmp`, 9) AS date, `vid`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays FROM `data` where `vid` = ". $row['vid'] ." AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' GROUP BY `vid`, date) SELECT `vid`, ROUND(AVG(delays),3) AS average FROM delaysperday GROUP BY `vid` ORDER BY `average` DESC LIMIT 5;";
                $result2 = $conn->query($sql2);
                if ($result2->num_rows > 0) {
                    while($row2 = $result2->fetch_assoc()) {
                        $avgPerDay = $row2['average'];
                    }
                }
                $delay = $row['ratio'];
                echo "<tr>";
                echo "<th>".$row['vid']."</th>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$delay."%</td>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$avgPerDay."</td>";
                echo "</tr>";
            }
        }
        else {
            echo "N/A";
        }
        $result = $conn->query($sql1);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $avgPerDay = "nor";
                $sql2 = "WITH delaysperday AS (SELECT LEFT(`tmstmp`, 9) AS date, `rt`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays FROM `data` where `rt` = ". $row['rt'] ." AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' GROUP BY `rt`, date) SELECT `rt`, ROUND(AVG(delays),3) AS average FROM delaysperday GROUP BY `rt` ORDER BY `average` DESC LIMIT 5;";
                $result2 = $conn->query($sql2);
                if ($result2->num_rows > 0) {
                    while($row2 = $result2->fetch_assoc()) {
                        $avgPerDay = $row2['average'];
                    }
                }
                $delay = $row['ratio'];
                echo "<tr class='bg-green-600/30'>";
                echo "<th>Route ".$row['rt']."</th>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$delay."%</td>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$avgPerDay."</td>";
                echo "</tr>";
            }
        }
        else {
            echo "N/A";
        }
        
    }
    else {
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $avgPerDay = "nor";
                $sql2 = "WITH delaysperday AS (SELECT LEFT(`tmstmp`, 9) AS date, `rt`, SUM(CASE WHEN ontime.data.dly in ('True', 1) THEN 1 ELSE 0 END) AS delays FROM `data` where `rt` = ". $row['rt'] ." AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' GROUP BY `rt`, date) SELECT `rt`, ROUND(AVG(delays),3) AS average FROM delaysperday GROUP BY `rt` ORDER BY `average` DESC LIMIT 5;";
                $result2 = $conn->query($sql2);
                if ($result2->num_rows > 0) {
                    while($row2 = $result2->fetch_assoc()) {
                        $avgPerDay = $row2['average'];
                    }
                }
                $delay = $row['ratio'];
                echo "<tr>";
                echo "<th>".$row['rt']."</th>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$delay."%</td>";
                echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$avgPerDay."</td>";
                echo "</tr>";
            }
        }
        else {
            echo "N/A";
        }
    }