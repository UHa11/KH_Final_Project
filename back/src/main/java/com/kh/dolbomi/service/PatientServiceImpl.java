package com.kh.dolbomi.service;


import com.kh.dolbomi.domain.Disease;
import com.kh.dolbomi.domain.DiseaseTag;
import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.dto.PatientDto;
import com.kh.dolbomi.repository.DiseaseRepository;
import com.kh.dolbomi.repository.PatientRepository;
import com.kh.dolbomi.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DiseaseRepository diseaseRepository;

    @Override
    public Long createPatient(PatientDto.Create createDto) {

        User user = userRepository.findById(createDto.getGuardian_no())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        Patient patient = createDto.toEntity(user);

        if (createDto.getDiseaseTags() != null && !createDto.getDiseaseTags().isEmpty()) {
            //tag가 왔다. ["kh","java","쉬움"]
            for (String disName : createDto.getDiseaseTags()) {

                //tag를 이름으로 조회해서 없으면 새로 만들어라.
                Disease disease = diseaseRepository.findByDisName(disName)
                        .orElseGet(() -> diseaseRepository.save(Disease.builder()
                                .disName(disName)
                                .build()));

                DiseaseTag diseaseTag = DiseaseTag.builder()
                        .disease(disease)
                        .build();

                diseaseTag.changePatient(patient);
            }
        }

        return patientRepository.save(patient).getPatNo();
    }

    @Override
    public List<PatientDto.Response> getListPatient(Long userNo) {
        return patientRepository.findByAll(userNo).stream()
                .map(PatientDto.Response::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDto.Response getPatient(Long patNo) {
        Patient patient = patientRepository.findOne(patNo).
                orElseThrow(() -> new EntityNotFoundException("조회된 회원이 없습니다."));
        return PatientDto.Response.toDetailDto(patient);
    }


}
