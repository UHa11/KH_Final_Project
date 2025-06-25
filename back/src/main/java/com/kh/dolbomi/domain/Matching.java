package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MATCHING")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Matching {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAT_NO")
    private Long matNo;

    @ManyToOne
    @JoinColumn(name = "CAREGIVER_NO", nullable = false)
    private User caregiver;

    @ManyToOne
    @JoinColumn(name = "PAT_NO", nullable = false)
    private Patient patient;

    @Column(name = "REVIEW_NO")
    private Long reviewNo;

    @Column(name = "STATUS", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;

    @Column(name = "START_DATE", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "END_DATE")
    private LocalDateTime endDate;

    @PrePersist
    public void prePersist() {
        this.startDate = LocalDateTime.now();

        if(status == null){
            this.status = StatusEnum.Status.Y;
        }
    }


}