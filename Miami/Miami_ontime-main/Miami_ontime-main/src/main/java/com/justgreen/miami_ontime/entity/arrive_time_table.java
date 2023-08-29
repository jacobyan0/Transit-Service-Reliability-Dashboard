package com.justgreen.miami_ontime.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class arrive_time_table {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Integer id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime actual_date;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalDateTime actual_time;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private int hourOfTimestamp1;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalDateTime scheduled_time;
}
