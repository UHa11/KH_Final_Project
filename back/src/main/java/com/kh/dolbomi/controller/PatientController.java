package com.kh.dolbomi.controller;


import com.kh.dolbomi.dto.PatientDto;
import com.kh.dolbomi.service.PatientService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")// 프론트와 백엔드 url이 다른것을 맞춰주기 위한 어노테이션
public class PatientController {

    private final PatientService patientService;

    // 환자등록하기
    @PostMapping
    public ResponseEntity<Long> addPatient(@RequestBody PatientDto.Create createDto) {
        Long patNo = patientService.createPatient(createDto);
        return ResponseEntity.ok(patNo);
    }

    //환자목록가져오기
    @GetMapping()
    public ResponseEntity<List<PatientDto.Response>> PatientList(@RequestParam("guardian_no") Long guardianNo) {
        return ResponseEntity.ok(patientService.getListPatient(guardianNo));
    }

    //특정환자가져오기
    @GetMapping("/{patNo}")
    public ResponseEntity<PatientDto.Response> OnePatient(@PathVariable Long patNo) {
        return ResponseEntity.ok(patientService.getPatient(patNo));
    }

    @PatchMapping("/{patNo}")
    public ResponseEntity<PatientDto.Response> UpdatePatient(
            @PathVariable Long patNo,
            @RequestBody PatientDto.Update updatePatDto) {

        return ResponseEntity.ok(patientService.updatePatient(patNo, updatePatDto));


    }


}
