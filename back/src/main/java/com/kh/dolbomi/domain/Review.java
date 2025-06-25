package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "REVIEW")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_NO")
    private Long reviewNo;

    @ManyToOne
    @JoinColumn(name = "REVIEW_WRITER_NO", nullable = false)
    private User writer;

    @Column(name = "REVIEW_CONTENT", nullable = false, length = 100)
    private String reviewContent;

    @Column(name = "SCORE", nullable = false)
    private BigDecimal score;

    @Column(name = "CREATE_DATE", nullable = false)
    private LocalDateTime createDate;

    @Column(name = "UPDATE_DATE", nullable = false)
    private LocalDateTime updateDate;

    @Column(name = "STATUS", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        if (status == null){
            this.status = StatusEnum.Status.Y;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updateDate = LocalDateTime.now();
    }
}