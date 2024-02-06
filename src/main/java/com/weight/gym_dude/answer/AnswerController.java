package com.weight.gym_dude.answer;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.question.QuestionService;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//import javax.validation.Valid;
import jakarta.validation.Valid;

import java.security.Principal;

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

    @PreAuthorize("isAuthenticated()")// 권한이 부여된 사람(=로그인한 사람)만 실행 가능하다
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
    }
}
