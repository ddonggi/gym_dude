package com.weight.gym_dude.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * PackageName : com.weight.gym_dude.config
 * FileName : Swagger2Config
 * Author : dglee
 * Create : 2023-09-12 12:22 AM
 * Description : 스웨거2 설정을 위한 클래스
 **/

@Configuration
public class Swagger3Config {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("v1-definition")
                .pathsToMatch("/api/**")
                .build();
    }
    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Board API")
                        .description("게시판 API 명세서입니다.")
                        .version("v0.0.1"));
    }
}
