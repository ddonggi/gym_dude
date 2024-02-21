package com.weight.gym_dude.question;

import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.answer.AnswerDTO;
import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.file.FileRequestDTO;
import com.weight.gym_dude.like.Like;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.SiteUserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer id;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime modifiedDate;
    private SiteUser author;
    private List<Answer> answerList;
    private List<FileRequest> fileList;
    private List<Like> likes;
    private Boolean isHide;

/*    public QuestionDTO(String title, String content, LocalDateTime createDate) {
        this.title=title;
        this.content=content;
        this.createDate=createDate;
    }*/

    public Question toEntity(){
        return new Question(this.content,this.createDate, this.author,this.isHide);
    }
    public static QuestionDTO toDto(final Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .answerList(question.getAnswerList())
                .createDate(question.getCreateDate())
                .modifiedDate(question.getModifiedDate())
                .isHide(question.getIsHide())
                .content(question.getContent())
                .fileList(question.getFileList())
                .author(question.getAuthor())
                .likes(question.getLikes())
                .build();

    }
}
