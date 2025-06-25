package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatientRepositoryV2 extends JpaRepository<Patient, Long> {
    Patient findByPatNo(Long PatNo);

}
