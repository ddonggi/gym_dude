package com.weight.gym_dude.user;

import lombok.*;

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
//@ToString
public class SiteUserDTO {
    private Long id;
    private String userName;
    private String password;
    private String email;
    private String category;
    private String introduce;
    private Boolean hasProfile;

    public SiteUser toEntity(){
        return new SiteUser(this.id,this.userName,this.category,this.email,this.introduce,this.hasProfile);
    }
    public SiteUser toSignUpEntity(){
        return new SiteUser(this.userName,this.password,this.email,this.hasProfile);
    }
}
