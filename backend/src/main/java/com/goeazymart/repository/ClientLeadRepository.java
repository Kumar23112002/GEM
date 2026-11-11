package com.goeazymart.repository;

import com.goeazymart.model.ClientLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientLeadRepository extends JpaRepository<ClientLead, Long> {
    List<ClientLead> findAllByOrderByIdDesc();
}

