package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.enums.StatusEnum;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ResumeDto {

    @Getter
    @AllArgsConstructor
    @Builder
    @Setter
    public static class Response {
        // ===== 이력서 =====
        private Long resume_no;
        private String resume_title;
        private String resume_content;
        private Integer account;
        private LocalDateTime update_date; // create_date는 업데이트시 값을 추적못하기 때문에 update_date로 설정
        private StatusEnum.CareStatus care_status;
        private StatusEnum.Status status;

        // ===== 유저 =====
        private String user_name;
        private Integer age;
        private String gender;
        private String address;
        // private String email;
        private String profile_image;

        // ===== 자격증 =====
        private String license_name;
        private String license_publisher;
        private LocalDateTime license_date;
        private boolean has_license; // 자격증 있는지 여부 -> 메인페이지에 사용


        public static Response mainResumeDto(Resume resume) {
            return Response.builder()
                    .resume_no(resume.getResumeNo())
                    .user_name(resume.getUser().getUserName())
                    .age(resume.getUser().getAge())
                    .account(resume.getAccount())
                    .address(resume.getUser().getAddress())
                    .profile_image(resume.getUser().getProfileImage())
                    // 라이센스가 null이 아니고, 비어있지 않으면 true, 하나라도 만족하지 못하면 false
                    .has_license(resume.getUser().getLicenses() != null && !resume.getUser().getLicenses().isEmpty())
                    .build();
        }
    }
}
