package com.weight.gym_dude.like;

import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionController;
import com.weight.gym_dude.question.QuestionRepository;
import com.weight.gym_dude.user.SiteUser;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
    private final Logger logger = LoggerFactory.getLogger(LikeService.class);


    public boolean addLike(SiteUser author,
//                           Long questionId) {
                           Integer questionId) {
        Question question = questionRepository.findById(questionId).orElseThrow();

        //중복 좋아요 방지
        if(isNotAlreadyLike(author, question)) { //좋아요 안눌렸으면
            likeRepository.save(new Like(question, author)); //새로 저장
            return true;
        }
        //누른상태면 찾아서 삭제
        Optional<Like> optionalLike = likeRepository.findByAuthorAndQuestion(author, question);
        if(optionalLike.isPresent()) {
            Like like = optionalLike.get();
            likeRepository.delete(like);
            return false;// 삭제(취소)
        }
        return false;
    }

    //사용자가 이미 좋아요 한 게시물인지 체크
    private boolean isNotAlreadyLike(SiteUser author, Question question) {
        boolean isEmpty = likeRepository.findByAuthorAndQuestion(author, question).isEmpty(); //해당 사용자와 게시물의 라이크가 비었으면 ( 좋아요가 안눌렸으면)
        logger.info("isEmpty:{}",isEmpty);
        return isEmpty;
    }

    //해당 게시물의 좋아요 누른 사람들의 id 목록
/*    public List<Like> likeListByQuestionId(Integer questionId) {
        List<Like> likeListByQuestionId = likeRepository.findAllByQuestionId(questionId);
        return likeListByQuestionId;
    }*/
}
