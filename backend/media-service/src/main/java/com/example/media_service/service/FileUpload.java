package com.example.media_service.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUpload {

    String uploadFile(MultipartFile multipartFile) throws IOException;

    void deleteFile(String url) throws IOException;
}
