package com.weight.gym_dude.file;

import com.weight.gym_dude.question.Question;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * PackageName : com.weight.gym_dude.feed
 * FileName : Feed
 * Author : dglee
 * Create : 2023/09/01 12:49 PM
 * Description :
 **/

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class FileRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    private String originalName;    // 원본 파일명

    private String saveName;        // 저장 파일명

    private String fileType;

    private Long size;              // 파일 크기

    private LocalDateTime createDate;

    //하나의 게시글은 여러 파일을 첨부할 수 있다.
    @ManyToOne
    private Question question;

    public FileRequest(String originalName, String saveName, String fileType, Long size, LocalDateTime createDate,Question question) {
        this.originalName = originalName;
        this.saveName=saveName;
        this.fileType=fileType;
        this.size=size;
        this.createDate=createDate;
        this.question=question;
    }
}
