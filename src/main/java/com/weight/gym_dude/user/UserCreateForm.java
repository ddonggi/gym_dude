package com.weight.gym_dude.user;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.*;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotEmpty;
//import javax.validation.cons
// traints.Size;

/*
 * PackageName : com.weight.gym_dude.user
 * FileName : UserCreateForm
 * Author : dglee
 * Create : 2023-09-12 1:40 PM
 * Description : 회원가입 검증 폼
 * username은 필수항목이고 길이가 3-10 사이 여야 한다는 검증조건을 설정했다.
 * @Size는 폼 유효성 검증시 문자열의 길이가 최소길이(min)와 최대길이(max) 사이에 해당하는지를 검증한다.
 * password1과 password2는 "비밀번호"와 "비밀번호확인"에 대한 속성이다.
 *  로그인 할때는 비밀번호가 한번만 필요하지만 회원가입시에는 입력한 비밀번호가 정확한지 확인하기 위해 2개의 필드가 필요하다.
 * 그리고 email 속성에는 @Email 애너테이션이 적용되었다. @Email은 해당 속성의 값이 이메일형식과 일치하는지를 검증한다.
 * */

@Getter
@Setter
public class UserCreateForm {
    @Size(min = 3, max = 10)
    @NotEmpty(message = "닉네임은 필수 항목 입니다")
    private String username;

    @Size(min = 6, max = 18)
    @NotEmpty(message = "비밀번호는 필수 항목 입니다")
    private String password;

    @NotEmpty(message = "비밀번호 확인은 필수 항목 입니다")
    private String password2;

    @NotEmpty(message = "이메일은 필수 항목 입니다")
    @Email(message = "이메일 양식에 맞지 않습니다")
    private String email;

}
