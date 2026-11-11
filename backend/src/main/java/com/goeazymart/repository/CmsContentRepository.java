package com.goeazymart.repository;

import com.goeazymart.model.CmsContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CmsContentRepository extends JpaRepository<CmsContent, String> {
}

