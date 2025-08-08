package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.enums.StatusEnum.Status;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatientRepositoryV2 extends JpaRepository<Patient, Long> {
    Patient findByPatNo(Long PatNo);

    List<Patient> findByGuardian_UserNoAndStatus(Long caregiverNo, Status status);


}
