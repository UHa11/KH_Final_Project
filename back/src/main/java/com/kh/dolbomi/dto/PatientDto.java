package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.enums.StatusEnum;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class PatientDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {

        private Long guardian_no;
        private String pat_name;
        private Integer pat_age;
        private String pat_phone;
        private StatusEnum.Gender pat_gender;
        private BigDecimal pat_weight;
        private BigDecimal pat_height;
        private String pat_address;
        private String pat_content;
        private String status;
        private String profile_image;
        private List<String> disease_tags;

        public Patient toEntity(User user) {
            return Patient.builder()
                    .guardian(user)
                    .patName(this.pat_name)
                    .patPhone(this.pat_phone)
                    .patAge(this.pat_age)
                    .patWeight(this.pat_weight)
                    .patHeight(this.pat_height)
                    .profileImage(null)
                    .patContent(this.pat_content)
                    .patGender(this.pat_gender)
                    .patAddress(this.pat_address)
                    .profileImage(this.profile_image)
                    .build();
        }
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @ToString
    public static class Response {
        private Long pat_no;

        private String pat_name;
        private Integer pat_age;
        private String pat_phone;
        private StatusEnum.Gender pat_gender;
        private BigDecimal pat_weight;
        private BigDecimal pat_height;
        private String pat_address;
        private String pat_content;
        private String status;
        private List<String> disease_tags;

        private String phone; // 보호자 번호

        private String profile_image; //환자 프로필

        public static PatientDto.Response toDto(Patient patient) {
            return Response.builder()
                    .pat_no(patient.getPatNo())
                    .pat_name(patient.getPatName())
                    .pat_age(patient.getPatAge())
                    .pat_gender(patient.getPatGender())
                    .profile_image(patient.getProfileImage())
                    .build();
        }

        public static PatientDto.Response toDetailDto(Patient patient, User user) {

            return Response.builder()
                    .pat_no(patient.getPatNo())
                    .pat_name(patient.getPatName())
                    .pat_age(patient.getPatAge())
                    .pat_phone(patient.getPatPhone())
                    .pat_gender(patient.getPatGender())
                    .pat_weight(patient.getPatWeight())
                    .pat_height(patient.getPatHeight())
                    .pat_address(patient.getPatAddress())
                    .pat_content(patient.getPatContent())

                    //보호자 연락처
                    .phone(user.getPhone())
                    //환자 프로필
                    .profile_image(patient.getProfileImage())
                    // 질병 정보 (List<String>)
                    .disease_tags(
                            patient.getDiseaseTags().stream()
                                    .map(diseaseTag -> diseaseTag.getDisease().getDisName())
                                    .toList()
                    )
                    .build();


        }

    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Update {

        private Long pat_no;
        private String pat_name;
        private Integer pat_age;
        private String pat_phone;
        private StatusEnum.Gender pat_gender;
        private BigDecimal pat_weight;
        private BigDecimal pat_height;
        private String pat_address;
        private String pat_content;
        private String status;
        private List<String> disease_tags;
        private String profile_image;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AiResponse {

        private String pat_name;
        private String response;
        private String error;

//        public static AiResponse toDto(String patName, String response){
//            return  AiResponse.builder()
//                    .pat_name(patName)
//                    .response(response)
//                    .build();
//        }
    }
}
