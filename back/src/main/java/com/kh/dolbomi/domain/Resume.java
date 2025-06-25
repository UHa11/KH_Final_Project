package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import java.time.LocalDateTime;


@Entity
    @Table(name = "RESUME")
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED) // 생성자를 통해서 값 변경 목적으로 접근하는 메시지들 차단
    @AllArgsConstructor
    @Builder
    @DynamicInsert //insert시에 null이 아닌 필드만 쿼리에 포함, default값 활용
    @DynamicUpdate //변경된 필드만 update문에 포함
    public class Resume {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "RESUME_NO")
        private Long resumeNo;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "USER_NO", nullable = false)
        private User user;

        @Column(name = "RESUME_TITLE", nullable = false, length = 20)
        private String resumeTitle;

        @Column(name = "RESUME_CONTENT", nullable = false, columnDefinition = "TEXT")
        private String resumeContent;

        @Column(name = "ACCOUNT", nullable = false)
        private Integer account;

        @Column(name = "CREATE_DATE", nullable = false)
        private LocalDateTime createDate;

        @Column(name = "UPDATE_DATE", nullable = false)
        private LocalDateTime updateDate;

        @Column(name = "CARE_STATUS", nullable = false, length = 1)
        @Enumerated(EnumType.STRING)
        private StatusEnum.CareStatus careStatus;

        @Column(name = "STATUS", nullable = false, length = 1)
        @Enumerated(EnumType.STRING)
        private StatusEnum.Status status;

        @PrePersist
        public void prePersist() {
            this.createDate = LocalDateTime.now();
            this.updateDate = LocalDateTime.now();

            if(careStatus == null) {
                this.careStatus = StatusEnum.CareStatus.N;
            }

            if(status == null){
                this.status = StatusEnum.Status.W;
            }
        }

        @PreUpdate
        public void preUpdate() {
            this.updateDate = LocalDateTime.now();
        }
    }
