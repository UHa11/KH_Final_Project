package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class ResumeRepositoryImpl implements ResumeRepository {

    @PersistenceContext
    private EntityManager em;

    // 메인 카드용 구직글 8개 조회 (페이징 없이)
    @Override
    public List<Resume> getMainResumeList(StatusEnum.Status status) {
        String query = "SELECT DISTINCT r FROM Resume r JOIN r.user u LEFT JOIN License l ON l.user = u WHERE r.status = :status";
        // String query = "SELECT DISTINCT r FROM Resume r JOIN FETCH r.user u LEFT JOIN fetch License l ON l.user = u WHERE r.status = :status";
        return em.createQuery(query, Resume.class)
                .setParameter("status", status)
                .setMaxResults(8)
                .getResultList();
    }
}
