package com.goeazymart.repository;

import com.goeazymart.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}

