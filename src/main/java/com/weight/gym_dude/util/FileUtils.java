package com.weight.gym_dude.util;

import com.weight.gym_dude.file.FileRequest;
import com.weight.gym_dude.file.FileRequestDTO;
import com.weight.gym_dude.question.Question;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * PackageName : com.weight.gym_dude.util
 * FileName : FileUtils
 * Author : dglee
 * Create : 2/11/24 11:09 PM
 * Description :
 **/

@Component
public class FileUtils {

//    private final String uploadPath = Paths.get("C:", "develop", "upload-files").toString();
    private final String uploadPath = Paths.get("/Users/", "/dglee", "/GYMDUDE_FILES").toString();
    private final Logger logger = LoggerFactory.getLogger(FileUtils.class);
    /**
     * 다중 파일 업로드
     * @param multipartFiles - 파일 객체 List
     * @return DB에 저장할 파일 정보 List
     */
    public List<FileRequest> uploadFiles(final List<MultipartFile> multipartFiles, Question question) {
        List<FileRequest> files = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            if (multipartFile.isEmpty()) {
                continue;
            }
            files.add(uploadFile(multipartFile, question));
        }
        return files;
    }

    /**
     * 단일 파일 업로드
     * @param multipartFile - 파일 객체
     * @return DB에 저장할 파일 정보
     */
    public FileRequest uploadFile(final MultipartFile multipartFile, Question question) {

        if (multipartFile.isEmpty()) {
            logger.info("upload file is empty");
            return null;
        }
        logger.info("upload file is not empty");
        String fileType = multipartFile.getContentType();

        logger.info("content type:{}",fileType);

        // 이미지 파일만 업로드
//        if (!Objects.requireNonNull(multipartFile.getContentType()).contains("image")||!Objects.requireNonNull(multipartFile.getContentType()).contains("video")) {
        if (!fileType.contains("image")&&!fileType.contains("video")) {
            logger.warn("this file is not image or video type!!");
            throw new UploadDataTypeException("this file is not image or video type");
        }
        logger.info("upload path:{}",uploadPath);
        String saveName = generateSaveFilename(multipartFile.getOriginalFilename());
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd")).toString();
        String uploadPath = getUploadPath(today) + File.separator + saveName;
        File uploadFile = new File(uploadPath);
        if(fileType.contains("image")){
            fileType="image";
        }else{
            fileType="video";
        }
        logger.info("modified fileType:{}",fileType);
        try {
            multipartFile.transferTo(uploadFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return FileRequestDTO.builder()
                .originalName(Objects.requireNonNull(multipartFile.getOriginalFilename()).replaceAll(" ",""))
                .createDate(LocalDateTime.now())
                .saveName(saveName)
                .fileType(fileType)
                .question(question)
                .size(multipartFile.getSize())
                .build().toEntity();
    }

    /**
     * 저장 파일명 생성
     * @param filename 원본 파일명
     * @return 디스크에 저장할 파일명
     */
    private String generateSaveFilename(final String filename) {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String extension = StringUtils.getFilenameExtension(filename);
        return uuid + "." + extension;
    }

    /**
     * 업로드 경로 반환
     * @return 업로드 경로
     */
    private String getUploadPath() {
        return makeDirectories(uploadPath);
    }

    /**
     * 업로드 경로 반환
     * @param addPath - 추가 경로
     * @return 업로드 경로
     */
    private String getUploadPath(final String addPath) {
        return makeDirectories(uploadPath + File.separator + addPath);
    }

    /**
     * 업로드 폴더(디렉터리) 생성
     * @param path - 업로드 경로
     * @return 업로드 경로
     */
    private String makeDirectories(final String path) {
        File dir = new File(path);
        if (dir.exists() == false) {
            dir.mkdirs();
        }
        return dir.getPath();
    }

    /**
     * 다운로드할 첨부파일(리소스) 조회 (as Resource)
     * @param file - 첨부파일 상세정보
     * @return 첨부파일(리소스)
     */
    public Resource readFileAsResource(final FileRequest file) {
        String uploadedDate = file.getCreateDate().toLocalDate().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String filename = file.getSaveName();
        Path filePath = Paths.get(uploadPath, uploadedDate, filename);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() == false || resource.isFile() == false) {
                throw new RuntimeException("file not found : " + filePath.toString());
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("file not found : " + filePath.toString());
        }
    }

}
