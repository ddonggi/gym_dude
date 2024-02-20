package com.weight.gym_dude.like;

import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * PackageName : com.weight.gym_dude.like
 * FileName : LikeController
 * Author : dglee
 * Create : 2/20/24 7:17 PM
 * Description :
 **/

//@Slf4j
@RequiredArgsConstructor
@Controller
public class LikeController {
    private final LikeService likeService;
    private final UserService userService;
    Logger logger = LoggerFactory.getLogger(LikeController.class);

    @PostMapping("/like/{questionId}")
    @ResponseBody
    public ResponseEntity<String> addLike(
            Principal principal,
            @PathVariable(name = "questionId") Integer questionId) {

        boolean result = false;
        logger.info("principal:{}",principal);
        if (principal != null) {
            result = likeService.addLike(userService.getUser(principal.getName()), questionId);
        }

        return result ?
                new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
