package com.weight.gym_dude.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

/**
 * PackageName : com.weight.gym_dude.config
 * FileName : SecurityConfig
 * Author : dglee
 * Create : 2023-09-12 5:24 PM
 * Description : 스프링 시큐리티는 기본적으로 인증되지 않은 사용자는 서비스를 사용할 수 없게끔 되어 있다.
 * 따라서 인증을 위한 로그인 화면이 나타나는 것이다.
 * 하지만 이러한 기본 기능은 게시판 등 로그인 없이 볼 수 있는 페이지에 그대로 적용하기에는 곤란하므로
 * 시큐리티의 설정을 통해 바로 잡아야 한다.
 **/

@EnableMethodSecurity(prePostEnabled = true) //@PreAuthorize 애너테이션을 사용하기 위해 반드시 필요한 설정
@Configuration //스프링의 환경설정 파일임을 의미하는 애너테이션이다. 여기서는 스프링 시큐리티의 설정을 위해 사용되었다.
@EnableWebSecurity //모든 요청 URL이 스프링 시큐리티의 제어를 받도록 만드는 애너테이션이다. 이 애너테이션을 사용하면 스프링 시큐리티를 활성화하는 역할
/* NOTE : @EnableWebSecurity 애너테이션을 사용하면 내부적으로 SpringSecurityFilterChain이 동작하여 URL 필터가 적용된다. **/
public class SecurityConfig {

    /*
    스프링 시큐리티의 세부 설정은 SecurityFilterChain 빈을 생성하여 설정할 수 있다. 다음 문장은 모든 인증되지 않은 요청을 허락한다는 의미이다. 따라서 로그인을 하지 않더라도 모든 페이지에 접근할 수 있다.
    * */
    /*
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests().requestMatchers(
                new AntPathRequestMatcher("/**")).permitAll()
        ;
        return http.build();
    }
    */

    /*
     * NOTE : CSRF란?
     * CSRF(cross site request forgery)는 웹 사이트 취약점 공격을 방지를 위해 사용하는 기술이다.
     * 스프링 시큐리티가 CSRF 토큰 값을 세션을 통해 발행하고 웹 페이지에서는 폼 전송시에 해당 토큰을 함께 전송하여
     * 실제 웹 페이지에서 작성된 데이터가 전달되는지를 검증하는 기술이다.
     *
     * 다음과 같은 input 엘리먼트가 폼(form) 태그 밑에 자동으로 생성된 것을 확인할 수 있다.
     * <input type="hidden" name="_csrf" value="0d609fbc-b102-4b3f-aa97-0ab30c8fcfd4"/>
     * 스프링 시큐리티에 의해 위와 같은 CSRF 토큰이 자동으로 생성된다. 즉, 스프링 시큐리티는 이렇게 발행한 CSRF 토큰의 값이 정확한지 검증하는 과정을 거친다.
     * (만약 CSRF 값이 없거나 해커가 임의의 CSRF 값을 강제로 만들어 전송하는 악의적인 URL 요청은 스프링 시큐리티에 의해 블록킹 될 것이다.)
     * 그런데 H2 콘솔은 이와 같은 CSRF 토큰을 발행하는 기능이 없기 때문에 위와 같은 403 오류가 발생하는 것이다.
     * (H2 콘솔은 스프링과 상관없는 일반 애플리케이션이다.)
     * 스프링 시큐리티가 CSRF 처리시 H2 콘솔은 예외로 처리할 수 있도록 다음과 같이 설정 파일을 수정하자.
     * */

    /*
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests().requestMatchers(
                new AntPathRequestMatcher("/**")).permitAll()
                .and() //and() - http 객체의 설정을 이어서 할 수 있게 하는 메서드이다.
                .csrf().ignoringRequestMatchers(
                        new AntPathRequestMatcher("/h2-console/**")) // /h2-console/로 시작하는 URL은 CSRF 검증을 하지 않는다는 설정이다.
        ;
        ;
        return http.build();
    }
    */

