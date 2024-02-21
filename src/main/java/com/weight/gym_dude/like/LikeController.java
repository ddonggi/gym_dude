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
import java.util.HashMap;

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
    private final LikeRepository likeRepository;

    @PostMapping("/like/{questionId}")
    @ResponseBody
    public ResponseEntity<Object> addLike(
            Principal principal,
            @PathVariable(name = "questionId") Integer questionId) {

        boolean result = false;
        logger.info("principal:{}",principal);
        if (principal != null) {
            result = likeService.addLike(userService.getUser(principal.getName()), questionId);
        }
        int count = likeRepository.countByQuestionId(questionId);
        HashMap<String,Object> likeMap = new HashMap<>();
        likeMap.put("like",result);
        likeMap.put("likeCount",count);
        return result ?
                ResponseEntity.status(HttpStatus.OK).body(likeMap)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(likeMap);
    }
}
