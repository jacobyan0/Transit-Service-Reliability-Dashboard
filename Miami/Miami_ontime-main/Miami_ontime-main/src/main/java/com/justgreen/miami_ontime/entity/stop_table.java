package com.justgreen.miami_ontime.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class stop_table {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Integer id;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Integer stop_id;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Double stop_lat;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Double stop_lon;
    private String stop_name;
}
