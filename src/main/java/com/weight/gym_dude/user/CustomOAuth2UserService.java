package com.weight.gym_dude.user;

import com.weight.gym_dude.util.OAuthAttributes;
import jakarta.servlet.http.HttpSession;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : CustomOAuth2UserService
 * Author : dglee
 * Create : 2/25/24 11:58 PM
 * Description :
 **/

@Service
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {


    private final UserRepository userRepository;
    private final HttpSession httpSession;

    public CustomOAuth2UserService(UserRepository userRepository, HttpSession httpSession) {
        this.userRepository = userRepository;
        this.httpSession = httpSession;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        SiteUser siteUser = saveOrUpdate(attributes);
//        httpSession.setAttribute("siteUser", new SessionUser(siteUser));
        httpSession.setAttribute("siteUser", siteUser);
        log.info("UserRole.USER.getValue():{}",UserRole.USER.getValue());
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(UserRole.USER.getValue())),
                attributes.getAttributes(),
                attributes.getNameAttributeKey()
        );
    }

    private SiteUser saveOrUpdate(OAuthAttributes attributes) {
        log.info("attributes get name:{}",attributes.getName());
        SiteUser siteUser = userRepository.findByEmail(attributes.getEmail())
//                .map(entity -> entity.updateName(attributes.getName()))
                .orElse(attributes.toEntity());

        return userRepository.save(siteUser);
    }
}
