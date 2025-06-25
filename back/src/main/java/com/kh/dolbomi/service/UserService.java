package com.kh.dolbomi.service;

import com.kh.dolbomi.dto.UserDto;

public interface UserService {
    Long createUser(UserDto.Create createDto);

    boolean isUserIdAvailable(String userId);

    UserDto.Response loginUser(String userId, String userPwd);


    UserDto.ProfileDto getUserProfile(Long userNo);


    UserDto.Response updateUser(Long userNo, UserDto.Update updateDto);
}
