package com.weight.gym_dude.etc;

import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.SiteUserDTO;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class MainController {
    private final UserService userService;

//    @RequestMapping("/")
//    public String root() {
//        return "index";
//    }

    @GetMapping("/terms")
    public String terms(){

        return "terms";
    }

    @GetMapping("/policy")
    public String policy(){

        return "policy";
    }
    @GetMapping("/calc")
    public String calc(
            Model model,
            Principal principal,
            Authentication authentication
    ){
        log.info("----------------------"); // getName은 이메일임
        if(principal!=null) {
            String email = principal.getName();
            if(authentication!=null){
                if(authentication.getPrincipal() instanceof OAuth2User){
                    log.info("change oauth2user!!!!!");
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    email =  oAuth2User.getAttributes().get("email").toString();
                }
            }
            SiteUser principalUser = userService.getUser(email);//현재 로그인한 사용자의 이메일으로 db조회
            SiteUserDTO siteUserDTO = userService.toUserDTO(principalUser);
            log.info("feed page logined siteUser name:{}", siteUserDTO.getUserName());
            model.addAttribute("siteUser", siteUserDTO);
        }else{
            log.info("Guest User");
        }
        return "calc";
    }
}
