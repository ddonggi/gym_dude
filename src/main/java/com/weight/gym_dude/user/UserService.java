package com.weight.gym_dude.user;

import com.weight.gym_dude.util.DataNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUserService
 * Author : dglee
 * Create : 2023-09-12 8:53 PM
 * Description :
 **/

@Service
@RequiredArgsConstructor //final이 붙거나 @NotNull 이 붙은 필드의 생성자를 자동 생성해주는 롬복 어노테이션
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
                .build();
        SiteUser user = userDTO.toEntity();
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

    public SiteUser getUser(String username){
        Optional<SiteUser> optionalSiteUser = userRepository.findByUserName(username);
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
}
