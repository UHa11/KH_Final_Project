package com.kh.dolbomi.repository;


import com.kh.dolbomi.domain.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository{
    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(User user) {
        em.persist(user);
    }

    //userId는 유니크 제약조건이 걸려있어 1개만 반환할거라 리스트로 받을 필요 없지만
    // JPA는 안전하게 리스트 형태로 반환하도록 설계되어있음!
    @Override
    public List<User> findByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            return List.of(); // userId 없으면 빈 리스트 반환
        }

        return em.createQuery("SELECT u FROM User u WHERE u.userId = :userId", User.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public Optional<User> findById(Long userNo) {
        return Optional.ofNullable(em.find(User.class, userNo));
    }


}
