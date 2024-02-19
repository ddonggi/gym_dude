package com.weight.gym_dude.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUserImageService
 * Author : dglee
 * Create : 2/19/24 4:28 AM
 * Description :
 **/

@Service
@RequiredArgsConstructor //final이 붙거나 @NotNull 이 붙은 필드의 생성자를 자동 생성해주는 롬복 어노테이션

public class SiteUserImageService {

    private final SiteUserImageRepository siteUserImageRepository;

    public void save(SiteUserImage siteUserImage) {
        siteUserImageRepository.save(siteUserImage);
    }
}
