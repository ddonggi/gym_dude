package com.weight.gym_dude.question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
//    Optional<Question> findByTitle(String title);
//    Optional<Question> findByIdAndTitle(Integer id,String title);
//    Optional<List<Question>> findByTitleLike(String title);

    Optional<Question> findByContent(String content);
    Optional<List<Question>> findByContentLike(String content);
//    Pageable 객체를 입력으로 받아 Page<Question> 타입 객체를 리턴하는 findAll 메서드를 생성
    Page<Question> findAll(Pageable pageable);
}
