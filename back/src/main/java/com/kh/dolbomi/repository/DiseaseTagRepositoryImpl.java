package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Disease;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

public class DiseaseTagRepositoryImpl implements DiseaseTagRepository {


    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Disease> findDiseasesByPatientNo(Long patNo) {
        return em.createQuery(
                        "SELECT dt.disease FROM DiseaseTag dt WHERE dt.patient.patNo = :patNo", Disease.class)
                .setParameter("patNo", patNo)
                .getResultList();
    }
}