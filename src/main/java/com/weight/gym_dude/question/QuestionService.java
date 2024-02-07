package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2023-09-12
 */

import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.util.DataNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor //final이 붙거나 @NotNull 이 붙은 필드의 생성자를 자동 생성해주는 롬복 어노테이션
public class QuestionService {

    private final QuestionRepository questionRepository;

/*    public List<Question> getList(){
        return this.questionRepository.findAll();
    }*/
    // List -> Page
    public Page<Question> getFeedList(int page){
        List<Sort.Order> sortedList = new ArrayList<>();
        sortedList.add(Sort.Order.desc("id")); //작성날짜순 -> 글 번호순??
        Pageable pageable = PageRequest.of(page,10,Sort.by(sortedList));
        return questionRepository.findAll(pageable);
        /*
         * 게시물을 역순으로 조회하기 위해서는 위와 같이 PageRequest.of 메서드의 세번째 파라미터로 Sort 객체를 전달해야 한다.
         * Sort.Order 객체로 구성된 리스트에 Sort.Order 객체를 추가하고 Sort.by(소트리스트)로 소트 객체를 생성할 수 있다.
         * 작성일시(createDate)를 역순(Desc)으로 조회하려면 Sort.Order.desc("createDate") 같이 작성한다.
         * 만약 작성일시 외에 추가로 정렬조건이 필요할 경우에는 sorts 리스트에 추가하면 된다.
         * */
        // NOTE : page 는 optional 이 안되는가 //
    }

    public Question getQuestion(Integer id){
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if(optionalQuestion.isPresent())
            return optionalQuestion.get();
        else
            throw new DataNotFoundException("question not found");
    }

    public void create(String content, SiteUser author, Boolean isHide){
//        QuestionDTO questionDTO = new QuestionDTO(title,content,LocalDateTime.now());
        QuestionDTO questionDTO = QuestionDTO.builder()
                .content(content)
                .createDate(LocalDateTime.now())
                .author(author)
                .isHide(isHide)
                .build();
        Question question = questionDTO.toEntity();
        questionRepository.save(question);
    }

    public void delete(Integer id) {
//        Question question = Question.builder().build();
        Optional<Question> oq = questionRepository.findById(id);
        if(oq.isPresent()) {
            questionRepository.deleteById(id);
        }
    }

    public void modify(Question question, String content) {
        question.setContent(content);
        question.setModifiedDate(LocalDateTime.now());
        questionRepository.save(question);
    }
}
