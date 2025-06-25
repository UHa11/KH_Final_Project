package com.kh.dolbomi.dto;

import com.kh.dolbomi.domain.Report;
import com.kh.dolbomi.enums.StatusEnum;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ReportDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Create {
        private Long pat_no;
        private String report_title;
        private String report_content;
        private LocalDateTime create_date;
        private LocalDateTime update_date;
        private StatusEnum.Status status;

        public Report toEntity() {
            return Report.builder()
                    .reportTitle(this.report_title)
                    .reportContent(this.report_content)
                    .createDate(this.create_date)
                    .updateDate(this.update_date)
                    .status(this.status)
                    .build();
        }
    }
}
