package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Notification;
import com.kh.dolbomi.enums.StatusEnum;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepositoryV2 extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient_UserNoOrderByNotificationCreateDateDesc(Long userNo);

    //읽음 여부 체크
    int countByRecipient_UserNoAndIsRead(Long userNo, StatusEnum.IS_READ isRead);

    //읽음으로 상태 변경
    List<Notification> findByRecipientUserNoAndIsRead(Long userNo, StatusEnum.IS_READ isRead);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.recipient.userNo = :userNo")
    void deleteByRecipient_UserNo(@Param("userNo") Long userNo);

}
