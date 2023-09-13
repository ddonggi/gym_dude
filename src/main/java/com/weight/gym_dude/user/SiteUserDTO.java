package com.weight.gym_dude.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * PackageName : com.weight.gym_dude.user
 * FileName : SiteUserDTO
 * Author : dglee
 * Create : 2023-09-12 8:25 PM
 * Description :
 **/

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteUserDTO {
    private Long id;
    private String userName;
    private String password;
    private String email;

    public SiteUser toEntity(){
        return new SiteUser(this.userName,this.password,this.email);
    }
}
