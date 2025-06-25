package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.enums.StatusEnum;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {
        private String user_id;
        private String user_pwd;
        private String user_name;
        private Integer age;
        private User.Gender gender;
        private String phone;
        private String address;
        private String email;

        public User toEntity() {
            return User.builder()
                    .userId(this.user_id)
                    .userPwd(this.user_pwd)
                    .userName(this.user_name)
                    .age(this.age)
                    .gender(this.gender)
                    .phone(this.phone)
                    .address(this.address)
                    .email(this.email)
                    .build();
        }
    }

    // 2. 로그인 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Login {
        private String user_id;
        private String user_pwd;
    }

    // 3. 응답 DTO
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long user_no;
        private String user_id;
        private String user_name;
        private String email;
        private User.Gender gender;
        private String phone;
        private String address;
        private Integer age;
        private StatusEnum.Status status;

        public static Response toDto(User user) {
            return Response.builder()
                    .user_no(user.getUserNo())
                    .user_id(user.getUserId())
                    .user_name(user.getUserName())
                    .gender(user.getGender())
                    .age(user.getAge())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .status(user.getStatus())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Update {

        //private String profileImage
        private String user_name;
        private Integer age;
        private User.Gender gender;
        private String phone;
        private String email;
        private String address;

        // 자격증 여러 개를 받도록 리스트로 수정
        private List<LicenseDto> licenses;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfileDto {

        private Long user_no;
        private String user_id;
        private String user_name;
        private String phone;
        private String email;
        private String address;
        private Integer age;
        private User.Gender gender;

        private List<LicenseDto> licenses;

        public static ProfileDto toDto(User user) {
            return ProfileDto.builder()
                    .user_no(user.getUserNo())
                    .user_id(user.getUserId())
                    .user_name(user.getUserName())
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .age(user.getAge())
                    .gender(user.getGender())
                    .licenses(
                            user.getLicenses().stream()
                                    .map(LicenseDto::toDto)
                                    .collect(Collectors.toList())
                    )
                    .build();
        }
    }
}
