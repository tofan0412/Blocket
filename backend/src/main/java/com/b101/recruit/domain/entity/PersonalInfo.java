package com.b101.recruit.domain.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 신상정보 모델 정의.
 */

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PersonalInfo extends BaseEntity {
	
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user; 			    // 회원 ID(FK)
	
	private Date dateBirth; 		// 생년월일
	private String address; 		// 주소
	private String englishName; 	// 영문이름
	private String gender; 			// 성별
	private String repProfile; 		// 대표 프로필
	private String militaryService; // 병역사항
	private String veteransAffairs; // 보훈사항
	private String finalEducation;  // 최종학력
	private String disabled; 		// 장애여부
	
	/**/
	private String transcript;      // 성적증명서
	private String intExtAct; 		// 대/내외 활동
	private String prosCons; 		// 자신의 장/단점
	private String selfIntro; 		// 간단한 자기소개
	private String jobExperience; 	// 지원 직무와 관련된 경험
	
}
