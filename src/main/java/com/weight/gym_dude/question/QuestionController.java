package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-11
 */

import com.weight.gym_dude.answer.AnswerForm;
import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.file.FileRequestService;
import com.weight.gym_dude.follow.FollowService;
import com.weight.gym_dude.like.Like;
import com.weight.gym_dude.like.LikeRepository;
import com.weight.gym_dude.like.LikeService;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.SiteUserDTO;
import com.weight.gym_dude.user.UserService;
import com.weight.gym_dude.util.FileUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("/")
@Controller
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class QuestionController {
    private final Logger logger = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;
    private final UserService userService;
    private final FileUtils fileUtils;
    private final FileRequestService fileService;
    private final LikeService likeService;
    private final FollowService followService;
    private final LikeRepository likeRepository;

    //첫 화면 모든 피드
    @GetMapping("/")
    public String newFeed(Model model,
                       @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                       QuestionForm questionForm,
                       AnswerForm answerForm,
                       Principal principal
    ) {
//        List<Question> questionList = questionService.getList();
//        Page<Question> paging = questionService.getList(page);
        logger.info("page:{}",page);
        Page<QuestionDTO> paging = questionService.getFeedList(page);
        logger.info("paging:{}",paging);

//        model.addAttribute("questionList", questionList);
        model.addAttribute("paging", paging);
        if(principal!=null) {
            logger.info("principal name:{}",principal.getName()); // getName은 이메일임
            SiteUser principalUser = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
            SiteUserDTO siteUserDTO = userService.toUserDTO(principalUser);
//            logger.info("siteUser:{}", siteUserDTO);
            logger.info("feed page logined siteUser name:{}", siteUserDTO.getUserName());
//            model.addAttribute("principalUser", siteUserDTO);
            model.addAttribute("siteUser", siteUserDTO);
            List<Integer> followingList = followService.getFollowingList(principalUser.getId());
            model.addAttribute("followingList", followingList);
        }else{
            logger.info("Guest User");
        }
        return "index";
    }

    //모든 피드 페이징
    @GetMapping("/feed")
    @CrossOrigin
    @ResponseBody
    public ResponseEntity<Object> index(
            @RequestParam(value = "page",defaultValue = "0") int page){
        logger.info("page testtt:{}",page);
        Page<QuestionDTO> paging = questionService.getFeedList(page);

        return ResponseEntity.status(HttpStatus.OK).body(paging);
    }

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<Object> questionCreateRest(Model model,
            @RequestPart(name = "files",required = false) Optional<List<MultipartFile>> optionalFiles,
            @RequestPart(name="content") @Valid QuestionForm questionForm, // @Valid 애노테이션을 통해 questionForm 의 @NotEmpty 등이 작동한다
            BindingResult bindingresult, // @Valid 애노테이션으로 인해 검증된 결과를 의미하는 객체
            Principal principal //현재 로그인한 사용자의 정보를 알려면 스프링 시큐리티가    제공하는 Principal 객체를 사용해야 한다.
    ) {
        logger.info("feed content length:{}",questionForm.getContent().length());
        logger.info("feed content:{}",questionForm.getContent());
        if (bindingresult.hasErrors()) {
            logger.info("error>>:{}", bindingresult.getFieldError());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingresult);
        }
        SiteUser siteUser = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        Question question = questionService.create(questionForm.getContent(),siteUser,false);
        logger.info("question create complete");
        logger.info("question Id:{}",question.getId());
        if(optionalFiles.isPresent()) {
            List<MultipartFile> files = optionalFiles.get();
            logger.info("files size:{}", files.size());
            List<FileRequest> fileRequestList = fileUtils.uploadFiles(files, question); //파일 저장소 업로드
            fileService.saveFiles(fileRequestList);//파일 정보 DB 저장
        }
        model.addAttribute("principalUser",siteUser);
        return ResponseEntity.status(HttpStatus.OK).body(questionForm);
    }

