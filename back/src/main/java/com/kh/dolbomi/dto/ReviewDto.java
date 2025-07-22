package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Review;
import com.kh.dolbomi.enums.StatusEnum;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ReviewDto {

    @Getter
    @AllArgsConstructor
    @Builder
    @Setter
    public static class Response {
        // ===== 유저 =====
        private Long user_no;
        private String user_name;
        private Integer age;
        private StatusEnum.Gender gender;
        private String address;
        private String profile_image;

        // ===== 리뷰 =====
        private Long review_no;
        private String review_content;
        private BigDecimal review_score;
        private LocalDateTime review_update_date;
        private StatusEnum.Status review_status;

        public static Response mainReviewDto(Review review) {
            return Response.builder()
                    .review_no(review.getReviewNo())
                    .profile_image(review.getWriter().getProfileImage())
                    .user_name(
                            review.getMatchingList().stream()
                                    .findFirst()
                                    .map(m -> m.getCaregiver().getUserName())
                                    .orElse(null) // 추후 에러로 대체
                    )
                    .age(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getAge())
                            .orElse(null) // 추후 에러로 대체)
                    )
                    .gender(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getGender())
                            .orElse(null) // 추후 에러로 대체)
                    )
                    .address(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getAddress())
                            .orElse(null))
                    .review_content(review.getReviewContent())
                    .review_score(review.getScore())
                    .review_update_date(review.getUpdateDate())
                    .profile_image(
                            review.getMatchingList().stream().findFirst().map(m -> m.getCaregiver().getProfileImage())
                                    .orElse(null))
                    .build();
        }

        public static Response MyWrittenReviewDto(Review review) {
            return Response.builder()
                    .review_no(review.getReviewNo())
                    .profile_image(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getProfileImage())
                            .orElse(null) // 추후 에러로 대체)
                    )
                    .user_name(
                            review.getMatchingList().stream()
                                    .findFirst()
                                    .map(m -> m.getCaregiver().getUserName())
                                    .orElse(null) // 추후 에러로 대체
                    )
                    .age(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getAge())
                            .orElse(null) // 추후 에러로 대체)
                    )
                    .gender(review.getMatchingList().stream()
                            .findFirst()
                            .map(m -> m.getCaregiver().getGender())
                            .orElse(null) // 추후 에러로 대체)
                    )
                    .review_content(review.getReviewContent())
                    .review_score(review.getScore())
                    .review_update_date(review.getUpdateDate())
                    .build();
        }

        public static Response ReceivedReviewDto(Review review) {
            return Response.builder()
                    .review_no(review.getReviewNo())
                    .profile_image(review.getWriter().getProfileImage()) // 리뷰 작성자 정보
                    .user_name(review.getWriter().getUserName())
                    .age(review.getWriter().getAge())
                    .gender(review.getWriter().getGender())
                    .address(review.getWriter().getAddress())
                    .review_content(review.getReviewContent())
                    .review_score(review.getScore())
                    .review_update_date(review.getUpdateDate())
                    .build();
        }

    }

    @Getter
    @AllArgsConstructor
    @Builder
    @Setter
    public static class Detail {
        private Long review_no;
        private String profile_image;
        private String review_writer_name;
        private Integer review_age;
        private StatusEnum.Gender gender;
        private String review_content;
        private BigDecimal score;
        private LocalDateTime update_date;
        private Long caregiver_no;


        public static Detail ResumeReviewDetailDto(Review review, Long caregiverNo) {
            return Detail.builder()
                    .review_no(review.getReviewNo())
                    .profile_image(review.getWriter().getProfileImage())
                    .review_writer_name(review.getWriter().getUserName())
                    .review_age(review.getWriter().getAge())
                    .gender(review.getWriter().getGender())
                    .review_content(review.getReviewContent())
                    .score(review.getScore())
                    .update_date(review.getUpdateDate())
                    .caregiver_no(caregiverNo)
                    .build();
        }
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        private Long mat_no;
        private Long review_writer_no;
        private String review_content;
        private BigDecimal score;

    }
}
