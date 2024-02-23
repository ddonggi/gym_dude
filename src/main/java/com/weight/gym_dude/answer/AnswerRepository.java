package com.weight.gym_dude.answer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    Optional<Answer> findByAuthorIdAndQuestionId(Integer siteUserId, Integer QuestionId);
}
