package com.weight.gym_dude.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.follow.Follow;
import com.weight.gym_dude.like.Like;
import com.weight.gym_dude.question.Question;
import jakarta.validation.constraints.Email;
import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.util.List;
//import javax.persistence.*;
//import javax.validation.constraints.Email;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUser
 * Author : dglee
 * Create : 2023-09-12 7:47 PM
 * Description :
 **/

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@ToString
@Entity
@DynamicInsert //default value 기능을 수행을 위함.해당 컬럼이 null일 경우에, insert에서 제외
@OnDelete(action = OnDeleteAction.CASCADE)
public class SiteUser implements Serializable {

    /*
    * SiteUser로 하는 이유는 User 클래스가 이미 스프링 시큐리티에 있기 때문에, 혼선을 막기 위함
    * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String userName;

    private String password;

    @Column(unique = true)
    @Email
    private String email;

    private String category;

    private String introduce;

    @Column(nullable = false)
    @ColumnDefault("false")
    private Boolean hasProfile;

    //내가 팔로잉 하는 사람
    @OneToMany(mappedBy = "following", cascade = CascadeType.REMOVE)
//    @JsonManagedReference
    @JsonBackReference
    private List<Follow> followerList;

    //나를 팔로우 하는 사람
    @OneToMany(mappedBy = "follower", cascade = CascadeType.REMOVE)
//    @JsonManagedReference
    @JsonBackReference
    private List<Follow> followingList;

    //내가 팔로잉 하는 사람
    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
//    @JsonManagedReference
    @JsonBackReference
    private List<Like> likeList;

    @OneToOne(mappedBy = "author", cascade = CascadeType.REMOVE)
    @JsonBackReference
    private SiteUserImage siteUserImage;

    //Answer의 ManyToOne 의 양방향 매핑. mappedBy 는 "참조 엔티티의 속성명"을 의미한다
    // ( Answer 엔티티에서 Question 엔티티를 참조한 속성명) => Answer Entity 의 question 정보를 참조
    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
    @OrderBy("createDate asc")
//    @JsonManagedReference
    @JsonIgnore
//    @ToString.Exclude
    private List<Answer> answerList;


    //Answer의 ManyToOne 의 양방향 매핑. mappedBy 는 "참조 엔티티의 속성명"을 의미한다
    // ( Answer 엔티티에서 Question 엔티티를 참조한 속성명) => Answer Entity 의 question 정보를 참조
    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
    @OrderBy("createDate asc")
//    @JsonManagedReference
    @JsonIgnore
//    @ToString.Exclude
    private List<Question> questionList;

    //회원가입
    public SiteUser(String userName, String password, String email) {
        this.userName=userName;
        this.password=password;
        this.email=email;
    }
    public SiteUser(String userName, String password, String email,Boolean hasProfile) {
        this.userName=userName;
        this.password=password;
        this.email=email;
        this.hasProfile=hasProfile;
    }
    //정보 조회용
    public SiteUser(Integer id, String userName, String category, String email, String introduce, Boolean hasProfile) {
        this.id=id;
        this.userName=userName;
        this.category=category;
        this.email=email;
        this.introduce=introduce;
        this.hasProfile=hasProfile;
    }
}
