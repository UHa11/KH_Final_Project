package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Disease;
import java.util.List;

public interface DiseaseTagRepository {
    List<Disease> findDiseasesByPatientNo(Long patNo);
}