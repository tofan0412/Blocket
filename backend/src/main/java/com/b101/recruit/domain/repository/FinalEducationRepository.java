package com.b101.recruit.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.b101.recruit.domain.entity.FinalEducation;
import com.google.common.base.Optional;

//@Repository
public interface FinalEducationRepository extends JpaRepository<FinalEducation, Long>{

	Optional<List<FinalEducation>> findByPersonalinfo_id(Long personal_info_id);
	
}
