package com.weight.gym_dude.answer;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.question.QuestionForm;
import com.weight.gym_dude.question.QuestionService;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.SiteUserDTO;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

//import javax.validation.Valid;
import jakarta.validation.Valid;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

/*
 * Created by 이동기 on 2023-09-12
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/answer")
public class AnswerController {

    private final QuestionService questionService;
    private final AnswerService answerService;
    private final UserService userService;
    Logger logger = LoggerFactory.getLogger(QuestionController.class);
    private final AnswerRepository answerRepository;

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/create/{id}")
    @ResponseBody
    public ResponseEntity<Object> createComment(@RequestBody @Valid AnswerForm answerForm, BindingResult bindingResult,
                                                     @PathVariable("id") Integer id, Principal principal) {
        logger.info("댓글 내용:{}", answerForm.getContent());
        logger.info("원본글 id:{}", id);
        if (bindingResult.hasErrors()) {
            ResponseEntity.badRequest();
        }
        Question question = questionService.getQuestion(id);
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        SiteUserDTO siteUserDTO = userService.toUserDTO(author);
        Answer answer = answerService.create(question, answerForm.getContent(),author);

        HashMap<String, Object> answerContent = new HashMap<>();
        answerContent.put("content", answerForm.getContent());
        answerContent.put("createDate", LocalDateTime.now());
        answerContent.put("author", siteUserDTO);
        answerContent.put("id", answer.getId());
        return ResponseEntity.status(HttpStatus.OK).body(answerContent);
    }

/*    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/create/{id}")
//    public String createAnswer(@PathVariable("id") Integer id, @RequestParam String content){
    public String createAnswer(Model model, @PathVariable("id") Integer id, @Valid AnswerForm answerForm, BindingResult bindingResult, Principal principal) {
        Question question = questionService.getQuestion(id);
        logger.info("question:{}",question);

        // 검증에 실패할 경우
        if (bindingResult.hasErrors()) {
            model.addAttribute("question", question);
//            return "question_detail";
            return "redirect:/";
        }
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        answerService.create(question, answerForm.getContent(),author);
//        return String.format("redirect:/question/detail/%s", id);
        return "redirect:/";
    }*/

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
    @PostMapping("/delete/{id}")
    @ResponseBody
    public ResponseEntity<Object> deleteComment(
                                                     @PathVariable("id") Integer id, Principal principal) {
        logger.info("댓글글 id:{}", id);
//        Question question = questionService.getQuestion(id);
        SiteUser siteUser = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        int authorId = answerRepository.findById(id).get().getAuthor().getId(); // 댓글 작성자의 id
        HashMap<String, Object> answerContent = new HashMap<>();

        if(!siteUser.getId().equals(authorId)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"삭제 권한이 없습니다.");
        }
        answerRepository.deleteById(id);

        answerContent.put("message","삭제가 완료되었습니다");
        return ResponseEntity.status(HttpStatus.OK).body(answerContent);
    }
}
