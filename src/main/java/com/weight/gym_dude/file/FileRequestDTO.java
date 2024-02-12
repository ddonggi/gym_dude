package com.weight.gym_dude.file;

import com.weight.gym_dude.question.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * PackageName : com.weight.gym_dude.file
 * FileName : FileDTO
 * Author : dglee
 * Create : 2/11/24 10:56 PM
 * Description :
 **/

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileRequestDTO {
    private String originalName;    // 원본 파일명

    private String saveName;        // 저장 파일명

    private Long size;              // 파일 크기

    private LocalDateTime createDate;
    private Question question;
    private String fileType;


    public FileRequest toEntity(){
        return new FileRequest(
                this.originalName,
                this.saveName,
                this.fileType,
                this.size,
                this.createDate,
                this.question);
    }

}
