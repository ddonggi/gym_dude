package com.weight.gym_dude.answer;
/*
 * Created by 이동기 on 2023-09-12
 */

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.user.SiteUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor //final이 붙거나 @NotNull 이 붙은 필드의 생성자를 자동 생성해주는 롬복 어노테이션
public class AnswerService {
    private final AnswerRepository answerRepository;

    public void create(Question question, String content, SiteUser author) {
//        AnswerDTO answerDTO = new AnswerDTO(id, content, LocalDateTime.now(),question);
//        AnswerDTO answerDTO = new AnswerDTO(id, content, LocalDateTime.now(),question);
        AnswerDTO answerDTO = AnswerDTO.builder()
                .content(content)
                .createDate(LocalDateTime.now())
                .question(question)
                .author(author)
                .build();
        Answer answer = answerDTO.toEntity();
        answerRepository.save(answer);
    }
}
