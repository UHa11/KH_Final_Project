package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Patient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class PatientRepositoryImpl implements PatientRepository {
    @PersistenceContext
    private EntityManager em;


    @Override
    public Patient save(Patient patient) {
        em.persist(patient);
        return patient;
    }

    @Override
    public List<Patient> findByAll(Long guardianNo) {
        return em.createQuery("SELECT p FROM Patient p WHERE p.guardian.userNo = :guardianNo", Patient.class)
                .setParameter("guardianNo", guardianNo)
                .getResultList();
    }


    @Override
    public Optional<Patient> findOne(Long patNo) {
        return Optional.ofNullable(em.find(Patient.class, patNo));
    }

}





