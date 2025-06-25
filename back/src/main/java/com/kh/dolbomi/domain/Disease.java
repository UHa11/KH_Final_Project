package com.kh.dolbomi.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DISEASE")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DIS_NO")
    private Long disNo;

    @Column(name = "DIS_NAME", length = 10, nullable = false)
    private String disName;

    // 양방향 관계 원한다면
    // @OneToMany(mappedBy = "disease", fetch = FetchType.LAZY)
    // private List<DiseaseTag> diseaseTags;
}