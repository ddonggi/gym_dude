package com.weight.gym_dude.barpath;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * PackageName : com.weight.gym_dude.barpath
 * FileName : BarpathController
 * Author : dglee
 * Create : 2/28/24 5:47 PM
 * Description :
 **/

@Controller
public class BarpathController {
    @GetMapping("/bar-path")
    public String barPath(){

        return "barpath/barpath";
    }
}
