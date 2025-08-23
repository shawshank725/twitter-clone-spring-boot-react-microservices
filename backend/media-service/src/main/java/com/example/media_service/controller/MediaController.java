package com.example.media_service.controller;

import com.example.media_service.service.FileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private FileUpload fileUpload;

    @PostMapping("/uploadMedia")
    public String uploadMedia(@RequestParam("media") MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()){
            throw new RuntimeException("Media is empty.");
        }
        else {
            try {
                String imageUrl = fileUpload.uploadFile(multipartFile);
                System.out.println(imageUrl);
                return imageUrl;
            }
            catch (Exception e){
                System.out.println("printing from controller - ");
                System.out.println(e.getMessage());
            }
        }
        return null;
    }

    @PostMapping("/deleteMedia")
    public String deleteMedia(@RequestParam String imageUrl){
        try {
            fileUpload.deleteFile(imageUrl);
            return "success";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



}
