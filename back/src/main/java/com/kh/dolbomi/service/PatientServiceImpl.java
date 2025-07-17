package com.kh.dolbomi.service;


import com.kh.dolbomi.domain.Disease;
import com.kh.dolbomi.domain.DiseaseTag;
import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.dto.PatientDto;
import com.kh.dolbomi.exception.GuardianNotLinkedException;
import com.kh.dolbomi.exception.PatientNotFoundException;
import com.kh.dolbomi.exception.UserNotFoundException;
import com.kh.dolbomi.repository.DiseaseRepository;
import com.kh.dolbomi.repository.PatientRepository;
import com.kh.dolbomi.repository.UserRepository;
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
                .orElseThrow(() -> new UserNotFoundException("보호자 정보를 찾을 수 없습니다."));

        Patient patient = createDto.toEntity(user);

        if (createDto.getDisease_tags() != null && !createDto.getDisease_tags().isEmpty()) {
            //tag가 왔다. ["kh","java","쉬움"]
            for (String disName : createDto.getDisease_tags()) {

                //tag를 이름으로 조회해서 없으면 새로 만들어라.
                Disease disease = diseaseRepository.findByDisName(disName)
                        .orElseGet(() -> diseaseRepository.save(Disease.builder().disName(disName)
                                .build())
                        );

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
                orElseThrow(() -> new PatientNotFoundException("해당 환자를 찾을 수 없습니다."));

        // 보호자 추출
        User user = patient.getGuardian(); // 또는 getUser() 등 필드에 따라 다름
        if (user == null) {
            throw new GuardianNotLinkedException("해당 환자에 보호자가 연결되어 있지 않습니다.");
        }

        return PatientDto.Response.toDetailDto(patient, user);
    }

    @Transactional
    @Override
    public PatientDto.Response updatePatient(Long patNo, PatientDto.Update updatePatDto) {

        Patient patient = patientRepository.findOne(patNo)
                .orElseThrow(() -> new PatientNotFoundException("해당 환자가 없습니다."));
        // 보호자 추출
        User user = patient.getGuardian(); // 또는 getUser() 등 필드에 따라 다름
        if (user == null) {
            throw new GuardianNotLinkedException("해당 환자에 보호자가 연결되어 있지 않습니다.");
        }

        patient.changePatName(updatePatDto.getPat_name());
        patient.changePatAge(updatePatDto.getPat_age());
        patient.changePatAddress(updatePatDto.getPat_address());
        patient.changePatPhone(updatePatDto.getPat_phone());
        patient.changePatGender(updatePatDto.getPat_gender());
        patient.changePatWeight(updatePatDto.getPat_weight());
        patient.changePatHeight(updatePatDto.getPat_height());
        patient.changePatContent(updatePatDto.getPat_content());
        patient.changeStatus(updatePatDto.getStatus());
        patient.changeProfileImage(updatePatDto.getProfile_image());

        patient.getDiseaseTags().clear();

        if (updatePatDto.getDisease_tags() != null && !updatePatDto.getDisease_tags().isEmpty()) {

//            patient.getDiseaseTags().clear();
            //기존BoardTag -> 연결이 끊기면 필요가 있을까? X
            for (String disName : updatePatDto.getDisease_tags()) {

                //연결된 boardTags의 영속성을 제거한다. -> orphanRemoval = true 설정이 되어있다면 실제 db에서 제거

                //tag를 이름으로 조회해서 없으면 새로 만들어라.
                Disease disease = diseaseRepository.findByDisName(disName)
                        .orElseGet(() -> diseaseRepository.save(Disease.builder().disName(disName)
                                .build())
                        );

                DiseaseTag diseaseTag = DiseaseTag.builder()
                        .disease(disease)
                        .build();

                diseaseTag.changePatient(patient);
            }
        }

        return PatientDto.Response.toDetailDto(patient, user);
    }


}
