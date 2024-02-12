package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-11
 */

import com.weight.gym_dude.answer.AnswerForm;
import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.file.FileRequestService;
import com.weight.gym_dude.user.SiteUser;
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
import java.util.HashMap;
import java.util.List;

@RequestMapping("/")
@Controller
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class QuestionController {
    private final Logger logger = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;
    private final UserService userService;
    private final FileUtils fileUtils;
    private final FileRequestService fileService;

    @GetMapping("/")
    public String list(Model model,
                       @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                       QuestionForm questionForm,
                       AnswerForm answerForm,
                       Principal principal
    ) {
//        List<Question> questionList = questionService.getList();
//        Page<Question> paging = questionService.getList(page);
        Page<Question> paging = questionService.getFeedList(page);
//        model.addAttribute("questionList", questionList);
        model.addAttribute("paging", paging);
//        if(principal!=null) {
//            SiteUser siteUser = userService.getUser(principal.getName());
//            logger.info("siteUser:{}", siteUser);
//            model.addAttribute("siteUser", siteUser);
//        }else{
//            logger.info("Guest User");
//        }
        return "index";
    }

/*    @GetMapping("/detail/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, AnswerForm answerForm) {
        Question question = questionService.getQuestion(id);
        model.addAttribute("question", question);
        return "question_detail";
    }*/

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/create")
//    public String questionCreate(@RequestParam String title, @RequestParam String content){
    public String questionCreate(
            @RequestParam(value = "files") List<MultipartFile> files,
//            QuestionDTO questionDTO,
            @Valid QuestionForm questionForm, // @Valid 애노테이션을 통해 questionForm 의 @NotEmpty 등이 작동한다
            BindingResult bindingresult, // @Valid 애노테이션으로 인해 검증된 결과를 의미하는 객체
            Principal principal //현재 로그인한 사용자의 정보를 알려면 스프링 시큐리티가 제공하는 Principal 객체를 사용해야 한다.
    ) {
        logger.info("feed content length:{}",questionForm.getContent().length());
        if (bindingresult.hasErrors()) {
            logger.info("error>>:{}", bindingresult.getFieldError());
            return "index";
        }
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        Question question = questionService.create(questionForm.getContent(),author,false);
        logger.info("question create complete");
        logger.info("question Id:{}",question.getId());
        List<FileRequest> fileRequestList = fileUtils.uploadFiles(files,question); //파일 저장소 업로드
        fileService.saveFiles(fileRequestList);//파일 정보 DB 저장
        return "redirect:/"; // 질문 저장 후 피드로 이동
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
    public ResponseEntity<Object> questionModifyRest(@RequestBody @Valid QuestionForm questionForm, BindingResult bindingResult,
                                 @PathVariable("id") Integer id,Principal principal){
        logger.info("컨텐츠 내용:{}",questionForm.getContent());
        logger.info("id:{}",id);
        if(bindingResult.hasErrors()) {
            ResponseEntity.badRequest();
        }
        Question question = questionService.getQuestion(id);
        if(!question.getAuthor().getUserName().equals(principal.getName())){ //현재 로그인한 사람과 글의 작성자가 다를 경우
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"수정 권한이 없습니다.");
        }
        questionService.modify(question,questionForm.getContent());
        HashMap<String,String> questionContent = new HashMap<>();
        questionContent.put("content",question.getContent());
        return ResponseEntity.status(HttpStatus.OK).body(questionContent);
    }


    @PreAuthorize("isAuthenticated()")
    @PostMapping("/delete/question/{id}")
    @ResponseBody
    public ResponseEntity<String> questionDelete2(@PathVariable("id") Integer id, Principal principal){
        logger.info("to delete id : {}", id);
        if(!principal.getName().equals(questionService.getQuestion(id).getAuthor().getUserName()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제권한이 없습니다.");
        questionService.delete(id);

        return ResponseEntity.ok(id.toString());
    }

}
