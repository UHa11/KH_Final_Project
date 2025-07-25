package com.kh.dolbomi.dto.chat;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyChatResponse {
    private Long roomId;
    private String roomName;
    private Long unReadCount;
}
