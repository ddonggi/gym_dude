package com.weight.gym_dude.follow;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.weight.gym_dude.user.SiteUser;
import jakarta.persistence.*;
import lombok.*;

/**
 * PackageName : com.weight.gym_dude.follow
 * FileName : Follow
 * Author : dglee
 * Create : 2/21/24 7:10 PM
 * Description :
 **/

@Getter
@Entity
@Builder
//@ToString
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
//    @JsonBackReference
    @JsonManagedReference
    @JoinColumn(name = "follower_id")
    private SiteUser follower;

    @ManyToOne
//    @JsonBackReference
    @JsonManagedReference
    @JoinColumn(name = "following_id")
    private SiteUser following;

    public Follow(SiteUser follower, SiteUser following) {
        this.follower = follower;
        this.following= following;
    }
}
