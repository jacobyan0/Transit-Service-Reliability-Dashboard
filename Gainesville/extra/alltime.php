<?php
    require_once('../backend/config.php');
    $sql = "SELECT `rt`, COUNT(*) FROM `data` WHERE `dly` in ('True', 1) GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5;";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $avgPerDay = "nor";
            $sql2 = "SELECT avg(table1.countdly) as average from (select `rt`, count(*) as countdly, LEFT(`tmstmp`, 9) AS datedly FROM `data` where `rt` = ". $row['rt'] ." AND `dly` in ('True', 1) group by datedly) as table1;";
            $result2 = $conn->query($sql2);
            if ($result2->num_rows > 0) {
                while($row2 = $result2->fetch_assoc()) {
                    $avgPerDay = $row2['average']*15/60;
                }
            }
            $delay = $row['COUNT(*)']*15/60;
            echo "<tr>";
            echo "<th>".$row['rt']."</th>";
            echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$delay."</td>";
            echo "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$avgPerDay."</td>";
            echo "</tr>";
        }
    }
    else {
        echo "N/A";
    }
