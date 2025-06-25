package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Disease;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    Optional<Disease> findByDisName(String disName);
}
