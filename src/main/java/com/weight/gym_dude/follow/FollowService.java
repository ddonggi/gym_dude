package com.weight.gym_dude.follow;

import com.weight.gym_dude.like.Like;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserRepository;
import com.weight.gym_dude.util.GlobalCustomException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;


/**
 * PackageName : com.weight.gym_dude.follow
 * FileName : FollowService
 * Author : dglee
 * Create : 2/21/24 7:10 PM
 * Description :
 **/

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(FollowService.class);

    public List<Integer> getFollowingList(Integer userId){
        Optional<List<Follow>> optionalFollowingList = followRepository.findByFollowerId(userId);
        List<Integer> followList = new ArrayList<>();
        if(optionalFollowingList.isPresent()){
            followList = optionalFollowingList.get().stream().map(l->l.getFollowing().getId()).toList();
        }
        return followList;
    }
    public ResponseEntity<Object> followUser(Integer followingId, SiteUser follower) {
        Map<String,Object> map = new HashMap<>();
        if(followingId.equals(follower.getId())){
            throw new GlobalCustomException("self follow is not allowed");
        }

        Optional<Follow> checkFollow = followRepository.findByFollowingIdAndFollowerId(followingId,follower.getId());
        if(checkFollow.isPresent()){ //이미 팔로우한 상황이면
//            throw new GlobalCustomException("user is already follow this user");
            //팔로우 취소
            followRepository.delete(checkFollow.get());
            map.put("message","팔로취소하였습니다.");
            map.put("follow",false);
            return new ResponseEntity<>(map, HttpStatus.OK);
        }

        Optional<SiteUser> optionalFollowing = userRepository.findById(Long.valueOf(followingId));
        SiteUser following = null;
        if(optionalFollowing.isPresent()){
            following = optionalFollowing.get();
        }
        Follow follow = new Follow(follower, following);
        followRepository.save(follow);

        assert following != null;
        map.put("message",following.getUserName()+"님을 팔로우하였습니다.");
        map.put("follow",true);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
