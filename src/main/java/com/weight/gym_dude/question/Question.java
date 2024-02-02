package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-10
 */

import com.weight.gym_dude.answer.Answer;
import lombok.*;

//import javax.persistence.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createDate;

    //mappedBy 는 "참조 엔티티의 속성명"을 의미한다 ( Answer 엔티티에서 Question 엔티티를 참조한 속성명)
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    private List<Answer> answerList;

    public Question(String content, LocalDateTime createDate) {
        this.content=content;
        this.createDate=createDate;
    }
}
