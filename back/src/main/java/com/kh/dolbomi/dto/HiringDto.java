package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Hiring;
import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.enums.StatusEnum;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public class HiringDto {

    public static Response toDto(Hiring hiring) {
        Patient patient = hiring.getPatient();
        User user = hiring.getUser();

        return Response.builder()
                .hiring_no(hiring.getHiringNo())
                .hiring_title(hiring.getHiringTitle())
                .hiring_content(hiring.getHiringContent())
                .account(hiring.getAccount())
                .start_date(hiring.getStartDate())
                .end_date(hiring.getEndDate())
                .max_applicants(hiring.getMaxApplicants())
                .care_status(hiring.getCareStatus())
                .room_image(hiring.getRoomImage())

                // 환자 정보
                .pat_no(patient.getPatNo())
                .pat_name(patient.getPatName())
                .pat_age(patient.getPatAge())
                .pat_gender(patient.getPatGender().name())
                .pat_address(patient.getPatAddress())

                // 보호자 정보
                .phone(user.getPhone())

                // 질병 정보 (List<String>)
                .disease_tag(
                        patient.getDiseaseTags().stream()
                                .map(diseaseTag -> diseaseTag.getDisease().getDisName())
                                .toList()
                )
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        private Long pat_no;  // 프론트에서 환자 번호만 받는 경우
        private User user;    // 작성자 (보호자) - User 엔티티로 받아야 함
        private String hiring_title;
        private String hiring_content;
        private Integer account;

        private LocalDate start_date;
        private LocalDate end_date;

        private Integer max_applicants;
        private StatusEnum.CareStatus care_status;
        private String room_image;

        public Hiring toEntity(Patient patient) {
            return Hiring.builder()
                    .patient(patient)                // pat_no 대신 Patient 객체 세팅
                    .user(this.user)                // User 엔티티 직접 할당
                    .hiringTitle(this.hiring_title)
                    .hiringContent(this.hiring_content)
                    .account(this.account)
                    .startDate(this.start_date)
                    .endDate(this.end_date)
                    .maxApplicants(this.max_applicants)
                    .careStatus(this.care_status)
                    .roomImage(this.room_image)
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        //구인 정보
        private Long hiring_no;
        private String hiring_title;
        private String hiring_content;
        private Integer account;

        private LocalDate start_date;
        private LocalDate end_date;


        private Integer max_applicants;
        private StatusEnum.CareStatus care_status;
        private String room_image;

        //환자 정보
        private Long pat_no;
        private String pat_name;
        private Integer pat_age;
        private String pat_gender;
        private String pat_address;


        // 보호자 정보
        private String phone;

        // 질병 리스트 (ex: ["치매", "당뇨"])
        private List<String> disease_tag;

    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Update {

        private String hiring_title;
        private String hiring_content;
        private Integer account;
        private LocalDate start_date;
        private LocalDate end_date;
        private Integer max_applicants;
        private StatusEnum.CareStatus care_status;
        private String room_image;
    }

}

