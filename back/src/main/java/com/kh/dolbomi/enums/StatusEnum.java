package com.kh.dolbomi.enums;

public class StatusEnum {
    public enum Status {
        Y, // 활성 또는 공개
        N, // 비활성 또는 삭제
        W  // 대기 (Waiting)
    }
    public enum Gender {
        M,F
    }

    public enum CareStatus {
        Y, // 숙식 제공 가능
        N  // 숙식 제공 불가
    }

    //게시판에 필요한상태
    public enum Role {
        G, // 보호자 (Guardian)
        C, // 간병인 (Caregiver)
        Q  // 문의 (Question)
    }

    //채팅에 필요한상태
    public enum CheckStatus {
        Y, // 읽음
        N  // 안 읽음
    }
}
