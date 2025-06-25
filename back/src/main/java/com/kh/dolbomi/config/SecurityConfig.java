package com.kh.dolbomi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // spring Security 활성화
public class SecurityConfig {
    /*
     @Bean : 메서드 단위로 빈에 등록할 때, 외부라이브러리의 객체를 등록하고 싶을 때
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }

    /*
    BCryptPasswordEncoder 객체를 스프링 빈에 등록하고 사용하고 싶지만 외부객체이기 때문에
    직접 클래스 구현부에 @Component를 입력해 등록할 수 없음
    그래서 해당 객체를 만들어서 리턴하는 함수를 만들고 해당 함수를 Bean에 등록하여 객체를 사용한다.
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
