package com.justgreen.miami_ontime.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.justgreen.miami_ontime.entity.bus_delay_table;

import java.util.List;
import java.util.Map;

public interface bus_delay_table_service extends IService<bus_delay_table> {
    public List<Map<String, Object>> getTopFive(String fromDate, String toDate, String fromTime, String toTime, List<String> from_route_names);
}
