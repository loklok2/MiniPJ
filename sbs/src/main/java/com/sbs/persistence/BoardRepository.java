package com.sbs.persistence;


import org.springframework.data.jpa.repository.JpaRepository;
import com.sbs.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Long>{

}
