package com.justgreen.miami_ontime.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class bus_delay_table {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Integer id;
    private String route_short_name;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Double sched_adherence_mins;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Integer stop_id;
}
