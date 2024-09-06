<?php
    //run this page occasionally to update data
    require_once('../backend/config.php');
    $start=strtotime('6:00');
    $end=strtotime('23:00');
    $list = array();
    for ($i=$start;$i<=$end;$i = $i + 60)
    {
        $time = date('H:i', $i);
        $total = 0;
        $delayed = 0;
        $sql = "SELECT `dly`, count(*) as c FROM data WHERE `tmstmp` LIKE '% $time%' GROUP BY `dly`";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $total += $row['c'];
                if ($row['dly'] == "True" || $row['dly'] == "1") {
                    $delayed += $row['c'];
                }
            }
        }
        if ($total === 0) {
            $per = 0;
        }
        else {
            $per = (number_format(($delayed/$total)*100, 2));
        }
        array_push($list, array($time, $per));
    }

    $file = fopen("../data/delaysByHour.csv","w");

    foreach ($list as $line) {
        fputcsv($file, $line);
    }
    fclose($file);

    $start=strtotime('6:00');
    $end=strtotime('23:00');
    $list = array();
    for ($i=$start;$i<=$end;$i = $i + 60)
    {
        $time = date('H:i', $i);
        $total = 0;
        $delayed = 0;
        $sql = "SELECT `rt` FROM data WHERE `tmstmp` LIKE '% $time%' GROUP BY `rt`";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $total = $total + 1;
            }
        }
        $sql = "SELECT `rt` FROM data WHERE `tmstmp` LIKE '% $time%' AND `dly` in ('True', 1) GROUP BY `rt`;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $delayed = $delayed + 1;
            }
        }
        if ($total === 0) {
            $per = 0;
        }
        else {
            $per = (number_format(($delayed/$total)*100, 2));
        }
        array_push($list, array($time, $per));
    }

    $file = fopen("../data/rtsDelayedByHour.csv","w");

    foreach ($list as $line) {
        fputcsv($file, $line);
    }
    $conn->close();
    fclose($file);
