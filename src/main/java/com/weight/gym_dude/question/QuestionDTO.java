package com.weight.gym_dude.question;

import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.user.SiteUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer id;
    private String content;
    private LocalDateTime createDate;
    private SiteUser author;
    private List<Answer> answerList;
    private List<MultipartFile> fileReuqestList;
    private Boolean isHide;

/*    public QuestionDTO(String title, String content, LocalDateTime createDate) {
        this.title=title;
        this.content=content;
        this.createDate=createDate;
    }*/

    public Question toEntity(){
        return new Question(this.content,this.createDate,this.author,this.isHide);
    }
}
