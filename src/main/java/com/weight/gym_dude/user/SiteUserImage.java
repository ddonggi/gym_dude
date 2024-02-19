package com.weight.gym_dude.user;

import com.weight.gym_dude.question.Question;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUserImage
 * Author : dglee
 * Create : 2/19/24 4:26 AM
 * Description :
 **/

@Entity
@Getter
@Setter
//@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SiteUserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    private String originalName;    // 원본 파일명

    private String saveName;        // 저장 파일명

    private String fileType;

    private Long size;              // 파일 크기

    private LocalDateTime createDate;

    //하나의 여러 파일을 첨부할 수 있다.
//    @JsonBackReference
    @OneToOne
    private SiteUser author;

    public SiteUserImage(String originalName, String saveName, String fileType, Long size, LocalDateTime createDate, SiteUser siteUser) {
        this.originalName = originalName;
        this.saveName=saveName;
        this.fileType=fileType;
        this.size=size;
        this.createDate=createDate;
        this.author=siteUser;
    }
}
