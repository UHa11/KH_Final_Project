package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Hiring;
import com.kh.dolbomi.enums.StatusEnum;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HiringRepository {
    //구인글 등록
    void save(Hiring hiring);


    //구인글 상세보기
    Optional<Hiring> findById(Long hiringNo); // Optional로 감싼 단건 조회


    // 돌봄대상자 모집 리스트(페이징)
    Page<Hiring> findByStatus(StatusEnum.Status status, Pageable pageable);

    // 구인글 삭제
    void softDeleteByHiringNo(Long hiringNo);
}