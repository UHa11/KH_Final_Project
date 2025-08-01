package com.kh.dolbomi.service;


import com.kh.dolbomi.domain.License;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.dto.LicenseDto;
import com.kh.dolbomi.dto.UserCountsDto;
import com.kh.dolbomi.dto.UserDto;
import com.kh.dolbomi.dto.UserDto.Login;
import com.kh.dolbomi.dto.UserDto.ResetPwdDto;
import com.kh.dolbomi.enums.StatusEnum;
import com.kh.dolbomi.exception.LicenseNotFoundException;
import com.kh.dolbomi.exception.UserNotFoundException;
import com.kh.dolbomi.repository.HiringRepositoryV2;
import com.kh.dolbomi.repository.LicenseRepository;
import com.kh.dolbomi.repository.ResumeRepositoryV2;
import com.kh.dolbomi.repository.UserRepository;
import com.kh.dolbomi.repository.UserRepositoryV2;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final LicenseRepository licenseRepository;
    private final HiringRepositoryV2 hiringRepositoryV2;
    private final ResumeRepositoryV2 resumeRepositoryV2;
    //    private final BCryptPasswordEncoder passwordEncoder; 구버전
// PasswordEncoder 주입
    private final PasswordEncoder passwordEncoder;
    private final UserRepositoryV2 userRepositoryV2;

    @Override
    public Long createUser(UserDto.Create createDto) {
        User user = createDto.toEntity();

        String encodedPwd = passwordEncoder.encode(createDto.getUser_pwd());
        //비밀번호 암호화 추가
        user.changePassword(encodedPwd);
        userRepository.save(user);
        return user.getUserNo();  // PK 반환 (id 필드 존재 시)
    }

    @Transactional(readOnly = true)
    @Override
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findByUserId(userId).isEmpty();

    }

    @Override
    public User loginUser(Login loginDto) {
        Optional<User> optUser = userRepositoryV2.findByUserId(loginDto.getUser_id());

        if (!optUser.isPresent()) {
            throw new UserNotFoundException("해당 아이디를 찾을 수 없습니다.");
        }

        User user = optUser.get();

        // 상태가 탈퇴(N)면 예외 발생
        if (user.getStatus() == StatusEnum.Status.N) {
            throw new IllegalArgumentException("탈퇴된 계정입니다.");
        }

        if (!passwordEncoder.matches(loginDto.getUser_pwd(), user.getUserPwd())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    @Override
    public UserDto.Response getUserInfoByUserId(String userId) {
        User user = userRepositoryV2.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("회원정보를 찾을 수 없습니다."));
        return UserDto.Response.toDto(user);
    }

    // 이메일로 유저 정보 찾기
//    @Override
//    public Response getUserInfoByEmail(String email) {
//        User user = userRepositoryV2.findByEmail(email)
//                .orElseThrow(() -> new UserNotFoundException("회원정보를 찾을 수 없습니다."));
//        return UserDto.Response.toDto(user);
//    }


    @Override
    @Transactional(readOnly = true)
    public UserDto.ProfileDto getUserProfile(Long userNo) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new UserNotFoundException("해당 회원을 찾을 수 없습니다."));
        return UserDto.ProfileDto.toDto(user);
    }

    @Override
    public UserDto.Response updateUser(Long userNo, UserDto.Update updateDto) {

        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new UserNotFoundException("해당 유저를 찾을 수 없습니다."));

        //1. 유저 정보 업데이트
        user.updateUserInfo(
                updateDto.getUser_name(),
                updateDto.getAge(),
                updateDto.getGender(),
                updateDto.getPhone(),
//                updateDto.getEmail(),
                updateDto.getAddress(),
                updateDto.getProfile_image()

        );

        // 2. 기존 자격증 조회
        List<License> existingLicenses = licenseRepository.findByUser(user);
        // 3. 프론트에서 넘어온 자격증
        List<LicenseDto.Response> incomingDtos = updateDto.getLicenses();

        // 4. 삭제 처리 (DB엔 있는데 프론트엔 없는 경우)
        List<Long> incomingIds = incomingDtos.stream()
                .map(LicenseDto.Response::getLicense_no)
                .filter(id -> id != null)
                .toList();

        List<License> toDelete = existingLicenses.stream()
                .filter(license -> !incomingIds.contains(license.getLicenseNo()))
                .toList();

        licenseRepository.deleteAll(toDelete);
        // 5. 신규 및 수정 처리
        for (LicenseDto.Response dto : incomingDtos) {
            if (dto.getLicense_no() != null) {
                // 수정
                License license = existingLicenses.stream()
                        .filter(l -> l.getLicenseNo().equals(dto.getLicense_no()))
                        .findFirst()
                        .orElseThrow(() -> new LicenseNotFoundException("해당 자격증을 찾을 수 없습니다."));

                license.updateInfo(dto.getLicense_name(), dto.getLicense_publisher(), dto.getLicense_date());
            } else {
                // 신규
                License newLicense = License.builder()
                        .user(user)
                        .licenseName(dto.getLicense_name())
                        .licensePublisher(dto.getLicense_publisher())
                        .licenseDate(dto.getLicense_date())
                        .build();

                licenseRepository.save(newLicense);
            }
        }

        return UserDto.Response.toDto(user);
    }

    @Override
    public void deleteUser(Long userNo) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new UserNotFoundException("삭제하려는 유저가 존재하지 않습니다."));
        user.changeStatus(StatusEnum.Status.N);

        //영속성 컨텍스트가 활성화된 상태라면 없어도 변경 가능
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    @Override
    public UserCountsDto getUserCounts() {
        int guardianCount = hiringRepositoryV2.countDistinctByUserNo();
        int caregiverCount = resumeRepositoryV2.countDistinctByUserNo();

        return new UserCountsDto(guardianCount, caregiverCount);
    }


    // 비밀번호 찾기 - 비밀번호 재설정
    @Override
    public void resetPassWord(ResetPwdDto resetPwdDto) {
        // 1. 회원정보 가져오기 -> 이메일로 회원 찾기
        // 2. 비밀번호 암호화 해서 변경하기

        // (1)
        User user = userRepositoryV2.findByUserId(resetPwdDto.getUser_id())
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        // (2)
        String encodedPwd = passwordEncoder.encode(resetPwdDto.getUser_pwd());
        //비밀번호 암호화 추가
        user.changePassword(encodedPwd);
        userRepository.save(user); // 생략가능

    }

    @Override
    public void changePassword(Long userNo, String currentPassword, String newPassword) {
        User user = userRepositoryV2.findById(userNo).orElseThrow(() -> new UserNotFoundException("회원 정보를 찾을 수 없습니다."));

        //현재 비밀번호 검증
        if (!passwordEncoder.matches(currentPassword, user.getUserPwd())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        //새 비밀번호 암호화 후 저장
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.changePassword(encodedNewPassword);
    }

}








