package com.weight.gym_dude.answer;
/*
 * Created by 이동기 on 2023-09-12
 */

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.user.SiteUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDTO {
    private Integer id;
    private String content;
    private LocalDateTime createDate;
    private Question question;
    private SiteUser author;

    public Answer toEntity() {
        return new Answer(this.content, this.createDate, this.question, this.author);
    }
}
