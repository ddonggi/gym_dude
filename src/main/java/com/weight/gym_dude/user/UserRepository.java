package com.weight.gym_dude.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<SiteUser, Long> { // SiteUser의 Pk는 Long이다
    Optional<SiteUser> findByUserName(String username); // username(site id)로 사용자 조회
}
