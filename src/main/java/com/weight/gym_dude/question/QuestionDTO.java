package com.weight.gym_dude.question;

import com.weight.gym_dude.answer.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer id;
    private String content;
    private LocalDateTime createDate;
    private List<Answer> answerList;

/*    public QuestionDTO(String title, String content, LocalDateTime createDate) {
        this.title=title;
        this.content=content;
        this.createDate=createDate;
    }*/

    public Question toEntity(){
        return new Question(this.content,this.createDate);
    }
}
