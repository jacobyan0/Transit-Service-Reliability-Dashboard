package com.justgreen.miami_ontime.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.justgreen.miami_ontime.entity.route_table;
import com.justgreen.miami_ontime.mapper.route_table_mapper;
import com.justgreen.miami_ontime.service.route_table_service;
import org.springframework.stereotype.Service;

@Service
public class route_table_service_impl extends ServiceImpl<route_table_mapper, route_table> implements route_table_service {
}
