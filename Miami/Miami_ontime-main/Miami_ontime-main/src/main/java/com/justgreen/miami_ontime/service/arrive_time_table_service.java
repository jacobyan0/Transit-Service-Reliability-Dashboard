package com.justgreen.miami_ontime.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.justgreen.miami_ontime.entity.arrive_time_table;

import java.util.List;
import java.util.Map;

public interface arrive_time_table_service extends IService<arrive_time_table> {
    public List<Map<String, Object>> getDelayByEachHour(String route_short_name, String fromTimestamp, String toTimestamp);
}
