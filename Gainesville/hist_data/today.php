<?php
    require_once('../backend/config.php');
    $day = $_GET['day'];
    $start = substr($day, 0, 16);
    $end = substr($day, 17, 31);
    $startdate=date_create($start);
    $start = date_format($startdate,"Ymd H:i");
    $enddate=date_create($end);
    $end = date_format($enddate,"Ymd H:i");
    if ($start == $end) {
        $sql = "SELECT `rt`, COUNT(*) FROM `data` WHERE `tmstmp` LIKE '$start %' AND `dly` in ('True', 1) GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $delay = $row['COUNT(*)']*15/60;
                echo "<tr>";
                echo "<td class='font-bold'>".$row['rt']."</td>";
                echo "<td class='ml-4'>&nbsp;".$delay."</td>";
                echo "<td class='pl-4'>".$delay."</td>";
                echo "</tr>";
            }
        }
        else {
            echo "No data for this day";
        }
    }
    else {
        $sql = "SELECT `rt`, COUNT(*) FROM `data` WHERE `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND `dly` in ('True', 1) GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $avgPerDay = "nor";
                $sql2 = "SELECT avg(table1.countdly) as average from (select `rt`, count(*) as countdly, LEFT(`tmstmp`, 9) AS datedly FROM `data` where `rt` = ". $row['rt'] ." AND `tmstmp` >= '$start' AND `tmstmp` <= '$end' AND `dly` in ('True', 1) group by datedly) as table1;";
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
            echo "No data for this date range";
        }
    }
    /*if ($day === "20221018") {
        $sql = "SELECT `rt`, COUNT(*) FROM `20221018` WHERE `dly` = 'True' GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<th>".$row['rt']."</th>";
                echo "<td>".$row['COUNT(*)']."</td>";
                echo "</tr>";
            }
        }
    }
    else if ($day === "20221019") {
        $sql = "SELECT `rt`, COUNT(*) FROM `20221019` WHERE `dly` = 'True' GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<th>".$row['rt']."</th>";
                echo "<td>".$row['COUNT(*)']."</td>";
                echo "</tr>";
            }
        }
    }
    else if ($day === "20221020") {
        $sql = "SELECT `rt`, COUNT(*) FROM `20221020` WHERE `dly` = 'True' GROUP BY `rt` ORDER BY `COUNT(*)` DESC LIMIT 5";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<th>".$row['rt']."</th>";
                echo "<td>".$row['COUNT(*)']."</td>";
                echo "</tr>";
            }
        }
    }
    else {
        $file = fopen("data/delays.csv", "r") or die("Unable to open file!");
        $delayCounts = array();
        while(!feof($file)) {
            $line = fgetcsv($file);
            if ($line[0] == "vid") {
                continue;
            }
            $vid = $line[3];
            $tmstmp = $line[0];
            $lat = $line[1];
            $lon = $line[2];
            $rt = $line[4];
            $pid = $line[5];
            if (substr($tmstmp, 0, 8) == $day) {
                if (array_key_exists($rt, $delayCounts)) {
                    $delayCounts[$rt]++;
                }
                else {
                    $delayCounts[$rt] = 1;
                    //echo "<script>tripsShown.add(".$rt.");</script>";
                }
            }
        }
        arsort($delayCounts);
        $x = 0;
        foreach ($delayCounts as $key => $value) {
            if ($x == 5)
                break;
            echo "<tr>";
            echo "<th>".$key."</th>";
            echo "<td>".$value."</td>";
            echo "</tr>";
            $x++;
        }
        fclose($file);
    }*/
?>