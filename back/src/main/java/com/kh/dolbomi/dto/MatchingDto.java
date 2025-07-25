package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Matching;
import com.kh.dolbomi.enums.StatusEnum;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public class MatchingDto {


    //매칭 insert 하는 dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {
        private Long resume_no;
        private Long hiring_no;
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long mat_no;
        private Long caregiver_no;
        private String user_name;
        private Integer age;
        private StatusEnum.Gender gender;
        private LocalDateTime start_date;
        private LocalDateTime end_date;
        private StatusEnum.Status status;
        private Long review_no;
        private String caregiver_profile_image;
        private StatusEnum.Status user_status;

        public static Response toDto(Matching matching) {
            return Response.builder()
                    .mat_no(matching.getMatNo())
                    .caregiver_no(matching.getCaregiver().getUserNo())
                    .user_name(matching.getCaregiver().getUserName())
                    .age(matching.getCaregiver().getAge())
                    .gender(matching.getCaregiver().getGender())
                    .start_date(matching.getStartDate())
                    .end_date(matching.getEndDate())
                    .status(matching.getStatus())
                    .review_no(matching.getReview() != null ? matching.getReview().getReviewNo() : null)
                    .caregiver_profile_image(matching.getCaregiver().getProfileImage())
                    .user_status(matching.getCaregiver().getStatus())
                    .build();
        }


    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResponsePat {
        private Long mat_no;
        private Long pat_no;
        private String pat_name;
        private Integer pat_age;
        private StatusEnum.Gender pat_gender;
        private LocalDateTime start_date;
        private LocalDateTime end_date;
        private StatusEnum.Status status;
        private Long review_no;
        private String profile_image;

        public static ResponsePat from(Matching matching) {
            return ResponsePat.builder()
                    .mat_no(matching.getMatNo())
                    .pat_no(matching.getPatient().getPatNo())
                    .pat_name(matching.getPatient().getPatName())
                    .pat_age(matching.getPatient().getPatAge())
                    .pat_gender(matching.getPatient().getPatGender())
                    .start_date(matching.getStartDate())
                    .end_date(matching.getEndDate())
                    .status(matching.getStatus())
                    .review_no(matching.getReview() != null ? matching.getReview().getReviewNo() : null)
                    .profile_image(matching.getPatient().getProfileImage())
                    .build();
        }
    }

    //매칭 insert 하는 dto
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Search {
        private Long pat_no;
        private LocalDateTime start_date;
        private LocalDateTime end_date;
    }


}
