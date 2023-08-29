package com.justgreen.miami_ontime.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.justgreen.miami_ontime.entity.bus_delay_table;
import com.justgreen.miami_ontime.entity.stop_table;
import com.justgreen.miami_ontime.service.bus_delay_table_service;
import com.justgreen.miami_ontime.service.stop_table_service;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Slf4j
public class stop_table_controller {

    @Autowired
    private stop_table_service stopTableService;

    @Autowired
    private bus_delay_table_service busDelayTableService;

    @GetMapping("/stops")
    public String getStops(String route_short_name) {
        QueryWrapper<bus_delay_table> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("distinct stop_id").lambda()
                .eq(bus_delay_table::getRoute_short_name, route_short_name);
        List<Map<String, Object>> stops = busDelayTableService.listMaps(queryWrapper);

        List<Integer> ids = new ArrayList<>();
        for (Map<String, Object> map : stops) {
            ids.add((Integer) map.get("stop_id"));
        }

        QueryWrapper<stop_table> queryWrapper1 = new QueryWrapper<>();
        queryWrapper1.select("DISTINCT(stop_id), stop_lat, stop_lon, stop_name").lambda()
                .in(stop_table::getStop_id, ids);
        List<Map<String, Object>> stopTable = stopTableService.listMaps(queryWrapper1);

        JSONArray jsonArray = new JSONArray();

        for (Map<String, Object> st : stopTable) {
            jsonArray.put(new JSONArray().put((Double) st.get("stop_lat")).put((Double) st.get("stop_lon")).put((String) st.get("stop_name")));
        }
        return jsonArray.toString();
    }
}
