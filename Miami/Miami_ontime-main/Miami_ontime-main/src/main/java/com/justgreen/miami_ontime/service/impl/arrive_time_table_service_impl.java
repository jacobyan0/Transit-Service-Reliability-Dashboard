package com.justgreen.miami_ontime.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.justgreen.miami_ontime.entity.arrive_time_table;
import com.justgreen.miami_ontime.mapper.arrive_time_table_mapper;
import com.justgreen.miami_ontime.service.arrive_time_table_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class arrive_time_table_service_impl extends ServiceImpl<arrive_time_table_mapper, arrive_time_table> implements arrive_time_table_service {

    @Autowired
    private arrive_time_table_mapper arriveTimeTableMapper;

    @Override
    public List<Map<String, Object>> getDelayByEachHour(String route_short_name, String fromTimestamp, String toTimestamp) {
        return arriveTimeTableMapper.getDelayByEachHour(route_short_name, fromTimestamp, toTimestamp);
    }
}
