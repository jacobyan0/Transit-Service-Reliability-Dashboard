package com.justgreen.miami_ontime.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.justgreen.miami_ontime.entity.bus_delay_table;
import com.justgreen.miami_ontime.mapper.bus_delay_table_mapper;
import com.justgreen.miami_ontime.service.bus_delay_table_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class bus_delay_table_service_impl extends ServiceImpl<bus_delay_table_mapper, bus_delay_table> implements bus_delay_table_service {

    @Autowired
    private bus_delay_table_mapper busDelayTableMapper;

    public List<Map<String, Object>> getTopFive(String fromDate, String toDate, String fromTime, String toTime, List<String> from_route_names) {
        return busDelayTableMapper.top_five(fromDate, toDate, fromTime, toTime, from_route_names);
    }
}
