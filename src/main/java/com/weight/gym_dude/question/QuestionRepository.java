package com.weight.gym_dude.question;

import com.weight.gym_dude.user.SiteUser;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNullApi;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
//    Optional<Question> findByTitle(String title);
//    Optional<Question> findByIdAndTitle(Integer id,String title);
//    Optional<List<Question>> findByTitleLike(String title);

    Optional<Question> findByContent(String content);
    Optional<List<Question>> findByContentLike(String content);

//    Pageable 객체를 입력으로 받아 Page<Question> 타입 객체를 리턴하는 findAll 메서드를 생성
    @NonNull
    Page<Question> findAll(Pageable pageable);

    @NonNull
    Page<Question> findAllByContentContaining(Pageable pageable,String word);

    //User 와 일치하는 Question 데이터를 찾는다. 파라미터에 Pageable 을 같이 넣어주면 Page 객체로 리턴할 수 있다.
    Page<Question> findAllByAuthor(SiteUser siteUser,
                                   Pageable pageable);
}
