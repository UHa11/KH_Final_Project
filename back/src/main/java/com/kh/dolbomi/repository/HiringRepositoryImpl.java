package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Hiring;
import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class HiringRepositoryImpl implements HiringRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Hiring hiring) {
        em.persist(hiring);
    }

    @Override
    public Optional<Hiring> findById(Long hiringNo) {
        Hiring hiring = em.find(Hiring.class, hiringNo);
        return Optional.ofNullable(hiring);
    }

    @Override
    public Page<Hiring> findByStatus(StatusEnum.Status status, Pageable pageable) {
        // 1. 페이징된 데이터 조회
        List<Hiring> content = em.createQuery(
                        "SELECT h FROM Hiring h WHERE h.status = :status ORDER BY h.hiringNo DESC", Hiring.class)
                .setParameter("status", status)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // 2. 전체 개수 조회
        Long total = em.createQuery(
                        "SELECT COUNT(h) FROM Hiring h WHERE h.status = :status", Long.class)
                .setParameter("status", status)
                .getSingleResult();

        // 3. Page 객체로 변환
        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public void softDeleteByHiringNo(Long hiringNo) {
        Hiring hiring = em.find(Hiring.class, hiringNo);
        if (hiring != null) {
            hiring.hiringDeleted(); // 상태를 'N'으로 변경
        }
    }

}
