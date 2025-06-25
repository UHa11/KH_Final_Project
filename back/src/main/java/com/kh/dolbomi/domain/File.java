package com.kh.dolbomi.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FILE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FILE_NO")
    private Long fileNo;

    @ManyToOne
    @JoinColumn(name = "BOARD_NO", nullable = false)
    private Board board;

    @Column(name = "FILE_NAME", length = 100)
    private String fileName;
}
