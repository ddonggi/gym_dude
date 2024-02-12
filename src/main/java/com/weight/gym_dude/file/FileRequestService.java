package com.weight.gym_dude.file;

import com.weight.gym_dude.question.Question;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

/**
 * PackageName : com.weight.gym_dude.file
 * FileName : FileService
 * Author : dglee
 * Create : 2/11/24 9:24 PM
 * Description :
 **/

@Service
@RequiredArgsConstructor
public class FileRequestService {
    private final FileRequestRepository fileRequestRepository;
    private final Logger logger = LoggerFactory.getLogger(FileRequestService.class);

    @Transactional
    public void saveFiles(List<FileRequest> files) {
        if (CollectionUtils.isEmpty(files)) {
            return;
        }
        for(FileRequest fileRequest : files){
           logger.info("get file Id:{}",fileRequest.getId());
           logger.info("get file type:{}",fileRequest.getFileType());
           logger.info("get save Name:{}",fileRequest.getSaveName());
           logger.info("get origin Name:{}",fileRequest.getOriginalName());
           logger.info("get file CreateDate:{}",fileRequest.getCreateDate());
           logger.info("get file Size:{}",fileRequest.getSize());
           logger.info("get questionId:{}",fileRequest.getQuestion().getId());
        }
        fileRequestRepository.saveAll(files);
//        fileMapper.saveAll(files);
    }

/*    public List<FileRequest> getFileList(Question question){

        if(fileRequestRepository.findAllByQuestionId(question.getId()).isEmpty()){
          return null;
        }
        return fileRequestRepository.findAllByQuestionId(question.getId()).get();
    }*/
}
