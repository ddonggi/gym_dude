package com.weight.gym_dude.user;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.Optional;
//import javax.validation.Valid;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : UserController
 * Author : dglee
 * Create : 2023-09-12 2:13 PM
 * Description : 유저 컨트롤러
 **/

@Controller
@RequiredArgsConstructor //final 이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final QuestionService questionService;
    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/login")
    public String login() {
        return "login_form"; // 로그인을 위한 템플릿 렌더링
    }
    // NOTE : 실제 로그인을 진행하는 @PostMapping 방식의 메서드는 스프링 시큐리티가 대신 처리하므로 직접 구현할 필요가 없다. ( SecurityConfig 참조 )

    @GetMapping("/signup")
    public String signup(UserCreateForm userCreateForm) {
        return "signup_form"; // 회원가입을 위한 템플릿 렌더링
    }

    @PostMapping("/name/check")
    @ResponseBody
    public String nicknameDuplicateCheck(@RequestBody String username){
        boolean isNickNameExist = userService.nicknameExist(username);
        if(isNickNameExist) return "이미 사용중인 닉네임 입니다";
        return "사용 가능한 닉네임 입니다";
    }

    @PostMapping("/signup")
    public String signup(@Valid UserCreateForm userCreateForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return "signup_form";

        if (!userCreateForm.getPassword().equals(userCreateForm.getPassword2())) { // 비밀번호 2개가 동일하지 않을 경우
            // NOTE : 대형 프로젝트에서는 번역과 관리를 위해 오류코드를 잘 정의하여 사용해야 한다.
            bindingResult.rejectValue("password2", "passwordIncorrect",
                    "2개의 패스워드가 일치하지 않습니다"); // rejectValue 오류 발생 시킴
            return "signup_form";
        }
        if(userService.nicknameExist(userCreateForm.getUsername())){
            bindingResult.rejectValue("username", "signupFailed", "이미 사용중인 닉네임 입니다.");
            return "signup_form";
        }
        if(userService.emailExist(userCreateForm.getEmail())){
            bindingResult.rejectValue("email", "signupFailed", "이미 사용중인 이메일 입니다.");
            return "signup_form";
        }

        try {
            userService.create(userCreateForm.getUsername(), userCreateForm.getPassword(),
                    userCreateForm.getEmail());
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            bindingResult.reject("signupFailed", "이미 등록된 사용자입니다.");
//            bindingResult.rejectValue("username", "signupFailed", "이미 등록된 닉네임 입니다.");
//            bindingResult.rejectValue("email", "signupFailed", "이미 등록된 이메일 입니다.");
//            bindingResult.rejectValue("password", "signupFailed", "이미 비밀번호 양식이랑 안맞습니다.");
            return "signup_form";
        } catch (Exception e) {
            e.printStackTrace();
            bindingResult.reject("signupFailed", e.getMessage()); // bindingResult.reject(오류코드, 오류메시지)는 특정 필드의 오류가 아닌 일반적인 오류를 등록할때 사용한다.
            return "signup_form";
        }

        return "redirect:/";
    }

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @GetMapping("/my_profile")
    public String myProfile(Model model,Principal principal) {
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        model.addAttribute("siteUser",author);
        return "user/my_profile";
    }
    @GetMapping("/feed/{id}")
    public String feed(Model model,
                         @PathVariable(value = "id") Long id,
                         @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                         Principal principal) {
        logger.info("feed request");
//        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        Optional<SiteUser> optionalAuthor = userRepository.findById(id);
        if(optionalAuthor.isPresent()){
            SiteUser author = optionalAuthor.get();
            Page<Question> feedPaging = questionService.getMyFeedList(page,author);
            model.addAttribute("feedPaging", feedPaging);
            model.addAttribute("siteUser",author);
        }
        return "user/feed";
    }


    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @GetMapping("/my_feed")
    public String myFeed(Model model,
                         @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                         Principal principal) {
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        Page<Question> feedPaging = questionService.getMyFeedList(page,author);
        model.addAttribute("feedPaging", feedPaging);
        model.addAttribute("siteUser",author);
        return "feed";
    }

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/modify")
    public String modify(){
        return "redirect:/my_page";
    }
}
