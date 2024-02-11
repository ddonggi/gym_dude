package com.weight.gym_dude.file;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

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
           logger.info("getId:{}",fileRequest.getId());
           logger.info("getQuestion:{}",fileRequest.getQuestion());
           logger.info("getCreateDate:{}",fileRequest.getCreateDate());
           logger.info("getSize:{}",fileRequest.getSize());
           logger.info("getquestionId:{}",fileRequest.getQuestion().getId());
        }
        fileRequestRepository.saveAll(files);
//        fileMapper.saveAll(files);
    }

}
