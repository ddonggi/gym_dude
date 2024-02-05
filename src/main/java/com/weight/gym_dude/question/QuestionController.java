package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-11
 */

import com.weight.gym_dude.answer.AnswerForm;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.security.Principal;

@RequestMapping("/")
@Controller
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class QuestionController {
    private final Logger logger = LoggerFactory.getLogger(QuestionController.class);
    private final QuestionService questionService;
    private final UserService userService;

    @GetMapping("/")
    public String list(Model model,
                       @RequestParam(value = "page", defaultValue = "0") int page, //spring boot의 페이징은 0부터
                       QuestionForm questionForm,
                       AnswerForm answerForm
    ) {
//        List<Question> questionList = questionService.getList();
//        Page<Question> paging = questionService.getList(page);
        Page<Question> paging = questionService.getFeedList(page);
//        model.addAttribute("questionList", questionList);
        model.addAttribute("paging", paging);
        return "index";
    }

    @GetMapping("/detail/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, AnswerForm answerForm) {
        Question question = questionService.getQuestion(id);
        model.addAttribute("question", question);
        return "question_detail";
    }

    @PostMapping("/create")
//    public String questionCreate(@RequestParam String title, @RequestParam String content){
    public String questionCreate(
            @Valid QuestionForm questionForm, // @Valid 애노테이션을 통해 questionForm 의 @NotEmpty 등이 작동한다
            BindingResult bindingresult, // @Valid 애노테이션으로 인해 검증된 결과를 의미하는 객체
            Principal principal //현재 로그인한 사용자의 정보를 알려면 스프링 시큐리티가 제공하는 Principal 객체를 사용해야 한다.
    ) {
        if (bindingresult.hasErrors()) {
            logger.info("error>>:{}", bindingresult.getFieldError());
            return "index";
        }
        SiteUser author = userService.getUser(principal.getName());//현재 로그인한 사용자의 이름으로 db조회
        questionService.create(questionForm.getContent(),author);
        return "redirect:/"; // 질문 저장 후 피드로 이동
    }

    @PostMapping("/delete/{id}")
    public String questionDelete(@PathVariable("id") Integer id) {
        logger.info("to delete id : {}", id);
        questionService.delete(id);
//        return "redirect:/question/list";
        return "redirect:/"; //질문 삭제 후 피드로 이동
    }
}
