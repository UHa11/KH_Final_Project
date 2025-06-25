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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DISEASE_TAG")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DIS_TAG_NO")
    private Long disTagNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAT_NO", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DIS_NO", nullable = false)
    private Disease disease;

    public void changePatient(Patient patient) {
        this.patient = patient;
        patient.getDiseaseTags().add(this);
    }
}