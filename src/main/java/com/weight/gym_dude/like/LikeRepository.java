package com.weight.gym_dude.like;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.user.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
public interface LikeRepository extends JpaRepository<Like, Integer> {
    //이 메서드는 SiteUser와 question를 인자로 받아서 해당 레시피 게시물에, 해당 회원이 좋아요를 등록한 적이 있는지 체크하는 용도
    Optional<Like> findByAuthorAndQuestion(SiteUser author, Question question);

    Integer countByQuestionId(Integer QuestionId);

}
