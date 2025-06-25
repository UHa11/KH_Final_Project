package com.kh.dolbomi.service;

import com.kh.dolbomi.domain.Hiring;
import com.kh.dolbomi.dto.HiringDto;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface HiringService {
    // 구인글 페이징 리스트 조회 (상태 Y)
    Page<HiringDto.Response> getHiringPage(Pageable pageable);

    // 구인글 등록
    Long createHiring(Long patNo, HiringDto.Create createDto);


    Optional<Hiring> findById(Long hiringNo);


    HiringDto.Response getHiringDetail(Long hiringNo);

    //구인글 삭제하기
//    void deleteHiring(Long hiringNo);
}
