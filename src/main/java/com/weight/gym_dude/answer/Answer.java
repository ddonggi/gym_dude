package com.weight.gym_dude.answer;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.user.SiteUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
//import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createDate;

    // 답변 추가 (question_id)
    // 여러개의 답변은 하나의 질문에 달릴 수 있다
    @ManyToOne
    //@JoinColumn(name = "question_id") // column name 을 바꿀 것이 아니라면 생략 가능
    private Question question;

    //글쓴이 속성 추가
    // 여러개의 답변은 여러 사용자가 달 수 있다??
    @ManyToOne
    private SiteUser author;

    private LocalDateTime modifiedDate;

    public Answer(String content,LocalDateTime createDate,Question question,SiteUser author){
        this.content = content;
        this.createDate = createDate;
        this.question = question;
        this.author = author;
    }
}
