package com.weight.gym_dude.user;

import jakarta.validation.constraints.Email;
import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
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
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@ToString
@Entity
@DynamicInsert //default value 기능을 수행을 위함.해당 컬럼이 null일 경우에, insert에서 제외
public class SiteUser {

    /*
    * SiteUser로 하는 이유는 User 클래스가 이미 스프링 시큐리티에 있기 때문에, 혼선을 막기 위함
    * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true) //유일한 값 저장
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
    public SiteUser(Long id, String userName, String category, String email, String introduce, Boolean hasProfile) {
        this.id=id;
        this.userName=userName;
        this.category=category;
        this.email=email;
        this.introduce=introduce;
        this.hasProfile=hasProfile;
    }
}
