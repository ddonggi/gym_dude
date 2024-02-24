package com.weight.gym_dude.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : MailForm
 * Author : dglee
 * Create : 2/25/24 2:30 AM
 * Description :
 **/

@Getter
@Setter
public class MailForm {
    @NotEmpty(message = "이메일은 필수 항목 입니다")
    @Email(message = "이메일 양식에 맞지 않습니다")
    private String email;

    private String code;
}
