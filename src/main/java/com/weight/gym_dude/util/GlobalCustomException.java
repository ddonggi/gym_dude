package com.weight.gym_dude.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * PackageName : com.weight.gym_dude.util
 * FileName : GlobalCustomException
 * Author : dglee
 * Create : 2/21/24 7:23 PM
 * Description :
 **/

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "entity not found")
public class GlobalCustomException extends RuntimeException{
    public GlobalCustomException(String message){
        super(message);
    }


}
