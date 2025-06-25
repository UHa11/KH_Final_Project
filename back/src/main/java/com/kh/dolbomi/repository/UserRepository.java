package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    void save(User User);

    List<User> findByUserId(String userId);

    Optional<User> findById(Long userNo);

}
