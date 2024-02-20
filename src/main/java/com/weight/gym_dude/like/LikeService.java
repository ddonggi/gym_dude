package com.weight.gym_dude.like;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionRepository;
import com.weight.gym_dude.user.SiteUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PackageName : com.weight.gym_dude.like
 * FileName : LikeService
 * Author : dglee
 * Create : 2/20/24 7:14 PM
 * Description :
 **/

@Transactional
@RequiredArgsConstructor
@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final QuestionRepository questionRepository;

    public boolean addLike(SiteUser author,
//                           Long questionId) {
                           Integer questionId) {
        Question question = questionRepository.findById(questionId).orElseThrow();

        //중복 좋아요 방지
        if(isNotAlreadyLike(author, question)) {
            likeRepository.save(new Like(question, author));
            return true;
        }

        return false;
    }

    //사용자가 이미 좋아요 한 게시물인지 체크
    private boolean isNotAlreadyLike(SiteUser author, Question question) {
        return likeRepository.findByAuthorAndQuestion(author, question).isEmpty();
    }
}