/*    @PreAuthorize("isAuthenticated()")
    @PostMapping("/modify/{id}")
    public String questionModify(@Valid QuestionForm questionForm,BindingResult bindingResult,
                                 @PathVariable("id") Integer id,Principal principal){
        logger.info("id:{}",id);
        if(bindingResult.hasErrors()) {
            return "redirect:/";
        }
        Question question = questionService.getQuestion(id);
        if(!question.getAuthor().getUserName().equals(principal.getName())){ //현재 로그인한 사람과 글의 작성자가 다를 경우
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"수정 권한이 없습니다.");
        }
        questionService.modify(question,questionForm.getContent());
        return "redirect:/";
    }*/

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/modify/{id}")
    @ResponseBody
    public ResponseEntity<Object> questionModify(@RequestBody @Valid QuestionForm questionForm, BindingResult bindingResult,
                                 @PathVariable("id") Integer id,Principal principal){
        logger.info("컨텐츠 내용:{}",questionForm.getContent());
        logger.info("id:{}",id);
        if(bindingResult.hasErrors()) {
            ResponseEntity.badRequest();
        }
        Question question = questionService.getQuestion(id);
        if(!question.getAuthor().getEmail().equals(principal.getName())){ //현재 로그인한 사람과 글의 작성자가 다를 경우
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"수정 권한이 없습니다.");
        }
        questionService.modify(question,questionForm.getContent());
        HashMap<String,Object> questionContent = new HashMap<>();
        questionContent.put("content",question.getContent());
        questionContent.put("modifiedDate",question.getModifiedDate());
        return ResponseEntity.status(HttpStatus.OK).body(questionContent);
    }


    @PreAuthorize("isAuthenticated()")
    @PostMapping("/delete/question/{id}")
    @ResponseBody
    public ResponseEntity<String> questionDelete2(@PathVariable("id") Integer id, Principal principal){
        logger.info("to delete id : {}", id);
        if(!principal.getName().equals(questionService.getQuestion(id).getAuthor().getEmail()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제권한이 없습니다.");
        questionService.delete(id);

        return ResponseEntity.ok(id.toString());
    }

    //피드 단건 검색
    @PostMapping("/feed/{id}")
    @ResponseBody
    public ResponseEntity<Object> questionFind(@PathVariable("id") Integer id){
        Question question = questionService.getQuestion(id);
        HashMap<String,Object> feed = new HashMap<>();
        feed.put("feed",question);
        return ResponseEntity.status(HttpStatus.OK).body(feed);
    }

    //검색 피드
    @GetMapping("/search")
    public String searchFeedPage(Model model,
                          @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                          @RequestParam(value = "keyword") String keyword,
                          QuestionForm questionForm,
                          AnswerForm answerForm,
                          Principal principal
    ) {
        logger.info("page sear:{}",page);
        logger.info("keyword serc:{}",keyword);
//        Page<QuestionDTO> paging = questionService.getFeedList(page);
        Page<QuestionDTO> paging = questionService.getSearchFeedList(page,keyword);
        model.addAttribute("paging", paging);
        if(principal!=null) {
            logger.info("principal name:{}",principal.getName()); // getName은 이메일임
            SiteUser principalUser = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
            SiteUserDTO siteUserDTO = userService.toUserDTO(principalUser);
//            logger.info("siteUser:{}", siteUserDTO);
            logger.info("feed page logined siteUser name:{}", siteUserDTO.getUserName());
//            model.addAttribute("principalUser", siteUserDTO);
            model.addAttribute("siteUser", siteUserDTO);
            List<Integer> followingList = followService.getFollowingList(principalUser.getId());
            model.addAttribute("followingList", followingList);
        }else{
            logger.info("Guest User");
        }
        model.addAttribute("keyword",keyword);
        return "index";
    }
    //검색 피드 페이징
    @GetMapping("/search/feed")
    @CrossOrigin
    @ResponseBody
    public ResponseEntity<Object> searchFeedPageREST(
            @RequestParam(value = "page",defaultValue = "0") int page,
            @RequestParam(value = "keyword") String keyword
    ){
//        logger.info("page testtt:{}",page);
        logger.info("pagerest:{}",page);
        logger.info("keywordrest:{}",keyword);
        Page<QuestionDTO> paging = questionService.getSearchFeedList(page,keyword);

        return ResponseEntity.status(HttpStatus.OK).body(paging);
    }
}
