package com.goeazymart.repository;

import com.goeazymart.model.Rfq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RfqRepository extends JpaRepository<Rfq, String> {
}

