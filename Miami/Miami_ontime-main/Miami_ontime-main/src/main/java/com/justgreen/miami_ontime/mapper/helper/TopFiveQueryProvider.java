package com.justgreen.miami_ontime.mapper.helper;

import java.util.List;
import java.util.Map;

public class TopFiveQueryProvider {

    public String generateQuery(Map<String, Object> params) {
        List<String> from_route_names = (List<String>) params.get("from_route_names");

        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT route_short_name, AVG(sched_adherence_mins) as delay_time ")
                .append("FROM arrive_time_table ")
                .append("JOIN (SELECT * FROM bus_delay_table ");

        if (from_route_names != null && !from_route_names.isEmpty()) {
            queryBuilder.append("WHERE route_short_name IN (");
            for (int i = 0; i < from_route_names.size(); i++) {
                if (i > 0) {
                    queryBuilder.append(",");
                }
                queryBuilder.append("#{from_route_names[").append(i).append("]}");
            }
            queryBuilder.append(")");
        }

        queryBuilder.append(") AS subQuery ")
                .append("ON arrive_time_table.id = subQuery.id ")
                .append("WHERE (actual_date > Date(#{fromDate}) OR (actual_date = Date(#{fromDate}) AND actual_time >= Time(#{fromTime}))) ")
                .append("AND (actual_date < Date(#{toDate}) OR (actual_date = Date(#{toDate}) AND actual_time <= Time(#{toTime}))) ")
                .append("GROUP BY route_short_name ")
                .append("ORDER BY delay_time DESC ")
                .append("LIMIT 5");

        return queryBuilder.toString();
    }
}

