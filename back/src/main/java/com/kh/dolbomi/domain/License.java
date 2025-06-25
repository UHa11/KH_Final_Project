package com.kh.dolbomi.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "LICENSE")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LICENSE_NO")
    private Long licenseNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_NO", nullable = false)
    private User user;

    @Column(name = "LICENSE_NAME", nullable = false, length = 10)
    private String licenseName;

    @Column(name = "LICENSE_PUBLISHER", nullable = false, length = 10)
    private String licensePublisher;

    @Column(name = "LICENSE_DATE", nullable = false)
    private LocalDate licenseDate;

    public void updateInfo(String licenseName, String licensePublisher, LocalDate licenseDate) {
        this.licenseName = licenseName;
        this.licensePublisher = licensePublisher;
        this.licenseDate = licenseDate;
    }
}
