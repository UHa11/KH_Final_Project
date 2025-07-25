package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.dto.SearchDataDto;
import com.kh.dolbomi.enums.StatusEnum;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRepository {
    // 메인 구직글 조회
    List<Resume> getMainResumeList(StatusEnum.Status status);

    //간병사 모집 리스트(페이징)
    Page<Resume> findByStatus(StatusEnum.Status status, Pageable pageable, SearchDataDto.ResumeSearch searchData);

    void save(Resume resume);

    Page<Resume> getResumeList(Long userNo, Pageable pageable);


}
