package com.weight.gym_dude.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * PackageName : com.weight.gym_dude.config
 * FileName : RedisConfig
 * Author : dglee
 * Create : 2/25/24 12:41AM
 * Description :
 **/

@RequiredArgsConstructor
@Configuration
@EnableRedisRepositories//Redis 사용 명시
public class RedisConfig {
    /*
    * Bean으로 등록하기 위한 @Configuration과 @EnableRedisRepositories Redis를 사용하기위한 에노테이션을 반드시 붙힌 후
    * properties 파일에 저장된 host와 port를 불러온다.
    * 다음으로 불러온 host 와 port를 RedisConnectionFactory 클래스를 사용하여 연결 한 후
    * 한가지 데이터타입이 아닌 여러가지 데이터타입을 저장하기위해 RedisTemplate을 정의해 준 뒤
    *  cmd창으로 직접 데이터를 조회하기위한 Serializer을 설정해준다.
    * */
    @Value("localhost")
    private String host;
    @Value("6379")
    private int port;

    //properties 에 저장한 host, port 연결
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host,port);
    }

    // serializer 설정으로 redis-cli를 통해 직접 데이터 조회 설정
    @Bean
    public RedisTemplate<String,Object> redisTemplate(){
        RedisTemplate<String,Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        return redisTemplate;
    }
}
