package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HIRING")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Hiring {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIRING_NO")
    private Long hiringNo;

    @ManyToOne
    @JoinColumn(name = "PAT_NO", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "USER_NO", nullable = false)
    private User user;

    @Column(name = "HIRING_TITLE", nullable = false, length = 20)
    private String hiringTitle;

    @Column(name = "HIRING_CONTENT", nullable = false, columnDefinition = "TEXT")
    private String hiringContent;

    @Column(name = "ACCOUNT")
    private Integer account;

    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    @Column(name = "END_DATE", nullable = false)
    private LocalDate endDate;

    //지원자 몇명 받을지
    @Column(name = "MAX_APPLICANTS", nullable = false)
    private Integer maxApplicants;

    @Column(name = "CARE_STATUS", nullable = false, length = 1)
    private StatusEnum.CareStatus careStatus;

    @Column(name = "ROOM_IMAGE", length = 100)
    private String roomImage;

    @Column(name = "HIRING_STATUS", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status hiringStatus;

    @Column(name = "STATUS", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;

    @Column(name = "CREATE_DATE", nullable = false)
    private LocalDateTime createDate;

    @Column(name = "UPDATE_DATE", nullable = false)
    private LocalDateTime updateDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();

        if (status == null) {
            this.status = StatusEnum.Status.Y;
        }

        if (hiringStatus == null) {
            this.hiringStatus = StatusEnum.Status.Y;
        }

        // 상주 여부를 프론트에서는 라디오 버튼임 (무조건 고르게 하면 상관 없지만 혹시 몰라서 추가함)
        if (careStatus == null) {
            this.careStatus = StatusEnum.CareStatus.N;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updateDate = LocalDateTime.now();
    }

    //삭제 상태로 바꾸기
    public void hiringDeleted() {
        this.status = StatusEnum.Status.N;
    }
}