    /*
     * frame 구조로 작성된 화면은 깨진다. 스프링 시큐리티는 사이트의 콘텐츠가 다른 사이트에 포함되지 않도록 하기 위해 X-Frame-Options 헤더값을 사용하여 이를 방지한다.
     * (clickjacking 공격을 막기위해 사용함)
     * 이 문제를 해결하기 위해 다음과 같이 설정 파일을 수정하자.
     * */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return
                http    // 특정 URL에 대한 권한 설정.
                        .authorizeHttpRequests((authorizeRequests) -> {
//                        authorizeRequests.requestMatchers("").authenticated();
//                        authorizeRequests.requestMatchers("").hasAnyRole("ADMIN");
//                        authorizeRequests.requestMatchers("").hasRole("ADMIN");
                            authorizeRequests.requestMatchers(new AntPathRequestMatcher("/**")).permitAll(); // 인증되지 않은 모든 url에 대해 승인
//                        authorizeRequests.anyRequest().permitAll();
                        })
//                        .cors(Customizer.withDefaults())
                        .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
                            @Override
                            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                                CorsConfiguration config = new CorsConfiguration();
                                config.setAllowedOrigins(Collections.singletonList("http://localhost:8080"));
                                config.setAllowedMethods(Collections.singletonList("*"));
                                config.setAllowCredentials(true);
                                config.setAllowedHeaders(Collections.singletonList("*"));
                                config.setMaxAge(3600L); //1시간
                                return config;
                            }
                        }))
                        // CSRF 에 대한 설정
//                    .csrf(AbstractHttpConfigurer::disable)// stateless한 rest api를 개발할 것이므로 csrf 공격에 대한 옵션은 꺼둔다.
                        .csrf((csrf) -> csrf
                                .ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**"))
                                .ignoringRequestMatchers(new AntPathRequestMatcher("/like/**"))
//                                .ignoringRequestMatchers(new AntPathRequestMatcher("/delet/**"))
                        )
                        .formLogin(formLogin ->
                            /* 권한이 필요한 요청은 해당 url로 리다이렉트 */
                            formLogin
                                    .loginPage("/user/login")
                                    .usernameParameter("email")
                                    .defaultSuccessUrl("/")
                        )
                        .logout((logout) -> {
                            logout.logoutRequestMatcher(new AntPathRequestMatcher("/user/logout")) //로그아웃 url
                            .logoutSuccessUrl("/")
//                            logoutConfigurer.deleteCookies("JSESSIONID");
                            .invalidateHttpSession(true);// 사용자 세션 삭제
                        })
                        .build();

/*
        http.authorizeHttpRequests().requestMatchers(
                        new AntPathRequestMatcher("/**")).permitAll()
                .and()
                    .csrf().ignoringRequestMatchers(
                            new AntPathRequestMatcher("/h2-console/**"))
                .and()
                    .headers()
                    .addHeaderWriter(new XFrameOptionsHeaderWriter(
                            XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN))
                .and() //
                    .formLogin()
                    .loginPage("/user/login")
                    .defaultSuccessUrl("/")
                .and()
                    .logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/user/logout")) // 로그아웃 url
                    .logoutSuccessUrl("/")
                    .deleteCookies("JSESSIONID")
                    .invalidateHttpSession(true) // 사용자 세션 삭제
        ;
        return http.build();*/
    }
    // 위 처럼 URL 요청시 X-Frame-Options 헤더값을 sameorigin으로 설정하여 오류가 발생하지 않도록 했다.
    // X-Frame-Options 헤더의 값으로 sameorigin을 설정하면 frame에 포함된 페이지가 페이지를 제공하는 사이트와 동일한 경우에는 계속 사용할 수 있다.

    //----------------------------------------------------------------------------------
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    //이렇게 bean 으로 등록하면 new 연산자로 객체를 직접 생성하지 않고 빈으로 등록한 PasswordEncoder 객체를 주입받아 사용할 수 있다 -> UserService


    /*
     * 스프링 시큐리티를 통해 로그인을 수행하는 방법에는 여러가지가 있다.
     * 예를 들어 가장 간단하게는 시큐리티 설정 파일에 직접 아이디, 비밀번호를 등록하여 인증을 처리하는 메모리 방식이 있다.
     * 하지만 우리는 이미 이전 장에서 회원가입을 통해 회원 정보를 데이터베이스에 저장했으므로 데이터베이스에서 회원정보를 조회하는 방법을 사용해야 할 것이다.
     * 데이터베이스에서 사용자를 조회하는 서비스(UserSecurityService)를 만들고 그 서비스를 스프링 시큐리티에 등록 해야 한다.
     * 하지만 UserSecurityService 를 만들고 등록하기 전에 UserSecurityService 에서 필요한 UserRepository, UserRole 등을 먼저 준비해야 한다.
     * */
    /*
     * AuthenticationManager 빈을 생성했다.
     * AuthenticationManager는 스프링 시큐리티의 인증을 담당한다.
     * AuthenticationManager 빈 생성시 스프링의 내부 동작으로 인해 위에서 작성한 UserSecurityService와 PasswordEncoder가 자동으로 설정된다.
     * */
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
