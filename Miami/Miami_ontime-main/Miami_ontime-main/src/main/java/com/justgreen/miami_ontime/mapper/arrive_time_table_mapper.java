package com.justgreen.miami_ontime.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.justgreen.miami_ontime.entity.arrive_time_table;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface arrive_time_table_mapper extends BaseMapper<arrive_time_table> {

    @Select("SELECT hourOfTimestamp1, AVG(sched_adherence_mins) AS delay_time FROM arrive_time_table JOIN bus_delay_table ON arrive_time_table.id = bus_delay_table.id\n" +
            "WHERE route_short_name = #{route_short_name} \n" +
            "AND (actual_date BETWEEN #{fromTimestamp} AND #{toTimestamp})\n" +
            "GROUP BY hourOfTimestamp1\n" +
            "ORDER BY hourOfTimestamp1;")
    List<Map<String, Object>> getDelayByEachHour(@Param("route_short_name") String route_short_name, @Param("fromTimestamp") String fromTimestamp,
                                                 @Param("toTimestamp") String toTimestamp);
}
