package com.justgreen.miami_ontime.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.justgreen.miami_ontime.entity.bus_delay_table;
import com.justgreen.miami_ontime.mapper.helper.TopFiveQueryProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Mapper
public interface bus_delay_table_mapper extends BaseMapper<bus_delay_table> {

    @SelectProvider(type = TopFiveQueryProvider.class, method = "generateQuery")
    List<Map<String, Object>> top_five(@Param("fromDate") String fromDate, @Param("toDate") String toDate,
                                       @Param("fromTime") String fromTime, @Param("toTime") String toTime,
                                       @Param("from_route_names") List<String> from_route_names);
}
