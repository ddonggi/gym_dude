package com.weight.gym_dude.follow;

import com.weight.gym_dude.file.FileRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * PackageName : com.weight.gym_dude.follow
 * FileName : FollowRepository
 * Author : dglee
 * Create : 2/21/24 7:09 PM
 * Description :
 **/

public interface FollowRepository extends JpaRepository<Follow,Integer> {
    Optional<Follow> findByFollowingIdAndFollowerId(Integer followingId, Integer followerId);
    Optional<List<Follow>> findByFollowingId(Integer followingId);
    Optional<List<Follow>> findByFollowerId(Integer followerId);
}
