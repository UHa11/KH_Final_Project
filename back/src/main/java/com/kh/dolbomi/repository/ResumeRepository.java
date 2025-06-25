package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.enums.StatusEnum;
import java.util.List;

public interface ResumeRepository {
    // 메인 구직글 조회
    List<Resume> getMainResumeList(StatusEnum.Status status);
}
