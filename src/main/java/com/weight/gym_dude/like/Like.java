package com.weight.gym_dude.like;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.user.SiteUser;
import jakarta.persistence.*;
import lombok.*;

/**
 * PackageName : com.weight.gym_dude.like
 * FileName : Like
 * Author : dglee
 * Create : 2/20/24 7:07 PM
 * Description :
 **/

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    //여러개의 좋아요가 댓글에 달릴 수 있다.
    @ManyToOne(fetch = FetchType.LAZY)
    private Question question;

    //여러개의 좋아요
    @ManyToOne(fetch = FetchType.LAZY)
    private SiteUser author;

    public Like(Question question, SiteUser author) {
        this.question = question;
        this.author = author;
    }
}
