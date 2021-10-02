package com.b101.recruit.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.b101.recruit.domain.dto.GalleryDto;
import com.b101.recruit.domain.entity.Gallery;
import com.b101.recruit.domain.repository.GalleryRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GalleryService {

	private S3Service s3Service;
	
	private GalleryRepository galleryRepository;
	
	public void savePost(GalleryDto galleryDto) {
		galleryRepository.save(galleryDto.toEntity());
	}
	
	public List<GalleryDto> getList() {
        List<Gallery> galleryEntityList = galleryRepository.findAll();
        List<GalleryDto> galleryDtoList = new ArrayList<>();

        for (Gallery galleryEntity : galleryEntityList) {
            galleryDtoList.add(convertEntityToDto(galleryEntity));
        }

        return galleryDtoList;
    }

	private GalleryDto convertEntityToDto(Gallery gallery) {
        return GalleryDto.builder()
                .id(gallery.getId())
                .title(gallery.getTitle())
                .filePath(gallery.getFilePath())
                .imgFullPath("https://" + s3Service.CLOUD_FRONT_DOMAIN_NAME + "/" + gallery.getFilePath())
                .build();
    }
    
}