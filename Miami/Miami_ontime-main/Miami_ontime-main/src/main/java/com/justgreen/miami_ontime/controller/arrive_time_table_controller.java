package com.justgreen.miami_ontime.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.justgreen.miami_ontime.entity.arrive_time_table;
import com.justgreen.miami_ontime.service.arrive_time_table_service;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.JSON;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class arrive_time_table_controller {

    @Autowired
    private arrive_time_table_service arriveTimeTableService;

    @GetMapping("/datetime_limit")
    public String get_datetime_limit() {
        QueryWrapper<arrive_time_table> queryWrapper = new QueryWrapper();
        queryWrapper.select("MAX(actual_date)");
        Map<String, Object> maxDate = arriveTimeTableService.getMap(queryWrapper);

        List<String> res = new ArrayList<>(Arrays.asList("2022-10-01", (maxDate.get("MAX(actual_date)").toString())));
        return JSON.toJSONString(res);
    }
}
