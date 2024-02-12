package com.weight.gym_dude.question;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.*;
//import javax.validation.constraints.NotEmpty;
//import javax.validation.constraints.Size;

/*
* 화면에서 전달되는 입력 값을 검증하기 위해서는 폼 클래스가 필요하다. 화면의 입력항목 subject, content에 대응하는 QuestionForm 클래스를 다음과 같이 작성하자.
* 폼 클래스는 입력 값의 검증에도 사용하지만 화면에서 전달한 입력 값을 바인딩할 때에도 사용한다.
* */

@Getter
@Setter
public class QuestionForm {
    @NotEmpty(message = "내용을 입력해 주세요") // null 및 "" 을 허용하지 않는다.
    @Size(max=650,min = 5)
    private String content;
}
