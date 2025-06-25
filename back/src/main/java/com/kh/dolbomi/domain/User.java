package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) //JPA 스펙상 필수 + 외부 생성 방지
@Builder
@AllArgsConstructor
@Table(name = "`USER`") //이렇게 안하면 user는 예약어처리해서 구문 오류가 날 수 있음
@Getter
@DynamicInsert //insert시에 null이 아닌 필드만 쿼리에 포함, default값 활용
@DynamicUpdate //변경된 필드만 update문에
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_NO")
    private Long userNo;

    @Column(name = "USER_ID", nullable = false, unique = true, length = 20)
    private String userId;

    //암호화 적용시 길어져서 length 늘림
    @Column(name = "USER_PWD", nullable = false, length = 100)
    private String userPwd;

    @Column(name = "USER_NAME", nullable = false, length = 10)
    private String userName;

    @Column(name = "AGE", nullable = false)
    private Integer age;

    @Column(name = "GENDER", length = 1)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "PHONE", nullable = false, length = 13)
    private String phone;

    @Column(name = "ADDRESS", nullable = false, length = 30)
    private String address;

    @Column(name = "EMAIL", nullable = false, length = 20)
    private String email;

    @Column(name = "STATUS", nullable = false,  length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;

    @Column(name = "PROFILE_IMAGE", length = 100)
    private String profileImage;

    public enum Gender {
        M, F
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<License> licenses = new ArrayList<>();


   public void updateUserInfo(String userName, Integer age, Gender gender, String phone, String address, String email) {
       if (userName != null && !userName.trim().isEmpty()) {
           this.userName = userName.trim();
       }

       if (age != null && age > 0) {
           this.age = age;
       }

       if (gender != null) {
           this.gender = gender;
       }

       if (phone != null && !phone.trim().isEmpty()) {
           this.phone = phone.trim();
       }

       if (email != null && !email.trim().isEmpty()) {
           this.email = email.trim();
       }

       if (address != null && !address.trim().isEmpty()) {
           this.address = address.trim();
       }
   }


    @PrePersist
    public void prePersist() {
        if (status == null) {
            this.status = StatusEnum.Status.Y;
        }
    }

    // 비밀번호 암호화 변경 메서드
    public void changePassword(String encodedPassword) {
        this.userPwd = encodedPassword;
    }
}
