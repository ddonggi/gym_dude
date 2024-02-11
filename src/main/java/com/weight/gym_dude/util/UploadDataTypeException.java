package com.weight.gym_dude.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * PackageName : com.weight.gym_dude.util
 * FileName : DataTypeException
 * Author : dglee
 * Create : 2/11/24 9:56 PM
 * Description :
 **/

@ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "this file is not image or video type")
public class UploadDataTypeException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    public UploadDataTypeException(String message){
        super(message);
    }
}
