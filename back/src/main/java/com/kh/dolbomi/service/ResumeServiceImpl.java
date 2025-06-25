package com.kh.dolbomi.service;

import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.dto.ResumeDto;
import com.kh.dolbomi.enums.StatusEnum;
import com.kh.dolbomi.repository.ResumeRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;


    // 메인 구직글 조회
    @Override
    @Transactional(readOnly = true)
    public List<ResumeDto.Response> getMainResumeList() {
        // join 대신 em에서 Resume를 가져오고, Resume안의 User를 가져와보자
        List<Resume> resumes = resumeRepository.getMainResumeList(StatusEnum.Status.Y);

        return resumes.stream()
                .map(ResumeDto.Response::mainResumeDto)
                .collect(Collectors.toList());
    }
}
