package com.justgreen.miami_ontime.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.justgreen.miami_ontime.entity.bus_delay_table;
import com.justgreen.miami_ontime.service.arrive_time_table_service;
import com.justgreen.miami_ontime.service.bus_delay_table_service;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.json.JSONArray;
import com.alibaba.fastjson.JSON;


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@Slf4j
public class bus_delay_controller {

    @Autowired
    private arrive_time_table_service arriveTimeTableService;
    @Autowired
    private bus_delay_table_service busDelayTableService;

    @GetMapping("/top_route")
    public String getRoute(String fromDate, String toDate, String fromTime, String toTime, @RequestParam(value = "from_route_names", required = false) String from_route_names) {
        //String routes = (String) JSON.parse(from_route_names);
        List<String> list = new ArrayList<>(Arrays.asList(from_route_names.split(",")));
        System.out.println(list);

        List<Map<String, Object>> topFiveDelay = busDelayTableService.getTopFive(fromDate, toDate, fromTime, toTime, list);

        JSONArray jsonArray = new JSONArray();

        if (topFiveDelay.size() == 0) {
            for (int i = 0; i < 5; ++i) {
                jsonArray.put(new JSONArray().put("1").put(0));
            }
            System.out.println(jsonArray);
            return jsonArray.toString();
        }

        for (Map<String, Object> map : topFiveDelay) {
            String route_name = (String) map.get("route_short_name");
            Double delay_time = (Double) map.get("delay_time");
            jsonArray.put(new JSONArray().put(route_name).put(delay_time));
        }
        System.out.println(jsonArray.toString());
        return jsonArray.toString();
    }

    @GetMapping("/delay_in_hours")
    public String getRouteByEachHour(String route_short_name, String from, String to) {
//        LocalDateTime fromDateTime = LocalDateTime.parse(from, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//        LocalDateTime toDateTime = LocalDateTime.parse(to, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        //fromDateTime.toLocalDate().toString(), toDateTime.toLocalDate().toString(),
        //                                                    fromDateTime.toLocalTime().toString(), toDateTime.toLocalTime().toString()

        String fromDateTime = from.replace("T", " ");
        String toDateTime = from.replace("T", " ");

        List<Map<String, Object>> ids = arriveTimeTableService.getDelayByEachHour(route_short_name, fromDateTime, toDateTime);

        List<List<Double>> list = new ArrayList<>();
        for (int i = 0; i < 24; ++i) {
            list.add(new ArrayList<Double>(Arrays.asList((double) i, 0.0)));
        }

        for (Map<String, Object> map : ids) {
            Integer hour = (Integer) map.get("hourOfTimestamp1");
            list.get(hour).set(1, (Double) map.get("delay_time"));
        }

        return JSON.toJSONString(list);
    }

}
