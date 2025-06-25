package com.kh.dolbomi.service;

import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.Report;
import com.kh.dolbomi.dto.ReportDto;
import com.kh.dolbomi.repository.PatientRepositoryV2;
import com.kh.dolbomi.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final PatientRepositoryV2 patientRepositoryV2;
    private final ReportRepository reportRepository;

    @Override
    public Long createReport(ReportDto.Create createReportDto) {
        Patient patient = patientRepositoryV2.findByPatNo(createReportDto.getPat_no());

        Report report = createReportDto.toEntity();
        report.changePatient(patient);
        System.out.println(report);
        return reportRepository.save(report).getReportNo();
    }
}
