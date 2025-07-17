package com.kh.dolbomi.controller;


import com.kh.dolbomi.dto.NotificationDto;
import com.kh.dolbomi.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    //알림 리스트 갖고오기
    @GetMapping("/list")
    public List<NotificationDto.Response> getNotifications(@RequestParam("user_no") Long userNo) {
        return notificationService.getNotificationsByUserNo(userNo);
    }

    //알림 안읽은 개수 판단
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadCount(@RequestParam("user_no") Long userNo) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userNo));
    }

    //알림 창 열었을 시 읽음표시로 변경
    @PatchMapping("/mark-read")
    public ResponseEntity<Void> markNotificationsAsRead(@RequestParam("user_no") Long userNo) {
        notificationService.markAllNotificationsAsRead(userNo);
        return ResponseEntity.ok().build();
    }

    //알림 전체 삭제
    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAllNotifications(@RequestParam("user_no") Long userNo) {
        notificationService.deleteAllByUserNo(userNo);
        return ResponseEntity.noContent().build(); // 삭제는 json 바디가 필요 없기 때문에 noContent 사용
    }

    //알림 개별 삭제
    // 알림 개별 삭제
    @DeleteMapping("/{notificationNo}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationNo) {
        notificationService.deleteNotification(notificationNo);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

}
