package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PROPOSER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Proposer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROPOSER_NO")
    private Long proposerNo;

    @ManyToOne
    @JoinColumn(name = "HIRING_NO", nullable = false)
    private Hiring hiring;

    @ManyToOne
    @JoinColumn(name = "CAREGIVER_NO", nullable = false)
    private User caregiver;

    @Column(name = "Status", length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;

    @Column(name = "PROPOSER_DATE", nullable = false)
    private LocalDateTime proposerDate;

    //이력서 번호를 insert 시켜서 남김
    @Column(name = "RESUME_NO", nullable = false)
    private LocalDateTime resumeNo;

    @PrePersist
    public void prePersist(){
        this.proposerDate = LocalDateTime.now();

        if(status == null){
            this.status = StatusEnum.Status.Y;
        }
    }
}
