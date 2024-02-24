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

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "entity not found")
public class BusinessLogicException extends RuntimeException{

    public BusinessLogicException(String message){
        super(message);
    }

}
