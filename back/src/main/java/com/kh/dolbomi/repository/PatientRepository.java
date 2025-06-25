package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientRepository {
    Patient save(Patient patient);

    List<Patient> findByAll(Long userNo);

    Optional<Patient> findOne(Long patNo);

}
