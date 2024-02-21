package com.weight.gym_dude.follow;

import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.*;

/**
 * PackageName : com.weight.gym_dude.follow
 * FileName : FollowController
 * Author : dglee
 * Create : 2/21/24 7:09 PM
 * Description :
 **/

@RestController
@RequiredArgsConstructor //final이 붙은 속성을 포함하는 생성자를 자동으로 생성하는 역할을 한다
public class FollowController {

    private final FollowService followService;
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(FollowController.class);
    private final FollowRepository followRepository;

    @PostMapping("/follow")
    public ResponseEntity<Object> follow(
            Principal principal,
            @RequestParam(name = "followingId") Integer followingId
    ){
        logger.info("followingId:{}",followingId);
        SiteUser siteUser = userService.getUser(principal.getName());
        return followService.followUser(followingId,siteUser);

//        return ResponseEntity.ok().body();
    }
/*    @PostMapping("/following/list")
    public ResponseEntity<Object> followingList(
            @RequestParam(name = "id") Integer userId
    ) {
        logger.info("my id:{}",userId);
        List<Integer> followList = followService.getFollowingList(userId);
        logger.info("followingList:",followList.toString());
        Map<String,Object> followingMap = new HashMap<>();
        followingMap.put("followingList",followList);
        return ResponseEntity.status(HttpStatus.OK).body(followingMap);
    }*/
}
