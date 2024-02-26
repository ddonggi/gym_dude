package com.weight.gym_dude.etc;
/*
 * Created by 이동기 on 2023-09-12
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

//    @RequestMapping("/")
//    public String root() {
//        return "index";
//    }

    @GetMapping("/terms")
    public String terms(){

        return "terms";
    }

    @GetMapping("/policy")
    public String policy(){

        return "policy";
    }
}
