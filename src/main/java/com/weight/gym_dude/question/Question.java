package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-10
 */

import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.user.SiteUser;
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

    //글쓴이 속성 추가
    //Question 입장에서, 여러개의 질문들은 하나의 사용자(=사용자 한 명이 질문을 여러 개 작성)
    @ManyToOne
    private SiteUser author;

    //mappedBy 는 "참조 엔티티의 속성명"을 의미한다 ( Answer 엔티티에서 Question 엔티티를 참조한 속성명)
    //Question 입장에서, 하나의 질문에 많은 답변
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    private List<Answer> answerList;

    public Question(String content, LocalDateTime createDate, SiteUser author) {
        this.content=content;
        this.createDate=createDate;
        this.author=author;
    }
}
