package com.weight.gym_dude.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

/**
 * PackageName : com.weight.gym_dude.config
 * FileName : WebConfig
 * Author : dglee
 * Create : 2/13/24 3:25 PM
 * Description :
 **/

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String resourcePath = "file:///Users/dglee/GYMDUDE_FILES/";//실제 리소스가 존재하는 외부 경로를 지정
    private final String requestPath = "/resource/**";//리소스와 연결될 URL path를 지정
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(requestPath)
//                .setCacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
//                // 캐시를 사용할지 말지를 결정. 운영중이라면 true, 개발중이라면 false가 적절;
                .addResourceLocations(resourcePath);
    }
}
