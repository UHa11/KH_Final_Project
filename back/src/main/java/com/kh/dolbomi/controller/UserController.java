package com.kh.dolbomi.controller;


import com.kh.dolbomi.dto.UserDto;
import com.kh.dolbomi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")// 프론트와 백엔드 url이 다른것을 맞춰주기 위한 어노테이션
public class UserController {

    private final UserService userService;

    //회원 등록
    @PostMapping
    public ResponseEntity<Long> addUser(@RequestBody UserDto.Create createDto) {
        Long userNo = userService.createUser(createDto);
        return ResponseEntity.ok(userNo);
    }

    //아이디 중복 체크
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String userId) {
        boolean available = userService.isUserIdAvailable(userId);
        return ResponseEntity.ok(available);
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<UserDto.Response> login(@RequestBody UserDto.Login loginDto) {
        UserDto.Response currentUser = userService.loginUser(loginDto.getUser_id(), loginDto.getUser_pwd());

        return ResponseEntity.ok(currentUser);
    }

    //회원 정보 불러오기
    @GetMapping
    public ResponseEntity<UserDto.ProfileDto> getUserProfile(@RequestParam("user_no") Long userNo) {
        UserDto.ProfileDto profile = userService.getUserProfile(userNo);
        return ResponseEntity.ok(profile);
    }

    //회원 수정
    @PatchMapping("/{userNo}")
    public ResponseEntity<UserDto.Response> updateUser(@PathVariable Long userNo,
                                                       @RequestBody UserDto.Update updateDto) {

        return ResponseEntity.ok(userService.updateUser(userNo, updateDto));
    }
}
