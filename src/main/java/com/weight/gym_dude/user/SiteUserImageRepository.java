package com.weight.gym_dude.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteUserImageRepository extends JpaRepository<SiteUserImage, Long> {
    Optional<SiteUserImage> findByAuthorId(Long id);
}
