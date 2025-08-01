package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.enums.Role;
import com.kh.dolbomi.enums.SocialType;
import com.kh.dolbomi.enums.StatusEnum;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create {

        @NotBlank(message = "아이디는 필수입니다.")
        private String user_id;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String user_pwd;

        @NotBlank(message = "이름은 필수입니다.")
        private String user_name;


        private Integer age;
        private StatusEnum.Gender gender;
        private String phone;
        private String address;

        // 소셜타입, 아이디 추가
        private SocialType social_type;
        private String social_id;

        public User toEntity() {
            return User.builder()
                    .userId(this.user_id)
                    .userPwd(this.user_pwd)
                    .userName(this.user_name)
                    .age(this.age)
                    .gender(this.gender)
                    .phone(this.phone)
                    .address(this.address)
                    .socialType(this.social_type)
                    .socialId(this.social_id)
                    .build();
        }
    }

    // 2. 로그인 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Login {

        @NotBlank(message = "아이디는 필수입니다.")
        private String user_id;

        @NotBlank(message = "비밀번호는 필수입니다.")
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
        private StatusEnum.Gender gender;
        private String phone;
        private String address;
        private Integer age;
        private Role role;

        private StatusEnum.Status status;

        public static Response toDto(User user) {
            return Response.builder()
                    .user_no(user.getUserNo())
                    .user_id(user.getUserId())
                    .user_name(user.getUserName())
                    .gender(user.getGender())
                    .age(user.getAge())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .status(user.getStatus())
                    .role(user.getRole())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Update {

        private String user_name;
        private Integer age;
        private StatusEnum.Gender gender;
        private String phone;
        private String address;
        private String profileImage;

        // 자격증 여러 개를 받도록 리스트로 수정
        private List<LicenseDto.Response> licenses;

        private String profile_image;
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
        private String address;
        private Integer age;
        private StatusEnum.Gender gender;
        private List<LicenseDto.Response> licenses;
        private String profile_image;
        private SocialType social_type;

        public static ProfileDto toDto(User user) {
            return ProfileDto.builder()
                    .user_no(user.getUserNo())
                    .user_id(user.getUserId())
                    .user_name(user.getUserName())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .age(user.getAge())
                    .gender(user.getGender())
                    .licenses(
                            user.getLicenses().stream()
                                    .map(LicenseDto::toDto)
                                    .collect(Collectors.toList())
                    )
                    .profile_image(user.getProfileImage())
                    .social_type(user.getSocialType())
                    .build();
        }
    }


    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class ResetPwdDto {
        private String user_id;
        private String user_pwd;
        private String code;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordDto {
        private String current_password;
        private String new_password;

    }

}
