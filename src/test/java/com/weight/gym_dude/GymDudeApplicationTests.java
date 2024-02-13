package com.weight.gym_dude;

import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.file.FileRequestRepository;
import com.weight.gym_dude.user.SiteUser;
import com.weight.gym_dude.user.UserRepository;
import com.weight.gym_dude.user.UserRole;
import com.weight.gym_dude.util.FileUtils;
import org.junit.jupiter.api.Test;
import com.weight.gym_dude.answer.Answer;
import com.weight.gym_dude.answer.AnswerRepository;
import com.weight.gym_dude.question.Question;
import com.weight.gym_dude.question.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class GymDudeApplicationTests {

    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileRequestRepository fileRequestRepository;
    @Autowired
    private FileUtils fileUtils;

    //데이터 입력(글쓰기)
    @Test
//    @Transactional
    void inputTest() {
        Question question = Question.builder()
                .content("이게 제가 쓰는 내용 입니다.")
                .createDate(LocalDateTime.now()).build();
        this.questionRepository.save(question);
//
//        Question question2 = Question.builder()
//                .title("제목제목5")
//                .content("내용내용5")
//                .createDate(LocalDateTime.now()).build();
//        questionRepository.save(question2);
    }

    //전체 질문 조회 및 비교
    @Test
    void selectAllAndCompareTest(){
        List<Question> questionList = this.questionRepository.findAll();
//        assertEquals(2,questionList.size());

        Question question = questionList.get(0);
        assertEquals("ㅁㅇㄴㄹㅍㅁㅇㄴㄹㅍ",question.getContent());
    }

    //단일 질문 조회 및 확인
    @Test
    void selectAndCompareTest(){
        Optional<Question> oq = this.questionRepository.findById(1);
        if(oq.isPresent()){
            Question question = oq.get();
            System.out.println("question.getContent() = " + question.getContent());
        }
    }
/*
    //제목으로 질문 조회
    @Test
    void findByTitleTest() {
//        Optional은 그 값을 처리하기 위한(null값을 유연하게 처리하기 위한) 클래스로, isPresent() 메서드로 값이 존재하는지 확인할 수 있다.
        Optional<Question> oq = this.questionRepository.findByTitle("ㅁㄴㅇㄹㅁㄴㅇㄹ"); // 동일 제목일 경우??

        if (oq.isPresent()) {
            Question question = oq.get();
            System.out.println("question.getId = " + question.getId());
        }
    }*/

/*

    //단어 포함된 질문 조회
    @Test
    void findByTitleLikeTest(){
        Optional<List<Question>> oq = this.questionRepository.findByTitleLike("%제목%");

        if(oq.isPresent()){
            List<Question> questionList = oq.get();
//            Question question = oq.get();
            for(Question question : questionList) {
                System.out.println("question.getId = " + question.getId());
                System.out.println(question.getTitle());
            }
        }
    }
*/
/*

    //아이디 및 제목으로 질문 조회
    @Test
    void findByIdAndTitleTest(){
        Optional<Question> oq2 = this.questionRepository.findByIdAndTitle(1, "제목제목");
        if (oq2.isPresent()) {
            Question question = oq2.get();
            System.out.println("question.toString() = " + question);
        }
    }
*/
/*
    //글자가 포함되는 질문 찾기
    @Test
    @Transactional // 없다면, 영속성 컨텍스트가 종료되어 버려서, 지연 로딩을 할 수 없어서 오류가 발생할 수 있다
    void findLikeTest(){
        Optional<List<Question>> oqList = this.questionRepository.findByTitleLike("%목%");
        if (oqList.isPresent()) {
            List<Question> questionList = oqList.get();
            System.out.println("questionList.toString() = " + questionList);
            Question q = questionList.get(0);
            System.out.println("q.toString() = " + q.toString());
        }
    }*/

    //글 내용으로 찾기
    @Test
    void findByContentTest(){
        Optional<Question> oq = this.questionRepository.findByContent("ㅁㅇㄴㄹㅍㅁㅇㄴㄹㅍ");
        if(oq.isPresent()){
            Question question = oq.get();
            System.out.println("question = " + question.getContent());
        }
    }

    //글 데이터 수정하기
    @Test
    void updateTest(){
        Optional<Question> oq = this.questionRepository.findById(9);
        //assertTrue()는 괄호 안의 값이 true(참) 인지를 테스트한다. oq.isPresent()가 false를 리턴하면 오류가 발생하고 테스트가 종료된다.
        assertTrue(oq.isPresent());
        Question q = oq.get();
        q.setContent("변경된 내용!");
        q.setCreateDate(LocalDateTime.now());
        this.questionRepository.save(q);
    }

    // 질문 데이터 삭제하기
    @Test
    void deleteTest(){
        //리포지터리의 count 메서드는 테이블 행의 개수를 리턴한다.
        System.out.println("questionRepository.count() = " + questionRepository.count());
//        assertEquals(8,questionRepository.count());
        Optional<Question> oq = this.questionRepository.findById(3);
        //assertTrue()는 괄호 안의 값이 true(참) 인지를 테스트한다. oq.isPresent()가 false를 리턴하면 오류가 발생하고 테스트가 종료된다.
        assertTrue(oq.isPresent());
        Question question = oq.get();
        this.questionRepository.delete(question);
//        assertEquals(8,questionRepository.count());
        System.out.println("questionRepository.count() = " + questionRepository.count());
    }

    //댓글 데이터 생성, 저장
    @Test
    void answerCreateAndSaveTest(){
        Optional<Question> oq = this.questionRepository.findById(7);
        //assertTrue()는 괄호 안의 값이 true(참) 인지를 테스트한다. oq.isPresent()가 false를 리턴하면 오류가 발생하고 테스트가 종료된다.
        assertTrue(oq.isPresent());
        Question question = oq.get();
        String content = "ㅡㅡㅡㅡㅡ지금 질문에 대한 답변은 이러합니다.";
        Answer answer = Answer.builder()
                .content(content)
                .createDate(LocalDateTime.now())
                .question(question)//어떤 질문에 대한 답변인지 알기 위한 질문 객체
                .build();
        this.answerRepository.save(answer);
    }

    //답변 id로 질문 데이터 조회
    @Test
    void findAnswerTest(){
        Optional<Answer> optionalAnswer = this.answerRepository.findById(5);//댓글의 id
        assertTrue(optionalAnswer.isPresent());
        Answer answer = optionalAnswer.get();
        assertEquals(9,answer.getQuestion().getId()); //댓글의 게시글의id 가 9인지 비교
    }

    //질문을 조회한 후 이 질문에 달린 답변 전체를 구하는 테스트 코드
    @Transactional
    @Test
    void findAnswerFromQuestionTest(){
        Optional<Question> optionalQuestion = this.questionRepository.findById(9);
        assertTrue(optionalQuestion.isPresent());
        Question question = optionalQuestion.get();

        // Question 리포지터리가 findById를 호출하여 Question 객체를 조회하고 나면 DB세션이 끊어진다.
        // 그 이후에 실행되는 question.getAnswerList() 메서드는 세션이 종료되어 오류가 발생한다.
        // 답변 데이터 리스트는 q '객체'를 조회할때 가져오지 않고 question.getAnswerList() 메서드를 호출하는 시점에 가져오기 때문이다.
        // 이렇게 필요한 시점에 데이터를 가져오는 방식을 지연(Lazy) 방식이라고 한다
        // 이와 반대로 q 객체를 조회할 때 미리 answer 리스트를 모두 가져오는 방식은 즉시(Eager) 방식이라고 한다.
        // @OneToMany, @ManyToOne 애너테이션의 옵션으로 fetch=FetchType.LAZY 또는 fetch=FetchType.EAGER처럼 가져오는 방식을 설정할 수 있다.
        // 이 문제는 테스트 코드에서만 발생한다. 실제 서버에서 JPA 프로그램들을 실행할 때는 DB 세션이 종료되지 않아 이와 같은 오류가 발생하지 않는다.

        // @Transactional 애너테이션을 사용하면 메서드가 종료될 때 까지 DB 세션이 유지된다.
        List<Answer> answerList = question.getAnswerList();
        assertEquals(2,answerList.size());
        for(Answer answer:answerList){
            System.out.println("answer.getContent() = " + answer.getContent());
        }
    }

    //닉네임 중복 검사
    @Test
    void usernameCheck(){
        String nickname = "ㅁㄴㅇㄹㅁㄴㅇㄹ";
        Optional<SiteUser> optionalSiteUser = userRepository.findByUserName(nickname);
        if(optionalSiteUser.isPresent()){
            System.out.println("nickname = " + optionalSiteUser.get().getUserName());
        }else{
            System.out.println(nickname+"을 찾을 수 없습니다.");
        }
    }

    //로그인
    @Test
    void findByUserEmail(){
        String email="test@test.com";
//        String email="ldg6153@naver.com";
        Optional<SiteUser> optionalSiteUser = userRepository.findByEmail(email);
        if(optionalSiteUser.isPresent()){
            SiteUser siteUser = optionalSiteUser.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            System.out.println("email = " + email);
            if ("test@test.com".equals(email)) {
                System.out.println("admin account");
                authorities.add(new SimpleGrantedAuthority(UserRole.ADMIN.getValue()));
            } else {
                System.out.println("normal user account");
                authorities.add(new SimpleGrantedAuthority(UserRole.USER.getValue()));
            }
            new User(siteUser.getUserName(), siteUser.getPassword(), authorities);
        }else{
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
    }

    @Test
    void fileReadTest(){
        List<FileRequest> files = fileRequestRepository.findAllByQuestionId(90);
        for(FileRequest file:files) {
            Resource resource = fileUtils.readFileAsResource(file);
            System.out.println("resource = " + resource);
        }
    }

}
