package com.weight.gym_dude.user;

import com.nimbusds.oauth2.sdk.SuccessResponse;
import com.weight.gym_dude.follow.FollowService;
import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionDTO;
import com.weight.gym_dude.question.QuestionService;
import com.weight.gym_dude.util.FileUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final FileUtils fileUtils;
    private final SiteUserImageService siteUserImageService;
    private final AuthenticationManager authenticationManager;
    private final FollowService followService;
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
    public ResponseEntity<Object> nicknameDuplicateCheck(@RequestBody UserCreateForm userCreateForm){
//        logger.info("닉네임 체크 시작:{}",userCreateForm.getUsername());
//        boolean isNickNameExist = userService.nicknameExist(userCreateForm.getUsername());
        HashMap<String,String> response = new HashMap<>();
//        if(isNickNameExist) {
//            response.put("result","negative");
//            response.put("message","사용할 수 없는 닉네임 입니다");
//        }else{
            response.put("result","positive");
            response.put("message","사용 가능한 닉네임 입니다");
//        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/mail-request")
    @ResponseBody
    public ResponseEntity<Object> signupRequest(
            @Valid @RequestBody MailForm mailForm,
            BindingResult bindingResult
    ){
        //Validation 예외처리
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        Map<String,Object> body = new HashMap<>();
        if(fieldErrors.size()>0){
            for(FieldError fieldError: bindingResult.getFieldErrors()){
                logger.error(fieldError.getField()+"필드 : "+fieldError.getDefaultMessage());
            }
            body.put("message","이메일 인증 오류");
            return ResponseEntity.status(403).body(body);
        }
        userService.sendCodeToEmail(mailForm);
        body.put("message","이메일 인증 코드 발송 완료");
        return ResponseEntity.ok().body(body);
    }

    //인증 코드 검사
    @PostMapping("/mail-verification")
    @ResponseBody
    public ResponseEntity<Object> mailCodeVerification(
            @Valid @RequestBody MailForm mailForm,
            BindingResult bindingResult
    ){
        if (bindingResult.hasErrors())
            logger.info("에러발생:{}",bindingResult.getFieldError());

        boolean mailVerification = userService.emailVerification(mailForm.getEmail(), mailForm.getCode());
        Map<String,Object> body = new HashMap<>();
        if(mailVerification) {
            body.put("message", "인증되었습니다");
            body.put("verification", true);
        }
        else {
            body.put("message", "인증번호가 틀렸습니다. 다시 입력해주세요.");
            body.put("verification", false);
        }

        return ResponseEntity.ok().body(body);
    }

    @PostMapping("/signup")
    public String signup(@Valid UserCreateForm userCreateForm, BindingResult bindingResult) {
        logger.info("emailVerification:{}",userCreateForm.getEmailVerification());

        if (bindingResult.hasErrors()) {
            logger.info("에러발생:{}",bindingResult.getFieldError());
            return "signup_form";
        }

        if (!userCreateForm.getPassword().equals(userCreateForm.getPassword2())) { // 비밀번호 2개가 동일하지 않을 경우
            logger.info("2개의 비밀번호가 일치하지 않습니다");
            // NOTE : 대형 프로젝트에서는 번역과 관리를 위해 오류코드를 잘 정의하여 사용해야 한다.
            bindingResult.rejectValue("password2", "passwordIncorrect",
                    "2개의 패스워드가 일치하지 않습니다"); // rejectValue 오류 발생 시킴
            return "signup_form";
        }
        if(userService.nicknameExist(userCreateForm.getUsername())){
            logger.info("이미 사용중인 닉네임 입니다");
            bindingResult.rejectValue("username", "signupFailed", "이미 사용중인 닉네임 입니다.");
            return "signup_form";
        }
        if(userService.emailExist(userCreateForm.getEmail())){
            logger.info("이미 사용중인 이메일 이에요");
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

        return "redirect:/user/login";
//        return "signup_form";
    }

//    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @GetMapping("/profile/{id}")
    public String profile(@PathVariable(value = "id") Long id, Model model,Principal principal, Authentication authentication) {
        SiteUser siteUser = null;
//        logger.info("principal::{}",principal);
//        logger.info("principal getName::{}",principal.getName());
        if(principal!=null) {
            String email= principal.getName();
            if(authentication!=null){
                if(authentication.getPrincipal() instanceof OAuth2User){
                    logger.info("change oauth2user!!!!!");
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    email =  oAuth2User.getAttributes().get("email").toString();
                }
            }
            siteUser = userService.getUser(email);//현재 로그인한 사용자의 이름으로 db조회
        }
        Optional<SiteUser> optionalProfileUser = userRepository.findById(id);
        if(optionalProfileUser.isPresent()) {
            SiteUser profileUser = optionalProfileUser.get();
            model.addAttribute("profileUser", profileUser); // 방문할 유저
            model.addAttribute("siteUser", siteUser); //현재 로그인한 유저 ( header 에서도 씀)
            if(siteUser!=null) {
                List<Integer> followingList = followService.getFollowingList(siteUser.getId());
                model.addAttribute("followingList", followingList);
            }
        }
        return "user/profile";
    }
    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @GetMapping("/profile/edit")
    public String myProfileEdit(Model model,Principal principal,Authentication authentication) {
        if(principal!=null) {
            String email= principal.getName();
            if(authentication!=null){
                if(authentication.getPrincipal() instanceof OAuth2User){
                    logger.info("change oauth2user!!!!!");
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    email =  oAuth2User.getAttributes().get("email").toString();
                }
            }
        SiteUser siteUser = userService.getUser(email);//현재 로그인한 사용자의 이름으로 db조회
        model.addAttribute("siteUser",siteUser);
        }
        return "user/profile_form";
    }
    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/profile/edit")
    public String myProfileEdit(Model model, Principal principal,
                                Authentication authentication,
                                @RequestPart(name = "userName") String userName,
                                @RequestPart(name = "introduce",required = false) String introduce,
                                @RequestPart(name = "file",required = false) MultipartFile file,
                                @RequestPart(name = "category") String category) {
        String email= principal.getName();
        if(principal!=null) {
            if(authentication!=null){
                if(authentication.getPrincipal() instanceof OAuth2User){
                    logger.info("change oauth2user!!!!!");
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    email =  oAuth2User.getAttributes().get("email").toString();
                }
            }
        }
        SiteUser siteUser = userService.getUser(email);//현재 로그인한 사용자의 이름으로 db조회
        Integer id = siteUser.getId();
//        SiteUser prince = (SiteUser) authentication.getPrincipal();

        logger.info("id:{}",id);
        logger.info("userName:{}",userName);
        logger.info("introduce:{}",introduce);
        logger.info("file name:{}",file.getName());
        logger.info("category:{}",category);

        logger.info("file original name:{}",file.getOriginalFilename());
        logger.info("file name is  empty:{}",file.getOriginalFilename().isEmpty());
        Boolean hasProfile = false;
        if(!file.getOriginalFilename().isEmpty()){ //파일이 있을경우저장
            SiteUserImage siteUserImage = fileUtils.uploadProfileImage(file,siteUser);// 저장소에 사진저장
            if(siteUser.getHasProfile()){//기존에 프로필을 가진 경우
                siteUserImageService.modified(id,siteUserImage); //DB에 사진에 대한 정보 수정
            }else{
                siteUserImageService.save(siteUserImage); //DB에 사진에 대한 정보 저장
                hasProfile = true;
            }
        }
        //파일이 없을 경우
        if(siteUser.getHasProfile()) hasProfile=true;//기존에 프로필을 가진 경우
        logger.info("hasProfile?{}",hasProfile);
        siteUser = userService.modifiedUser(siteUser,userName, introduce, category, hasProfile);

        model.addAttribute("profileUser", siteUser); // 방문할 유저
        model.addAttribute("siteUser",siteUser); //현재 로그인한 유저 ( header 에서도 씀)
        //세션 등록
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(principalUser.getUserName(),principalUser.getPassword()));
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        logger.info("hasProfile?:{}",principalUser.getHasProfile());

//        userService.modifiedProfileInfo(userName,introduce,,category);
//        fileUtils.uploadFile();
//        fileService.saveFiles();

        return "user/profile";
    }

    //해당 유저의 피드 리스트
    @GetMapping("/feed/{id}")
    public String feed(Model model,
                         @PathVariable(value = "id") Long id,
                         @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                         Principal principal,
                         Authentication authentication
    ) {
        logger.info("feed request");
        SiteUser siteUser = null;
//        logger.info("principal::{}",principal);
//        logger.info("principal getName::{}",principal.getName());
        if(principal!=null) {
            String email= principal.getName();
            if(authentication!=null){
                if(authentication.getPrincipal() instanceof OAuth2User){
                    logger.info("change oauth2user!!!!!");
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    email =  oAuth2User.getAttributes().get("email").toString();
                }
            }
            siteUser = userService.getUser(email);//현재 로그인한 사용자의 이름으로 db조회
        }
        Optional<SiteUser> optionalFeedUser = userRepository.findById(id);
        if(optionalFeedUser.isPresent()){
            SiteUser feedUser = optionalFeedUser.get();
            Page<Question> feedPaging = questionService.getMyFeedList(page,feedUser);
            model.addAttribute("feedPaging",feedPaging);
            model.addAttribute("feedUser",feedUser);
            model.addAttribute("siteUser",siteUser); //현재 로그인한 사람
            if(principal!=null) {
                List<Integer> followingList = followService.getFollowingList(siteUser.getId());
                model.addAttribute("followingList", followingList);
            }
        }
        return "user/feed";
    }

    //한 유저의 피드 페이징
    @GetMapping("/feed/list/{id}")
    @CrossOrigin
    @ResponseBody
    public ResponseEntity<Object> index(
            @PathVariable(value = "id") Long id,
            @RequestParam(value = "page",defaultValue = "0") int page){

        logger.info("user feed page test:{}",page);
        Page<Question> feedPaging =null;
        Optional<SiteUser> optionalFeedUser = userRepository.findById(id);
        if(optionalFeedUser.isPresent()){
            SiteUser feedUser = optionalFeedUser.get();
            feedPaging = questionService.getMyFeedList(page,feedUser);
        }
        HashMap<String,Page<Question>> questionMap = new HashMap<>();
        questionMap.put("feedPaging",feedPaging);
        return ResponseEntity.status(HttpStatus.OK).body(feedPaging);
    }

/*
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
    }*/

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/modify")
    public String modify(){
        return "redirect:/my_page";
    }
}
