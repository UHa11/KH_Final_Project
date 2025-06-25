package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.License;
import com.kh.dolbomi.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseRepository extends JpaRepository<License, Long> {
    List<License> findByUser(User user);
}
