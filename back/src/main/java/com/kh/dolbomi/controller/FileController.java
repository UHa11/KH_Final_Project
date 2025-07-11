package com.kh.dolbomi.controller;

import com.kh.dolbomi.domain.File;
import com.kh.dolbomi.dto.file.DownloadUrlResponseDto;
import com.kh.dolbomi.dto.file.UploadUrlResponseDto;
import com.kh.dolbomi.service.FileService;
import com.kh.dolbomi.service.PatientService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/v1/files")
@RestController
@RequiredArgsConstructor
public class FileController {

    public final FileService fileService;
    public final PatientService patientService;

    @PostMapping("/upload-url")
    public ResponseEntity<UploadUrlResponseDto> getUploadUrl(@RequestParam String file_name,
                                                             @RequestParam String content_type,
                                                             @RequestParam(required = false, defaultValue = "") String path) {
        //확장자 추출
        String extention = "";
        int lastDotIndex = file_name.lastIndexOf('.');
        if (lastDotIndex > 0) {
            extention = file_name.substring(lastDotIndex);
        }

        //경로 + 변경된이름 + 확장자 =저장할 이름
        String changeName = path + UUID.randomUUID() + extention;
        String presignedUrl = fileService.generatePresignedUploadUrl(changeName, content_type);

//        log.info("체크용 :{}, {}", changeName, presignedUrl);

        return ResponseEntity.ok(new UploadUrlResponseDto(changeName, presignedUrl));
    }

    @GetMapping("/{fileNo}/download-url")
    public ResponseEntity<DownloadUrlResponseDto> getDownloadUrl(@PathVariable Long fileNo) {
        File file = fileService.getFile(fileNo);
        String presignedUrl = fileService.generatePresignedDownloadUrl(file.getFileName());
        System.out.println("presignedUrl 발급 : " + presignedUrl);
        return ResponseEntity.ok(new DownloadUrlResponseDto(presignedUrl, file.getFileName()));
    }
}
