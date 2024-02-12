package com.weight.gym_dude.file;

import com.weight.gym_dude.question.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * PackageName : com.weight.gym_dude.file
 * FileName : FileRepository
 * Author : dglee
 * Create : 2/11/24 9:17 PM
 * Description :
 **/

public interface FileRequestRepository extends JpaRepository<FileRequest,Integer> {
    List<FileRequest> findAllByQuestionId(Integer questionId);
}
