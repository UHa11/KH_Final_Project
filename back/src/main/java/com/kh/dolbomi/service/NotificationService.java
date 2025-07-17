package com.kh.dolbomi.service;

import com.kh.dolbomi.dto.NotificationDto;
import java.util.List;

public interface NotificationService {

    //알림 생성
    void createNotification(Long recipientNo, Long senderNo, String notificationMessage, String notificationLinkUrl);

    //알림 조회
    List<NotificationDto.Response> getNotificationsByUserNo(Long userNo);

    //알림 안읽음 여부 판단
    int getUnreadCount(Long userNo);

    //알림 읽음 상태 변경
    void markAllNotificationsAsRead(Long userNo);

    //알림 전체 삭제
    void deleteAllByUserNo(Long userNo);

    //알림 개별 삭제
    void deleteNotification(Long notificationNo);
}
