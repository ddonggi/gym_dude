package com.weight.gym_dude.question;
/*
 * Created by 이동기 on 2022-11-10
 */

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.like.Like;
import com.weight.gym_dude.user.SiteUser;
import lombok.*;

//import javax.persistence.*;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@ToString
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
    @JsonBackReference
    private SiteUser author;

    //Answer의 ManyToOne 의 양방향 매핑. mappedBy 는 "참조 엔티티의 속성명"을 의미한다
    // ( Answer 엔티티에서 Question 엔티티를 참조한 속성명) => Answer Entity 의 question 정보를 참조
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    @OrderBy("createDate asc")
    @JsonManagedReference
//    @JsonIgnore
//    @ToString.Exclude
    private List<Answer> answerList;

    //전체 조회 화면에서 좋아요 수를 노출하기 위해
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    private List<Like> likes;

    //File 의 ManyToOne 의 양방향 매핑
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    @OrderBy("createDate asc")
    @JsonManagedReference
//    @JsonIgnore
//    @ToString.Exclude
    private List<FileRequest> fileList;

    private LocalDateTime modifiedDate;

    @ColumnDefault("false")
    private Boolean isHide;

    public Question(String content, LocalDateTime createDate, SiteUser author, Boolean isHide) {
        this.content=content;
        this.createDate=createDate;
        this.author=author;
        this.isHide=isHide;
    }
}
