package com.kh.dolbomi.controller;

import com.kh.dolbomi.dto.ReportDto;
import com.kh.dolbomi.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {

    public final ReportService reportService;

    @PostMapping
    public ResponseEntity<Long> createReport(@ModelAttribute ReportDto.Create reportCreate) {
        return ResponseEntity.ok(reportService.createReport(reportCreate));
    }

}
