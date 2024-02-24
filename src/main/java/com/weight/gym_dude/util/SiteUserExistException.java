package com.weight.gym_dude.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * PackageName : com.weight.gym_dude.util
 * FileName : BusinessLogicException
 * Author : dglee
 * Create : 2/24/24 4:55 PM
 * Description :
 **/

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "이미 가입된 메일 입니다")
public class SiteUserExistException extends RuntimeException{
    public SiteUserExistException(String message){
        super(message);
    }

}
