package com.kh.dolbomi.service;

import com.kh.dolbomi.dto.ReportDto;

public interface ReportService {
    Long createReport(ReportDto.Create createReportDto);
}
