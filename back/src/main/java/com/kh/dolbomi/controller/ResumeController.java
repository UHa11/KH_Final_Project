package com.kh.dolbomi.controller;

import com.kh.dolbomi.dto.ResumeDto;
import com.kh.dolbomi.service.ResumeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resume/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")// 프론트와 백엔드 url이 다른것을 맞춰주기 위한 어노테이션
public class ResumeController {

    private final ResumeService resumeService;

    // 메인 구직글 조회
    @GetMapping
    public ResponseEntity<List<ResumeDto.Response>> getMainResumeList() {
        // 페이징에 필요한 정보만 가져오기 위해 PageResponse 객체로 감싸기
        return ResponseEntity.ok(resumeService.getMainResumeList());
    }
}
