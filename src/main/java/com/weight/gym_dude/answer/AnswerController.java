package com.weight.gym_dude.answer;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//import javax.validation.Valid;
import jakarta.validation.Valid;
/*
 * Created by 이동기 on 2023-09-12
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/answer")
public class AnswerController {

    private final QuestionService questionService;
    private final AnswerService answerService;
    Logger logger = LoggerFactory.getLogger(QuestionController.class);

    @PostMapping("/create/{id}")
//    public String createAnswer(@PathVariable("id") Integer id, @RequestParam String content){
    public String createAnswer(Model model, @PathVariable("id") Integer id, @Valid AnswerForm answerForm, BindingResult bindingResult) {
        Question question = questionService.getQuestion(id);
        logger.info("question:{}",question);
        // 검증에 실패할 경우
        if (bindingResult.hasErrors()) {
            model.addAttribute("question", question);
//            return "question_detail";
            return "redirect:/";
        }
        answerService.create(question, answerForm.getContent());
//        return String.format("redirect:/question/detail/%s", id);
        return "redirect:/";
    }
}
