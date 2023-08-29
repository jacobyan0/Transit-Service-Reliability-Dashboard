package com.justgreen.miami_ontime.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.justgreen.miami_ontime.entity.issue_report_table;
import com.justgreen.miami_ontime.mapper.issueReport_mapper;
import com.justgreen.miami_ontime.service.issue_report_service;
import org.springframework.stereotype.Service;

@Service
public class issue_report_service_impl extends ServiceImpl<issueReport_mapper, issue_report_table> implements issue_report_service {
}
