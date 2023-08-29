package com.justgreen.miami_ontime.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.justgreen.miami_ontime.entity.route_table;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.justgreen.miami_ontime.service.route_table_service;

@RestController
@RequestMapping("/api")
@Slf4j
public class route_table_controller {

    @Autowired
    private route_table_service route_table_service;

    @GetMapping("/route")
    public String getRoute(String route_short_name) {
        LambdaQueryWrapper<route_table> queryWrapper = new LambdaQueryWrapper();
        queryWrapper.eq(route_table::getRoute_short_name, route_short_name);
        route_table route = route_table_service.getOne(queryWrapper);
        return route.getGeometry();
    }

}
