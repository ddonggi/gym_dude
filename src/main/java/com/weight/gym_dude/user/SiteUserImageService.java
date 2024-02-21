package com.weight.gym_dude.user;

import com.weight.gym_dude.question.Question;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

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
    public void modified(Integer id, SiteUserImage siteUserImage){
//        siteUserImageRepository
        Optional<SiteUserImage> optionalSiteUserImage = siteUserImageRepository.findByAuthorId(id);
        if(optionalSiteUserImage.isPresent()) {
            SiteUserImage targeSiteUserImage = optionalSiteUserImage.get();
            targeSiteUserImage.setSize(siteUserImage.getSize());
            targeSiteUserImage.setOriginalName(siteUserImage.getOriginalName());
            targeSiteUserImage.setCreateDate(siteUserImage.getCreateDate());
            siteUserImageRepository.save(targeSiteUserImage);
        }
    }
}
