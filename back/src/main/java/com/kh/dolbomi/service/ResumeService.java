package com.kh.dolbomi.service;

import com.kh.dolbomi.dto.ResumeDto;
import java.util.List;

public interface ResumeService {
    // 메인 구직글 조회
    List<ResumeDto.Response> getMainResumeList();
}
