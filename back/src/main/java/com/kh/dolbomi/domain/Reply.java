package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "REPLY")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REPLY_NO")
    private Long replyNo;

    @ManyToOne
    @JoinColumn(name = "BOARD_NO", nullable = false)
    private Board board;

    @ManyToOne
    @JoinColumn(name = "USER_NO", nullable = false)
    private User user;

    @Column(name = "REPLY_CONTENT", nullable = false, length = 100)
    private String replyContent;

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