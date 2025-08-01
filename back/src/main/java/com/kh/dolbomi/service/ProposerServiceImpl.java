package com.kh.dolbomi.service;


import com.kh.dolbomi.domain.Hiring;
import com.kh.dolbomi.domain.Matching;
import com.kh.dolbomi.domain.Notification;
import com.kh.dolbomi.domain.Patient;
import com.kh.dolbomi.domain.Proposer;
import com.kh.dolbomi.domain.Resume;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.dto.ProposerDto;
import com.kh.dolbomi.enums.StatusEnum;
import com.kh.dolbomi.exception.HiringNotFoundException;
import com.kh.dolbomi.exception.ProposerNotFoundException;
import com.kh.dolbomi.exception.ResumeNotFoundException;
import com.kh.dolbomi.exception.UserNotFoundException;
import com.kh.dolbomi.repository.HiringRepository;
import com.kh.dolbomi.repository.HiringRepositoryV2;
import com.kh.dolbomi.repository.MatchingRepositoryV2;
import com.kh.dolbomi.repository.NotificationRepositoryV2;
import com.kh.dolbomi.repository.ProposerRepository;
import com.kh.dolbomi.repository.ProposerRepositoryV2;
import com.kh.dolbomi.repository.ResumeRepositoryV2;
import com.kh.dolbomi.repository.UserRepositoryV2;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProposerServiceImpl implements ProposerService {

    private final ProposerRepository proposerRepository;
    private final ProposerRepositoryV2 proposerRepositoryV2;
    private final HiringRepository hiringRepository;
    private final ResumeRepositoryV2 resumeRepositoryV2;
    private final UserRepositoryV2 userRepositoryV2;
    private final MatchingRepositoryV2 matchingRepositoryV2;
    private final NotificationRepositoryV2 notificationRepositoryV2;
    private final HiringRepositoryV2 hiringRepositoryV2;

    @Transactional(readOnly = true)
    @Override
    public ProposerDto.ResponseWithCount findProposersByHiringNo(Long hiringNo) {
        List<Proposer> proposers = proposerRepositoryV2.findByHiring_HiringNo(hiringNo);

        List<ProposerDto.Response> dtoList = proposers.stream()
                .map(ProposerDto.Response::toDto)
                .toList();

        return ProposerDto.ResponseWithCount.builder()
                .count(dtoList.size())
                .proposers(dtoList)
                .build();
    }

    //신청 하기
    @Override
    public Long createProposer(ProposerDto.Create createProposerDto) {

        Hiring hiring = hiringRepository.findById(createProposerDto.getHiring_no())
                .orElseThrow(() -> new HiringNotFoundException("해당 공고가 없습니다."));

        Resume resume = resumeRepositoryV2.findById(createProposerDto.getResume_no())
                .orElseThrow(() -> new ResumeNotFoundException("해당 이력서를 찾을 수 없습니다."));

        User caregiver = userRepositoryV2.findById(createProposerDto.getCaregiver_no())
                .orElseThrow(() -> new UserNotFoundException("해당 간병인을 찾을 수 없습니다."));

        Proposer proposer = createProposerDto.toEntity(hiring, resume, caregiver);
        proposerRepositoryV2.save(proposer);

        // 알림 생성
        User recipient = hiring.getUser();  // 보호자
        User sender = caregiver;            // 간병인
        String notificationMessage = caregiver.getUserName() + "님이 \"" + hiring.getHiringTitle() + "\" 구인글에 신청했습니다.";
        String notificationLinkUrl = "/hireDetail/" + hiring.getHiringNo(); // 프론트 링크

        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .notificationMessage(notificationMessage)
                .notificationLinkUrl(notificationLinkUrl)
                .build();

        notificationRepositoryV2.save(notification);

        return proposer.getProposerNo();
    }

    @Transactional(readOnly = true)
    @Override
    public StatusEnum.Status findProposerStatus(Long hiringNo, Long caregiverNo) {
        return proposerRepository.findStatusByHiringNoAndCaregiverNo(hiringNo, caregiverNo);
    }

    @Override
    public void cancel(Long hiringNo, Long caregiverNo) {
        Optional<Proposer> proposerOpt = proposerRepositoryV2.findByHiring_HiringNoAndCaregiver_UserNo(hiringNo,
                caregiverNo);

        Proposer proposer = proposerOpt.orElseThrow(() ->
                new ProposerNotFoundException("신청자가 존재하지 않습니다."));
        proposerRepositoryV2.delete(proposer);
    }

    @Override
    public void acceptMatching(Long resumeNo, Long hiringNo) {

        // 1. 프로포저 상태 업데이트
        Proposer proposer = proposerRepository.findByHiringNoAndResumeNo(hiringNo, resumeNo)
                .orElseThrow(() -> new ProposerNotFoundException("신청 정보가 없습니다."));

        proposer.updateStatus(StatusEnum.Status.Y); // 수락 상태로 변경

        // 2. 매칭 생성
        User caregiver = proposer.getCaregiver();
        Hiring hiring = proposer.getHiring();
        Patient patient = hiring.getPatient();
        //추후 이력서 번호도 매칭할때 같이 넣고싶으면 추가해도 될듯?

        Matching matching = Matching.builder()
                .caregiver(caregiver)
                .patient(patient)
                .hiring(hiring)
                .status(StatusEnum.Status.Y)
                .startDate(LocalDateTime.now())
                .build();

        matchingRepositoryV2.save(matching);

        // 3. 수락 상태인 신청 건수 조회
        int acceptedCount = proposerRepositoryV2.countByHiringAndStatus(hiring, StatusEnum.Status.Y);
        log.info("수락된 신청 건수: {}", acceptedCount);

        // 4. maxApplication과 같으면 hiring_status를 'N'으로 변경
        if (acceptedCount >= hiring.getMaxApplicants()) {
            hiring.closeHiring();  // 'N'이 모집 마감
            // 변경된 hiring 저장
            hiringRepository.save(hiring);
        }

        // 5. 매칭 수락 알림 생성
        User recipient = caregiver;  // 알림 받을 사람은 간병인
        User sender = hiring.getUser();  // 알림 보내는 사람은 보호자 (채용자)
        String notificationMessage = sender.getUserName() + "님의 돌봄대상자와 매칭이 시작되었습니다.";
        String notificationLinkUrl = "/caregiver/matchpage"; // 매칭 페이지 링크

        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .notificationMessage(notificationMessage)
                .notificationLinkUrl(notificationLinkUrl)
                .build();

        notificationRepositoryV2.save(notification);
    }

    @Override
    public boolean isAccepted(Long resumeNo, Long hiringNo) {
        return proposerRepositoryV2.existsByResume_ResumeNoAndHiring_HiringNoAndStatus(
                resumeNo, hiringNo, StatusEnum.Status.Y
        );
    }

    // 나의 지원현황 목록
    @Transactional(readOnly = true)
    @Override
    public Page<ProposerDto.Response> getMyProposerLists(Long userNo, Pageable pageable) {
        Page<Proposer> proposers = proposerRepository.getMyProposerLists(StatusEnum.Status.Y, pageable, userNo);
        return proposers.map(ProposerDto.Response::myProposerDto);
    }

    // 나의 지원현황 내역삭제
    @Override
    public Long deleteProposerHistory(Long proposerNo) {
        // 신청 내역 가져오기 (없으면 예외 발생)
        Proposer proposer = proposerRepository.findHiringByNo(proposerNo)
                .orElseThrow(() -> new ProposerNotFoundException("이미 삭제된 신청내역입니다."));

        // 상태 업데이트
        proposer.updateStatus();

        // 그대로 proposerNo 반환
        return proposer.getProposerNo();
    }

    @Override
    public Map<String, Object> getHiringOwnerInfo(Long hiringNo) {
        Hiring hiring = hiringRepositoryV2.findById(hiringNo)
                .orElseThrow(() -> new HiringNotFoundException("구인글이 존재하지 않습니다."));

        User owner = hiring.getUser();
        if (owner == null) {
            throw new UserNotFoundException("구인글 작성자가 존재하지 않습니다.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("ownerUserNo", owner.getUserNo());
        result.put("hiringStatus", hiring.getHiringStatus());

        return result;
    }

}
