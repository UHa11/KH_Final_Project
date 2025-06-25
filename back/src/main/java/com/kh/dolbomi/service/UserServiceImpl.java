package com.kh.dolbomi.service;


import com.kh.dolbomi.domain.License;
import com.kh.dolbomi.domain.User;
import com.kh.dolbomi.dto.LicenseDto;
import com.kh.dolbomi.dto.UserDto;
import com.kh.dolbomi.repository.LicenseRepository;
import com.kh.dolbomi.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final LicenseRepository licenseRepository;
    // PasswordEncoder 주입
    private final BCryptPasswordEncoder passwordEncoder;

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
    public UserDto.Response loginUser(String userId, String userPwd) {
        List<User> users = userRepository.findByUserId(userId);

        if (users.isEmpty()) {
            throw new EntityNotFoundException("해당 아이디를 찾을 수 없습니다.");
        }

        User user = users.get(0);

        if (!passwordEncoder.matches(userPwd, user.getUserPwd())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return UserDto.Response.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto.ProfileDto getUserProfile(Long userNo) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));
        return UserDto.ProfileDto.toDto(user);
    }

    @Override
    public UserDto.Response updateUser(Long userNo, UserDto.Update updateDto) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));

        //1. 유저 정보 업데이트
        user.updateUserInfo(
                updateDto.getUser_name(),
                updateDto.getAge(),
                updateDto.getGender(),
                updateDto.getPhone(),
                updateDto.getEmail(),
                updateDto.getAddress()
        );

        // 2. 기존 자격증 조회
        List<License> existingLicenses = licenseRepository.findByUser(user);
        // 3. 프론트에서 넘어온 자격증
        List<LicenseDto> incomingDtos = updateDto.getLicenses();

        // 4. 삭제 처리 (DB엔 있는데 프론트엔 없는 경우)
        List<Long> incomingIds = incomingDtos.stream()
                .map(LicenseDto::getLicense_no)
                .filter(id -> id != null)
                .toList();

        List<License> toDelete = existingLicenses.stream()
                .filter(license -> !incomingIds.contains(license.getLicenseNo()))
                .toList();

        licenseRepository.deleteAll(toDelete);
        // 5. 신규 및 수정 처리
        for (LicenseDto dto : incomingDtos) {
            if (dto.getLicense_no() != null) {
                // 수정
                License license = existingLicenses.stream()
                        .filter(l -> l.getLicenseNo().equals(dto.getLicense_no()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("존재하지 않는 자격증"));

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

}








