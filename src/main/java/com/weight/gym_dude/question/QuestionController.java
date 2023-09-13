package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-11
 */

import com.weight.gym_dude.answer.AnswerForm;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
//import javax.validation.Valid;

@RequestMapping("/question")
@Controller
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/list")
    public String list(Model model,
                       @RequestParam(value = "page",defaultValue = "0")int page //spring boot의 페이징은 0부터
    ) {
//        List<Question> questionList = questionService.getList();
        Page<Question> paging = questionService.getList(page);
//        model.addAttribute("questionList", questionList);
        model.addAttribute("paging", paging);
        return "question_list";
    }

    @GetMapping("/detail/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, AnswerForm answerForm) {
        Question question = questionService.getQuestion(id);
        model.addAttribute("question",question);
        return "question_detail";
    }

    @GetMapping("/create")
    public String questionCreate(QuestionForm questionForm){
        return "question_form";
    }

    @PostMapping("/create")
//    public String questionCreate(@RequestParam String title, @RequestParam String content){
    public String questionCreate(
            @Valid QuestionForm questionForm, // @Valid 애노테이션을 통해 questionForm 의 @NotEmpty 등이 작동한다
            BindingResult bindingresult // @Valid 애노테이션으로 인해 검증된 결과를 의미하는 객체
    ){
        if(bindingresult.hasErrors())
            return "question_form";
        questionService.create(questionForm.getTitle(), questionForm.getContent());
        return "redirect:/question/list"; // 질문 저장 후 질문 목록으로 이동
    }

    @GetMapping("/delete/{id}")
    public String questionDelete(@PathVariable Long id){
//        questionService.delete(id);
        System.out.println("to delete id : " + id );
        return "redirect:/question/list";
    }
}
