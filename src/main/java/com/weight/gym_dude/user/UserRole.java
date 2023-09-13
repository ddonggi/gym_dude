package com.weight.gym_dude.user;

import lombok.Getter;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : UserRole
 * Author : dglee
 * Create : 2023-09-12 4:57 PM
 * Description : Admin, User 권한을 갖는 Enum Class
 **/

/*
* 스프링 시큐리티는 인증 뿐만 아니라 권한도 관리한다.
* 따라서 인증후에 사용자에게 부여할 권한이 필요하다.
* 다음과 같이 ADMIN, USER 2개의 권한을 갖는 UserRole을 신규로 작성하였다.
* */
@Getter
public enum UserRole {
    /*
    * UserRole은 열거 자료형(enum)으로 작성했다.
    * ADMIN은 "ROLE_ADMIN", USER는 "ROLE_USER" 라는 값을 가지도록 했다.
    * 그리고 상수 자료형이므로 @Setter없이 @Getter만 사용가능하도록 했다.
    * 다른 사람이 작성한 질문이나 답변을 ADMIN 권한을 지닌 사용자는 수정이 가능하도록 만들어야 한다.
    * */
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");

    UserRole(String value) {
        this.value = value;
    }

    private String value;
}
