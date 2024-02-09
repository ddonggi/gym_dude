package com.weight.gym_dude.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 * PackageName : com.weight.gym_dude.config
 * FileName : MultiPartConfig
 * Author : dglee
 * Create : 2/9/24 7:44 PM
 * Description :
 **/

@Configuration
public class MultiPartConfig {

    @Value("${file.multipart.maxUploadSize:10485760}")
    private long maxUploadSize;

    @Value("${file.multipart.maxUploadSizePerFile:10485760}")
    private long maxUploadSizePerFile;

    @Bean
    public MultipartResolver multipartResolver() {
        StandardServletMultipartResolver multipartResolver = new StandardServletMultipartResolver();
        return multipartResolver;
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxRequestSize(DataSize.ofBytes(maxUploadSize));
        factory.setMaxFileSize(DataSize.ofBytes(maxUploadSizePerFile));

        return factory.createMultipartConfig();
    }
}
