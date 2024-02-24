package com.weight.gym_dude.user;

import com.weight.gym_dude.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;
import java.util.Random;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUserService
 * Author : dglee
 * Create : 2023-09-12 8:53 PM
 * Description :
 **/

@Service
@Slf4j
@RequiredArgsConstructor //final이 붙거나 @NotNull 이 붙은 필드의 생성자를 자동 생성해주는 롬복 어노테이션
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RedisService redisService;

    @Value("${spring.mail.properties.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;
    private static final String AUTH_CODE_PREFIX = "AuthCode ";
    public SiteUser create(String userName, String password, String email){
        /*

        // Encrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        //DTO
        SiteUserDTO userDTO = SiteUserDTO.builder()
                .userName(userName)
                .password(passwordEncoder.encode(password)) //시큐리티의 BCryptPasswordEncoder 클래스를 사용하여 암호화
                .email(email)
                .build();
        SiteUser user = userDTO.toEntity();
        userRepository.save(user);
        return user;
        */

        // NOTE : 이렇게 BCryptPasswordEncoder 객체를 직접 new로 생성하는 방식보다는 PasswordEncoder 빈(bean)으로 등록해서 사용하는 것이 좋다.
        // 왜냐하면 암호화 방식을 변경하면 BCryptPasswordEncoder를 사용한 모든 프로그램을 일일이 찾아서 수정해야 하기 때문이다.
        // (PasswordEncoder는 BCryptPasswordEncoder의 인터페이스이다.)
        //  @Configuration이 적용된 SecurityConfig에 @Bean 메서드를 생성하자


        //DTO
        SiteUserDTO userDTO = SiteUserDTO.builder()
                .userName(userName)
                .password(passwordEncoder.encode(password)) //빈으로 등록한 시큐리티의 BCryptPasswordEncoder 클래스를 사용하여 암호화
                .email(email)
                .hasProfile(false)
                .build();
        SiteUser user = userDTO.toSignUpEntity();
        userRepository.save(user);
        return user;
    }

    public boolean nicknameExist(String username) {
        Optional<SiteUser> optionalUser = userRepository.findByUserName(username);
        return optionalUser.isPresent();
    }

    public boolean emailExist(String email) {
        Optional<SiteUser> optionalUser = userRepository.findByEmail(email);
        return optionalUser.isPresent();
    }

    public SiteUser getUser(String email){
        Optional<SiteUser> optionalSiteUser = userRepository.findByEmail(email);
        if(optionalSiteUser.isPresent()){
            return optionalSiteUser.get();
        }else{
            throw new DataNotFoundException("site user not found");
        }
    }
    public SiteUser getUserByName(String name){
        Optional<SiteUser> optionalSiteUser = userRepository.findByUserName(name);
        if(optionalSiteUser.isPresent()){
            return optionalSiteUser.get();
        }else{
            throw new DataNotFoundException("site user not found");
        }
    }

    public SiteUserDTO toUserDTO(SiteUser siteUser) {
        //DTO
        return SiteUserDTO.builder()
                .category(siteUser.getCategory())
                .hasProfile(siteUser.getHasProfile())
                .id(siteUser.getId())
                .userName(siteUser.getUserName())
                .email(siteUser.getEmail())
                .build();
    }

    public SiteUser modifiedUser(SiteUser principalUser, String userName,String introduce, String category,Boolean hasProfile) {
//            SiteUser siteUser = SiteUserDTO.builder()
//                    .userName(userName)
//                    .introduce(introduce).category(category).build().toModifedProfileEntity();
        principalUser.setUserName(userName);
        principalUser.setIntroduce(introduce);
        principalUser.setCategory(category);
        principalUser.setHasProfile(hasProfile);
        userRepository.save(principalUser);
        return principalUser;
    }
    public void sendCodeToEmail(MailForm mailForm){
        String email = mailForm.getEmail();
        // email 중복검사
        checkDuplicateEmail(email);

        String title = "[짐프렌드] 이메일 인증번호 안내";
        String authCode = createCode();
        redisService.setValues(AUTH_CODE_PREFIX + email,
                authCode, Duration.ofMillis(authCodeExpirationMillis));
        authCode = "안녕하세요, 고객님\n" +
                "\n" +
                "요청하신 짐프렌드 이메일 인증번호를 안내 드립니다.\n" +
                "\n" +
                "아래 번호를 입력하여 짐프렌드 인증 절차를 완료해 주세요.\n" +
                "\n" +
                "인증번호 : "+authCode+
                "\n\n" +
                "본 인증번호는 3분 후에 만료됩니다.\n" +
                "\n";
        mailService.sendEmail(email, title, authCode);
        // 이메일 인증 요청 시 인증 번호 Redis에 저장 ( key = "AuthCode " + Email / value = AuthCode )
//        redisService.setValues(AUTH_CODE_PREFIX + email,

    }
    public void checkDuplicateEmail(String email){
        Optional<SiteUser> optionalSiteUser = userRepository.findByEmail(email);
        if(optionalSiteUser.isPresent()){
            throw new SiteUserExistException("user is exist");
        }
    }
    private String createCode() {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.debug("UserService.createCode() exception occur");
            throw new BusinessLogicException("Internal server error");
        }
    }

    public boolean emailVerification(String email, String authCode) {
//        sameUserInDBByEmail(email);
        // email 중복검사
        checkDuplicateEmail(email);

//        String redisAuthCode = redisService.getValues(AUTH_CODE_PREFIX + email);
        String redisAuthCode = redisService.getValues(AUTH_CODE_PREFIX + email);
        if (!(redisService.checkExistsValue(redisAuthCode) && redisAuthCode.equals(authCode))) {
//            throw new IllegalArgumentException("인증번호가 틀렸습니다. 다시 입력해주세요.");
            return false;
        } else {
            redisService.deleteValues(redisAuthCode);
            return true;
        }
    }

/*    public EmailVerificationResult verifiedCode(String email, String authCode) {
        checkDuplicateEmail(email);
        String redisAuthCode = redisService.getValues(AUTH_CODE_PREFIX + email);
        boolean authResult = redisService.checkExistsValue(redisAuthCode) && redisAuthCode.equals(authCode);

        return EmailVerificationResult.of(authResult);
    }*/

}
