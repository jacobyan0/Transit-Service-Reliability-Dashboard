package com.justgreen.miami_ontime.controller;

import com.alibaba.fastjson.JSON;
import org.json.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.justgreen.miami_ontime.entity.issue_report_table;
import com.justgreen.miami_ontime.service.issue_report_service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
@Slf4j
public class issueReport_controller {

    @Autowired
    private issue_report_service reportService;

    @PostMapping("/send_issue")
    public void send_issue(@RequestBody String data) throws UnsupportedEncodingException {
        String decoded = URLDecoder.decode(data, StandardCharsets.UTF_8.toString());
        JSONObject jsonObject = JSON.parseObject(decoded);
        Map<String, Object> map = jsonObject.toJavaObject(Map.class);

        issue_report_table issueReportTable = new issue_report_table();
        issueReportTable.setSupportText((String) map.get("other"));
        issueReportTable.setIssueArray((String) map.get("issues"));
        issueReportTable.setRoute((String) map.get("route"));
        issueReportTable.setId(null);

        reportService.save(issueReportTable);
    }

    @GetMapping("/get_issue")
    public String get_issue() {
        List<issue_report_table> list = reportService.list();
        JSONArray jsonArray = new JSONArray();
        for (issue_report_table l : list) {
            jsonArray.put(new JSONArray().put(l.getRoute()).put(l.getIssueArray()).put(l.getSupportText()));
        }
        return jsonArray.toString();
    }
}
