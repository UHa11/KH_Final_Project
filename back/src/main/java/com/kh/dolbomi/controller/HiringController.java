package com.kh.dolbomi.controller;


import com.kh.dolbomi.dto.HiringDto;
import com.kh.dolbomi.service.HiringService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hiring")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")// 프론트와 백엔드 url이 다른것을 맞춰주기 위한 어노테이션
public class HiringController {

    private final HiringService hiringService;

    //돌봄 대상자 모집 리스트 불러오기
    @GetMapping()
    public ResponseEntity<Page<HiringDto.Response>> getPagedHiringList(Pageable pageable) {
        Page<HiringDto.Response> hiringPage = hiringService.getHiringPage(pageable);
        return ResponseEntity.ok(hiringPage);
    }


    // 구인글 작성
    @PostMapping
    public ResponseEntity<Long> createHiring(@RequestBody HiringDto.Create createDto) {
        Long patNo = createDto.getPat_no();
        if (patNo == null) {
            return ResponseEntity.badRequest().build();
        }

        Long hiringNo = hiringService.createHiring(patNo, createDto);

        return ResponseEntity.ok(hiringNo);
    }

    //구인글 상세보기
    @GetMapping("/{hiringNo}")
    public ResponseEntity<HiringDto.Response> getHiringDetail(@PathVariable Long hiringNo) {
        HiringDto.Response response = hiringService.getHiringDetail(hiringNo);
        return ResponseEntity.ok(response);
    }

    //구인글 수정하기
//    @PatchMapping("/{hiringNo}")
//    public ResponseEntity<HiringDto.Response> updateHiring(@PathVariable Long hiringNo, @RequestBody HiringDto.Update updateDto) {
//
//    }

    //구인글 삭제하기
//    @DeleteMapping("/{hiringNo}")
//    public ResponseEntity<Void> deleteHiring(@PathVariable Long hiringNo) {
//        hiringService.deleteHiring(hiringNo);
//        return ResponseEntity.ok().build();
//    }
}
