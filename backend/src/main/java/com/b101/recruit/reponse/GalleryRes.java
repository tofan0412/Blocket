package com.b101.recruit.reponse;

import com.b101.recruit.domain.entity.Gallery;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("GalleryResponse")
public class GalleryRes {

	private Long id;
	private Long pid;

//	private Certificate certificate;
//	private Activity activity;
//	private FinalEducation finalEducation;

	private String filePath;
	private String title;
	private String sortation; // 구분
	private Long sid;
	private String currentStatus;
	private Object data;

	public static GalleryRes of(Gallery gallery,Object object,String currentStatus) {
		GalleryRes res = new GalleryRes();
		res.setId(gallery.getId());
		res.setPid(gallery.getPid());
		res.setSid(gallery.getSid());
		res.setTitle(gallery.getTitle());
		res.setFilePath(gallery.getFilePath());
		res.setSortation(gallery.getSortation());
		res.setData(object);
		res.setCurrentStatus(currentStatus);
		return res;
	}

}
